---
slug: "recharts"
name: "Recharts"
url: "https://recharts.github.io/"
summary: "Composable React charts for product dashboards and reports."
type: "npm"
access: "free"
license: "MIT; retain the upstream license and notices. Hosted commercial products/examples are separate."
stack: ["React", "JavaScript", "svg"]
install: "pnpm add recharts"
vendorable: true
---

# Recharts

Composable React charts for product dashboards and reports.

## Use it well

Prefer existing shadcn chart blocks when they fit. Use the package for custom compositions; preserve units, readable axes and an accessible data alternative.

Install one suitable engine for the task. Existing shadcn charts remain useful for conventional React dashboards. Chart engines and integration recipes do not become complete application components just by installing their npm package.

## Install

```bash
pnpm add recharts
```

Check the consuming project's installed versions first; preserve its stack and theme. Renderer support is a library capability: alternate renderers or plugins can require additional dependencies. Provide real data, units, loading/empty/error states and an accessible table or explanation.

## Public references

- Documentation: https://recharts.github.io/
- Repository and license: https://github.com/recharts/recharts
- Package metadata: https://registry.npmjs.org/recharts/latest

## Starting patterns

- [Line chart](https://recharts.github.io/en-US/examples/SimpleLineChart/) — Compare measured trends over time. Install: `pnpm add recharts`.
- [Bar chart](https://recharts.github.io/en-US/examples/SimpleBarChart/) — Compare values across discrete categories. Install: `pnpm add recharts`.
- [Stacked area chart](https://recharts.github.io/en-US/examples/StackedAreaChart/) — Show how several contributions change over time. Install: `pnpm add recharts`.
- [Scatter plot](https://recharts.github.io/en-US/examples/SimpleScatterChart/) — Inspect relationships between two numeric measures. Install: `pnpm add recharts`.
- [Combined line and bar chart](https://recharts.github.io/en-US/examples/LineBarAreaComposedChart/) — Compare related measures while explaining different units. Install: `pnpm add recharts`.

## Verification and previews

Public package metadata and documentation links audited 2026-10-18. Initial package version: `recharts@3.10.1`. Published peer requirements: `react`: `^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0`; `react-is`: `^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0`; `react-dom`: `^16.0.0 || ^17.0.0 || ^18.0.0 || ^19.0.0`.

This is a metadata/reference audit, not a fresh-project runtime, browser, accessibility or performance verification. Generated entries retain current package metadata after sync. External examples stay on the source site; hosted adapters require separate implementation, attribution and browser checks.

Refresh this source with `pnpm sync recharts` or the full group with `pnpm sync charts`, then `pnpm catalog`. Curated inputs live in `catalog/chart-libraries.json`; npm metadata is read without installing packages. Unknown or changed licensing fails sync for review.
