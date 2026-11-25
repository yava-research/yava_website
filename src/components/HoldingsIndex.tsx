"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  formatGain,
  formatMoney,
  formatMoneyChange,
  formatTradeDate,
  formatWeight,
  formatWholeDollars,
  type Holding,
} from "@/data/holdings";
import { publications } from "@/data/publications";
import type { Position } from "@/lib/portfolio";

const hasResearch = (holding: Holding, articleSlugs: string[]) =>
  publications.some(
    (publication) =>
      holding.analysis.href === `/publications/${publication.slug}` &&
      articleSlugs.includes(publication.slug),
  );

type SortKey = "weight" | "marketValue" | "gain" | "country";
type SortDirection = "asc" | "desc";
type Sort = { key: SortKey; direction: SortDirection };

const sortLabels: Record<SortKey, string> = {
  weight: "weight",
  marketValue: "market value",
  gain: "unrealized gain",
  country: "headquarters country",
};

const defaultDirections: Record<SortKey, SortDirection> = {
  weight: "desc",
  marketValue: "desc",
  gain: "desc",
  country: "asc",
};

const collator = new Intl.Collator("en-US", { sensitivity: "base" });

function metric(position: Position, key: Exclude<SortKey, "country">): number | null {
  if (!position.valuation) return null;
  if (key === "weight") return position.valuation.weight;
  if (key === "marketValue") return position.valuation.marketValue;
  return position.valuation.gainPercent;
}

export function HoldingsIndex({ positions, articleSlugs = [] }: { positions: Position[]; articleSlugs?: string[] }) {
  const [sort, setSort] = useState<Sort | null>(null);

  const sortedPositions = useMemo(() => {
    if (!sort) return positions;
    const factor = sort.direction === "asc" ? 1 : -1;

    return [...positions].sort((a, b) => {
      if (sort.key === "country") {
        return (
          collator.compare(a.country, b.country) ||
          collator.compare(a.city, b.city) ||
          collator.compare(a.name, b.name)
        ) * factor;
      }

      const aValue = metric(a, sort.key);
      const bValue = metric(b, sort.key);
      // Positions without a price stay at the bottom in either direction.
      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;
      return (aValue - bValue) * factor;
    });
  }, [positions, sort]);

  const directionLabel = sort?.direction === "asc" ? "ascending" : "descending";
  const announcement = sort
    ? `Sorted by ${sortLabels[sort.key]}, ${directionLabel}.`
    : "Sorted in portfolio order.";

  function toggleSort(key: SortKey) {
    setSort((current) =>
      current?.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: defaultDirections[key] },
    );
  }

  function chooseSortKey(value: string) {
    if (!value) {
      setSort(null);
      return;
    }
    const key = value as SortKey;
    setSort({ key, direction: sort?.key === key ? sort.direction : defaultDirections[key] });
  }

  function flipDirection() {
    setSort((current) =>
      current
        ? { key: current.key, direction: current.direction === "asc" ? "desc" : "asc" }
        : current,
    );
  }

  function renderSortButton(key: SortKey, label: string) {
    const active = sort?.key === key;
    return (
      <button
        type="button"
        className="holdings-sort"
        data-active={active}
        aria-label={`Sort by ${sortLabels[key]}${active ? `, currently ${directionLabel}` : ""}`}
        onClick={() => toggleSort(key)}
      >
        {label}
        <span className="holdings-sort__mark" aria-hidden="true">
          {active ? (sort.direction === "asc" ? "↑" : "↓") : "↕"}
        </span>
      </button>
    );
  }

  return (
    <section className="container portfolio-holdings" aria-labelledby="holdings-title">
      <div className="section-head">
        <h2 id="holdings-title" className="section-head__title">
          Holdings
        </h2>
        <span className="section-head__meta meta-label">
          {positions.length} positions · weighted by market value
        </span>
      </div>

      <p className="sr-only" role="status">
        {announcement}
      </p>

      <div className="holdings-sortbar">
        <label className="holdings-sortbar__label" htmlFor="holdings-sort">
          Sort
        </label>
        <select
          id="holdings-sort"
          className="holdings-sortbar__select"
          value={sort?.key ?? ""}
          onChange={(event) => chooseSortKey(event.target.value)}
        >
          <option value="">Portfolio order</option>
          <option value="weight">Weight</option>
          <option value="marketValue">Market value</option>
          <option value="gain">Unrealized gain</option>
          <option value="country">Headquarters</option>
        </select>
        <button
          type="button"
          className="holdings-sortbar__direction"
          onClick={flipDirection}
          disabled={!sort}
          aria-label={
            sort
              ? `Sort ${sort.direction === "asc" ? "descending" : "ascending"}`
              : "Choose a sort option first"
          }
        >
          <span aria-hidden="true">{sort?.direction === "asc" ? "↑" : "↓"}</span>
        </button>
      </div>

      <div className="holdings-columns meta-label">
        <span>No.</span>
        <span>Company</span>
        <span>{renderSortButton("country", "Headquarters")}</span>
        <span className="num">{renderSortButton("weight", "Weight")}</span>
        <span className="num">{renderSortButton("marketValue", "Market value")}</span>
        <span className="num">{renderSortButton("gain", "Unrealized")}</span>
      </div>

      <ul className="holdings-list">
        {sortedPositions.map(({ valuation, ...holding }, index) => (
          <li key={holding.slug}>
            <div className="holding-row">
              <span className="holding-row__num meta-label">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="holding-row__company">
                <span className="holding-row__name">{holding.name}</span>
                <span className="holding-row__ticker meta-label">
                  {holding.ticker} · {holding.sector}
                </span>
                <span className="holding-row__lot meta-label">
                  {holding.shares.toLocaleString("en-US")} sh
                  {valuation &&
                    (valuation.currency === "USD"
                      ? ` @ ${formatMoney(valuation.purchasePrice)}`
                      : ` @ ${formatMoney(valuation.purchasePriceLocal, valuation.currency)} (${formatMoney(valuation.purchasePrice)})`)}{" "}
                  ·{" "}
                  {formatTradeDate(holding.purchaseDate)}
                </span>
                {hasResearch(holding, articleSlugs) ? (
                  <Link className="holding-row__research text-link" href={holding.analysis.href}>
                    Read research →
                  </Link>
                ) : (
                  <span className="holding-row__research">Research in preparation</span>
                )}
              </span>
              <span className="holding-row__hq">
                {holding.city}, {holding.country}
              </span>
              <span className="holding-row__weight">
                <span className="sr-only">Weight </span>
                {valuation ? formatWeight(valuation.weight) : "—"}
              </span>
              <span className="holding-row__market">
                <span className="sr-only">Market value </span>
                {valuation ? formatWholeDollars(valuation.marketValue) : "—"}
              </span>
              {valuation ? (
                <span className="holding-row__gain" data-down={valuation.gain < 0}>
                  <span className="sr-only">Unrealized gain </span>
                  {formatGain(valuation.gainPercent)}
                  <span className="holding-row__gain-usd">{formatMoneyChange(valuation.gain)}</span>
                </span>
              ) : (
                <span className="holding-row__gain holding-row__gain--na">Price unavailable</span>
              )}
            </div>
          </li>
        ))}
      </ul>

      <p className="holdings-note">
        Returns are unrealized, gross of fees and dividends, and measured from each position&rsquo;s
        closing price on its purchase date. Non-US positions are converted to dollars at the exchange
        rate on the purchase date and today, so their gains include currency moves. Market value is
        shares held multiplied by the latest price. Weights are each position&rsquo;s share of current
        market value. Nothing on this page is investment advice.
      </p>
    </section>
  );
}
