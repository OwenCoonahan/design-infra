---
slug: "react-force-graph"
name: "React Force Graph 2D"
url: "https://github.com/vasturiano/react-force-graph"
summary: "React Canvas force-directed graphs with custom node drawing, labels and selection."
type: "npm"
access: "free"
license: "MIT; preserve the upstream license and notices. See source-specific terms below."
stack: ["React", "JavaScript", "canvas"]
install: "pnpm add react-force-graph-2d"
vendorable: true
---

# React Force Graph 2D

React Canvas force-directed graphs with custom node drawing, labels and selection.

## Use it for

These entries use the 2D Canvas package and verified 2D source examples. The upstream project also has separate 3D/WebGL/VR/AR packages; do not substitute those APIs. Bound/warm up the simulation, map node/edge colors, provide readable selection details and stop animations/dispose on unmount.

Moods: technical, refined. Compare its chart form and treatment with the project’s existing components before adding another library.

## Install selected packages

```bash
pnpm add react-force-graph-2d
```

Choose versions compatible with the current project; do not change its framework, theme or UI system automatically. The command installs the packages, not a finished component or screen. Read the linked API/example and adapt it to actual data and design tokens.

## Starting options

- [Custom 2D graph nodes](https://vasturiano.github.io/react-force-graph/example/custom-node-shape/index-canvas.html) — Draw domain-specific node shapes on Canvas.
- [Labeled 2D graph nodes](https://vasturiano.github.io/react-force-graph/example/text-nodes/index-2d.html) — Readable Canvas labels for connected entities.
- [Highlighted graph neighborhoods](https://vasturiano.github.io/react-force-graph/example/highlight/) — Focus selected nodes and their connected links on a 2D Canvas.
- [Collision-aware network layout](https://vasturiano.github.io/react-force-graph/example/collision-detection/) — Avoid node overlap in a force-directed Canvas graph.
- [Responsive 2D network](https://vasturiano.github.io/react-force-graph/example/fit-to-canvas/) — Fit the network to a changing parent container.

## Machine access and provenance

- [Public documentation](https://github.com/vasturiano/react-force-graph).
- [Repository and license](https://github.com/vasturiano/react-force-graph).
- [Published package metadata](https://registry.npmjs.org/react-force-graph-2d/latest).
- Refresh with `pnpm sync react-force-graph` or `pnpm sync charts`, then `pnpm catalog`. Source inputs: `catalog/chart-libraries.json`. No vendor source is copied into this repo.

## Gotchas

These entries use the 2D Canvas package and verified 2D source examples. The upstream project also has separate 3D/WebGL/VR/AR packages; do not substitute those APIs. Bound/warm up the simulation, map node/edge colors, provide readable selection details and stop animations/dispose on unmount.

Required package metadata, audited 2026-10-19:

| Package | Version | Published peers |
| --- | --- | --- |
| `react-force-graph-2d` | `1.29.2` | react: * |

These are published peer ranges, not proof that a given combination builds in a consumer. Preserve units, missing-data behavior, readable labels and a keyboard/nonvisual alternative. Cancel simulations, animation loops, observers and subscriptions on unmount. Renderer tags describe library capabilities; individual examples can use a subset or require additional adapters.

## Verification and previews

Package names, free license metadata and public reference URLs were checked on 2026-10-19. This is not fresh-project runtime, browser, accessibility or performance verification of the upstream libraries. Local preview adapters are not added by this ingestion. External examples remain on their source sites; docs are not automatically embedded and no package is installed into the catalog app or consumer setup.
