"use client";

import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { Expandable, useExpanded } from "@/components/lightbox";
import { formatMarkDate, formatPoints, formatReturn, performanceColors } from "@/data/performance";
import type { PickInitiation, PicksPerformance as PicksPerformanceData } from "@/lib/picks-performance";

const MONO = "var(--font-sans), system-ui, sans-serif"; // figure labels: sans with tabular numerals
const SANS = "var(--font-sans), system-ui, sans-serif";
const PAPER = "#FFFDF9";
const RULE = "#C9A57A";
const NARROW = "(max-width: 700px)";

type SeriesKey = "picks" | "benchmark" | "benchmarkMatched";
type Line = { key: SeriesKey; label: string; color: string; width: number; dashed: boolean };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-08-01" → "Aug 1". */
function shortDate(isoDate: string): string {
  const [, month, day] = isoDate.split("-").map(Number);
  return `${MONTHS[month - 1]} ${day}`;
}

/** "2026-08-01" → UTC midnight in ms, the x value Apex plots. */
function toTime(isoDate: string): number {
  return Date.parse(`${isoDate}T00:00:00Z`);
}

function toIsoDate(time: number): string {
  return new Date(time).toISOString().slice(0, 10);
}

// Ticker flags fit on wide charts; narrow ones number the flags and key them
// in the list under the chart.
function useNarrow(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(NARROW);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(NARROW).matches,
    () => false,
  );
}

/** Round y bounds with headroom above the data for the initiation flags. */
function niceDomain(values: number[]) {
  let low = Math.min(0, ...values);
  let high = Math.max(0, ...values);
  const span = high - low || 1;
  high += span * 0.2;
  low -= span * 0.04;
  const rough = (high - low) / 5;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 5, 10].map((multiple) => multiple * magnitude).find((size) => size >= rough) ?? rough;
  const min = Math.floor(low / step) * step;
  const max = Math.ceil(high / step) * step;
  return { min, max, tickAmount: Math.round((max - min) / step), digits: step < 1 ? 1 : 0 };
}

function SeriesSwatch({ color, dashed }: { color: string; dashed: boolean }) {
  return (
    <svg width="20" height="4" viewBox="0 0 20 4" aria-hidden="true">
      <line x1="0" y1="2" x2="20" y2="2" stroke={color} strokeWidth="2" strokeDasharray={dashed ? "5 4" : undefined} />
    </svg>
  );
}

// Inline: static chart. Expanded: fills the viewer with zoom/pan tools.
function PicksChart({ options, series }: { options: ApexOptions; series: ApexOptions["series"] }) {
  const expanded = useExpanded();
  const height = expanded ? Math.max(400, window.innerHeight - 300) : 400;
  const explore: ApexOptions = expanded
    ? {
        ...options,
        chart: {
          ...options.chart,
          toolbar: { show: true, tools: { download: false, selection: false, zoom: true, zoomin: true, zoomout: true, pan: true, reset: true } },
          zoom: { enabled: true, type: "x" },
        },
      }
    : options;
  return <Chart options={explore} series={series} type="line" height={height} width="100%" />;
}

function Publications({ initiation, articleSlugs }: { initiation: PickInitiation; articleSlugs: string[] }) {
  return initiation.publications.map((publication, index) => (
    <span key={publication.slug}>
      {index > 0 && "; "}
      {articleSlugs.includes(publication.slug) ? (
        <Link className="text-link" href={publication.href}>
          {publication.title}
        </Link>
      ) : (
        publication.title
      )}
    </span>
  ));
}

/** Benchmark wording; defaults to the S&P 500. */
export type PicksBenchmark = {
  /** Plain-text name, e.g. "S&P 500". */
  name: string;
  /** Plain-text description of the Yahoo Finance series, for the method note. */
  source: string;
};

const SP500: PicksBenchmark = {
  name: "S&P 500",
  source: "^GSPC, the S&P 500 quoted elsewhere as ^SPX",
};

export function PicksPerformance({
  performance,
  articleSlugs,
  benchmark = SP500,
  picksLabel = "Publication picks",
  id = "picks-performance",
}: {
  performance: PicksPerformanceData | null;
  articleSlugs: string[];
  benchmark?: PicksBenchmark;
  picksLabel?: string;
  /** Prefix for element ids, unique per chart on the page. */
  id?: string;
}) {
  const indexName = benchmark.name;
  const titleId = `${id}-title`;
  const [hidden, setHidden] = useState<ReadonlySet<SeriesKey>>(() => new Set<SeriesKey>());
  const narrow = useNarrow();

  if (!performance || performance.points.length < 2) {
    return (
      <section className="container portfolio-performance" aria-labelledby={titleId}>
        <div className="section-head performance-head">
          <h2 id={titleId} className="section-head__title">
            Performance
          </h2>
        </div>
        <p className="performance-chart__empty">
          The chart is unavailable because Yahoo Finance did not return {indexName} prices. It will
          return on the next refresh.
        </p>
      </section>
    );
  }

  const { start, baseDate, points, initiations } = performance;
  const latest = points[points.length - 1];
  const picksPoint = [...points].reverse().find((point) => point.picks != null);
  const picksIsCurrent = picksPoint?.date === latest.date;
  const initiationByDate = new Map(initiations.map((item, index) => [item.date, { ...item, number: index + 1 }]));

  const lines: Line[] = [
    { key: "picks", label: picksLabel, color: performanceColors.fund, width: 3, dashed: false },
    { key: "benchmark", label: `${indexName} since ${shortDate(start)}`, color: performanceColors.sp500, width: 2, dashed: false },
    { key: "benchmarkMatched", label: `${indexName}, matched buys`, color: performanceColors.russell3000, width: 2, dashed: true },
  ];
  const visible = lines.filter((line) => !hidden.has(line.key));
  const series = visible.map((line) => ({
    name: line.label,
    data: points.map((point) => ({ x: toTime(point.date), y: point[line.key] })),
  }));
  const domain = niceDomain(
    points.flatMap((point) => visible.map((line) => point[line.key]).filter((value): value is number => value != null)),
  );
  const picksIndex = visible.findIndex((line) => line.key === "picks");

  function toggle(key: SeriesKey) {
    setHidden((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const flagLabel = (item: PickInitiation, index: number) =>
    narrow ? String(index + 1) : item.tickers.join(" · ");

  const options: ApexOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: false },
      fontFamily: SANS,
      foreColor: "#6B6A7E",
      background: "transparent",
    },
    colors: visible.map((line) => line.color),
    stroke: {
      width: visible.map((line) => line.width),
      curve: "straight",
      dashArray: visible.map((line) => (line.dashed ? 5 : 0)),
    },
    markers: { size: 0, hover: { size: 5 }, strokeColors: PAPER, strokeWidth: 2 },
    grid: {
      borderColor: "#E0D6C5",
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
      padding: { top: 8, right: 16, bottom: 0, left: 4 },
    },
    xaxis: {
      type: "datetime",
      tickAmount: 8,
      labels: {
        datetimeUTC: true,
        datetimeFormatter: { year: "yyyy", month: "MMM", day: "MMM d" },
        hideOverlappingLabels: true,
        style: { colors: "#6B6A7E", fontFamily: MONO, fontSize: "13px" },
      },
      axisBorder: { color: "#D8CCB8" },
      axisTicks: { color: "#D8CCB8" },
      crosshairs: { show: true, stroke: { color: RULE, width: 1, dashArray: 3 } },
      tooltip: { enabled: false },
    },
    yaxis: {
      min: domain.min,
      max: domain.max,
      tickAmount: domain.tickAmount,
      labels: {
        formatter: (value: number) => `${value < 0 ? "−" : ""}${Math.abs(value).toFixed(domain.digits)}%`,
        style: { colors: "#6B6A7E", fontFamily: MONO, fontSize: "13px" },
      },
    },
    legend: { show: false },
    tooltip: {
      theme: "light",
      shared: true,
      intersect: false,
      x: {
        formatter: (value: number) => {
          const date = toIsoDate(value);
          const initiation = initiationByDate.get(date);
          return initiation ? `${formatMarkDate(date)} · bought ${initiation.tickers.join(", ")}` : formatMarkDate(date);
        },
      },
      y: {
        formatter: (value: number) => (value == null || Number.isNaN(value) ? "—" : formatReturn(value)),
      },
    },
    annotations: {
      yaxis: [{ y: 0, borderColor: "#D8CCB8", strokeDashArray: 0 }],
      // One dashed rule per initiation day, flagged with what was bought.
      // Alternate flags drop a row so neighbouring days don't collide.
      xaxis: initiations.map((item, index) => ({
        x: toTime(item.date),
        borderColor: RULE,
        borderWidth: 1,
        strokeDashArray: 4,
        label: {
          text: flagLabel(item, index),
          orientation: "horizontal",
          position: "top",
          textAnchor: "start",
          offsetX: 6,
          offsetY: index % 2 ? 26 : 4,
          borderColor: RULE,
          borderWidth: 1,
          borderRadius: 0,
          style: {
            background: PAPER,
            color: "#00043A",
            fontFamily: MONO,
            fontSize: "13px",
            fontWeight: 400,
            padding: { left: 6, right: 6, top: 3, bottom: 3 },
          },
        },
      })),
      // The buy itself: a ring on the picks line at each initiation close.
      points:
        picksIndex < 0
          ? []
          : initiations.flatMap((item) => {
              const y = points.find((point) => point.date === item.date)?.picks;
              return y == null
                ? []
                : [{
                    x: toTime(item.date),
                    y,
                    seriesIndex: picksIndex,
                    marker: { size: 5, fillColor: PAPER, strokeColor: performanceColors.fund, strokeWidth: 2, shape: "circle" },
                  }];
            }),
    },
    responsive: [
      {
        breakpoint: 700,
        options: {
          chart: { height: 340 },
          xaxis: { tickAmount: 4, labels: { style: { fontSize: "13px" } } },
          grid: { padding: { left: 0, right: 8 } },
        },
      },
    ],
  };

  const caption = `${indexName} base · ${formatMarkDate(baseDate)} close = 0% · picks from cost`;
  const title = `${picksLabel} vs the ${indexName}`;
  const excess =
    picksPoint?.picks != null && picksPoint.benchmarkMatched != null ? picksPoint.picks - picksPoint.benchmarkMatched : null;

  return (
    <section className="container portfolio-performance" aria-labelledby={titleId}>
      <div className="section-head performance-head">
        <h2 id={titleId} className="section-head__title">
          Performance
        </h2>
        <span className="section-head__meta meta-label">
          Picks vs {indexName} · since {formatMarkDate(start)}
        </span>
      </div>

      <ul className="performance-summary">
        <li>
          <span className="performance-summary__label">
            <SeriesSwatch color={lines[0].color} dashed={false} />
            {picksLabel}
          </span>
          <span className="performance-summary__value">
            {picksPoint?.picks == null ? "—" : formatReturn(picksPoint.picks)}
          </span>
          <span className="performance-summary__note">
            {picksPoint == null
              ? "No pick initiated yet"
              : picksIsCurrent
                ? "Gain on cost since each initiation"
                : `Through ${formatMarkDate(picksPoint.date)}`}
          </span>
        </li>
        <li>
          <span className="performance-summary__label">
            <SeriesSwatch color={lines[1].color} dashed={false} />
            {indexName} since {shortDate(start)}
          </span>
          <span className="performance-summary__value">{formatReturn(latest.benchmark)}</span>
          <span className="performance-summary__note">From the {formatMarkDate(baseDate)} close</span>
        </li>
        <li>
          <span className="performance-summary__label">
            <SeriesSwatch color={lines[2].color} dashed />
            {indexName}, matched buys
          </span>
          <span className="performance-summary__value">
            {latest.benchmarkMatched == null ? "—" : formatReturn(latest.benchmarkMatched)}
          </span>
          <span className="performance-summary__note">
            {excess == null ? "Same dollars, same closes as the picks" : `Picks ${formatPoints(excess)} vs matched index`}
          </span>
        </li>
      </ul>

      <figure className="performance-plate">
        <figcaption className="performance-plate__head">
          <div>
            <p className="performance-plate__title">{title}</p>
            <p className="meta-label performance-plate__meta">{caption}</p>
          </div>
          <ul className="performance-legend" aria-label="Chart series">
            {lines.map((line) => {
              const isHidden = hidden.has(line.key);
              return (
                <li key={line.key} data-hidden={isHidden}>
                  <button
                    type="button"
                    className="performance-legend__toggle"
                    aria-pressed={!isHidden}
                    title={`${isHidden ? "Show" : "Hide"} ${line.label}`}
                    onClick={() => toggle(line.key)}
                  >
                    <SeriesSwatch color={line.color} dashed={line.dashed} />
                    <span>{line.label}</span>
                  </button>
                </li>
              );
            })}
            <li className="picks-legend-rule" aria-hidden="true">
              <svg width="4" height="16" viewBox="0 0 4 16">
                <line x1="2" y1="0" x2="2" y2="16" stroke={RULE} strokeWidth="1" strokeDasharray="4 3" />
              </svg>
              Initiation
            </li>
          </ul>
        </figcaption>

        <div className="performance-chart picks-chart" aria-hidden="true">
          {visible.length > 0 ? (
            <Expandable title={title} caption={caption}>
              <PicksChart options={options} series={series} />
            </Expandable>
          ) : (
            <p className="performance-chart__empty">
              All series are hidden. Choose a series in the legend to show it again.
            </p>
          )}
        </div>

        {initiations.length > 0 && (
          <ol className="picks-initiations" aria-label="Initiation days">
            {initiations.map((item, index) => (
              <li key={item.date}>
                <span className="picks-initiations__num meta-label" aria-hidden="true">
                  {index + 1}
                </span>
                <span className="picks-initiations__date meta-label">{formatMarkDate(item.date)}</span>
                <span className="picks-initiations__tickers">
                  Bought {item.tickers.join(", ")}
                </span>
                <span className="picks-initiations__source">
                  <Publications initiation={item} articleSlugs={articleSlugs} />
                </span>
              </li>
            ))}
          </ol>
        )}

        <details className="chart-data performance-data">
          <summary>View chart data</summary>
          <div className="performance-table-wrap">
            <table className="performance-table">
              <caption className="sr-only">
                Daily gain on cost of the {picksLabel.charAt(0).toLowerCase() + picksLabel.slice(1)}, the {indexName} price return since{" "}
                {formatMarkDate(start)}, and the {indexName} bought with the same dollars on the same days.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  {lines.map((line) => (
                    <th key={line.key} scope="col">
                      {line.label}
                    </th>
                  ))}
                  <th scope="col">Initiated</th>
                </tr>
              </thead>
              <tbody>
                {points.map((point) => (
                  <tr key={point.date}>
                    <th scope="row">{formatMarkDate(point.date)}</th>
                    {lines.map((line) => {
                      const value = point[line.key];
                      return <td key={line.key}>{value == null ? "—" : formatReturn(value)}</td>;
                    })}
                    <td>{initiationByDate.get(point.date)?.tickers.join(", ") ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>

        <p className="performance-note">
          {picksLabel} shows the unrealized gain of every pick initiated so far over its cost
          basis at each day&rsquo;s close; a pick enters at the close on its publication date, or
          the next session if the market was shut. Dashed rules and rings mark those initiation
          closes. The {indexName} line is the index&rsquo;s price return from the{" "}
          {formatMarkDate(baseDate)} close, the last before {formatMarkDate(start)}. Matched buys
          puts each pick&rsquo;s cost into the index at the same close, the basis of the
          &ldquo;vs {indexName}&rdquo; figure above. Price returns only, from Yahoo Finance daily
          closes ({benchmark.source}), through{" "}
          {formatMarkDate(latest.date)}.
        </p>
      </figure>
    </section>
  );
}
