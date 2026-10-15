import { correctCategories } from "../lib/catalog/galleries"
import { linkOnlyMedia } from "../lib/catalog/media-policy"
import { NAMESPACE, SITE_URL } from "../lib/config"
/**
 * Merge every catalog layer into the files agents and the gallery read:
 *
 *   catalog/generated/*.json   synced upstream metadata (pnpm sync)
 *   catalog/curated.json       our picks + opinions, merged over generated entries by id
 *   registry/oc/**             our own @oc registry items (always curated)
 *   lib/design-systems.generated.json   themes (pnpm tokens)
 *   inspiration/<slug>/README.md        websites/apps Owen likes (pnpm capture + ingest-inspiration skill)
 *   catalog/motion-signals.json  code-level motion signals (pnpm scan-motion) — with names/deps they feed
 *                              lib/catalog/tags.ts, which fills integration/appliesTo/motion/live where unset
 *   catalog/thumbnails.json    screenshot / upstream-image URLs (pnpm thumbnails) — fills `preview`
 *                              only where no layer above set one
 *
 * → catalog/index.json   full machine-readable catalog (curated first)
 * → catalog/CATALOG.md   one line per entry — grep-friendly for agents
 * → catalog/MOODS.md     the catalog sliced by feeling: design systems, inspiration and top picks per mood
 *
 *   pnpm catalog
 */
import { existsSync } from "node:fs"
import { readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import { parse as parseYaml } from "yaml"

import { inferMoods, type Mood, MOODS, MOOD_NAMES } from "../lib/catalog/moods"
import { CatalogEntry, CuratedEntry, Favorite, Inspiration, type CatalogEntry as Entry } from "../lib/catalog/schema"
import { aliasOf, inferTags, motionLabel, type MotionSignals } from "../lib/catalog/tags"

const ROOT = process.cwd()
const readJson = async <T>(p: string) => JSON.parse(await readFile(path.join(ROOT, p), "utf8")) as T

type RegistryItem = {
  name: string
  type: string
  title?: string
  description?: string
  dependencies?: string[]
  categories?: string[]
  meta?: { upstream?: string[]; moods?: string[] }
}

/** Item names with a live demo: keys of OC_DEMOS / TEMPLATE_DEMOS (`pnpm check` enforces full coverage). */
async function demoNames(file: string) {
  const src = await readFile(path.join(ROOT, file), "utf8")
  return new Set([...src.matchAll(/^\s+"?([a-z0-9-]+)"?: (?:\(\)|\{ Page)/gm)].map((m) => m[1]))
}

/** Tag fields curated.json can set on ANY entry (they win over every layer). */
const CURATED_TAG_FIELDS = ["integration", "appliesTo", "motion", "live", "moods"] as const

const integrationLabel = (e: Entry) =>
  !e.integration ? "—" : e.integration === "drop-in" ? "drop-in" : `${e.integration}→${e.appliesTo.join(",")}`

async function main() {
  const DEMOS = await demoNames("components/demos/oc-demos.tsx")
  const TEMPLATE_DEMOS = await demoNames("components/demos/template-demos.tsx")
  const byId = new Map<string, Entry>()

  // 1. synced upstream entries
  for (const f of (await readdir(path.join(ROOT, "catalog/generated"))).filter((f) => f.endsWith(".json")).sort()) {
    for (const raw of await readJson<unknown[]>(`catalog/generated/${f}`)) {
      const e = CatalogEntry.parse(raw)
      byId.set(e.id, e)
    }
  }
  const synced = new Map(byId)

  // 2. curated overrides / additions
  const problems: string[] = []
  /** Curated tag fields, re-applied after every layer (step 3c) so they also win over @oc / inspiration. */
  const curatedTags = new Map<string, Partial<Entry>>()
  for (const raw of await readJson<Record<string, unknown>[]>("catalog/curated.json")) {
    const c = CuratedEntry.parse(raw)
    // Tag fields the file actually sets (not the partial schema's `[]` defaults, which would wipe @oc moods).
    const tags = Object.fromEntries(CURATED_TAG_FIELDS.filter((k) => k in raw).map((k) => [k, c[k]]))
    if (Object.keys(tags).length) curatedTags.set(c.id, tags)
    const base = byId.get(c.id)
    if (!base && !c.title) {
      // Partial overrides of layers built below (our @oc items) may only carry tag fields.
      const other = Object.keys(raw).filter((k) => k !== "id" && k !== "curated" && !(CURATED_TAG_FIELDS as readonly string[]).includes(k))
      if (c.id.startsWith("oc/") && !other.length) continue
      problems.push(
        c.id.startsWith("oc/")
          ? `curated "${c.id}": only ${CURATED_TAG_FIELDS.join("/")} can override an @oc item (edit its registry item for ${other.join(", ")})`
          : `curated "${c.id}" overrides nothing (not in catalog/generated) and is not a full entry`
      )
      continue
    }
    // Only keys actually written in curated.json override — zod defaults ([] / "") must not wipe synced data.
    const present = Object.fromEntries(Object.entries(c).filter(([k]) => k in (raw as object)))
    byId.set(c.id, CatalogEntry.parse({ ...base, ...present, curated: true }))
  }

  // 3. our registry
  const blocks = await readJson<{ items: RegistryItem[] }>("registry/oc/blocks/registry.json")
  for (const item of blocks.items) {
    byId.set(
      `oc/${item.name}`,
      CatalogEntry.parse({
        id: `oc/${item.name}`,
        source: "oc",
        name: item.name,
        title: item.title ?? item.name,
        description: item.description ?? "",
        kind: item.type === "registry:block" ? "block" : "component",
        categories: item.categories,
        tags: ["oc", ...(item.meta?.upstream ?? [])],
        moods: item.meta?.moods ?? [],
        access: "free",
        install: `npx shadcn@latest add ${NAMESPACE}/${item.name}`,
        dependencies: item.dependencies ?? [],
        curated: true,
        themeAware: true,
        demo: DEMOS.has(item.name),
      })
    )
  }
  // @oc libs (generated by pnpm tokens): installable code helpers, e.g. motion-presets
  for (const item of (await readJson<{ items: RegistryItem[] }>("registry/oc/lib/registry.json")).items) {
    byId.set(
      `oc/${item.name}`,
      CatalogEntry.parse({
        id: `oc/${item.name}`,
        source: "oc",
        name: item.name,
        title: item.title ?? item.name,
        description: item.description ?? "",
        kind: "package",
        categories: item.categories,
        tags: ["oc", "lib"],
        moods: item.meta?.moods ?? [],
        access: "free",
        install: `npx shadcn@latest add ${NAMESPACE}/${item.name}`,
        dependencies: item.dependencies ?? [],
        curated: true,
        themeAware: true,
      })
    )
  }
  const templates = await readJson<{ items: (RegistryItem & { registryDependencies?: string[]; files: { target?: string }[] })[] }>(
    "registry/oc/templates/registry.json"
  )
  for (const item of templates.items) {
    const blocksUsed = (item.registryDependencies ?? []).filter((d) => d.startsWith("@oc/")).map((d) => `oc/${d.slice(4)}`)
    byId.set(
      `oc/${item.name}`,
      CatalogEntry.parse({
        id: `oc/${item.name}`,
        source: "oc",
        name: item.name,
        title: item.title ?? item.name,
        description: item.description ?? "",
        kind: "template",
        categories: item.categories,
        tags: ["oc", "template", ...blocksUsed],
        moods: item.meta?.moods ?? [],
        access: "free",
        install: `npx shadcn@latest add ${NAMESPACE}/${item.name}`,
        dependencies: item.dependencies ?? [],
        curated: true,
        themeAware: true,
        demo: TEMPLATE_DEMOS.has(item.name),
        notes: `Starter page → ${item.files[0]?.target}. Use existing compatible tokens, or install a theme only when requested; it pulls in ${blocksUsed.length} @oc blocks. Preview: /templates/${item.name}.`,
      })
    )
  }
  const systems = await readJson<{ slug: string; name: string; description: string; fonts: Record<string, string>; moods: Mood[] }[]>(
    "lib/design-systems.generated.json"
  )
  for (const s of systems) {
    byId.set(
      `oc/theme-${s.slug}`,
      CatalogEntry.parse({
        id: `oc/theme-${s.slug}`,
        source: "oc",
        name: `theme-${s.slug}`,
        title: `${s.name} (design system)`,
        description: s.description,
        kind: "theme",
        categories: ["theme"],
        moods: s.moods,
        tags: ["design-system", ...new Set(Object.values(s.fonts))],
        access: "free",
        install: `npx shadcn@latest add ${NAMESPACE}/theme-${s.slug}`,
        curated: true,
        themeAware: true,
        demo: true,
        notes: `Writes DESIGN.md to the project root + theme tokens + fonts. Read design-systems/${s.slug}/DESIGN.md first.`,
      })
    )
  }

  // 3b. inspiration — websites/apps Owen likes (reference, not installable)
  const inspirations: Inspiration[] = []
  if (existsSync(path.join(ROOT, "inspiration"))) {
    for (const d of (await readdir(path.join(ROOT, "inspiration"), { withFileTypes: true })).filter((d) => d.isDirectory())) {
      const file = `inspiration/${d.name}/README.md`
      if (!existsSync(path.join(ROOT, file))) continue
      const fm = /^---\n([\s\S]*?)\n---/.exec(await readFile(path.join(ROOT, file), "utf8"))?.[1]
      const parsed = Inspiration.safeParse(parseYaml(fm ?? ""))
      if (!parsed.success) {
        problems.push(`${file}: invalid front matter — ${parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`)
        continue
      }
      const ins = parsed.data
      if (ins.slug !== d.name) problems.push(`${file}: slug "${ins.slug}" must match its folder name`)
      inspirations.push(ins)
      const hero = existsSync(path.join(ROOT, `public/inspiration/${ins.slug}/hero.webp`))
      byId.set(
        `inspiration/${ins.slug}`,
        CatalogEntry.parse({
          id: `inspiration/${ins.slug}`,
          source: "inspiration",
          name: ins.slug,
          title: ins.name,
          description: ins.summary,
          kind: "inspiration",
          categories: ins.categories,
          moods: ins.moods,
          tags: ["inspiration", ins.type, ...ins.tags],
          access: "free",
          install: `reference only — read inspiration/${ins.slug}/README.md (patterns → ${ins.related.join(", ") || "see README"})`,
          docs: ins.url,
          preview: hero ? `${SITE_URL}/inspiration/${ins.slug}/hero.webp` : undefined,
          curated: true,
          notes: ins.likes,
        })
      )
      for (const r of ins.related) if (!byId.has(r) && !r.startsWith("oc/")) problems.push(`${file}: related id ${r} not in catalog`)
    }
  }

  // 3c. curated tag fields win over every layer (incl. @oc, whose layer runs after curated)
  for (const [id, tags] of curatedTags) {
    const e = byId.get(id)
    if (!e) problems.push(`curated "${id}" overrides nothing (unknown id)`)
    else byId.set(id, CatalogEntry.parse({ ...e, ...tags }))
  }

  // Correct stale upstream category guesses before inferring integration/appliesTo.
  for (const [id, entry] of byId) {
    const categories = correctCategories(entry.name, entry.source, entry.categories)
    byId.set(id, {
      ...entry,
      categories,
      appliesTo: categories === entry.categories ? entry.appliesTo : entry.appliesTo.filter(c => c !== "loader"),
    })
  }

  // 3d. motion / integration / live — inferred (lib/catalog/tags.ts) wherever no layer set them
  const signals = existsSync(path.join(ROOT, "catalog/motion-signals.json"))
    ? await readJson<Record<string, MotionSignals>>("catalog/motion-signals.json")
    : {}
  for (const [id, e] of byId) {
    // Curated overrides blank the synced description/tags/deps (CuratedEntry's defaults) — infer from the synced text.
    const s = synced.get(id)
    const t = inferTags(
      s
        ? {
            ...e,
            description: e.description || s.description,
            tags: e.tags.length ? e.tags : s.tags,
            dependencies: e.dependencies.length ? e.dependencies : s.dependencies,
          }
        : e,
      signals[id]
    )
    byId.set(id, {
      ...e,
      integration: e.integration ?? t.integration,
      appliesTo: e.appliesTo.length ? e.appliesTo : t.appliesTo,
      motion: e.motion ?? t.motion,
      live: e.live ?? t.live,
    })
  }
  // deprecated aliases (cult-ui animated-* → halo-*) move like their target
  for (const [id, e] of byId) {
    const target = byId.get(aliasOf(e) ?? "")
    if (target && !curatedTags.has(id))
      byId.set(id, { ...e, integration: target.integration, appliesTo: target.appliesTo, motion: target.motion })
  }

  // 4. Owen's favorites (taste signal) — applied last so they work for every layer
  for (const raw of await readJson<unknown[]>("catalog/favorites.json")) {
    const f = Favorite.parse(raw)
    const e = byId.get(f.id)
    if (!e) {
      problems.push(`favorites.json: unknown catalog id ${f.id}`)
      continue
    }
    byId.set(f.id, { ...e, favorite: true, notes: `♥ ${f.note}${e.notes ? ` — ${e.notes}` : ""}` })
  }

  // 5. thumbnails — lowest precedence: never override a preview from generated/curated data
  if (existsSync(path.join(ROOT, "catalog/thumbnails.json"))) {
    const thumbs = await readJson<Record<string, string>>("catalog/thumbnails.json")
    for (const [id, url] of Object.entries(thumbs)) {
      const e = byId.get(id)
      const thumbnailPath = `/thumbnails/${id}.webp`
      const local = new URL(url).pathname.endsWith(thumbnailPath) && existsSync(path.join(ROOT, "public", thumbnailPath))
      if (e && !e.preview) byId.set(id, CatalogEntry.parse({ ...e, preview: local ? `${SITE_URL}${thumbnailPath}` : url }))
    }
  }

  // Rights-restricted media is link-only; retain live/docs links and install metadata.
  for (const [id, entry] of byId) if (linkOnlyMedia(entry)) byId.set(id, { ...entry, preview: undefined, video: undefined })

  // 6. moods — curated/inspiration/theme values win; everything else is inferred from name, text and source
  for (const [id, e] of byId) if (!e.moods.length) byId.set(id, { ...e, moods: inferMoods(e) })

  // validate cross references in curated notes/tags
  for (const e of byId.values())
    for (const t of e.tags)
      if (/^[a-z0-9-]+\/[a-z0-9-]+$/.test(t) && !byId.has(t)) problems.push(`${e.id}: tag references unknown entry ${t}`)

  if (problems.length) {
    console.error(problems.map((p) => `✗ ${p}`).join("\n"))
    process.exit(1)
  }

  const sourceRank = (s: string) => (s === "oc" ? 0 : 1)
  const all = [...byId.values()].sort(
    (a, b) =>
      Number(b.favorite) - Number(a.favorite) ||
      Number(b.curated) - Number(a.curated) ||
      sourceRank(a.source) - sourceRank(b.source) ||
      a.id.localeCompare(b.id)
  )

  await writeFile(path.join(ROOT, "catalog/index.json"), JSON.stringify(all, null, 2) + "\n")

  const counts = new Map<string, number>()
  for (const e of all) counts.set(e.source, (counts.get(e.source) ?? 0) + 1)
  const esc = (s: string) => s.replace(/\|/g, "\\|").replace(/\s+/g, " ").trim()
  const lines = [
    "<!-- GENERATED by scripts/build-catalog.ts — edit catalog/curated.json or re-run pnpm sync. -->",
    "# Component catalog",
    "",
    `${all.length} entries · ${[...counts].map(([s, n]) => `${s} ${n}`).join(" · ")}`,
    "",
    "Search with grep, e.g. `grep -i 'pricing' catalog/CATALOG.md`. ♥ = catalog favorite (strongest signal). ★ = curated (prefer these). ◐ = follows the installed theme.",
    "Access: free · key (free account/API key) · metered (daily limit) · paid (upgrade only — don't pick by default).",
    "",
    "Motion: `triggers·intensity·technique` (`·rm` = honours prefers-reduced-motion), `—` = static. Integration: drop-in replaces",
    "your component; wrapper→X wraps your X; recipe→X is CSS/technique you apply to your X. Live demo URLs: `live` in index.json.",
    "",
    "| id | title | categories | moods | motion | integration | access | install | notes |",
    "|---|---|---|---|---|---|---|---|---|",
    ...all.map(
      (e) =>
        `| ${e.favorite ? "♥ " : ""}${e.curated ? "★ " : ""}${e.themeAware ? "◐ " : ""}${e.id} | ${esc(e.title)} | ${e.categories.join(", ")} | ${e.moods.join(", ")} | ${motionLabel(e.motion)} | ${integrationLabel(e)} | ${e.access} | \`${esc(e.install)}\` | ${esc(e.notes ?? e.description).slice(0, 160)} |`
    ),
    "",
  ]
  await writeFile(path.join(ROOT, "catalog/CATALOG.md"), lines.join("\n"))

  // MOODS.md — choose by feeling
  const rank = (e: Entry) =>
    (e.favorite ? 100 : 0) + (e.curated ? 20 : 0) + (e.source === "oc" ? 10 : 0) + (e.themeAware ? 5 : 0) + (e.preview ? 1 : 0)
  const md = [
    "<!-- GENERATED by scripts/build-catalog.ts from lib/catalog/moods.ts + catalog layers. -->",
    "# Choose by feeling",
    "",
    "Choose the project structure from its purpose and tasks, then inspect real references and pull",
    "components that suit its feeling. Preserve existing branding; derive new design rules from a working composition.",
    "Theme presets below are legacy options for explicit selection, not automatic recommendations. Moods are inferred (lib/catalog/moods.ts) unless curated.",
    "MCP: `plan_ui` reads moods from the brief automatically; `search_components` takes `moods`.",
    "",
    "| mood | feels like | design systems | inspiration | entries |",
    "|---|---|---|---|---|",
    ...MOOD_NAMES.map((m) => {
      const ds = systems.filter((s) => (s.moods ?? []).includes(m)).map((s) => `\`${s.slug}\``)
      const ins = inspirations.filter((i) => i.moods.includes(m)).map((i) => `[${i.name}](../inspiration/${i.slug}/README.md)`)
      const n = all.filter((e) => e.moods.includes(m)).length
      return `| **${m}** | ${MOODS[m].description} | ${ds.join(", ") || "—"} | ${ins.join(", ") || "—"} | ${n} |`
    }),
    "",
  ]
  for (const m of MOOD_NAMES) {
    const picks = all
      .filter((e) => e.moods.includes(m) && e.access !== "paid" && e.kind !== "theme" && e.kind !== "inspiration")
      .sort((a, b) => rank(b) - rank(a) || a.id.localeCompare(b.id))
      .slice(0, 15)
    md.push(`## ${MOODS[m].label}`, "", `${MOODS[m].description} Brief words: ${MOODS[m].words.slice(0, 8).join(", ")}.`, "")
    for (const e of picks) md.push(`- ${e.favorite ? "♥ " : ""}${e.curated ? "★ " : ""}\`${e.id}\` — ${esc(e.title)} (${e.categories.join(", ")}) · \`${esc(e.install)}\``)
    md.push("")
  }
  await writeFile(path.join(ROOT, "catalog/MOODS.md"), md.join("\n"))

  console.log(`✓ catalog: ${all.length} entries (${all.filter((e) => e.curated).length} curated)`)
}

main()
