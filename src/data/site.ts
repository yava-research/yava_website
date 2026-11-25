// Club-wide details used by the header, footer and contact links.
export const site = {
  name: "Yavapai Alternative Management Fund",
  shortName: "YAMF",
  tagline: "Student investment club",
  location: "Tucson, Arizona",
  founded: 2026,
  recruitingEmail: "yavapairesearch@protonmail.com",
  socials: [
    { label: "Email", href: "mailto:yavapairesearch@protonmail.com" },
  ],
};

// The team pages are hidden while the roster still includes synthetic profiles.
// Set to true to restore the nav link, /team, member pages and byline links.
export const showTeam: boolean = false;

export const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Publications", href: "/publications" },
  { label: "Good Reads", href: "/good-reads" },
  ...(showTeam ? [{ label: "Team", href: "/team" }] : []),
];
