// Ex-US picks, rendered under the publication picks on /publications/portfolio
// (page.tsx). Same layout and method as the picks above, tracked against the
// FTSE Global All Cap ex US Index instead of the S&P 500. Not a route: only
// page.tsx is.

import Link from "next/link";
import { formatGain, formatMoney, formatMoneyChange, formatTradeDate } from "@/data/holdings";
import { PicksPerformance, type PicksBenchmark } from "@/components/PicksPerformance";
import { formatPoints } from "@/data/performance";
import { exUsPickHoldings } from "@/data/publication-picks-ex-us";
import {
  EX_US_INDEX,
  EX_US_PICKS_CHART_START,
  getExUsBenchmark,
  getExUsPicksPerformance,
} from "@/lib/picks-performance-ex-us";
import { formatPriceDate, getPortfolio, getPriceReturn } from "@/lib/portfolio";

const INDEX_NAME = "FTSE Global All Cap ex US";

export async function ExUsPicks({ articleSlugs }: { articleSlugs: string[] }) {
  const picks = exUsPickHoldings();
  const earliest = picks.reduce(
    (min, pick) => (pick.purchaseDate < min ? pick.purchaseDate : min),
    EX_US_PICKS_CHART_START,
  );
  const symbol = await getExUsBenchmark(earliest);
  const [portfolio, benchmarkReturns] = await Promise.all([
    getPortfolio(picks),
    Promise.all(picks.map((pick) => getPriceReturn(symbol, pick.purchaseDate))),
  ]);
  const performance = await getExUsPicksPerformance(portfolio.positions, symbol);
  const priced = portfolio.positions.filter((position) => position.valuation);
  const hasPrices = priced.length > 0;

  const benchmark: PicksBenchmark = {
    name: INDEX_NAME,
    source:
      symbol === EX_US_INDEX
        ? `${EX_US_INDEX}, the ${INDEX_NAME} Index`
        : `${symbol}, the Vanguard Total International Stock ETF, which tracks the ${INDEX_NAME} Index (${EX_US_INDEX}); Yahoo Finance has no daily history for the index itself`,
  };

  // Same dollars in the index on the same days: cost-weighted index return.
  let benchmarkCost = 0;
  let benchmarkGain = 0;
  for (const [index, position] of portfolio.positions.entries()) {
    const benchmarkReturn = benchmarkReturns[index];
    if (!position.valuation || benchmarkReturn == null) continue;
    benchmarkCost += position.valuation.costBasis;
    benchmarkGain += (position.valuation.costBasis * benchmarkReturn) / 100;
  }
  const benchmarkReturn = benchmarkCost > 0 ? (benchmarkGain / benchmarkCost) * 100 : null;
  const excess = hasPrices && benchmarkReturn != null ? portfolio.totalGainPercent - benchmarkReturn : null;

  return (
    <>
      <section className="container picks" aria-labelledby="ex-us-title">
        <div className="section-head">
          <h2 id="ex-us-title" className="section-head__title">
            Ex-US picks
          </h2>
          <span className="section-head__meta meta-label">vs {INDEX_NAME}</span>
        </div>
        <p className="portfolio-date">
          Hypothetical portfolio
          {portfolio.asOf ? ` | Oldest priced quote ${formatPriceDate(portfolio.asOf)}` : ""}
        </p>
        <dl className="fact-strip portfolio-stats" aria-describedby="ex-us-method">
          <div>
            <dt className="meta-label">Picks</dt>
            <dd>{picks.length}</dd>
          </div>
          <div>
            <dt className="meta-label">Gain since initiation</dt>
            <dd className={hasPrices ? (portfolio.totalGain < 0 ? "is-down" : "is-up") : undefined}>
              {hasPrices ? formatGain(portfolio.totalGainPercent) : "—"}
            </dd>
          </div>
          <div>
            <dt className="meta-label">Hypothetical P&amp;L</dt>
            <dd className={hasPrices ? (portfolio.totalGain < 0 ? "is-down" : "is-up") : undefined}>
              {hasPrices ? formatMoneyChange(portfolio.totalGain) : "—"}
            </dd>
          </div>
          <div>
            <dt className="meta-label">vs {INDEX_NAME}</dt>
            <dd className={excess == null ? undefined : excess < 0 ? "is-down" : "is-up"}>
              {excess == null ? "—" : formatPoints(excess)}
            </dd>
          </div>
        </dl>
        <p className="portfolio-method" id="ex-us-method">
          Total gain over total cost basis, where each pick&rsquo;s cost is its close on the
          initiation date, converted to dollars. The {INDEX_NAME} comparison puts the same dollars
          into the index on the same days. Price returns only: no dividends, fees or sales. Prices
          from Yahoo Finance ({symbol}), refreshed hourly.
          {portfolio.unpricedCount > 0 &&
            ` ${portfolio.unpricedCount} of ${picks.length} picks could not be priced and are excluded.`}
        </p>
      </section>

      <PicksPerformance
        performance={performance}
        articleSlugs={articleSlugs}
        benchmark={benchmark}
        picksLabel="Ex-US picks"
        id="ex-us-performance"
      />

      <section className="container picks" aria-labelledby="ex-us-list-title">
        <div className="section-head">
          <h2 id="ex-us-list-title" className="section-head__title">
            Ex-US holdings
          </h2>
          <span className="section-head__meta meta-label">
            {picks.length} {picks.length === 1 ? "pick" : "picks"} · newest first
          </span>
        </div>

        {picks.length === 0 ? (
          <p className="empty">No ex-US position has been initiated yet.</p>
        ) : (
          <>
            <div className="picks-columns meta-label" aria-hidden="true">
              <span>No.</span>
              <span>Company</span>
              <span>Publication</span>
              <span className="num">Price</span>
              <span className="num">FTSE ex US</span>
              <span className="num">Since initiation</span>
            </div>
            <ul className="picks-list">
              {portfolio.positions
                .map((position, index) => ({ position, benchmark: benchmarkReturns[index] }))
                .sort((a, b) => b.position.purchaseDate.localeCompare(a.position.purchaseDate))
                .map(({ position: { valuation, ...pick }, benchmark }, index) => (
                  <li key={pick.slug} className="pick-row">
                    <span className="pick-row__num meta-label">{String(index + 1).padStart(2, "0")}</span>
                    <span className="pick-row__company">
                      <span className="pick-row__name">{pick.name}</span>
                      <span className="pick-row__ticker meta-label">
                        {pick.ticker} · {pick.sector}
                      </span>
                      <span className="pick-row__lot meta-label">
                        {pick.shares.toLocaleString("en-US")} sh · initiated{" "}
                        {formatTradeDate(pick.purchaseDate)}
                      </span>
                    </span>
                    <span className="pick-row__publication">
                      {!pick.analysis.title ? (
                        "—"
                      ) : articleSlugs.includes(pick.pick.publication) ? (
                        <Link className="text-link" href={pick.analysis.href}>
                          {pick.analysis.title}
                        </Link>
                      ) : (
                        pick.analysis.title
                      )}
                    </span>
                    <span className="pick-row__price">
                      <span className="sr-only">Initiation price to latest price </span>
                      {valuation ? (
                        <>
                          {formatMoney(valuation.purchasePrice)}
                          <span className="pick-row__sub">→ {formatMoney(valuation.price)}</span>
                        </>
                      ) : (
                        "—"
                      )}
                    </span>
                    <span className="pick-row__benchmark">
                      <span className="sr-only">{INDEX_NAME} over the same period </span>
                      {benchmark == null ? "—" : formatGain(benchmark)}
                      {valuation && benchmark != null && (
                        <span className="pick-row__sub">{formatPoints(valuation.gainPercent - benchmark)} rel.</span>
                      )}
                    </span>
                    {valuation ? (
                      <span className="pick-row__gain" data-down={valuation.gain < 0}>
                        <span className="sr-only">Gain since initiation </span>
                        {formatGain(valuation.gainPercent)}
                        <span className="pick-row__gain-usd">{formatMoneyChange(valuation.gain)}</span>
                      </span>
                    ) : (
                      <span className="pick-row__gain pick-row__gain--na">Price unavailable</span>
                    )}
                  </li>
                ))}
            </ul>
          </>
        )}

        <p className="holdings-note">
          Hypothetical paper trades, not fund positions. Picks are converted to dollars at the
          initiation-date and latest exchange rates, so returns include currency moves, as does the
          dollar-denominated index. Nothing on this page is investment advice.
        </p>
      </section>
    </>
  );
}
