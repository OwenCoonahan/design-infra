---
component: card
title: Cards
categories: [card]
aliases: [card, tile, panel, feature card, product card, pricing card, info card, surface, box, container]
directions:
  - key: enter-stagger
    label: Fade/blur in on view, staggered
    feel: Cards arrive in a soft sequence as the grid scrolls into view, then sit perfectly still.
    when: Feature grids, pricing tiers, blog/card lists on marketing pages. The safe first animation for any card grid.
    avoid: App dashboards that re-render often (re-running entrances on every data refresh is noise).
    intent: [animate]
    intensity: subtle
    moods: [calm, refined, minimal, warm]
    picks: [magicui/blur-fade, motion-primitives/animated-group, motion-primitives/in-view, motion/scroll-triggered]
  - key: hover-highlight
    label: Shared hover highlight across the grid
    feel: One highlight slides from card to card under the pointer — the grid feels like a single connected surface.
    when: Grids of 3–9 clickable cards (features, integrations, docs links). Linear/Vercel-style marketing.
    avoid: Non-interactive cards (implies clickability) and touch-only contexts.
    intent: [animate, polish]
    intensity: subtle
    moods: [refined, minimal, technical]
    picks: [motion-primitives/animated-background, aceternity/card-hover-effect]
  - key: cursor-spotlight
    label: Cursor spotlight / border glow
    feel: A soft radial light follows the pointer across the card surface or rim. Depth without movement.
    when: Dark themes, bento grids, feature tiles that want a premium touch.
    avoid: Light editorial themes; default purple/pink gradients — feed var(--primary) at low alpha.
    intent: [animate, polish]
    intensity: medium
    moods: [premium, refined, futuristic]
    picks: [magicui/magic-card, aceternity/glowing-effect, react-bits/spotlight-card, aceternity/card-spotlight]
  - key: tilt-glare
    label: 3D tilt + glare
    feel: The card tips toward the pointer with a moving sheen — tangible, collectible, product-shot energy.
    when: Product or media cards, profile/badge cards, launch pages. One hero card or a small set.
    avoid: Text-heavy cards (tilting text is hard to read) and dense grids.
    intent: [animate]
    intensity: medium
    moods: [premium, playful, futuristic]
    picks: [transitions/card-tilt, aceternity/comet-card, react-bits/tilted-card, aceternity/glare-card]
  - key: live-beam
    label: The one "live" card — animated border beam
    feel: A light travels the card border, marking it as active, featured or running.
    when: Featured pricing tier, the agent run in progress, the hero screenshot frame. Exactly one per screen.
    avoid: Multiple beams per screen (nothing is special any more); brutalist and editorial themes.
    intent: [animate, add-state]
    intensity: medium
    moods: [premium, futuristic, refined]
    picks: [oc/beam-card, magicui/border-beam, cult-ui/border-beam-card]
  - key: expand-detail
    label: Expand into detail (shared-layout morph)
    feel: The card grows into a dialog or expanded panel instead of navigating away — continuity of place.
    when: Galleries, case studies, team/product cards with more content, compact ↔ expanded list cards.
    avoid: Cards whose detail deserves its own URL (use a page), or forms inside the morph.
    intent: [animate, add-state]
    intensity: medium
    moods: [refined, playful, organic]
    picks: [motion-primitives/morphing-dialog, cult-ui/expandable, transitions/card-resize, motion/layout-animation]
  - key: restyle-surface
    label: Restyle the surface (frosted rim, extrusion, organic shape)
    feel: Static but distinctive — gradient-rim glass, hard L-shaped extrusion, or a soft organic marketing card.
    when: The card looks generic and the brief wants personality more than motion.
    avoid: Mixing several card styles on one page; check dark mode (some use literal white surfaces).
    intent: [restyle, replace]
    moods: [warm, playful, bold, editorial]
    picks: [cult-ui/halo-card, cult-ui/shadow-card, cult-ui/organic-card, cult-ui/folded-card]
  - key: hover-reveal
    label: Hover reveal effect (encrypted, pixel, dot canvas)
    feel: Hovering transforms the card — scrambled glyphs, pixel dissolve or a dot field blooming behind the content.
    when: Dev-tool and security marketing, experimental portfolios; small sets of 2–4 cards.
    avoid: Anything users must read quickly; heavy canvas effects in long grids.
    intent: [animate]
    intensity: expressive
    moods: [experimental, technical, futuristic]
    picks: [aceternity/evervault-card, aceternity/canvas-reveal-effect, react-bits/pixel-card, aceternity/direction-aware-hover]
---

**Recommend.** `enter-stagger` for marketing grids, `hover-highlight` for clickable grids; `live-beam` for the one card that is "on". Pick at most one hover effect per card.

**What makes a card feel good.** One clear job per card (one title, one action), a hit area that matches what
looks clickable, and a surface that sits correctly in the theme's elevation ladder (`bg-card`, `border-border`,
the theme's shadow — not a custom one). Hover should confirm "this is clickable", not perform.

**Common mistakes.** Making the whole card hover-lift when only a link inside is clickable. Stacking effects
(tilt + spotlight + beam on the same card). Hover-lift via `margin`/`top` instead of `transform`, which reflows
the grid. Hard-coded `neutral-*`/`#120F17` palettes from Aceternity/React Bits that break light themes — swap
to tokens. Running entrance animations on every re-render.

**Accessibility musts.** If the whole card is a link, use one `<a>` with a stretched pseudo-element, not nested
interactive elements. Focus styles must match hover styles (spotlight and tilt are pointer-only, so give
keyboard users a visible ring). Morphing dialogs must trap focus and return it to the card on close. Under
`prefers-reduced-motion` skip tilt, spotlight tracking and staggered entrances; show content immediately.

**Performance.** Pointer-tracking effects should write CSS variables in `requestAnimationFrame`, not React state.
Canvas/WebGL reveal cards (`canvas-reveal-effect`) mount one context per card — cap at a handful and unmount
off-screen. `backdrop-filter` glass is expensive in long scrolling lists.

**Further reading** (Jakub Krehel, link-only):

- [Details that make interfaces feel better](https://jakub.kr/writing/details-that-make-interfaces-feel-better) — concentric radius for nested surfaces
- [Using shadows instead of borders](https://jakub.kr/work/shadows) — layered shadow rings that work on any background
- [Understanding gradients](https://jakub.kr/work/gradients) — colour spaces for gradient fills; [oklch.fyi](https://oklch.fyi) (free OKLCH palette guide and picker)
