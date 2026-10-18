---
slug: "plotly"
name: "Plotly.js"
url: "https://plotly.com/javascript/"
summary: "Statistical, scientific and financial charts with built-in interaction."
type: "npm"
access: "free"
license: "MIT; retain the upstream license and notices. Hosted commercial products/examples are separate."
stack: ["JavaScript", "svg", "webgl"]
install: "pnpm add plotly.js-dist-min"
vendorable: true
---

# Plotly.js

Statistical, scientific and financial charts with built-in interaction.

## Use it well

Use the open-source JavaScript library rather than assuming a paid hosted product. Load browser-only code outside SSR and inspect bundle size; clean up plots when leaving the page.

Install one suitable engine for the task. Existing shadcn charts remain useful for conventional React dashboards. Chart engines and integration recipes do not become complete application components just by installing their npm package.

## Install

```bash
pnpm add plotly.js-dist-min
```

Check the consuming project's installed versions first; preserve its stack and theme. Renderer support is a library capability: alternate renderers or plugins can require additional dependencies. Provide real data, units, loading/empty/error states and an accessible table or explanation.

## Public references

- Documentation: https://plotly.com/javascript/
- Repository and license: https://github.com/plotly/plotly.js
- Package metadata: https://registry.npmjs.org/plotly.js-dist-min/latest

## Starting patterns

- [Scatter plot](https://plotly.com/javascript/line-and-scatter/) — Inspect numeric relationships. Install: `pnpm add plotly.js-dist-min`.
- [Box plot](https://plotly.com/javascript/box-plots/) — Compare distributions across groups. Install: `pnpm add plotly.js-dist-min`.
- [Heatmap](https://plotly.com/javascript/heatmaps/) — Read a numeric matrix. Install: `pnpm add plotly.js-dist-min`.
- [Candlestick chart](https://plotly.com/javascript/candlestick-charts/) — Explore OHLC financial time series. Install: `pnpm add plotly.js-dist-min`.
- [3D surface](https://plotly.com/javascript/3d-surface-plots/) — Inspect a sampled surface. Install: `pnpm add plotly.js-dist-min`.

## Verification and previews

Public package metadata and documentation links audited 2026-10-18. Initial package version: `plotly.js-dist-min@4.1.2`. The primary package declares no npm peer dependencies.

This is a metadata/reference audit, not a fresh-project runtime, browser, accessibility or performance verification. Generated entries retain current package metadata after sync. External examples stay on the source site; hosted adapters require separate implementation, attribution and browser checks.

Refresh this source with `pnpm sync plotly` or the full group with `pnpm sync charts`, then `pnpm catalog`. Curated inputs live in `catalog/chart-libraries.json`; npm metadata is read without installing packages. Unknown or changed licensing fails sync for review.
