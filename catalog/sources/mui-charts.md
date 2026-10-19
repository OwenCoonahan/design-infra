---
slug: "mui-charts"
name: "MUI X Charts Community"
url: "https://mui.com/x/react-charts/"
summary: "Material-themed React chart UI from the free Community package."
type: "npm"
access: "free"
license: "MIT; preserve the upstream license and notices. See source-specific terms below."
stack: ["React", "JavaScript", "svg"]
install: "pnpm add @mui/x-charts @mui/material @emotion/react @emotion/styled"
vendorable: true
---

# MUI X Charts Community

Material-themed React chart UI from the free Community package.

## Use it for

Community imports only: @mui/x-charts. Pro/Premium charts and paid-only interactions are excluded. Prefer an existing MUI project; material and Emotion are peers, and adding them to a different stack needs a separate decision. Match the chosen MUI/React versions. For SSR provide explicit dimensions and disable animations as documented.

Moods: technical, refined. Compare its chart form and treatment with the project’s existing components before adding another library.

## Install selected packages

```bash
pnpm add @mui/x-charts @mui/material @emotion/react @emotion/styled
```

Choose versions compatible with the current project; do not change its framework, theme or UI system automatically. The command installs the packages, not a finished component or screen. Read the linked API/example and adapt it to actual data and design tokens.

## Starting options

- [Bar chart](https://mui.com/x/react-charts/bars/) — Material-styled category comparisons.
- [Line chart](https://mui.com/x/react-charts/lines/) — Material-styled trends and line series.
- [Pie and donut chart](https://mui.com/x/react-charts/pie/) — A few labeled parts of a whole.
- [Scatter plot](https://mui.com/x/react-charts/scatter/) — Compare pairs of observations.
- [Sparkline](https://mui.com/x/react-charts/sparkline/) — Compact chart UI in metric cards.
- [Gauge](https://mui.com/x/react-charts/gauge/) — Show one bounded metric with its scale.

## Machine access and provenance

- [Public documentation](https://mui.com/x/react-charts/).
- [Repository and license](https://github.com/mui/mui-x).
- [Published package metadata](https://registry.npmjs.org/%40mui%2Fx-charts/latest).
- Refresh with `pnpm sync mui-charts` or `pnpm sync charts`, then `pnpm catalog`. Source inputs: `catalog/chart-libraries.json`. No vendor source is copied into this repo.

## Gotchas

Community imports only: @mui/x-charts. Pro/Premium charts and paid-only interactions are excluded. Prefer an existing MUI project; material and Emotion are peers, and adding them to a different stack needs a separate decision. Match the chosen MUI/React versions. For SSR provide explicit dimensions and disable animations as documented.

Required package metadata, audited 2026-10-19:

| Package | Version | Published peers |
| --- | --- | --- |
| `@mui/x-charts` | `9.15.0` | react: ^17.0.0 \|\| ^18.0.0 \|\| ^19.0.0; react-dom: ^17.0.0 \|\| ^18.0.0 \|\| ^19.0.0; @mui/system: ^7.3.0 \|\| ^9.0.0; @mui/material: ^7.3.0 \|\| ^9.0.0; @emotion/react (optional): ^11.9.0; @emotion/styled (optional): ^11.8.1 |
| `@mui/material` | `9.5.0` | react: ^17.0.0 \|\| ^18.0.0 \|\| ^19.0.0; react-dom: ^17.0.0 \|\| ^18.0.0 \|\| ^19.0.0; @types/react (optional): ^17.0.0 \|\| ^18.0.0 \|\| ^19.0.0; @emotion/react (optional): ^11.5.0; @emotion/styled (optional): ^11.3.0; @mui/material-pigment-css (optional): ^9.5.0 |
| `@emotion/react` | `11.14.0` | react: >=16.8.0 |
| `@emotion/styled` | `11.14.1` | react: >=16.8.0; @emotion/react: ^11.0.0-rc.0 |

These are published peer ranges, not proof that a given combination builds in a consumer. Preserve units, missing-data behavior, readable labels and a keyboard/nonvisual alternative. Cancel simulations, animation loops, observers and subscriptions on unmount. Renderer tags describe library capabilities; individual examples can use a subset or require additional adapters.

## Verification and previews

Package names, free license metadata and public reference URLs were checked on 2026-10-19. This is not fresh-project runtime, browser, accessibility or performance verification of the upstream libraries. Local preview adapters are not added by this ingestion. External examples remain on their source sites; docs are not automatically embedded and no package is installed into the catalog app or consumer setup.
