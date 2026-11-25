"""Monthly breakfast-equity case study. See README.md for inputs and assumptions."""

import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import date
from functools import cache
import json
from pathlib import Path
from urllib.request import Request, urlopen

import numpy as np
import pandas as pd

GROUPS = {
    "Packaged": dict(GIS=40704, POST=1530950, SJM=91419, K=55067, KLG=1959348,
                     FLO=1128928, JJSF=785956, BGS=1278027, CAG=23217, MDLZ=1103982),
    "Restaurant": dict(FWRG=1789940, DENN=852772, SBUX=829224, MCD=63908,
                       BROS=1866581, QSR=1618756, JACK=807882, DIN=49754,
                       CBRL=1067294, WEN=30697),
    "Ingredients": dict(CALM=16160, HRL=48465, TSN=100493, KHC=1637459),
}
CIKS = {ticker: cik for names in GROUPS.values() for ticker, cik in names.items()}
EXITS = {"KLG": ("2025-09-26", 23.00), "K": ("2025-12-11", 83.50),
         "DENN": ("2026-01-16", 6.25)}
EXIT_MONTH_DIVIDENDS = {"K": .58}  # Ex-date Dec 1, before the Dec 11 cash-out.
MODEL_NAMES = ("momentum", "multifactor", "group_balanced")
FIRST_FORMATION, LAST_MONTH = "2020-12-31", "2026-01-31"
YAHOO_QUERY = "period1=1514764800&period2=1770076800&interval=1d&events=div%2Csplits"


def download(root, filename, url, agent):
    path = root / filename
    if not path.exists():
        with urlopen(Request(url, headers={"User-Agent": agent}), timeout=40) as response:
            path.write_bytes(response.read())
    return path


def market_data(root, ticker, calendar):
    if ticker in EXITS:
        path = download(root, f"{ticker}.html", f"https://www.digrin.com/stocks/detail/{ticker}/price", "Mozilla/5.0")
        raw = pd.read_html(path)[0]
        raw.index = pd.to_datetime(raw["Date"], format="%B %Y") + pd.offsets.MonthEnd()
        raw = raw.rename(columns={"Real price": "price", "Adjusted price": "adjusted"})
        raw = raw[["price", "adjusted"]].replace(r"[$,]", "", regex=True).astype(float).sort_index()
        event, payout = EXITS[ticker]
        terminal_month = pd.Timestamp(event) + pd.offsets.MonthEnd()
        raw = raw.loc[:terminal_month].copy()
        raw["valuation_price"] = raw.price
        raw["total_return"] = raw.adjusted.pct_change(fill_method=None)
        raw["price_return"] = raw.price.pct_change(fill_method=None)
        prev_close = raw.price.shift().loc[terminal_month]
        raw.loc[terminal_month, "total_return"] = (payout + EXIT_MONTH_DIVIDENDS.get(ticker, 0)) / prev_close - 1
        raw.loc[terminal_month, "price_return"] = payout / prev_close - 1
        if ticker == "K":
            # Oct 2, 2023: holders received 1 KLG share for each 4 K shares.
            # Mark the distribution at KLG's October close, then treat it as cash.
            spin_month = pd.Timestamp("2023-10-31")
            raw.loc[spin_month, "total_return"] = (raw.price.loc[spin_month] + 10.02 / 4) / raw.price.shift().loc[spin_month] - 1
        # KLG's September 2023 when-issued quote predates regular-way trading.
        return raw.loc["2023-10-01":] if ticker == "KLG" else raw

    path = download(root, f"{ticker}.jsonx", f"https://query2.finance.yahoo.com/v8/finance/chart/{ticker}?{YAHOO_QUERY}", "Mozilla/5.0")
    result = json.loads(path.read_text())["chart"]["result"][0]
    dates = pd.to_datetime(result["timestamp"], unit="s", utc=True).tz_convert("America/New_York").tz_localize(None).normalize()
    daily = pd.DataFrame({"price": result["indicators"]["quote"][0]["close"],
                          "adjusted": result["indicators"]["adjclose"][0]["adjclose"]}, index=dates)
    daily = daily.dropna().reindex(calendar)
    raw = daily.groupby(daily.index + pd.offsets.MonthEnd()).nth(-1)
    raw.index += pd.offsets.MonthEnd()
    raw["valuation_price"] = raw.price
    for split in result.get("events", {}).get("splits", {}).values():
        split_month = pd.Timestamp(split["date"], unit="s") + pd.offsets.MonthEnd()
        raw.loc[raw.index < split_month.normalize(), "valuation_price"] *= split["numerator"] / split["denominator"]
    raw["total_return"] = raw.adjusted.pct_change(fill_method=None)
    raw["price_return"] = raw.price.pct_change(fill_method=None)
    return raw


def filings(root, ticker, agent):
    path = download(root, f"{ticker}.sec", f"https://data.sec.gov/api/xbrl/companyfacts/CIK{CIKS[ticker]:010}.json?source=research", agent)
    facts = json.loads(path.read_text())["facts"]
    gaap = facts["us-gaap"]
    reports = {r["filed"]: r for r in sorted(gaap["Assets"]["units"]["USD"], key=lambda row: row["end"])
               if r["form"] == "10-K" and r["filed"] <= LAST_MONTH}
    output = []
    for report in reports.values():
        end = date.fromisoformat(report["end"])

        @cache
        def fact(tags, duration=False, prior=False, unit="USD", namespace="us-gaap"):
            for tag in tags.split():
                items = facts.get(namespace, {}).get(tag, {}).get("units", {}).get(unit, [])
                values = []
                for row in items:
                    if row["accn"] != report["accn"]:
                        continue
                    stop = date.fromisoformat(row["end"])
                    if prior and not 350 <= (end - stop).days <= 380:
                        continue
                    if not prior and stop != end:
                        continue
                    if duration != ("start" in row):
                        continue
                    if duration and not 350 <= (stop - date.fromisoformat(row["start"])).days <= 380:
                        continue
                    values.append(row["val"])
                if values:
                    return values[-1]
            return np.nan

        rev = "Revenues RevenueFromContractWithCustomerExcludingAssessedTax RevenueFromContractWithCustomerIncludingAssessedTax SalesRevenueNet"
        sales, prior_sales = fact(rev, True), fact(rev, True, True)
        op = fact("OperatingIncomeLoss", True)
        if ticker == "DIN" and np.isnan(op):
            # Income before taxes plus interest; includes small non-operating items.
            op = fact("IncomeLossFromContinuingOperationsBeforeIncomeTaxesExtraordinaryItemsNoncontrollingInterest", True) + fact("InterestExpense InterestAndDebtExpense", True)
        cash = fact("CashAndCashEquivalentsAtCarryingValue CashAndCashEquivalentsAtCarryingValueIncludingDiscontinuedOperations")
        da = fact("DepreciationAndAmortization DepreciationDepletionAndAmortization DepreciationAmortizationAndAccretionNet", True)
        if np.isnan(da):
            da = fact("Depreciation", True) + np.nan_to_num(fact("AmortizationOfIntangibleAssets", True))
        fcf = fact("NetCashProvidedByUsedInOperatingActivities", True) - fact("PaymentsToAcquirePropertyPlantAndEquipment PaymentsToAcquireProductiveAssets PaymentsToAcquirePropertyPlantAndEquipmentAndIntangibleAssets", True)
        debt = fact("LongTermDebtAndCapitalLeaseObligationsIncludingCurrentMaturities DebtAndCapitalLeaseObligations LongTermDebt")
        current = fact("LongTermDebtAndCapitalLeaseObligationsCurrent LongTermDebtAndFinanceLeaseObligationsCurrent LongTermDebtCurrent")
        noncurrent = fact("LongTermDebtAndCapitalLeaseObligations LongTermDebtAndFinanceLeaseObligationsNoncurrent LongTermDebtNoncurrent")
        if np.isnan(debt) and not np.isnan(noncurrent):
            debt = noncurrent + np.nan_to_num(current)
        if np.isnan(debt) and ticker in ("CALM", "JJSF"):
            debt = 0  # No funded long-term debt reported when these tags are absent.
        short_debt = fact("ShortTermBorrowings DebtCurrent NotesPayableCurrent")
        if not np.isnan(short_debt) and (np.isnan(current) or short_debt != current):
            debt += short_debt
        equity = fact("StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest StockholdersEquity")
        capital, ebitda = equity + debt - cash, op + da
        shares = fact("WeightedAverageNumberOfDilutedSharesOutstanding WeightedAverageNumberOfSharesOutstandingBasic", True, unit="shares")
        if not shares > 0:
            shares = fact("CommonStockSharesOutstanding", unit="shares")
        if not shares > 0:
            cover = facts.get("dei", {}).get("EntityCommonStockSharesOutstanding", {}).get("units", {}).get("shares", [])
            matches = [r for r in cover if r["accn"] == report["accn"]]
            shares = max(matches, key=lambda r: r["end"])["val"] if matches else np.nan
        output.append(dict(filed=report["filed"], accession=report["accn"], shares=shares, fcf=fcf,
                           ebitda=ebitda, net_debt=debt - cash,
                           roic=.79 * op / capital if capital > 0 else np.nan,
                           margin=op / sales if sales > 0 else np.nan,
                           fcf_assets=fcf / report["val"],
                           leverage=-(debt - cash) / ebitda if ebitda > 0 else (
                               -np.inf if ebitda <= 0 and not np.isnan(debt - cash) else np.nan),
                           growth=sales / prior_sales - 1 if prior_sales > 0 else np.nan))
    return sorted(output, key=lambda row: row["filed"])


def rank_snapshot(formation, market, fundamentals):
    signal_end = formation - pd.offsets.MonthEnd()
    momentum_months = pd.date_range(formation - pd.offsets.MonthEnd(11), signal_end, freq="ME")
    rows = {}
    for ticker, frame in market.items():
        if ticker not in CIKS or (ticker in EXITS and pd.Timestamp(EXITS[ticker][0]) <= formation):
            continue
        history = frame.total_return.reindex(momentum_months)
        if history.isna().any() or formation not in frame.index or pd.isna(frame.at[formation, "price"]):
            continue
        available = [r for r in fundamentals[ticker] if r["filed"] <= signal_end.date().isoformat()]
        if not available:
            continue
        r = available[-1]
        # Do not mix the old combined Kellogg financials with the ex-spin price.
        if ticker == "K" and formation >= pd.Timestamp("2023-10-01") and r["filed"] < "2024-01-01":
            continue
        cap = r["shares"] * frame.at[signal_end, "valuation_price"]
        ev = cap + r["net_debt"]
        rows[ticker] = {**r, "momentum": (1 + history).prod() - 1,
                        "fcf_yield": r["fcf"] / cap if cap > 0 else np.nan,
                        "ebitda_ev": r["ebitda"] / ev if ev > 0 and r["ebitda"] > 0 else np.nan}
    snap = pd.DataFrame.from_dict(rows, orient="index").sort_index()
    quality = ["roic", "margin", "fcf_assets", "leverage"]
    value = ["fcf_yield", "ebitda_ev"]
    snap = snap[snap[quality].notna().sum(axis=1).ge(2) & snap[value].notna().any(axis=1) & snap.growth.notna()]
    ranks = snap[["momentum", "growth", *quality, *value]].rank(pct=True)
    return snap.assign(momentum_score=ranks.momentum,
                       quality_score=ranks[quality].mean(axis=1), value_score=ranks[value].mean(axis=1),
                       growth_score=ranks.growth, composite=.30 * ranks.momentum + .10 * ranks.growth
                       + .40 * ranks[quality].mean(axis=1) + .20 * ranks[value].mean(axis=1))


def weights(snap, model):
    score = "momentum_score" if model == "momentum" else "composite"
    ordered = snap.sort_values(score, ascending=False, kind="stable").index
    if model == "group_balanced":
        pools = [([t for t in ordered if t in GROUPS[group]], count)
                 for group, count in zip(GROUPS, (2, 2, 1))]
        if any(len(pool) < max(3, 2 * count) for pool, count in pools):
            raise ValueError(f"Too few constituents for group balance: {pools}")
    else:
        if len(ordered) < 10:
            raise ValueError("Fewer than ten rankable stocks")
        pools = [(ordered, 5)]
    return {t: w for pool, count in pools for basket, w in ((pool[:count], .20), (pool[-count:], -.18)) for t in basket}


def simulate(snapshots, market, model, fee):
    drift = {}
    rows = []
    for formation, snap in snapshots.items():
        end = formation + pd.offsets.MonthEnd()
        w = weights(snap, model)
        turnover = sum(abs(w.get(t, 0) - drift.get(t, 0)) for t in sorted(w.keys() | drift.keys()))
        long_pnl = short_pnl = borrow = 0.
        next_drift, exits = {}, []
        for ticker, weight in w.items():
            r = market[ticker].loc[end]
            if not np.isfinite(r.total_return) or not np.isfinite(r.price_return):
                raise ValueError(f"Missing holding-period data: {ticker} {end.date()}")
            exit_day = pd.Timestamp(EXITS[ticker][0]) if ticker in EXITS else end
            holding_end = min(end, exit_day)
            if weight > 0:
                long_pnl += weight * r.total_return
            else:
                short_pnl += weight * r.total_return
                borrow += -weight * fee * (holding_end - formation).days / 365
            if ticker in EXITS and exit_day <= end:
                exits.append(ticker)
            else:
                next_drift[ticker] = weight * (1 + r.price_return)
        gross = long_pnl + short_pnl
        trading = .0015 * turnover
        net = gross - trading - borrow
        if net <= -1:
            raise ValueError(f"Portfolio equity exhausted: {model} {end.date()}")
        drift = {t: v / (1 + net) for t, v in next_drift.items()}
        rows.append(dict(month=end, model=model, eligible=len(snap), long_pnl=long_pnl,
                         short_pnl=short_pnl, gross=gross, trading=trading, borrow=borrow,
                         net=net, turnover=turnover, spy=market["SPY"].at[end, "total_return"],
                         bil=market["BIL"].at[end, "total_return"], delisting=" ".join(exits),
                         longs=" ".join(t for t in w if w[t] > 0), shorts=" ".join(t for t in w if w[t] < 0),
                         **{f"net_{g.lower()}": sum(w.get(t, 0.) for t in names) for g, names in GROUPS.items()}))
    return pd.DataFrame(rows)


def metrics(rows):
    net = rows.net
    excess = net - rows.bil
    wealth = np.r_[1., (1 + net).cumprod().to_numpy()]
    return dict(net_cagr=wealth[-1] ** (12 / len(rows)) - 1,
                gross_cagr=(1 + rows.gross).prod() ** (12 / len(rows)) - 1,
                volatility=net.std() * np.sqrt(12), sharpe=excess.mean() / excess.std() * np.sqrt(12),
                drawdown=(wealth / np.maximum.accumulate(wealth) - 1).min(),
                beta=net.cov(rows.spy) / rows.spy.var(),
                long_annual=12 * rows.long_pnl.mean(), short_annual=12 * rows.short_pnl.mean(),
                turnover=rows.turnover.mean(), fee_drag=12 * (rows.trading + rows.borrow).mean(),
                worst_spy_months=net[rows.spy.rank(method="first") <= 6].mean())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cache", type=Path, required=True, help="Directory for provider response files")
    parser.add_argument("--out", type=Path, required=True, help="Directory for result CSVs")
    parser.add_argument("--sec-agent", required=True, help="SEC user agent, including organization and contact email")
    args = parser.parse_args()
    args.cache.mkdir(parents=True, exist_ok=True)
    args.out.mkdir(parents=True, exist_ok=True)
    spy_path = download(args.cache, "SPY.jsonx", f"https://query2.finance.yahoo.com/v8/finance/chart/SPY?{YAHOO_QUERY}", "Mozilla/5.0")
    spy = json.loads(spy_path.read_text())["chart"]["result"][0]
    calendar = pd.to_datetime(spy["timestamp"], unit="s", utc=True).tz_convert("America/New_York").tz_localize(None).normalize()
    with ThreadPoolExecutor(max_workers=4) as pool:
        symbols = [*CIKS, "SPY", "BIL"]
        market = dict(zip(symbols, pool.map(lambda t: market_data(args.cache, t, calendar), symbols)))
        fundamentals = dict(zip(CIKS, pool.map(lambda t: filings(args.cache, t, args.sec_agent), CIKS)))
    formations = pd.date_range(FIRST_FORMATION, pd.Timestamp(LAST_MONTH) - pd.offsets.MonthEnd(), freq="ME")
    snapshots = {t: rank_snapshot(t, market, fundamentals) for t in formations}
    monthly = pd.concat([simulate(snapshots, market, model, .01) for model in MODEL_NAMES])
    monthly.sort_values(["month", "model"]).to_csv(args.out / "monthly-results.csv", index=False, float_format="%.10f")
    summary = pd.DataFrame([dict(model=model, borrow_rate=fee, **metrics(simulate(snapshots, market, model, fee)))
                            for model in MODEL_NAMES for fee in (.01, .03, .05)])
    summary.to_csv(args.out / "summary.csv", index=False, float_format="%.10f")
    # Final formation's common rank sheet, with the three baskets side by side.
    latest = snapshots[formations[-1]].sort_values("composite", ascending=False, kind="stable").copy()
    for model in MODEL_NAMES:
        latest[model + "_weight"] = pd.Series(weights(latest.sort_index(), model)).reindex(latest.index, fill_value=0.)
    latest.insert(0, "formation", formations[-1].date())
    latest.insert(1, "group", [next(g for g, names in GROUPS.items() if t in names) for t in latest.index])
    latest[["formation", "group", "filed", "accession", "momentum_score", "quality_score", "value_score",
            "growth_score", "composite", *(m + "_weight" for m in MODEL_NAMES)]].to_csv(
                args.out / "rank-sheet.csv", index_label="ticker", float_format="%.6f")
    print(summary.round(4).to_string(index=False))


if __name__ == "__main__":
    main()
