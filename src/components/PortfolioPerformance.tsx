"use client";

import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useState } from "react";
import { Expandable, useExpanded } from "@/components/lightbox";
import { portfolioInception } from "@/data/holdings";
import {
  benchmarkSpreadBps,
  formatMarkDate,
  formatPoints,
  formatReturn,
  performanceColors,
  performanceSeries,
  type PerformancePoint,
} from "@/data/performance";

const MONO = "var(--font-sans), system-ui, sans-serif"; // figure labels: sans with tabular numerals
const SANS = "var(--font-sans), system-ui, sans-serif";

type SeriesKey = (typeof performanceSeries)[number]["key"];

function SeriesSwatch({ color, dashed }: { color: string; dashed: boolean }) {
  return (
    <svg width="20" height="4" viewBox="0 0 20 4" aria-hidden="true">
      <line
        x1="0"
        y1="2"
        x2="20"
        y2="2"
        stroke={color}
        strokeWidth="2"
        strokeDasharray={dashed ? "5 4" : undefined}
      />
    </svg>
  );
}

// Inline: static 380px chart. Expanded: fills the viewer with zoom/pan tools.
function PerformanceChart({ options, series }: { options: ApexOptions; series: ApexOptions["series"] }) {
  const expanded = useExpanded();
  const height = expanded ? Math.max(380, window.innerHeight - 300) : 380;
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

export function PortfolioPerformance({ points }: { points: PerformancePoint[] }) {
  const [hiddenSeries, setHiddenSeries] = useState<ReadonlySet<SeriesKey>>(
    () => new Set<SeriesKey>(),
  );
  const latest = points[points.length - 1];
  const fundPoint = [...points].reverse().find((point) => point.fund != null) ?? latest;
  const fundIsCurrent = fundPoint.date === latest.date;

  function versusFund(indexReturn: number): string {
    if (fundPoint.fund == null) return "Fund mark unavailable";
    const gap = formatPoints(indexReturn - fundPoint.fund);
    return fundIsCurrent ? `${gap} vs fund` : `${gap} vs ${fundPoint.label} mark`;
  }
  const visibleSeries = performanceSeries.filter((line) => !hiddenSeries.has(line.key));
  const categories = points.map((point) => point.label);
  const chartSeries = visibleSeries.map((line) => ({
    name: line.label,
    data: points.map((point) => point[line.key]),
  }));

  function toggleSeries(key: SeriesKey) {
    setHiddenSeries((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

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
    colors: visibleSeries.map((line) => line.color),
    stroke: {
      width: visibleSeries.map((line) => (line.key === "fund" ? 3 : 2)),
      curve: "straight",
      dashArray: visibleSeries.map((line) => (line.dashed ? 5 : 0)),
    },
    markers: {
      size: 0,
      hover: { size: 5 },
      strokeColors: "#FFFDF9",
      strokeWidth: 2,
    },
    grid: {
      borderColor: "#E0D6C5",
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
      padding: { top: 8, right: 12, bottom: 0, left: 4 },
    },
    xaxis: {
      categories,
      tickAmount: 10,
      labels: {
        rotate: 0,
        hideOverlappingLabels: true,
        style: { colors: "#6B6A7E", fontFamily: MONO, fontSize: "13px" },
      },
      axisBorder: { color: "#D8CCB8" },
      axisTicks: { color: "#D8CCB8" },
      crosshairs: {
        show: true,
        stroke: { color: "#C9A57A", width: 1, dashArray: 3 },
      },
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        formatter: (value: number) =>
          `${value < 0 ? "−" : ""}${Math.abs(Math.round(value))}%`,
        style: { colors: "#6B6A7E", fontFamily: MONO, fontSize: "13px" },
      },
    },
    legend: { show: false },
    tooltip: {
      theme: "light",
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) =>
          value == null || Number.isNaN(value) ? "—" : formatReturn(value),
      },
    },
    annotations: {
      yaxis: [
        {
          y: 0,
          borderColor: "#D8CCB8",
          strokeDashArray: 0,
        },
      ],
    },
    responsive: [
      {
        breakpoint: 700,
        options: {
          chart: { height: 320 },
          xaxis: {
            tickAmount: 4,
            labels: { style: { fontSize: "13px" } },
          },
          yaxis: { tickAmount: 4 },
          grid: { padding: { left: 0, right: 4 } },
        },
      },
    ],
  };

  return (
    <section className="container portfolio-performance" aria-labelledby="performance-title">
      <div className="section-head performance-head">
        <h2 id="performance-title" className="section-head__title">
          Performance
        </h2>
        <span className="section-head__meta meta-label">
          Portfolio gain vs cost · benchmarks since {portfolioInception}
        </span>
      </div>

      <ul className="performance-summary">
        <li>
          <span className="performance-summary__label">
            <SeriesSwatch color={performanceColors.fund} dashed={false} />
            YAMF
          </span>
          <span className="performance-summary__value">
            {fundPoint.fund == null ? "—" : formatReturn(fundPoint.fund)}
          </span>
          <span className="performance-summary__note">
            {fundIsCurrent ? "Base: 31 Dec 2025" : `Through ${fundPoint.label}`}
          </span>
        </li>
        <li>
          <span className="performance-summary__label">
            <SeriesSwatch color={performanceColors.sp500} dashed={false} />
            S&amp;P 500
          </span>
          <span className="performance-summary__value">{formatReturn(latest.sp500)}</span>
          <span className="performance-summary__note">{versusFund(fundPoint.sp500)}</span>
        </li>
        <li>
          <span className="performance-summary__label">
            <SeriesSwatch color={performanceColors.russell3000} dashed />
            Russell 3000 + 200 bps
          </span>
          <span className="performance-summary__value">
            {formatReturn(latest.russell3000)}
          </span>
          <span className="performance-summary__note">{versusFund(fundPoint.russell3000)}</span>
        </li>
      </ul>

      <figure className="performance-plate">
        <figcaption className="performance-plate__head">
          <div>
            <p className="performance-plate__title">Portfolio and benchmark returns</p>
            <p className="meta-label performance-plate__meta">Base · 31 Dec 2025 = 0%</p>
          </div>
          <ul className="performance-legend" aria-label="Chart series">
            {performanceSeries.map((line) => {
              const isHidden = hiddenSeries.has(line.key);
              return (
                <li key={line.key} data-hidden={isHidden}>
                  <button
                    type="button"
                    className="performance-legend__toggle"
                    aria-pressed={!isHidden}
                    title={`${isHidden ? "Show" : "Hide"} ${line.label}`}
                    onClick={() => toggleSeries(line.key)}
                  >
                    <SeriesSwatch color={line.color} dashed={line.dashed} />
                    <span>{line.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </figcaption>

        <div className="performance-chart" aria-hidden="true">
          {visibleSeries.length > 0 ? (
            <Expandable title="Portfolio and benchmark returns" caption="Base · 31 Dec 2025 = 0%">
              <PerformanceChart options={options} series={chartSeries} />
            </Expandable>
          ) : (
            <p className="performance-chart__empty">
              All series are hidden. Choose a series in the legend to show it again.
            </p>
          )}
        </div>

        <details className="chart-data performance-data">
          <summary>View chart data</summary>
          <div className="performance-table-wrap">
            <table className="performance-table">
              <caption className="sr-only">
                Daily portfolio gain versus cost and cumulative price returns for the S&amp;P 500, the Dow Jones
                Industrial Average, the Nasdaq 100, and the Russell 3000 plus 200 basis points.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  {performanceSeries.map((line) => (
                    <th key={line.key} scope="col">
                      {line.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {points.map((point) => (
                  <tr key={point.date}>
                    <th scope="row">{point.label}</th>
                    {performanceSeries.map((line) => {
                      const value = point[line.key];
                      return <td key={line.key}>{value == null ? "—" : formatReturn(value)}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>

        <p className="performance-note">
          YAMF shows the unrealized gain of the currently listed holdings divided by their cost basis at each day&rsquo;s close. Positions enter on their purchase dates; the series excludes cash, sales, fees and dividends and is not a time-weighted fund return. Index returns use daily closes for the S&amp;P 500 (^GSPC),
          the Dow Jones Industrial Average (^DJI), the Nasdaq 100 (^NDX) and the Russell 3000
          (^RUA) via Yahoo Finance. The Russell 3000 benchmark adds {benchmarkSpreadBps} bps per
          year, accrued daily. Indexes through {formatMarkDate(latest.date)}
          {fundIsCurrent ? "" : `; YAMF mark through ${formatMarkDate(fundPoint.date)}`}. Past
          performance does not guarantee future results.
        </p>
      </figure>
    </section>
  );
}
