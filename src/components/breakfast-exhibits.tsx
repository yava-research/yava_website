import { readFileSync } from "node:fs";
import { Expandable } from "@/components/lightbox";
import styles from "./breakfast-exhibits.module.css";

const resultsUrl = "/publications/files/breakfast-long-short/monthly-results.csv";
const models = [
  { key: "group_balanced", label: "Group-balanced", style: styles.balanced },
  { key: "momentum", label: "Momentum", style: styles.momentum },
  { key: "multifactor", label: "Multifactor", style: styles.multifactor },
];

const percent = (value: number, digits = 0) =>
  `${value < 0 ? "−" : value > 0 ? "+" : ""}${Math.abs(value).toFixed(digits)}%`;

export function BreakfastExposure() {
  return (
    <figure className={`chart-card ${styles.exhibit}`}>
      <p className={styles.title}>The two sides of a low-net book</p>
      <div className={styles.exposureSides}>
        <div><span>Short stocks</span><strong>−90%</strong><span>−$900,000</span></div>
        <div><span>Long stocks</span><strong>+100%</strong><span>+$1,000,000</span></div>
      </div>
      <svg className={styles.exposurePlot} viewBox="0 0 200 32" preserveAspectRatio="none" aria-hidden="true">
        <rect x="0" y="7" width="200" height="18" fill="var(--sand-2)" />
        <rect x="10" y="7" width="90" height="18" fill="var(--ochre)" />
        <rect x="100" y="7" width="100" height="18" fill="var(--ink)" />
        <line x1="100" x2="100" y1="1" y2="31" stroke="var(--muted)" vectorEffect="non-scaling-stroke" />
        <line x1="100" x2="100" y1="7" y2="25" stroke="var(--paper)" vectorEffect="non-scaling-stroke" />
      </svg>
      <dl className={styles.exposureTotals}>
        <div><dt>Net · long minus short</dt><dd>+10% <span>+$100,000</span></dd></div>
        <div><dt>Gross · long plus short</dt><dd>190% <span>$1,900,000</span></dd></div>
      </dl>
      <figcaption>Exposure at rebalance, as a share of $1 million in hypothetical equity.</figcaption>
    </figure>
  );
}

function performanceSeries() {
  // The exported fields used here are unquoted ISO dates, model identifiers, and decimals.
  const [header, ...rows] = readFileSync("public" + resultsUrl, "utf8").trim().split(/\r?\n/);
  const columns = header.split(",");
  const [dateCol, modelCol, netCol] = ["month", "model", "net"].map((name) => columns.indexOf(name));
  const monthly = rows.map((line) => line.split(","));
  return models.map((model) => {
    let wealth = 1;
    let peak = 1;
    const points = [{ date: "2020-12-31", cumulative: 0, drawdown: 0 }];
    for (const row of monthly.filter((row) => row[modelCol] === model.key).sort((a, b) => a[dateCol].localeCompare(b[dateCol]))) {
      wealth *= 1 + Number(row[netCol]);
      peak = Math.max(wealth, peak);
      points.push({ date: row[dateCol], cumulative: (wealth - 1) * 100, drawdown: (wealth / peak - 1) * 100 });
    }
    return { ...model, points };
  });
}

function PerformancePlot({ series, field, title, step }: {
  series: ReturnType<typeof performanceSeries>;
  field: "cumulative" | "drawdown";
  title: string;
  step: number;
}) {
  const values = series.flatMap(({ points }) => points.map((point) => point[field]));
  const min = Math.floor(Math.min(...values) / step) * step;
  const max = Math.ceil(Math.max(...values) / step) * step;
  const ticks = Array.from({ length: (max - min) / step + 1 }, (_, i) => max - i * step);
  const dates = series[0].points;
  const years = dates.flatMap(({ date }, i) => date.endsWith("-01-31") ? [{ year: date.slice(0, 4), i }] : []);
  const x = (i: number) => i * 100 / (dates.length - 1);
  const y = (value: number) => (max - value) * 100 / (max - min);
  return (
    <div className={styles.panel} aria-hidden="true">
      <p className={styles.panelTitle}>{title}</p>
      <div className={styles.chart}>
        <div className={styles.scale}>
          {ticks.map((tick) => <span key={tick} style={{ top: `${y(tick)}%` }}>{percent(tick)}</span>)}
        </div>
        <svg className={styles.plot} viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
          {ticks.map((tick) => (
            <line key={tick} x1="0" x2="100" y1={y(tick)} y2={y(tick)} className={tick === 0 ? styles.baseline : styles.gridline} vectorEffect="non-scaling-stroke" />
          ))}
          {[...series].reverse().map(({ key, style, points }) => (
            <polyline key={key} className={`${styles.trace} ${style}`} vectorEffect="non-scaling-stroke"
              points={points.map((point, i) => `${x(i).toFixed(3)},${y(point[field]).toFixed(3)}`).join(" ")} />
          ))}
        </svg>
        <div className={styles.years}>
          {years.map(({ year, i }) => <span key={year} style={{ left: `${x(i)}%` }}>{year}</span>)}
        </div>
      </div>
    </div>
  );
}

export function BreakfastPerformance() {
  const series = performanceSeries();
  return (
    <figure className={`chart-card ${styles.exhibit}`}>
      <p className={styles.title}>The balanced basket pulled ahead late</p>
      <Expandable title="The balanced basket pulled ahead late" className={`chart-card ${styles.exhibit}`}>
      <div className={styles.legend} role="list" aria-label="Strategies and full-period cumulative returns">
        {series.map(({ key, label, style, points }) => (
          <div key={key} role="listitem">
            <svg viewBox="0 0 26 10" width="26" height="10" aria-hidden="true">
              <line x1="0" x2="26" y1="5" y2="5" className={`${styles.trace} ${style}`} />
            </svg>
            <span>{label}</span><strong>{percent(points.at(-1)!.cumulative, 1)}</strong>
          </div>
        ))}
      </div>
      <PerformancePlot series={series} field="cumulative" title="Cumulative net return" step={20} />
      <PerformancePlot series={series} field="drawdown" title="Drawdown from each basket’s prior peak" step={10} />
      </Expandable>
      <figcaption>
        Monthly results, Jan. 2021–Jan. 2026, after trading costs and 1% annual borrow.
        The group-balanced basket spent much of 2023 below its prior peak, then separated from the other two in 2024–2025.
        See the table below for maximum drawdowns or <a href={resultsUrl}>download the monthly chart data</a>.
      </figcaption>
    </figure>
  );
}
