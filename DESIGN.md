---
name: YAMF — Sonoran editorial
description: Warm paper, navy ink, and precise financial exhibits.
colors:
  navy: "#00043a"
  navy-deep: "#00022a"
  night-1: "#141a63"
  night-2: "#0a0e4c"
  night-rule: "#23275a"
  night-text: "#b9b8d0"
  sand: "#f6f1e8"
  sand-2: "#ece3d4"
  sand-3: "#dccdb5"
  paper: "#fffdf9"
  sun: "#e9d3b4"
  sandstone: "#c9a57a"
  ochre: "#80603d"
  sage: "#5f6b52"
  rust: "#8f3f30"
  border: "#d8ccb8"
  border-soft: "#e0d6c5"
  ink: "#00043a"
  ink-2: "#2a2b4a"
  ink-3: "#3b3a52"
  ink-4: "#4a4960"
  muted: "#6b6a7e"
  placeholder: "#6b6a7e"
typography:
  display:
    fontFamily: "DM Serif Text, serif"
    fontSize: "clamp(48px, 6.6vw, 96px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.03em"
    use: "Each page's h1. The home hero sets its own larger clamp."
  title:
    fontFamily: "DM Serif Text, serif"
    fontSize: "clamp(40px, 5vw, 64px)"
    use: "Article h1, for long titles."
  brand:
    fontFamily: "DM Serif Text, serif"
    fontSize: "24px"
    use: "Header and footer wordmark."
  heading:
    fontFamily: "DM Serif Text, serif"
    fontSize: "clamp(28px, 2.8vw, 40px)"
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "18px"
    fontWeight: 300
    lineHeight: 1.7
  sm:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "15px"
    use: "Controls, navigation, metadata, captions, form labels."
  xs:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "13px"
    use: "Data tables, chart axes and the notes under them only."
rounded:
  square: "0px"
spacing:
  small: "8px"
  medium: "16px"
  group: "24px"
  section: "64px"
components:
  button-primary:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.sand}"
    rounded: "{rounded.square}"
    padding: "17px 29px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.navy}"
    rounded: "{rounded.square}"
    padding: "17px 29px"
---

## Overview

**Creative North Star: "Sonoran editorial"**

The incumbent identity combines Arizona landscape geometry with the clarity of a research journal. Preserve the dawn and night illustrations, paper surfaces, serif headlines, and ruled data exhibits. Refinement improves evidence, reading, and task completion within that identity.

**Key Characteristics:**
- Warm paper and deep navy.
- Expressive headlines, quiet controls.
- Financial data organized by rules and alignment.

## Colors

Navy carries primary text and actions; sand is the default page surface. Paper distinguishes forms and exhibits. Sandstone belongs in illustrations and borders; the darker ochre supports readable small accents. Sage and rust accompany signed gains, never replace their signs. Muted text remains legible on sand and paper.

## Typography

Two families. DM Serif Text carries titles and headings; DM Sans carries prose, controls, metadata and figures. There is no monospace web font: tickers, prices and dates use DM Sans with `font-variant-numeric: tabular-nums`, and code blocks fall back to the system monospace stack (`--font-code`).

Below each page's h1 the scale has three steps, exposed as CSS variables: `--text-heading`, `--text-body` and `--text-sm`. Subheadings are told apart by family (serif against sans), weight and colour, not by in-between sizes. `--text-xs` (13px) is the floor and belongs only to data tables, chart axes and their notes. Labels and table headers are sentence case with no added tracking. Long-form articles use a narrow reading column and visible paragraph separation.

## Layout

Containers stop at 1440px with 64px gutters, falling to 32px below 960px and 16px below 600px. The Join layout stacks below 1200px to protect field widths. Team rosters use four, three, two, then one column; absent photographs become compact initials. Profile identity appears before imagery. Performance precedes the holdings index in source and visual order.

## Elevation & Depth

Flat surfaces and thin rules carry most separation. The performance exhibit uses a paper plate and ruled summary rather than elevation. Avoid decorative glow elsewhere. State transitions are brief; reduced-motion preferences disable nonessential movement.

## Shapes

Controls and editorial containers have square corners. Circles belong to the logo and the landscape sun. Empty portraits use compact monograms rather than large human silhouettes.

## Components

Buttons use navy fill or a thin outline and clear hover/focus states. Form inputs use sand against paper, visible native checkboxes, and associated errors. Chips expose selection with pressed state. Publication discovery stores search/filter/page state in the URL; results follow controls directly. Article headings have anchor targets and substantial reports offer a contents disclosure. Charts include tabular alternatives. The email application prepares an explicit draft and never claims delivery.

## Do's and Don'ts

- Do preserve the incumbent Arizona identity.
- Do label synthetic profiles and keep draft research out of public routes.
- Do give readers direct access to research and accurate dates, units, sources, and formats.
- Do retain visible focus and generous touch targets.
- Don't invent member credentials, research findings, or application receipt.
- Don't fill missing photography with oversized repeated silhouettes.
- Don't insert promotional content between active filters and their results.
