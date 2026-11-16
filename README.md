# YAMF Website

The website for the Yavapai Alternative Management Fund, a student investment club at the University of Arizona. It is built with Next.js and is based on the "Motivated hill" Paper design file.

## Run it locally

```bash
npm install
npm run dev       # http://localhost:3000 (note: `npm run dev`, not `npm dev`)
npm run build     # production build
```

Or with Bun (equivalent, also supported):

```bash
bun install
bun run dev       # http://localhost:3000
bun run build
```

If the dev server ever serves stale errors after an upgrade, clear the
Turbopack cache with `rm -rf .next` and restart.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Hero, About ("Who are we?") and the program |
| `/publications` | Featured report and a filterable, searchable archive |
| `/team` | Member cards, grouped by Executive Board and Analysts |
| `/team/<slug>` | A member's bio, generated from the roster |
| `/join` | Prepare an application email; attach a résumé and send from your inbox |
| `/portfolio` | Performance against the S&P 500, Dow Jones, Nasdaq 100 and Russell 3000, holdings snapshot, and available research |

The header (`src/components/SiteHeader.tsx`) and footer (`src/components/SiteFooter.tsx`) are shared by every page through `src/app/layout.tsx`.

## Editing content

All content lives in `src/data/`, so you don't need to touch any layout code.

- **`members.ts`** is the team roster.
  - Aditya Thirumalai is the current member. Other entries are explicitly marked synthetic and have no public contact or employer details.
  - Add an object to create a new card and bio page; remove the synthetic treatment only when the identity is confirmed.
  - For a headshot, put the photo in `public/team/` and set `photo: "/team/name.jpg"`.
- **`publications.ts`** is the archive.
  - Entries live in `publicationEntries`, with an explicit `status: "draft" | "published"`. Only published work appears in the archive, author pages, homepage, and article routes.
  - Draft files are retained on disk. Fill the body, verify author identity, add sources and methodology, and check headings before publishing.
  - Set `href` only when an actual external report or PDF exists. Standalone files go in `public/publications/files/`.
  - One entry should have `featured: true`.
  - To write the full article on-site (all types supported), add `src/content/publications/<slug>.mdx` with the same `slug` — rows then link to `/publications/<slug>`. Images go in `public/publications/`. PDFs, spreadsheets, and other downloads go in `public/publications/files/`. Authoring guide (tables, code, equations, charts, PDFs, video, posts, and downloads): `src/content/publications/README.md`.
  - A member's bio page lists every piece whose `authors` include their `byline`.
- **`holdings.ts`** lists the positions: for each one, enter only the `purchaseDate` and `shares` (plus headquarters and research link). `src/lib/portfolio.ts` fetches the purchase-date close and the current price from Yahoo Finance (refreshed hourly) and computes cost basis, weight, unrealized gain in dollars and percent, and the overall portfolio gain. A ticker with no price shows "Price unavailable" and is left out of the totals.
- **`performance.ts`** holds benchmark history; portfolio chart returns are calculated from the holdings and their purchase dates using historical prices and exchange rates.
- **`site.ts`** holds the social links, the recruiting email and the location.

**Content readiness:** synthetic team entries are labeled individually. Empty and unfinished research is kept as drafts. The sourced October AI spending chart collection remains published. No research findings or member credentials were fabricated during the quality pass.

The public contact and recruiting destination is `yavapairesearch@protonmail.com`. Social links are shown only when they have a specific destination.

## Design tokens

The colors, type and spacing are CSS variables at the top of `src/app/globals.css`:

- Navy `#00043A`
- Sand `#F6F1E8`
- Sandstone `#C9A57A`
- Fonts: STIX Two Text, Fira Sans and Fira Mono, loaded with `next/font`

## Still to do

- Confirm weekly participation expectations and response windows before adding them to the Join page.
- Replace synthetic team entries with confirmed members and real portraits.
- Finish and source draft research before changing its status to published.

## Applications

Applications are sent by the applicant through their email app. The form prepares a `mailto:` draft and offers copyable text if an email app is unavailable. Applicants must attach their résumé and press Send. The website never claims delivery. An optional checkbox retains form text in this browser tab using session storage; résumés are never stored. Clear draft removes that local copy.

## Design system

`DESIGN.md` documents the preserved Sonoran editorial system. `.impeccable/design.json` contains companion component previews. Test desktop, 1024px tablet, 768px, 390px and 320px layouts after changing shared styles.
