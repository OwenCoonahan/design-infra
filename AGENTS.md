# design-infra — agent guide

This repo is shared **design infrastructure**: the single place other repos (and their agents)
go for design systems, component libraries, and UI know-how. It is three things at once:

1. **A knowledge base** — markdown + JSON any agent can read (`catalog/`, `design-systems/`).
2. **A shadcn registry** (`@design-infra`, legacy alias `@oc`) — themes and theme-aware blocks, served from the deployed site at `/r/{name}.json`.
3. **A Claude Code plugin** — `skills/` routes UI work in *other* repos back to this content.

The Next.js app (`app/`) is the browsable gallery + registry host.

## How this repo grows

Owen keeps pasting things he finds — component libraries, single components, websites he likes, design
systems. **Every paste should leave the repo richer**: entries with moods, favorites, inspiration analyses,
`@oc` recreations, design systems. Entry point: `skills/ingest/SKILL.md` (it routes). Good design compounds
here; nothing should be one-off.

The organising axis is **feeling** (moods, `lib/catalog/moods.ts`): calm, minimal, refined, technical,
editorial, warm, playful, premium, futuristic, experimental, bold, retro, organic, trustworthy. Design systems,
inspiration sites and every catalog entry carry 1–3 moods; `plan_ui` reads them from briefs.

Human-facing usage guide (project workspaces, daily loop, cheat sheet): `docs/GUIDE.md` → `/guide`. Keep it true
when workflows change.

## Where to find things

| question | file |
|---|---|
| "what feels calm / premium / playful…?" | `catalog/MOODS.md` (design systems, inspiration, top picks per mood) |
| sites Owen likes, analysed | `inspiration/<slug>/README.md` (+ `capture.json`, private screenshots in `.context/inspiration/<slug>/`) |
| "where do I look for ideas on navbars / pricing / animated landings…?" (inspiration galleries, exact URLs, etiquette) | `catalog/REFERENCES.md` (source: `catalog/references.json`, ranking `lib/catalog/references.ts`) |
| "what component should I use for X?" | `catalog/CATALOG.md` (grep it), `catalog/index.json` (jq it), `catalog/categories.md` |
| "make THIS animate / nicer" — how does it move, how is it applied? | `motion` / `integration` / `appliesTo` / `live` on every entry (rules: `lib/catalog/tags.ts`); `pnpm lookup "card" --trigger hover --intensity subtle --integration wrapper` |
| "how do I install / what are the gotchas of library Y?" | `catalog/sources/<slug>.md` |
| links already audited and deliberately NOT added (and why) | `catalog/SKIPPED.md` |
| "what design systems exist, which fits?" | `design-systems/README.md`, then `design-systems/<slug>/DESIGN.md` |
| DESIGN.md token rules | `design-systems/CONVENTIONS.md` |
| what to install in a project, ranked (tiers 1–4), and why | `catalog/TOOLCHAIN.md` (source: `catalog/toolchain.json`) |
| registries a consumer should configure | `presets/components.registries.json` (generated from the toolchain) |
| our own components | `registry/oc/blocks/*`, manifest `registry/oc/blocks/registry.json` |
| starter pages composed of blocks | `registry/oc/templates/<name>/page.tsx`, manifest `registry/oc/templates/registry.json` |
| how to use a pattern well | `catalog/patterns/*.md` |
| menu of upgrade directions per component type (button, carousel, loader…) | `catalog/playbooks/<component>.md` |
| what Owen passed on (taste, negative) | `catalog/dislikes.json` (positive: `catalog/favorites.json`) |
| motion languages (still / quiet / lively / cinematic) | `design-systems/MOTION.md`; each DESIGN.md has `motion:`; values in `lib/catalog/motion.ts` → theme CSS tokens + generated `@oc/motion-presets` (`registry/oc/lib/`) |
| skills shipped to other repos | `skills/*/SKILL.md` |

## Pipelines (run from repo root)

| command | does |
|---|---|
| `pnpm sync [source]` | pull upstream metadata → `catalog/generated/<source>.json` (Aceternity, Beautiful UI, OriginKit, transitions.dev, Magic UI, SmoothUI, Origin UI, React Bits, Motion Primitives, Cult UI, Kibo UI, shadcn blocks, Motion examples) |
| `pnpm tokens` | DESIGN.md → `theme.css`, registry theme + font items, gallery CSS/fonts, `design-systems/README.md` |
| `pnpm catalog` | generated + curated + `@oc` + inspiration + favorites + thumbnails → `catalog/index.json`, `CATALOG.md`, `MOODS.md` (moods inferred where not set) |
| `pnpm registry:build` | compose `registry.json` → `shadcn build` → `public/r/` |
| `pnpm references` | `catalog/references.json` (inspiration galleries) → `catalog/REFERENCES.md` (routing table + etiquette) |
| `pnpm toolchain` | `catalog/toolchain.json` (ranked CLIs/MCPs/skills/registries/keys) → `catalog/TOOLCHAIN.md`, `presets/components.registries.json`, bundled `public/bootstrap.mjs` |
| `pnpm generate` | tokens + catalog + references + toolchain + registry |
| `pnpm capture <url> [--slug x]` | screenshot a website + extract fonts/palette/radii/CSS vars → `inspiration/<slug>/capture.json` |
| `pnpm lookup "<words>" [--moods a,b] [--trigger hover,scroll] [--intensity subtle] [--integration wrapper] [--applies-to card]` | ranked catalog search in the terminal (same ranking as MCP `search_components`); prints the motion profile + `live` demo link |
| `pnpm scan-motion [--only <source>] [--force]` | read each registry item's source (and OriginKit component pages) once → code-level motion signals (rAF, WebGL, keyframes, whileInView, prefers-reduced-motion…) in `catalog/motion-signals.json`; incremental; then `pnpm catalog` |
| `pnpm check` | typecheck + DESIGN.md lint + cross-reference checks |
| `pnpm thumbnails [--only <source>] [--base <gallery url>] [--force]` | screenshot entries without a `preview` (system Chrome via puppeteer-core) → `public/thumbnails/<source>/<name>.webp` + `catalog/thumbnails.json`; then `pnpm catalog`. `@oc` shots come from the chrome-less `/preview/oc/<name>?theme=<slug>` route, so run the gallery first (`pnpm build && pnpm start -p 3300`, `--base http://localhost:3300`) |

**Never hand-edit generated files**: `catalog/generated/*`, `catalog/index.json`, `catalog/CATALOG.md`,
`catalog/MOODS.md`, `registry.json`, `registry/oc/themes/registry.json`, `design-systems/*/theme.css`,
`design-systems/README.md`, `app/themes.generated.css`, `app/fonts.generated.ts`,
`lib/design-systems.generated.json`, `public/r/`, `catalog/TOOLCHAIN.md`, `presets/components.registries.json`, `public/bootstrap.mjs`, `catalog/thumbnails.json`, `public/thumbnails/`, `catalog/motion-signals.json`, `catalog/REFERENCES.md`.

## Serving (deployed at https://www.owencoonahan.xyz/design-infra — every push to main auto-deploys)

| surface | where | code |
|---|---|---|
| gallery | `/`, `/design-systems`, `/components`, `/sources`, `/registry` | `app/` |
| shadcn registry | `/r/{name}.json` | `pnpm registry:build` → `public/r/` |
| MCP server (Streamable HTTP) | `/mcp` | `app/mcp/route.ts` (tools), `lib/plan.ts`, `lib/catalog/search.ts` (ranking) |
| JSON API | `/api/search`, `/api/plan`, `/api/options`, `/api/references`, `/api/setup`, `/api/toolchain` | `app/api/*` |
| inspiration galleries | MCP `find_references` / `/api/references?pattern=`; `references` in `propose_options` + each `plan_ui` section | `lib/catalog/references.ts` + `catalog/references.json` |
| bootstrap (any repo, one command) | `/bootstrap.mjs`; ranked list at `/toolchain` | `scripts/bootstrap.ts` + `catalog/toolchain.json` (secrets: `~/.config/design-infra/secrets.env`, never in repos) |
| focused visual galleries | `/components?category=loader` (or any category), optional `view=live\|grid`; native adapter/provenance manifest `catalog/preview-demos.json`, playback budget `lib/catalog/playback.ts` |
| component options | MCP `propose_options` / `/api/options` | `lib/propose.ts` + `catalog/playbooks/*.md` + `catalog/dislikes.json` |
| plugin hooks | SessionStart + UserPromptSubmit | `hooks/` (bash, must stay macOS/BSD-compatible) |
| weekly sync | Mondays, opens a PR | `.github/workflows/weekly-sync.yml`, `scripts/catalog-diff.ts` |

Ranking/synonyms/page recipes for `plan_ui` live in `lib/catalog/search.ts` — tune them when results look off.

## Working style Owen wants

Component by component, and **choose from options with links**. When there's a design choice, agents show 3–5
directions with gallery/live links and a compare link (`lib/catalog/links.ts`), recommend one, and wait for his pick
(`skills/refine`, `skills/polish`). Rejections go to `catalog/dislikes.json`, loves to `catalog/favorites.json`.

## Common jobs

- **Owen pastes anything** (library, component, website, design system, screenshot) → `skills/ingest/SKILL.md`,
  which routes to `ingest-library`, `ingest-inspiration` (websites: `pnpm capture` → analysis README), favorites,
  or a new DESIGN.md. Always record *why he likes it* and tag moods.
- **New design system** → inspect real references, compose a convincing page from catalog components, then derive its rules in `design-systems/<slug>/DESIGN.md`. Follow CONVENTIONS.md, `pnpm generate && pnpm check`. Existing presets are legacy options for explicit selection, not defaults from mood words. Choose project structure separately: data, editorial, docs, commerce and marketing need different outlines.
- **New `@oc` block** → `registry/oc/blocks/<name>/<name>.tsx` (theme tokens only — `bg-card`, `text-muted-foreground`,
  `font-heading font-headline`, colours via `var(--primary)`), add it to `registry/oc/blocks/registry.json`,
  add a demo in `components/demos/oc-demos.tsx`, hand-tag it in `catalog/curated.json` (`{ "id": "oc/<name>",
  "integration", "appliesTo", "motion"? }` — tag fields only; `pnpm check` enforces it), `pnpm generate && pnpm check`, then
  `pnpm thumbnails --only oc --base <running gallery> && pnpm catalog` for its catalog thumbnail.
  Gotcha: never pass `font-heading` and `font-headline` through the same `cn()` call (or as `className` to a shadcn
  component that merges with its own `font-heading`, e.g. `CardTitle`) — tailwind-merge reads `font-headline` as a
  font-family and silently drops `font-heading`. Keep them in a plain string. Never use `text-primary` for text/icons
  on the background (brutalist-mono's primary is acid yellow) — use it as a fill with `text-primary-foreground`.
- **New template** → `registry/oc/templates/<name>/page.tsx` importing blocks as `@/components/<block>` (where shadcn
  installs them in a consumer; resolved here by per-block tsconfig paths that `pnpm registry:build` keeps in sync),
  manifest entry with `type: registry:page`, file `target` (e.g. `app/dashboard/page.tsx`) and every `@oc/<block>` /
  shadcn primitive it imports in `registryDependencies` (`pnpm check` enforces this), plus an entry in
  `components/demos/template-demos.tsx` so it renders at `/templates/<name>`.
- **Owen says he likes/loves something** (a component, a block, a site) → add it to `catalog/favorites.json` with a
  note on *what* he likes about it (`id`, `note`, `added`). If it isn't installable on the free tier (Pro/paid) or
  isn't theme-aware, build a free, original, theme-aware `@oc` recreation of the pattern (never copy proprietary code),
  favorite that too, and point the note at it. Example: `oc/feature-levels` ← `aceternity/multi-level-features-with-illustrations`.
- **New tool / library to wire into projects** → add it to `catalog/toolchain.json` with a tier, rank, why/use,
  setup steps (registry / npm / shadcn / mcp / mcp-user / run / agent-note), secrets and a verify command; verify each
  command non-interactively in a scratch app; `pnpm toolchain`. Keyed MCPs are `mcp-user` (secrets never in repos).
- **New inspiration gallery** (a site that collects navbars, pricing pages, heroes…) → add it to `catalog/references.json`
  (`covers`, facet URL templates with only values you curl-verified with a browser UA, moods, access, etiquette from its
  robots.txt / llms.txt), then `pnpm references && pnpm check`.
- **Curate / annotate** → edit `catalog/curated.json` (`notes` = when to use + gotchas), `pnpm catalog`. Curated
  `integration` / `appliesTo` / `motion` / `live` / `moods` win over every layer (incl. `@oc`); everything else is
  inferred by `lib/catalog/tags.ts` — fix a rule there when a whole family is mis-tagged, hand-tag when one entry is special.

## Visual galleries

- Only explicit adapters in `catalog/preview-demos.json` and approved clips autoplay in galleries. Add provenance and preserve licences for imported demo code in `components/demos/vendor/`; keep original catalog IDs/install commands. Implementations load through `/preview/[source]/[name]`, never through the catalog browser bundle. Existing own preview URLs and namespace aliases remain valid.
- Live view contains hosted demos and motion clips; static screenshots belong in Grid view and compact reference rows. Do not present a still capture as a playable example.
- A shared budget plays at most three visible examples. Offscreen/hidden previews unmount; reduced motion starts on posters. Keep detail links and shortlist controls outside interactive frames. Source-only entries remain separate; respect `linkOnlyMedia` before any local or upstream preview.
- Generate new adapter thumbnails with `pnpm thumbnails --id <source/name> --force --base <running gallery>` then `pnpm catalog`. Test changes with `pnpm smoke:visual --base <running gallery>` plus normal checks.

## Rules

- Licences matter: only vendor MIT/Apache code. Aceternity, OriginKit, transitions.dev and React Bits (MIT + Commons Clause) are **catalog-only**
  (reference them via install commands or `registryDependencies` URLs, never copy their source into `@oc`).
- Never default to `access: paid` items; Owen is on free tiers.
- Blocks must look right under **every** design system — check `/design-systems/<slug>` previews in the gallery.


## Friend pilot and release conventions

- `design-infra.config.json` is the deployment/repository/namespace source. Keep stable `oc/` catalog IDs and internal paths. Own registry dependencies build to absolute URLs so canonical and legacy consumers both work.
- Default setup is `--connect --client claude-code|codex`; it saves project rules/config and checks endpoints without installing packages or a theme. Verify active tools after restart/trust. Advanced bootstrap failures must exit nonzero; overwrites are opt-in.
- `catalog/starter.json` is a curated source input. `pnpm verify:starter --base <running site>` performs real fresh-project installs/builds and gallery/keyboard checks, then generates `catalog/starter-verification.json`. Toolchain generation also updates the plugin repository URL and .mcp.json catalog URL from settings. `pnpm starter:build` generates `lib/starter.generated.json` at build time; hosted routes must not traverse the workspace to calculate fingerprints. Never hand-edit that report or claim independent friend trials from automated checks. Changed source fingerprints require rechecking.
- `/feedback` creates a local copyable report without GitHub access; it sends nothing automatically. `/pilot` has friend trial tasks.
- `lib/catalog/media-policy.ts` makes restricted sources link-only. `pnpm thumbnails --prune` purges generated restricted thumbnails; `pnpm catalog` enforces the policy. Inspiration captures are not redistributed without permission.
- Deploy with `pnpm build`: the post-build trace pruning and verification keep `.context`, `.git` and agent worktrees out of deployment packages. Do not deploy a raw `next build` output.
- Keep the repository private until the maintainer explicitly approves publication. Old Git history retains removed third-party assets/code; prepare a clean release history or resolve redistribution rights before publishing that history. See NOTICE.md and SECURITY.md.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
