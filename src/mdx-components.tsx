import type { MDXComponents } from "mdx/types";
import type { AnchorHTMLAttributes, ImgHTMLAttributes, TableHTMLAttributes } from "react";
import { Children, createElement, isValidElement, type ReactNode } from "react";
import { Download, Pdf, Video } from "@/components/article-media";
import { ZoomableImage } from "@/components/lightbox";
import { Mermaid } from "@/components/mermaid";
import { Sidenote } from "@/components/sidenote";
import { Tweet } from "@/components/tweet-embed";
import { headingId } from "@/lib/headings";
import { publicationFile } from "@/lib/publication-files";

// Global MDX element map (required by @next/mdx App Router).
// Pdf, Video, Tweet, Download, Mermaid, and Sidenote are built in.
// Charts and callouts are imported inside each .mdx file.

function ArticleLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { href = "", ...rest } = props;
  const file = publicationFile(href);
  if (file) {
    return <a {...rest} href={file.downloadPath} download={file.filename} />;
  }
  const external = /^https?:\/\//.test(href);
  if (external) {
    return <a href={href} target="_blank" rel="noreferrer" {...rest} />;
  }
  return <a href={href} {...rest} />;
}

function ArticleImage({ alt = "", src }: ImgHTMLAttributes<HTMLImageElement>) {
  // Put files in public/publications/ and reference as "/publications/<file>".
  // Every article image opens in a zoomable viewer on click.
  return typeof src === "string" ? <ZoomableImage src={src} alt={alt} /> : null;
}

function textContent(children: ReactNode): string {
  return Children.toArray(children).map((child): string => {
    if (typeof child === "string" || typeof child === "number") return String(child);
    return isValidElement<{ children?: ReactNode }>(child) ? textContent(child.props.children) : "";
  }).join("");
}

function ArticleHeading({ level, children }: { level: 2 | 3 | 4; children?: ReactNode }) {
  return createElement(`h${level}`, { id: headingId(textContent(children)) }, children);
}

function ArticleTable(props: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="article-table-wrap">
      <table {...props} />
    </div>
  );
}

const components = {
  h1: ({ children }) => <ArticleHeading level={2}>{children}</ArticleHeading>,
  h2: ({ children }) => <ArticleHeading level={2}>{children}</ArticleHeading>,
  h3: ({ children }) => <ArticleHeading level={3}>{children}</ArticleHeading>,
  h4: ({ children }) => <ArticleHeading level={4}>{children}</ArticleHeading>,
  a: ArticleLink,
  img: ArticleImage,
  table: ArticleTable,
  Pdf,
  Video,
  Tweet,
  Download,
  Mermaid,
  Sidenote,
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
