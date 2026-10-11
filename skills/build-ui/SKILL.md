---
name: build-ui
description: Build a website, web app, landing page, dashboard or AI interface from a product brief by assembling it from design-infra (design system + registry blocks + curated components) instead of writing UI from scratch. Use whenever the user describes a product/UI to build ("I'm building X, it needs Y, it should feel like Z"), starts a new frontend, or asks for a new page/screen.
---

Read the plugin root `design-infra.config.json` for the deployment URL, repository and installation namespace. Examples below use the default deployment; substitute these settings in a fork. Stable `oc/` catalog IDs are unchanged.

# build-ui — brief → assembled UI

Goal: ship a polished UI fast by **installing** proven pieces. Writing a component from scratch is the
last resort, only for genuine gaps. Design-infra repo root = `<this skill's base dir>/../..` (`$DI`).

## 0. Tools (use the first that works)

1. **MCP** `design-infra` (bundled with the plugin; `https://design-infra.vercel.app/mcp`): `plan_ui`, `search_components`, `get_component`, `list_design_systems`, `get_design_system`, `get_setup_instructions`.
2. **HTTP**: `curl -s "https://design-infra.vercel.app/api/plan?brief=<urlencoded>"`, `/api/search?q=…&category=…`, `/api/setup`.
3. **Files**: `$DI/catalog/CATALOG.md`, `$DI/catalog/index.json`, `$DI/design-systems/README.md`.

## Reference URL or screenshot

When a user asks to recreate a linked page or attached image, follow **reference-ui** first
(https://design-infra.vercel.app/reference/raw). Inspect it, preserve its observed section order, and match
patterns with `match_reference`. Do not feed an uninspected URL into `plan_ui` and substitute a generic recipe.
Use the matched parts as the plan; adapt details the catalog does not cover.

## 1. Brief

Extract: product + audience + primary tasks, page types (landing / dashboard / data / editorial / docs / commerce / ai-app / auth-onboarding / portfolio), must-have
sections, references ("like Linear"), light/dark — and above all **how it should feel** (moods: calm, minimal,
refined, technical, editorial, warm, playful, premium, futuristic, experimental, bold, retro, organic,
trustworthy). Infer structure from the existing project and brief when possible. Ask one compact question only if an essential task or requirement is missing. Choose structure separately from feeling: a clean data product still needs filters, charts, records and data states. "Clean" is a direction for hierarchy and restraint, not permission to install a preset theme.

## 2. Plan and choose

Call `plan_ui` with the brief (pass `moods` if you settled them). For each section include the top picks' `page`
links and one compare link (`https://design-infra.vercel.app/compare?ids=…&theme=…`) so the user can look before you
build. For design choices, show 3–5 directions with gallery/live links and a comparison, recommend one with a reason,
and wait for the user's pick. If they already selected components or explicitly asked you to choose and build, proceed
within that authorization. It returns detected moods, matching
**inspiration** sites (read them with `get_inspiration` — they show what the feeling looks like and
which components reproduce it), legacy theme options and per-section picks. No theme is recommended automatically. Inspect the relevant live references and compose parts around the project's content. Write a short plan:

| page | section | pick (id) | why |
|---|---|---|---|

Each section also carries `references` (inspiration galleries with exact URLs) — when the user wants ideas for a section
or no pick fits, offer them: "see how others do it: <links>" (MCP `find_references` for any other pattern).

Rules for picking per section:
- A starter template is optional when its structure fits the actual task; inspect it before adopting it:
  `@design-infra/template-landing` (→ `app/page.tsx`), `@design-infra/template-saas-dashboard` (→ `app/dashboard/page.tsx`),
  `@design-infra/template-ai-chat` (→ `app/chat/page.tsx`). Use `--overwrite` only for a fresh starter page or when replacing that page is explicitly authorized; don't overwrite an existing project page during component work.
  Each template pulls its `@design-infra` blocks into `components/` — edit those for product copy.
- Prefer `oc/*` → ★ curated + `themeAware` → other free picks. `key`/`metered` only if nothing free fits (say so). Never `paid`.
- Respect the project's `DESIGN.md` "Pairs well with" list and Do's/Don'ts.
- Plain app UI (dialog, select, form, table, sidebar, chart) → stock shadcn/ui (`npx shadcn add sidebar chart table …`) or shadcn blocks (`dashboard-01`, `sidebar-07`, `login-03`).
- Max one heavy effect (WebGL/shader/scroll-jacking) per viewport.

## 3. Set up (once per project)

Follow the **setup-project** skill to connect the catalog and initialize component tooling when needed. Preserve an existing DESIGN.md and brand. For an explicitly requested new design direction, build a reference-grounded composition and extract its approved typography, spacing, color, components and motion into DESIGN.md. Follow **pick-design-system**; the current four theme presets remain legacy options only when explicitly selected.

## 4. Assemble (after the user has chosen or authorized you to choose)

For each section in order:
1. `get_component <id>` → read notes + source gotchas.
2. Run its `install` command (batch several shadcn installs in one `pnpm dlx shadcn@latest add a b c -y`).
3. Adapt: real product copy (never lorem), the product's nouns and numbers; convert hard-coded colours on non-theme-aware
   picks to tokens (`bg-card`, `text-muted-foreground`, `border`, `bg-primary`, `color-mix(in oklch, var(--primary) N%, transparent)`);
   headings `font-heading font-headline`.
4. Compose pages in `app/` with plain imports from `@/components/...`.

**Gap?** Search again with different words (`search_components`), check shadcn blocks, then `transitions` recipes for motion.
Only then write a new component — following DESIGN.md tokens — and note it as a gap.

## 5. Verify

- `pnpm build` passes; `pnpm dev` and look at every page (screenshot if you can) at desktop + mobile widths, light + dark if the system has both.
- Contrast: text on `bg-primary` uses `text-primary-foreground`; never put `text-primary` on the background in systems whose primary is a fill colour (e.g. brutalist-mono acid yellow).
- Optional: Agentation (`pnpm add -D agentation`) so the user can click-annotate fixes.

## 6. Report

Table of section → component id → source, what you adapted, the gaps you hand-built, and suggestions:
gaps that would be reusable should be promoted to design-infra as `@design-infra` blocks (tell the user; in the design-infra repo
that's `registry/oc/blocks/` — see its AGENTS.md).
