---
slug: motion
name: Motion (motion.dev)
url: https://motion.dev/
summary: The animation engine under most of this catalog (formerly Framer Motion) — free MIT library for React/JS/Vue, plus ~460 examples with public preview videos (source free for a minority, Motion+ for the rest) and a free agent skill + docs MCP.
type: npm
access: free
license: motion / motion/react / motion-v are MIT. Motion+ (premium components, example source, AI Kit pro tools) is paid — one-time Personal licence or per-seat Business.
stack: [React, JavaScript, Vue]
install: pnpm add motion
mcp: https://mcp.motion.dev (free docs search) — install with `npx motion-ai`
llms: https://motion.dev/llms.txt
vendorable: false
---

# Motion (by Matt Perry — also the author of Popmotion and Framer Motion)

**What it is for us:** the *technique layer*. Most animated entries in the catalog (Aceternity, Magic UI, Motion
Primitives, Cult UI, our own `@oc` blocks — ~500 entries tagged `technique: motion`) are built on it. When no
drop-in component fits, agents hand-roll the animation with free Motion primitives on the user's own component.

## Use it for

- **Recipes on your own markup** (`integration: recipe`, the 56 free examples): `layoutId` sliding indicators,
  `layout` resize/reflow, `AnimatePresence` exits, `whileInView` reveals, `useScroll` progress/parallax, `Reorder`
  drag-to-reorder, `pathLength` line drawing, springs for press/hover.
- **Visual vocabulary:** all ~200 React examples are in the catalog with poster + **preview video** (`video` field), so
  agents and the gallery can show *how something moves* — even Motion+ ones (`access: paid`, reference only:
  recreate the pattern with free primitives if Owen likes it, per AGENTS.md).
- **Consistency:** `@oc/motion-presets` turns our motion languages (`design-systems/MOTION.md`) into Motion
  transitions/variants, and every `@oc/theme-*` ships `--motion-fast/base/slow` + `ease-motion-*` CSS tokens.

## Install

```bash
pnpm add motion                        # import { motion, AnimatePresence } from "motion/react"
npx shadcn@latest add @oc/motion-presets   # lib/motion-presets.ts — set PROJECT_MOTION to DESIGN.md `motion:`
npx motion-ai                          # optional: /motion agent skill + free docs MCP (mcp.motion.dev)
```

The Motion AI Kit complements design-infra: **design-infra decides *what* to do** (options, playbooks, taste,
motion language); **the /motion skill knows *how* to implement it well** (best practices, perf, a11y).

## Machine access

- `https://motion.dev/llms.txt` (docs index, marks Motion+ pages), MCP `https://mcp.motion.dev` (free docs search).
- `pnpm sync motion` scrapes `/examples` (React cards: title, poster, preview.mp4) and probes each page for
  gating + "Built with" APIs → `catalog/generated/motion.json`.

## Gotchas

- **Motion+ is not free:** `Ticker`, `Cursor`, `Carousel`, `AnimateNumber`, `Typewriter`, `ScrambleText`, `splitText`,
  `useCurtains`/`curtains`, `AnimateActivity` and most example *source* need Motion+. Free alternatives: Magic UI marquee
  (Ticker), `@oc`/Motion Primitives number components (AnimateNumber), `motion/follow-pointer-with-spring` (Cursor),
  `motion-primitives/text-effect` (splitText).
- Import from `motion/react` (not `framer-motion`) for new code; old `framer-motion` imports still work but mixing both
  ships two copies.
- Wrap apps in `<MotionConfig reducedMotion="user">` so every Motion animation respects reduced motion.
- `LazyMotion` + `m` components cut the bundle to ~5kb when only a few animations are used.

## When to prefer anime.js

[anime.js](https://animejs.com) v4 (MIT, `pnpm add animejs`, catalog `animejs/animejs`, notes in
`catalog/sources/animejs.md`) is vanilla JS with no React components — Motion stays the default for React UI state
(presence, `layout`/`layoutId`, gestures). Reach for anime.js when **choreography** is the point:

- long multi-element **timelines** (`createTimeline`) with labels and offsets, and grid **staggers** from center/edges;
- **SVG**: shape morphing (`morphTo`), line drawing (`createDrawable`), motion paths (`createMotionPath`);
- **draggables** with momentum and snapping (`createDraggable`), scroll observers (`onScroll`);
- **text splitting** (`splitText`) — free in anime.js, Motion+ in Motion.

In React run it inside `createScope({ root })` in a `useEffect` and `revert()` on unmount.

## Popmotion (legacy)

[Popmotion](https://github.com/Popmotion/popmotion) is Motion's low-level predecessor (same author). Last release
2022, no longer developed — its ideas (springs, keyframes, `animate()`) live on in Motion. **Don't use it in new
code**; use `animate()` from `motion`. Not catalogued.
