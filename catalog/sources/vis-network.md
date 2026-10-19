---
slug: "vis-network"
name: "vis-network"
url: "https://visjs.github.io/vis-network/"
summary: "Interactive Canvas network diagrams with hierarchical layout, node styles and manipulation controls."
type: "npm"
access: "free"
license: "(Apache-2.0 OR MIT); preserve the upstream license and notices. See source-specific terms below."
stack: ["JavaScript", "canvas"]
install: "pnpm add vis-network vis-data"
vendorable: true
---

# vis-network

Interactive Canvas network diagrams with hierarchical layout, node styles and manipulation controls.

## Use it for

Dual Apache-2.0/MIT licensing; preserve notices for the option you use. Prefer the documented standalone import or satisfy the peer build dependencies, including vis-data. Bound the physics simulation, provide a sized parent and destroy Network/listeners on unmount. A graph editor still needs application-level validation, storage and permissions.

Moods: technical, refined. Compare its chart form and treatment with the project’s existing components before adding another library.

## Install selected packages

```bash
pnpm add vis-network vis-data
```

Choose versions compatible with the current project; do not change its framework, theme or UI system automatically. The command installs the packages, not a finished component or screen. Read the linked API/example and adapt it to actual data and design tokens.

## Starting options

- [Network diagram](https://visjs.github.io/vis-network/examples/network/basic_usage/standalone.html) — A basic interactive node-and-edge graph.
- [Hierarchical network](https://visjs.github.io/vis-network/examples/network/layout/hierarchicalLayout.html) — Arrange directed relationships in levels.
- [Styled network nodes](https://visjs.github.io/vis-network/examples/network/nodeStyles/groups.html) — Use distinct node styles for domain groups.
- [Neighborhood highlighting](https://visjs.github.io/vis-network/examples/network/exampleApplications/neighbourhoodHighlight.html) — Focus the connections around selected entities.
- [Editable network](https://visjs.github.io/vis-network/examples/network/other/manipulation.html) — Manipulate graph nodes and edges with application callbacks.

## Machine access and provenance

- [Public documentation](https://visjs.github.io/vis-network/).
- [Repository and license](https://github.com/visjs/vis-network).
- [Published package metadata](https://registry.npmjs.org/vis-network/latest).
- Refresh with `pnpm sync vis-network` or `pnpm sync charts`, then `pnpm catalog`. Source inputs: `catalog/chart-libraries.json`. No vendor source is copied into this repo.

## Gotchas

Dual Apache-2.0/MIT licensing; preserve notices for the option you use. Prefer the documented standalone import or satisfy the peer build dependencies, including vis-data. Bound the physics simulation, provide a sized parent and destroy Network/listeners on unmount. A graph editor still needs application-level validation, storage and permissions.

Required package metadata, audited 2026-10-19:

| Package | Version | Published peers |
| --- | --- | --- |
| `vis-network` | `10.1.2` | uuid: ^3.4.0 \|\| ^7.0.0 \|\| ^8.0.0 \|\| ^9.0.0 \|\| ^10.0.0 \|\| ^11.0.0 \|\| ^13.0.0 \|\| ^14.0.0; keycharm: ^0.2.0 \|\| ^0.3.0 \|\| ^0.4.0; vis-data: >=8.0.0; vis-util: >=6.0.0; @egjs/hammerjs: ^2.0.0; component-emitter: ^1.3.0 \|\| ^2.0.0 |
| `vis-data` | `8.0.5` | uuid: ^3.4.0 \|\| ^7.0.0 \|\| ^8.0.0 \|\| ^9.0.0 \|\| ^10.0.0 \|\| ^11.0.0 \|\| ^13.0.0 \|\| ^14.0.0; vis-util: >=6.0.0 |

These are published peer ranges, not proof that a given combination builds in a consumer. Preserve units, missing-data behavior, readable labels and a keyboard/nonvisual alternative. Cancel simulations, animation loops, observers and subscriptions on unmount. Renderer tags describe library capabilities; individual examples can use a subset or require additional adapters.

## Verification and previews

Package names, free license metadata and public reference URLs were checked on 2026-10-19. This is not fresh-project runtime, browser, accessibility or performance verification of the upstream libraries. Local preview adapters are not added by this ingestion. External examples remain on their source sites; docs are not automatically embedded and no package is installed into the catalog app or consumer setup.
