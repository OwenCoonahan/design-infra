---
slug: "billboard"
name: "Billboard.js"
url: "https://naver.github.io/billboard.js/"
summary: "Framework-neutral D3-based chart UI with named chart types and reusable configuration."
type: "npm"
access: "free"
license: "MIT; preserve the upstream license and notices. See source-specific terms below."
stack: ["JavaScript", "svg"]
install: "pnpm add billboard.js"
vendorable: true
---

# Billboard.js

Framework-neutral D3-based chart UI with named chart types and reusable configuration.

## Use it for

Import the matching Billboard CSS and use current named shape imports/tree shaking where appropriate. The API renders into a sized browser container; wrap mount/update/destroy for the consuming framework. Match its actual package peers; do not assume an older documentation example matches the latest API. The React peer is optional for its React wrapper; the browser DOM API remains framework-neutral.

Moods: technical, refined. Compare its chart form and treatment with the project’s existing components before adding another library.

## Install selected packages

```bash
pnpm add billboard.js
```

Choose versions compatible with the current project; do not change its framework, theme or UI system automatically. The command installs the packages, not a finished component or screen. Read the linked API/example and adapt it to actual data and design tokens.

## Starting options

- [Line chart](https://naver.github.io/billboard.js/demo/#Chart.LineChart) — Compare trends with configurable SVG styling.
- [Bar chart](https://naver.github.io/billboard.js/demo/#Chart.BarChart) — Compare discrete category values.
- [Area chart](https://naver.github.io/billboard.js/demo/#Chart.AreaChart) — Filled trend regions.
- [Donut chart](https://naver.github.io/billboard.js/demo/#Chart.DonutChart) — A compact ring summary.
- [Stepped line chart](https://naver.github.io/billboard.js/demo/#Chart.StepChart) — Represent changes using discrete step segments.
- [Stacked bar chart](https://naver.github.io/billboard.js/demo/#Chart.StackedBarChart) — Layer contributions within category totals.

## Machine access and provenance

- [Public documentation](https://naver.github.io/billboard.js/).
- [Repository and license](https://github.com/naver/billboard.js).
- [Published package metadata](https://registry.npmjs.org/billboard.js/latest).
- Refresh with `pnpm sync billboard` or `pnpm sync charts`, then `pnpm catalog`. Source inputs: `catalog/chart-libraries.json`. No vendor source is copied into this repo.

## Gotchas

Import the matching Billboard CSS and use current named shape imports/tree shaking where appropriate. The API renders into a sized browser container; wrap mount/update/destroy for the consuming framework. Match its actual package peers; do not assume an older documentation example matches the latest API. The React peer is optional for its React wrapper; the browser DOM API remains framework-neutral.

Required package metadata, audited 2026-10-19:

| Package | Version | Published peers |
| --- | --- | --- |
| `billboard.js` | `4.1.3` | react (optional): >=16.8.0 |

These are published peer ranges, not proof that a given combination builds in a consumer. Preserve units, missing-data behavior, readable labels and a keyboard/nonvisual alternative. Cancel simulations, animation loops, observers and subscriptions on unmount. Renderer tags describe library capabilities; individual examples can use a subset or require additional adapters.

## Verification and previews

Package names, free license metadata and public reference URLs were checked on 2026-10-19. This is not fresh-project runtime, browser, accessibility or performance verification of the upstream libraries. Local preview adapters are not added by this ingestion. External examples remain on their source sites; docs are not automatically embedded and no package is installed into the catalog app or consumer setup.
