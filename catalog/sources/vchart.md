---
slug: "vchart"
name: "VisActor VChart"
url: "https://www.visactor.io/vchart"
summary: "Specification-driven charts with theme, layout and presentation-oriented chart options."
type: "npm"
access: "free"
license: "MIT; preserve the upstream license and notices. See source-specific terms below."
stack: ["JavaScript", "canvas"]
install: "pnpm add @visactor/vchart"
vendorable: true
---

# VisActor VChart

Specification-driven charts with theme, layout and presentation-oriented chart options.

## Use it for

Use the framework-neutral VChart package and its supported spec for the selected series. Map its theme to the project, keep motion purposeful and provide actual data/units. Alternative renderer/plugins may need extra packages. Use free public examples; do not install the whole VisActor product family. SVG export uses a separate plugin; it is not part of this install command.

Moods: technical, refined. Compare its chart form and treatment with the project’s existing components before adding another library.

## Install selected packages

```bash
pnpm add @visactor/vchart
```

Choose versions compatible with the current project; do not change its framework, theme or UI system automatically. The command installs the packages, not a finished component or screen. Read the linked API/example and adapt it to actual data and design tokens.

## Starting options

- [Line chart](https://www.visactor.io/vchart/guide/tutorial_docs/Chart_Types/Line) — Style trend lines through a chart spec.
- [Bar chart](https://www.visactor.io/vchart/guide/tutorial_docs/Chart_Types/Bar) — Style category comparisons through a chart spec.
- [Area chart](https://www.visactor.io/vchart/guide/tutorial_docs/Chart_Types/Area) — Filled trend regions through a chart spec.
- [Radar chart](https://www.visactor.io/vchart/guide/tutorial_docs/Chart_Types/Radar) — Compare multiple labeled axes.
- [Heatmap](https://www.visactor.io/vchart/guide/tutorial_docs/Chart_Types/Heatmap) — A color-coded matrix of numeric values.

## Machine access and provenance

- [Public documentation](https://www.visactor.io/vchart).
- [Repository and license](https://github.com/VisActor/VChart).
- [Published package metadata](https://registry.npmjs.org/%40visactor%2Fvchart/latest).
- Refresh with `pnpm sync vchart` or `pnpm sync charts`, then `pnpm catalog`. Source inputs: `catalog/chart-libraries.json`. No vendor source is copied into this repo.

## Gotchas

Use the framework-neutral VChart package and its supported spec for the selected series. Map its theme to the project, keep motion purposeful and provide actual data/units. Alternative renderer/plugins may need extra packages. Use free public examples; do not install the whole VisActor product family. SVG export uses a separate plugin; it is not part of this install command.

Required package metadata, audited 2026-10-19:

| Package | Version | Published peers |
| --- | --- | --- |
| `@visactor/vchart` | `2.2.0` | None declared; runtime compatibility still needs checking. |

These are published peer ranges, not proof that a given combination builds in a consumer. Preserve units, missing-data behavior, readable labels and a keyboard/nonvisual alternative. Cancel simulations, animation loops, observers and subscriptions on unmount. Renderer tags describe library capabilities; individual examples can use a subset or require additional adapters.

## Verification and previews

Package names, free license metadata and public reference URLs were checked on 2026-10-19. This is not fresh-project runtime, browser, accessibility or performance verification of the upstream libraries. Local preview adapters are not added by this ingestion. External examples remain on their source sites; docs are not automatically embedded and no package is installed into the catalog app or consumer setup.
