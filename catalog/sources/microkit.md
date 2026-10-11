---
slug: microkit
name: MicroKit
url: https://microkit.co/
summary: 49 copy-paste micro-interactions (buttons, tabs, menus, a scrub number field) in React + TypeScript + Tailwind by Henrique Barone — mostly pure CSS transitions with a little JS, no animation library. Prop-less demos with hard-coded labels and colours; take the technique, not the component.
type: registry
access: free
license: MIT ("MIT License — Copyright (c) 2026 Henrique Barone", github.com/henriquegpb/microkit). README credits note that some interactions are adapted from publicly shared examples and Webflow exports.
stack: [React, TypeScript, Tailwind v4, CSS transitions/keyframes]
install: npx shadcn@latest add https://microkit.co/r/<name>.json
vendorable: false
---

# MicroKit (by Henrique Barone)

**Use it for:** the *how* of small, high-craft interactions with no animation dependency — a tab underline or slab
that glides (`sliding-underline-tabs`, `sliding-content-tabs`), an icon bar that widens to its label
(`expanding-icon-tabs`), a glowing sidebar rail (`spotlight-indicator`), a zero-dep magnetic button
(`magnetic-fill-button`), width-stable icon swaps (`icon-swap-button`), a stateful pay button
(`secure-purchase-button`), a Figma-style scrub input (`scrub-number-field`), a blur-and-glide nested menu
(`blur-glide-menu`), per-letter text swaps. Catalogued as **recipes** (`integration: recipe`, `themeAware: false`).
**Don't use it for:** drop-in components — every item is a prop-less demo (hard-coded copy, `#f97316` orange
accents, `light-dark()` hex greys); most of the 49 are variations on CTA-button hovers.

## Install

```bash
# no shadcn namespace — install by URL; lands in components/microkit/<name>.tsx (named export)
npx shadcn@latest add https://microkit.co/r/sliding-underline-tabs.json
```

Then rewrite the colours to tokens (`bg-primary`, `text-foreground`, `border-border`) and lift the hard-coded content
into props. Each page (`https://microkit.co/components/<name>`) also offers CSS / JS / Tailwind variants.

## Machine access

- Registry index `https://microkit.co/r/registry.json` — 49 `registry:component` items with title, description, deps
  (`lucide-react` at most) and upstream categories (`button|navigation|input` + `hover|click|focus|drag`).
- Curated-only here (no sync adapter): the 10 strongest picks are full entries in `catalog/curated.json`.

## Gotchas

- **Attribution caveat:** the licence is MIT, but the README's Credits section says "Some interactions are adapted
  from publicly shared examples and Webflow exports" and asks for issues where attribution is unclear (e.g.
  `expanding-contact-button` says it was "adapted from the supplied Webflow export"). Hence `vendorable: false` —
  reference and install by URL; don't copy into `@oc` without re-implementing.
- **Not theme-aware:** colours are hex inside `light-dark()`, which only switches when the page sets
  `color-scheme: light dark` — a `.dark` class alone won't flip them. `sliding-underline-tabs` renders the active
  label `text-white`, invisible on a light surface.
- Reduced motion is uneven: handled in `sliding-underline-tabs`, `expanding-icon-tabs`, `secure-purchase-button`,
  `scrub-number-field`, `blur-glide-menu`, `staggered-letter-text-swap`; missing in `sliding-content-tabs`,
  `spotlight-indicator`, `magnetic-fill-button`, `icon-swap-button`.
- `focus-input` ("Focus Field") has no transition — it's an instant focus-colour change, not an animation.
- Demo state machines advance on `setTimeout` (`secure-purchase-button`) — wire them to real events.

## Best picks

`grep '★ .*microkit/' catalog/CATALOG.md`: `sliding-underline-tabs`, `sliding-content-tabs`, `expanding-icon-tabs`,
`spotlight-indicator`, `magnetic-fill-button`, `icon-swap-button`, `secure-purchase-button`, `scrub-number-field`,
`blur-glide-menu`, `staggered-letter-text-swap`.
