---
slug: "nivo"
name: "Nivo"
url: "https://nivo.rocks/"
summary: "Ready-made React visualizations with configurable themes and interaction."
type: "npm"
access: "free"
license: "MIT; retain the upstream license and notices. Hosted commercial products/examples are separate."
stack: ["React", "JavaScript", "svg", "canvas"]
install: "pnpm add @nivo/core"
vendorable: true
---

# Nivo

Ready-made React visualizations with configurable themes and interaction.

## Use it well

Install the package for the chosen chart rather than only @nivo/core. Responsive variants need a sized parent. Some types offer Canvas alternatives; check each component API.

Install one suitable engine for the task. Existing shadcn charts remain useful for conventional React dashboards. Chart engines and integration recipes do not become complete application components just by installing their npm package.

## Install

```bash
pnpm add @nivo/core
```

Check the consuming project's installed versions first; preserve its stack and theme. Renderer support is a library capability: alternate renderers or plugins can require additional dependencies. Provide real data, units, loading/empty/error states and an accessible table or explanation.

## Public references

- Documentation: https://nivo.rocks/
- Repository and license: https://github.com/plouc/nivo
- Package metadata: https://registry.npmjs.org/@nivo%2Fcore/latest

## Starting patterns

- [Line chart](https://nivo.rocks/line/) — Track several series over time. Install: `pnpm add @nivo/line`.
- [Bar chart](https://nivo.rocks/bar/) — Compare grouped or stacked category totals. Install: `pnpm add @nivo/bar`.
- [Heatmap](https://nivo.rocks/heatmap/) — Inspect a row-by-column matrix. Install: `pnpm add @nivo/heatmap`.
- [Sankey diagram](https://nivo.rocks/sankey/) — Explain quantities flowing between categories. Install: `pnpm add @nivo/sankey`.
- [Treemap](https://nivo.rocks/treemap/) — Explore hierarchical part-to-whole data. Install: `pnpm add @nivo/treemap`.

## Verification and previews

Public package metadata and documentation links audited 2026-10-18. Initial package version: `@nivo/core@0.99.0`. Published peer requirements: `react`: `^16.14 || ^17.0 || ^18.0 || ^19.0`.

This is a metadata/reference audit, not a fresh-project runtime, browser, accessibility or performance verification. Generated entries retain current package metadata after sync. External examples stay on the source site; hosted adapters require separate implementation, attribution and browser checks.

Refresh this source with `pnpm sync nivo` or the full group with `pnpm sync charts`, then `pnpm catalog`. Curated inputs live in `catalog/chart-libraries.json`; npm metadata is read without installing packages. Unknown or changed licensing fails sync for review.
