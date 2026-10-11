---
slug: aceternity
name: Aceternity UI
url: https://ui.aceternity.com/
summary: 112 free animated React components + ~180 free blocks for landing pages (Tailwind v4 + motion). The default source for "make this marketing page look expensive".
type: registry
access: free
license: Free for unlimited personal & commercial projects; no redistributing as a competing library. Pro/All-Access is a one-time purchase.
stack: [React, Next.js, Tailwind v4, motion]
install: npx shadcn@latest add @aceternity/<name>
namespace: "@aceternity"
llms: https://ui.aceternity.com/llms-full.txt
vendorable: false
---

# Aceternity UI

**Use it for:** heroes, animated backgrounds, scroll effects, testimonials/logo marquees, flashy
cards, full landing-page blocks. **Don't use it for:** app chrome, forms, dialogs, data UI — use
shadcn primitives there.

## Install

```bash
# components.json → "registries": { "@aceternity": "https://ui.aceternity.com/registry/{name}.json" }
npx shadcn@latest add @aceternity/spotlight-new
npx shadcn@latest search @aceternity -q "pricing"     # search from the CLI
```

Direct URL works without the namespace: `npx shadcn@latest add https://ui.aceternity.com/registry/<name>.json`.

## Machine access

- Registry index: `https://ui.aceternity.com/registry/registry.json` (components + blocks)
- JSON API with descriptions, categories, preview images: `https://ui.aceternity.com/api/components`
- `llms.txt` / `llms-full.txt`
- Synced into `catalog/generated/aceternity.json` by `pnpm sync aceternity`.

## Gotchas

- **Not theme-aware.** Most components hard-code `neutral-*`, `white/black`, or blue `hsla()`
  gradients instead of shadcn tokens. After installing, swap `bg-white dark:bg-black` →
  `bg-card`, `text-neutral-600` → `text-muted-foreground`, etc., or use the `@oc/*` wrapper if one exists.
- Imports `motion/react` (motion v11+). A few blocks still import `framer-motion` — install both if a build fails.
- Many need `@tabler/icons-react`; the CLI installs it, but prefer swapping to `lucide-react` if
  the project already standardises on Lucide.
- Blocks are named `<thing>-demo-N` or descriptive slugs; browse them at
  https://ui.aceternity.com/blocks — there's no per-block docs page.
- Heavy effects (globe, macbook-scroll, canvas-reveal, shaders) — one per page; lazy-load below the fold.

## Best picks

See ★ entries: `grep '★ aceternity/' catalog/CATALOG.md`. Short list:
`spotlight-new`, `background-beams`, `aurora-background`, `resizable-navbar`, `text-generate-effect`,
`infinite-moving-cards`, `sticky-scroll-reveal`, `container-scroll-animation`, `placeholders-and-vanish-input`,
`glowing-effect`, blocks `hero-section-with-beams-and-grid`, `hero-with-chat-input`, `logo-cloud-marquee`.
