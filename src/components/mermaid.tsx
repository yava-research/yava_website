"use client";

import { useEffect, useId, useState } from "react";
import { ExpandIcon, PanZoomLightbox } from "@/components/lightbox";

// Mermaid diagrams for articles. Write a ```mermaid fence in any .mdx file
// (see src/lib/remark-yamf.mjs), or use <Mermaid chart={`…`} caption="…" />.
// Mermaid is large, so it loads only on pages that contain a diagram.

type Props = { chart: string; caption?: string };

let configured: Promise<typeof import("mermaid").default> | null = null;

function loadMermaid() {
  configured ??= import("mermaid").then(({ default: mermaid }) => {
    const css = getComputedStyle(document.documentElement);
    const sans = css.getPropertyValue("--font-sans").trim();
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "base",
      look: "classic",
      fontFamily: `${sans || "DM Sans"}, system-ui, sans-serif`,
      themeVariables: {
        fontSize: "15px",
        background: "#fffdf9",
        primaryColor: "#f6f1e8",
        primaryBorderColor: "#00043a",
        primaryTextColor: "#00043a",
        secondaryColor: "#ece3d4",
        secondaryBorderColor: "#c9a57a",
        tertiaryColor: "#fffdf9",
        tertiaryBorderColor: "#d8ccb8",
        lineColor: "#80603d",
        textColor: "#2a2b4a",
        clusterBkg: "#fffdf9",
        clusterBorder: "#d8ccb8",
        edgeLabelBackground: "#fffdf9",
        noteBkgColor: "#e9d3b4",
        noteBorderColor: "#c9a57a",
      },
      themeCSS: `
        .cluster-label { font-weight: 500; }
        .actor { stroke: #00043a; }
      `,
      sequence: { mirrorActors: false },
      flowchart: { curve: "basis", padding: 14, htmlLabels: true },
    });
    return mermaid;
  });
  return configured;
}

export function Mermaid({ chart, caption }: Props) {
  const id = `mermaid-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadMermaid()
      .then((mermaid) => mermaid.render(id, chart.trim()))
      .then(({ svg }) => !cancelled && setSvg(svg))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  return (
    <figure className="mermaid-figure">
      {failed ? (
        <pre className="mermaid-figure__fallback"><code>{chart.trim()}</code></pre>
      ) : (
        <button
          type="button"
          className="zoomable mermaid-figure__canvas"
          data-ready={svg ? "true" : "false"}
          disabled={!svg}
          onClick={(event) => { event.currentTarget.focus(); setOpen(true); }}
          aria-label={`Expand diagram${caption ? `: ${caption}` : ""}`}
        >
          <span className="mermaid-figure__svg" dangerouslySetInnerHTML={svg ? { __html: svg } : undefined} />
          <span className="zoomable__hint" aria-hidden="true">
            <ExpandIcon /> Expand
          </span>
        </button>
      )}
      {caption && <figcaption>{caption}</figcaption>}
      {svg && (
        <PanZoomLightbox open={open} onClose={() => setOpen(false)} title={caption ?? "Diagram"}>
          <div className="panzoom__media panzoom__svg" dangerouslySetInnerHTML={{ __html: svg }} />
        </PanZoomLightbox>
      )}
    </figure>
  );
}
