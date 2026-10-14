"use client";

import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

// Chart widgets for MDX articles. Import inside .mdx, e.g.
//   import { LineChartCard } from "@/components/charts";
// Data is inline JS — see src/content/publications/README.md.
// Palette mirrors the site tokens (navy / sandstone / ochre).
//
// Interactive ApexCharts: zoom, pan, and download via the toolbar.

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
const MONO = "'Fira Mono', ui-monospace, monospace";

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

function chartShell(type: "line" | "bar"): ApexOptions["chart"] {
  return {
    type,
    toolbar: { show: true },
    zoom: { enabled: true },
    fontFamily: "'Fira Sans', system-ui, sans-serif",
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
      labels: { style: { colors: "#6B6A7E", fontFamily: MONO, fontSize: "12px" } },
      axisBorder: { color: "#D8CCB8" },
      axisTicks: { color: "#D8CCB8" },
    },
    yaxis: {
      labels: {
        formatter: (v: number) => compact(v),
        style: { colors: "#6B6A7E", fontFamily: MONO, fontSize: "12px" },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      showForSingleSeries: false,
      labels: { colors: "#2A2B4A" },
    },
    tooltip: { theme: "light" },
  };
}

function ChartFrame({
  title,
  caption,
  children,
}: {
  title?: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="chart-card">
      {title && <figcaption className="chart-card__title">{title}</figcaption>}
      {children}
      {caption && <figcaption className="chart-card__caption">{caption}</figcaption>}
    </figure>
  );
}

export function LineChartCard({ data, xKey, series, title, caption, height = 320 }: ChartCardProps) {
  const colored = withColors(series);
  const categories = data.map((d) => String(d[xKey] ?? ""));
  const apexSeries = colored.map((s) => ({
    name: s.label ?? s.key,
    data: data.map((d) => num(d[s.key])),
  }));
  const options: ApexOptions = {
    ...baseOptions(categories, colored.map((s) => s.color)),
    chart: chartShell("line"),
    stroke: { width: 3, curve: "smooth" },
    markers: { size: 4, strokeColors: "#FFFDF9", strokeWidth: 2 },
  };
  return (
    <ChartFrame title={title} caption={caption}>
      {/* minHeight reserves space server-side so hydration doesn't shift layout. */}
      <div style={{ minHeight: height }}>
        <Chart options={options} series={apexSeries} type="line" height={height} width="100%" />
      </div>
    </ChartFrame>
  );
}

export function BarChartCard({ data, xKey, series, title, caption, height = 320 }: ChartCardProps) {
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
      style: { colors: ["#2A2B4A"], fontFamily: MONO, fontSize: "12px", fontWeight: 400 },
    },
  };
  return (
    <ChartFrame title={title} caption={caption}>
      <div style={{ minHeight: height }}>
        <Chart options={options} series={apexSeries} type="bar" height={height} width="100%" />
      </div>
    </ChartFrame>
  );
}
