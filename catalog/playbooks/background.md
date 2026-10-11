---
component: background
title: Section & page backgrounds
categories: [background]
aliases: [background, backdrop, bg, section background, hero background, page background, pattern, gradient, grid background, dots, noise, grain, texture, aurora, shader background]
directions:
  - key: quiet-pattern
    label: Quiet dot/grid pattern with a fade mask
    feel: A barely-there dot or line grid fading out at the edges — structure and craft, zero noise.
    when: Default backdrop for heroes, empty states, feature sections on any theme.
    avoid: Full-opacity patterns; tint with text-muted-foreground at 20–40% and add a radial mask.
    intent: [restyle, polish]
    moods: [minimal, technical, refined, calm]
    picks: [magicui/dot-pattern, magicui/grid-pattern, magicui/striped-pattern, aceternity/dotted-glow-background]
  - key: grain-texture
    label: Grain & paper texture
    feel: Fine noise over flat colour — warmth, tactility, a printed feel.
    when: Editorial, warm and brutalist themes; flat gradients that look cheap.
    avoid: Animated grain in long reading pages (static is enough).
    intent: [restyle, polish]
    intensity: subtle
    moods: [editorial, warm, retro, organic]
    picks: [magicui/noise-texture, cult-ui/texture-overlay, react-bits/noise]
  - key: spotlight-wash
    label: Spotlight or soft gradient wash
    feel: A single light source or soft colour wash behind the headline — focus and atmosphere.
    when: Hero backdrops; spotlight on dark themes, aurora wash on soft-glass/consumer AI.
    avoid: Library-default blues/purples — tint from --primary (oc/hero-spotlight already does).
    intent: [restyle, animate]
    intensity: subtle
    moods: [premium, calm, warm, refined]
    picks: [oc/hero-spotlight, aceternity/spotlight-new, aceternity/aurora-background, magicui/light-rays]
  - key: animated-grid
    label: Animated grid (flicker, pulse, retro)
    feel: Grid cells flicker or light up slowly, or a horizon grid scrolls — systems and infrastructure energy.
    when: Dev tools, infra, AI platforms; hero and CTA sections.
    avoid: Behind body text; more than one animated background per page.
    intent: [animate]
    intensity: medium
    moods: [technical, futuristic, retro]
    picks: [magicui/flickering-grid, magicui/animated-grid-pattern, magicui/retro-grid]
  - key: beams-lines
    label: Beams, rays & flowing lines
    feel: Thin light beams or lines drift behind content — cinematic depth on near-black.
    when: Dark premium heroes and CTAs.
    avoid: Light themes; long copy on top.
    intent: [animate]
    intensity: medium
    moods: [premium, futuristic]
    picks: [aceternity/background-beams, react-bits/light-rays, react-bits/threads]
  - key: interactive
    label: Cursor-reactive field
    feel: Dots or cells respond to the pointer — the page notices you.
    when: Developer and creative landing pages, CTA panels, 404s.
    avoid: Behind forms and reading content; touch-first audiences get nothing.
    intent: [animate, add-state]
    intensity: medium
    moods: [playful, technical, experimental]
    picks: [react-bits/dot-grid, magicui/interactive-grid-pattern, aceternity/background-ripple-effect]
  - key: shader
    label: Full shader backdrop (aurora, silk, dither)
    feel: A living WebGL surface — silk folds, grainy gradients, dithered fields. The background is the brand.
    when: Launch pages, AI/consumer heroes, art-directed sites. One per page, above the fold only.
    avoid: App UI, low-end mobile, behind dense text. Pass theme colours; defaults are purple/green.
    intent: [animate, replace]
    intensity: expressive
    moods: [experimental, futuristic, premium, organic]
    picks: [react-bits/grainient, react-bits/silk, cult-ui/hero-dithering, react-bits/aurora]
---

**Recommend.** `quiet-pattern` (masked, muted) for most sections; `spotlight-wash` for heroes. `shader` only for launch pages, one per page.

**What makes a background feel good.** It supports the content instead of competing with it: low contrast,
masked edges so it never butts against a hard section line, colours derived from the theme (`--primary`,
`--muted-foreground`), and text that passes contrast over every pixel of it. Most sections need no background
at all — use them to mark the hero, a CTA or an empty state.

**Common mistakes.** Animated backgrounds on every section. Library default palettes (purple, orange, neon) on
a themed site. Text placed straight on busy shaders without a scrim. Full-viewport WebGL running while
scrolled away. Hard-coded black backgrounds that break light mode.

**Accessibility musts.** Maintain 4.5:1 contrast for text over the brightest part of the background (add a
gradient scrim if needed). Backgrounds are decorative: `aria-hidden="true"`, `pointer-events-none` unless
interactive. Under `prefers-reduced-motion` freeze to a static frame (render the pattern without animation;
pause shaders on first frame). Avoid flicker faster than 3Hz.

**Performance.** SVG patterns and CSS gradients are nearly free; canvas grids are moderate; WebGL shaders
(ogl/three/paper-shaders) are the heaviest thing on most pages — lazy-load, pause with IntersectionObserver
and `document.hidden`, cap DPR at 1.5, and never run two at once.
