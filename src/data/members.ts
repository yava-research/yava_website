// Team roster. Each member gets a card on /team and a bio page at /team/<slug>.
// To add a headshot, put the image in /public/team and set `photo: "/team/<file>.jpg"`.
// TODO: every entry below is placeholder content — replace with real members.

export type Member = {
  slug: string;
  name: string;
  /** How the member appears on publications, e.g. "M. Reyes". */
  byline: string;
  role: string;
  group: "Executive Board" | "Analysts";
  major: string;
  classYear: number;
  previous: string;
  hometown: string;
  photo?: string;
  email?: string;
  linkedin?: string;
  /** First paragraph is shown larger, as the lede. */
  bio: string[];
};

export const groups: { name: Member["group"]; meta: string }[] = [
  { name: "Executive Board", meta: "2026 – 2027" },
  { name: "Analysts", meta: "Energy · AI · Tech · Macro · EM" },
];

export const members: Member[] = [
  {
    slug: "maya-reyes",
    name: "Maya Reyes",
    byline: "M. Reyes",
    role: "President · Energy Desk",
    group: "Executive Board",
    major: "Finance & Economics",
    classYear: 2027,
    previous: "Goldman Sachs, IBD",
    hometown: "Flagstaff, AZ",
    email: "mreyes@arizona.edu",
    linkedin: "https://linkedin.com/",
    bio: [
      "Maya leads YAMF's Energy Desk and sets the fund's research agenda across power, utilities, and the infrastructure behind AI.",
      "Before YAMF, she spent a summer in Goldman Sachs' Investment Banking Division covering power and renewables, where she worked on transactions for independent power producers. At the fund, she authored our flagship report on nuclear baseload and mentors first-year analysts through their first sector pitch.",
      "Outside of markets, Maya hikes the Sonoran trails around Tucson and is slowly reading every annual letter Berkshire has ever published.",
    ],
  },
  {
    slug: "jay-patel",
    name: "Jay Patel",
    byline: "J. Patel",
    role: "Chief Investment Officer",
    group: "Executive Board",
    major: "Finance & Statistics",
    classYear: 2027,
    previous: "Citadel, Equities",
    hometown: "Phoenix, AZ",
    email: "jpatel@arizona.edu",
    linkedin: "https://linkedin.com/",
    bio: [
      "Jay runs the fund's investment committee and owns portfolio construction, sizing, and risk.",
      "He interned on an equities team at Citadel, where he built factor models for long/short books. At YAMF he introduced the quarterly position review and co-authored our research on nuclear baseload and AI data center REITs.",
    ],
  },
  {
    slug: "andrei-sim",
    name: "Andrei Sim",
    byline: "A. Sim",
    role: "Head of AI",
    group: "Executive Board",
    major: "Finance and Buissness Analytics",
    classYear: 2027,
    previous: "AI @ Alkeme",
    hometown: "Khazakstan",
    email: "andreisim@arizona.edu",
    linkedin: "https://linkedin.com/",
    bio: [
      "Lena leads the AI Desk, covering semiconductors, model developers, and the companies building on top of them.",
      "She spent a summer on NVIDIA's corporate strategy team and brings an engineer's eye to evaluating technical moats.",
    ],
  },
  {
    slug: "adi-t",
    name: "Aditya Thirumalai",
    byline: "A. Thirumalai",
    role: "Head of Technology",
    group: "Executive Board",
    major: "MIS & Business Analytics",
    classYear: 2027,
    previous: "Real Assets @ NCIA",
    hometown: "Tucson, AZ",
    email: "adityat@arizona.edu",
    linkedin: "https://linkedin.com/thirumalai-aditya",
    bio: [
      "Ethan leads the Tech Desk, covering software, internet, and IT services.",
      "He interned in J.P. Morgan's technology, media and telecom group and wrote the desk's short thesis on legacy cloud software.",
    ],
  },
  {
    slug: "samuel-nguyen",
    name: "Samuel Nguyen",
    byline: "S. Nguyen",
    role: "Senior Analyst · Energy",
    group: "Analysts",
    major: "Economics",
    classYear: 2027,
    previous: "NextEra Energy",
    hometown: "Mesa, AZ",
    bio: [
      "Samuel covers regulated utilities and renewable developers on the Energy Desk.",
      "He interned at NextEra Energy and contributed to our report on AI data center REITs.",
    ],
  },
  {
    slug: "emily-hassan",
    name: "Emily Hassan",
    byline: "E. Hassan",
    role: "Analyst · Tech",
    group: "Analysts",
    major: "Accounting",
    classYear: 2028,
    previous: "Deloitte, Audit",
    hometown: "Chandler, AZ",
    bio: [
      "Emily covers enterprise software on the Tech Desk, with a focus on revenue quality and accounting.",
      "She interned in Deloitte's audit practice and co-wrote our short thesis on legacy cloud software.",
    ],
  },
  {
    slug: "kai-brooks",
    name: "Kai Brooks",
    byline: "K. Brooks",
    role: "Analyst · Tech",
    group: "Analysts",
    major: "Business Analytics",
    classYear: 2029,
    previous: "Intel, Finance",
    hometown: "Denver, CO",
    bio: [
      "Kai covers hardware and data infrastructure on the Tech Desk.",
      "He interned in Intel's finance organization and contributed to our AI data center REIT report.",
    ],
  },
  {
    slug: "sofia-martinez",
    name: "Sofia Martinez",
    byline: "S. Martinez",
    role: "Analyst · Macro",
    group: "Analysts",
    major: "Economics & Math",
    classYear: 2028,
    previous: "Federal Reserve, Research",
    hometown: "El Paso, TX",
    bio: [
      "Sofia covers rates, inflation, and the macro backdrop for the fund's positions.",
      "She was a research intern at a regional Federal Reserve bank.",
    ],
  },
  {
    slug: "noah-begay",
    name: "Noah Begay",
    byline: "N. Begay",
    role: "Analyst · Commodities",
    group: "Analysts",
    major: "Mining Engineering",
    classYear: 2029,
    previous: "Freeport-McMoRan",
    hometown: "Window Rock, AZ",
    bio: [
      "Noah covers copper, lithium, and uranium on the Macro & Commodities Desk.",
      "He interned at Freeport-McMoRan and brings an on-the-ground view of mine economics.",
    ],
  },
  {
    slug: "aisha-okafor",
    name: "Aisha Okafor",
    byline: "A. Okafor",
    role: "Senior Analyst · Energy",
    group: "Analysts",
    major: "Finance",
    classYear: 2028,
    previous: "Lazard, Power & Utilities",
    hometown: "Houston, TX",
    bio: [
      "Aisha covers independent power producers and nuclear operators on the Energy Desk.",
      "She interned in Lazard's power and utilities group and co-wrote our long thesis on Vistra.",
    ],
  },
  {
    slug: "rohan-singh",
    name: "Rohan Singh",
    byline: "R. Singh",
    role: "Senior Analyst · AI",
    group: "Analysts",
    major: "Electrical Engineering",
    classYear: 2027,
    previous: "Raytheon, Systems",
    hometown: "Scottsdale, AZ",
    bio: [
      "Rohan covers compute and networking on the AI Desk.",
      "He interned as a systems engineer at Raytheon and co-wrote our technical report on inference economics.",
    ],
  },
  {
    slug: "daniel-alvarez",
    name: "Daniel Alvarez",
    byline: "D. Alvarez",
    role: "Analyst · AI",
    group: "Analysts",
    major: "Mathematics",
    classYear: 2028,
    previous: "Two Sigma, Quant Intern",
    hometown: "Yuma, AZ",
    bio: [
      "Daniel builds the AI Desk's quantitative models.",
      "He was a quantitative research intern at Two Sigma and co-wrote our technical report on inference economics.",
    ],
  },
];

export function getMember(slug: string) {
  return members.find((m) => m.slug === slug);
}
