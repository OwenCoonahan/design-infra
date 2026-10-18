---
slug: "antv-g2"
name: "AntV G2"
url: "https://g2.antv.antgroup.com/"
summary: "A grammar-based engine for composed analytical visualizations."
type: "npm"
access: "free"
license: "MIT; retain the upstream license and notices. Hosted commercial products/examples are separate."
stack: ["JavaScript", "canvas", "svg"]
install: "pnpm add @antv/g2"
vendorable: true
---

# AntV G2

A grammar-based engine for composed analytical visualizations.

## Use it well

Keep the visualization grammar explicit and dispose the chart on unmount. Pin a compatible major when adapting older examples; do not treat G2 and the G6 graph engine as interchangeable.

Install one suitable engine for the task. Existing shadcn charts remain useful for conventional React dashboards. Chart engines and integration recipes do not become complete application components just by installing their npm package.

## Install

```bash
pnpm add @antv/g2
```

Check the consuming project's installed versions first; preserve its stack and theme. Renderer support is a library capability: alternate renderers or plugins can require additional dependencies. Provide real data, units, loading/empty/error states and an accessible table or explanation.

## Public references

- Documentation: https://g2.antv.antgroup.com/
- Repository and license: https://github.com/antvis/g2
- Package metadata: https://registry.npmjs.org/@antv%2Fg2/latest

## Starting patterns

- [Interval marks](https://g2.antv.antgroup.com/en/manual/core/mark/interval) — Compare categorical values. Install: `pnpm add @antv/g2`.
- [Line marks](https://g2.antv.antgroup.com/en/manual/core/mark/line) — Track an ordered series. Install: `pnpm add @antv/g2`.
- [Point marks](https://g2.antv.antgroup.com/en/manual/core/mark/point) — Inspect numeric observations. Install: `pnpm add @antv/g2`.
- [Area marks](https://g2.antv.antgroup.com/en/manual/core/mark/area) — Show a cumulative or filled series. Install: `pnpm add @antv/g2`.
- [Rectangle marks](https://g2.antv.antgroup.com/en/manual/core/mark/rect) — Encode values in a matrix. Install: `pnpm add @antv/g2`.

## Verification and previews

Public package metadata and documentation links audited 2026-10-18. Initial package version: `@antv/g2@5.4.8`. The primary package declares no npm peer dependencies.

This is a metadata/reference audit, not a fresh-project runtime, browser, accessibility or performance verification. Generated entries retain current package metadata after sync. External examples stay on the source site; hosted adapters require separate implementation, attribution and browser checks.

Refresh this source with `pnpm sync antv-g2` or the full group with `pnpm sync charts`, then `pnpm catalog`. Curated inputs live in `catalog/chart-libraries.json`; npm metadata is read without installing packages. Unknown or changed licensing fails sync for review.
