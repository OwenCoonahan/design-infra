---
slug: kibo-ui
name: Kibo UI
url: https://www.kibo-ui.com/
summary: 40 free MIT composable, token-based components that stock shadcn lacks — Gantt, Kanban, calendar, rich-text editor, code block, dropzone, colour picker, contribution graph, video player, QR code. Now maintained by shadcnblocks.
type: registry
access: free
license: MIT (shadcnblocks/kibo, originally Hayden Bleasel). Premium blocks are sold at shadcnblocks.com — not catalogued.
stack: [React, Tailwind v4, Radix UI, shadcn tokens]
install: npx shadcn@latest add @kibo-ui/<name>
namespace: "@kibo-ui"
vendorable: true
---

# Kibo UI

**Use it for:** complex *product* components that compose with stock shadcn and follow the theme —
project management (Gantt, Kanban, calendar, list, table), collaboration (cursors, avatar stack),
code (code block, snippet, sandbox, contribution graph), forms (dropzone, combobox, tags,
choicebox, colour picker), media (image crop/zoom, video player, stories/reel), callouts
(announcement, banner). **Don't use it for:** motion/marketing effects.

## Install

```bash
# @kibo-ui is in shadcn's built-in registry directory
npx shadcn@latest add @kibo-ui/gantt
npx kibo-ui add gantt          # Kibo's CLI just shells out to shadcn with https://www.kibo-ui.com/r/<name>.json
```

Files land in `components/kibo-ui/<name>/index.tsx` (not `components/ui/`), so they don't collide with shadcn.

## Machine access

- Registry index: `https://www.kibo-ui.com/r/registry.json` (40 `registry:ui` items + a typography style; descriptions on all)
- Docs: `https://www.kibo-ui.com/components/<name>`; no `llms.txt`.
- Synced into `catalog/generated/kibo-ui.json` by `pnpm sync kibo-ui`.

## Gotchas

- **Blocks were broken at ingest (2026-10-01):** the site lists 28 blocks (hero, pricing, roadmap,
  collaborative-canvas…) installable with `npx kibo-ui add <block>`, but `https://www.kibo-ui.com/r/<block>.json`
  returned HTTP 500 — not catalogued. The "Patterns" (1,100+) are shadcn usage examples, not installable items.
- Heavy deps on the big ones: `editor` (~18 TipTap/lowlight packages), `gantt` (dnd-kit, jotai, date-fns,
  lodash.throttle, @uidotdev/usehooks), `code-block` (shiki + react-icons), `sandbox` (Sandpack).
- `qr-code` reads `--foreground`/`--background` but only parses `oklch()` values — with our hex-based
  DESIGN.md themes it silently falls back to near-black/white; pass `foreground`/`background` props.
- `status` and `code-block` use semantic literal colours (emerald/amber/rose/blue) for state/diff — intended.
- No AI components here: `npx kibo-ui add ai` installs Vercel's AI Elements (registry.ai-sdk.dev), which the site recommends.

## Best picks

See ★ entries: `grep '★ .*kibo-ui/' catalog/CATALOG.md`. Short list:
`gantt`, `kanban`, `dropzone`, `color-picker`, `code-block`, `contribution-graph`, `editor`, `tags`,
`announcement`, `snippet`, `video-player`, `qr-code`.
