---
slug: "chartist"
name: "Chartist"
url: "https://chartist.dev/"
summary: "CSS-styled SVG charts with responsive layouts and explicit visual-variant examples."
type: "npm"
access: "free"
license: "MIT OR WTFPL; preserve the upstream license and notices. See source-specific terms below."
stack: ["JavaScript", "svg"]
install: "pnpm add chartist"
vendorable: true
---

# Chartist

CSS-styled SVG charts with responsive layouts and explicit visual-variant examples.

## Use it for

Dual licensed; use the MIT option and preserve its notice. Import Chartist CSS and theme its generated SVG classes. Modern Chartist APIs differ from older global Chartist examples. Detach instances/listeners on unmount. This does not install a framework-specific wrapper.

Moods: minimal, technical. Compare its chart form and treatment with the project’s existing components before adding another library.

## Install selected packages

```bash
pnpm add chartist
```

Choose versions compatible with the current project; do not change its framework, theme or UI system automatically. The command installs the packages, not a finished component or screen. Read the linked API/example and adapt it to actual data and design tokens.

## Starting options

- [Line chart](https://chartist.dev/examples/line/simple/) — A responsive CSS-styled line chart.
- [Area chart](https://chartist.dev/examples/line/area/) — A filled SVG trend area.
- [Stacked bar chart](https://chartist.dev/examples/bar/stacked/) — Stacked category comparisons.
- [Donut chart](https://chartist.dev/examples/pie/donut-chart/) — A ring chart with CSS styling.
- [Pie chart with labels](https://chartist.dev/examples/pie/custom-labels/) — Direct labels on a part-to-whole chart.
- [Line chart with custom points](https://chartist.dev/examples/line/modify-drawing/) — Customize plotted point rendering using draw events.

## Machine access and provenance

- [Public documentation](https://chartist.dev/).
- [Repository and license](https://github.com/chartist-js/chartist).
- [Published package metadata](https://registry.npmjs.org/chartist/latest).
- Refresh with `pnpm sync chartist` or `pnpm sync charts`, then `pnpm catalog`. Source inputs: `catalog/chart-libraries.json`. No vendor source is copied into this repo.

## Gotchas

Dual licensed; use the MIT option and preserve its notice. Import Chartist CSS and theme its generated SVG classes. Modern Chartist APIs differ from older global Chartist examples. Detach instances/listeners on unmount. This does not install a framework-specific wrapper.

Required package metadata, audited 2026-10-19:

| Package | Version | Published peers |
| --- | --- | --- |
| `chartist` | `2.1.0` | None declared; runtime compatibility still needs checking. |

These are published peer ranges, not proof that a given combination builds in a consumer. Preserve units, missing-data behavior, readable labels and a keyboard/nonvisual alternative. Cancel simulations, animation loops, observers and subscriptions on unmount. Renderer tags describe library capabilities; individual examples can use a subset or require additional adapters.

## Verification and previews

Package names, free license metadata and public reference URLs were checked on 2026-10-19. This is not fresh-project runtime, browser, accessibility or performance verification of the upstream libraries. Local preview adapters are not added by this ingestion. External examples remain on their source sites; docs are not automatically embedded and no package is installed into the catalog app or consumer setup.
