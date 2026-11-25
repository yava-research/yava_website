"use client";

import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { Expandable, useExpanded } from "@/components/lightbox";

// Chart widgets for MDX articles. Import inside .mdx, e.g.
//   import { LineChartCard } from "@/components/charts";
// Data is inline JS — see src/content/publications/_README.md.
// Palette mirrors the site tokens (navy / sandstone / ochre).
//
// Reader-focused charts with an accessible tabular data alternative.

export type Series = {
  key: string;
  label?: string;
  color?: string;
};

type ChartCardProps = {
  data: Record<string, string | number>[];
  xKey: string;
  series: Series[];
  title?: string;
  caption?: string;
  /** Chart height in px. Defaults to 320. */
  height?: number;
  yLabel?: string;
};

const PALETTE = ["#00043A", "#C9A57A", "#A67F52", "#141A63", "#6B6A7E"];
const MONO = "var(--font-sans), system-ui, sans-serif"; // figure labels: sans with tabular numerals

function withColors(series: Series[]): (Series & { color: string })[] {
  return series.map((s, i) => ({ ...s, color: s.color ?? PALETTE[i % PALETTE.length] }));
}

function num(v: string | number | undefined): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function compact(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${trim(n / 1_000_000)}M`;
  if (abs >= 1_000) return `${trim(n / 1_000)}k`;
  return trim(n);
}

function trim(n: number): string {
  return String(Math.round(n * 10) / 10);
}

// In the expanded view, line charts get Apex's zoom/pan toolbar so readers
// can explore a date range. Inline charts stay static.
function chartShell(type: "line" | "bar", explore = false): ApexOptions["chart"] {
  return {
    type,
    toolbar: {
      show: explore,
      tools: { download: false, selection: false, zoom: explore, zoomin: explore, zoomout: explore, pan: explore, reset: explore },
    },
    zoom: { enabled: explore, type: "x" },
    animations: { enabled: false },
    fontFamily: "var(--font-sans), system-ui, sans-serif",
    foreColor: "#6B6A7E",
    background: "transparent",
  };
}

function baseOptions(categories: string[], colors: string[]): ApexOptions {
  return {
    chart: chartShell("line"),
    colors,
    grid: { borderColor: "#E0D6C5", strokeDashArray: 3 },
    xaxis: {
      categories,
      labels: { style: { colors: "#6B6A7E", fontFamily: MONO, fontSize: "13px" } },
      axisBorder: { color: "#D8CCB8" },
      axisTicks: { color: "#D8CCB8" },
    },
    yaxis: {
      labels: {
        formatter: (v: number) => compact(v),
        style: { colors: "#6B6A7E", fontFamily: MONO, fontSize: "13px" },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      showForSingleSeries: false,
      fontSize: "13px",
      labels: { colors: "#2A2B4A" },
    },
    tooltip: { theme: "light" },
  };
}

function ChartFrame({
  title,
  caption,
  children,
  data,
  xKey,
  series,
}: {
  title?: string;
  caption?: string;
  children: React.ReactNode;
  data: ChartCardProps["data"];
  xKey: string;
  series: Series[];
}) {
  return (
    <figure className="chart-card">
      <figcaption>{title && <p className="chart-card__title">{title}</p>}{caption && <p className="chart-card__caption">{caption}</p>}</figcaption>
      <Expandable title={title} caption={caption}>
        <div aria-hidden="true">{children}</div>
      </Expandable>
      <details className="chart-data"><summary>View chart data</summary><div className="article-table-wrap"><table>
        <caption className="sr-only">{title ?? "Chart data"}</caption>
        <thead><tr><th scope="col">{xKey}</th>{series.map((item) => <th key={item.key} scope="col">{item.label ?? item.key}</th>)}</tr></thead>
        <tbody>{data.map((row, index) => <tr key={index}><th scope="row">{row[xKey]}</th>{series.map((item) => <td key={item.key}>{row[item.key]}</td>)}</tr>)}</tbody>
      </table></div></details>
    </figure>
  );
}

/** Inline height, or most of the viewport when expanded. */
function useChartHeight(height: number) {
  const expanded = useExpanded();
  return { expanded, height: expanded ? Math.max(height, window.innerHeight - 300) : height };
}

function LineChartBody({ data, xKey, series, height: inlineHeight = 320 }: ChartCardProps) {
  const { expanded, height } = useChartHeight(inlineHeight);
  const colored = withColors(series);
  const categories = data.map((d) => String(d[xKey] ?? ""));
  const apexSeries = colored.map((s) => ({
    name: s.label ?? s.key,
    data: data.map((d) => num(d[s.key])),
  }));
  const options: ApexOptions = {
    ...baseOptions(categories, colored.map((s) => s.color)),
    chart: chartShell("line", expanded),
    stroke: { width: 3, curve: "smooth" },
    markers: { size: 4, strokeColors: "#FFFDF9", strokeWidth: 2 },
  };
  return (
    // minHeight reserves space server-side so hydration doesn't shift layout.
    <div style={{ minHeight: height }}>
      <Chart options={options} series={apexSeries} type="line" height={height} width="100%" />
    </div>
  );
}

function BarChartBody({ data, xKey, series, height: inlineHeight = 320 }: ChartCardProps) {
  const { height } = useChartHeight(inlineHeight);
  const colored = withColors(series);
  const categories = data.map((d) => String(d[xKey] ?? ""));
  const apexSeries = colored.map((s) => ({
    name: s.label ?? s.key,
    data: data.map((d) => num(d[s.key])),
  }));
  const options: ApexOptions = {
    ...baseOptions(categories, colored.map((s) => s.color)),
    chart: chartShell("bar"),
    plotOptions: { bar: { borderRadius: 3, columnWidth: "55%", dataLabels: { position: "top" } } },
    dataLabels: {
      enabled: true,
      formatter: (v: number) => trim(v),
      offsetY: -22,
      style: { colors: ["#2A2B4A"], fontFamily: MONO, fontSize: "13px", fontWeight: 400 },
    },
  };
  return (
    <div style={{ minHeight: height }}>
      <Chart options={options} series={apexSeries} type="bar" height={height} width="100%" />
    </div>
  );
}

export function LineChartCard(props: ChartCardProps) {
  const { data, xKey, series, title, caption } = props;
  return (
    <ChartFrame title={title} caption={caption} data={data} xKey={xKey} series={series}>
      <LineChartBody {...props} />
    </ChartFrame>
  );
}

export function BarChartCard(props: ChartCardProps) {
  const { data, xKey, series, title, caption } = props;
  return (
    <ChartFrame title={title} caption={caption} data={data} xKey={xKey} series={series}>
      <BarChartBody {...props} />
    </ChartFrame>
  );
}
