import type { Metadata } from "next";
import Link from "next/link";
import { PublicationBrowser } from "@/components/PublicationBrowser";
import { formatDate, publications } from "@/data/publications";
import { getArticleSlugs } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Publications",
  description: "Equity research reports, investment memos, technical deep-dives, and presentations from YAMF's sector desks.",
};

function CoverArt() {
  return (
    <svg className="cover__art" viewBox="0 0 620 150" aria-hidden="true">
      <circle cx="470" cy="92" r="34" fill="#E9D3B4" />
      <path d="M0 100 C 120 80, 240 92, 360 98 C 470 104, 540 86, 620 90 L620 150 L0 150 Z" fill="#141A63" />
      <path d="M0 128 C 160 116, 320 132, 460 124 C 540 120, 590 126, 620 124 L620 150 L0 150 Z" fill="#0A0E4C" />
    </svg>
  );
}

export default function PublicationsPage() {
  const featured = publications.find((p) => p.featured);
  const archive = publications.filter((p) => !p.featured);
  const articleSlugs = getArticleSlugs();
  const featuredHasArticle = featured ? articleSlugs.includes(featured.slug) : false;

  return (
    <>
      <header className="container page-header">
        <div className="page-header__main">
          <span className="eyebrow">Publications</span>
          <h1 className="page-header__title">Research &amp; writing</h1>
        </div>
        <p className="page-header__blurb">
          Equity research reports, investment memos, technical deep-dives, and presentations from our
          sector desks.
        </p>
      </header>

      <PublicationBrowser items={archive} articleSlugs={articleSlugs}>
        {featured && (
          <section className="container featured" aria-label="Featured publication">
            <div className="cover">
              <div className="cover__meta mono-label">
                <span style={{ color: "var(--sandstone)" }}>
                  {featured.type} · {featured.desk} Desk
                </span>
                <span style={{ color: "#8D8CAB" }}>{featured.number}</span>
              </div>
              <p className="cover__title">{featured.coverTitle ?? featured.title}</p>
              <CoverArt />
            </div>
            <div className="featured__details">
              <span className="eyebrow">Featured · {formatDate(featured.date, true)}</span>
              <h2 className="featured__title">{featured.title}</h2>
              <p className="featured__abstract">{featured.abstract}</p>
              <div className="featured__actions">
                {featuredHasArticle && (
                  <Link href={`/publications/${featured.slug}`} className="btn btn--solid btn--sm">
                    Read article →
                  </Link>
                )}
                {featured.href && (
                  <a href={featured.href} className="btn btn--outline btn--sm" target="_blank" rel="noreferrer">
                    {featuredHasArticle ? "PDF →" : "Read report →"}
                  </a>
                )}
                <span className="mono-label" style={{ color: "var(--muted)" }}>
                  {[featured.format, `By ${featured.authors.join(", ")}`].filter(Boolean).join(" · ")}
                </span>
              </div>
            </div>
          </section>
        )}
      </PublicationBrowser>
    </>
  );
}
