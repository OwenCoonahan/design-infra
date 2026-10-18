---
slug: "sigma"
name: "Sigma.js"
url: "https://www.sigmajs.org/"
summary: "Interactive network rendering with Graphology data structures."
type: "npm"
access: "free"
license: "MIT; retain the upstream license and notices. Hosted commercial products/examples are separate."
stack: ["JavaScript", "webgl"]
install: "pnpm add sigma graphology"
vendorable: true
---

# Sigma.js

Interactive network rendering with Graphology data structures.

## Use it well

Requires a working WebGL context and a sized browser container. Graphology stores the network; layouts, labels and application interactions need deliberate setup. Clean up rendering resources on unmount.

Install one suitable engine for the task. Existing shadcn charts remain useful for conventional React dashboards. Chart engines and integration recipes do not become complete application components just by installing their npm package.

## Install

```bash
pnpm add sigma graphology
```

Check the consuming project's installed versions first; preserve its stack and theme. Renderer support is a library capability: alternate renderers or plugins can require additional dependencies. Provide real data, units, loading/empty/error states and an accessible table or explanation.

## Public references

- Documentation: https://www.sigmajs.org/
- Repository and license: https://github.com/jacomyal/sigma.js
- Package metadata: https://registry.npmjs.org/sigma/latest

## Starting patterns

- [Graph rendering](https://www.sigmajs.org/docs/quickstart/) — Render a graphology network. Install: `pnpm add sigma graphology`.
- [Network events](https://www.sigmajs.org/docs/advanced/events/) — Connect graph interaction to application state. Install: `pnpm add sigma graphology`.
- [Rendering settings](https://www.sigmajs.org/docs/advanced/customization/) — Control labels, nodes and edges. Install: `pnpm add sigma graphology`.
- [Renderer lifecycle](https://www.sigmajs.org/docs/advanced/lifecycle/) — Manage changes and resource cleanup. Install: `pnpm add sigma graphology`.
- [Custom graph rendering](https://www.sigmajs.org/docs/advanced/customization/) — Extend node and edge presentation. Install: `pnpm add sigma graphology`.

## Verification and previews

Public package metadata and documentation links audited 2026-10-18. Initial package version: `sigma@4.0.3`. The primary package declares no npm peer dependencies.

This is a metadata/reference audit, not a fresh-project runtime, browser, accessibility or performance verification. Generated entries retain current package metadata after sync. External examples stay on the source site; hosted adapters require separate implementation, attribution and browser checks.

Refresh this source with `pnpm sync sigma` or the full group with `pnpm sync charts`, then `pnpm catalog`. Curated inputs live in `catalog/chart-libraries.json`; npm metadata is read without installing packages. Unknown or changed licensing fails sync for review.
