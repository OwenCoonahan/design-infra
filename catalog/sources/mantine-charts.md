---
slug: "mantine-charts"
name: "Mantine Charts"
url: "https://mantine.dev/charts/getting-started/"
summary: "Dashboard chart components that share Mantine styling, tooltips and application themes."
type: "npm"
access: "free"
license: "MIT; preserve the upstream license and notices. See source-specific terms below."
stack: ["React", "JavaScript", "svg"]
install: "pnpm add @mantine/charts @mantine/core @mantine/hooks recharts"
vendorable: true
---

# Mantine Charts

Dashboard chart components that share Mantine styling, tooltips and application themes.

## Use it for

Best for projects already using Mantine. Latest chart, core and hooks versions must match; inspect published React/Recharts peers before choosing a version. Import core styles before charts/styles.css and provide MantineProvider. Adding Mantine to a different UI stack is a separate framework decision, not an automatic chart install.

Moods: calm, technical, refined. Compare its chart form and treatment with the project’s existing components before adding another library.

## Install selected packages

```bash
pnpm add @mantine/charts @mantine/core @mantine/hooks recharts
```

Choose versions compatible with the current project; do not change its framework, theme or UI system automatically. The command installs the packages, not a finished component or screen. Read the linked API/example and adapt it to actual data and design tokens.

## Starting options

- [Area chart](https://mantine.dev/charts/area-chart/) — Filled trend charts within a Mantine dashboard.
- [Bar chart](https://mantine.dev/charts/bar-chart/) — Category comparisons with shared app styling.
- [Line chart](https://mantine.dev/charts/line-chart/) — Trend series with Mantine tooltips and legends.
- [Sparkline](https://mantine.dev/charts/sparkline/) — A compact trend beside a KPI.
- [Donut chart](https://mantine.dev/charts/donut-chart/) — A small part-to-whole summary.
- [Heatmap](https://mantine.dev/charts/heatmap/) — Activity levels across a time/calendar matrix.
- [Scatter plot](https://mantine.dev/charts/scatter-chart/) — Compare paired numeric observations.
- [Radar chart](https://mantine.dev/charts/radar-chart/) — Compare values on several labeled axes.
- [Funnel chart](https://mantine.dev/charts/funnel-chart/) — Compare counts across ordered conversion stages.
- [Candlestick chart](https://mantine.dev/charts/candlestick-chart/) — Render OHLC observations with the current Mantine API.
- [Treemap](https://mantine.dev/charts/treemap/) — Nested parts of an overall measured total.
- [Sankey diagram](https://mantine.dev/charts/sankey-chart/) — Measured quantities flowing between stages.

## Machine access and provenance

- [Public documentation](https://mantine.dev/charts/getting-started/).
- [Repository and license](https://github.com/mantinedev/mantine).
- [Published package metadata](https://registry.npmjs.org/%40mantine%2Fcharts/latest).
- Refresh with `pnpm sync mantine-charts` or `pnpm sync charts`, then `pnpm catalog`. Source inputs: `catalog/chart-libraries.json`. No vendor source is copied into this repo.

## Gotchas

Best for projects already using Mantine. Latest chart, core and hooks versions must match; inspect published React/Recharts peers before choosing a version. Import core styles before charts/styles.css and provide MantineProvider. Adding Mantine to a different UI stack is a separate framework decision, not an automatic chart install.

Required package metadata, audited 2026-10-19:

| Package | Version | Published peers |
| --- | --- | --- |
| `@mantine/charts` | `9.7.3` | react: ^19.2.0; recharts: >=3.2.1; react-dom: ^19.2.0; @mantine/core: 9.7.3; @mantine/hooks: 9.7.3 |
| `@mantine/core` | `9.7.3` | react: ^19.2.0; react-dom: ^19.2.0; @mantine/hooks: 9.7.3 |
| `@mantine/hooks` | `9.7.3` | react: ^19.2.0 |
| `recharts` | `3.10.1` | react: ^16.8.0 \|\| ^17.0.0 \|\| ^18.0.0 \|\| ^19.0.0; react-is: ^16.8.0 \|\| ^17.0.0 \|\| ^18.0.0 \|\| ^19.0.0; react-dom: ^16.0.0 \|\| ^17.0.0 \|\| ^18.0.0 \|\| ^19.0.0 |

These are published peer ranges, not proof that a given combination builds in a consumer. Preserve units, missing-data behavior, readable labels and a keyboard/nonvisual alternative. Cancel simulations, animation loops, observers and subscriptions on unmount. Renderer tags describe library capabilities; individual examples can use a subset or require additional adapters.

## Verification and previews

Package names, free license metadata and public reference URLs were checked on 2026-10-19. This is not fresh-project runtime, browser, accessibility or performance verification of the upstream libraries. Local preview adapters are not added by this ingestion. External examples remain on their source sites; docs are not automatically embedded and no package is installed into the catalog app or consumer setup.
