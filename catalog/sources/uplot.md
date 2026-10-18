---
slug: "uplot"
name: "uPlot"
url: "https://github.com/leeoniya/uPlot"
summary: "Focused time-series plotting for monitoring and analytical interfaces."
type: "npm"
access: "free"
license: "MIT; retain the upstream license and notices. Hosted commercial products/examples are separate."
stack: ["JavaScript", "canvas"]
install: "pnpm add uplot"
vendorable: true
---

# uPlot

Focused time-series plotting for monitoring and analytical interfaces.

## Use it well

Use a sized browser container, import uplot/dist/uPlot.min.css and clean up the instance. Handle nulls, time units and decimation explicitly; benchmark your own dataset.

Install one suitable engine for the task. Existing shadcn charts remain useful for conventional React dashboards. Chart engines and integration recipes do not become complete application components just by installing their npm package.

## Install

```bash
pnpm add uplot
```

Check the consuming project's installed versions first; preserve its stack and theme. Renderer support is a library capability: alternate renderers or plugins can require additional dependencies. Provide real data, units, loading/empty/error states and an accessible table or explanation.

## Public references

- Documentation: https://github.com/leeoniya/uPlot
- Repository and license: https://github.com/leeoniya/uPlot
- Package metadata: https://registry.npmjs.org/uplot/latest

## Starting patterns

- [Monitoring time series](https://leeoniya.github.io/uPlot/demos/time-periods.html) — Inspect timestamped measurements. Install: `pnpm add uplot`.
- [Aligned multi-series](https://leeoniya.github.io/uPlot/demos/area-fill.html) — Compare several series against shared timestamps. Install: `pnpm add uplot`.
- [Updating measurements](https://leeoniya.github.io/uPlot/demos/stream-data.html) — Explore incoming measurements with a controlled update loop. Install: `pnpm add uplot`.
- [Linked cursor](https://leeoniya.github.io/uPlot/demos/sync-cursor.html) — Inspect related series using a synchronized cursor. Install: `pnpm add uplot`.
- [Range selection](https://leeoniya.github.io/uPlot/demos/zoom-wheel.html) — Select a time interval for analysis. Install: `pnpm add uplot`.

## Verification and previews

Public package metadata and documentation links audited 2026-10-18. Initial package version: `uplot@1.6.32`. The primary package declares no npm peer dependencies.

This is a metadata/reference audit, not a fresh-project runtime, browser, accessibility or performance verification. Generated entries retain current package metadata after sync. External examples stay on the source site; hosted adapters require separate implementation, attribution and browser checks.

Refresh this source with `pnpm sync uplot` or the full group with `pnpm sync charts`, then `pnpm catalog`. Curated inputs live in `catalog/chart-libraries.json`; npm metadata is read without installing packages. Unknown or changed licensing fails sync for review.
