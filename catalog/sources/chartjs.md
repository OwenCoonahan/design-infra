---
slug: "chartjs"
name: "Chart.js"
url: "https://www.chartjs.org/"
summary: "Canvas charts for dashboards, reports and embedded analytics."
type: "npm"
access: "free"
license: "MIT; retain the upstream license and notices. Hosted commercial products/examples are separate."
stack: ["JavaScript", "canvas"]
install: "pnpm add chart.js"
vendorable: true
---

# Chart.js

Canvas charts for dashboards, reports and embedded analytics.

## Use it well

Register the controllers/scales you use or follow the auto entry guide. Give the canvas an accessible description or table; destroy instances on unmount. React wrappers are optional.

Install one suitable engine for the task. Existing shadcn charts remain useful for conventional React dashboards. Chart engines and integration recipes do not become complete application components just by installing their npm package.

## Install

```bash
pnpm add chart.js
```

Check the consuming project's installed versions first; preserve its stack and theme. Renderer support is a library capability: alternate renderers or plugins can require additional dependencies. Provide real data, units, loading/empty/error states and an accessible table or explanation.

## Public references

- Documentation: https://www.chartjs.org/
- Repository and license: https://github.com/chartjs/Chart.js
- Package metadata: https://registry.npmjs.org/chart.js/latest

## Starting patterns

- [Line chart](https://www.chartjs.org/docs/latest/charts/line.html) — Track measurements over a continuous or ordered axis. Install: `pnpm add chart.js`.
- [Bar chart](https://www.chartjs.org/docs/latest/charts/bar.html) — Compare category totals. Install: `pnpm add chart.js`.
- [Scatter plot](https://www.chartjs.org/docs/latest/charts/scatter.html) — Inspect two numeric variables. Install: `pnpm add chart.js`.
- [Bubble chart](https://www.chartjs.org/docs/latest/charts/bubble.html) — Add a size encoding to a scatter plot. Install: `pnpm add chart.js`.
- [Doughnut chart](https://www.chartjs.org/docs/latest/charts/doughnut.html) — Show a small number of part-to-whole values. Install: `pnpm add chart.js`.

## Verification and previews

Public package metadata and documentation links audited 2026-10-18. Initial package version: `chart.js@4.5.1`. The primary package declares no npm peer dependencies.

This is a metadata/reference audit, not a fresh-project runtime, browser, accessibility or performance verification. Generated entries retain current package metadata after sync. External examples stay on the source site; hosted adapters require separate implementation, attribution and browser checks.

Refresh this source with `pnpm sync chartjs` or the full group with `pnpm sync charts`, then `pnpm catalog`. Curated inputs live in `catalog/chart-libraries.json`; npm metadata is read without installing packages. Unknown or changed licensing fails sync for review.
