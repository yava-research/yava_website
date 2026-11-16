// Daily index returns for the portfolio chart.
//
// The live series is recomputed from Yahoo Finance daily closes through the
// latest available trading day (including a session still in progress), so the
// chart keeps up every trading day. Completed months stored in
// src/data/performance.ts are no longer used when the fetch succeeds; those
// rows remain as the offline fallback. Price returns exclude dividends. The
// Russell benchmark adds 200 bps per year, accrued per calendar day.

import { cacheLife } from "next/cache";
import {
  benchmarkSpreadBps,
  performance,
  type PerformancePoint,
} from "@/data/performance";

const INDEXES = [
  { key: "sp500", symbol: "^GSPC" },
  { key: "djia", symbol: "^DJI" },
  { key: "nasdaq100", symbol: "^NDX" },
  { key: "russell", symbol: "^RUA" },
] as const;

type IndexKey = (typeof INDEXES)[number]["key"];
type Bar = { date: string; close: number };

const BASE_DATE = "2025-12-31";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const ANNUAL_SPREAD = benchmarkSpreadBps / 10_000;

function daysBetween(from: string, to: string): number {
  return (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000;
}

function roundPercent(fraction: number): number {
  return Number((fraction * 100).toFixed(2));
}

/** "2026-11-10" → "Nov 10". */
function dayLabel(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  void year;
  return `${MONTHS[month - 1]} ${day}`;
}

/** Close on or before `date`; the series base. */
function baseBar(bars: Bar[]): Bar | undefined {
  return [...bars].reverse().find((bar) => bar.date <= BASE_DATE);
}

/** Daily cumulative price returns from the 2025-12-31 base close. */
export function buildDailySeries(
  closes: Record<IndexKey, Bar[]>,
): PerformancePoint[] {
  const base = {
    sp500: baseBar(closes.sp500),
    djia: baseBar(closes.djia),
    nasdaq100: baseBar(closes.nasdaq100),
    russell: baseBar(closes.russell),
  };
  if (!base.sp500 || !base.djia || !base.nasdaq100 || !base.russell) return performance;

  // Trade only on days all four indexes printed; their calendars all but never
  // disagree, and one missing print would shift every later point.
  const dates = closes.sp500.map((bar) => bar.date).filter((date) => date >= BASE_DATE);
  const djiaDates = new Set(closes.djia.map((bar) => bar.date));
  const nasdaqDates = new Set(closes.nasdaq100.map((bar) => bar.date));
  const russellDates = new Set(closes.russell.map((bar) => bar.date));
  const sp500ByDate = new Map(closes.sp500.map((bar) => [bar.date, bar.close]));
  const djiaByDate = new Map(closes.djia.map((bar) => [bar.date, bar.close]));
  const nasdaqByDate = new Map(closes.nasdaq100.map((bar) => [bar.date, bar.close]));
  const russellByDate = new Map(closes.russell.map((bar) => [bar.date, bar.close]));

  const points: PerformancePoint[] = [];
  for (const date of dates) {
    if (!djiaDates.has(date) || !nasdaqDates.has(date) || !russellDates.has(date)) continue;
    const sp500 = sp500ByDate.get(date);
    const djia = djiaByDate.get(date);
    const nasdaq100 = nasdaqByDate.get(date);
    const russell = russellByDate.get(date);
    if (sp500 == null || djia == null || nasdaq100 == null || russell == null) continue;
    const elapsed = daysBetween(BASE_DATE, date);
    const russellPrice = russell / base.russell.close - 1;
    const russellWithSpread = (1 + russellPrice) * (1 + ANNUAL_SPREAD) ** (elapsed / 365.25) - 1;
    points.push({
      date,
      label: dayLabel(date),
      fund: null,
      sp500: roundPercent(sp500 / base.sp500.close - 1),
      djia: roundPercent(djia / base.djia.close - 1),
      nasdaq100: roundPercent(nasdaq100 / base.nasdaq100.close - 1),
      russell3000: roundPercent(russellWithSpread),
    });
  }
  return points.length ? points : performance;
}

async function fetchIndexBars(symbol: string): Promise<Bar[] | null> {
  "use cache";
  try {
    const period1 = Math.floor(Date.parse("2025-12-01T00:00:00Z") / 1000) - 86_400;
    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}` +
      `?interval=1d&period1=${period1}&period2=9999999999`;
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) throw new Error(`${symbol}: HTTP ${res.status}`);
    const result = (await res.json())?.chart?.result?.[0];
    const meta = result?.meta ?? {};
    const timestamps: number[] = result?.timestamp ?? [];
    const closes: (number | null)[] = result?.indicators?.quote?.[0]?.close ?? [];
    const localDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: meta.exchangeTimezoneName ?? "America/New_York",
    });
    const bars = timestamps.flatMap((time, index) => {
      const close = closes[index];
      return typeof close === "number" ? [{ date: localDate.format(time * 1000), close }] : [];
    });
    if (!bars.length) throw new Error(`${symbol}: no bars`);
    cacheLife("hours");
    return bars;
  } catch (error) {
    console.error(`[benchmarks] no closes for ${symbol}:`, error);
    cacheLife("minutes");
    return null;
  }
}

export async function getPerformance(): Promise<PerformancePoint[]> {
  const bars = await Promise.all(INDEXES.map((index) => fetchIndexBars(index.symbol)));
  if (bars.some((series) => !series)) return performance;

  const closes = Object.fromEntries(
    INDEXES.map((index, position) => [index.key, bars[position] ?? []]),
  ) as Record<IndexKey, Bar[]>;
  return buildDailySeries(closes);
}
