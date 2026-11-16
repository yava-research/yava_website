import type { Metadata } from "next";
import { HoldingsIndex } from "@/components/HoldingsIndex";
import { PortfolioPerformance } from "@/components/PortfolioPerformance";
import {
  countryCount,
  formatGain,
  formatMoneyChange,
  formatWholeDollars,
  holdings,
} from "@/data/holdings";
import { getPerformance } from "@/lib/benchmarks";
import { formatPriceDate, getHistoricalReturns, getPortfolio } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "The YAMF portfolio: performance against the S&P 500, Dow Jones, Nasdaq 100 and Russell 3000 benchmarks, plus the public equity positions and research behind each one.",
};

export default async function PortfolioPage() {
  const [portfolio, performance] = await Promise.all([getPortfolio(), getPerformance()]);
  const historicalReturns = await getHistoricalReturns(performance.map((point) => point.date));
  const chartPerformance = performance.map((point, index) => ({ ...point, fund: historicalReturns[index] }));
  const hasPrices = portfolio.unpricedCount < holdings.length;

  return (
    <>
      <header className="container page-header portfolio-header">
        <div className="page-header__main">
          <h1 className="page-header__title">
            The fund,
            <br />
            measured.
          </h1>
        </div>
        <p className="page-header__blurb">
          {holdings.length} positions across {countryCount} countries. Track cumulative performance
          against the S&amp;P 500, Dow Jones, Nasdaq 100 and Russell 3000, then browse the holdings
          and the research behind them.
        </p>
      </header>

      <div className="container">
        <p className="portfolio-date">
          Portfolio snapshot
          {portfolio.asOf ? ` · oldest priced quote ${formatPriceDate(portfolio.asOf)}` : ""}
        </p>
        <dl className="fact-strip portfolio-stats" aria-describedby="return-method">
          <div>
            <dt className="mono-label">Positions</dt>
            <dd>{holdings.length}</dd>
          </div>
          <div>
            <dt className="mono-label">Unrealized gain</dt>
            <dd className={hasPrices ? (portfolio.totalGain < 0 ? "is-down" : "is-up") : undefined}>
              {hasPrices ? formatGain(portfolio.totalGainPercent) : "—"}
            </dd>
          </div>
          <div>
            <dt className="mono-label">Unrealized P&amp;L</dt>
            <dd className={hasPrices ? (portfolio.totalGain < 0 ? "is-down" : "is-up") : undefined}>
              {hasPrices ? formatMoneyChange(portfolio.totalGain) : "—"}
            </dd>
          </div>
          <div>
            <dt className="mono-label">Priced holdings value</dt>
            <dd>{hasPrices ? formatWholeDollars(portfolio.totalValue) : "—"}</dd>
          </div>
        </dl>
        <p className="portfolio-method" id="return-method">
          Total unrealized gain over total cost basis, before fees and dividends. Each position&rsquo;s
          cost is its closing price on the purchase date; current prices come from Yahoo Finance and
          refresh hourly. The holdings value includes priced positions only. This snapshot is not a
          time-weighted or money-weighted fund return.
          {portfolio.unpricedCount > 0 &&
            ` ${portfolio.unpricedCount} of ${holdings.length} positions could not be priced and are excluded.`}
        </p>
      </div>

      <PortfolioPerformance points={chartPerformance} />

      <HoldingsIndex positions={portfolio.positions} />
    </>
  );
}
