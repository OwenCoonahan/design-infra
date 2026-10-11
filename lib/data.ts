import "server-only"

import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { cache } from "react"

import { parse as parseYaml } from "yaml"

import { CatalogEntry, Inspiration, SourceMeta } from "@/lib/catalog/schema"
import type { DesignSystemMeta } from "@/scripts/build-tokens"

const ROOT = process.cwd()

function splitFrontMatter(src: string) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(src)
  return m ? { data: parseYaml(m[1]) as Record<string, unknown>, body: m[2] } : { data: {}, body: src }
}

export const getCatalog = cache(async () => {
  const raw = JSON.parse(await readFile(path.join(ROOT, "catalog/index.json"), "utf8")) as Record<string, unknown>[]
  // Local-only: CATALOG_OVERLAY=<file.json> merges partial entries ({ id, ...fields }) over the index —
  // handy for previewing tags (motion/integration/live) before they land in catalog data.
  if (process.env.CATALOG_OVERLAY) {
    const overlay = JSON.parse(await readFile(path.resolve(/*turbopackIgnore: true*/ ROOT, process.env.CATALOG_OVERLAY), "utf8")) as { id: string }[]
    const byId = new Map(overlay.map((o) => [o.id, o]))
    return raw.map((e) => CatalogEntry.parse({ ...e, ...byId.get(e.id as string) }))
  }
  return raw.map((e) => CatalogEntry.parse(e))
})

export const getEntry = cache(async (id: string) => (await getCatalog()).find((e) => e.id === id))

export const getSources = cache(async () => {
  const dir = path.join(ROOT, "catalog/sources")
  const files = (await readdir(dir)).filter((f) => f.endsWith(".md")).sort()
  return Promise.all(
    files.map(async (f) => {
      const { data, body } = splitFrontMatter(await readFile(path.join(dir, f), "utf8"))
      return { meta: SourceMeta.parse(data), body }
    })
  )
})

export const getSource = cache(async (slug: string) => (await getSources()).find((s) => s.meta.slug === slug))

export const getDesignSystems = cache(async () => {
  return JSON.parse(
    await readFile(path.join(ROOT, "lib/design-systems.generated.json"), "utf8")
  ) as DesignSystemMeta[]
})

export const getDesignSystem = cache(async (slug: string) => {
  const meta = (await getDesignSystems()).find((d) => d.slug === slug)
  if (!meta) return undefined
  const src = await readFile(path.join(ROOT, "design-systems", slug, "DESIGN.md"), "utf8")
  const { body } = splitFrontMatter(src)
  return { meta, body, raw: src }
})

export type TemplateItem = {
  name: string
  title: string
  description: string
  registryDependencies: string[]
  files: { path: string; type: string; target?: string }[]
  categories: string[]
  meta: { route?: string; frame?: "app" }
}

export const getTemplates = cache(async () => {
  const raw = JSON.parse(await readFile(path.join(ROOT, "registry/oc/templates/registry.json"), "utf8")) as {
    items: TemplateItem[]
  }
  return raw.items
})

export const getTemplate = cache(async (name: string) => (await getTemplates()).find((t) => t.name === name))

/** inspiration/<slug>/README.md — websites/apps Owen likes (front matter + analysis body). */
export const getInspirations = cache(async () => {
  const dir = path.join(ROOT, "inspiration")
  const slugs = (await readdir(dir, { withFileTypes: true }).catch(() => [])).filter((d) => d.isDirectory()).map((d) => d.name)
  const out: { meta: Inspiration; body: string }[] = []
  for (const slug of slugs.sort()) {
    const src = await readFile(path.join(dir, slug, "README.md"), "utf8").catch(() => undefined)
    if (!src) continue
    const { data, body } = splitFrontMatter(src)
    const meta = Inspiration.safeParse(data)
    if (meta.success) out.push({ meta: meta.data, body })
  }
  return out.sort((a, b) => b.meta.added.localeCompare(a.meta.added))
})

export const getInspiration = cache(async (slug: string) => (await getInspirations()).find((i) => i.meta.slug === slug))
