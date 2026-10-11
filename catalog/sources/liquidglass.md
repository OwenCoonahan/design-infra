---
slug: liquidglass
name: Liquid Glass (@samasante/liquid-glass)
url: https://glass.samasante.com/
summary: Headless React lens that refracts what's behind it — Apple-style Liquid Glass (frost, tint, rim light, dispersion, edge bend) as one <Glass> wrapper. Zero runtime deps, React >=18 peer.
type: npm
access: free
license: MIT (npm @samasante/liquid-glass, github.com/samasante/liquid-glass).
stack: [React 18+, SVG filters (feDisplacementMap), backdrop-filter, WebGL (media mode)]
install: pnpm add @samasante/liquid-glass
vendorable: true
---

# Liquid Glass (by Sam Asante)

**Use it for:** one premium glass surface — a floating nav pill, a notification over a photo, video-player controls,
a hero loupe. `<Glass>` wraps any styled box: your translucent background is the tint, `children` stay crisp, optics
(`strength`, `depth`, `dispersion`, `bend`, `frost`, `sheen…`) via the `optics` prop. Catalog entry:
`liquidglass/liquid-glass` (wrapper; premium, futuristic). **Don't use it for:** whole layouts of glass cards, or text-heavy
UI over busy backgrounds (contrast).

## Install

```bash
pnpm add @samasante/liquid-glass     # react + react-dom are peer deps; no provider, no CSS import
```

```tsx
import { Glass } from "@samasante/liquid-glass"

<Glass className="rounded-2xl bg-background/40 px-5 py-3">Save</Glass>
```

## Gotchas

- **Browser split:** bending the *live* page uses `backdrop-filter: url()`, which ships in **Chrome / Edge only**.
  **Safari and Firefox** still frost + tint + edge-light the wrapped `<Glass>` (it reads as glass) but can't bend
  the live page. To refract in every browser, give it geometry (`size` + `center`) so it bends its own children, or
  hand it a copy: `refract={<img …/>}` (+ `behind` for the bleed edge), or `src` / `draw` for video and canvas (WebGL).
- `filterResolution` is a Chromium-only supersample (forced to 1 in Safari); `live` re-rasterises every frame for
  animated refracted content (Safari) — expensive.
- v0.1.x — pin the version. Headless: it doesn't read shadcn variables, so tint it with yours (`bg-background/40`,
  `bg-primary/30`).
- Keep it to one or two lenses per screen; SVG displacement over live DOM costs GPU time.

Docs + demos: https://glass.samasante.com · README support matrix: `BROWSERS.md` in the repo.
