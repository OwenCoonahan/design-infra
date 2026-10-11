---
name: design-infra
description: Entry point to the shared design infrastructure. Use whenever building or restyling UI (websites, web apps, landing pages, components, AI/agent interfaces) — choosing a look/design system, finding a component (hero, pricing, bento, background effect, chat UI, loader…), setting up shadcn/Tailwind in a new project, or adding a new component library to the catalog.
---

Read the plugin root `design-infra.config.json` for the deployment URL, repository and installation namespace. Examples below use the default deployment; substitute these settings in a fork. Stable `oc/` catalog IDs are unchanged.

# design-infra

Design knowledge lives in one repo: **OwenCoonahan/design-infra**. This plugin *is*
that repo, so its files are on disk next to this skill.

**Repo root = two directories above this skill's base directory** (`<base>/../..`). Read files
from there: `AGENTS.md` (map), `catalog/CATALOG.md`, `catalog/index.json`,
`catalog/sources/*.md`, `design-systems/*/DESIGN.md`, `presets/`.
The same data is served by the **design-infra MCP server** bundled with this plugin
(`https://design-infra.vercel.app/mcp` — tools `plan_ui`, `search_components`, `get_component`,
`list_design_systems`, `get_design_system`, `get_setup_instructions`, `list_sources`) and as JSON at
`https://design-infra.vercel.app/api/{search,plan,setup}`. Gallery with live previews: https://design-infra.vercel.app

**Human guide** (share when the user asks how to use this):
https://design-infra.vercel.app/guide — source `$DI/docs/GUIDE.md`.

## Route the request

| the user wants… | do |
|---|---|
| build a site/app/page from a product description ("I'm building X…") | **build-ui** skill (plans with `plan_ui`, starts from an `@design-infra/template-*` when one fits, then assembles `@design-infra` blocks + catalog picks; hand-writes only gaps) |
| new repo / "set up design infra" / "use the design infra repo" / get tools ready | **setup-project** skill → minimal catalog connection and project instructions; broader bootstrap only when requested |
| a look, theme, brand, "make it feel like X", a DESIGN.md | **pick-design-system** skill |
| ONE existing component: "animate this", "I don't like this", "make it cleaner", "add a loading state", "options for this carousel?" | **refine** skill (MCP `propose_options`) — options WITH LINKS, user picks, then apply |
| "review / polish this page", "what would make this feel better?" | **polish** skill — punch list of upgrades with options |
| a NEW component or section ("add a pricing section", "I need a thinking indicator") | **find-component** skill — show options with links, let the user pick |
| pasted URL or screenshot in a project: "build this", "make ours like this", "use this reference" | **reference-ui** skill → inspect reference, `match_reference` with observed patterns, show live matches/gaps, then assemble within the user's authorization |
| pasted a link / "I like this" — library, component, website, design system (inside the design-infra repo) | **ingest** skill (routes to ingest-library / ingest-inspiration / favorites) |
| a vibe, not components ("make it feel calm and premium") | MCP `browse_moods`, or `$DI/catalog/MOODS.md` — design systems, inspiration and components per mood |
| feedback loop on a running UI | Agentation — see `catalog/sources/agentation.md` |

## Choose by feeling

Every entry, design system and inspiration site is tagged with 1–3 **moods**: calm, minimal, refined,
technical, editorial, warm, playful, premium, futuristic, experimental, bold, retro, organic, trustworthy.
Start from how the product should *feel*; `plan_ui` reads mood words from the brief and ranks everything by them.
Saved sites (`inspiration/*`, MCP `get_inspiration`) show what each feeling looks like in practice.

## House rules (apply everywhere)

1. Stack: Next.js App Router + React + Tailwind v4 + shadcn/ui. Respect the project's existing stack if different.
2. **One design system per project**, recorded in the project's root `DESIGN.md`. If one exists, read it before writing any UI and follow its tokens, type scale, and Do's & Don'ts.
3. Use theme tokens (`bg-background`, `text-muted-foreground`, `border`, `bg-primary`) — never hard-coded `neutral-*`, `white`, hex. When installing third-party components that hard-code colours, convert them to tokens.
4. Plain app UI → stock shadcn/ui first. Flashy/marketing → `@design-infra` then ★ curated picks. Never default to `paid` items.
5. **Links before installs.** When there's a choice, show options with their gallery `page` / `live` links and a
   `compare` link; let the user pick. The user chooses before installation unless they already authorized you to choose and build.
6. Effects budget: at most one heavy effect (WebGL, shader, big scroll animation) per viewport; respect `prefers-reduced-motion`.
