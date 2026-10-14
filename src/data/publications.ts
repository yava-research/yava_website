// Publications archive. Newest first.
// To publish a new piece: add an entry at the top. Then, optionally, write the
// full article as src/content/publications/<slug>.mdx (same slug as below).
// If the .mdx exists, archive + bio rows link to /publications/<slug> on-site;
// otherwise `href` (e.g. "/publications/<file>.pdf" for a file in
// public/publications/) is used as an external link, or the row is plain text.
// Exactly one entry should have `featured: true`.
// Article authoring guide: src/content/publications/README.md.

export type PublicationType =
  | "Research Report"
  | "Investment Memo"
  | "Technical Report"
  | "Presentation"
  | "Blog";

export type Publication = {
  slug: string;
  type: PublicationType;
  title: string;
  /** Bylines, matched against each member's `byline` to build their bio page list. */
  authors: string[];
  desk: "Energy" | "AI" | "Tech" | "Macro";
  date: string; // YYYY-MM
  href?: string;
  featured?: boolean;
  // Only used for the featured piece.
  coverTitle?: string;
  number?: string;
  abstract?: string;
  format?: string;
};

export const publications: Publication[] = [
  {
    slug: "powering-the-compute-boom",
    type: "Research Report",
    title: "Powering the Compute Boom: Why Nuclear Is the Grid's Next Baseload",
    coverTitle: "Powering the Compute Boom",
    number: "No. 014",
    authors: ["M. Reyes", "J. Patel"],
    desk: "Energy",
    date: "2026-09",
    featured: true,
    abstract:
      "Data center demand could double U.S. commercial power consumption by 2030. We model the supply gap and assess which utilities and independent power producers are best positioned to capture long-term contracts with hyperscalers.",
    format: "PDF · 32 pages",
  },
  {
    slug: "agents-running-the-world",
    type: "Research Report",
    title: "Agents and the coming age of Super Intelligence",
    authors: ["A. Thirumalai"],
    desk: "AI",
    date: "2026-10",
  },
  {
    slug: "compute-trading-energy",
    type: "Technical Report",
    title: "Compute Futures: Are they like Electricity? - An Analysis",
    authors: ["A. Thirumalai"],
    desk: "Energy",
    date: "2026-10",
  },
  {
    slug: "long-vistra",
    type: "Investment Memo",
    title: "Long Vistra: Merchant Nuclear Meets Hyperscaler Demand",
    authors: ["M. Reyes", "A. Okafor"],
    desk: "Energy",
    date: "2026-09",
  },
  {
    slug: "inference-economics",
    type: "Technical Report",
    title: "Inference Economics: Modeling the Cost Curve of Frontier AI",
    authors: ["R. Singh", "D. Alvarez"],
    desk: "AI",
    date: "2026-08",
  },
  {
    slug: "fall-2026-semicap-pitch",
    type: "Presentation",
    title: "Fall 2026 Sector Pitch: Semiconductor Equipment",
    authors: ["Technology Desk"],
    desk: "Tech",
    date: "2026-08",
  },
  {
    slug: "desert-grid-energy-storage",
    type: "Blog",
    title: "What a Desert Grid Teaches Us About Energy Storage",
    authors: ["M. Reyes"],
    desk: "Energy",
    date: "2026-07",
  },
  {
    slug: "ai-data-center-reits",
    type: "Research Report",
    title: "The Power Behind the Model: AI Data Center REITs",
    authors: ["J. Patel", "S. Nguyen", "K. Brooks"],
    desk: "AI",
    date: "2026-06",
  },
  {
    slug: "short-legacy-cloud-software",
    type: "Investment Memo",
    title: "Short Thesis: Legacy Cloud Software in an Agentic World",
    authors: ["E. Kim", "E. Hassan"],
    desk: "Tech",
    date: "2026-05",
  },
  {
    slug: "commodity-supply-outlook",
    type: "Technical Report",
    title: "Copper, Lithium & Uranium: A Commodity Supply Outlook",
    authors: ["Macro & Commodities Desk"],
    desk: "Macro",
    date: "2026-04",
  },
];

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
