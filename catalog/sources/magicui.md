---
slug: magicui
name: Magic UI
url: https://magicui.design/
summary: 78 free MIT animated components and effects (marquee, beams, number ticker, text animations, patterns, device mockups) built as a companion to shadcn/ui. Tailwind v4 + motion.
type: registry
access: free
license: MIT (magicuidesign/magicui). Magic UI Pro templates are a separate paid product — not catalogued.
stack: [React, Next.js, Tailwind v4, motion]
install: npx shadcn@latest add @magicui/<name>
namespace: "@magicui"
mcp: npx -y @magicuidesign/mcp@latest
llms: https://magicui.design/llms.txt
vendorable: true
---

# Magic UI

**Use it for:** landing-page polish that sits *inside* a shadcn app — logo/testimonial marquees,
"integrations" beam diagrams, stats tickers, text entrances, subtle dot/grid backgrounds, border
beams on a featured card, device mockups (Safari/iPhone/Android). Smaller and calmer than
Aceternity, and more of it is colourless. **Don't use it for:** app chrome/forms (stock shadcn,
Origin UI) or full page sections (it has no blocks — the section templates are Magic UI Pro, paid).

## Install

```bash
# @magicui is in shadcn's built-in registry directory — no components.json entry needed
npx shadcn@latest add @magicui/marquee @magicui/blur-fade
npx shadcn@latest search @magicui -q "text"
```

Direct URL also works: `npx shadcn@latest add https://magicui.design/r/<name>.json`.

## Machine access

- Registry index: `https://magicui.design/r/registry.json` (78 `registry:ui` items + ~170 `registry:example` demos, with titles + descriptions)
- `llms.txt` with per-component docs links; docs at `https://magicui.design/docs/components/<name>`
- Official MCP server: `npx -y @magicuidesign/mcp@latest`
- Synced into `catalog/generated/magicui.json` by `pnpm sync magicui` (examples skipped).

## Gotchas

- **Mixed theme-awareness.** Layout/motion pieces (`marquee`, `animated-list`, `blur-fade`, `text-animate`)
  are colourless and inherit the theme. Effects ship **hex default props** — `animated-beam` /
  `border-beam` orange→purple, `magic-card` purple/pink, `globe` RGB arrays — pass
  `var(--primary)`-derived colours. `bento-grid`, `shimmer-button`, `number-ticker`, `dot-pattern`
  hard-code `neutral-*` / `black` / `white` classes; override via `className`.
- Imports `motion/react` (motion v12). A few items import `motion/react` but list no dependencies
  in the registry (`terminal`, `dot-pattern`) — install `motion` if the build fails.
- `magic-card` depends on `next-themes`; `bento-grid` on `@radix-ui/react-icons`; `globe` on `cobe`;
  `tweet-card` on `react-tweet`.
- Several effects add keyframes to your CSS (registry `css` field) — check `globals.css` after installing.
- Canvas/WebGL pieces (`globe`, `particles`, `flickering-grid`, `icon-cloud`): one per page, lazy-load below the fold.

## Best picks

See ★ entries: `grep '★ .*magicui/' catalog/CATALOG.md`. Short list:
`marquee`, `animated-list`, `blur-fade`, `text-animate`, `number-ticker`, `animated-beam`, `border-beam`,
`magic-card`, `interactive-hover-button`, `terminal`, `dot-pattern`, `globe`, `animated-theme-toggler`.
