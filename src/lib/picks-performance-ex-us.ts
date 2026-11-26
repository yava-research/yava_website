// Daily performance of the ex-US picks against the FTSE Global All Cap ex US
// Index, for the second chart on /publications/portfolio. Same series and
// method as src/lib/picks-performance.ts; only the benchmark differs.
//
// Yahoo Finance quotes the index itself as ACXUSS.FGI but serves only the live
// price, no daily history. When that history is missing, the benchmark falls
// back to VXUS, the Vanguard Total International Stock ETF, which tracks the
// same index. Both are price returns.

import type { PickHolding } from "@/data/publication-picks";
import { getDailyCloses, type Position } from "@/lib/portfolio";
import { getPicksPerformance, PICKS_CHART_START, type PicksPerformance } from "@/lib/picks-performance";

export { PICKS_CHART_START as EX_US_PICKS_CHART_START };

/** Yahoo Finance's symbol for the FTSE Global All Cap ex US Index. */
export const EX_US_INDEX = "ACXUSS.FGI";

/** Vanguard Total International Stock ETF, which tracks EX_US_INDEX. */
export const EX_US_INDEX_PROXY = "VXUS";

function earlierDate(date: string, days: number): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) - days * 86_400_000).toISOString().slice(0, 10);
}

/**
 * Symbol to price the ex-US benchmark with: the index when Yahoo Finance has
 * its closes back to `from`, otherwise the ETF that tracks it.
 */
export async function getExUsBenchmark(from: string): Promise<string> {
  const bars = await getDailyCloses(EX_US_INDEX, earlierDate(from, 10));
  return bars?.some((bar) => bar.date <= from) ? EX_US_INDEX : EX_US_INDEX_PROXY;
}

/** Null when Yahoo Finance has no closes for the benchmark. */
export function getExUsPicksPerformance(
  positions: Position<PickHolding>[],
  symbol: string,
  start = PICKS_CHART_START,
): Promise<PicksPerformance | null> {
  return getPicksPerformance(positions, start, symbol);
}
