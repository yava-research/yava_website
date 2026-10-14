import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

// Server-only helpers. MDX articles live in src/content/publications/<slug>.mdx
// (see src/content/publications/README.md). Images go in public/publications/.

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "publications");

/** Slugs (file names without .mdx) for every article on disk, sorted A–Z. */
export function getArticleSlugs(): string[] {
  if (!existsSync(CONTENT_DIR)) return [];
  return readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.slice(0, -".mdx".length))
    .sort();
}

/** True when an MDX article exists for this publication slug. */
export function hasArticle(slug: string): boolean {
  if (!existsSync(CONTENT_DIR)) return false;
  return existsSync(path.join(CONTENT_DIR, `${slug}.mdx`));
}
