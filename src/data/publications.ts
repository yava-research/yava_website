// Publications archive. Newest first.
// To publish a new piece: add an entry at the top. Then, optionally, write the
// full article as src/content/publications/<slug>.mdx (same slug as below).
// If the .mdx exists, archive + bio rows link to /publications/<slug> on-site;
// otherwise `href` (an external report, or a file such as
// "/publications/files/<file>.pdf") is the row link, or the row is plain text.
// In-article PDFs, spreadsheets, video, and posts go in the MDX file.
// Exactly one entry should have `featured: true`.
// Article authoring guide: src/content/publications/_README.md.

export type PublicationType =
  | "Research Report"
  | "Investment Memo"
  | "Technical Report"
  | "Presentation"
  | "Blog";

export type Publication = {
  status: "published" | "draft";
  slug: string;
  type: PublicationType;
  title: string;
  /** Bylines, matched against each member's `byline` to build their bio page list. */
  authors: string[];
  desk: "Energy" | "AI" | "Technology" | "Macro" | "Financials" | "EM" | "Strategy" | "Fixed Income" | "Venture";
  date: string; // YYYY-MM
  href?: string;
  featured?: boolean;
  // Only used for the featured piece.
  coverTitle?: string;
  number?: string;
  abstract?: string;
  format?: string;
};

// Drafts stay on disk but are excluded from every public collection and route.
export const publicationEntries: Publication[] = [
  {
    slug: "emerging-markets-fintech",
    status: "published",
    type: "Research Report",
    title: "Buy Nubank, buy Kaspi, hold dLocal",
    authors: ["Grok 4.7"],
    desk: "EM",
    date: "2026-11",
    abstract:
      "A model-written view of three emerging-market fintechs, using Q3 2026 filings and the 23 November 2026 close. Nubank and Kaspi are buys. dLocal is a hold until gross profit per dollar of volume stops falling.",
  },
  {
    slug: "portable-alpha-blackrock",
    status: "published",
    type: "Research Report",
    title: "An 'International Equity + Global Macro' Strategy",
    authors: ["A. Thirumalai"],
    desk: "Strategy",
    date: "2026-11",
    abstract:
      "Testing return-stacked international equity beta (EFA) with a multi-asset global macro and trend-following futures overlay across 18 years of daily market data (2008–2026).",
  },
  {
    slug: "intelligence-as-a-utility",
    status: "published",
    type: "Research Report",
    title: "Intelligence As A Utility",
    authors: ["A. Thirumalai"],
    desk: "AI",
    date: "2026-11",
    featured: true,
    coverTitle: "The Economics of Intelligence: From Rare Resource to Everyday Utility",
    abstract:
      "As open-weight parity, distillation, and model routers commoditize standalone AI models, durable value shifts toward scarce physical compute and downstream firms that can retain productivity gains.",
  },
  {
    slug: "malaysia-em",
    status: "published",
    type: "Blog",
    title: "A Silent Tech Superpower? Malaysia's Infrastructure & Semiconductor Boom",
    authors: ["A. Thirumalai"],
    desk: "EM",
    date: "2026-09",
    abstract:
      "Malaysia is moving from back-end assembly into IC design, advanced packaging, and data centers. A look at the investment, hiring, and talent dynamics behind the country's semiconductor boom.",
  },
  {
    slug: "educational-services",
    status: "published",
    type: "Technical Report",
    title: "Cross-sectional stat-arb and lead-lag dynamics in educational publishing",
    authors: ["A. Thirumalai"],
    desk: "Financials",
    date: "2026-11",
    abstract:
      "A market-neutral statistical arbitrage and institutional lead-lag framework across RELX, Pearson, Wiley, McGraw Hill, and Scholastic—tested with state-space Kalman hedging and seasonal conditioning on daily data from 2021 to 2026.",
  },
  {
    slug: "low-net-equity-neutal-ls",
    status: "published",
    type: "Technical Report",
    title: "Can a Breakfast Basket Earn Its Keep? A Low-Net Long/Short Test",
    authors: ["A. Thirumalai"],
    desk: "Strategy",
    date: "2026-11",
    abstract:
      "A 61-month backtest compares momentum, multifactor, and group-balanced long/short baskets across breakfast-related stocks, including dividends, cash delistings, and modeled borrow costs.",
  },
  {
    slug: "india-emerging",
    status: "published",
    type: "Investment Memo",
    title: "India emerging: growth and a basket to watch",
    authors: ["A. Thirumalai"],
    desk: "EM",
    date: "2026-11",
    abstract: "A look at India's growth prospects and a hypothetical 20-stock basket to review at the end of the first quarter of 2027.",
  },
  {
    slug: "agents-running-the-world",
    status: "published",
    type: "Research Report",
    title: "Agents and the coming age of Super Intelligence",
    authors: ["A. Thirumalai"],
    desk: "AI",
    date: "2026-11",
    abstract: "What AI agents need to move from answering questions to completing transactions, and what that could mean for commerce and compute.",
  },
  {
    slug: "the-service-systems",
    status: "published",
    type: "Blog",
    title: "Beyond the Billable Hour: Which Services Firms Keep the AI Savings",
    authors: ["A. Thirumalai"],
    desk: "AI",
    date: "2026-09",
    abstract: "The market is pricing services firms as AI losers. Most are, but firms with a moat can keep the savings that competitors will hand to clients.",
  },
  {
    slug: "fine-tuning-models",
    status: "draft",
    type: "Blog",
    title: "The Inference Question",
    authors: ["A. Thirumalai"],
    desk: "AI",
    date: "2026-08",
  },
  {
    slug: "shalevsai",
    status: "published",
    type: "Blog",
    title: "The AI capex spending question",
    authors: ["A. Thirumalai"],
    desk: "AI",
    date: "2026-10",
  },
  {
    slug: "ai-cyber",
    status: "published",
    type: "Blog",
    title: "Cybersecurity in the age of AI",
    authors: ["A. Thirumalai"],
    desk: "AI",
    date: "2026-10",
  },
  {
    slug: "turbopuffer",
    status: "published",
    type: "Research Report",
    title: "Cloud Storage - Turbopuffer",
    authors: ["A. Thirumalai"],
    desk: "Venture",
    date: "2026-09",
  },
  {
    slug: "compute-trading-energy",
    status: "published",
    type: "Technical Report",
    title: "Compute Futures: Are they like Electricity? - An Analysis",
    authors: ["A. Thirumalai"],
    desk: "Energy",
    date: "2026-09",
  },
  {
    slug: "longtrading",
    status: "published",
    type: "Investment Memo",
    title: "Placing Trades on Exchanges and Platforms",
    authors: ["A. Thirumalai"],
    desk: "Financials",
    date: "2026-10",
  },
  {
    slug: "ai-life-sci",
    status: "published",
    type: "Investment Memo",
    title: "AI + Life Sciences",
    authors: ["A. Thirumalai"],
    desk: "Venture",
    date: "2026-09",
  },
];

export const publications = publicationEntries
  .filter((publication) => publication.status === "published")
  .sort((a, b) => b.date.localeCompare(a.date));

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatDate(date: string, long = false) {
  const [year, month] = date.split("-").map(Number);
  return `${(long ? MONTHS_LONG : MONTHS)[month - 1]} ${year}`;
}

export function publicationsBy(byline: string) {
  return publications.filter((p) => p.authors.includes(byline));
}
