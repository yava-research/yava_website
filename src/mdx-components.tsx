import type { MDXComponents } from "mdx/types";
import type { AnchorHTMLAttributes, ImgHTMLAttributes, TableHTMLAttributes } from "react";

// Global MDX element map (required by @next/mdx App Router).
// Article-specific widgets (charts, callouts) are imported
// directly inside each .mdx file — see src/content/publications/README.md.

function ArticleLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { href = "", ...rest } = props;
  const external = /^https?:\/\//.test(href);
  if (external) {
    return <a href={href} target="_blank" rel="noreferrer" {...rest} />;
  }
  return <a href={href} {...rest} />;
}

function ArticleImage({ alt = "", ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  // Plain <img> (not next/image) so authors never need width/height.
  // Put files in public/publications/ and reference as "/publications/<file>".
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt} loading="lazy" decoding="async" {...rest} />;
}

function ArticleTable(props: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="article-table-wrap">
      <table {...props} />
    </div>
  );
}

const components = {
  a: ArticleLink,
  img: ArticleImage,
  table: ArticleTable,
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
