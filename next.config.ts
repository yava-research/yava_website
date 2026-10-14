import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Allow MDX imports. Content lives in src/content (not routed);
  // article routes are rendered by src/app/publications/[slug]/page.tsx.
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  turbopack: {
    // Pin Turbopack's root to this project so a stray
    // package-lock.json in $HOME isn't picked up as the workspace root.
    root: process.cwd(),
  },
};

const withMDX = createMDX({
  options: {
    // NOTE: plugin names must be strings (not imports) for Turbopack.
    // remark-gfm: tables, strikethrough, task lists, autolinks.
    // remark-math + rehype-katex: $…$ and $$…$$ equations.
    // rehype-highlight: code block syntax highlighting.
    remarkPlugins: ["remark-gfm", "remark-math"],
    rehypePlugins: [[ "rehype-katex", { strict: false } ], "rehype-highlight"],
  },
});

export default withMDX(nextConfig);
