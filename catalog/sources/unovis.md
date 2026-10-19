---
slug: "unovis"
name: "Unovis"
url: "https://unovis.dev/"
summary: "Composable chart UI and relationship views with framework wrappers and shared visual primitives."
type: "npm"
access: "free"
license: "Apache-2.0; preserve the upstream license and notices. See source-specific terms below."
stack: ["React", "JavaScript", "svg"]
install: "pnpm add @unovis/react @unovis/ts"
vendorable: true
---

# Unovis

Composable chart UI and relationship views with framework wrappers and shared visual primitives.

## Use it for

These commands choose the React wrapper plus the matching @unovis/ts core. Other wrappers exist; preserve the consuming framework. Size containers, map Unovis CSS variables to the brand and inspect per-component interaction/data contracts. Map/graph components have different costs and dependencies; no upstream MCP or agent skill is installed automatically.

Moods: technical, refined. Compare its chart form and treatment with the project’s existing components before adding another library.

## Install selected packages

```bash
pnpm add @unovis/react @unovis/ts
```

Choose versions compatible with the current project; do not change its framework, theme or UI system automatically. The command installs the packages, not a finished component or screen. Read the linked API/example and adapt it to actual data and design tokens.

## Starting options

- [Line chart](https://unovis.dev/docs/components/Line) — Compose readable trend lines and axes.
- [Area chart](https://unovis.dev/docs/components/Area) — Layer measured trend areas.
- [Grouped bar chart](https://unovis.dev/docs/components/GroupedBar) — Compare categories with grouped series.
- [Stacked bar chart](https://unovis.dev/docs/components/StackedBar) — Show category contributions with stacked bars.
- [Donut chart](https://unovis.dev/docs/components/Donut) — A compact composable ring summary.
- [Scatter plot](https://unovis.dev/docs/components/Scatter) — Explore paired numeric observations.
- [Relationship graph](https://unovis.dev/docs/components/Graph) — Explore connected entities rather than numerical axes.

## Machine access and provenance

- [Public documentation](https://unovis.dev/).
- [Repository and license](https://github.com/f5/unovis).
- [Published package metadata](https://registry.npmjs.org/%40unovis%2Freact/latest).
- Refresh with `pnpm sync unovis` or `pnpm sync charts`, then `pnpm catalog`. Source inputs: `catalog/chart-libraries.json`. No vendor source is copied into this repo.

## Gotchas

These commands choose the React wrapper plus the matching @unovis/ts core. Other wrappers exist; preserve the consuming framework. Size containers, map Unovis CSS variables to the brand and inspect per-component interaction/data contracts. Map/graph components have different costs and dependencies; no upstream MCP or agent skill is installed automatically.

Required package metadata, audited 2026-10-19:

| Package | Version | Published peers |
| --- | --- | --- |
| `@unovis/react` | `1.7.1` | react: >=16.8.0 \|\| ^17 \|\| ^18 \|\| ^19; react-dom: >=16.8.0 \|\| ^17 \|\| ^18 \|\| ^19; @unovis/ts: 1.7.1 |
| `@unovis/ts` | `1.7.1` | None declared; runtime compatibility still needs checking. |

These are published peer ranges, not proof that a given combination builds in a consumer. Preserve units, missing-data behavior, readable labels and a keyboard/nonvisual alternative. Cancel simulations, animation loops, observers and subscriptions on unmount. Renderer tags describe library capabilities; individual examples can use a subset or require additional adapters.

## Verification and previews

Package names, free license metadata and public reference URLs were checked on 2026-10-19. This is not fresh-project runtime, browser, accessibility or performance verification of the upstream libraries. Local preview adapters are not added by this ingestion. External examples remain on their source sites; docs are not automatically embedded and no package is installed into the catalog app or consumer setup.
