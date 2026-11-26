// Good Reads: PDFs, papers, articles and tidbits worth passing around.
// Shown as a grid of cards, newest first. Clicking a card opens a panel with
// your key points, then a button through to the full source.
//
// - `blurb`      one-line description under the card. Keep it short.
// - `date`       when we posted it (YYYY-MM-DD), not when the source came out.
// - `href`       any URL. For a PDF you host, put it in /public/good-reads/
//                and use hosted("<file>.pdf"), which escapes spaces and
//                other characters in the file name.
// - `image`      optional picture for the card's window (roughly 4:3), e.g.
//                "/good-reads/<file>.jpg". Without one it shows a navy cover.
// - `highlights` what stood out, in order. Each item is either a sentence
//                (shown as a bullet) or a screenshot:
//                  "A key point.",
//                  { image: "/good-reads/chart.png", caption: "Figure 3" },
//                Readers can click screenshots to zoom.
//
// The entries below are starter examples with real links. Replace or edit freely.

export type ReadKind = "PDF" | "Paper" | "Article" | "Letter" | "Thread" | "Video" | "Podcast" | "Book" | "Report" | "Blog";

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

/** URL for a file in /public/good-reads/. */
function hosted(file: string) {
  return `/good-reads/${encodeURIComponent(file)}`;
}

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
  {
    date: "2026-03-11",
    title: "Sam Altman speaks at BlackRock's US Infrastructure Summit",
    blurb: "OpenAI CEO Sam Altman speaks at BlackRock's U.S. Infrastructure Summit in Washington, D.C.",
    href: "https://www.youtube.com/live/Wc3OSJ2_6CA",
    kind: "Video",
    source: "Reuters",
  },
  {
    date: "2026-11-03",
    title: "2026: The State of Enterprise AI",
    blurb: "",
    href: "  https://menlovc.com/perspective/2026-the-state-of-enterprise-ai/",
    kind: "Report",
    source: "MenloVC",
  },
  {
    date: "2026-11-24",
    title: "Stifel Investment Strategy Brief: Can The AI Boom Continue?",
    blurb: "In this episode, we unpack the recent meaningful pullback in the AI trade and ask whether the AI boom can continue. We discuss why the sell-off looks more like a valuation reset than an earnings break, what the data center build-out means for the economy, and how investors might think about rates and earnings from here.",
    href: "https://youtu.be/-GReZaWqE0A",
    kind: "Video",
    source: "Stifel",
  },
  {
    date: "2026-10-18",
    title: "While Share Of Inference Has Held Steady Over The Last 2 Years, Pre-training Compute Has Moved To Post-Training: Semi Analysis",
    blurb: "",
    href: "https://officechai.com/ai/while-share-of-inference-has-held-steady-over-the-last-2-years-pre-training-compute-has-moved-to-post-training-semi-analysis/",
    kind: "Blog",
    source: "Office Chai",
  },
  {
    date: "2026-11-18",
    title: "Agentic inference capacity grew 4.6× in a year, versus 2.6× for compute capacity",
    blurb: "",
    href: "https://epoch.ai/data-insights/agentic-inference-capacity-growth",
    kind: "Blog",
    source: "EpochAI",
  },
  {
    date: "2026-11-18",
    title: "Harnessing AI for the Real Economy",
    blurb: "How AI is reorganizing industry, the capital being assembled to fund it, and the gap between today's data-center financing and what physical AI at scale will need.",
    href: hosted("AI for the Real Economy - Goldman Sachs.pdf"),
    kind: "Report",
    source: "Goldman Sachs",
    highlights: [
      "Goldman's baseline puts AI capex at roughly $7.6 trillion from 2026 to 2031 across compute, data centers and power.",
      "Hyperscalers alone are projected to invest more than $6 trillion in AI through 2030, many times what went into internet infrastructure in the dotcom era.",
      "Even so, US AI investment is about 1.2% of GDP, well below the 3% to 4.5% the railroad buildouts of the 1800s reached.",
      "Funding it will take the full capital stack: private credit for gigawatt campuses, sovereign and pension co-investors, ABS and CMBS, and investment-grade markets taking construction risk.",
    ],
  },
  {
    date: "2026-10-10",
    title: "Economic Outlook 2026-28: It Got Worse Before It May Get Better",
    blurb: "Allianz's three-year outlook: an energy shock, a global bond sell-off and AI doubts, and why its base case still expects all three to ease.",
    href: hosted("Allianz Economic Outlook 2026-28.pdf"),
    kind: "Report",
    source: "Allianz Research",
    highlights: [
      "Three tensions escalated over the summer: a Middle East energy shock, a bond sell-off that spread from the US to Japan and Europe, and renewed doubts about the AI boom.",
      "None has broken the real economy yet; Q2 growth beat expectations and European manufacturing PMIs hit four-year highs.",
      "Base case: global growth of 2.6% in 2026, 2.8% in 2027 and 2.6% in 2028, with Brent easing from $87 in Q4 2026 to an average of $76 in 2027.",
      "One more Fed hike to 4.00-4.25% and two more ECB hikes, with cuts starting no earlier than end-2027.",
      "AI capex is expected to peak around $1 trillion in 2028 as value shifts from build-out to adoption.",
    ],
  },
  {
    date: "2026-11-03",
    title: "Anthropic Is The Most Ridiculous IPO of 2026",
    blurb: "The bear case on Anthropic's $2 trillion IPO: losses, half a trillion in commitments, falling token prices and a reverse DCF that doesn't close.",
    href: hosted("Anthropic-Is-The-Most-Ridiculous-IPO-of-2026.pdf"),
    kind: "Report",
    source: "New Constructs",
    highlights: [
      "Written in the spirit of their 2019 call that WeWork was the most ridiculous IPO of that year.",
      "Cites billions in reported losses and $518 billion in contractual commitments, even after $120+ billion of private capital raised.",
      "Their LLM Token Expenditure Index fell from $2.04 in late May 2026 to $0.96 by early October, which they argue leaves closed models without pricing power.",
      "The $2 trillion valuation implies revenue of 1.4x the combined trailing revenue of the seven largest AI companies.",
    ],
  },
  {
    date: "2026-09-28",
    title: "In The Gaps: Fall 2026",
    blurb: "Ares' alternative credit newsletter on hidden structural risk, insurers' financial engineering, GPU financing and fifteen lessons from past cycles.",
    href: hosted("Ares In The Gaps Newsletter Fall 2026.pdf"),
    kind: "Letter",
    source: "Ares Management",
    highlights: [
      "Opens with the Citicorp Center story: a student's question about quartering winds exposed a flaw that crews quietly welded shut at night.",
      "The lesson for credit: the worst stresses tend to show up along the axes nobody stress-tested.",
      "Two flows to watch: whether record annuity inflows continue as insurer ROEs compress, and whether lower rates set off a refinancing wave.",
      "“Cycles are easy, but timing is hard.” The structure of a fund's capital decides how patient it can afford to be.",
    ],
  },
  {
    date: "2026-11-22",
    title: "Powering the Data Center Boom: How Grid Policy Can Deliver Clean Power Faster",
    blurb: "BNEF on why grid delays are pushing data centers onto their own gas plants, and the connection policies that could get them onto clean grid power faster.",
    href: hosted("BNEF-BP-Powering-the-Data-Center-Boom-How-Grid-Policy-Can-Deliver-Clean-Power-Faster.pdf"),
    kind: "Report",
    source: "BloombergNEF",
    highlights: [
      "Data center electricity demand is likely to quadruple by 2035 to 2,354 TWh, about 7% of global power consumption.",
      "If every announced on-site gas plant at US data centers is built, they would add 345 MtCO2e a year, equal to 10% of 2025 US power-sector emissions.",
      "Plants meant as stopgaps may keep running once built, locking in fossil fuel use.",
      "Reviews seven grid-connection tools, from maturity requirements and financial commitments to bring-your-own-generation and non-firm connections, plus Brazil, India, Indonesia and Malaysia.",
    ],
  },
  {
    date: "2026-11-22",
    title: "Califoreboding",
    blurb: "Cembalest's answers to the anxious questions he heard from West Coast clients: federal debt, AI concentration, private credit stress and more.",
    href: hosted("califoreboding.pdf"),
    kind: "Letter",
    source: "J.P. Morgan · Michael Cembalest",
    highlights: [
      "California had the third-highest state GDP growth over the past year at 3.6%, largely thanks to AI, despite the country's highest unemployment and energy costs 50% above the national median.",
      "A basket of 42 AI stocks accounts for 60% to 80% of S&P 500 earnings growth, price returns and capex growth since January 2024.",
      "60% of S&P 500 stocks are 20% or more below their all-time highs while the index sits near its own.",
    ],
  },
  {
    date: "2026-10-22",
    title: "SpaceX Has a CoreWeave Problem That No One Is Talking About",
    blurb: "Bethany McLean looks past SpaceX's blowout quarter to the cash burn, the valuation and an AI business that now looks a lot like a neocloud.",
    href: hosted("CoreWeave Problem in SpaceX Earnings.pdf"),
    kind: "Article",
    source: "Inc. · Bethany McLean",
    highlights: [
      "Revenue rose 161% to $14.6 billion, but free cash flow burn was almost $10 billion, and the AI business alone spent $16.4 billion in the quarter.",
      "At $2.1 trillion, SpaceX trades at about 36x annualized revenue, almost twice the combined value of the seven biggest defense companies.",
      "With xAI lagging, SpaceX has pivoted to selling compute, which exposes it to the same funding pressures as CoreWeave.",
      "Jim Chanos estimates the 10 GW of compute Musk promised for 2027 would need $500 billion-plus of capex, three times consensus for the whole company.",
    ],
  },
  {
    date: "2026-11-22",
    title: "AI Beneficiaries Update: 100x AI Cultures",
    blurb: "Counterpoint Global's new metric for finding companies where AI is lifting revenue per employee faster than pay, and why those stocks have done better.",
    href: hosted("Counterpoint Global Insights 100x AI Cultures Update.pdf"),
    kind: "Report",
    source: "Counterpoint Global · Morgan Stanley IM",
    highlights: [
      "The AI Productivity Spread: growth in revenue per tech employee minus growth in average tech salary.",
      "Built from roughly 750 tech companies and 40 million employee records.",
      "Companies where productivity scales faster than compensation, the “100x AI Cultures,” posted stronger forward equity returns than peers.",
      "The better question for software isn't who gets disrupted but who uses AI to amplify their people.",
    ],
  },
  {
    date: "2026-09-15",
    title: "Public to Private Equity in the United States: A Long-Term Look",
    blurb: "Mauboussin and Callahan update their study of the 40-year shift from public to private equity: market size, deal patterns and returns for buyouts and VC.",
    href: hosted("Counterpoint Global Insights Public to Private Equity in the United States.pdf"),
    kind: "Report",
    source: "Counterpoint Global · Michael Mauboussin",
    highlights: [
      "The S&P 500 compounded at 11.5% a year for the 40 years ended 2025, yet there are about half as many US public companies as in 1996.",
      "The real 10-year Treasury yield went from about -1.0% in late 2021 to roughly 2.4% in August 2026, ending the easy-money era.",
      "Exits as a share of private equity AUM have run below historical averages, pushing managers toward creative liquidity solutions.",
      "GenAI's capital needs are pulling companies back to public markets: US IPO proceeds in the first half of 2026 alone would rank among the biggest full years in decades.",
    ],
  },
  {
    date: "2026-09-28",
    title: "Exponential Wealth: Centuries of Stock and Bond Returns",
    blurb: "Roger Ibbotson marks 100 years of the SBBI dataset with a book-length look at what long-run stock and bond returns teach investors.",
    href: hosted("Exponential Wealth - Centuries of Stock and Bond Returns.pdf"),
    kind: "Book",
    source: "CFA Institute Research Foundation",
    highlights: [
      "$1 in US large caps in 1926 grew to almost $15,000 by 2025, a 10.1% compound annual return.",
      "US small caps did better still: 10.9% a year, turning $1 into more than $30,000.",
      "Long-term Treasuries returned 4.9% and T-bills 3.3%, growing $1 to about $117 and $25.",
      "Chapter 18, “Popularity and Premiums,” extends the framework to private markets and liquidity premiums.",
    ],
  },
  {
    date: "2026-09-28",
    title: "State of Scaling: The Great Sorting",
    blurb: "ICONIQ's annual growth and efficiency report on the widening gap between AI-forward software companies and incumbents.",
    href: hosted("ICONIQ Capital 2026 Annual Report.pdf"),
    kind: "Report",
    source: "ICONIQ Capital",
    highlights: [
      "Built from quarterly data on 137 software companies, with a subset of top-quartile, AI-forward “Pacesetters.”",
      "The software index fell 3% over the past year, trailing every sector, while semiconductors gained 47%.",
      "High-growth software multiples rebounded from about 7x to 9.2x NTM revenue between Q1 and Q2 2026.",
      "FCF margin is regaining its link to valuation, and over half of US businesses now pay for AI tools, up from 7.5% in January 2023.",
    ],
  },
  {
    date: "2026-11-26",
    title: "Kimmeridge Sees Gulf Energy Giants Betting on US Natural Gas",
    blurb: "Bahrain's Bapco Energies backs Kimmeridge's Fund VII, the latest Gulf bet on US gas and LNG as both a return and an energy-security hedge.",
    href: hosted("Kimmeridge Sees Gulf Energy Giants Betting on US Natural Gas.pdf"),
    kind: "Article",
    source: "Hart Energy",
    highlights: [
      "“Owning a part of reliable, low-cost supply is both a sound investment and a long-term hedge.” (Neil McMahon, Kimmeridge)",
      "Bapco's venture arm made its first fund commitment through Kimmeridge's flagship Fund VII.",
      "It follows ADNOC's XRG plan for a $15 billion-plus US gas platform and Saudi Aramco's US LNG deals.",
    ],
  },
  {
    date: "2026-08-09",
    title: "AI for Economic Theorists and Mathematicians",
    blurb: "Princeton theorists Pietro Ortoleva and Fedor Sandomirskiy on how they actually use AI for research: which models, prompting, agents and proofreading.",
    href: hosted("Markus Academy - AI for Economic Theorists.pdf"),
    kind: "PDF",
    source: "Markus Academy",
    highlights: [
      "Five parts: core uses in theory work, whether models can be creative, which model to run when, prompting and practice, and tools.",
      "AI proofreading catches real gaps in proofs, not just typos; they recommend a dedicated tool such as Refine for the final pass.",
      "Feed LaTeX, never PDF, run proofreading more than once, and verify before fixing.",
    ],
  },
  {
    date: "2026-09-26",
    title: "NVIDIA: In Conversation",
    blurb: "Aurelion Research's bull case after a post-earnings talk with NVIDIA, covering memory, inference, agentic AI and robotics.",
    href: hosted("NVIDIA-In-Conversation-Q3-2026.pdf"),
    kind: "Report",
    source: "Aurelion Research",
    highlights: [
      "The next phase of the chip race is about making intelligence cheaper to use, and inference will drive NVIDIA's next leg of growth.",
      "Demand is broadening beyond hyperscalers to enterprises, AI-native companies and other clouds.",
      "High-bandwidth memory is in short supply, and they expect prices to stay high into 2027-28.",
      "Robots are moving from demos into factories; suppliers of compute and automation win whichever robot maker leads.",
    ],
  },
  {
    date: "2026-09-21",
    title: "Rules of Relevance",
    blurb: "Carlyle on “learned blindness”: how the lens investors use, more than the data, may set off the next bout of volatility.",
    href: hosted("Rules-of-Relevance-carlyle.pdf"),
    kind: "Report",
    source: "Carlyle",
    highlights: [
      "A scaling engineer sees AI capex as a rational response to a binding constraint; a statistician sees an accelerating series with no precedent. Neither is wrong.",
      "AI's capital demands are making the link between capital demand and borrowing costs harder to ignore.",
      "Globalization created demand for dollar assets that cheapened US deficits and mortgages; as trade retreats, so does that subsidy.",
      "Europe's “peace dividend” may have cost it the defense-driven tech spillovers the US, China and Israel enjoyed.",
    ],
  },
  {
    date: "2026-08-26",
    title: "Simply Better Market Betas around the Globe",
    blurb: "A horse race of 11 beta estimators across 53 markets. Welch's age-decayed, slope-winsorized beta comes out on top.",
    href: hosted("Simply Better Market Betas around the Globe.pdf"),
    kind: "Paper",
    source: "Ling Tak Douglas Chung",
    highlights: [
      "The Welch (2022) age-decayed slope-winsorized beta best predicts future realized betas in 45 of 53 markets and is always in the top three.",
      "It also hedges market risk best in 42 markets.",
      "It beats the betas published by Bloomberg, Yahoo Finance and Google Finance, and is easy to implement.",
    ],
  },
  {
    date: "2026-11-03",
    title: "State of AI Report 2026",
    blurb: "Air Street Capital's ninth annual review of AI research, industry, politics and safety, with predictions for the year ahead.",
    href: hosted("State-of-AI-Report-2026.pdf"),
    kind: "Report",
    source: "Air Street Capital · Nathan Benaich",
    highlights: [
      "The frontier is a three-lab race between Anthropic, OpenAI and Google as benchmarks saturate.",
      "AI accelerates AI: Claude led 26% of Anthropic's measured model R&D under supervision.",
      "OpenAI and Anthropic report combined annualized revenue of roughly $105 billion.",
      "Sovereign AI pledges total about $138 billion as countries realize they cannot rent sovereignty.",
    ],
  },
  {
    date: "2026-10-20",
    title: "The Economics of Open-Weight Inference",
    blurb: "Ornn Data argues open-weight demand keeps older NVIDIA GPUs earning for years, challenging the depreciation schedules behind the AI build-out.",
    href: hosted("The Economics Of Open Weight Inference.pdf"),
    kind: "Paper",
    source: "Ornn Data",
    highlights: [
      "Adjusted for intelligence, the cheapest open-weight model completes a task at about a fifth of the cost of a comparable closed model.",
      "Self-hosting on rented GPUs costs $0.12 to $0.35 per million output tokens, and on gpt-oss-120b the A100 beats the H100 on cost.",
      "Five-year A100 rentals hold 80% of the one-month price, versus 44% to 60% for Hopper and Blackwell.",
      "Agents, batch evaluation and RL tolerate latency and are hardware-agnostic, so price-sensitive demand flows to older chips.",
    ],
  },
  {
    date: "2026-11-22",
    title: "The Icarus Files: What's Next for Nvidia and AI",
    blurb: "Cembalest on what usually happens to the largest company in the S&P 500, and what Nvidia's leadership change means for the AI trade.",
    href: hosted("the-icarus-files-amv.pdf"),
    kind: "Letter",
    source: "J.P. Morgan · Michael Cembalest",
    highlights: [
      "Nvidia went from 1% of the S&P 500 in December 2022 to 8.5% by May 2026, the fastest rise to the top since 1960.",
      "Most companies that became the largest in the index later fell to a fraction of their peak; only Exxon still holds a 1%+ share.",
      "After the leadership change, Nvidia trades at the lowest valuation among large AI stocks by a wide margin.",
      "Covers the accelerator landscape, Nvidia's reliance on Chinese open-weight labs and what to monitor for the AI expansion.",
    ],
  },
  {
    date: "2026-11-26",
    title: "Investment Strategy: November 23, 2026",
    blurb: "Wells Fargo Investment Institute's weekly on gold and real yields, an aging bull market, a bond market that won't wait for the Fed, and sports as an asset class.",
    href: hosted("wellsfargo-nov23-investmentstrat.pdf"),
    kind: "Report",
    source: "Wells Fargo Investment Institute",
    highlights: [
      "Gold's sensitivity to inflation-adjusted yields has returned after weakening since 2022.",
      "Central banks bought about 1,000 tonnes of gold a year from 2022 to 2025, double the prior decade, and 675 tonnes through Q3 2026.",
      "Investors are rotating into defensive sectors rather than leaving equities; expect more volatility and selectivity.",
      "Major sports franchise values have outpaced the S&P 500 over recent decades.",
    ],
  },
  {
    date: "2026-11-19",
    title: "Year Ahead 2027: Sustaining Resilience",
    blurb: "UBS's house view for 2027: four key questions, four scenarios, and why investors should stay invested but diversify away from concentration.",
    href: hosted("Year Ahead 2027 UBS House View.pdf"),
    kind: "Report",
    source: "UBS Chief Investment Office",
    highlights: [
      "Global AI-related investment is on track for $1 trillion in 2026, double 2025.",
      "S&P 500 earnings are on track to rise 29% in 2026, with another 15% expected in 2027.",
      "Four questions: can AI justify the enthusiasm, is this a new inflation and rates regime, can debt keep rising, and will economics outweigh geopolitics?",
      "Top idea: stay invested but cut excess tech concentration, rebalance into fixed income, and use gold, commodities, currencies and alternatives.",
    ],
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
export function readAction(kind: ReadKind, href = "") {
  if (kind === "PDF" || /\.pdf$/i.test(href)) return "Open the full PDF";
  if (kind === "Paper") return "Read the full paper";
  if (kind === "Video") return "Watch it";
  if (kind === "Podcast") return "Listen to it";
  if (kind === "Thread") return "Read the thread";
  return "Read it in full";
}
