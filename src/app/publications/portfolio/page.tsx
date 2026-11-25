import type { Metadata } from "next";
import Link from "next/link";
import {
  formatGain,
  formatMoney,
  formatMoneyChange,
  formatTradeDate,
  formatWholeDollars,
} from "@/data/holdings";
import { PicksPerformance } from "@/components/PicksPerformance";
import { formatPoints } from "@/data/performance";
import { pickHoldings } from "@/data/publication-picks";
import { getArticleSlugs } from "@/lib/articles";
import { getPicksPerformance, PICKS_BENCHMARK } from "@/lib/picks-performance";
import { formatPriceDate, getPortfolio, getPriceReturn } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Publication portfolio",
  description:
    "A hypothetical portfolio of the stocks our publications recommend, each bought on the day the piece was published and tracked against the S&P 500.",
};

const BENCHMARK = PICKS_BENCHMARK;

export default async function PublicationPortfolioPage() {
  const picks = pickHoldings();
  const [portfolio, benchmarkReturns] = await Promise.all([
    getPortfolio(picks),
    Promise.all(picks.map((pick) => getPriceReturn(BENCHMARK, pick.purchaseDate))),
  ]);
  const performance = await getPicksPerformance(portfolio.positions);
  const articleSlugs = getArticleSlugs();
  const priced = portfolio.positions.filter((position) => position.valuation);
  const hasPrices = priced.length > 0;

  // Same dollars in the S&P 500 on the same days: cost-weighted index return.
  let benchmarkCost = 0;
  let benchmarkGain = 0;
  for (const [index, position] of portfolio.positions.entries()) {
    const benchmark = benchmarkReturns[index];
    if (!position.valuation || benchmark == null) continue;
    benchmarkCost += position.valuation.costBasis;
    benchmarkGain += (position.valuation.costBasis * benchmark) / 100;
  }
  const benchmarkReturn = benchmarkCost > 0 ? (benchmarkGain / benchmarkCost) * 100 : null;
  const excess = hasPrices && benchmarkReturn != null ? portfolio.totalGainPercent - benchmarkReturn : null;

  return (
    <>
      <nav className="container breadcrumb meta-label" aria-label="Breadcrumb">
        <Link href="/publications">← Publications</Link>
        <span style={{ color: "var(--ochre)" }}>/</span>
        <span style={{ color: "var(--muted)" }}>Publication portfolio</span>
      </nav>

      <header className="container page-header portfolio-header picks-header">
        <div className="page-header__main">
          <h1 className="page-header__title">
            Paper Portfolio
          </h1>
        </div>

      </header>

      <div className="container">
        <p className="portfolio-date">
          Hypothetical portfolio
          {portfolio.asOf ? ` | Oldest priced quote ${formatPriceDate(portfolio.asOf)}` : ""}
        </p>
        <dl className="fact-strip portfolio-stats" aria-describedby="picks-method">
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
            <dt className="meta-label">vs S&amp;P 500</dt>
            <dd className={excess == null ? undefined : excess < 0 ? "is-down" : "is-up"}>
              {excess == null ? "—" : formatPoints(excess)}
            </dd>
          </div>
        </dl>
        <p className="portfolio-method" id="picks-method">
          Total gain over total cost basis, where each pick&rsquo;s cost is its close on the
          publication date. The S&amp;P 500 comparison puts the same dollars into the index on the
          same days. Price returns only: no dividends, fees or sales. Prices from Yahoo Finance,
          refreshed hourly.
          {portfolio.unpricedCount > 0 &&
            ` ${portfolio.unpricedCount} of ${picks.length} picks could not be priced and are excluded.`}
        </p>
      </div>

      <PicksPerformance performance={performance} articleSlugs={articleSlugs} />

      <section className="container picks" aria-labelledby="picks-title">
        <div className="section-head">
          <h2 id="picks-title" className="section-head__title">
            Picks
          </h2>
          <span className="section-head__meta meta-label">
            {picks.length} {picks.length === 1 ? "pick" : "picks"} · newest first
          </span>
        </div>

        {picks.length === 0 ? (
          <p className="empty">No publication has initiated a position yet.</p>
        ) : (
          <>
            <div className="picks-columns meta-label" aria-hidden="true">
              <span>No.</span>
              <span>Company</span>
              <span>Publication</span>
              <span className="num">Price</span>
              <span className="num">S&amp;P 500</span>
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
                      {articleSlugs.includes(pick.pick.publication) ? (
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
                      <span className="sr-only">S&amp;P 500 over the same period </span>
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
          These are hypothetical paper trades, not positions the fund holds; see the{" "}
          <Link className="text-link" href="/portfolio">
            fund portfolio
          </Link>{" "}
          for those. Current hypothetical value: {hasPrices ? formatWholeDollars(portfolio.totalValue) : "—"}.
          Non-US picks are converted to dollars at the initiation-date and latest exchange rates.
          Nothing on this page is investment advice.
        </p>
      </section>
    </>
  );
}
