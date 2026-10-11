---
slug: transitions
name: transitions.dev
url: https://transitions.dev/library.html
summary: 43+ tuned CSS micro-transitions (modal, tabs, toast, number pop, shimmer, streaming text, thinking states) delivered as an agent skill that applies them to your markup.
type: skill
access: free
license: Free for unlimited personal/commercial use in your products; no republishing the collection. Pro (React/TS variants) $9/mo or $149 lifetime.
stack: [CSS, vanilla JS]
install: npx skills add Jakubantalik/transitions.dev
vendorable: false
---

# transitions.dev (by Jakub Antalik)

**Use it for:** the motion polish pass — making existing modals, menus, tabs, toasts, counters,
skeletons and AI streaming states *feel* right. Not components: recipes your agent applies.

## Install

```bash
npx skills add Jakubantalik/transitions.dev                       # free skill (32 recipes)
npx skills add Jakubantalik/transitions.dev -s transitions-polish # "polish pass" add-on
npx transitions-dev add --free                                    # or copy the CSS into ./transitions/
```

Then ask your agent: *"apply the tabs-sliding transition to the settings tabs"*, or *"run a
transitions polish pass on this page"*.

## How it works

Each recipe (`skills/transitions-dev/NN-<name>.md` in the GitHub repo) has: when to use, HTML
usage with state classes (`.is-open` / `.is-closing`), tunable CSS variables, and the CSS. All
recipes share semantic variables in one `:root` block (`_root.css`).

## Gotchas

- Free tier is CSS + class toggling. With React, toggle the state classes from state, or use the
  Pro React variants.
- Licence forbids republishing the collection → we only catalog it (`catalog/generated/transitions.json`), never vendor it.
- Respect `prefers-reduced-motion` — the recipes do, keep it when adapting.
