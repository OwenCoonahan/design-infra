---
slug: "frappe-charts"
name: "Frappe Charts"
url: "https://frappe.io/charts/"
summary: "Framework-neutral SVG charts with concise dashboard defaults and activity heatmaps."
type: "npm"
access: "free"
license: "MIT; preserve the upstream license and notices. See source-specific terms below."
stack: ["JavaScript", "svg"]
install: "pnpm add frappe-charts"
vendorable: true
---

# Frappe Charts

Framework-neutral SVG charts with concise dashboard defaults and activity heatmaps.

## Use it for

Use a real browser container and follow the current ESM/CSS instructions. The chart package does not require the Frappe application framework. Heatmaps have a different data contract from axis charts. Check maintenance and browser behavior in the target project; dispose DOM/listeners on unmount.

Moods: minimal, trustworthy. Compare its chart form and treatment with the project’s existing components before adding another library.

## Install selected packages

```bash
pnpm add frappe-charts
```

Choose versions compatible with the current project; do not change its framework, theme or UI system automatically. The command installs the packages, not a finished component or screen. Read the linked API/example and adapt it to actual data and design tokens.

## Starting options

- [Line chart](https://frappe.io/charts/docs/basic/basic_chart) — Simple trends using the axis-chart API.
- [Bar chart](https://frappe.io/charts/docs/basic/basic_chart) — Category bars using the axis-chart API.
- [Pie chart](https://frappe.io/charts/docs/basic/aggr_sliced_diags) — A few parts of a whole.
- [Percentage chart](https://frappe.io/charts/docs/basic/aggr_sliced_diags) — Segmented part-to-whole totals.
- [Activity heatmap](https://frappe.io/charts/docs/basic/heatmap) — Time-based activity levels in a compact matrix.

## Machine access and provenance

- [Public documentation](https://frappe.io/charts/).
- [Repository and license](https://github.com/frappe/charts).
- [Published package metadata](https://registry.npmjs.org/frappe-charts/latest).
- Refresh with `pnpm sync frappe-charts` or `pnpm sync charts`, then `pnpm catalog`. Source inputs: `catalog/chart-libraries.json`. No vendor source is copied into this repo.

## Gotchas

Use a real browser container and follow the current ESM/CSS instructions. The chart package does not require the Frappe application framework. Heatmaps have a different data contract from axis charts. Check maintenance and browser behavior in the target project; dispose DOM/listeners on unmount.

Required package metadata, audited 2026-10-19:

| Package | Version | Published peers |
| --- | --- | --- |
| `frappe-charts` | `1.6.2` | None declared; runtime compatibility still needs checking. |

These are published peer ranges, not proof that a given combination builds in a consumer. Preserve units, missing-data behavior, readable labels and a keyboard/nonvisual alternative. Cancel simulations, animation loops, observers and subscriptions on unmount. Renderer tags describe library capabilities; individual examples can use a subset or require additional adapters.

## Verification and previews

Package names, free license metadata and public reference URLs were checked on 2026-10-19. This is not fresh-project runtime, browser, accessibility or performance verification of the upstream libraries. Local preview adapters are not added by this ingestion. External examples remain on their source sites; docs are not automatically embedded and no package is installed into the catalog app or consumer setup.
