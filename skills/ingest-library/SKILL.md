---
name: ingest-library
description: Add a new component library, design resource, or tool to the design-infra repo when a contributor pastes a URL (e.g. "add https://magicui.design"). Researches it, writes catalog/sources/slug.md, adds a sync adapter or curated entries, registers its shadcn namespace, and rebuilds the catalog. Only for use inside the design-infra repo.
---

Read the plugin root `design-infra.config.json` for the deployment URL, repository and installation namespace. Examples below use the default deployment; substitute these settings in a fork. Stable `oc/` catalog IDs are unchanged.

# ingest-library

Run inside the design-infra repo (has `catalog/`, `scripts/sync-sources.ts`). For each URL:

## 1. Research (fetch, don't guess)

Find out and note with evidence:
- What it is, who makes it, how many items, categories, standout items.
- **Distribution:** shadcn registry? Probe `<site>/r/registry.json`, `<site>/registry.json`, `<site>/registry/registry.json`, `<site>/r/<item>.json`. npm package(s)? CLI? agent skill (`npx skills add …`)? copy-paste only?
- **Machine access:** `llms.txt`, JSON API, sitemap, GitHub repo, MCP server.
- **License + pricing:** free / key / metered / paid; can we vendor (MIT/Apache) or catalog-only?
- **Stack:** Tailwind v3/v4, motion/framer-motion/GSAP, Three.js, Radix/Base UI; theme-aware or hard-coded colours?

Also judge its **feel**: add the source's default moods to `SOURCE_DEFAULTS` in `lib/catalog/moods.ts`, and give
curated picks explicit `moods` in `catalog/curated.json` when they differ from the default.

## 2. Write `catalog/sources/<slug>.md`

Copy the front matter shape of an existing file (e.g. `catalog/sources/aceternity.md`; schema `SourceMeta` in `lib/catalog/schema.ts`). Body: **Use it for / don't**, Install, Machine access, **Gotchas**, Best picks.

## 3. Get its items into the catalog

- **Has a machine-readable list** (registry.json, API, GitHub dir, embedded JSON) → add an adapter to `ADAPTERS` in `scripts/sync-sources.ts` (follow `aceternity`/`beautifui`), run `pnpm sync <slug>`.
- **No list** → add 5–20 hand-picked entries to `catalog/curated.json` (full entries: id, source, name, title, description, kind, categories, access, install, docs, notes).
- Either way, curate the best 5–15 with `notes` (when to use, gotchas) in `catalog/curated.json`.
- Shadcn registry → add its namespace to `presets/components.registries.json`.

## 4. Vendor? (rarely)

Only MIT/Apache code, only if we're improving it (theme-aware, composition). Create an `@design-infra`
block under `registry/oc/blocks/<name>/` + entry in `registry/oc/blocks/registry.json`, with a
header comment crediting the source + licence. Prefer `registryDependencies` on the upstream URL
over copying code. **Never** vendor proprietary/no-redistribution sources (Aceternity, OriginKit, transitions.dev, React Bits).

## 5. Rebuild & verify

```bash
pnpm catalog && pnpm check
pnpm thumbnails --only <slug> && pnpm catalog   # thumbnails for entries without a preview image
```

`pnpm thumbnails` needs a strategy for the new source in `planFor()` in `scripts/thumbnails.ts`:
an upstream image URL pattern (`probe`, cheapest), a per-item demo page + selector (`shot`), or
one showcase page with an element per item (`shot` with `batch: true`). Check a few of the
resulting `public/thumbnails/<slug>/*.webp` by eye before committing them.

Update the source table in `README.md`. Report: what it is, access/licence, how many entries
landed, top picks, any gotchas — and propose follow-ups (an `@design-infra` block, a pattern note).
