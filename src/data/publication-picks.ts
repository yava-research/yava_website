// Hypothetical positions initiated by our publications, shown on
// /publications/portfolio. Separate from the fund's real holdings in
// holdings.ts: these are paper trades that track how each published call has
// done since the day it went out.
//
// To add a pick: give the publication slug (from publications.ts), the date
// the piece was published (the initiation date) and a hypothetical share
// count. Cost basis is that day's close, or the next trading day's close if
// the market was shut. Prices come from Yahoo Finance via src/lib/portfolio.ts.

import type { Holding, HoldingSector } from "@/data/holdings";
import { publications } from "@/data/publications";

export type PublicationPick = {
  slug: string;
  /** Yahoo Finance symbol, e.g. "CRWD" or "7762.T". */
  ticker: string;
  name: string;
  exchange: string;
  sector: HoldingSector;
  city: string;
  country: string;
  /** Slug of the publication that made the call. */
  publication: string;
  /** Publication date, YYYY-MM-DD. The hypothetical buy happens at this close. */
  initiationDate: string;
  /** Hypothetical shares bought on the initiation date. */
  shares: number;
};

export const publicationPicks: PublicationPick[] = [
  {
    slug: "nu",
    ticker: "NU",
    name: "Nu Holdings",
    exchange: "NYSE",
    sector: "Financials",
    city: "São Paulo",
    country: "Brazil",
    publication: "emerging-markets-fintech",
    initiationDate: "2026-09-23",
    shares: 85,
  },
  {
    slug: "kspi",
    ticker: "KSPI",
    name: "Kaspi.kz",
    exchange: "NASDAQ",
    sector: "Financials",
    city: "Almaty",
    country: "Kazakhstan",
    publication: "emerging-markets-fintech",
    initiationDate: "2026-09-23",
    shares: 12,
  },
  {
    slug: "crwd",
    ticker: "CRWD",
    name: "CrowdStrike Holdings",
    exchange: "NASDAQ",
    sector: "Cybersecurity",
    city: "Austin",
    country: "United States",
    publication: "ai-cyber",
    initiationDate: "2026-10-02",
    shares: 10,
  },
  {
    slug: "arm",
    ticker: "ARM",
    name: "ARM Holdings plc",
    exchange: "NASDAQ",
    sector: "Semiconductors + AI",
    city: "Caimbridge",
    country: "United Kingdom",
    publication: "agents-running-the-world",
    initiationDate: "2026-11-02",
    shares: 10,
  },
  {
    slug: "jfrog",
    ticker: "FROG",
    name: "JFrog Ltd.",
    exchange: "NASDAQ",
    sector: "Technology",
    city: "Sunnyvale",
    country: "United States",
    publication: "agents-running-the-world",
    initiationDate: "2026-11-02",
    shares: 20,
  },
  {
    slug: "rskd",
    ticker: "RSKD",
    name: "Riskified Ltd.",
    exchange: "NYSE",
    sector: "Technology",
    city: "New York",
    country: "United States",
    publication: "the-service-systems",
    initiationDate: "2026-10-16",
    shares: 20,
  },
  {
    slug: "thc",
    ticker: "THC",
    name: "Tenet Healthcare Corporation",
    exchange: "NYSE",
    sector: "Healthcare",
    city: "Dallas",
    country: "United States",
    publication: "the-service-systems",
    initiationDate: "2026-10-16",
    shares: 15,
  },
  {
    slug: "qlys",
    ticker: "QLYS",
    name: "Qualys Inc.",
    exchange: "NASDAQ",
    sector: "Technology",
    city: "Foster City",
    country: "United States",
    publication: "the-service-systems",
    initiationDate: "2026-10-16",
    shares: 27,
  },
];

export type PickHolding = Holding & { pick: PublicationPick };

/** Picks in the Holding shape that src/lib/portfolio.ts values. */
export function pickHoldings(): PickHolding[] {
  return publicationPicks
    .filter((pick) => publications.some((publication) => publication.slug === pick.publication))
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
        analysis: { title: publication?.title ?? "", href: `/publications/${pick.publication}` },
        pick,
      };
    });
}

/** Picks initiated by one publication. */
export function picksFor(publicationSlug: string): PublicationPick[] {
  return publicationPicks.filter((pick) => pick.publication === publicationSlug);
}
