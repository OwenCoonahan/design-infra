---
slug: "echarts"
name: "Apache ECharts"
url: "https://echarts.apache.org/"
summary: "Configurable dashboards with chart composition, zooming and relationship views."
type: "npm"
access: "free"
license: "Apache-2.0; retain the upstream license and notices. Hosted commercial products/examples are separate."
stack: ["JavaScript", "canvas", "svg"]
install: "pnpm add echarts"
vendorable: true
---

# Apache ECharts

Configurable dashboards with chart composition, zooming and relationship views.

## Use it well

Import the renderer and features you need. Dispose chart instances and resize them with their container. Benchmark the actual data volume rather than relying on vendor maximums.

Install one suitable engine for the task. Existing shadcn charts remain useful for conventional React dashboards. Chart engines and integration recipes do not become complete application components just by installing their npm package.

## Install

```bash
pnpm add echarts
```

Check the consuming project's installed versions first; preserve its stack and theme. Renderer support is a library capability: alternate renderers or plugins can require additional dependencies. Provide real data, units, loading/empty/error states and an accessible table or explanation.

## Public references

- Documentation: https://echarts.apache.org/
- Repository and license: https://github.com/apache/echarts
- Package metadata: https://registry.npmjs.org/echarts/latest

## Starting patterns

- [Line chart](https://echarts.apache.org/examples/en/editor.html?c=line-simple) — Track time or ordered measurements. Install: `pnpm add echarts`.
- [Bar chart](https://echarts.apache.org/examples/en/editor.html?c=bar-simple) — Compare category values. Install: `pnpm add echarts`.
- [Heatmap](https://echarts.apache.org/examples/en/editor.html?c=heatmap-cartesian) — Compare values over two discrete axes. Install: `pnpm add echarts`.
- [Sankey diagram](https://echarts.apache.org/examples/en/editor.html?c=sankey-simple) — Explain quantities moving between stages. Install: `pnpm add echarts`.
- [Relationship graph](https://echarts.apache.org/examples/en/editor.html?c=graph-simple) — Explore nodes and their connections. Install: `pnpm add echarts`.

## Verification and previews

Public package metadata and documentation links audited 2026-10-18. Initial package version: `echarts@6.1.0`. The primary package declares no npm peer dependencies.

This is a metadata/reference audit, not a fresh-project runtime, browser, accessibility or performance verification. Generated entries retain current package metadata after sync. External examples stay on the source site; hosted adapters require separate implementation, attribution and browser checks.

Refresh this source with `pnpm sync echarts` or the full group with `pnpm sync charts`, then `pnpm catalog`. Curated inputs live in `catalog/chart-libraries.json`; npm metadata is read without installing packages. Unknown or changed licensing fails sync for review.
