import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Text } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

// Two families: DM Serif Text for titles and headings, DM Sans for prose,
// controls and figures (tabular numerals stand in for a monospace face).
const serif = DM_Serif_Text({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Yavapai Alternative Management Fund",
    template: "%s · YAMF",
  },
  description:
    "A student-run investment fund at the University of Arizona researching energy, AI, and technology.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
