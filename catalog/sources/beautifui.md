---
slug: beautifui
name: Beautiful UI
url: https://www.beautifului.dev/
summary: 26 MIT components for AI-native interfaces — thinking traces, chat composer, approval cards, tool chips, diff/records tables, flowcharts.
type: registry
access: free
license: MIT
stack: [React, Tailwind v4, CSS keyframes]
install: npx shadcn@latest add @beautifui/<name>
namespace: "@beautifui"
vendorable: true
---

# Beautiful UI (by Shane Levine)

**Use it for:** agent/AI product surfaces — showing reasoning, tool calls, approvals, diffs,
task progress, a chat composer. Quietly polished, Linear-ish, low motion.

## Install

```bash
# components.json → "registries": { "@beautifui": "https://www.beautifului.dev/r/{name}.json" }
npx shadcn@latest add @beautifui/thinking-state
```

Every item depends on `foundation` (a `registry:style`) which writes `app/beautifui/foundation.css`.
Add `@import "./beautifui/foundation.css";` to `app/globals.css` afterwards. Files land in
`components/primitives/*` and `components/atoms/*`.

## Gotchas

- **Token collision:** `foundation.css` defines its own `:root`/`.dark` tokens and **redefines
  `--accent`** (and `@import "tailwindcss"` again). In a shadcn project that changes shadcn's
  accent colour everywhere. Options: (a) import foundation.css *before* your theme so your
  `--accent` wins, then check BUI components still look right; (b) rename BUI's `--accent*`
  vars to `--bui-accent*` in foundation.css + its components (MIT, so this is fine).
- Pulls `shadow-plugin` (layered shadows) — the CLI installs it.
- No motion library; animations are CSS keyframes, so they're cheap.

## Best picks

`thinking-state`, `chat-composer`, `approval-card`, `tool-chips`, `diff-table`, `prompt-bar`,
`streaming-text`, `task-rows`, `flowchart`. Pair with `librariesdev/thinking-orbs` (or `@oc/agent-status`).
