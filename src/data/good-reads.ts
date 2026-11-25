// Good Reads: PDFs, papers, articles and tidbits worth passing around.
// Shown as a grid of cards, newest first. Clicking a card opens a panel with
// your key points, then a button through to the full source.
//
// - `blurb`      one-line description under the card. Keep it short.
// - `date`       when we posted it (YYYY-MM-DD), not when the source came out.
// - `href`       any URL. For a PDF you host, put it in /public/good-reads/
//                and use "/good-reads/<file>.pdf".
// - `image`      optional picture for the card's window (roughly 4:3), e.g.
//                "/good-reads/<file>.jpg". Without one it shows a navy cover.
// - `highlights` what stood out, in order. Each item is either a sentence
//                (shown as a bullet) or a screenshot:
//                  "A key point.",
//                  { image: "/good-reads/chart.png", caption: "Figure 3" },
//                Readers can click screenshots to zoom.
//
// The entries below are starter examples with real links. Replace or edit freely.

export type ReadKind = "PDF" | "Paper" | "Article" | "Letter" | "Thread" | "Video" | "Podcast" | "Book" | "Report";

export type Highlight = string | { image: string; alt?: string; caption?: string };

export type GoodRead = {
  date: string;
  title: string;
  blurb: string;
  href: string;
  kind: ReadKind;
  /** Publisher or author. Defaults to the link's domain. */
  source?: string;
  image?: string;
  highlights?: Highlight[];
  /** URL anchor for sharing (/good-reads#<slug>). Defaults to the title, slugified. */
  slug?: string;
};

export const goodReads: GoodRead[] = [
  {
    date: "2026-11-23",
    title: "Working with AI",
    blurb: "Labor Markets, Productivity, How people use AI at work",
    href: "https://www.anthropic.com/research/working-with-ai",
    kind: "Report",
    source: "Anthropic",

  },
  {
    date: "2026-11-24",
    title: "Financing AI Chips: Credit's New Asset Class",
    blurb: "They break down how the AI build-out gets funded: the trillions in debt it needs, why chip financing is a new asset class, what headline bond yields really mean, why AI labs going public matters to lenders, and how data center projects are bringing jobs and tax revenue back to American towns.",
    href: "https://www.youtube.com/watch?v=YncbdhUL4cQ&t=5s",
    kind: "Video",
    source: "Youtube",
  },
  {
    date: "2026-10-26",
    title: "Human Capital in Venture Capital: Evidence From 100,000 Venture Capitalists",
    blurb: "VC investors",
    href: "https://www.nber.org/papers/w35501",
    kind: "Paper",
    source: "Oaktree Capital",
    highlights: [
      "Fewer than 40 percent of the venture capitalists who have made investments have ever funded a successful firm."
    ],
  },
  {
    date: "2026-11-23",
    title: "On the move: Falling rents, rising spending",
    blurb: "Falling rents are fueling higher discretionary spending and may partly explain the continued decline in moving and homebuying.",
    href: "https://institute.bankofamerica.com/economic-insights/on-the-move-falling-rent-rising-spending.html",
    kind: "Report",
    source: "Bank Of America",
  },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatReadDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

/** The bare domain for external links, or "yamf" for files we host. */
export function readDomain(href: string) {
  if (href.startsWith("/")) return "yamf";
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

export function readSlug(read: GoodRead) {
  return read.slug ?? read.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Wording for the button that leaves the site. */
export function readAction(kind: ReadKind) {
  if (kind === "PDF") return "Open the full PDF";
  if (kind === "Paper") return "Read the full paper";
  if (kind === "Video") return "Watch it";
  if (kind === "Podcast") return "Listen to it";
  if (kind === "Thread") return "Read the thread";
  return "Read it in full";
}
