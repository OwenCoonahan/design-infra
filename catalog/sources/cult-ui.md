---
slug: cult-ui
name: Cult UI
url: https://www.cult-ui.com/
summary: 154 free MIT shadcn-compatible animated components — Dynamic Island, direction-aware tabs, textured/neumorphic buttons, 'halo' form controls (Base UI), shader heroes, device mockups and Vercel-style illustrations. motion-based.
type: registry
access: free
license: MIT (nolly-studio/cult-ui). Pro blocks/templates at pro.cult-ui.com are paid — not catalogued.
stack: [React, Next.js, Tailwind v4, motion, Base UI (halo-*), "@paper-design/shaders-react"]
install: npx shadcn@latest add @cult-ui/<name>
namespace: "@cult-ui"
llms: https://www.cult-ui.com/llms.txt
vendorable: true
---

# Cult UI (by Nolly Studio)

**Use it for:** distinctive, tactile details — a Dynamic Island status widget, direction-aware tabs,
textured/metal/neumorphic buttons, morphing popover forms, expandable cards, onboarding flows,
shader hero backdrops (dithering, liquid metal, heatmap), Apple device mockups and infra-style
illustrations (gateway/circuit/globe). Good for dev-tool and AI product marketing.
**Don't use it for:** a consistent app component set — styles vary a lot between generations of components.

## Install

```bash
# @cult-ui is in shadcn's built-in registry directory
npx shadcn@latest add @cult-ui/dynamic-island
npx shadcn@latest add https://www.cult-ui.com/r/<name>.json   # without the namespace
```

## Machine access

- Registry index: `https://www.cult-ui.com/r/registry.json` (154 `registry:ui` + 153 `*-demo` items; descriptions on all ui items)
- Docs: `https://www.cult-ui.com/docs/components/<name>` (append `.md` for markdown); `llms.txt` + `llms-full.txt`
- Synced into `catalog/generated/cult-ui.json` by `pnpm sync cult-ui` (demos skipped).

## Gotchas

- **Theme-awareness varies by era.** Older components (`dynamic-island`, `direction-aware-tabs`, `texture-button`,
  `family-button`, `side-panel`, `floating-panel`, `minimal-card`, `code-block`) hard-code neutral/zinc/black.
  Newer ones (`onboarding`, `intro-disclosure`, `mock-browser-window`, `hero-*`, `halo-*`, `prompt-composer`)
  use tokens for surfaces/text but often keep a hard-coded accent palette (Vercel-style rainbow glows, teal/blue hex).
- `halo-*` / `animated-*` controls are built on **`@base-ui/react`**, not Radix — a second primitive library in a Radix-based shadcn app.
- Shader items depend on `@paper-design/shaders-react` (WebGL) — lazy-load, one per page.
- Some items import `next/image` (`feature-carousel`, `kanban-board`) — Next.js only; a few pull `geist` fonts or `@hugeicons/*`.
- Imports `motion/react` (motion v12) throughout.
- The "Blocks"/"AI components" nav links go to aisdkagents.com and pro.cult-ui.com — separate products, not part of this registry.

## Best picks

See ★ entries: `grep '★ .*cult-ui/' catalog/CATALOG.md`. Short list:
`onboarding`, `intro-disclosure`, `rolling-number`, `halo-tabs`, `halo-input`, `prompt-composer`, `dynamic-island`,
`direction-aware-tabs`, `popover-form`, `expandable`, `hero-dithering`, `mock-browser-window`, `texture-button`.
