"use client";

import { Fragment, useEffect, useState } from "react";
import { Lightbox, ZoomableImage } from "@/components/lightbox";
import {
  formatReadDate,
  readAction,
  readDomain,
  readSlug,
  type GoodRead,
  type Highlight,
} from "@/data/good-reads";

// The sun sits in a different spot on each cover so a row of them doesn't repeat.
const SUNS = [470, 150, 360, 540, 250];

function WindowCover({ read, index }: { read: GoodRead; index: number }) {
  return (
    <span className="read-window__cover">
      <span className="read-window__source">{read.source ?? readDomain(read.href)}</span>
      <span className="read-window__title">{read.title}</span>
      <svg className="read-window__art" viewBox="0 0 620 150" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <circle cx={SUNS[index % SUNS.length]} cy="92" r="34" fill="#E9D3B4" />
        <path d="M0 100 C 120 80, 240 92, 360 98 C 470 104, 540 86, 620 90 L620 150 L0 150 Z" fill="#141A63" />
        <path d="M0 128 C 160 116, 320 132, 460 124 C 540 120, 590 126, 620 124 L620 150 L0 150 Z" fill="#0A0E4C" />
      </svg>
    </span>
  );
}

/** Groups consecutive text highlights into one list; screenshots sit between lists. */
function Highlights({ items }: { items: Highlight[] }) {
  const blocks: (string[] | Exclude<Highlight, string>)[] = [];
  for (const item of items) {
    const last = blocks[blocks.length - 1];
    if (typeof item === "string") {
      if (Array.isArray(last)) last.push(item); else blocks.push([item]);
    } else {
      blocks.push(item);
    }
  }

  return (
    <div className="read-panel__highlights">
      {blocks.map((block, index) => (
        <Fragment key={index}>
          {Array.isArray(block) ? (
            <ul className="read-panel__points">
              {block.map((point) => <li key={point}>{point}</li>)}
            </ul>
          ) : (
            <figure className="read-panel__figure">
              <ZoomableImage src={block.image} alt={block.alt ?? block.caption ?? ""} />
              {block.caption && <figcaption>{block.caption}</figcaption>}
            </figure>
          )}
        </Fragment>
      ))}
    </div>
  );
}

export function GoodReadsGrid({ reads }: { reads: GoodRead[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  // Keep showing the last read while the panel animates closed.
  const [shownSlug, setShownSlug] = useState<string | null>(null);
  if (openSlug && openSlug !== shownSlug) setShownSlug(openSlug);
  const active = reads.find((read) => readSlug(read) === (openSlug ?? shownSlug));

  // Shareable: /good-reads#<slug> opens that read.
  useEffect(() => {
    const sync = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      setOpenSlug(reads.some((read) => readSlug(read) === hash) ? hash : null);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [reads]);

  function open(slug: string) {
    window.history.replaceState(null, "", `#${slug}`);
    setOpenSlug(slug);
  }

  function close() {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    setOpenSlug(null);
  }

  if (!reads.length) return <p className="empty">Nothing posted yet.</p>;

  return (
    <>
      <ul className="reads__grid">
        {reads.map((read, index) => {
          const slug = readSlug(read);
          return (
            <li key={slug}>
              <button type="button" className="read-card" aria-haspopup="dialog" onClick={() => open(slug)}>
                <span className="read-window">
                  <span className="read-window__bar">
                    <span className="read-window__domain">{readDomain(read.href)}</span>
                    <span className="read-window__kind">{read.kind}</span>
                  </span>
                  {read.image ? (
                    // eslint-disable-next-line @next/next/no-img-element -- arbitrary preview sizes from /public
                    <img className="read-window__image" src={read.image} alt="" loading="lazy" />
                  ) : (
                    <WindowCover read={read} index={index} />
                  )}
                </span>
                {read.image && <span className="sr-only">{read.title}</span>}
                <span className="read-card__blurb">{read.blurb}</span>
                <span className="read-card__date">
                  Posted <time dateTime={read.date}>{formatReadDate(read.date)}</time>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <Lightbox
        open={Boolean(openSlug)}
        onClose={close}
        title={active?.title}
        className="read-lightbox"
        heading={active && <><span className="read-panel__kind">{active.kind}</span> · {readDomain(active.href)}</>}
      >
        {active && (
          <div className="read-panel">
            <div className="read-panel__scroll">
              <p className="read-panel__meta">
                {active.source ?? readDomain(active.href)} · Posted {formatReadDate(active.date)}
              </p>
              <h2 className="read-panel__title">{active.title}</h2>
              <p className="read-panel__blurb">{active.blurb}</p>

              {active.highlights?.length ? (
                <section className="read-panel__notes" aria-labelledby="read-panel-notes">
                  <h3 id="read-panel-notes" className="read-panel__notes-title">What stood out</h3>
                  <Highlights items={active.highlights} />
                </section>
              ) : null}
            </div>

            <footer className="read-panel__footer">
              <a className="btn btn--solid btn--sm" href={active.href} target="_blank" rel="noreferrer">
                {readAction(active.kind)} ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
              <span className="read-panel__domain">{readDomain(active.href)}</span>
            </footer>
          </div>
        )}
      </Lightbox>
    </>
  );
}
