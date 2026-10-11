---
slug: motion-primitives
name: Motion Primitives
url: https://motion-primitives.com/
summary: 33 free MIT motion building blocks (text effects, morphing dialog/popover, animated background, transition panel, infinite slider, in-view, progressive blur, dock, tilt). Mostly unstyled, motion-based.
type: registry
access: free
license: MIT (ibelick/motion-primitives). Motion Primitives Pro is a separate paid product — not catalogued.
stack: [React, Tailwind v4, motion]
install: npx shadcn@latest add @motion-primitives/<name>
namespace: "@motion-primitives"
vendorable: true
---

# Motion Primitives (by ibelick)

**Use it for:** adding *motion behaviour* to UI you've already styled with tokens — entrance
animations (`text-effect`, `in-view`, `animated-group`), shared-layout morphs (`morphing-dialog`),
hover/active highlights (`animated-background`), panel transitions, marquees, number rolls.
Because most primitives carry no colours, they're the most theme-safe motion source we have.
**Don't use it for:** ready-made sections or visual effects with a look — use Magic UI / Aceternity.

## Install

```bash
# @motion-primitives is in shadcn's built-in registry directory
npx shadcn@latest add @motion-primitives/text-effect
npx motion-primitives@latest add text-effect     # the site's own CLI (same files)
```

Note the registry path is `/c/`, not `/r/`: `https://motion-primitives.com/c/<name>.json`.

## Machine access

- Registry index: `https://motion-primitives.com/c/registry.json` (33 items, titles + descriptions)
- Docs: `https://motion-primitives.com/docs/<name>`; no `llms.txt`.
- Synced into `catalog/generated/motion-primitives.json` by `pnpm sync motion-primitives`.

## Gotchas

- Imports `motion/react` (motion v11+). Some items also need `react-use-measure`.
- A few styled pieces hard-code zinc/white: `toolbar-dynamic`, `toolbar-expandable`, `morphing-popover`,
  `dock`, `spotlight`, `border-trail`; `text-shimmer` uses `--base-color` CSS-var defaults (zinc) — override via className.
- `morphing-dialog` / `toolbar-*` install a `hooks/useClickOutside.tsx` — make sure your `hooks` alias exists in components.json.
- `progressive-blur` stacks backdrop-filter layers — expensive on low-end GPUs; keep `blurLayers` small.
- Respect `prefers-reduced-motion` (motion's `useReducedMotion`) — the primitives don't do it for you.

## Best picks

See ★ entries: `grep '★ .*motion-primitives/' catalog/CATALOG.md`. Short list:
`text-effect`, `morphing-dialog`, `animated-background`, `transition-panel`, `infinite-slider`, `in-view`,
`animated-group`, `sliding-number`, `progressive-blur`, `text-shimmer`.
