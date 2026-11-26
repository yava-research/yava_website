// Hypothetical ex-US positions, shown under the publication picks on
// /publications/portfolio and tracked against the FTSE Global All Cap ex US
// Index. Same shape and pricing as publication-picks.ts.
//
// To add a pick: give the initiation date and a hypothetical share count, plus
// the publication slug (from publications.ts) if a piece made the call; leave
// it "" otherwise. Picks with no initiation date yet are left off the page.
// Cost basis is that day's close, or the next trading day's close if
// the market was shut. Cost basis is that day's close, or the next trading day's close if
// the market was shut. Prices come from Yahoo Finance via src/lib/portfolio.ts.

import type { HoldingSector } from "@/data/holdings";
import { publications } from "@/data/publications";
import type { PickHolding } from "@/data/publication-picks";

export type PublicationPick = {
  slug: string;
  /** Yahoo Finance symbol, e.g. "CRWD" or "7762.T". */
  ticker: string;
  name: string;
  exchange: string;
  sector: HoldingSector;
  city: string;
  country: string;
  /** Slug of the publication that made the call, or "" if none. */
  publication: string;
  /** Publication date, YYYY-MM-DD. The hypothetical buy happens at this close. */
  initiationDate: string;
  /** Hypothetical shares bought on the initiation date. */
  shares: number;
};

export const publicationPicks: PublicationPick[] = [
  {
    slug: "spirehk",
    ticker: "0019.HK",
    name: "Swire Pacific Limited",
    exchange: "HKSE",
    sector: "Industrials",
    city: "Hong Kong",
    country: "Hong Kong",
    publication: "",
    initiationDate: "2026-08-13",
    shares: 45,
  },
  {
    slug: "kcholis",
    ticker: "KCHOL.IS",
    name: "Koç Holding A.S.",
    exchange: "Istanbul",
    sector: "Industrials",
    city: "Istanbul",
    country: "Turkey",
    publication: "",
    initiationDate: "2026-09-14",
    shares: 22,
  },
  {
    slug: "tavholdings",
    ticker: "TAVHL.IS",
    name: "TAV Havalimanlari Holding A.S.",
    exchange: "Istanbul",
    sector: "Industrials",
    city: "Istanbul",
    country: "Turkey",
    publication: "",
    initiationDate: "2026-09-14",
    shares: 22,
  },
  /*{
    slug: "sise",
    ticker: "SISE.IS",
    name: "Türkiye Sise Ve Cam Fabrikalari A.S.",
    exchange: "Istanbul",
    sector: "Industrials",
    city: "Istanbul",
    country: "Turkey",
    publication: "",
    initiationDate: "2026-11-04",
    shares: 22,
  },*/
  {
    slug: "keyto",
    ticker: "KEY.TO",
    name: "Keyera Corp. ",
    exchange: "Toronto",
    sector: "Energy",
    city: "Calgary",
    country: "Canada",
    publication: "",
    initiationDate: "2026-09-01",
    shares: 11,
  },
  {
    slug: "5nplus",
    ticker: "VNP.TO",
    name: "5N Plus Inc.",
    exchange: "Toronto",
    sector: "Semiconductors + AI",
    city: "Montreal",
    country: "Canada",
    publication: "",
    initiationDate: "2026-09-01",
    shares: 18,
  },
  {
    slug: "aritzia",
    ticker: "ATZ.TO",
    name: "Aritzia Inc.",
    exchange: "Toronto",
    sector: "Consumer Cyclical",
    city: "Vancouver",
    country: "Canada",
    publication: "",
    initiationDate: "2026-09-01",
    shares: 7,
  },
  {
    slug: "torex",
    ticker: "TXR.TO",
    name: "Torex Resources Inc.",
    exchange: "Toronto",
    sector: "Basic Materials",
    city: "Toronto",
    country: "Canada",
    publication: "",
    initiationDate: "2026-09-01",
    shares: 8,
  },
  {
    slug: "coloplast",
    ticker: "COLO-B.CO",
    name: "Coloplast A/S.",
    exchange: "Copenhagen",
    sector: "Industrials",
    city: "Humlebæk",
    country: "Denmark",
    publication: "",
    initiationDate: "2026-10-01",
    shares: 24,
  },
  {
    slug: "alamtri",
    ticker: "ADRO.JK",
    name: "PT Alamtri Resources Indonesia Tbk.",
    exchange: "Jakarta",
    sector: "Energy",
    city: "Jakarta",
    country: "Indonesia",
    publication: "",
    initiationDate: "2026-08-13",
    shares: 100,
  },
  {
    slug: "cprmilan",
    ticker: "CPR.MI",
    name: "Davide Campari-Milano N.V.",
    exchange: "Milan",
    sector: "Consumer Defensive",
    city: "Milan",
    country: "Italy",
    publication: "",
    initiationDate: "2026-10-23",
    shares: 25,
  },
  {
    slug: "bruckhardt",
    ticker: "BCHN.SW",
    name: "Burckhardt Compression Holding AG",
    exchange: "Swiss",
    sector: "Industrials",
    city: "Zurich",
    country: "Switzerland",
    publication: "",
    initiationDate: "2026-10-09",
    shares: 37,
  },
  {
    slug: "avolta",
    ticker: "AVOL.SW",
    name: "Avolta Holding AG",
    exchange: "Swiss",
    sector: "Industrials",
    city: "Zurich",
    country: "Switzerland",
    publication: "",
    initiationDate: "2026-10-09",
    shares: 19,
  },
  {
    slug: "dez",
    ticker: "DEZ.DE",
    name: "DEUTZ Aktiengesellschaft",
    exchange: "XETRA",
    sector: "Industrials",
    city: "Cologne",
    country: "Germany",
    publication: "",
    initiationDate: "2026-10-23",
    shares: 33,
  },
  {
    slug: "pkobank",
    ticker: "PKO.WA",
    name: "PKO Bank Polski",
    exchange: "Warsaw",
    sector: "Financials",
    city: "Warsaw",
    country: "Poland",
    publication: "",
    initiationDate: "2026-10-23",
    shares: 26,
  },
  {
    slug: "nordeabank",
    ticker: "NDA-FI.HE",
    name: "Nordea Bank Abp",
    exchange: "Helskinki",
    sector: "Financials",
    city: "Helskini",
    country: "Finland",
    publication: "",
    initiationDate: "2026-10-01",
    shares: 36,
  },
  {
    slug: "svenskabank",
    ticker: "SHB-A.ST",
    name: "Svenska Handelsbanken AB (publ)",
    exchange: "Stockholm",
    sector: "Financials",
    city: "Stockholm",
    country: "Sweeden",
    publication: "",
    initiationDate: "2026-10-01",
    shares: 29,
  },
  {
    slug: "wacom",
    ticker: "6727.T",
    name: "Wacom Co., Ltd.",
    exchange: "Tokyo",
    sector: "Technology",
    city: "Kazo",
    country: "Japan",
    publication: "",
    initiationDate: "2026-08-13",
    shares: 19,
  },
];

/** Dated picks in the Holding shape that src/lib/portfolio.ts values. */
export function exUsPickHoldings(): PickHolding[] {
  return publicationPicks
    .filter((pick) => /^\d{4}-\d{2}-\d{2}$/.test(pick.initiationDate))
    .map((pick) => {
      const publication = publications.find((item) => item.slug === pick.publication);
      return {
        slug: pick.slug,
        ticker: pick.ticker,
        name: pick.name,
        exchange: pick.exchange,
        sector: pick.sector,
        city: pick.city,
        country: pick.country,
        purchaseDate: pick.initiationDate,
        shares: pick.shares,
        analysis: {
          title: publication?.title ?? "",
          href: publication ? `/publications/${pick.publication}` : "",
        },
        pick,
      };
    });
}
