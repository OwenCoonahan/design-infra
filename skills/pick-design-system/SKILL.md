---
name: pick-design-system
description: Develop a design system from inspected references and a working component composition, preserving an existing brand where present. Document typography, spacing, color, components and motion in DESIGN.md. Existing theme presets are optional only when explicitly selected. Use for choosing a visual direction, writing DESIGN.md, or restyling a project.
---

Read the plugin root `design-infra.config.json` for the deployment URL, repository and installation namespace. Examples below use the default deployment; substitute these settings in a fork. Stable `oc/` catalog IDs are unchanged.

# pick-design-system

Repo root of design-infra = `<this skill's base dir>/../..` (`$DI`).

## 1. Choose

Read the project's existing DESIGN.md and UI first. Preserve its identity unless a new direction is requested.
Choose the project structure from its purpose, audience and tasks separately from its visual feeling.
Inspect real website references and catalog component demos; build a coherent composition with realistic content,
then derive typography, spacing, surfaces, color, density, component states and motion rules from it.
Record the source references, which choices were adapted, and how the rules work on desktop and mobile.

The four existing presets in `$DI/design-systems/README.md` are **legacy options**, not default answers to
"clean", "sharp" or other mood words. Install one only if the user explicitly selected that preset.
If they authorized you to choose and build, proceed with the reference-grounded composition without asking for another style approval.

## 2. Install an explicitly selected legacy preset (optional)

```bash
pnpm dlx shadcn@latest add @design-infra/theme-<slug>
```

This merges the colour/radius tokens into `globals.css` (light + dark), adds the text-scale
utilities (`text-display`, `text-headline-lg`, … `text-label-sm`), installs the Google fonts as
`--font-sans` / `--font-heading` / `--font-mono`, and writes **`DESIGN.md` to the project root**.

No shadcn CLI? Copy `$DI/design-systems/<slug>/theme.css` into `globals.css` and the DESIGN.md to the root; load fonts with `next/font/google`.

## 3. Customise for a brand (optional)

Copy the closest DESIGN.md, change `name`, the colour tokens (keep the required shadcn names —
see `$DI/design-systems/CONVENTIONS.md`), fonts (Google Fonts only), and rewrite Overview +
Do's/Don'ts. Lint: `npx @google/design.md lint DESIGN.md`. If it's reusable, add it to design-infra
(`design-systems/<new-slug>/DESIGN.md`, then `pnpm tokens && pnpm catalog`) so other projects get it.

## 4. Apply

- Headings use `font-heading`; body inherits `font-sans`; code/metadata `font-mono`.
- Follow the system's **Agent Prompt** and **Pairs well with** sections when choosing components.
- Verify: `pnpm dlx shadcn@latest add @design-infra/theme-preview`, render `<ThemePreview />`, check both modes.
