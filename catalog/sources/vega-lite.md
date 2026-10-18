---
slug: "vega-lite"
name: "Vega-Lite"
url: "https://vega.github.io/vega-lite/"
summary: "Declarative JSON specifications for charts, transformations and linked views."
type: "npm"
access: "free"
license: "BSD-3-Clause; retain the upstream license and notices. Hosted commercial products/examples are separate."
stack: ["JavaScript", "svg", "canvas"]
install: "pnpm add vega vega-lite vega-embed"
vendorable: false
---

# Vega-Lite

Declarative JSON specifications for charts, transformations and linked views.

## Use it well

Install compatible Vega, Vega-Lite and embedding packages. Treat a specification as application input: review external data URLs and keep dataset access deliberate.

Install one suitable engine for the task. Existing shadcn charts remain useful for conventional React dashboards. Chart engines and integration recipes do not become complete application components just by installing their npm package.

## Install

```bash
pnpm add vega vega-lite vega-embed
```

Check the consuming project's installed versions first; preserve its stack and theme. Renderer support is a library capability: alternate renderers or plugins can require additional dependencies. Provide real data, units, loading/empty/error states and an accessible table or explanation.

## Public references

- Documentation: https://vega.github.io/vega-lite/
- Repository and license: https://github.com/vega/vega-lite
- Package metadata: https://registry.npmjs.org/vega-lite/latest

## Starting patterns

- [Bar specification](https://vega.github.io/vega-lite/examples/bar.html) — Compare category values from a concise spec. Install: `pnpm add vega vega-lite vega-embed`.
- [Line specification](https://vega.github.io/vega-lite/examples/line.html) — Show an ordered numeric series. Install: `pnpm add vega vega-lite vega-embed`.
- [Scatter specification](https://vega.github.io/vega-lite/examples/point_2d.html) — Inspect relationships between measures. Install: `pnpm add vega vega-lite vega-embed`.
- [Histogram specification](https://vega.github.io/vega-lite/examples/histogram.html) — Aggregate observations into bins. Install: `pnpm add vega vega-lite vega-embed`.
- [Heatmap specification](https://vega.github.io/vega-lite/examples/rect_binned_heatmap.html) — Explore two-dimensional density. Install: `pnpm add vega vega-lite vega-embed`.

## Verification and previews

Public package metadata and documentation links audited 2026-10-18. Initial package version: `vega-lite@6.5.0`. Published peer requirements: `vega`: `^6.4.0`.

This is a metadata/reference audit, not a fresh-project runtime, browser, accessibility or performance verification. Generated entries retain current package metadata after sync. External examples stay on the source site; hosted adapters require separate implementation, attribution and browser checks.

Refresh this source with `pnpm sync vega-lite` or the full group with `pnpm sync charts`, then `pnpm catalog`. Curated inputs live in `catalog/chart-libraries.json`; npm metadata is read without installing packages. Unknown or changed licensing fails sync for review.
