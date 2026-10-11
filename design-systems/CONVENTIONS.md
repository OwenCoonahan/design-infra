# DESIGN.md conventions (design-infra flavour)

Every design system here is a single `design-systems/<slug>/DESIGN.md` written in the
[Google DESIGN.md format](https://github.com/google-labs-code/design.md) (`version: alpha`).
On top of the spec we fix a few **token names** so `pnpm tokens` can turn any DESIGN.md
into a shadcn/Tailwind v4 theme without guesswork.

Run `pnpm tokens` after editing; it regenerates `theme.css`, the registry item, and the
gallery preview CSS. `pnpm check` lints every DESIGN.md with `@google/design.md lint`.

## Front matter

```yaml
---
version: alpha
name: Linear Dark            # display name
moods: [technical, refined, premium]   # 1–3 from lib/catalog/moods.ts — how it should feel
motion: quiet                # still | quiet | lively | cinematic — see design-systems/MOTION.md
description: One-line mood + best-for.
colors: { ... }              # see below
typography: { ... }          # see below
rounded: { ... }             # see below
spacing: { ... }             # documentation only (not exported)
components: { ... }          # optional, spec-style component tokens
---
```

## Colors → shadcn CSS variables

Colors are the **default-mode** palette (what `:root` gets). Any key that matches a shadcn
variable is exported 1:1. Prefix a key with `dark-` to set the `.dark` value; if a system
defines no `dark-*` keys, `.dark` reuses the default palette (single-mode system).

Required (default mode):

| token | role |
|---|---|
| `background`, `foreground` | page canvas + body text |
| `card`, `card-foreground` | raised surfaces |
| `popover`, `popover-foreground` | menus, popovers |
| `primary`, `primary-foreground` | the one main action colour |
| `secondary`, `secondary-foreground` | secondary buttons/chips |
| `muted`, `muted-foreground` | subdued surfaces, captions |
| `accent`, `accent-foreground` | hover / selected rows |
| `destructive` | errors, delete |
| `border`, `input`, `ring` | hairlines, field borders, focus ring |

Optional: `chart-1`…`chart-5`, `sidebar*` (same names as shadcn), and any extra brand
colours (e.g. `brand`, `highlight`). Extra keys become CSS variables **and** Tailwind colours
(`bg-highlight`, `text-brand`).

Use hex (`#RRGGBB`) or `oklch()`; keep text/background pairs ≥ 4.5:1 (the linter checks).

## Typography → fonts + text scale

Fonts must be **Google Fonts** (installed via `next/font/google`). Font roles come from:

| token | exported as |
|---|---|
| `body-md.fontFamily` | `--font-sans` |
| `headline-lg.fontFamily` | `--font-heading` |
| `mono.fontFamily` | `--font-mono` |

Required levels: `display`, `headline-lg`, `headline-md`, `body-lg`, `body-md`, `body-sm`,
`label-md`, `label-sm`, `mono`. Every level becomes a Tailwind text utility
(`text-display`, `text-headline-lg`, …) carrying size, line-height, letter-spacing, weight.

## Rounded → radius

`rounded.lg` → `--radius` (shadcn derives sm/md/xl from it). Also define `none`, `sm`,
`md`, `xl`, `full` for documentation.

## Body sections

Use the spec's section order: Overview, Colors, Typography, Layout, Elevation & Depth,
Shapes, Components, Do's and Don'ts. Add a final `## Agent Prompt` section: a short
paragraph an agent can paste into its context to stay on-brand (component library picks,
motion level, density). Also add `## Pairs well with` listing catalog ids (e.g.
`aceternity/spotlight-new`, `oc/hero-spotlight`) that suit the mood.

## Motion

Every DESIGN.md declares a **motion language** in front matter (`motion: still|quiet|lively|cinematic`,
defined in [MOTION.md](./MOTION.md)) and should have a `## Motion` body section with the system's durations,
easing and what animates. `propose_options` caps animation intensity by it, so a "quiet" project is never
offered shader backgrounds. When Owen picks an animation for one component in a project, record the choice in
that project's DESIGN.md `## Motion` section so later components animate consistently.
