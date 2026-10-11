---
name: ingest-inspiration
description: Turn a website or app the contributors like into a reusable inspiration entry in design-infra — capture screenshots and extracted design data (fonts, palette, radii, CSS tokens), analyse its feel and layout patterns, tag moods, map each pattern to installable catalog components, and optionally build @design-infra recreations or a DESIGN.md from it. Use inside the design-infra repo when the user shares a site he likes.
---

Read the plugin root `design-infra.config.json` for the deployment URL, repository and installation namespace. Examples below use the default deployment; substitute these settings in a fork. Stable `oc/` catalog IDs are unchanged.

# ingest-inspiration — a site the contributors like → reusable design knowledge

Reference example: `inspiration/linear/README.md`. Schema: `Inspiration` in `lib/catalog/schema.ts`.

## 1. Capture

```bash
pnpm capture <url> [--slug <name>]
```

Writes private `.context/inspiration/<slug>/{hero,full,mobile}.webp` and `inspiration/<slug>/capture.json` (fonts by role,
type scale, palette by area/text weight, borders, radii, shadows, `:root` CSS variables, h1/h2 outline, motion
and stack signals). If the site blocks headless Chrome or shows a cookie wall, retry with `--wait 6000`; for
app-only products, use screenshots the user provides. Keep captured imagery in `.context/`; published inspiration is link-only unless redistribution rights are established. Never infer missing sections from blank scroll-animation captures; inspect them live.

## 2. Look, then analyse

Read the three webp images (Read tool) and `capture.json`. Write `inspiration/<slug>/README.md`:

- **Front matter** — `slug`, `name`, `url`, `type`, `summary` (one sentence: what the page is + its signature move),
  `likes` (the shared reason, in his words if he gave one), `moods` (1–3 from `lib/catalog/moods.ts` — choose by
  how it *feels*, not what it sells), `categories` (patterns worth taking), `tags`, `related` (catalog ids that
  reproduce its patterns — verify each with `pnpm lookup` or `jq` on `catalog/index.json`), `added` (today).
- **Feel** — the emotional read: density, restraint vs. energy, how colour and motion are used.
- **Palette & type** — extracted values with roles (canvas, surfaces, text tiers, accent), font families/weights,
  scale, radii. Name Google-Font equivalents for any proprietary fonts (e.g. Berkeley Mono → JetBrains Mono).
- **Layout & patterns** — a table: pattern → what they do → how to reproduce it (catalog ids, `@design-infra` blocks).
- **Motion** — what animates and how (durations/easing feel), and matching catalog/transitions entries.
- **How to apply** — project structure, observed section order and reusable rules. Separate marketing, editorial, data, docs and app structures from visual feeling. Preserve existing project identity; derive new design rules from a reviewed composition rather than auto-selecting a theme preset.

## 3. Fill gaps (judgement)

- A signature pattern with **no good catalog match** that the user clearly likes → build an original, theme-aware
  `@design-infra` block reproducing the *pattern* (never copy their code/assets), add it to `related`, and mention it.
- If the user wants **this look** for a project, or it's distinctive enough to reuse → derive
  `design-systems/<slug>/DESIGN.md` from the extracted tokens (CONVENTIONS.md; Google Fonts only; `moods:`).
- Strong single components he calls out → `catalog/favorites.json`.

## 4. Finish

```bash
pnpm catalog && pnpm check     # validates front matter + related ids; updates catalog/MOODS.md
```

Commit (`inspiration/<slug>/`, any new blocks; never private screenshots). Report: moods, the 3–5 most
reusable patterns and what they map to, anything built, and suggested next steps.
