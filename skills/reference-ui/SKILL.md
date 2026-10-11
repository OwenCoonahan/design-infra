---
name: reference-ui
description: Recreate or adapt a website, page, or component from a pasted URL or screenshot inside a project, matching observed patterns to design-infra components. Use for "build this", "make ours like this", or "use this reference" with a link/image. Catalog ingestion is a separate workflow.
---

Read the plugin root `design-infra.config.json` for the deployment URL, repository and installation namespace. Examples below use the default deployment; substitute these settings in a fork. Stable `oc/` catalog IDs are unchanged.

# Reference → reusable UI

Read `<this skill's base dir>/../../docs/REFERENCE.md`, also served at
https://design-infra.vercel.app/reference/raw. Follow its reference workflow in the current project.

Inspect the reference with your browser/image tools before matching it. Describe observed patterns, then use
MCP `match_reference` or `POST https://design-infra.vercel.app/api/reference` to find reusable components.
The matching tool accepts observations; it does not fetch arbitrary websites or inspect images.

Preserve the user's scope: one referenced component changes that component; a page reference retains the
observed section order. Show live options and recommend a fit when the user wants to choose. Honor prior
authorization to choose and build. Install/adapt the chosen parts, identify gaps, and compare the result to
the reference at desktop/mobile widths. Preserve the current brand unless the user requests the source look.

For replacing an existing section without a supplied reference, follow **refine** (`propose_options`).
