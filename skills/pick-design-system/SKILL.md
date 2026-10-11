---
name: pick-design-system
description: Choose and install a design system (DESIGN.md + shadcn theme tokens + fonts) from the shared design-infra, or adapt one to a brand. Use for "pick a design system", "make it look like Linear / editorial / brutalist / glassy", "apply our theme", "write a DESIGN.md", or restyling a project.
---

Read the plugin root `design-infra.config.json` for the deployment URL, repository and installation namespace. Examples below use the default deployment; substitute these settings in a fork. Stable `oc/` catalog IDs are unchanged.

# pick-design-system

Repo root of design-infra = `<this skill's base dir>/../..` (`$DI`).

## 1. Choose

Read `$DI/design-systems/README.md` (comparison table) — not every DESIGN.md. Match the brief:
product type, audience, density, mood. If the user named a vibe, map it; if ambiguous, offer
the 2 best fits with one line each and ask. Then read the chosen `$DI/design-systems/<slug>/DESIGN.md` in full.

## 2. Install (project already has shadcn + `@design-infra` registry — else run setup-project first)

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
