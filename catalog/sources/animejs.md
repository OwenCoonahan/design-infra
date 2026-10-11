---
slug: animejs
name: anime.js
url: https://animejs.com/
summary: Framework-agnostic JavaScript animation engine by Julian Garnier (v4) — timelines, staggers, SVG morph / line drawing / motion paths, draggables, scroll observers, text splitting and layout animations. Vanilla JS; no React components.
type: npm
access: free
license: "MIT — \"The MIT License / Copyright (c) 2025 Julian Garnier\" (github.com/juliangarnier/anime LICENSE.md)"
stack: [JavaScript, TypeScript types, ES modules, WAAPI]
install: pnpm add animejs
vendorable: true
---

# anime.js v4

**Use it for:** choreography — long multi-element timelines, staggered grids, SVG line drawing and shape morphing,
motion paths, draggable physics, text splitting. One catalog entry: `animejs/animejs` (`integration: recipe`).
**Don't use it for:** React presence/layout/gesture work (exit animations, `layoutId`, `whileHover`) — Motion is the
default there (`catalog/sources/motion.md` → "When to prefer anime.js").

## Install & use in React

```bash
pnpm add animejs
```

```tsx
import { animate, createScope, stagger } from "animejs"

useEffect(() => {
  const scope = createScope({ root }).add(() => {
    animate(".tile", { y: [16, 0], opacity: [0, 1], delay: stagger(40, { grid: [6, 4], from: "center" }) })
  })
  return () => scope.revert() // undo everything on unmount
}, [])
```

v4 API (named ES-module imports, v3's `anime()` is gone): `animate`, `createTimeline`, `stagger`, `createTimer`,
`createAnimatable`, `createDraggable`, `onScroll`, `createScope`, `createLayout`, `splitText`, and from `svg`:
`morphTo`, `createDrawable`, `createMotionPath`. Also a `waapi` build and a Three.js adapter.

## Gotchas

- Imperative: keep React state out of the animation loop; target refs/selectors inside `createScope({ root })` and
  `revert()` on unmount, or animations outlive their components.
- Reduced motion is your job — check `matchMedia("(prefers-reduced-motion: reduce)")` before starting timelines.
- v3 → v4 is a breaking migration (wiki "Migrating from v3 to v4"); most snippets online are v3.
- Tree-shake with subpath imports (`animejs/animation`, `animejs/timeline`, `animejs/svg`…).

Docs: https://animejs.com/documentation/
