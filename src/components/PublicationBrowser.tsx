"use client";

import { useMemo, useState, type ReactNode } from "react";
import { PublicationRow } from "./PublicationRow";
import type { Publication, PublicationType } from "@/data/publications";

const FILTERS: { label: string; type?: PublicationType }[] = [
  { label: "All" },
  { label: "Research Reports", type: "Research Report" },
  { label: "Memos", type: "Investment Memo" },
  { label: "Technical Reports", type: "Technical Report" },
  { label: "Presentations", type: "Presentation" },
  { label: "Blog", type: "Blog" },
];

const PAGE_SIZE = 6;

/** Filter bar + archive list. `children` (the featured piece) renders between them. */
export function PublicationBrowser({
  items,
  articleSlugs = [],
  children,
}: {
  items: Publication[];
  /** Slugs with an MDX article in src/content/publications/ — those rows link on-site. */
  articleSlugs?: string[];
  children: ReactNode;
}) {
  const [filter, setFilter] = useState(FILTERS[0]);
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (p) =>
        (!filter.type || p.type === filter.type) &&
        (!q || [p.title, p.desk, p.type, ...p.authors].some((s) => s.toLowerCase().includes(q))),
    );
  }, [items, filter, query]);

  const shown = results.slice(0, visible);
  const articles = useMemo(() => new Set(articleSlugs), [articleSlugs]);

  return (
    <>
      <div className="container filters">
        <div className="chips" role="group" aria-label="Filter by type">
          {FILTERS.map((f) => (
            <button
              key={f.label}
              type="button"
              className="chip"
              aria-pressed={f === filter}
              onClick={() => {
                setFilter(f);
                setVisible(PAGE_SIZE);
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <label className="search">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="5.5" stroke="#00043A" strokeWidth="1.5" />
            <path d="M11 11L15 15" stroke="#00043A" strokeWidth="1.5" />
          </svg>
          <span className="sr-only">Search publications</span>
          <input
            type="search"
            placeholder="Search publications"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisible(PAGE_SIZE);
            }}
          />
        </label>
      </div>

      {children}

      <section className="container archive" aria-labelledby="archive-title">
        <div className="section-head">
          <h2 id="archive-title" className="section-head__title">
            {filter.type ? filter.label : "All publications"}
          </h2>
          <span className="section-head__meta mono-label">
            Showing {shown.length} of {results.length} · Newest first
          </span>
        </div>

        {shown.length > 0 ? (
          <ul className="pub-list">
            {shown.map((p) => (
              <PublicationRow key={p.slug} pub={p} hasArticle={articles.has(p.slug)} />
            ))}
          </ul>
        ) : (
          <p className="empty">No publications match that search yet.</p>
        )}

        {visible < results.length && (
          <div className="load-more">
            <button type="button" className="btn btn--outline btn--sm" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
              Load more publications
            </button>
          </div>
        )}
      </section>
    </>
  );
}
