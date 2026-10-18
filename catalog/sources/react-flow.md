---
slug: "react-flow"
name: "React Flow"
url: "https://reactflow.dev/"
summary: "Editable node-and-edge interfaces for workflows and application builders."
type: "npm"
access: "free"
license: "MIT; retain the upstream license and notices. Hosted commercial products/examples are separate."
stack: ["React", "JavaScript", "dom", "svg"]
install: "pnpm add @xyflow/react"
vendorable: true
---

# React Flow

Editable node-and-edge interfaces for workflows and application builders.

## Use it well

Import @xyflow/react/dist/style.css and size the parent. The MIT core is free; Pro examples/templates are a separate offering. Layout engines are optional dependencies, and persistence belongs to your app.

Install one suitable engine for the task. Existing shadcn charts remain useful for conventional React dashboards. Chart engines and integration recipes do not become complete application components just by installing their npm package.

## Install

```bash
pnpm add @xyflow/react
```

Check the consuming project's installed versions first; preserve its stack and theme. Renderer support is a library capability: alternate renderers or plugins can require additional dependencies. Provide real data, units, loading/empty/error states and an accessible table or explanation.

## Public references

- Documentation: https://reactflow.dev/
- Repository and license: https://github.com/xyflow/xyflow
- Package metadata: https://registry.npmjs.org/@xyflow%2Freact/latest

## Starting patterns

- [Custom workflow nodes](https://reactflow.dev/examples/nodes/custom-node) — Represent domain-specific workflow steps. Install: `pnpm add @xyflow/react`.
- [Node drag handle](https://reactflow.dev/examples/nodes/drag-handle) — Separate dragging from controls inside a node. Install: `pnpm add @xyflow/react`.
- [Custom workflow edges](https://reactflow.dev/examples/edges/custom-edges) — Express a relationship with its own edge rendering. Install: `pnpm add @xyflow/react`.
- [Save and restore](https://reactflow.dev/examples/interaction/save-and-restore) — Persist and restore the workflow in application storage. Install: `pnpm add @xyflow/react`.
- [Themed workflow](https://reactflow.dev/examples/styling/dark-mode) — Adapt node and edge styling to the project. Install: `pnpm add @xyflow/react`.

## Verification and previews

Public package metadata and documentation links audited 2026-10-18. Initial package version: `@xyflow/react@12.12.0`. Published peer requirements: `react`: `>=17`; `react-dom`: `>=17`; `@types/react`: `>=17`; `@types/react-dom`: `>=17`.

This is a metadata/reference audit, not a fresh-project runtime, browser, accessibility or performance verification. Generated entries retain current package metadata after sync. External examples stay on the source site; hosted adapters require separate implementation, attribution and browser checks.

Refresh this source with `pnpm sync react-flow` or the full group with `pnpm sync charts`, then `pnpm catalog`. Curated inputs live in `catalog/chart-libraries.json`; npm metadata is read without installing packages. Unknown or changed licensing fails sync for review.
