---
slug: originkit
name: OriginKit
url: https://www.originkit.dev/
summary: ~1,100 animated marketing components & 58 page sections — WebGL/canvas backgrounds, heroes, cursors, text effects, loaders. Copy-paste, CLI, Framer, or MCP.
type: cli
access: metered
license: Proprietary. Use in your own (commercial) projects; no redistribution. Free account = 10 copies/day; Pro $79/yr, Ultimate $99/yr.
stack: [React, Next.js, Tailwind (v3-style config), Three.js, WebGL]
install: npx originkit add <name>
mcp: https://mcp.originkit.dev/mcp
vendorable: false
---

# OriginKit

**Use it for:** the wow-factor background or hero when Aceternity's look is too familiar —
shader backgrounds (190+), ASCII/dither effects, custom cursors, text reveals.

## Install

```bash
npx originkit login
npx originkit add hero-spotlight            # → ui/hero-spotlight.tsx
npx originkit add hero-spotlight --dark     # preset variant
npx originkit add <name> --path components/effects --dry-run
```

## Machine access

No public registry JSON or llms.txt. The homepage embeds the catalogue, which `pnpm sync originkit`
scrapes into `catalog/generated/originkit.json` (names, categories, poster images, paid flag).
Items flagged `paid` need Pro; the rest are `metered` (free account, daily copy limit).

## Gotchas

- Docs reference `tailwind.config.js` — check classes still work under Tailwind v4.
- Many items are WebGL/Three.js: client-only, lazy-load, mind mobile GPU cost.
- **Never vendor into this repo** — licence forbids redistribution.
