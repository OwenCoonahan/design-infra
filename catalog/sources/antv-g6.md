---
slug: "antv-g6"
name: "AntV G6"
url: "https://g6.antv.antgroup.com/"
summary: "Graph visualization with layouts, behaviors and configurable node styles."
type: "npm"
access: "free"
license: "MIT; retain the upstream license and notices. Hosted commercial products/examples are separate."
stack: ["JavaScript", "canvas", "svg", "webgl"]
install: "pnpm add @antv/g6"
vendorable: true
---

# AntV G6

Graph visualization with layouts, behaviors and configurable node styles.

## Use it well

Choose layouts and rendering features for the actual graph. Preserve cleanup and resize behavior in React; extensions and G6 major versions have their own compatibility requirements.

Install one suitable engine for the task. Existing shadcn charts remain useful for conventional React dashboards. Chart engines and integration recipes do not become complete application components just by installing their npm package.

## Install

```bash
pnpm add @antv/g6
```

Check the consuming project's installed versions first; preserve its stack and theme. Renderer support is a library capability: alternate renderers or plugins can require additional dependencies. Provide real data, units, loading/empty/error states and an accessible table or explanation.

## Public references

- Documentation: https://g6.antv.antgroup.com/
- Repository and license: https://github.com/antvis/G6
- Package metadata: https://registry.npmjs.org/@antv%2Fg6/latest

## Starting patterns

- [Graph construction](https://g6.antv.antgroup.com/en/manual/getting-started/quick-start) — Build a node-and-edge visualization. Install: `pnpm add @antv/g6`.
- [Graph layouts](https://g6.antv.antgroup.com/en/manual/layout/overview) — Choose how to arrange connected entities. Install: `pnpm add @antv/g6`.
- [Graph interaction](https://g6.antv.antgroup.com/en/manual/behavior/overview) — Define how users explore the graph. Install: `pnpm add @antv/g6`.
- [Node presentation](https://g6.antv.antgroup.com/en/manual/element/node/overview) — Encode domain entities through node appearance. Install: `pnpm add @antv/g6`.
- [Edge presentation](https://g6.antv.antgroup.com/en/manual/element/edge/overview) — Encode relationship types through edges. Install: `pnpm add @antv/g6`.

## Verification and previews

Public package metadata and documentation links audited 2026-10-18. Initial package version: `@antv/g6@5.1.1`. The primary package declares no npm peer dependencies.

This is a metadata/reference audit, not a fresh-project runtime, browser, accessibility or performance verification. Generated entries retain current package metadata after sync. External examples stay on the source site; hosted adapters require separate implementation, attribution and browser checks.

Refresh this source with `pnpm sync antv-g6` or the full group with `pnpm sync charts`, then `pnpm catalog`. Curated inputs live in `catalog/chart-libraries.json`; npm metadata is read without installing packages. Unknown or changed licensing fails sync for review.
