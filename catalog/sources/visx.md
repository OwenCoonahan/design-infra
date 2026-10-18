---
slug: "visx"
name: "visx"
url: "https://visx.airbnb.tech/"
summary: "React visualization building blocks for a custom chart language."
type: "npm"
access: "free"
license: "MIT; retain the upstream license and notices. Hosted commercial products/examples are separate."
stack: ["React", "JavaScript", "svg"]
install: "pnpm add @visx/xychart @react-spring/web"
vendorable: true
---

# visx

React visualization building blocks for a custom chart language.

## Use it well

More assembly work than a ready-made dashboard component. Select only the required modules and map scales, axes, tooltips and accessibility deliberately.

Install one suitable engine for the task. Existing shadcn charts remain useful for conventional React dashboards. Chart engines and integration recipes do not become complete application components just by installing their npm package.

## Install

```bash
pnpm add @visx/xychart @react-spring/web
```

Check the consuming project's installed versions first; preserve its stack and theme. Renderer support is a library capability: alternate renderers or plugins can require additional dependencies. Provide real data, units, loading/empty/error states and an accessible table or explanation.

## Public references

- Documentation: https://visx.airbnb.tech/
- Repository and license: https://github.com/airbnb/visx
- Package metadata: https://registry.npmjs.org/@visx%2Fxychart/latest

## Starting patterns

- [Composable XY charts](https://visx.airbnb.tech/xychart) — Build related charts with shared scales and tooltips. Install: `pnpm add @visx/xychart @react-spring/web`.
- [Stacked bars](https://visx.airbnb.tech/barstack) — Compare parts across categories. Install: `pnpm add @visx/shape @visx/scale @visx/group`.
- [Heatmap primitives](https://visx.airbnb.tech/heatmaps) — Render a custom matrix visualization. Install: `pnpm add @visx/heatmap @visx/scale @visx/group`.
- [Network primitives](https://visx.airbnb.tech/network) — Draw a small custom node-link view. Install: `pnpm add @visx/network @visx/group`.
- [Brush selection](https://visx.airbnb.tech/brush) — Select a region to filter a related chart. Install: `pnpm add @visx/brush @visx/scale @visx/group`.

## Verification and previews

Public package metadata and documentation links audited 2026-10-18. Initial package version: `@visx/xychart@4.0.0`. Published peer requirements: `@react-spring/web`: `^9.7.5 || ^10.0.0`; `@types/react`: `^18.0.0 || ^19.0.0`; `@types/react-dom`: `^18.0.0 || ^19.0.0`; `react`: `^18.0.0 || ^19.0.0`; `react-dom`: `^18.0.0 || ^19.0.0`.

This is a metadata/reference audit, not a fresh-project runtime, browser, accessibility or performance verification. Generated entries retain current package metadata after sync. External examples stay on the source site; hosted adapters require separate implementation, attribution and browser checks.

Refresh this source with `pnpm sync visx` or the full group with `pnpm sync charts`, then `pnpm catalog`. Curated inputs live in `catalog/chart-libraries.json`; npm metadata is read without installing packages. Unknown or changed licensing fails sync for review.
