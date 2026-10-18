---
slug: "mermaid"
name: "Mermaid"
url: "https://mermaid.js.org/"
summary: "Text-defined diagrams for architecture, relationships and documentation."
type: "npm"
access: "free"
license: "MIT; retain the upstream license and notices. Hosted commercial products/examples are separate."
stack: ["JavaScript", "svg"]
install: "pnpm add mermaid"
vendorable: true
---

# Mermaid

Text-defined diagrams for architecture, relationships and documentation.

## Use it well

Use text diagrams for explanations, not as a substitute for a data exploration engine. Keep strict rendering security, verify labels and provide the underlying readable description.

Install one suitable engine for the task. Existing shadcn charts remain useful for conventional React dashboards. Chart engines and integration recipes do not become complete application components just by installing their npm package.

## Install

```bash
pnpm add mermaid
```

Check the consuming project's installed versions first; preserve its stack and theme. Renderer support is a library capability: alternate renderers or plugins can require additional dependencies. Provide real data, units, loading/empty/error states and an accessible table or explanation.

## Public references

- Documentation: https://mermaid.js.org/
- Repository and license: https://github.com/mermaid-js/mermaid
- Package metadata: https://registry.npmjs.org/mermaid/latest

## Starting patterns

- [Flowchart](https://mermaid.js.org/syntax/flowchart.html) — Explain a process or decision flow. Install: `pnpm add mermaid`.
- [Sequence diagram](https://mermaid.js.org/syntax/sequenceDiagram.html) — Explain messages between participants. Install: `pnpm add mermaid`.
- [Class diagram](https://mermaid.js.org/syntax/classDiagram.html) — Explain model structure and relationships. Install: `pnpm add mermaid`.
- [Entity relationship diagram](https://mermaid.js.org/syntax/entityRelationshipDiagram.html) — Explain data entities and cardinalities. Install: `pnpm add mermaid`.
- [State diagram](https://mermaid.js.org/syntax/stateDiagram.html) — Explain state transitions. Install: `pnpm add mermaid`.

## Verification and previews

Public package metadata and documentation links audited 2026-10-18. Initial package version: `mermaid@12.2.0`. The primary package declares no npm peer dependencies.

This is a metadata/reference audit, not a fresh-project runtime, browser, accessibility or performance verification. Generated entries retain current package metadata after sync. External examples stay on the source site; hosted adapters require separate implementation, attribution and browser checks.

Refresh this source with `pnpm sync mermaid` or the full group with `pnpm sync charts`, then `pnpm catalog`. Curated inputs live in `catalog/chart-libraries.json`; npm metadata is read without installing packages. Unknown or changed licensing fails sync for review.
