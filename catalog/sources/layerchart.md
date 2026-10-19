---
slug: "layerchart"
name: "LayerChart"
url: "https://www.layerchart.com/"
summary: "Svelte chart components and primitives for custom chart UI, gradients, patterns and interaction."
type: "npm"
access: "free"
license: "MIT; preserve the upstream license and notices. See source-specific terms below."
stack: ["Svelte 5", "JavaScript", "svg", "canvas", "dom"]
install: "pnpm add layerchart"
vendorable: true
---

# LayerChart

Svelte chart components and primitives for custom chart UI, gradients, patterns and interaction.

## Use it for

Svelte 5 package: do not install it into a React project or change frameworks just to copy a look. Use the selected chart/primitives in an existing Svelte stack, map CSS/theme values and size its layers. Some low-level examples require additional imports/dependencies from their own instructions. Choose the appropriate SVG/Canvas layer and dispose interactions.

Moods: refined, technical. Compare its chart form and treatment with the project’s existing components before adding another library.

## Install selected packages

```bash
pnpm add layerchart
```

Choose versions compatible with the current project; do not change its framework, theme or UI system automatically. The command installs the packages, not a finished component or screen. Read the linked API/example and adapt it to actual data and design tokens.

## Starting options

- [Line chart](https://www.layerchart.com/docs/components/LineChart) — Svelte trend chart UI.
- [Area chart](https://www.layerchart.com/docs/components/AreaChart) — Svelte filled trend chart UI.
- [Bar chart](https://www.layerchart.com/docs/components/BarChart) — Category chart UI in a Svelte project.
- [Pie chart](https://www.layerchart.com/docs/components/PieChart) — Svelte part-to-whole chart UI.
- [Scatter chart](https://www.layerchart.com/docs/components/ScatterChart) — Paired observations in a layered chart.
- [Gradient area composition](https://www.layerchart.com/docs/components/LinearGradient) — Apply an area fill using the gradient primitive and chart composition.
- [Patterned area composition](https://www.layerchart.com/docs/components/Pattern) — Apply a patterned area fill using chart primitives.

## Machine access and provenance

- [Public documentation](https://www.layerchart.com/).
- [Repository and license](https://github.com/techniq/layerchart).
- [Published package metadata](https://registry.npmjs.org/layerchart/latest).
- Refresh with `pnpm sync layerchart` or `pnpm sync charts`, then `pnpm catalog`. Source inputs: `catalog/chart-libraries.json`. No vendor source is copied into this repo.

## Gotchas

Svelte 5 package: do not install it into a React project or change frameworks just to copy a look. Use the selected chart/primitives in an existing Svelte stack, map CSS/theme values and size its layers. Some low-level examples require additional imports/dependencies from their own instructions. Choose the appropriate SVG/Canvas layer and dispose interactions.

Required package metadata, audited 2026-10-19:

| Package | Version | Published peers |
| --- | --- | --- |
| `layerchart` | `2.8.1` | svelte: ^5.0.0 |

These are published peer ranges, not proof that a given combination builds in a consumer. Preserve units, missing-data behavior, readable labels and a keyboard/nonvisual alternative. Cancel simulations, animation loops, observers and subscriptions on unmount. Renderer tags describe library capabilities; individual examples can use a subset or require additional adapters.

## Verification and previews

Package names, free license metadata and public reference URLs were checked on 2026-10-19. This is not fresh-project runtime, browser, accessibility or performance verification of the upstream libraries. Local preview adapters are not added by this ingestion. External examples remain on their source sites; docs are not automatically embedded and no package is installed into the catalog app or consumer setup.
