---
version: alpha
name: Editorial
moods: [editorial, warm, calm]
motion: still
description: Content-first magazine system — warm paper, ink-black type, serif headlines and a single vermilion accent. Best for blogs, publications, docs-as-essays, portfolios and long-form product storytelling.
colors:
  background: "#F6F1E7"
  foreground: "#1A1714"
  card: "#FBF8F2"
  card-foreground: "#1A1714"
  popover: "#FFFDF8"
  popover-foreground: "#1A1714"
  primary: "#B83A1B"
  primary-foreground: "#FFF8F0"
  secondary: "#EAE3D5"
  secondary-foreground: "#2A2520"
  muted: "#EFE9DD"
  muted-foreground: "#6B6258"
  accent: "#E9E1D1"
  accent-foreground: "#1A1714"
  destructive: "#A3172C"
  border: "#D9CFBD"
  input: "#C9BEA9"
  ring: "#B83A1B"
  chart-1: "#B83A1B"
  chart-2: "#1A1714"
  chart-3: "#8A7F70"
  chart-4: "#D9895F"
  chart-5: "#4F6B5A"
  sidebar: "#F0EADF"
  sidebar-foreground: "#1A1714"
  sidebar-primary: "#1A1714"
  sidebar-primary-foreground: "#F6F1E7"
  sidebar-accent: "#E6DDCB"
  sidebar-accent-foreground: "#1A1714"
  sidebar-border: "#D9CFBD"
  sidebar-ring: "#B83A1B"
  dark-background: "#14120F"
  dark-foreground: "#EDE6D9"
  dark-card: "#1B1814"
  dark-card-foreground: "#EDE6D9"
  dark-popover: "#221E19"
  dark-popover-foreground: "#EDE6D9"
  dark-primary: "#E2643F"
  dark-primary-foreground: "#14120F"
  dark-secondary: "#2A251F"
  dark-secondary-foreground: "#EDE6D9"
  dark-muted: "#221E19"
  dark-muted-foreground: "#A39888"
  dark-accent: "#2C2620"
  dark-accent-foreground: "#F3ECDF"
  dark-destructive: "#F0705F"
  dark-border: "#3A332B"
  dark-input: "#4A4136"
  dark-ring: "#E2643F"
  dark-chart-1: "#E2643F"
  dark-chart-2: "#EDE6D9"
  dark-chart-3: "#A39888"
  dark-chart-4: "#E8A57C"
  dark-chart-5: "#8FB39C"
  dark-sidebar: "#100E0C"
  dark-sidebar-foreground: "#E3DBCD"
  dark-sidebar-primary: "#EDE6D9"
  dark-sidebar-primary-foreground: "#14120F"
  dark-sidebar-accent: "#241F1A"
  dark-sidebar-accent-foreground: "#F3ECDF"
  dark-sidebar-border: "#2E2822"
  dark-sidebar-ring: "#E2643F"
typography:
  display:
    fontFamily: Instrument Serif
    fontSize: 72px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Instrument Serif
    fontSize: 44px
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Instrument Serif
    fontSize: 28px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: -0.011em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: -0.006em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0em
  label-sm:
    fontFamily: IBM Plex Mono
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.08em
  mono:
    fontFamily: IBM Plex Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
rounded:
  none: 0px
  sm: 1px
  md: 2px
  lg: 2px
  xl: 3px
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  2xl: 96px
  measure: 680px
  wide: 1080px
  gutter: 32px
  columns: 12
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.lg}"
    height: 40px
    padding: 20px
  button-secondary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.lg}"
    height: 40px
    padding: 20px
  button-link:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
  button-destructive:
    backgroundColor: "{colors.background}"
    textColor: "{colors.destructive}"
    typography: "{typography.label-md}"
    rounded: "{rounded.lg}"
    height: 40px
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.none}"
    padding: 24px
  popover:
    backgroundColor: "{colors.popover}"
    textColor: "{colors.popover-foreground}"
    rounded: "{rounded.lg}"
    padding: 8px
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    height: 44px
    padding: 12px
  input-border:
    backgroundColor: "{colors.input}"
    width: 1px
  rule:
    backgroundColor: "{colors.border}"
    height: 1px
  focus-ring:
    backgroundColor: "{colors.ring}"
    width: 2px
  badge:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    height: 22px
    padding: 8px
  kicker:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    typography: "{typography.label-sm}"
  byline:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.mono}"
  nav-item-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
  sidebar:
    backgroundColor: "{colors.sidebar}"
    textColor: "{colors.sidebar-foreground}"
  sidebar-item-active:
    backgroundColor: "{colors.sidebar-accent}"
    textColor: "{colors.sidebar-accent-foreground}"
  sidebar-item-primary:
    backgroundColor: "{colors.sidebar-primary}"
    textColor: "{colors.sidebar-primary-foreground}"
  sidebar-divider:
    backgroundColor: "{colors.sidebar-border}"
    height: 1px
  sidebar-focus-ring:
    backgroundColor: "{colors.sidebar-ring}"
    width: 2px
  chart-series-1:
    backgroundColor: "{colors.chart-1}"
  chart-series-2:
    backgroundColor: "{colors.chart-2}"
  chart-series-3:
    backgroundColor: "{colors.chart-3}"
  chart-series-4:
    backgroundColor: "{colors.chart-4}"
  chart-series-5:
    backgroundColor: "{colors.chart-5}"
  page-dark:
    backgroundColor: "{colors.dark-background}"
    textColor: "{colors.dark-foreground}"
  button-primary-dark:
    backgroundColor: "{colors.dark-primary}"
    textColor: "{colors.dark-primary-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.lg}"
  button-secondary-dark:
    backgroundColor: "{colors.dark-secondary}"
    textColor: "{colors.dark-secondary-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.lg}"
  button-destructive-dark:
    backgroundColor: "{colors.dark-background}"
    textColor: "{colors.dark-destructive}"
  card-dark:
    backgroundColor: "{colors.dark-card}"
    textColor: "{colors.dark-card-foreground}"
  popover-dark:
    backgroundColor: "{colors.dark-popover}"
    textColor: "{colors.dark-popover-foreground}"
  byline-dark:
    backgroundColor: "{colors.dark-muted}"
    textColor: "{colors.dark-muted-foreground}"
  nav-item-hover-dark:
    backgroundColor: "{colors.dark-accent}"
    textColor: "{colors.dark-accent-foreground}"
  input-border-dark:
    backgroundColor: "{colors.dark-input}"
    width: 1px
  rule-dark:
    backgroundColor: "{colors.dark-border}"
    height: 1px
  focus-ring-dark:
    backgroundColor: "{colors.dark-ring}"
    width: 2px
  sidebar-dark:
    backgroundColor: "{colors.dark-sidebar}"
    textColor: "{colors.dark-sidebar-foreground}"
  sidebar-item-active-dark:
    backgroundColor: "{colors.dark-sidebar-accent}"
    textColor: "{colors.dark-sidebar-accent-foreground}"
  sidebar-item-primary-dark:
    backgroundColor: "{colors.dark-sidebar-primary}"
    textColor: "{colors.dark-sidebar-primary-foreground}"
  sidebar-divider-dark:
    backgroundColor: "{colors.dark-sidebar-border}"
    height: 1px
  sidebar-focus-ring-dark:
    backgroundColor: "{colors.dark-sidebar-ring}"
    width: 2px
  chart-series-1-dark:
    backgroundColor: "{colors.dark-chart-1}"
  chart-series-2-dark:
    backgroundColor: "{colors.dark-chart-2}"
  chart-series-3-dark:
    backgroundColor: "{colors.dark-chart-3}"
  chart-series-4-dark:
    backgroundColor: "{colors.dark-chart-4}"
  chart-series-5-dark:
    backgroundColor: "{colors.dark-chart-5}"
---

# Editorial

## Overview

Editorial treats the screen like a well-set page. The words are the product; the interface
is the typesetting around them. The personality is **literate, confident and unhurried** —
think a serious weekly magazine or a small independent press that happens to ship software.
Readers should feel invited to slow down.

The light mode is the canonical one: warm uncoated **paper**, near-black **ink**, and a
single **vermilion** used the way a printer would use a second spot colour — for kickers,
links, the one call to action, and the occasional drop cap. Dark mode is "reading lamp":
a deep warm brown-black with parchment text and a brighter, coral-leaning vermilion.

Hierarchy comes from type scale, rules and whitespace — not from boxes, shadows or colour.
If a layout needs a card to make sense, first try a hairline rule and more space.

## Colors

- **Background (#F6F1E7) — "Uncoated Paper":** the page. Warm, slightly yellowed, never white.
- **Card (#FBF8F2) — "Proof Sheet":** a lighter leaf of paper for inset panels, pull-out
  boxes and form fields. **Popover (#FFFDF8)** is lighter still.
- **Foreground (#1A1714) — "Press Ink":** body and headlines. A warm near-black, never #000.
- **Primary (#B83A1B) — "Vermilion":** the only chromatic colour. Links, kickers, primary
  buttons, active nav underline, focus ring. Paper-white text on it is 5.4:1; as text on the
  paper it is 5.1:1.
- **Secondary (#EAE3D5) / Accent (#E9E1D1):** tan tints for tags, chips and hover states.
- **Muted (#EFE9DD) / Muted foreground (#6B6258) — "Pencil":** captions, bylines, datelines,
  footnotes, placeholders. Passes AA on paper, card and muted.
- **Border (#D9CFBD) / Input (#C9BEA9):** hairline rules and field outlines — the colour of a
  pencil rule on newsprint. Heavy section rules use `foreground` at 2px instead.
- **Destructive (#A3172C):** a deeper crimson so it never reads as "the brand accent".
- **Charts:** vermilion, ink, pencil grey, terracotta and a muted sage — printed-infographic
  restraint, flat fills, no gradients.

Dark mode mirrors the roles: `dark-background` #14120F, `dark-foreground` #EDE6D9 parchment,
`dark-primary` #E2643F with ink-dark text on it (5.5:1), `dark-muted-foreground` #A39888.

## Typography

Three families, each with a single job:

- **Instrument Serif** — display and headlines only. A condensed, high-contrast serif with
  real editorial voice. It ships in one weight (400) plus italic; hierarchy comes from size,
  not weight. Use the *italic* for one or two emphasised words in a headline — that is the
  signature move of this system.
  - Display 72px / 1.0 / -0.02em — cover stories and landing heroes.
  - Headline-lg 44px / 1.08 — article titles, page titles.
  - Headline-md 28px / 1.2 — section heads, card titles, pull quotes.
- **Inter** — body and UI. Body-lg 18px / 1.7 for article text set to a 680px measure;
  body-md 16px / 1.65 for UI prose; body-sm 14px for captions and dense lists. Label-md
  14px/500 for buttons and nav.
- **IBM Plex Mono** — metadata. Label-sm 11px/500, uppercase, +0.08em tracking for kickers,
  section labels, datelines ("ESSAY · 12 MIN READ"). Mono 13px for code, figures, footnote
  markers and timestamps.

Use old-style figures in running text where Inter supports them (`font-variant-numeric:
oldstyle-nums`) and tabular figures in tables. Never set body text in the serif, and never
set headlines in Inter.

## Layout

A **12-column grid** at 1080px max with 32px gutters, but reading text always sits in a
single **680px measure** (about 66–72 characters at body-lg). Pull quotes, figures and
asides may break out to the full 1080px or hang in the margin.

The spacing scale is 8px-based with large jumps: 24px between paragraphs and blocks, 48px
between sections, 96px between major story chapters. Headlines get more space above than
below (2:1). Lists of stories are laid out like a contents page: kicker, headline, dek,
byline, separated by hairline rules — not by cards.

## Elevation & Depth

This is a **flat, printed** system. There are no drop shadows on content. Depth is expressed
by (1) paper tone — background → card → popover, each a shade lighter; (2) rules — 1px
`border` hairlines between items, 2px `foreground` rules above section heads; and (3)
whitespace. Popovers and dialogs may use a single soft shadow (`0 12px 32px -12px
#1A171433`) because they float above the page; nothing else does.

## Shapes

Shapes are **square-cut**. `--radius` is 2px (`rounded.lg`) — just enough to take the edge
off buttons and inputs. Cards, images, pull-quote boxes and badges use `rounded.none`.
`rounded.full` is reserved for author avatars. Images are full-bleed or sit flush in the
column with a mono caption beneath; never round photo corners.

## Components

- **Primary button:** vermilion fill, paper text, Inter 14px/500, 40px tall, 2px radius.
  One per view. Hover darkens ~8%.
- **Secondary button:** transparent on paper with a 1px ink border and ink text. Hover fills
  with `accent`.
- **Link button / inline links:** vermilion text with a 1px underline offset 3px; underline
  thickens to 2px on hover.
- **Card:** proof-sheet fill, 0 radius, 1px `border`, 24px padding — use for asides and
  callouts, not for story lists.
- **Input:** card fill, 1px `input` border, 44px tall, 2px radius; label above in label-md;
  helper text in body-sm muted. Focus = 2px vermilion outline.
- **Badge / tag:** label-sm mono uppercase on secondary tan, square corners.
- **Kicker:** label-sm mono uppercase in vermilion above every headline.
- **Byline:** mono 13px in muted-foreground: `BY ADA PARK · OCT 1, 2026`.
- **Pull quote:** headline-md Instrument Serif italic, hanging vermilion opening quote mark,
  2px ink rule above.
- **Drop cap:** optional first-letter in Instrument Serif at 4 lines, vermilion.

## Do's and Don'ts

- Do set every headline in Instrument Serif at weight 400 and use italic for emphasis.
- Do keep article text to a 680px measure at 18px with 1.7 line height.
- Do put a mono uppercase kicker above headlines and a mono byline below them.
- Do separate items with hairline rules and whitespace instead of cards and shadows.
- Do reserve vermilion for links, kickers and the single primary action.
- Don't use pure white backgrounds or pure black text — always paper and ink.
- Don't introduce a second accent colour or coloured section backgrounds.
- Don't round images, cards or tags; radius above 3px breaks the printed feel.
- Don't use bold serif weights, faux-bold, or set body copy in the serif.
- Don't use flashy motion — fades and gentle 300ms reveals only, never bouncing or glowing.

## Motion

Motion language: **still** ([MOTION.md](../MOTION.md#still)). The type is the show; nothing moves for decoration.

- **Durations:** 100–150ms for state feedback only (hover underline, press, focus, accordion open).
- **Easing:** `cubic-bezier(0.25, 0.1, 0.25, 1)`; never springy.
- **What animates:** link underline draw on hover, accordion height, toast/menu fade.
- **What doesn't:** scroll reveals, text effects, marquees, backgrounds, parallax. If a page feels static, fix hierarchy and spacing, not motion.
- Respect `prefers-reduced-motion`: disable everything except opacity.

## Agent Prompt

You are designing in the Editorial system: a content-first, magazine-style interface on warm
paper (#F6F1E7) with ink text (#1A1714) and one vermilion accent (#B83A1B, #E2643F in dark
mode). Set headlines in Instrument Serif at weight 400 (italic for emphasis), body and UI
in Inter with long-form text at 18px in a 680px column, and kickers, bylines and metadata
in uppercase IBM Plex Mono. Build hierarchy with type scale, hairline rules and generous
whitespace rather than cards, shadows or colour fills; radius is near zero (2px on
controls, square everywhere else). Motion is quiet — soft fades, text reveals and
scroll-linked progress only. Use shadcn/ui primitives restyled flat, and prefer
contents-page lists, pull quotes and full-bleed figures over dashboards and bento grids.

## Pairs well with

- aceternity/text-generate-effect
- aceternity/tracing-beam
- aceternity/sticky-scroll-reveal
- aceternity/noise-background
- aceternity/infinite-moving-cards
- transitions/shimmer-text
- transitions/tabs-sliding
- oc/pricing-simple
