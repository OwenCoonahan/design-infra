---
version: alpha
name: Linear Dark
moods: [technical, refined, premium]
motion: quiet
description: Dense, precise, dark-first SaaS chrome in the Linear/Raycast lineage. Best for issue trackers, dev tools, command palettes, dashboards and internal tools where speed and information density matter more than decoration.
colors:
  background: "#0B0C0E"
  foreground: "#EDEEF0"
  card: "#131417"
  card-foreground: "#EDEEF0"
  popover: "#18191D"
  popover-foreground: "#EDEEF0"
  primary: "#5E6AD2"
  primary-foreground: "#FFFFFF"
  secondary: "#1E1F24"
  secondary-foreground: "#E2E3E7"
  muted: "#16171B"
  muted-foreground: "#8A8F98"
  accent: "#1D1E25"
  accent-foreground: "#F1F2F4"
  destructive: "#EB5757"
  border: "#FFFFFF14"
  input: "#FFFFFF1F"
  ring: "#7C86F0"
  chart-1: "#7C86F0"
  chart-2: "#4CB782"
  chart-3: "#F2C94C"
  chart-4: "#F2994A"
  chart-5: "#BB87FC"
  sidebar: "#08090A"
  sidebar-foreground: "#D0D3D9"
  sidebar-primary: "#5E6AD2"
  sidebar-primary-foreground: "#FFFFFF"
  sidebar-accent: "#1A1B20"
  sidebar-accent-foreground: "#F1F2F4"
  sidebar-border: "#FFFFFF0F"
  sidebar-ring: "#7C86F0"
  success: "#4CB782"
  warning: "#F2C94C"
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -0.032em
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.024em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.016em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: -0.011em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: -0.006em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: -0.003em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.02em
  mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
rounded:
  none: 0px
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  row-height: 32px
  control-height: 28px
  gutter: 16px
  sidebar-width: 240px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    height: 28px
    padding: 12px
  button-primary-hover:
    backgroundColor: "#535FC8"
    textColor: "{colors.primary-foreground}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    height: 28px
    padding: 12px
  button-ghost:
    backgroundColor: "{colors.background}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    height: 28px
    padding: 8px
  button-destructive:
    backgroundColor: "{colors.background}"
    textColor: "{colors.destructive}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    height: 28px
    padding: 12px
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.lg}"
    padding: 16px
  popover:
    backgroundColor: "{colors.popover}"
    textColor: "{colors.popover-foreground}"
    rounded: "{rounded.lg}"
    padding: 4px
  input:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    height: 32px
    padding: 10px
  input-border:
    backgroundColor: "{colors.input}"
    width: 1px
  divider:
    backgroundColor: "{colors.border}"
    height: 1px
  focus-ring:
    backgroundColor: "{colors.ring}"
    width: 2px
  badge:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.sm}"
    height: 20px
    padding: 6px
  kbd:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.mono}"
    rounded: "{rounded.sm}"
    height: 18px
    padding: 4px
  list-row:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    height: 32px
    padding: 12px
  list-row-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
  status-dot-success:
    backgroundColor: "{colors.success}"
    size: 6px
    rounded: "{rounded.full}"
  status-dot-warning:
    backgroundColor: "{colors.warning}"
    size: 6px
    rounded: "{rounded.full}"
  sidebar:
    backgroundColor: "{colors.sidebar}"
    textColor: "{colors.sidebar-foreground}"
    width: 240px
  sidebar-item-active:
    backgroundColor: "{colors.sidebar-accent}"
    textColor: "{colors.sidebar-accent-foreground}"
    rounded: "{rounded.md}"
    height: 28px
  sidebar-item-primary:
    backgroundColor: "{colors.sidebar-primary}"
    textColor: "{colors.sidebar-primary-foreground}"
    rounded: "{rounded.md}"
    height: 28px
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
---

# Linear Dark

## Overview

Linear Dark is a tool, not a poster. It is the visual language of software that people
live inside for eight hours a day: issue trackers, command palettes, deploy dashboards,
admin consoles. The personality is **calm, fast and exact** — the interface should feel
like it was machined rather than drawn. Everything is quiet so that the user's data can be
loud.

The system is dark-first and single-mode: there is no light theme, and `.dark` reuses the
same palette. Surfaces are near-black with a faint cool cast, separated by hairlines rather
than shadows. A single indigo-violet carries every primary action and every focus state.
Density is high: 32px rows, 28px controls, 13–14px body text. If a screen feels airy, it is
probably wrong.

Target audience: engineers, PMs and designers who use keyboard shortcuts, scan long
lists, and notice 1px misalignments.

## Colors

The palette is a tight ladder of cool near-blacks plus one saturated indigo.

- **Background (#0B0C0E) — "Void":** the page canvas. Never pure black; the slight blue lift
  keeps it from looking like a dead screen.
- **Card (#131417) — "Graphite":** the first raised surface: panels, cards, the issue detail
  pane.
- **Popover (#18191D) — "Slate Glass":** menus, command palette, tooltips — the highest
  surface, one step brighter again.
- **Secondary (#1E1F24) / Accent (#1D1E25):** secondary buttons, chips, and the hover/selected
  state of list rows. Hover is a fill change, never a border change.
- **Muted (#16171B) / Muted foreground (#8A8F98):** input wells, disabled areas, timestamps,
  metadata, placeholder text. Muted foreground passes AA on every surface in the ladder.
- **Foreground (#EDEEF0):** body and headings. Off-white, never #FFFFFF, to avoid halation on
  dark backgrounds.
- **Primary (#5E6AD2) — "Linear Indigo":** the one action colour. Primary buttons, the
  active nav item indicator, selected checkboxes, progress. White text on it is 4.8:1.
- **Ring (#7C86F0):** a brighter indigo for 2px focus rings so focus is unmistakable against
  the dark ladder.
- **Border (#FFFFFF14) / Input (#FFFFFF1F):** translucent white hairlines at 8% and 12%. They
  adapt to whichever surface they sit on — this is why they are alpha, not solid.
- **Destructive (#EB5757):** errors, delete, "cancelled" status. Use sparingly.
- **Status extras:** `success` (#4CB782) and `warning` (#F2C94C) exist for status dots and
  inline icons only — never for large fills.

Charts use `chart-1`…`chart-5` (indigo, green, amber, orange, lavender) at full saturation
on dark, with 1px lines and no gradients under the curve.

## Typography

**Inter** does all of the UI work; **JetBrains Mono** handles anything a machine produced.

- **Display (48px/600, -0.032em):** marketing hero and empty-state headlines only. Tight
  negative tracking is what makes Inter look engineered at large sizes.
- **Headline-lg (30px/600) and headline-md (20px/600):** page titles and section headers.
  One headline-lg per view.
- **Body-md (14px/400):** the default UI size — list rows, descriptions, form values.
- **Body-sm (13px/400):** dense tables, secondary lines in a row, activity feeds.
- **Body-lg (16px/400):** long-form only (docs, issue descriptions in reading mode).
- **Label-md (13px/500):** buttons, tabs, nav items, field labels. Weight 500, not 600 —
  bold buttons look shouty here.
- **Label-sm (11px/500, +0.02em):** badges, column headers, keyboard hints.
- **Mono (JetBrains Mono 12px):** issue IDs (`ENG-1423`), commit SHAs, durations, keyboard
  shortcuts, code. Enable tabular numerals (`tabular-nums`) for any column of figures.

Never use more than two weights in one component (400 + 500, or 500 + 600).

## Layout

The grid is a **4px base** with an 8px rhythm. Standard app shell: a 240px sidebar on
`sidebar` (#08090A), a 48px top bar, and a fluid content pane. List rows are 32px tall with
12px horizontal padding; controls are 28px; inputs 32px. Section gaps are 24–32px; inside a
card, 16px padding and 8–12px between elements.

Content is left-aligned and dense. Prefer split views (list + detail) over modals. Marketing
pages cap at 1120px with generous vertical spacing, but in-app screens fill the viewport.

## Elevation & Depth

Depth comes from **tonal steps plus hairlines**, not shadows. Each layer up the stack
(background → card → popover) is a few points brighter and bordered with `border`. The only
shadow in the system is reserved for floating layers (popover, command palette, dialog):
`0 8px 24px -4px #00000099` plus a 1px `border` ring. Modals sit on a `#000000B3` scrim.

A faint top-edge highlight (`inset 0 1px 0 #FFFFFF0A`) on cards and primary buttons is
allowed — it reads as light catching a machined edge.

## Shapes

Small, consistent radii. `--radius` is **8px** (`rounded.lg`) for cards, panels and dialogs;
**6px** (`rounded.md`) for buttons and inputs; **4px** (`rounded.sm`) for badges, kbd and
checkboxes. `rounded.full` is only for avatars and status dots. Never mix a pill button into
this system. Icons are 16px, 1.5px stroke (Lucide or Tabler), aligned to the text baseline.

## Components

- **Primary button:** indigo fill, white label-md, 28px tall, 12px horizontal padding, 6px
  radius. Hover deepens to #535FC8 (keeps white text above 4.5:1); active presses 1px down. Always pair with a kbd hint
  when a shortcut exists (`Create issue  C`).
- **Secondary button:** #1E1F24 fill with a `border` hairline, near-white text. Most buttons
  on a screen should be secondary or ghost.
- **Ghost button:** transparent, muted-foreground text, accent fill on hover. Used for
  toolbar icons and row actions.
- **Card:** #131417, 1px `border`, 8px radius, 16px padding. No shadow.
- **Input:** #16171B well, 1px `input` border, 32px tall. Focus = 2px `ring` outline offset 0,
  no glow.
- **Badge:** 20px, label-sm, 4px radius, secondary fill. Status badges get a 6px coloured
  dot on the left instead of a coloured fill.
- **List row:** 32px, full-bleed hover in `accent`, selected rows get a 2px primary bar on the
  left edge. Trailing metadata in mono, muted-foreground.
- **Command palette:** popover surface, 640px wide, 48px search input with no border, results
  as list rows, section labels in label-sm uppercase muted.
- **Kbd:** mono 12px on secondary, 4px radius, muted text.

## Do's and Don'ts

- Do keep the canvas near-black (#0B0C0E) and step surfaces up by tone, not by shadow.
- Do use indigo for exactly one primary action per view; everything else is secondary or ghost.
- Do show keyboard shortcuts next to actions and in menus using the `kbd` style.
- Do set IDs, timestamps, SHAs and numbers in JetBrains Mono with tabular numerals.
- Do keep rows at 32px and controls at 28px — density is the brand.
- Don't use pure white (#FFFFFF) for body text or pure black (#000000) for backgrounds.
- Don't add drop shadows to cards, gradients to buttons, or glows to focus rings.
- Don't use radii larger than 12px or pill-shaped buttons.
- Don't introduce a second accent hue; status colours appear only as dots and icons.
- Don't animate longer than 200ms; transitions are 120–160ms ease-out and mostly opacity/transform.

## Motion

Motion language: **quiet** ([MOTION.md](../MOTION.md#quiet)). Motion confirms, it never performs.

- **Durations:** 120ms (press, hover), 180ms (menus, popovers, tabs), 240ms max (dialogs, panels).
- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out) for entering; `cubic-bezier(0.4, 0, 1, 1)` for exiting. No springs, no bounce.
- **What animates:** press scale (0.98), hover background/border tint, focus ring, list rows fading in on data change, numbers ticking on update, tab indicator sliding.
- **What doesn't:** page sections on scroll, backgrounds, text reveals. One allowed exception: a single subtle hero spotlight/beam.
- Respect `prefers-reduced-motion`: drop transforms, keep opacity.

## Agent Prompt

You are building UI in the Linear Dark system: a dense, precise, dark-only SaaS interface in
the lineage of Linear and Raycast. Use shadcn/ui components on near-black surfaces
(#0B0C0E → #131417 → #18191D) separated by 8% white hairlines, with a single indigo
(#5E6AD2) for primary actions and focus. Set UI text in Inter at 13–14px with weight 400/500
and tight negative tracking on headings, and set IDs, numbers, shortcuts and code in
JetBrains Mono. Keep density high (32px rows, 28px buttons, 8px card radius, 6px controls)
and prefer split views, command palettes and keyboard hints over modals and wizards. Motion
is minimal and fast (120–160ms, opacity and small translate only); the only decorative
effects allowed are a subtle spotlight or beam on marketing heroes. Never add shadows to
cards, gradients to buttons, or a second accent colour.

## Pairs well with

- aceternity/spotlight-new
- aceternity/background-beams
- aceternity/terminal
- aceternity/encrypted-text
- librariesdev/border-beam
- beautifui/diff-table
- beautifui/thinking-state
- transitions/tabs-sliding
- transitions/number-pop-in
- oc/agent-status
- oc/feature-bento
- oc/hero-spotlight
