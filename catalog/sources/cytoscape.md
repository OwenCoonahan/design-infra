---
slug: "cytoscape"
name: "Cytoscape.js"
url: "https://js.cytoscape.org/"
summary: "Relationship graph visualization and graph analysis with a JavaScript API."
type: "npm"
access: "free"
license: "MIT; retain the upstream license and notices. Hosted commercial products/examples are separate."
stack: ["JavaScript", "canvas"]
install: "pnpm add cytoscape"
vendorable: true
---

# Cytoscape.js

Relationship graph visualization and graph analysis with a JavaScript API.

## Use it well

Good for connected entities rather than numeric dashboard axes. Destroy the instance on cleanup, review extensions individually and preserve a useful nonvisual representation of relationships.

Install one suitable engine for the task. Existing shadcn charts remain useful for conventional React dashboards. Chart engines and integration recipes do not become complete application components just by installing their npm package.

## Install

```bash
pnpm add cytoscape
```

Check the consuming project's installed versions first; preserve its stack and theme. Renderer support is a library capability: alternate renderers or plugins can require additional dependencies. Provide real data, units, loading/empty/error states and an accessible table or explanation.

## Public references

- Documentation: https://js.cytoscape.org/
- Repository and license: https://github.com/cytoscape/cytoscape.js
- Package metadata: https://registry.npmjs.org/cytoscape/latest

## Starting patterns

- [Graph layouts](https://js.cytoscape.org/#layouts) — Organize nodes using the layout that fits the relationship. Install: `pnpm add cytoscape`.
- [Graph selection](https://js.cytoscape.org/#collection/selection) — Inspect selected connected entities. Install: `pnpm add cytoscape`.
- [Graph interaction](https://js.cytoscape.org/#events) — Connect node and edge events to application behavior. Install: `pnpm add cytoscape`.
- [Neighborhood traversal](https://js.cytoscape.org/#collection/traversing) — Inspect neighbors and paths through a network. Install: `pnpm add cytoscape`.
- [Graph styling](https://js.cytoscape.org/#style) — Encode relationship attributes with explicit visual rules. Install: `pnpm add cytoscape`.

## Verification and previews

Public package metadata and documentation links audited 2026-10-18. Initial package version: `cytoscape@3.34.4`. The primary package declares no npm peer dependencies.

This is a metadata/reference audit, not a fresh-project runtime, browser, accessibility or performance verification. Generated entries retain current package metadata after sync. External examples stay on the source site; hosted adapters require separate implementation, attribution and browser checks.

Refresh this source with `pnpm sync cytoscape` or the full group with `pnpm sync charts`, then `pnpm catalog`. Curated inputs live in `catalog/chart-libraries.json`; npm metadata is read without installing packages. Unknown or changed licensing fails sync for review.
