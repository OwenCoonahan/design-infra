---
slug: anatomy
name: Anatomy
url: https://skills.wheresryan.sh/anatomy
summary: Interactive isometric explainers by Ryan; an optional Claude Code/Codex skill and the MIT anatomy-figures package, with 33 primary figures for algorithms, UI behavior and real machines.
type: skill
access: free
license: MIT — Copyright (c) 2026 Ryan; skill and anatomy-figures have separate MIT repositories.
stack: [React 18+, TypeScript, SVG, optional WebGL, Custom Elements, Node 20.10+]
install: npx skills add wheresryan22/anatomy --skill anatomy -a claude-code codex -y
vendorable: true
---

# Anatomy

**Use it for:** technical illustrations in documentation, educational articles, product explanations and feature sections. Search the existing figures before commissioning a custom one: queues, caches, hash tables, debounce/throttle, encryption, CSS layout and mechanical systems already have reusable examples.

**Avoid it for:** ordinary application controls, generic decoration, or a diagram that needs only a few boxes and arrows. Dense mechanisms and WebGL effects can require substantial rendering and review. It is a separate illustration language; choose it deliberately for the section.

## Reuse an existing figure

```bash
pnpm add anatomy-figures
```

```tsx
"use client"
import HashMap from "anatomy-figures/hash-map"

export function CacheExplainer() {
  return <HashMap theme="light" />
}
```

Import a single figure from its subpath to avoid pulling in the rest. The named root exports also exist. For plain HTML, import `define` from `anatomy-figures/element/hash-map`, call `define()`, then render `<anatomy-hash-map theme="light"></anatomy-hash-map>`.

The five built-in themes are dark, light, paper, blueprint and sepia. Map the package's `--anatomy-*` variables to project tokens; these are **not** shadcn variables. A custom theme accepts a base plus token overrides, or an `AnatomyTheme` provider can theme a tree. Preserve the project's typography and surrounding layout.

## Optional agent skill

```bash
DISABLE_TELEMETRY=1 npx -y skills@latest add wheresryan22/anatomy --skill anatomy -a claude-code codex -y
```

The upstream skill declares Claude Code, Codex and OpenCode compatibility. The installation above was checked in a scratch directory for Claude Code and Codex; this does not certify every generated figure. It needs Node 20.10+ and Chrome/Chromium for its inspection tools. Example request: `/anatomy explain how our request queue works, interactive, as React components for our docs`.

This is toolchain tier 3, available when selected; connecting design-infra alone does not install it. Reuse an existing catalog figure whenever it fits. Custom generated models still need factual, visual, keyboard and mobile verification.

## Machine access and provenance

- [Skill repository](https://github.com/wheresryan22/anatomy), including SKILL.md and its MIT licence.
- [Figure package repository](https://github.com/wheresryan22/anatomy-figures): README's primary figure list and package.json exports.
- Published package metadata: `https://registry.npmjs.org/anatomy-figures/latest` (audited version 0.1.0).
- [Live collection](https://skills.wheresryan.sh/anatomy/collection), individual pages at `/anatomy/collection/<slug>`.
- `pnpm sync anatomy` validates each primary figure against the published package exports and collection links; `pnpm catalog` rebuilds search data.
- No verified shadcn registry, MCP, public JSON collection API or llms.txt. The root robots.txt returned 404 during this audit; keep collection access limited to the linked public examples.

## Gotchas

- React 18+ and React DOM are peer dependencies. Use a client boundary for React/Next.js figures and ESM subpath imports; the package has no CommonJS export.
- Isometric SVG is not necessarily rotatable 3D. The Seasons example is true 3D; WebGL-heavy figures need separate device testing.
- Upstream documents pointer/keyboard input, reduced motion and offscreen cleanup. Verify these on the exact figure and your integration rather than assuming one benchmark covers the collection.
- The repository also lists 19 early glass/WebGL examples with limited palette customization. They are not in our primary catalog: the 33 main figures have the current collection links and token-based theming.
- Gallery thumbnails are **still screenshots** of the MIT figures. Actual interaction is on the source site; the catalog does not automatically embed its documentation pages.
- No upstream source or skill is copied into our registry. Figure screenshot attribution and the original MIT notice are in NOTICE.md and third-party/anatomy-LICENSE.txt.

## Starting points

`anatomy/hash-map`, `anatomy/lru-cache`, `anatomy/message-queue`, `anatomy/debounce`, `anatomy/rate-limiter`, `anatomy/box-model` and `anatomy/watch`. Choose the concept that needs explaining; a convincing mechanism matters more than ornament.

Added from the user-shared https://t.co/3c9pJq05FV on 2026-10-12. No personal favorite or specific style preference was supplied.
