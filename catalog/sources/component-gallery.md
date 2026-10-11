---
slug: component-gallery
name: The Component Gallery
url: https://component.gallery/
summary: Reference catalogue of 60 component types with real examples from 95 design systems (Polaris, Carbon, GOV.UK, Atlassian…). No code — for naming, anatomy, and accessibility research.
type: reference
access: free
license: Reference site (links out to each design system); no content licence stated.
stack: []
install: n/a — reference only
vendorable: false
---

# The Component Gallery (by Iain Bean)

**Use it for:** deciding *what* a component should be before picking an implementation:
what it's usually called, its aliases, anatomy, states, and how mature design systems handle
accessibility. Our category taxonomy (`catalog/categories.md`) uses its names.

## How to use it from an agent

- Component page: `https://component.gallery/components/<slug>/` (e.g. `accordion`, `combobox`,
  `segmented-control`, `skip-link`, `empty-state`, `stepper`, `toast`, `tree-view`).
- Each page lists aliases, a description, and 5–120 links to real implementations.
- Workflow: *"look up segmented-control on component.gallery, summarise the a11y requirements,
  then build it with shadcn ToggleGroup in our theme."*

No API / llms.txt / JSON; fetch the HTML page. Pattern notes we've distilled live in `catalog/patterns/`.
