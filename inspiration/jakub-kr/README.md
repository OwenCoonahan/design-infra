---
slug: jakub-kr
name: Jakub Krehel
url: https://jakub.kr/
type: portfolio
summary: Design-engineer portfolio and writing site — a single narrow column of system-sans text where the craft lives in small details (concentric radii, shadow rings, icon cross-fades, balanced wrapping) rather than in layout or colour.
likes: Researched as the source of the jakubkrehel/skills polish rules and loading.dev. Worth keeping for how much finish a nearly plain page gets from exact details, and because every page ships an agent-readable `.md` twin.
moods: [refined, minimal, technical]
categories: [blog, button, card, loader]
tags: [portfolio, design-engineering, writing, concentric-radius, shadow-border, icon-swap, text-wrap, tabular-nums, interruptible-motion, llms-txt, markdown-pages]
related:
  - smoothui/button-copy
  - transitions/icon-swap
  - motion/shared-layout-animation
  - motion-primitives/animated-background
  - motion-primitives/sliding-number
  - magicui/blur-fade
  - loading-dev/arc
added: 2026-10-28
---

# Jakub Krehel

[Visit the live site](https://jakub.kr/). Captured images stay in `.context/inspiration/jakub-kr/` for private review;
no screenshots, demo code, articles or assets from the site are redistributed. Observations below come from the
capture and the site's own markdown pages (`https://jakub.kr/llms.txt`).

## What makes it work

A single column (`max-width` ≈ 43rem) of 17px system sans (`ui-sans-serif`, weights 400/450/500, `antialiased`) on an off-white `#fcfcfc` page. No hero,
no grid, no accent colour: the name, a two-line intro with inline icon links, then project rows (a small rounded
tile + title + one muted line) and a writing list. The restraint is the point. The things that stand out are the
details, which are also what his writing and skills teach:

| pattern | what you see | how to reproduce |
| --- | --- | --- |
| **Concentric radius** | Nested surfaces share a centre of curvature; outer radius = inner radius + padding | Recipe; the `better-ui` skill (`jakub-skills` in the toolchain) checks it. Captured radii: 16 / 8 / 5px |
| **Shadow ring instead of border** | Project tiles use a three-layer shadow (a 1px 6%-black ring plus two soft drops — the recipe from his /work/shadows article), so edges work on any background | Recipe: layered `box-shadow` with alpha; keep a transparent border for forced-colors mode |
| **Icon swap with opacity / scale / blur** | Described in his writing and `better-ui`: contextual icons (copy → copied) cross-fade opacity, scale (0.25 → 1) and blur (4px → 0), spring with no bounce | `smoothui/button-copy` (drop-in), `transitions/icon-swap` (recipe) |
| **text-wrap balance / pretty** | Every paragraph uses `text-pretty` (no orphans); his writing pairs it with `text-balance` on titles | One utility each (`text-balance`, `text-pretty`); no component needed |
| **tabular-nums** | Dates and numbers use `tabular-nums`, so updates don't shift | `tabular-nums`; `motion-primitives/sliding-number` when the change should animate |
| **Interruptible transitions** | Interactions use transitions/springs that retarget mid-flight; keyframes only for one-off sequences | `motion/shared-layout-animation`, `motion-primitives/animated-background` for highlights that glide between items |
| **Split, staggered enters** | Title / description / actions enter 100ms apart with opacity, blur and a small translateY | `magicui/blur-fade` with per-chunk delays |
| **`.md` version of every page** | `llms.txt` plus `<url>.md` for each article; demos stay on the page | Agent-readable docs pattern; design-infra serves `/integrate/raw` and `/reference/raw` the same way |
| **Quiet loaders** | His own `loading-dev` package: monochrome, currentColor, reduced motion built in | `loading-dev/arc` and the other curated `loading-dev/*` picks |

## How to apply

Use it for personal sites, docs, changelogs and writing-heavy product pages where the content should carry the page.
Take the *details* (radius maths, shadow rings, wrapping, numerals, icon motion) into any design system; they don't
fight a brand. Don't copy the single-column layout into an app or a marketing page that needs structure.

Pair it with the `jakub-skills` toolchain entry for the polish pass, and with the learning links in
`design-systems/MOTION.md` and the button / card / tabs / image playbooks.

## Moods

**Refined** (micro-detail is the whole design), **minimal** (one column, no accent, no decoration), **technical**
(design-engineer writing, exact values, machine-readable pages).
