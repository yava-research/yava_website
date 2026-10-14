import Link from "next/link";
import { formatDate, type Publication } from "@/data/publications";

export function PublicationRow({ pub, hasArticle = false }: { pub: Publication; hasArticle?: boolean }) {
  const content = (
    <>
      <span className="pub-row__type mono-label">{pub.type}</span>
      <span className="pub-row__main">
        <span className="pub-row__title">{pub.title}</span>
        <span className="pub-row__authors">{pub.authors.join(", ")}</span>
      </span>
      <span className="pub-row__desk mono-label">{pub.desk}</span>
      <span className="pub-row__date mono-label">{formatDate(pub.date)}</span>
      <span className="pub-row__arrow" aria-hidden="true">
        {hasArticle || pub.href ? "→" : ""}
      </span>
    </>
  );

  // MDX articles (src/content/publications/<slug>.mdx) take precedence
  // over external hrefs so rows link to the on-site article.
  if (hasArticle) {
    return (
      <li>
        <Link className="pub-row" href={`/publications/${pub.slug}`}>
          {content}
        </Link>
      </li>
    );
  }

  return (
    <li>
      {pub.href ? (
        <a className="pub-row" href={pub.href} target="_blank" rel="noreferrer">
          {content}
        </a>
      ) : (
        <div className="pub-row">{content}</div>
      )}
    </li>
  );
}
