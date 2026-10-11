/**
 * Repo integrity checks (CI runs this after `pnpm generate`).
 *
 *   pnpm check
 *
 * - every DESIGN.md passes `@google/design.md lint` with no errors
 * - "Pairs well with" ids in each DESIGN.md exist in the catalog
 * - every catalog source has catalog/sources/<source>.md
 * - every skill has name + description front matter
 * - every @oc block has a demo in components/demos/oc-demos.tsx, every template one in template-demos.tsx
 * - every `@/components/*` import in a block/template is covered by its registryDependencies
 * - tsconfig.json's per-block path aliases are in sync with registry/oc/blocks/registry.json
 * - every local thumbnail in catalog/thumbnails.json exists under public/thumbnails/
 * - every @oc block/template is hand-tagged (integration/appliesTo/motion) in catalog/curated.json
 * - catalog/references.json: valid schema, well-formed URL templates, valid `covers`; REFERENCES.md is fresh
 */
import { execFileSync } from "node:child_process"
import { existsSync } from "node:fs"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"

import { parse as parseYaml } from "yaml"

import { SourceMeta } from "../lib/catalog/schema"
import { syncTsconfigPaths } from "./registry-aliases"

const ROOT = process.cwd()
const problems: string[] = []
const read = (p: string) => readFile(path.join(ROOT, p), "utf8")

async function main() {
  const catalog = JSON.parse(await read("catalog/index.json")) as { id: string; source: string }[]
  const ids = new Set(catalog.map((e) => e.id))

  // design systems
  const systems = (await readdir(path.join(ROOT, "design-systems"), { withFileTypes: true })).filter((d) => d.isDirectory())
  for (const d of systems) {
    const file = `design-systems/${d.name}/DESIGN.md`
    let out: string
    try {
      out = execFileSync("pnpm", ["exec", "design.md", "lint", file], { encoding: "utf8" })
    } catch (err) {
      out = (err as { stdout?: string }).stdout ?? ""
    }
    const errors = /"errors":\s*(\d+)/.exec(out)?.[1]
    if (errors === undefined) problems.push(`${file}: could not run design.md lint`)
    else if (errors !== "0") problems.push(`${file}: ${errors} lint error(s) — run: pnpm exec design.md lint ${file}`)

    const md = await read(file)
    const pairs = /## Pairs well with\s+([\s\S]*?)(\n## |$)/.exec(md)?.[1] ?? ""
    for (const [, id] of pairs.matchAll(/^\s*[-*]\s+`?([a-z0-9-]+\/[a-z0-9-]+)`?/gm))
      if (!ids.has(id)) problems.push(`${file}: "Pairs well with" references unknown catalog id ${id}`)
  }

  // sources — front matter must match SourceMeta (the gallery parses it)
  for (const f of await readdir(path.join(ROOT, "catalog/sources"))) {
    const fm = /^---\n([\s\S]*?)\n---/.exec(await read(`catalog/sources/${f}`))?.[1]
    try {
      SourceMeta.parse(parseYaml(fm ?? ""))
    } catch (err) {
      problems.push(`catalog/sources/${f}: invalid front matter — ${(err as Error).message.split("\n")[0]}`)
    }
  }
  const sourceDocs = new Set((await readdir(path.join(ROOT, "catalog/sources"))).map((f) => f.replace(/\.md$/, "")))
  for (const s of new Set(catalog.map((e) => e.source)))
    if (s !== "oc" && s !== "inspiration" && !sourceDocs.has(s)) problems.push(`catalog source "${s}" has no catalog/sources/${s}.md`)

  // skills
  for (const d of await readdir(path.join(ROOT, "skills"))) {
    const md = await read(`skills/${d}/SKILL.md`)
    const fm = /^---\n([\s\S]*?)\n---/.exec(md)?.[1]
    const data = fm ? (parseYaml(fm) as Record<string, string>) : {}
    if (data.name !== d) problems.push(`skills/${d}/SKILL.md: name must be "${d}"`)
    if (!data.description || data.description.length < 40) problems.push(`skills/${d}/SKILL.md: needs a real description`)
  }

  // demos — every block/component in OC_DEMOS, every template in TEMPLATE_DEMOS
  type Item = { name: string; registryDependencies?: string[]; files: { path: string }[] }
  const blocks = JSON.parse(await read("registry/oc/blocks/registry.json")) as { items: Item[] }
  const templates = JSON.parse(await read("registry/oc/templates/registry.json")) as { items: Item[] }
  const demoKeys = (src: string) => new Set([...src.matchAll(/^\s+"?([a-z0-9-]+)"?: (?:\(\)|\{ Page)/gm)].map((m) => m[1]))
  const blockDemos = demoKeys(await read("components/demos/oc-demos.tsx"))
  const templateDemos = demoKeys(await read("components/demos/template-demos.tsx"))
  for (const b of blocks.items)
    if (!blockDemos.has(b.name)) problems.push(`@oc/${b.name} has no demo in components/demos/oc-demos.tsx`)
  for (const t of templates.items)
    if (!templateDemos.has(t.name)) problems.push(`@oc/${t.name} has no entry in components/demos/template-demos.tsx`)

  // motion tags — our own items are hand-tagged (inference can't see what a block pulls in from upstream)
  const curated = JSON.parse(await read("catalog/curated.json")) as { id: string; integration?: string; motion?: unknown }[]
  const handTagged = new Set(curated.filter((c) => c.integration).map((c) => c.id))
  for (const item of [...blocks.items, ...templates.items])
    if (!handTagged.has(`oc/${item.name}`))
      problems.push(`@oc/${item.name}: add a catalog/curated.json entry with integration/appliesTo (+ motion if it animates) — see lib/catalog/tags.ts`)

  // imports ↔ registryDependencies: what a file imports from @/components/* must be installed with it
  const blockNames = new Set(blocks.items.map((b) => b.name))
  for (const item of [...blocks.items, ...templates.items]) {
    const deps = new Set(item.registryDependencies ?? [])
    const hasDep = (name: string) => deps.has(name) || [...deps].some((d) => d.endsWith(`/${name}.json`))
    for (const f of item.files) {
      const src = await read(f.path)
      for (const [, spec] of src.matchAll(/from "@\/components\/([a-z0-9/-]+)"/g)) {
        if (spec.startsWith("ui/")) {
          if (!hasDep(spec.slice(3))) problems.push(`${f.path}: imports @/components/${spec} but @oc/${item.name} lacks registryDependency "${spec.slice(3)}"`)
        } else if (!blockNames.has(spec)) problems.push(`${f.path}: imports @/components/${spec}, which is not an @oc block`)
        else if (spec !== item.name && !deps.has(`@oc/${spec}`)) problems.push(`${f.path}: imports @/components/${spec} but @oc/${item.name} lacks registryDependency "@oc/${spec}"`)
      }
    }
  }

  // tsconfig aliases that let templates' `@/components/<block>` imports resolve in this repo
  if (!(await syncTsconfigPaths({ write: false })))
    problems.push("tsconfig.json block path aliases are stale — run: pnpm registry:build")

  // thumbnails
  if (existsSync(path.join(ROOT, "catalog/thumbnails.json"))) {
    const thumbs = JSON.parse(await read("catalog/thumbnails.json")) as Record<string, string>
    for (const [id, url] of Object.entries(thumbs)) {
      if (!ids.has(id)) problems.push(`catalog/thumbnails.json: unknown catalog id ${id} — re-run pnpm thumbnails`)
      const local = /\/(thumbnails\/[a-z0-9-]+\/[a-z0-9-]+\.webp)$/.exec(url)?.[1]
      if (local && !existsSync(path.join(ROOT, "public", local)))
        problems.push(`catalog/thumbnails.json: ${id} → public/${local} is missing — run pnpm thumbnails --only ${id.split("/")[0]}`)
    }
  }

  // playbooks: valid front matter, unique keys, every pick is a real catalog id and not paid
  try {
    const { loadPlaybooks } = await import("../lib/catalog/playbooks")
    const byId = new Map((catalog as { id: string; access?: string }[]).map((e) => [e.id, e]))
    for (const { playbook, file } of loadPlaybooks(ROOT)) {
      const keys = new Set<string>()
      for (const d of playbook.directions) {
        if (keys.has(d.key)) problems.push(`${file}: duplicate direction key ${d.key}`)
        keys.add(d.key)
        for (const id of d.picks) {
          const e = byId.get(id)
          if (!e) problems.push(`${file}: ${d.key} → unknown catalog id ${id}`)
          else if (e.access === "paid") problems.push(`${file}: ${d.key} → ${id} is paid (Owen is on free tiers)`)
        }
      }
    }
  } catch (err) {
    problems.push((err as Error).message)
  }

  // references: catalog/references.json — schema, unique slugs, every URL template well-formed (https, own host,
  // only {value}/{slug} placeholders, {value} facets list their values), every `covers` a real category,
  // inspiration ids it names exist, and REFERENCES.md is fresh
  try {
    const { loadReferences, validateReferences } = await import("../lib/catalog/references")
    const refs = loadReferences(ROOT)
    for (const p of validateReferences(refs, ids)) problems.push(`catalog/references.json: ${p}`)
    const { renderReferencesMd } = await import("./build-references")
    const md = existsSync(path.join(ROOT, "catalog/REFERENCES.md")) ? await read("catalog/REFERENCES.md") : ""
    if (md !== renderReferencesMd(refs)) problems.push("catalog/REFERENCES.md is stale — run: pnpm references")
  } catch (err) {
    problems.push(`catalog/references.json: ${(err as Error).message.split("\n")[0]}`)
  }

  if (problems.length) {
    console.error(problems.map((p) => `✗ ${p}`).join("\n"))
    process.exit(1)
  }
  console.log(`✓ check: ${systems.length} design systems, ${catalog.length} catalog entries, all good`)
}

main()
