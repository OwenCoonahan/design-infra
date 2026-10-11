---
version: alpha
name: Brutalist Mono
moods: [bold, technical, minimal]
motion: quiet
description: Stark black-and-white brutalism with zero radius, thick borders, hard offset shadows, monospace-heavy type and one acid-yellow accent. Best for dev tools, indie launches, manifestos, portfolios and anything that should feel raw, honest and loud.
colors:
  background: "#FFFFFF"
  foreground: "#000000"
  card: "#FFFFFF"
  card-foreground: "#000000"
  popover: "#FFFFFF"
  popover-foreground: "#000000"
  primary: "#E4FF1A"
  primary-foreground: "#000000"
  secondary: "#000000"
  secondary-foreground: "#FFFFFF"
  muted: "#F2F2F2"
  muted-foreground: "#555555"
  accent: "#000000"
  accent-foreground: "#E4FF1A"
  destructive: "#E00000"
  border: "#000000"
  input: "#000000"
  ring: "#000000"
  chart-1: "#000000"
  chart-2: "#E4FF1A"
  chart-3: "#8C8C8C"
  chart-4: "#3D3D3D"
  chart-5: "#C4C4C4"
  sidebar: "#FFFFFF"
  sidebar-foreground: "#000000"
  sidebar-primary: "#000000"
  sidebar-primary-foreground: "#E4FF1A"
  sidebar-accent: "#E4FF1A"
  sidebar-accent-foreground: "#000000"
  sidebar-border: "#000000"
  sidebar-ring: "#000000"
  dark-background: "#0A0A0A"
  dark-foreground: "#FFFFFF"
  dark-card: "#0A0A0A"
  dark-card-foreground: "#FFFFFF"
  dark-popover: "#141414"
  dark-popover-foreground: "#FFFFFF"
  dark-primary: "#E4FF1A"
  dark-primary-foreground: "#000000"
  dark-secondary: "#FFFFFF"
  dark-secondary-foreground: "#000000"
  dark-muted: "#1A1A1A"
  dark-muted-foreground: "#ABABAB"
  dark-accent: "#E4FF1A"
  dark-accent-foreground: "#000000"
  dark-destructive: "#FF4D4D"
  dark-border: "#FFFFFF"
  dark-input: "#FFFFFF"
  dark-ring: "#E4FF1A"
  dark-chart-1: "#FFFFFF"
  dark-chart-2: "#E4FF1A"
  dark-chart-3: "#8C8C8C"
  dark-chart-4: "#5C5C5C"
  dark-chart-5: "#C4C4C4"
  dark-sidebar: "#000000"
  dark-sidebar-foreground: "#FFFFFF"
  dark-sidebar-primary: "#E4FF1A"
  dark-sidebar-primary-foreground: "#000000"
  dark-sidebar-accent: "#FFFFFF"
  dark-sidebar-accent-foreground: "#000000"
  dark-sidebar-border: "#FFFFFF"
  dark-sidebar-ring: "#E4FF1A"
typography:
  display:
    fontFamily: Space Grotesk
    fontSize: 80px
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: -0.03em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Space Mono
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-md:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-sm:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  label-md:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Space Mono
    fontSize: 11px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: 0.08em
  mono:
    fontFamily: Space Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
rounded:
  none: 0px
  sm: 0px
  md: 0px
  lg: 0px
  xl: 0px
  full: 0px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  2xl: 96px
  border-width: 2px
  border-width-heavy: 4px
  shadow-offset: 4px
  max-width: 1280px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    height: 48px
    padding: 24px
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    height: 48px
    padding: 24px
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    height: 48px
    padding: 24px
  button-destructive:
    backgroundColor: "{colors.background}"
    textColor: "{colors.destructive}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    height: 48px
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.none}"
    padding: 24px
  popover:
    backgroundColor: "{colors.popover}"
    textColor: "{colors.popover-foreground}"
    rounded: "{rounded.none}"
    padding: 0px
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    height: 48px
    padding: 16px
  input-border:
    backgroundColor: "{colors.input}"
    width: 2px
  divider:
    backgroundColor: "{colors.border}"
    height: 2px
  focus-ring:
    backgroundColor: "{colors.ring}"
    width: 3px
  badge:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    height: 24px
    padding: 8px
  tag-muted:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
  menu-item-hover:
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
    height: 2px
  sidebar-focus-ring:
    backgroundColor: "{colors.sidebar-ring}"
    width: 3px
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
    rounded: "{rounded.none}"
  button-secondary-dark:
    backgroundColor: "{colors.dark-secondary}"
    textColor: "{colors.dark-secondary-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
  button-destructive-dark:
    backgroundColor: "{colors.dark-background}"
    textColor: "{colors.dark-destructive}"
  card-dark:
    backgroundColor: "{colors.dark-card}"
    textColor: "{colors.dark-card-foreground}"
  popover-dark:
    backgroundColor: "{colors.dark-popover}"
    textColor: "{colors.dark-popover-foreground}"
  tag-muted-dark:
    backgroundColor: "{colors.dark-muted}"
    textColor: "{colors.dark-muted-foreground}"
  menu-item-hover-dark:
    backgroundColor: "{colors.dark-accent}"
    textColor: "{colors.dark-accent-foreground}"
  input-border-dark:
    backgroundColor: "{colors.dark-input}"
    width: 2px
  divider-dark:
    backgroundColor: "{colors.dark-border}"
    height: 2px
  focus-ring-dark:
    backgroundColor: "{colors.dark-ring}"
    width: 3px
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
    height: 2px
  sidebar-focus-ring-dark:
    backgroundColor: "{colors.dark-sidebar-ring}"
    width: 3px
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

# Brutalist Mono

## Overview

Brutalist Mono is the interface with its structure showing. It rejects polish as a
signal of quality and replaces it with **honesty, contrast and conviction**: black on white,
hard edges, visible grids, thick rules, and type that looks like it came out of a terminal or
a photocopier. It should feel **raw, confident and a little confrontational** — a manifesto,
a zine, a dev tool that does one thing and says so in capital letters.

There is exactly one colour: **Acid Yellow** (#E4FF1A). Everything else is black, white and
a few greys. Dark mode simply inverts the world — near-black page, white rules — and the
acid yellow gets even louder.

Density is medium; scale contrast is extreme. Massive Space Grotesk headlines sit next to
small mono body text. Nothing is rounded, nothing is blurred, nothing fades.

## Colors

- **Background (#FFFFFF) — "Paper White"** and **Foreground (#000000) — "Toner Black":**
  pure values, 21:1. This is the one system where pure black and pure white are correct.
- **Primary (#E4FF1A) — "Acid":** primary buttons, highlights, the selected tab, text
  selection, marker-style highlights behind key words. Always carries black text (18.6:1).
  **Never use acid as text or as a thin line on white** — it disappears. On dark it may be
  used as text.
- **Secondary (#000000):** the inverse slab — black buttons and badges with white text.
- **Accent (#000000 with #E4FF1A text):** hover and selected rows in menus and lists invert
  to black with acid text. In dark mode this flips to an acid fill with black text.
- **Muted (#F2F2F2) / Muted foreground (#555555):** the only greys for text — captions,
  metadata, disabled. 6.7:1 on muted, 7.5:1 on white.
- **Border / Input / Ring (#000000):** every border is black (white in dark mode) and at
  least 2px. Focus is a 3px solid ring offset 2px; in dark mode the ring turns acid.
- **Destructive (#E00000):** pure alarm red, used as text and 2px borders.
- **Charts:** black, acid, and three greys. Distinguish series with hatching and patterns,
  and outline every bar or slice in 2px black.

## Typography

Two families from the same foundry family — **Space Grotesk** shouts, **Space Mono** talks.

- **Display (Space Grotesk 80px/700, 0.95, -0.04em):** hero statements, often uppercase,
  allowed to run edge-to-edge and break mid-word on mobile.
- **Headline-lg (48px/700) / Headline-md (28px/700):** page and section titles. Tight
  leading, tight tracking.
- **Body-lg / body-md / body-sm (Space Mono 17 / 14 / 12px, 400):** all running text is
  monospace. Keep paragraphs short — mono is slower to read, so cap the measure at ~64ch.
- **Label-md / label-sm (Space Mono 700, +0.04em / +0.08em):** buttons, tabs, badges, table
  headers — always **UPPERCASE**.
- **Mono (Space Mono 13px):** code, data, numbers.

Space Mono ships only 400 and 700; use exactly those. Prefix things with typographic
devices: `→`, `//`, `[01]`, `*`, `#`. Numbered sections (`01 / FEATURES`) are encouraged.

## Layout

An exposed **12-column grid** with 2px black gutters drawn as rules — the grid lines are part
of the design. 8px base, with big jumps: 24px inside components, 48px between blocks, 96px
between sections. Max width 1280px, but full-bleed bands (an acid-yellow marquee, a black
footer) are welcome. Align everything hard-left; asymmetric layouts and oversized numbers
in the margin are on-brand. Tables are first-class: full 2px borders on every cell.

## Elevation & Depth

No blur, no soft shadows, no gradients. Depth is a **hard offset shadow**: `4px 4px 0 0
#000000` (white in dark mode) on cards, buttons and popovers. Interactive elements
"press" by translating 4px down-right and dropping the shadow to 0 — a physical, mechanical
click. Overlays use a solid 2px-bordered panel over a flat 60% black scrim, never a blurred
backdrop.

## Shapes

**Zero radius, everywhere, always.** `--radius` is 0 and every `rounded.*` token is 0 —
including `full`; avatars are square, status dots are squares, checkboxes and radio buttons
are squares (the radio's checked state is a filled inner square). Borders are 2px by default,
4px for emphasis (hero frames, active tabs). Icons are 2px-stroke, square line caps, 20–24px.

## Components

- **Primary button:** acid fill, black UPPERCASE label-md, 2px black border, 48px tall,
  4px hard shadow; press = translate(4px, 4px) and shadow 0.
- **Secondary button:** black slab with white text (inverts to white/black in dark mode).
- **Outline button:** white with 2px black border and black text; hover fills acid.
- **Card:** white, 2px black border, 4px hard shadow, 24px padding, 0 radius. Card headers
  can be a full-width black bar with white label-md text.
- **Input:** 48px tall, 2px black border, 0 radius, mono body text; focus = 3px ring offset
  2px. Labels are UPPERCASE label-sm above the field.
- **Badge:** black slab, white label-sm, square. Use acid badges only for "NEW"/"LIVE".
- **Menu / list hover:** full-row inversion to black with acid text.
- **Tabs:** square segments separated by 2px rules; active tab is acid fill.
- **Marquee / ticker:** acid band with black uppercase mono, scrolling linearly.

## Do's and Don'ts

- Do use 0 radius on every element, including avatars, dots and checkboxes.
- Do draw 2px solid borders (4px for emphasis) and use the 4px hard offset shadow for depth.
- Do set UI labels in UPPERCASE Space Mono bold and headlines in tight Space Grotesk 700.
- Do keep the palette to black, white, greys and a single acid yellow.
- Do invert (black ↔ white/acid) for hover, selection and active states.
- Don't use acid yellow as text or thin lines on a white background.
- Don't add blur, gradients, soft shadows, glassmorphism or rounded corners.
- Don't use font weights other than 400 and 700, or any typeface outside the Space family.
- Don't ease motion softly — use instant state changes or linear/steps() animations under 150ms.
- Don't center everything; hard-left alignment and visible grid lines are the point.

## Motion

Motion language: **quiet** ([MOTION.md](../MOTION.md#quiet)) — but hard-edged: instant, mechanical, no easing curves that feel soft.

- **Durations:** 80–120ms; state changes may be instant (0ms) for a raw feel.
- **Easing:** `steps(2, end)` or `linear` for mechanical toggles; `cubic-bezier(0.2, 0, 0, 1)` when something must travel.
- **What animates:** hard offset-shadow press (shadow collapses to 0 on press), hover invert (black ↔ acid), marquee ticker of text, typewriter/encrypted text once in the hero.
- **What doesn't:** blur, glow, gradients, springs, parallax.
- Respect `prefers-reduced-motion`: stop marquees and typewriters; keep instant state changes.

## Agent Prompt

You are designing in the Brutalist Mono system: stark black-and-white brutalism with zero
border radius, 2px black borders, 4px hard offset shadows and one acid-yellow accent
(#E4FF1A) that always carries black text. Set headlines in Space Grotesk 700 with tight
tracking and huge scale, and set all body copy, labels and data in Space Mono (400/700),
with UPPERCASE labels and devices like `→`, `//` and `[01]`. Hover and selection states
invert colours rather than tint them; buttons press by translating into their shadow. Dark
mode is a near-black page with white rules and an acid focus ring. Motion is instant or
linear — terminals, encrypted-text reveals, tickers and number pops are on-brand; blur,
glass, gradients and soft easing are forbidden. Use shadcn/ui primitives with every radius
forced to 0 and borders thickened to 2px.

## Pairs well with

- aceternity/terminal
- aceternity/encrypted-text
- aceternity/infinite-moving-cards
- aceternity/noise-background
- aceternity/bento-grid
- beautifui/diff-table
- transitions/number-pop-in
- transitions/tabs-sliding
- oc/pricing-simple
- oc/feature-bento
