import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, publications } from "@/data/publications";
import { articleDetails, getArticleSlugs } from "@/lib/articles";
import { members } from "@/data/members";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

// The whole page (header, body, related) depends on the slug, so there is
// no static shell to show instantly — render as a normal blocking route.
// (Without this, dev logs an `instant-shell-url-data` validation error.)
export const instant = false;

function getEntry(slug: string) {
  return publications.find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);

  if (!entry || !getArticleSlugs().includes(slug)) notFound();
  return {
    title: entry.title,
    description: entry.abstract ?? `${entry.type} from the ${entry.desk} desk.`,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry || !getArticleSlugs().includes(slug)) notFound();
  const details = articleDetails(slug);

  let Article: React.ComponentType | null = null;
  try {
    const mod = await import(`@/content/publications/${slug}.mdx`);
    Article = mod.default;
  } catch {
    notFound();
  }
  if (!Article) notFound();

  const articleSlugs = new Set(getArticleSlugs());
  const related = entry
    ? publications.filter((p) => p.desk === entry.desk && p.slug !== slug && articleSlugs.has(p.slug)).slice(0, 3)
    : [];

  return (
    <>
      <nav className="container breadcrumb mono-label" aria-label="Breadcrumb">
        <Link href="/publications">← Publications</Link>
        {entry && (
          <>
            <span style={{ color: "var(--ochre)" }}>/</span>
            <span style={{ color: "var(--muted)" }}>{entry.type}</span>
          </>
        )}
      </nav>

      <header className="container article-header">
        {entry && (
          <p className="article-category">
            {entry.type} · {entry.desk} Desk
          </p>
        )}
        <h1 className="article-header__title">{entry?.title ?? slug.replace(/-/g, " ")}</h1>
        {entry && (
          <p className="article-header__meta mono-label">
            {formatDate(entry.date, true)} · {details.minutes} min read · By {entry.authors.map((author, index) => {
              const member = members.find((person) => person.byline === author && !person.synthetic);
              return <span key={author}>{index > 0 && ", "}{member ? <Link className="text-link" href={`/team/${member.slug}`}>{author}</Link> : author}</span>;
            })}
          </p>
        )}
        {entry?.abstract && <p className="article-header__abstract">{entry.abstract}</p>}
      </header>

      {details.headings.length >= 4 && <nav className="container article-toc" aria-label="Article contents">
        <details><summary>In this article</summary><ul>{details.headings.map((heading) => <li key={heading.id}><a href={`#${heading.id}`}>{heading.title}</a></li>)}</ul></details>
      </nav>}

      <article className="container article">
        <Article />
      </article>

      <footer className="container article-footer">
        {related.length > 0 && entry && (
          <section aria-labelledby="related-title">
            <div className="section-head">
              <h2 id="related-title" className="section-head__title">
                More from the {entry.desk} desk
              </h2>
            </div>
            <ul className="pub-list">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link className="pub-row" href={`/publications/${p.slug}`}>
                    <span className="pub-row__type mono-label">{p.type}</span>
                    <span className="pub-row__main">
                      <span className="pub-row__title">{p.title}</span>
                      <span className="pub-row__authors">{p.authors.join(", ")}</span>
                    </span>
                    <span className="pub-row__date mono-label">{formatDate(p.date)}</span>
                    <span className="pub-row__arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
        <div className="article-footer__back">
          <Link href="/publications" className="btn btn--outline btn--sm">
            ← All publications
          </Link>
        </div>
      </footer>
    </>
  );
}
