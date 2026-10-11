---
name: find-component
description: Find and install the right UI component, app block or page section from the shared curated catalog (≈2,200 entries across @design-infra, shadcn/ui blocks, Origin UI, Kibo UI, Magic UI, Motion Primitives, Cult UI, React Bits, Aceternity, Beautiful UI, libraries.dev, transitions.dev, OriginKit, 21st.dev). Use for any "I need a dashboard/sidebar/login/data table/date picker/hero/pricing/bento/navbar/testimonials/background effect/text animation/loader/chat UI/agent status/..." request, or "what's a cool way to show X".
---

Read the plugin root `design-infra.config.json` for the deployment URL, repository and installation namespace. Examples below use the default deployment; substitute these settings in a fork. Stable `oc/` catalog IDs are unchanged.

# find-component

Repo root of design-infra = `<this skill's base dir>/../..` (`$DI`).

## 1. Search the catalog (cheap → expensive)

Fastest: the MCP tool `search_components` (query + optional category/source/moods) — already ranked; mood words
in the query ("calm pricing", "playful loader") boost entries with that feeling. In the design-infra repo:
`pnpm lookup "<words>" [--moods calm,premium]`. Without MCP:
`curl -s "https://design-infra.vercel.app/api/search?q=<words>&category=<cat>&limit=10"`. Or grep the files:

```bash
grep -i '<keyword>' $DI/catalog/CATALOG.md | head -40          # one line per entry, ★ curated first
jq '[.[] | select(.categories | index("pricing"))] | .[:15] | map({id,title,access,install,notes})' $DI/catalog/index.json
```

Categories: see `$DI/catalog/categories.md`. Symbols in CATALOG.md: ★ curated, ◐ theme-aware.

Need a whole page, not a section? `grep template $DI/catalog/CATALOG.md` — `oc/template-*` entries (kind `template`) install a
complete page composed of `@design-infra` blocks. Common `@design-infra` sections: navbar, hero-split/hero-spotlight, logo-cloud, feature-bento/feature-list,
stats-row, testimonials-grid, pricing-simple, faq, cta-banner, footer-columns; app: app-shell, stat-cards, data-table-card,
empty-state, settings-form; AI: chat-thread, prompt-composer, agent-status.

## 2. Rank

1. Stock **shadcn/ui** if it's plain app UI (dialog, select, form, table…); for whole app screens the
   official **`shadcn/*` blocks** (dashboard, sidebar shells, login/signup, charts).
2. **`oc/*`** — ours, theme-aware.
3. **★ curated** entries — read their `notes` (gotchas!). Among them, prefer **◐ theme-aware free** sources
   whenever one fits, because they follow every design system with no adaptation:
   - app UI beyond stock shadcn → **Origin UI** (`originui/*`, all token-based) and **Kibo UI** (`kibo-ui/*`: Gantt, Kanban, editor, dropzone…);
   - motion behaviour on your own markup → **Motion Primitives** (mostly unstyled) and Magic UI's colourless pieces (`marquee`, `blur-fade`, `text-animate`, `animated-list`);
   - then Magic UI / Cult UI effects with hex accents (pass `var(--primary)`).
   Rank **Aceternity** (hard-coded colours) and **React Bits** (hex/purple defaults, heavy GSAP/WebGL deps,
   no-redistribution licence) below those — use them when the brief wants a bold marketing effect nothing theme-aware provides.
4. Uncurated `free` entries, same preference order. Look at `preview` images / `docs` links when choosing visually.
5. `key` / `metered` (21st.dev, OriginKit) — fine, tell the user it uses their account quota.
6. `paid` — never install; mention as an upgrade option at most.

Also respect the project's `DESIGN.md` → its **Pairs well with** list and Do's/Don'ts beat generic ranking.
Nothing good? Search upstream: `pnpm dlx shadcn@latest search @magicui -q "<kw>"` (also `@aceternity`, `@cult-ui`, `@kibo-ui`, `@react-bits`, `@motion-primitives`), the 21st MCP, or `catalog/sources/*.md` for each source's search method.

## 2b. Show options before installing

Unless the user named an exact component, present the top 3–5 as a short table — name · why · access ·
**links** (`page` = gallery entry, `live` = interactive demo) — plus one compare link built from their ids:
`https://design-infra.vercel.app/compare?ids=<id1>,<id2>,<id3>&theme=<project design system>&label=<what for>`.
Recommend one and wait for the pick. (Changing an EXISTING component? Use the **refine** skill instead.)
User wants ideas, or nothing fits? MCP `find_references` (or `/api/references?pattern=<words>`) → "see how others do it:
<1–2 gallery links>" (navbar.gallery, land-book sections, landing.love videos…; `$DI/catalog/REFERENCES.md`).

## 3. Install & adapt

- Run the entry's `install` command in the target project (registries must be configured — see setup-project).
- Read the source's `$DI/catalog/sources/<source>.md` **Gotchas** section first.
- If `themeAware` is false: replace hard-coded colours with tokens (`bg-white dark:bg-black` → `bg-card`, `text-neutral-500` → `text-muted-foreground`, blue gradients → `color-mix(in oklch, var(--primary) N%, transparent)`).
- Respect `prefers-reduced-motion`; lazy-load WebGL/canvas effects below the fold.

## 4. Report

Say which entry you chose and why (one line), list alternatives considered (ids), and the exact command(s) run.
If a third-party pick needed heavy adaptation and is likely to be reused, suggest promoting it to an `@design-infra` block in design-infra.

## Visual browsing links

Results include `galleries` by category. Include a focused shelf link when useful, such as `https://design-infra.vercel.app/components?category=loader` (substitute the configured deployment URL). Categories default to live previews; `view=grid` selects thumbnails. Visual coverage varies: Loading has eight local demo adapters, while other types reuse existing hosted demos, clips and screenshots. Continue using original IDs and install commands; a hosted demo does not change access or licence requirements.
