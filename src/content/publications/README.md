# Publications — how to write & publish articles

Articles are **MDX files** in this folder. MDX is Markdown plus React components,
so one file can hold prose, images, tables, code, equations, and interactive charts.

## The 30-second version

1. **Create the article:** add `<slug>.mdx` in this folder.
   The file name is the URL: `powering-the-compute-boom.mdx` → `/publications/powering-the-compute-boom`.
2. **Register it:** add an entry with the same `slug` at the top of
   `src/data/publications.ts` (newest first). Keep exactly one `featured: true`.
3. **Add images:** drop files in `public/publications/` and reference them as
   `/publications/<file>`. Example: `/publications/grid-demand.svg`.
4. Run `npm run dev` and open the article URL. The archive row links
   to the article **automatically** — no flag to flip.

No `.mdx` file → the row renders as plain text (or links to `href` if set).
With an `.mdx` file → the row links to the on-site article, and the team bio
pages link there too.

## All five types work the same way

`Research Report`, `Investment Memo`, `Technical Report`, `Presentation`, `Blog`
are just the `type` field in the registry. Every type renders through the same
article page, so every type supports images, charts, equations, tables, and code.
Tips per type are at the bottom of this file.

## Images

- Folder: `public/publications/` (served at `/publications/…`).
- Markdown: `![Alt text describing the image](/publications/my-chart.svg)`
- Any web format works: `.svg` (crisp diagrams), `.png`, `.jpg`.
- Keep files under ~500 KB; prefer SVG for charts and diagrams.
- The sample article uses `/publications/grid-demand.svg` — open that SVG to see
  how to draw a simple on-palette graphic. Images render full-width with a border.

## MDX reference

Standard Markdown all works: `#`/`##`/`###` headings, **bold**, *italic*,
`inline code`, lists, `---` dividers, `> quote`, and `[link text](https://…)`.
External links open in a new tab automatically.

### Tables (GitHub-style)

```md
| Generator | Firm? | Stance     |
| --------- | ----- | ---------- |
| Nuclear   | Yes   | Overweight |
| Gas       | Yes   | Neutral    |
```

Wide tables scroll horizontally on mobile — no extra work needed.

### Code blocks

````md
```python
def shortfall(demand_gw: float, firm_gw: float) -> float:
    return max(0.0, demand_gw * 1.15 - firm_gw)
```
````

Any language tag works (`python`, `ts`, `sql`, `bash`…). Code renders on navy
with syntax highlighting. 

### Equations (KaTeX)

- Inline: `$C = D \times (1 + r)^t$`
- Block (fences on their own lines, centered card):

```md
$$
C = \frac{D \times (1 + r)^t}{1 - m}
$$
```

> ⚠️ A bare `$` starts math mode. Write money as `\$5B` or `USD 5B`.
> Also avoid raw `<` in prose (`<5ms` breaks parsing) — write `&lt;5ms` or rephrase.

### Charts (interactive)

```md
import { LineChartCard } from "@/components/charts";
```

```md
<LineChartCard
  title="Data center demand (GW)"
  caption="Source line goes here."
  xKey="year"
  series={[{ key: "hyperscale", label: "Hyperscale" }]}
  data={[
    { year: "2024", hyperscale: 22 },
    { year: "2025", hyperscale: 28 },
  ]}
/>
```

- `LineChartCard` for trends, `BarChartCard` for comparisons (same props).
  Both are interactive [ApexCharts](https://apexcharts.com): hover for values,
  zoom/pan, and download as PNG/CSV via the toolbar.
- `data`: array of objects; `xKey`: the x-axis field; `series`: one entry per line/bar.
- `series` entries: `{ key }` must match a data field; optional `label` and `color`
  (defaults cycle through the site palette).
- Keep ≤ 8 points per series so mobile stays readable.
- Charts render in the browser (no chart markup in view-source); the page
  reserves their height so layout doesn't jump on load.

### Callouts

```md
import { Callout } from "@/components/article";

<Callout title="House view" tone="thesis">
  Your punchline goes here.
</Callout>
```

Tones: `note` (sandstone, default), `thesis` (navy), `risk` (red).

### Stat grid

```md
import { KeyStats } from "@/components/article";

<KeyStats
  items={[
    { label: "Demand growth", value: "2×", note: "By 2030" },
    { label: "Modeled gap", value: "38 GW" },
  ]}
/>
```

Best right after the intro. Two to four stats; `note` is optional.

## The article header is automatic

The title, type/desk eyebrow, date, authors, and abstract come from your
`src/data/publications.ts` entry — **do not repeat them** in the `.mdx`.
Start the file with imports, then a one-paragraph lede at most.

## Tips per type

- **Research Report:** lede → `KeyStats` → thesis `Callout` → model (equation +
  chart) → ranking table → risks `Callout` → "what would change our mind" list.
  See `powering-the-compute-boom.mdx` — it is the full template.
- **Investment Memo:** thesis callout first, then 3–5 headed sections, one table
  (bull/base/bear), one chart max. End with risks.
- **Technical Report:** equations and code blocks carry the weight; keep prose tight.
- **Presentation:** one `##` per "slide", one visual (chart/image/table) per section.
- **Blog:** short — image + 2–4 sections + one callout. See
  `desert-grid-energy-storage.mdx`.

## Before you publish

- [ ] Numbers replaced with sourced figures (samples contain placeholders).
- [ ] Every chart/table has a source in its caption.
- [ ] Exactly one registry entry has `featured: true`.
- [ ] `npm run build` passes (it prerenders every article).

## Troubleshooting

| Symptom | Fix |
| ------- | --- |
| Row doesn't link to my article | File must be `<slug>.mdx` with the exact registry `slug`. Run `npm run dev` fresh. |
| MDX build error about `$` or `<` | Escape money as `\$`, avoid raw `<` in prose (see Equations). |
| Stale error after editing config | `rm -rf .next` and restart dev. |
| Dev port busy | `npm run dev -- --port 3001` (or stop the other server). |
