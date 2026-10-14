# YAMF Website

The website for the Yavapai Alternative Management Fund, a student investment club at the University of Arizona. It is built with Next.js and is based on the "Motivated hill" Paper design file.

## Run it locally

```bash
npm install
npm run dev       # http://localhost:3000 (note: `npm run dev`, not `npm dev`)
npm run build     # production build; every page is prerendered
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
| `/join` | Application form |

The header (`src/components/SiteHeader.tsx`) and footer (`src/components/SiteFooter.tsx`) are shared by every page through `src/app/layout.tsx`.

## Editing content

All content lives in `src/data/`, so you don't need to touch any layout code.

- **`members.ts`** is the team roster.
  - Add an object to create a new card and bio page.
  - For a headshot, put the photo in `public/team/` and set `photo: "/team/name.jpg"`.
- **`publications.ts`** is the archive.
  - Add new pieces at the top and set `href` to the PDF or post URL. Files can go in `public/publications/`.
  - One entry should have `featured: true`.
  - To write the full article on-site (all types supported), add `src/content/publications/<slug>.mdx` with the same `slug` — rows then link to `/publications/<slug>`. Images go in `public/publications/`. Authoring guide (tables, code, equations, charts): `src/content/publications/README.md`.
  - A member's bio page lists every piece whose `authors` include their `byline`.
- **`site.ts`** holds the social links, the recruiting email and the location.

**Placeholders:** every member, publication, email address and social link is placeholder content.

## Design tokens

The colors, type and spacing are CSS variables at the top of `src/app/globals.css`:

- Navy `#00043A`
- Sand `#F6F1E8`
- Sandstone `#C9A57A`
- Fonts: STIX Two Text, Fira Sans and Fira Mono, loaded with `next/font`

## Still to do

- **The Join Us form isn't connected to anything yet.** It validates the input and shows a confirmation, but nothing is saved or sent. Connect it in `src/components/JoinForm.tsx` (see the `TODO`), for example to a form service, an email inbox or file storage for the resumes.
