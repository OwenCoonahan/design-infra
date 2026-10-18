---
slug: "observable-plot"
name: "Observable Plot"
url: "https://observablehq.github.io/plot/"
summary: "Concise statistical graphics for analysis and editorial explanations."
type: "npm"
access: "free"
license: "ISC; retain the upstream license and notices. Hosted commercial products/examples are separate."
stack: ["JavaScript", "svg"]
install: "pnpm add @observablehq/plot"
vendorable: false
---

# Observable Plot

Concise statistical graphics for analysis and editorial explanations.

## Use it well

The open-source library is separate from hosted Observable products. In React mount the returned plot into a container and remove it on cleanup; keep data and units explicit.

Install one suitable engine for the task. Existing shadcn charts remain useful for conventional React dashboards. Chart engines and integration recipes do not become complete application components just by installing their npm package.

## Install

```bash
pnpm add @observablehq/plot
```

Check the consuming project's installed versions first; preserve its stack and theme. Renderer support is a library capability: alternate renderers or plugins can require additional dependencies. Provide real data, units, loading/empty/error states and an accessible table or explanation.

## Public references

- Documentation: https://observablehq.github.io/plot/
- Repository and license: https://github.com/observablehq/plot
- Package metadata: https://registry.npmjs.org/@observablehq%2Fplot/latest

## Starting patterns

- [Dot plot](https://observablehq.github.io/plot/marks/dot) — Compare numeric observations. Install: `pnpm add @observablehq/plot`.
- [Line plot](https://observablehq.github.io/plot/marks/line) — Show an ordered series. Install: `pnpm add @observablehq/plot`.
- [Bar plot](https://observablehq.github.io/plot/marks/bar) — Compare categorical values. Install: `pnpm add @observablehq/plot`.
- [Binned distribution](https://observablehq.github.io/plot/marks/rect) — Inspect a distribution using an explicit binning transform. Install: `pnpm add @observablehq/plot`.
- [Matrix heatmap](https://observablehq.github.io/plot/marks/cell) — Compare a categorical matrix. Install: `pnpm add @observablehq/plot`.

## Verification and previews

Public package metadata and documentation links audited 2026-10-18. Initial package version: `@observablehq/plot@0.6.17`. The primary package declares no npm peer dependencies.

This is a metadata/reference audit, not a fresh-project runtime, browser, accessibility or performance verification. Generated entries retain current package metadata after sync. External examples stay on the source site; hosted adapters require separate implementation, attribution and browser checks.

Refresh this source with `pnpm sync observable-plot` or the full group with `pnpm sync charts`, then `pnpm catalog`. Curated inputs live in `catalog/chart-libraries.json`; npm metadata is read without installing packages. Unknown or changed licensing fails sync for review.
