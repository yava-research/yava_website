"use client";

import { useId, useState, type ReactNode } from "react";

// Margin notes for articles. Authors write ordinary markdown footnotes:
//
//   Shale output rose 35%.[^eia]
//   [^eia]: EIA, Natural Gas Annual 2015.
//
// src/lib/remark-yamf.mjs turns each reference into <Sidenote n="1">…</Sidenote>.
// Wide screens: the note floats into the right margin, level with its marker.
// Narrow screens: the marker is a button that reveals the note under the line.

type Props = { n: string | number; repeat?: boolean; children?: ReactNode };

export function Sidenote({ n, repeat, children }: Props) {
  const id = `sidenote-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [open, setOpen] = useState(false);

  if (repeat || !children) {
    return (
      <sup className="sidenote__ref sidenote__ref--repeat" aria-label={`See note ${n}`}>
        {n}
      </sup>
    );
  }

  return (
    <span className="sidenote" data-open={open}>
      <button
        type="button"
        className="sidenote__ref"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`Note ${n}`}
        onClick={() => setOpen((value) => !value)}
      >
        <sup>{n}</sup>
      </button>
      <span className="sidenote__note" id={id} role="note">
        <span className="sidenote__num" aria-hidden="true">{n}</span>
        {children}
      </span>
    </span>
  );
}
