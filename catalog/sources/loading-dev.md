---
slug: loading-dev
name: loading.dev
url: https://loading.dev/
summary: Jakub Krehel's lightweight React spinner library — 29 small, monochrome loading indicators in one MIT npm package, pure CSS keyframes, currentColor, reduced motion built in.
type: npm
access: free
license: MIT — Copyright (c) 2026 Jakub Krehel
stack: [React 19+, CSS keyframes, SVG]
install: pnpm add loading-dev
llms: https://loading.dev/llms.txt
vendorable: true
---

# loading.dev (by Jakub Krehel)

**Use it for:** short, local, indeterminate waits — a spinner inside a button, next to a row that's saving, after
"Syncing…" text. Every indicator is a single import with the same small API, inherits `currentColor`, and stops
animating under `prefers-reduced-motion`. It is the quiet end of the loader spectrum; reach for skeletons or
agent-status indicators for page loads and AI work (see `catalog/playbooks/loader.md`).

```bash
pnpm add loading-dev
```

```tsx
import { Arc } from "loading-dev"

<button disabled aria-busy="true">
  <Arc size={16} /> Saving
</button>
```

Every spinner takes `size` (px, default 20), `color` (default `currentColor`), `duration` (ms), `playState`
(`"running"` / `"paused"`) and `className`. Some add `easing` (`linear`, `ease-in-out`, `stacked`), `cap`
(`round` / `flat`) or spinner-specific props. `SPINNERS` and `SPINNER_MOTION` are exported for pickers.

## Picks

| entry | why |
| --- | --- |
| `loading-dev/arc` | Best default for buttons and rows; `easing="stacked"` for a little life |
| `loading-dev/classic` | Familiar twelve-bar system spinner; calm panel/page waits (≥14px) |
| `loading-dev/linear-dots` | Quietest; sits after text or in a chat bubble |
| `loading-dev/trace` | Rounded-square trace for icon buttons, upload tiles, dev-tool UIs |

All 29 are in the catalog as `loading-dev/<slug>` (`pnpm lookup "spinner" --source loading-dev`). The four picks have
hosted demos at `/preview/loading-dev/<slug>` that use the installed package.

## Agent-readable docs

- `https://loading.dev/llms.txt` — the spinner list with one-line descriptions and import names (what `pnpm sync loading-dev` reads).
- `https://loading.dev/spinners/<slug>/markdown` — per-spinner props and examples.
- `https://loading.dev/.well-known/agent-skills/index.json` — an optional `loading-dev` agent skill.
- Source: https://github.com/jakubkrehel/loading (`src/<slug>.tsx`; the sync reads these to tag SVG vs DOM rendering).

## Verified (2026-10-28, v0.3.6)

- MIT `LICENSE.md` in the package and repo; peer deps `react` / `react-dom` `>=19.0.0`.
- Animation is CSS keyframes only (no `requestAnimationFrame`, no JS timers); 13 spinners draw SVG, the rest styled DOM.
- Every spinner renders the shared `SpinnerStyle`, which adds `@media (prefers-reduced-motion: reduce) { animation: none }`.
  In Chrome, a page of all 29 had 103 running animations, and none once reduced motion was emulated.

## Gotchas

- **React 19+ only.** Styles are emitted as hoisted `<style href precedence>` elements, a React 19 feature.
- **Spinners render `aria-hidden`.** Supply the accessible state yourself: `role="status"` + a label, or a button with
  visible text and `aria-busy`. Under reduced motion the glyph is static, so never rely on it alone.
- Colour comes from `currentColor`; inside `bg-primary` buttons it follows `text-primary-foreground` automatically.
- Debounce short waits (~200ms) before showing any spinner (see the loader playbook).
