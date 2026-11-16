import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { publications } from "@/data/publications";
import { headingId } from "@/lib/headings";

// Server-only helpers. MDX articles live in src/content/publications/<slug>.mdx
// (see src/content/publications/README.md). Images go in public/publications/.
// PDFs, spreadsheets, and other downloads go in public/publications/files/.

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "publications");

/** Slugs (file names without .mdx) for every article on disk, sorted A–Z. */
export function getArticleSlugs(): string[] {
  if (!existsSync(CONTENT_DIR)) return [];
  return publications
    .map((publication) => publication.slug)
    .filter((slug) => hasArticle(slug))
    .sort();
}

/** True when an MDX article exists for this publication slug. */
export function hasArticle(slug: string): boolean {
  if (!publications.some((publication) => publication.slug === slug)) return false;
  const file = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!existsSync(file)) return false;
  return readFileSync(file, "utf8").replace(/^import .*;?$/gm, "").trim().length > 0;
}

export function articleDetails(slug: string) {
  const source = readFileSync(path.join(CONTENT_DIR, `${slug}.mdx`), "utf8");
  const prose = source.replace(/^import .*$/gm, "").replace(/<[^>]*>/g, "");
  const headings = [...source.matchAll(/^(#{2,4})\s+(.+)$/gm)].map((match) => ({
    title: match[2],
    id: headingId(match[2]),
  }));
  return { minutes: Math.max(1, Math.ceil(prose.split(/\s+/).length / 220) + (source.match(/<iframe\b/g)?.length ?? 0)), headings };
}
