// Public equity positions shown on /portfolio.
// Enter only `purchaseDate` and `shares`. Cost basis, current price, weight and
// unrealized gain are computed from Yahoo Finance prices in src/lib/portfolio.ts.
//
// TODO: the dates and share counts below are placeholders (each position sized
// from its old weight on a $100k book at the Jan 2, 2026 close). Replace them
// with the fund's actual trades.

export type HoldingSector = "Semiconductors + AI" | "Energy" | "Technology" | "Financials" | "Industrials" | "Basic Materials" | "Healthcare" | "Utilities" | "Consumer Cyclical" | "Consumer Defensive" | "Metals + Mining" | "Biotechnology" | "Cybersecurity" | "Communication Services" | "Aerospace + Defense" | "Renewables + Biofuels";

export type Holding = {
  slug: string;
  /**
   * Yahoo Finance symbol. Non-US listings carry an exchange suffix, e.g.
   * "7762.T" (Tokyo), "VOD.L" (London), "SAP.DE" (Xetra). Prices are
   * converted to USD automatically.
   */
  ticker: string;
  name: string;
  /** Listing exchange, e.g. "NYSE" or "Tokyo". */
  exchange: string;
  sector: HoldingSector;
  city: string;
  country: string;
  /**
   * Trade date, YYYY-MM-DD. Cost basis is that day's closing price, or the
   * next trading day's close if the market was shut.
   */
  purchaseDate: string;
  /**
   * Shares held. Prices are split-adjusted, so after a split enter the
   * post-split count.
   */
  shares: number;
  analysis: {
    title: string;
    href: string;
  };
};

export const portfolioInception = "January 2026";

export const holdings: Holding[] = [
  {
    slug: "amd",
    ticker: "AMD",
    name: "Advanced Micro Devices (AMD)",
    exchange: "NASDAQ",
    sector: "Semiconductors + AI",
    city: "Santa Clara",
    country: "United States",
    purchaseDate: "2026-05-12",
    shares: 25,
    analysis: {
      title: "October AI spending analysis",
      href: "/publications/ai-spending",
    },
  },
  {
    slug: "mlpx",
    ticker: "MPLX",
    name: "MPLX LP",
    exchange: "NASDAQ",
    sector: "Energy",
    city: "Findlay",
    country: "United States",
    purchaseDate: "2026-05-12",
    shares: 30,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "cboe",
    ticker: "CBOE",
    name: "CBOE Global Markets",
    exchange: "CBOE",
    sector: "Financials",
    city: "Chicago",
    country: "United States",
    purchaseDate: "2026-05-12",
    shares: 15,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "gtlb",
    ticker: "GTLB",
    name: "GitLab Inc.",
    exchange: "NYSE",
    sector: "Semiconductors + AI",
    city: "San Francisco",
    country: "United States",
    purchaseDate: "2026-07-22",
    shares: 25,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "itt",
    ticker: "ITT",
    name: "ITT Inc.",
    exchange: "NYSE",
    sector: "Industrials",
    city: "Samford",
    country: "United States",
    purchaseDate: "2026-07-22",
    shares: 15,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "lattice",
    ticker: "LSCC",
    name: "Lattice Semiconductor Corporation (LSCC)",
    exchange: "NASDAQ",
    sector: "Semiconductors + AI",
    city: "Hillsboro",
    country: "United States",
    purchaseDate: "2026-07-22",
    shares: 25,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "gild",
    ticker: "GILD",
    name: "Gilead Sciences, Inc.",
    exchange: "NASDAQ",
    sector: "Healthcare",
    city: "Foster City",
    country: "United States",
    purchaseDate: "2026-06-19",
    shares: 15,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "tost",
    ticker: "TOST",
    name: "Toast Inc.",
    exchange: "NYSE",
    sector: "Financials",
    city: "Boston",
    country: "United States",
    purchaseDate: "2026-07-22",
    shares: 10,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "ctos",
    ticker: "CTOS",
    name: "Custom One Truck Solutions Inc.",
    exchange: "NYSE",
    sector: "Industrials",
    city: "Kansas City",
    country: "United States",
    purchaseDate: "2026-04-12",
    shares: 20,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "cno",
    ticker: "CNO",
    name: "CNO Financial Group Inc.",
    exchange: "NYSE",
    sector: "Financials",
    city: "Carmel",
    country: "United States",
    purchaseDate: "2026-04-12",
    shares: 10,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "vlto",
    ticker: "VLTO",
    name: "Veralto Corporation",
    exchange: "NYSE",
    sector: "Industrials",
    city: "Waltham",
    country: "United States",
    purchaseDate: "2026-03-17",
    shares: 20,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "nue",
    ticker: "NUE",
    name: "Nucor Corporation",
    exchange: "NYSE",
    sector: "Basic Materials",
    city: "Charlotte",
    country: "United States",
    purchaseDate: "2026-05-12",
    shares: 15,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "net",
    ticker: "NET",
    name: "Cloudflare Inc.",
    exchange: "NASDAQ",
    sector: "Technology",
    city: "San Francisco",
    country: "United States",
    purchaseDate: "2026-05-12",
    shares: 20,
    analysis: {
      title: "October AI spending analysis",
      href: "/publications/ai-spending",
    },
  },
  {
    slug: "ubiq",
    ticker: "UI",
    name: "Ubiquiti",
    exchange: "NASDAQ",
    sector: "Technology",
    city: "New York",
    country: "United States",
    purchaseDate: "2026-01-02",
    shares: 5,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "itri",
    ticker: "ITRI",
    name: "Itron Inc.",
    exchange: "NASDAQ",
    sector: "Technology",
    city: "Liberty Lake",
    country: "United States",
    purchaseDate: "2026-05-19",
    shares: 15,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "ayi",
    ticker: "AYI",
    name: "Acuity Inc.",
    exchange: "NYSE",
    sector: "Industrials",
    city: "Atlanta",
    country: "United States",
    purchaseDate: "2026-05-19",
    shares: 15,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "hri",
    ticker: "HRI",
    name: "Herc Holdings Inc.",
    exchange: "NYSE",
    sector: "Industrials",
    city: "Bonita Springs",
    country: "United States",
    purchaseDate: "2026-05-19",
    shares: 15,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "gwo",
    ticker: "GWO.TO",
    name: "Great-West Lifeco Inc.",
    exchange: "TSX",
    sector: "Financials",
    city: "Winnipeg",
    country: "Canada",
    purchaseDate: "2026-05-12",
    shares: 35,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "wcp",
    ticker: "WCP.TO",
    name: "Whitecap Resources Inc.",
    exchange: "TSX",
    sector: "Energy",
    city: "Calgary",
    country: "Canada",
    purchaseDate: "2026-05-12",
    shares: 45,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "hsx",
    ticker: "HSX.L",
    name: "Hiscox Limited",
    exchange: "London",
    sector: "Technology",
    city: "London",
    country: "United Kingdom",
    purchaseDate: "2026-04-15",
    shares: 15,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "tga",
    ticker: "TGA.L",
    name: "Thungeela Resources Limited",
    exchange: "London",
    sector: "Metals + Mining",
    city: "Johannesburg",
    country: "South Africa",
    purchaseDate: "2026-04-15",
    shares: 15,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "gregg",
    ticker: "GRG.L",
    name: "Greggs plc.",
    exchange: "London",
    sector: "Consumer Cyclical",
    city: "Newcastle",
    country: "United Kingdom",
    purchaseDate: "2026-04-15",
    shares: 25,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "drw3",
    ticker: "DRW3.DE",
    name: "Drägerwerk AG & Co. KGaA",
    exchange: "Xetra",
    sector: "Healthcare",
    city: "Lübeck",
    country: "Germany",
    purchaseDate: "2026-04-12",
    shares: 15,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "borse",
    ticker: "DB1.DE",
    name: "Deutsche Börse AG",
    exchange: "Xetra",
    sector: "Financials",
    city: "Frankfurt",
    country: "Germany",
    purchaseDate: "2026-01-02",
    shares: 10,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "nordex",
    ticker: "NDX1.DE",
    name: "Nordex SE",
    exchange: "Xetra",
    sector: "Industrials",
    city: "Hamburg",
    country: "Germany",
    purchaseDate: "2026-01-02",
    shares: 15,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "aena",
    ticker: "AENA.MC",
    name: "Aena S.M.E., S.A.",
    exchange: "Madrid",
    sector: "Consumer Cyclical",
    city: "Madrid",
    country: "Spain",
    purchaseDate: "2026-04-15",
    shares: 15,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "logista",
    ticker: "LOG.MC",
    name: "Logista Integral, S.A.",
    exchange: "Madrid",
    sector: "Industrials",
    city: "Leganés",
    country: "Spain",
    purchaseDate: "2026-04-15",
    shares: 15,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "copco",
    ticker: "ATCO-A.ST",
    name: "Atlas Copco AB (publ)",
    exchange: "Stockholm",
    sector: "Industrials",
    city: "Nacka",
    country: "Sweeden",
    purchaseDate: "2026-04-15",
    shares: 20,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "sens",
    ticker: "SYENS.BR",
    name: "Syensqo SA/NV",
    exchange: "Brussels",
    sector: "Industrials",
    city: "Brussels",
    country: "Belgium",
    purchaseDate: "2026-05-25",
    shares: 15,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "polska",
    ticker: "PGE.WA",
    name: "PGE Polska Grupa Energetyczna SA",
    exchange: "Warsaw",
    sector: "Energy",
    city: "Warsaw",
    country: "Poland",
    purchaseDate: "2026-04-15",
    shares: 50,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "citizen",
    ticker: "7762.T",
    name: "Citizen Watch Holding Company",
    exchange: "Tokyo",
    sector: "Consumer Cyclical",
    city: "Nishitokyo",
    country: "Japan",
    purchaseDate: "2026-03-03",
    shares: 20,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "pencil",
    ticker: "7976.T",
    name: "Mitsubishi Pencil Co., Ltd",
    exchange: "Tokyo",
    sector: "Technology",
    city: "Tokyo",
    country: "Japan",
    purchaseDate: "2026-03-03",
    shares: 20,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "casio",
    ticker: "6952.T",
    name: "Casio Computer Co., Ltd",
    exchange: "Tokyo",
    sector: "Technology",
    city: "Tokyo",
    country: "Japan",
    purchaseDate: "2026-03-03",
    shares:20,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "asus",
    ticker: "2357.TW",
    name: "Asustek Computer Inc.",
    exchange: "Taiwan",
    sector: "Technology",
    city: "Taipei",
    country: "Taiwan",
    purchaseDate: "2026-03-03",
    shares:20,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "unimicron",
    ticker: "3037.TW",
    name: "Unimicron Technology Corp",
    exchange: "Taiwan",
    sector: "Semiconductors + AI",
    city: "Taipei",
    country: "Taiwan",
    purchaseDate: "2026-03-03",
    shares:20,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "singex",
    ticker: "S68.SI",
    name: "Singapore Exchange Limited",
    exchange: "Singapore",
    sector: "Financials",
    city: "Singapore",
    country: "Singapore",
    purchaseDate: "2026-03-03",
    shares: 20,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "ksh",
    ticker: "KSHINTL.NS",
    name: "KSH International Ltd.",
    exchange: "NSE",
    sector: "Technology",
    city: "Pune",
    country: "India",
    purchaseDate: "2026-01-02",
    shares: 40,
    analysis: {
      title: "The cost of fine-tuning models",
      href: "/publications/fine-tuning-models",
    },
  },
  {
    slug: "adnport",
    ticker: "ADANIPORTS.BO",
    name: "Adani Ports and Special Economic Zone Limited.",
    exchange: "BSE",
    sector: "Industrials",
    city: "Ahemdabad",
    country: "India",
    purchaseDate: "2026-01-02",
    shares: 20,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "mcx",
    ticker: "MCX.BO",
    name: "Multi Commodity Exchange of India",
    exchange: "BSE",
    sector: "Financials",
    city: "Mumbai",
    country: "India",
    purchaseDate: "2026-01-02",
    shares: 20,
    analysis: {
      title: "",
      href: "",
    },
  },
  {
    slug: "angelone",
    ticker: "ANGELONE.NS",
    name: "Angel One Limited.",
    exchange: "NSE",
    sector: "Financials",
    city: "Mumbai",
    country: "India",
    purchaseDate: "2026-02-25",
    shares: 55,
    analysis: {
      title: "",
      href: "",
    },
  },


];

export const countryCount = new Set(holdings.map((h) => h.country)).size;

/** +42.8% / −6.8% — true minus sign, one decimal. */
export function formatGain(value: number): string {
  return `${value < 0 ? "−" : "+"}${Math.abs(value).toFixed(1)}%`;
}

export function formatWeight(value: number): string {
  return `${value.toFixed(1)}%`;
}

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

/** $1,234.56 */
export function formatMoney(value: number, currency = "USD"): string {
  return currency === "USD"
    ? usd.format(value)
    : new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
}

/** $108,234 — whole dollars, for headline totals. */
export function formatWholeDollars(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

/** +$1,234.56 / −$98.10 — signed, true minus sign. */
export function formatMoneyChange(value: number): string {
  return `${value < 0 ? "−" : "+"}${usd.format(Math.abs(value))}`;
}

/** "2026-01-02" → "Jan 2, 2026" */
export function formatTradeDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
