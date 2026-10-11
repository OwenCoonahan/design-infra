---
slug: smoothui
name: SmoothUI
url: https://smoothui.dev/
summary: ~200 free MIT motion components + 34 blocks (React, Tailwind, motion/react) by Eduardo Calvo — the strongest free set of AI/agent components (approval, tool call, task list, reasoning, context meter), plus tabs, navbars, carousels, transitions and text effects. Mostly shadcn tokens; most items honour reduced motion.
type: registry
access: free
license: MIT ("MIT License — Copyright (c) 2024 Eduardo Calvo", github.com/educlopez/smoothui).
stack: [React, Next.js, Tailwind v4, motion/react, shadcn]
install: npx shadcn@latest add @smoothui/<name>
namespace: "@smoothui"
llms: https://smoothui.dev/llms.txt
vendorable: true
---

# SmoothUI (by Eduardo Calvo)

**Use it for:** AI products first — `ai-approval`, `ai-tool-call`, `ai-task-list`, `ai-reasoning`, `ai-loader`,
`ai-context-meter`, `ai-prompt-input` are theme-token components with considered motion (the shimmer only runs while
streaming, decisions collapse the alternatives, status rings draw a check). Also the gaps other free sources leave:
a size-matching `skeleton-loader`, `animated-tabs` (underline/pill/segment), a shrink/hide-on-scroll
`floating-navbar`, `coverflow-carousel`, `card-swipe-deck`, a four-variant `scroll-progress`, `button-copy`.
**Don't use it for:** stock app primitives (its `dialog`, `select`, `combobox`, `pagination` duplicate shadcn/Origin UI)
or brand-new visual identity — the creative effects (shaders, dither, ASCII) are fine but OriginKit/React Bits go further.

## Install

```bash
# @smoothui is in shadcn's built-in registry directory — resolves with no components.json entry
# (the CLI adds "@smoothui": "https://smoothui.dev/r/{name}.json" itself on first install)
npx shadcn@latest add @smoothui/ai-approval @smoothui/animated-tabs
```

Items land in `components/smoothui/<name>/index.tsx` (default export), so they never clash with same-named files from
other registries. Direct URLs also work: `npx shadcn@latest add https://smoothui.dev/r/<name>.json`.

## Machine access

- `https://smoothui.dev/llms-components.json` — every component + block with category, tags, `animationType`
  (spring/tween/gesture/scroll/none), `complexity`, `hasReducedMotion`, dependencies, install command and docs URL.
  `pnpm sync smoothui` reads it → `catalog/generated/smoothui.json` (198 components + 34 blocks).
- Registry index `https://smoothui.dev/r/registry.json` (201 `registry:ui` + 35 blocks + 6 themes, `tokens`, `lib`,
  `shared`, `data`, a `skill` item); per item `https://smoothui.dev/r/<name>.json`. The index also has `ai-core`
  (shared AI state + motion presets), `cli`, the deprecated `ai-input` alias and a `chat-template` block — not in
  llms-components.json, so not catalogued.
- `pnpm scan-motion --only smoothui` reads every item's source for code-level motion signals.
- `llms.txt` with one line per item; docs at `https://smoothui.dev/docs/components/<name>` (blocks: one page per
  group, e.g. `/docs/blocks/cta`).

## Gotchas

- **`tokens.json` and `--brand`.** 66 items pull `https://smoothui.dev/r/tokens.json` (a `registry:theme`), which adds
  `--color-brand` (defaults to **pink**, `oklch(0.72 0.2 352.53)`), a `smooth-50…1000` grey ramp and blue/green/amber
  button families. 48 items use `bg-brand`/`text-brand`/`border-brand` (tab underlines, focus rings, stat values,
  scroll-progress). Add `--brand: var(--primary);` to `:root` in `globals.css` once and they follow the theme.
- **Custom `smooth-N` palette:** 5 items style with the `smooth-*` ramp instead of shadcn tokens — `header-1`,
  `inline-testimonials`, `job-listing-component`, `pixel-flow-field`, `smooth-button` (and anything that installs
  `smooth-button`, e.g. `coverflow-carousel`'s prev/next buttons). Neutral greys, so mostly harmless; check them under
  coloured themes.
- **Hard-coded hex:** 25 items contain hex colours (not counting #fff/#000); 10 have three or more — `liquid-metal`
  (38), `theme-toggle` (15), `pixel-brush-canvas` (10), `ransom-note`, `wallet-card` (7), `grid-loader`,
  `job-listing-component` (5), `header-1` (4), `mac-terminal`, `unlock-face-id` (3). `basic-toast`, `dynamic-island`,
  `stats-2` and `pricing-1` use raw Tailwind palette classes (`bg-emerald-50`, `bg-black`…) instead.
  AI status accents (`ai-tool-call`, `ai-task-list`, `ai-context-meter`) are fixed oklch green/amber/red.
- **Reduced motion:** the `hasReducedMotion` flag is accurate when true (132 items) but under-reports — the code
  handles it in ~213 of 232 items (e.g. `coverflow-carousel`, `dock`, `border-beam` are flagged false but use
  `useReducedMotion`). The catalog takes both: the flag (as a `reduced-motion` tag) and the scan.
  `skeleton-loader` really doesn't (Tailwind `animate-pulse`) — add `motion-reduce:animate-none`.
- **Relative imports:** AI items import `../ai-core`; keep `components/smoothui/*` together.
  `apple-invites` lists `@smoothui/data` as an npm dependency, but no such npm package exists (404) — it's the
  registry `data` item; expect the npm step to fail and add it with `npx shadcn@latest add @smoothui/data`.
- `floating-navbar` is `absolute`-positioned (pass `className="fixed"`); several blocks import
  `@/components/smoothui/shared` (auto-installed).
- **Name collisions (29)** with other sources — ids stay unique (`smoothui/…`), but pick deliberately:

  | name | also in | prefer |
  |---|---|---|
  | `dock` | magicui, motion-primitives, cult-ui, react-bits | magicui / motion-primitives (navigation playbook) |
  | `border-beam` | magicui, librariesdev | `oc/beam-card` (librariesdev, theme-tinted) |
  | `progressive-blur` | magicui, motion-primitives | motion-primitives |
  | `scroll-progress` | magicui, motion-primitives | **smoothui** for ring/number/segmented variants; magicui for a plain bar |
  | `code-block` | kibo-ui, cult-ui, aceternity, beautifui | kibo-ui (shiki, theme-aware) |
  | `animated-tabs` | cult-ui | **smoothui** (keyboard, three variants) |
  | `floating-navbar` | aceternity | **smoothui** (theme tokens, reduced motion) |
  | `animated-list` | magicui, react-bits | magicui |
  | `infinite-slider`, `text-morph`, `dialog` | motion-primitives | motion-primitives (`dialog`: stock shadcn first) |
  | `dynamic-island` | cult-ui, aceternity | cult-ui (SmoothUI's hard-codes black/white) |
  | `file-tree`, `tweet-card` | magicui | magicui |
  | `combobox`, `contribution-graph` | kibo-ui | kibo-ui |
  | `magnetic-button`, `animated-tooltip` | aceternity | smoothui for theme tokens; aceternity for its look |
  | `animated-input`, `dither-image`, `morph-surface` | cult-ui | compare live |
  | `orb` | react-bits | compare live |
  | `liquid-metal`, `cursor-image-trail` | originkit (metered) | smoothui is free — compare live |
  | `notification-badge` | transitions (recipe) | transitions for a CSS-only badge |
  | `context-menu`, `cursor-follow`, `scroll-image-reveal`, `tilt-card` | motion (examples) | different things — Motion's are recipes |

## Best picks

See ★ entries: `grep '★ .*smoothui/' catalog/CATALOG.md`. Short list: `ai-approval`, `ai-tool-call`, `ai-task-list`,
`ai-reasoning`, `ai-loader`, `ai-prompt-input`, `ai-context-meter`, `skeleton-loader`, `animated-tabs`,
`floating-navbar`, `coverflow-carousel`, `card-swipe-deck`, `scroll-progress`, `button-copy`.
