"use client";

import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { PublicationRow } from "./PublicationRow";
import type { Publication, PublicationType } from "@/data/publications";

const FILTERS: { label: string; type?: PublicationType }[] = [
  { label: "All" }, { label: "Research Reports", type: "Research Report" },
  { label: "Memos", type: "Investment Memo" }, { label: "Technical Reports", type: "Technical Report" },
  { label: "Presentations", type: "Presentation" }, { label: "Blog", type: "Blog" },
];
const PAGE_SIZE = 6;

export function PublicationBrowser({ items, articleSlugs = [], children }: {
  items: Publication[]; articleSlugs?: string[]; children: ReactNode;
}) {
  const params = useSearchParams();
  const query = params.get("q") ?? "";
  const filter = FILTERS.find((option) => option.type === params.get("type")) ?? FILTERS[0];
  const visible = Math.max(PAGE_SIZE, Math.min(items.length || PAGE_SIZE, Number(params.get("count")) || PAGE_SIZE));
  const active = Boolean(query.trim() || filter.type);
  const results = items.filter((publication) => (!filter.type || publication.type === filter.type) &&
    (!query.trim() || [publication.title, publication.desk, publication.type, ...publication.authors]
      .some((value) => value.toLowerCase().includes(query.trim().toLowerCase()))));
  const shown = results.slice(0, visible);
  const filters = FILTERS.filter((option) => !option.type || items.some((item) => item.type === option.type));

  function update(changes: Record<string, string | undefined>) {
    const url = new URL(window.location.href);
    for (const [key, value] of Object.entries(changes)) {
      if (value) url.searchParams.set(key, value); else url.searchParams.delete(key);
    }
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  return <>
    {!active && items.length > 1 && children}
    <div className="container filters">
      <div className="chips" role="group" aria-label="Filter by publication type">
        {filters.map((option) => <button key={option.label} type="button" className="chip"
          aria-pressed={option === filter} onClick={() => update({ type: option.type, count: undefined })}>{option.label}</button>)}
      </div>
      <label className="search">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" /><path d="M11 11L15 15" stroke="currentColor" strokeWidth="1.5" /></svg>
        <span className="sr-only">Search publications</span>
        <input type="search" placeholder="Search title, author, or desk" maxLength={200} value={query}
          onChange={(event) => update({ q: event.target.value, count: undefined })} />
      </label>
    </div>
    <section className="container archive" aria-labelledby="archive-title">
      <div className="section-head">
        <h2 id="archive-title" className="section-head__title">{active ? "Search results" : "All publications"}</h2>
        <span className="section-head__meta results-count" role="status">{shown.length} of {results.length} {results.length === 1 ? "publication" : "publications"} · Newest first</span>
      </div>
      {active && <button className="text-link clear-filters" type="button" onClick={() => update({ q: undefined, type: undefined, count: undefined })}>Clear search and filters</button>}
      {shown.length ? <ul className="pub-list">{shown.map((publication) => <PublicationRow key={publication.slug} pub={publication} hasArticle={articleSlugs.includes(publication.slug)} />)}</ul>
        : <div className="empty"><p>No publications match your search.</p><p>Try a shorter title, an author’s name, or clear the filters to see all published work.</p></div>}
      {visible < results.length && <div className="load-more"><button type="button" className="btn btn--outline btn--sm" onClick={() => update({ count: String(visible + PAGE_SIZE) })}>Load more publications</button></div>}
    </section>
  </>;
}
