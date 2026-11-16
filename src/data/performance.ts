// Portfolio performance series for /portfolio.
//
// Portfolio returns are calculated from holdings in src/lib/portfolio.ts.
// The fund field below is a placeholder populated at render time.
//
// The live chart is rebuilt from Yahoo Finance daily closes in
// src/lib/benchmarks.ts and extends through the latest trading day. The rows
// below are the month-end snapshot kept only as an offline fallback when
// Yahoo is unreachable — do not append to them by hand. The Russell benchmark
// adds 200 bps per year, accrued daily. Price returns exclude dividends.

export type PerformancePoint = {
  /** Trading-day date. */
  date: string;
  /** Axis label, e.g. "Nov 10". */
  label: string;
  /**
   * Portfolio gain versus cost basis, in percent.
   * Null when the portfolio cannot be priced for that day.
   */
  fund: number | null;
  sp500: number;
  djia: number;
  nasdaq100: number;
  russell3000: number;
};

const rows: PerformancePoint[] = [
  { date: "2025-12-31", label: "Dec ’25", fund: null, sp500: 0, djia: 0, nasdaq100: 0, russell3000: 0 },
  { date: "2026-01-30", label: "Jan ’26", fund: null, sp500: 1.37, djia: 1.73, nasdaq100: 1.2, russell3000: 1.64 },
  { date: "2026-02-27", label: "Feb ’26", fund: null, sp500: 0.49, djia: 1.9, nasdaq100: -1.15, russell3000: 1.22 },
  { date: "2026-03-31", label: "Mar ’26", fund: null, sp500: -4.63, djia: -3.58, nasdaq100: -5.98, russell3000: -3.78 },
  { date: "2026-04-30", label: "Apr ’26", fund: null, sp500: 5.31, djia: 3.31, nasdaq100: 8.72, russell3000: 6.15 },
  { date: "2026-05-29", label: "May ’26", fund: null, sp500: 10.72, djia: 6.18, nasdaq100: 20.13, russell3000: 11.58 },
  { date: "2026-06-30", label: "Jun ’26", fund: null, sp500: 9.55, djia: 8.85, nasdaq100: 19.91, russell3000: 11.31 },
  { date: "2026-07-31", label: "Jul ’26", fund: null, sp500: 9.42, djia: 9.2, nasdaq100: 11.98, russell3000: 10.89 },
  { date: "2026-08-31", label: "Aug ’26", fund: null, sp500: 12.28, djia: 10.66, nasdaq100: 16.66, russell3000: 14.01 },
  { date: "2026-09-30", label: "Sep ’26", fund: null, sp500: 11.77, djia: 5.91, nasdaq100: 20.43, russell3000: 13.12 },
  // October 30, 2026 closes.
  { date: "2026-10-30", label: "Oct ’26", fund: null, sp500: 10.73, djia: 7.71, nasdaq100: 12.42, russell3000: 12.51 },
];

export const performance = rows;

export const performanceColors = {
  fund: "#00043A",
  sp500: "#A67F52",
  djia: "#8F3F30",
  nasdaq100: "#5F6B52",
  russell3000: "#6B6A7E",
} as const;

export const performanceSeries = [
  { key: "fund", label: "YAMF", color: performanceColors.fund, dashed: false },
  { key: "sp500", label: "S&P 500", color: performanceColors.sp500, dashed: false },
  { key: "djia", label: "Dow Jones", color: performanceColors.djia, dashed: false },
  { key: "nasdaq100", label: "Nasdaq 100", color: performanceColors.nasdaq100, dashed: false },
  {
    key: "russell3000",
    label: "Russell 3000 + 200 bps",
    color: performanceColors.russell3000,
    dashed: true,
  },
] as const satisfies readonly {
  key: keyof Omit<PerformancePoint, "date" | "label">;
  label: string;
  color: string;
  dashed: boolean;
}[];

export const benchmarkSpreadBps = 200;

const MARK_DATE = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** "2026-10-30" → "Oct 30, 2026". */
export function formatMarkDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return MARK_DATE.format(new Date(Date.UTC(year, month - 1, day)));
}

/** +25.5% / −7.8% / 0.0% — true minus sign, one decimal by default. */
export function formatReturn(value: number, digits = 1): string {
  const rounded = Number(value.toFixed(digits));
  if (rounded === 0) return `${(0).toFixed(digits)}%`;
  return `${rounded < 0 ? "−" : "+"}${Math.abs(rounded).toFixed(digits)}%`;
}

/** +13.7 pts / −12.4 pts — difference in percentage points. */
export function formatPoints(value: number, digits = 1): string {
  const rounded = Number(value.toFixed(digits));
  if (rounded === 0) return `${(0).toFixed(digits)} pts`;
  return `${rounded < 0 ? "−" : "+"}${Math.abs(rounded).toFixed(digits)} pts`;
}
