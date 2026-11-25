# Breakfast equity long/short case study

Reproduce the tables and final rank sheet for `src/content/publications/low-net-equity-neutal-ls.mdx` from the repository root. The published run used pandas 3.1.0 and NumPy 2.5.4; `lxml` supplies the HTML table parser.

```sh
python3 -m venv /tmp/breakfast-venv
/tmp/breakfast-venv/bin/pip install 'pandas>=2.2,<4' 'numpy>=1.26,<3' lxml
/tmp/breakfast-venv/bin/python research/breakfast-long-short/backtest.py \
  --cache /tmp/breakfast-provider-cache \
  --out /tmp/breakfast-results \
  --sec-agent 'Your Research Organization contact@example.com'
```

Use your own SEC contact address. The script caches provider responses outside the repository; reuse the cache for exact local repeats. The public Yahoo Finance chart endpoint, Digrin HTML, and SEC Company Facts can change or rate-limit downloads; a fresh pull may differ. The website CSVs are the run underlying the article.

## Inputs and conventions

- **Coverage.** The ticker-to-CIK and group mapping is in the script. Yahoo supplies daily unadjusted-for-dividends and adjusted closes on the SPY session calendar; Digrin supplies monthly price and adjusted-price histories for K, KLG, and DENN. The active-series valuation price reverses Yahoo's in-window split normalization for the annual share-count proxy. Adjusted return data uses the vendor's treatment of distributions (including POST's BellRing distribution); price changes, not total returns, approximate position drift. This is not a survivorship-bias-free investable universe.
- **Corporate actions.** The three cash settlements are documented in the [KLG closing filing](https://www.sec.gov/Archives/edgar/data/1959348/000119312525219988/d37512d8k.htm), [K closing filing](https://www.sec.gov/Archives/edgar/data/55067/000119312525315130/d90636d8k.htm), and [DENN closing filing](https://www.sec.gov/Archives/edgar/data/852772/000119312526015085/d52435d8k.htm). K also went ex-dividend for [$0.58 on Dec. 1, 2025](https://www.digrin.com/stocks/detail/K/). For K's [October 2023 spin-off](https://www.sec.gov/Archives/edgar/data/55067/000119312523249062/d517693d8k.htm), credit one quarter of the KLG October closing price ($10.02) per K share held and treat that distribution as cash. The parent is out of the rankable pool until its next annual filing, and the subsidiary's September when-issued price is ignored.
- **Filing availability.** SEC Company Facts annual 10-K records are selected by original accession and filing date; no later 10-K or amendment supplies the earlier record. Ratios are accounting proxies, not a standardized vendor dataset. ROIC uses 79% of operating income over book equity plus net debt. FCF is operating cash flow less tagged capital expenditure. Equity value uses annual diluted shares, with fiscal-year or filing share counts as fallbacks. Debt uses tagged funded debt and available current borrowings. It excludes most operating leases and is not fully comparable across issuers. A missing tag can omit an input or make a name ineligible; the model does not impute the rank. Nonpositive EBITDA with available net debt receives the lowest possible raw leverage score. Group balancing changes selection, not the global percentile calculation.
- **Execution.** Monthly buys and sells fill at the last close without intramonth rebalancing; universe availability at the execution close can rule a stock out but ranks use the prior month's information only. Strategy weights reset to +100% long and −90% short on the rebalance schedule. Ties use ticker ordering. Costs are 15 bps per dollar traded and a flat annualized borrow fee on beginning short notional, based on calendar month-end intervals and cut short on a merger closing date. No initial margin, financing rates, market impact curve, historical locates or borrow recalls, cash yield, or final liquidation is modeled. BIL is used only to compute the excess return series for Sharpe. The small ingredient group, stale fundamentals, crude cost assumptions, and fixed watchlist make this exploratory.

## Outputs

- `monthly-results.csv`: 61 calendar-labeled returns for each variant at 1% borrow, with signed leg P&L as a fraction of opening equity, transaction and borrow cost deductions, beginning-weight group nets, tickers held, and any cash exits. `turnover` is the sum of absolute trade weights (not divided by two).
- `summary.csv`: compound annualized returns, sample monthly standard deviation scaled by √12, monthly excess Sharpe, month-end drawdown, OLS beta to SPY, mean contributions scaled by 12, and the average portfolio return in the six worst SPY months. Includes 1%, 3%, and 5% annualized borrow.
- `rank-sheet.csv`: last rebalance's common pool, original filing accession, percentile pillar scores, and portfolio weights. A zero weight means the name was not selected.
