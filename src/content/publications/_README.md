## Publication readiness

Every entry in `src/data/publications.ts` has `status: "draft" | "published"`.
Only published entries with a nonempty article body are routed on-site. Draft files stay available for editing but are excluded from the archive, homepage, profiles, and portfolio research links.

Before publishing: confirm author identity, finish every section, cite datasets with date and URL, distinguish assumptions from findings, verify all external embeds/links, use one page title (provided by the route) with H2/H3 body headings, give headings unique text for contents links, and advertise a PDF only when its file exists. Verify chart data against its source. The October AI spending post is a source-linked chart collection; the other current entries remain drafts.

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
4. **Add a PDF, spreadsheet, or other file:** drop it in `public/publications/files/`
   and link it, or use `<Pdf>` / `<Download>` (see below). No upload form — the
   file goes in the repo, the same way images do.
5. **Run** `npm run dev` and open the article URL. The archive row links
   to the article **automatically** — no flag to flip.

No `.mdx` file → the row renders as plain text (or links to `href` if set).
With an `.mdx` file → the row links to the on-site article, and the team bio
pages link there too.

## All five types work the same way

`Research Report`, `Investment Memo`, `Technical Report`, `Presentation`, `Blog`
are just the `type` field in the registry. Every type renders through the same
article page, so every type supports images, charts, equations, tables, code,
PDFs, video, posts, and downloadable files.
Tips per type are at the bottom of this file.

## Images

- Folder: `public/publications/` (served at `/publications/…`).
- Markdown: `![Alt text describing the image](/publications/my-chart.svg)`
- Any web format works: `.svg` (crisp diagrams), `.png`, `.jpg`.
- Keep files under ~500 KB; prefer SVG for charts and diagrams.
- The sample article uses `/publications/grid-demand.svg` — open that SVG to see
  how to draw a simple on-palette graphic. Images render full-width with a border.

## Files readers can download

Put the file in `public/publications/files/`. The site path is
`/publications/files/<file>`. Use lowercase names made of letters, numbers,
dots, hyphens, and underscores, such as `october-model.xlsx`. You can group
files in a folder per article: `public/publications/files/ai-spending/model.xlsx`.

Accepted files: PDF, Excel (`.xlsx`, `.xls`), CSV, TSV, ODS, Word (`.docx`, `.doc`),
PowerPoint (`.pptx`, `.ppt`), plain text, JSON, zip, and video (`.mp4`, `.webm`, `.mov`).

A normal Markdown link downloads the file (it does not open a new tab):

```md
[Download the model](/publications/files/october-model.xlsx)
```

`<Pdf>`, `<Video>`, `<Tweet>`, and `<Download>` work in every article with no import.
For a PDF you want people to read on the page, use `<Pdf>` — it shows the pages
and still offers Open and Download. On a phone the pages are hidden and the
buttons remain, because in-page PDF viewers are unreliable there.

```md
<Pdf src="/publications/files/full-note.pdf" title="Full note">
  Filed 12 October 2026.
</Pdf>

<Download href="/publications/files/october-model.xlsx" title="Valuation model">
  Quarterly build. Sources are on the Notes tab.
</Download>

<Download
  files={[
    { href: "/publications/files/october-model.xlsx", title: "Valuation model", description: "Quarterly build." },
    { href: "/publications/files/full-note.pdf", title: "Full note" },
  ]}
/>
```

The title is the name readers see. The file name is what their computer saves.
If the file is missing, the article says so instead of offering a broken download.
While `npm run dev` is running, that note includes the path it expected.

To make an archive row open a file directly, set `href` in `src/data/publications.ts`
to `/publications/files/<file>.pdf`. Use `/publications/download/<file>.pdf` when
that row should save the file instead of showing it.

## Video

YouTube and Vimeo play in the article. A video file in `public/publications/files/`
plays with a Download button. Mp4 is the reliable choice. Anything else stays a link.

```md
<Video src="https://www.youtube.com/watch?v=VIDEO_ID" title="Desk briefing">
  Recorded 3 October 2026.
</Video>

<Video src="https://vimeo.com/123456789" title="Walkthrough" />

<Video src="/publications/files/briefing.mp4" title="Desk briefing" />
```

A `t=90` or `t=1m30s` on a YouTube link starts at that time. Shorts stay vertical.

## Posts on X

Paste the post’s public link. The article embeds it and keeps a link to the
original if the embed does not load. Private accounts and deleted posts will not appear.

```md
<Tweet url="https://x.com/name/status/1234567890" />
```

`twitter.com` links work the same way.

## Text formatting

### Headings: start at `##`, never `#`

The article title from `src/data/publications.ts` is the page's only H1, so the
body starts one level down. `#` is converted to H2 and looks exactly like `##`.

| Write | Renders as | Use it for | In "In this article"? |
| ----- | ---------- | ---------- | --------------------- |
| `#` | H2 (same as `##`) | Don't use it | No |
| `## Part 1: Setup` | H2: 34px serif, navy rule above | Major sections / parts | Yes |
| `### The cost curve` | H3: 26px serif | Sections inside a part | Yes |
| `#### A detail` | H4: 21px serif | Sub-points (use sparingly) | Yes |

- Leave a space after the hashes (`## Title`, not `##Title`) and a blank line
  before and after every heading.
- Don't skip levels: a `####` goes under a `###`, not straight under a `##`.
- Every heading needs unique text. The text becomes the link anchor
  (`## Part 1: Setup` → `#part-1-setup`), so two headings with the same text break contents links.
- Keep headings plain text: no `**bold**`, `*italic*`, links, or code. The contents
  list shows the raw characters, so `*more*` shows up as `*more*`.
- Write headings as short titles in sentence case. Don't put a whole sentence in a heading.
  Put the sentence in a paragraph underneath.
- The "In this article" box appears once there are four or more `##`–`####` headings.

### Paragraphs and line breaks

- Put a **blank line between paragraphs**. Lines with no blank line between them
  join into one paragraph with no space or punctuation added, which turns into a run-on sentence.
- Put a blank line before and after every list, table, quote, callout, and component.
  A line right after a list with no blank line becomes part of the last bullet.
- Don't force a line break inside a paragraph. If you need one, start a new paragraph.

### Emphasis

| Write | Result | Use it for |
| ----- | ------ | ---------- |
| `**bold**` | **bold** | Key terms and the one phrase a skimmer must see |
| `*italic*` | *italic* | Titles of reports, books, and papers; light stress |
| `***both***` | ***both*** | Rarely |
| `~~strike~~` | ~~strike~~ | Showing a revised figure |
| `` `code` `` | `code` | Tickers, file names, commands, model IDs |

Bold one phrase per paragraph at most. When everything is bold, nothing stands out.

### Lists

```md
- Unordered item
- Another item
  - Nested item (indent two spaces)

1. Ordered item
2. Next step
   - Nested bullet under a numbered item (indent three spaces)
```

- Use `-` for bullets and `1.` `2.` `3.` for steps or ranked items.
- To add a note to a list item, nest it as an indented bullet. A line like
  `-- note` between items isn't valid and gets glued onto the item above.
- Introduce a list with a sentence ending in a colon ("Here is what happened:").
- Keep items parallel: all full sentences with periods, or all fragments without them.

### Quotes

`> text` renders as a large serif pull-quote with a sandstone bar. Use it only
for words someone else wrote, and credit them on the next line:

```md
> Shale reversed long-standing expectations of U.S. import dependence.

Source: [RBAC, *A Short History of the Shale Revolution*](https://rbac.com/…)
```

Don't use `>` to indent or highlight your own points. Use a normal list, or a
`<Callout>` for a key takeaway.

### Links and sources

- Inline: `[Microsoft Research on inference energy](https://…)`. Make the link text
  say where it goes, not "here" or "this link".
- Bare URLs also become links, but they're hard to read. Prefer link text.
- Remove tracking junk and stray characters from pasted URLs (for example a trailing `?`).
- End the article with a `## Sources` section as a bulleted list of links:
  `- [Publisher, *Title*](https://…)`.

### Dividers

`---` on its own line, **with a blank line above it**, draws a horizontal rule.
Without the blank line, `---` turns the line above into a heading. `--` (two dashes)
does nothing and prints as text.

### Symbols and punctuation

- Type real arrows and dashes: `→` for flows and `—` (em dash) for asides.
  `->` and `--` print as literal characters.
- `$` starts math. Write money as `\$5B` or `USD 5B`.
- `<` starts a component. Write `&lt;5ms` or rephrase ("under 5 ms").
- `{` and `}` start code. Write `\{` and `\}` if you need the characters.

### Notes to yourself (drafting)

Anything you type shows up on the published page, including `!put chart here`
style notes. Use an MDX comment instead. It's kept in the file and hidden on the site:

```md
{/* TODO: chart of natural gas prices 2006–2014, BLS PPI. */}
```

HTML comments (`<!-- -->`) don't work in MDX and will break the build.
Search the file for `TODO` before publishing.

### Images

`![Alt text](/publications/file.jpg)` must have alt text that describes what the
image shows ("An elephant in an office among knocked-over chairs"), not a
label like "chart" or "image1".

## MDX reference

Standard Markdown works (see **Text formatting** above for the rules): `##`/`###`/`####` headings,
**bold**, *italic*, `inline code`, lists, `---` dividers, `> quote`, and `[link text](https://…)`.
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
- [ ] Every PDF, spreadsheet, and video in the article exists under `public/publications/files/`.
- [ ] Embedded posts and videos load, and each file can be downloaded.
- [ ] `npm run build` passes (it prerenders every article).

## Troubleshooting

| Symptom | Fix |
| ------- | --- |
| Row doesn't link to my article | File must be `<slug>.mdx` with the exact registry `slug`. Run `npm run dev` fresh. |
| “This file is not available” | Put the file in `public/publications/files/` and match the path. Names use letters, numbers, dots, hyphens, and underscores. |
| Video or post is blank | Confirm the YouTube, Vimeo, or X link is public. The caption link still opens the original. |
| MDX build error about `$` or `<` | Escape money as `\$`, avoid raw `<` in prose (see Equations). |
| Stale error after editing config | `rm -rf .next` and restart dev. |
| Dev port busy | `npm run dev -- --port 3001` (or stop the other server). |
