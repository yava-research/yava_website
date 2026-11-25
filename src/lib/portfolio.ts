// Values the holdings in src/data/holdings.ts from Yahoo Finance daily prices.
//
// For each position: cost basis = shares × close on the purchase date, market
// value = shares × latest price. Stocks quoted in another currency are
// converted to USD at the purchase-date and latest exchange rates, so gains
// include currency moves. Portfolio gain is total unrealized gain over total
// cost basis. Prices are split-adjusted and exclude dividends, matching
// the price returns in performance.ts.

import { cacheLife } from "next/cache";
import { holdings, type Holding } from "@/data/holdings";

type Quote = {
  /** ISO code of the currency the stock trades in, e.g. "JPY". */
  currency: string;
  /** Close on the purchase date (or the next trading day), in `currency`. */
  purchasePriceLocal: number;
  /** Latest regular-session price, in `currency`. */
  priceLocal: number;
  /** Close on the purchase date, converted to USD at that day's rate. */
  purchasePrice: number;
  /** Latest price, converted to USD at the latest rate. */
  price: number;
  /** When `price` was set, in epoch seconds. */
  priceTime: number;
};

export type Valuation = Quote & {
  costBasis: number;
  marketValue: number;
  /** Unrealized gain in dollars. */
  gain: number;
  /** Unrealized gain in percent of cost basis. */
  gainPercent: number;
  /** Share of priced market value, in percent. */
  weight: number;
};

export type Position<T extends Holding = Holding> = T & {
  /** Null when Yahoo Finance had no price for the ticker. */
  valuation: Valuation | null;
};

export type Portfolio<T extends Holding = Holding> = {
  positions: Position<T>[];
  totalCost: number;
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
  /** Oldest price time across priced positions, in epoch seconds. */
  asOf: number | null;
  /** Positions left out of the totals because no price was available. */
  unpricedCount: number;
};

const MAX_PRICE_AGE_DAYS = 7;

function daysBetween(from: string, to: string): number {
  return (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000;
}

function earlierDate(date: string, days: number): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) - days * 86_400_000).toISOString().slice(0, 10);
}

function lastClose(bars: { date: string; close: number }[], date: string) {
  const bar = [...bars].reverse().find((item) => item.date <= date);
  return bar && daysBetween(bar.date, date) <= MAX_PRICE_AGE_DAYS ? bar : undefined;
}

type DailySeries = {
  currency: string;
  price: number;
  priceTime: number;
  /** Daily closes, dated in the exchange's local time zone. */
  bars: { date: string; close: number }[];
};

/** Daily closes for `symbol` from `fromDate` (YYYY-MM-DD) to today. */
async function fetchDailySeries(symbol: string, fromDate: string): Promise<DailySeries> {
  const from = Date.parse(`${fromDate}T00:00:00Z`);
  if (Number.isNaN(from)) throw new Error(`invalid date "${fromDate}"`);
  // Start a day early: exchanges east of UTC (Tokyo, Sydney) open before UTC
  // midnight. Bars are matched on their local date below.
  const period1 = Math.floor(from / 1000) - 86_400;

  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}` +
    `?interval=1d&period1=${period1}&period2=9999999999`;
  // Yahoo rate-limits requests that arrive without a browser user agent.
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${symbol}: HTTP ${res.status}`);

  const result = (await res.json())?.chart?.result?.[0];
  const meta = result?.meta ?? {};
  const timestamps: number[] = result?.timestamp ?? [];
  const closes: (number | null)[] = result?.indicators?.quote?.[0]?.close ?? [];
  const localDate = new Intl.DateTimeFormat("en-CA", { timeZone: meta.exchangeTimezoneName ?? "UTC" });
  const bars = timestamps.flatMap((time, index) => {
    const close = closes[index];
    return typeof close === "number" ? [{ date: localDate.format(time * 1000), close }] : [];
  });
  if (typeof meta.regularMarketPrice !== "number" || typeof meta.currency !== "string") {
    throw new Error(`${symbol}: no price data`);
  }
  return {
    currency: meta.currency,
    price: meta.regularMarketPrice,
    priceTime: typeof meta.regularMarketTime === "number" ? meta.regularMarketTime : 0,
    bars,
  };
}

// Some exchanges quote in a minor unit: London in pence, Johannesburg in
// cents, Tel Aviv in agorot.
const minorUnits: Record<string, { code: string; divisor: number }> = {
  GBp: { code: "GBP", divisor: 100 },
  GBX: { code: "GBP", divisor: 100 },
  ZAc: { code: "ZAR", divisor: 100 },
  ILA: { code: "ILS", divisor: 100 },
};

async function fetchQuote(ticker: string, purchaseDate: string): Promise<Quote> {
  const stock = await getHistoricalSeries(ticker, purchaseDate);
  if (!stock) throw new Error(`${ticker}: no historical prices`);
  const purchaseBar = stock.bars.find((bar) => bar.date >= purchaseDate);
  if (!purchaseBar || daysBetween(purchaseDate, purchaseBar.date) > MAX_PRICE_AGE_DAYS) throw new Error(`${ticker}: no close on or after ${purchaseDate}`);

  if (!stock.priceTime || Date.now() / 1000 - stock.priceTime > MAX_PRICE_AGE_DAYS * 86_400) {
    throw new Error(`${ticker}: stale current price`);
  }

  const { code: currency, divisor } = minorUnits[stock.currency] ?? {
    code: stock.currency.toUpperCase(),
    divisor: 1,
  };
  const purchasePriceLocal = purchaseBar.close / divisor;
  const priceLocal = stock.price / divisor;

  let fxAtPurchase = 1;
  let fxNow = 1;
  if (currency !== "USD") {
    // USD per one unit of the local currency, e.g. JPYUSD=X ≈ 0.0064.
    const fx = await getHistoricalSeries(`${currency}USD=X`, earlierDate(purchaseBar.date, 10));
    if (!fx) throw new Error(`${currency}USD: no exchange rates`);
    const fxBar = lastClose(fx.bars, purchaseBar.date);
    if (!fxBar) throw new Error(`${currency}USD: no rate on or after ${purchaseBar.date}`);
    fxAtPurchase = fxBar.close;
    // The latest close has full precision; meta.regularMarketPrice is rounded
    // to 4 decimals, which is a ~1% error for JPY.
    const today = new Date().toISOString().slice(0, 10);
    const latestFx = lastClose(fx.bars, today);
    if (!latestFx) throw new Error(`${currency}USD: stale exchange rate`);
    fxNow = latestFx.close;
  }

  return {
    currency,
    purchasePriceLocal,
    priceLocal,
    purchasePrice: purchasePriceLocal * fxAtPurchase,
    price: priceLocal * fxNow,
    priceTime: stock.priceTime,
  };
}

async function getQuote(ticker: string, purchaseDate: string): Promise<Quote | null> {
  "use cache";
  let quote: Quote | null = null;
  try {
    quote = await fetchQuote(ticker, purchaseDate);
  } catch (error) {
    console.error(`[portfolio] no quote for ${ticker}:`, error);
  }
  // Refresh prices hourly; retry a failed lookup sooner.
  if (quote) cacheLife("hours");
  else cacheLife("minutes");
  return quote;
}

/** Values `list` (the fund's holdings by default) at the latest prices. */
export async function getPortfolio<T extends Holding = Holding>(
  list: T[] = holdings as T[],
): Promise<Portfolio<T>> {
  const quotes = await Promise.all(list.map((h) => getQuote(h.ticker, h.purchaseDate)));

  let totalCost = 0;
  let totalValue = 0;
  let asOf: number | null = null;
  for (const [index, quote] of quotes.entries()) {
    if (!quote) continue;
    totalCost += list[index].shares * quote.purchasePrice;
    totalValue += list[index].shares * quote.price;
    asOf = Math.min(asOf ?? quote.priceTime, quote.priceTime);
  }

  const positions = list.map((holding, index): Position<T> => {
    const quote = quotes[index];
    if (!quote) return { ...holding, valuation: null };
    const costBasis = holding.shares * quote.purchasePrice;
    const marketValue = holding.shares * quote.price;
    return {
      ...holding,
      valuation: {
        ...quote,
        costBasis,
        marketValue,
        gain: marketValue - costBasis,
        gainPercent: costBasis > 0 ? ((marketValue - costBasis) / costBasis) * 100 : 0,
        weight: totalValue > 0 ? (marketValue / totalValue) * 100 : 0,
      },
    };
  });

  const totalGain = totalValue - totalCost;
  return {
    positions,
    totalCost,
    totalValue,
    totalGain,
    totalGainPercent: totalCost > 0 ? (totalGain / totalCost) * 100 : 0,
    asOf: asOf || null,
    unpricedCount: quotes.filter((quote) => !quote).length,
  };
}

/**
 * Price return of `symbol` (e.g. "^GSPC") from the close on `fromDate` to the
 * latest price, in percent. Null when Yahoo Finance has no data.
 */
export async function getPriceReturn(symbol: string, fromDate: string): Promise<number | null> {
  const quote = await getQuote(symbol, fromDate);
  return quote && quote.purchasePrice > 0 ? (quote.price / quote.purchasePrice - 1) * 100 : null;
}

/** Epoch seconds → "October 28, 2026", in exchange time. */
export function formatPriceDate(epochSeconds: number): string {
  return new Date(epochSeconds * 1000).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  });
}

/** Historical unrealized return of `list` (the fund's holdings by default) at each date.
 * Positions enter at their purchase date; unavailable prices leave the point blank.
 */
export async function getHistoricalReturns(
  dates: string[],
  list: Holding[] = holdings,
): Promise<(number | null)[]> {
  const histories = await Promise.all(list.map(async (holding) => {
    try {
      const stock = await getHistoricalSeries(holding.ticker, holding.purchaseDate);
      if (!stock) return null;
      const purchase = stock.bars.find((bar) => bar.date >= holding.purchaseDate);
      if (!purchase || daysBetween(holding.purchaseDate, purchase.date) > MAX_PRICE_AGE_DAYS) return null;
      const unit = minorUnits[stock.currency] ?? { code: stock.currency.toUpperCase(), divisor: 1 };
      const fx = unit.code === "USD" ? null : await getHistoricalSeries(`${unit.code}USD=X`, earlierDate(holding.purchaseDate, 10));
      if (unit.code !== "USD" && !fx) return null;
      const purchaseFx = fx ? lastClose(fx.bars, purchase.date)?.close : 1;
      if (!purchaseFx) return null;
      return { stock, fx, purchase, purchaseFx, divisor: unit.divisor };
    } catch {
      return null;
    }
  }));
  return dates.map((date) => {
    let cost = 0;
    let value = 0;
    for (const [index, holding] of list.entries()) {
      if (holding.purchaseDate > date) continue;
      const history = histories[index];
      if (!history) return null;
      if (history.purchase.date > date) continue;
      const close = lastClose(history.stock.bars, date);
      const fx = history.fx ? lastClose(history.fx.bars, date)?.close : 1;
      if (!close || !fx) return null;
      cost += holding.shares * history.purchase.close / history.divisor * history.purchaseFx;
      value += holding.shares * close.close / history.divisor * fx;
    }
    return cost > 0 ? (value / cost - 1) * 100 : 0;
  });
}

/**
 * Daily closes for `symbol` (e.g. "^GSPC") from `fromDate` (YYYY-MM-DD) to
 * the latest session, oldest first, dated in exchange time. Null when Yahoo
 * Finance has no data.
 */
export async function getDailyCloses(
  symbol: string,
  fromDate: string,
): Promise<{ date: string; close: number }[] | null> {
  const series = await getHistoricalSeries(symbol, fromDate);
  return series?.bars.length ? series.bars : null;
}

async function getHistoricalSeries(symbol: string, fromDate: string): Promise<DailySeries | null> {
  "use cache";
  try {
    const series = await fetchDailySeries(symbol, fromDate);
    cacheLife("hours");
    return series;
  } catch (error) {
    console.error(`[portfolio] no historical data for ${symbol}:`, error);
    cacheLife("minutes");
    return null;
  }
}
