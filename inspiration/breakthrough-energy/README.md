---
slug: breakthrough-energy
name: Breakthrough Energy
url: https://www.breakthroughenergy.org/
type: website
summary: Institutional energy storytelling using oversized typography, full-viewport video, a sparse navigation shell and a scroll-led sequence of imagery, figures and portfolio material.
likes: 'The user calls this "clean"; its strong typographic hierarchy and intentional compositions show that clean can include vivid accents and substantial motion.'
moods: [refined, editorial, bold]
categories: [hero, navigation, image, stats, chart, scroll-effect, blog, form, footer]
tags: [energy, institutional, storytelling, editorial, clean, photography, video, portfolio]
related:
  - oc/navbar
  - oc/hero-split
  - oc/stats-row
  - oc/feature-list
  - oc/footer-columns
  - shadcn/chart-bar-interactive
  - kibo-ui/video-player
  - motion/scroll-linked
added: 2026-10-11
---

# Breakthrough Energy

[View the live site](https://www.breakthroughenergy.org/). Screenshots remain private review material. The site's brand marks, footage, imagery and font files are not redistributed.

## Feel

The user described this as **clean**. The opening pairs oversized, asymmetric sans-serif typography with full-viewport video and very little navigation chrome. Later scenes use a warm-white canvas, moving photographic arrangements and a vivid lime accent. These are substantial visual choices, but each scene has a clear focal point. Calling the site minimal alone would lose the art direction and narrative motion.

## Palette & type

Computed styles record warm white `#fafbf8`, ink `#12110e`, grey `#808080` and lime `#dfff5c`. Loaded families are `Saans` and `ItemsRegular`. The inspected desktop opening uses a roughly 139px, weight-500 headline at 1440px viewport width; this is a responsive composition, not a universal heading token. Smaller samples include 16px body text and 12px labels. The observed visual contrast between sans-serif statements and small serif labels is more useful than blindly copying these sizes.

Use existing project fonts where possible. Evaluate Inter for sans-serif and a licensed serif for labels as starting points, preserving optical balance rather than claiming exact font equivalence. Do not infer a complete system from a single viewport.

## Layout & patterns

| Pattern | Observed treatment | Reusable starting point |
| --- | --- | --- |
| Video opening | Large statement split across the viewport, spare branding and menu | Navigation behavior from `oc/navbar`, media controls from `kibo-ui/video-player`; the type/media composition needs original layout work |
| Narrative transition | Photographs arranged around a central mark and changing statement | `motion/scroll-linked` for technique; original layout and licensed imagery, without copying the brand mark |
| Explanatory data graphic | One comparison framed by a large lime field and direct values | `shadcn/chart-bar-interactive` where interaction is useful, or a simpler original semantic graphic; include units and a textual alternative |
| Supporting evidence | Large figures within the narrative | `oc/stats-row` as a starting structure |
| Programs and stories | Sectioned narrative and portfolio links | `oc/feature-list`; select story cards from the blog catalog based on the actual content |
| Newsletter and footer | Short form followed by grouped navigation | Project form primitives and `oc/footer-columns` |

## Motion and capture limits

The hero plays video. Additional browser inspection at several scroll positions confirmed image arrangements, changing narrative text and a large annotated comparison. The automated full-page capture missed much of the scroll-led content; its blank areas are capture artifacts, not empty page design. The extracted heading outline is also incomplete. Do not treat the snapshot as a complete map of the website.

Use motion to pace an institutional story, with a readable static reduced-motion version. Do not carry long pinned storytelling sequences into a frequently used data workspace.

## How to apply

This is a reference for **institutional/editorial structure**: opening statement → context and evidence → narrative/programs → portfolio/stories → subscription/footer. Inspect the live section being adapted before implementing it.

For a **data product**, reuse hierarchy, direct labeling, purposeful color and restrained chrome. Replace the narrative sequence with persistent navigation, filter controls, comparable visualizations, record tables and detail views. Clean presentation must retain the information density needed to make decisions.

Build and review a working composition before extracting DESIGN.md rules. Existing theme presets are not the default for this reference.
