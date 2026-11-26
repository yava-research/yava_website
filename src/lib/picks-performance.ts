// Daily performance of the publication picks against a benchmark index (the
// S&P 500 by default), for the charts on /publications/portfolio.
//
// Three series, all price returns in percent:
//   picks             unrealized gain of the picks initiated so far over their
//                     cost basis: the "Gain since initiation" figure, day by day.
//                     Blank before the first initiation.
//   benchmark         the index since the chart start, based at the last close
//                     before it.
//   benchmarkMatched  each pick's cost put into the index at the same close:
//                     the "vs index" comparison, day by day.

import type { PickHolding } from "@/data/publication-picks";
import { getDailyCloses, getHistoricalReturns, type Position } from "@/lib/portfolio";

/** First day of the chart. The S&P 500 is based at the last close before it. */
export const PICKS_CHART_START = "2026-08-01";

/** Yahoo Finance's symbol for the S&P 500 (the index other terminals quote as ^SPX). */
export const PICKS_BENCHMARK = "^GSPC";

export type PicksPerformancePoint = {
  /** Trading day, YYYY-MM-DD. */
  date: string;
  /** Null before the first initiation or when a pick can't be priced that day. */
  picks: number | null;
  benchmark: number;
  /** Null before the first initiation. */
  benchmarkMatched: number | null;
};

export type PickInitiation = {
  /** Session whose close set the cost: the initiation date, or the next trading day. */
  date: string;
  tickers: string[];
  publications: { slug: string; title: string; href: string }[];
};

export type PicksPerformance = {
  /** Requested chart start, YYYY-MM-DD. */
  start: string;
  /** Yahoo Finance symbol the benchmark series was built from. */
  symbol: string;
  /** Date of the benchmark base close (0%). */
  baseDate: string;
  points: PicksPerformancePoint[];
  /** Initiation days inside the chart, oldest first. */
  initiations: PickInitiation[];
};

function earlierDate(date: string, days: number): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) - days * 86_400_000).toISOString().slice(0, 10);
}

function round(value: number): number {
  return Number(value.toFixed(2));
}

/** Null when Yahoo Finance has no closes for the benchmark. */
export async function getPicksPerformance(
  positions: Position<PickHolding>[],
  start = PICKS_CHART_START,
  symbol: string = PICKS_BENCHMARK,
): Promise<PicksPerformance | null> {
  const earliest = positions.reduce(
    (min, position) => (position.purchaseDate < min ? position.purchaseDate : min),
    start,
  );
  const bars = await getDailyCloses(symbol, earlierDate(earliest, 10));
  const base = bars && [...bars].reverse().find((bar) => bar.date < start);
  if (!bars || !base) return null;

  const chartBars = bars.filter((bar) => bar.date >= base.date);
  const dates = chartBars.map((bar) => bar.date);

  // A pick enters at the first session on or after its initiation date. Picks
  // dated after the latest close haven't entered yet.
  const entries = positions.flatMap((position) => {
    const entry = bars.find((bar) => bar.date >= position.purchaseDate);
    return entry ? [{ position, entry }] : [];
  });
  const firstEntry = entries.reduce<string | null>(
    (min, { entry }) => (min == null || entry.date < min ? entry.date : min),
    null,
  );

  const picksReturns = await getHistoricalReturns(dates, positions);

  const points = chartBars.map((bar, index): PicksPerformancePoint => {
    let cost = 0;
    let gain = 0;
    for (const { position, entry } of entries) {
      if (entry.date > bar.date || !position.valuation) continue;
      cost += position.valuation.costBasis;
      gain += position.valuation.costBasis * (bar.close / entry.close - 1);
    }
    const picks = picksReturns[index];
    return {
      date: bar.date,
      picks: firstEntry != null && bar.date >= firstEntry && picks != null ? round(picks) : null,
      benchmark: round((bar.close / base.close - 1) * 100),
      benchmarkMatched: cost > 0 ? round((gain / cost) * 100) : null,
    };
  });

  const byDate = new Map<string, PickInitiation>();
  for (const { position, entry } of entries) {
    if (entry.date < base.date) continue;
    const initiation = byDate.get(entry.date) ?? { date: entry.date, tickers: [], publications: [] };
    initiation.tickers.push(position.ticker);
    if (
      position.pick.publication &&
      !initiation.publications.some((item) => item.slug === position.pick.publication)
    ) {
      initiation.publications.push({
        slug: position.pick.publication,
        title: position.analysis.title,
        href: position.analysis.href,
      });
    }
    byDate.set(entry.date, initiation);
  }

  return {
    start,
    symbol,
    baseDate: base.date,
    points,
    initiations: [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date)),
  };
}
