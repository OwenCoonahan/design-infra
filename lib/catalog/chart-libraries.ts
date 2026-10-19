import { z } from "zod"
import input from "../../catalog/chart-libraries.json"
import { CatalogEntry, Mood } from "./schema"

const npmName = z.string().regex(/^(?:@[a-z0-9-]+\/)?[a-z0-9][a-z0-9._-]*$/)
const category = z.enum(["chart", "graph"])
const slug = z.string().regex(/^[a-z0-9-]+$/)
const librarySchema = z.object({
  slug, name: z.string(), url: z.string().url(), repository: z.string().url(), package: npmName,
  packages: z.array(npmName).min(1), license: z.enum(["MIT", "Apache-2.0", "ISC", "BSD-3-Clause", "MIT OR WTFPL", "(Apache-2.0 OR MIT)"]),
  renderers: z.array(z.enum(["svg", "canvas", "webgl", "dom"])).min(1), category,
  moods: z.array(Mood).min(1).max(3), description: z.string(), notes: z.string(), verified: z.string(),
  examples: z.array(z.object({
    name: slug, title: z.string(), url: z.string().url(), purpose: z.string(),
    packages: z.array(npmName).min(1).optional(), category: category.optional(), tags: z.array(z.string()).default([]),
  })).min(5),
})
export const chartLibraries = z.object({ version: z.literal(1), libraries: z.array(librarySchema).min(1) }).parse(input).libraries
export type ChartLibrary = (typeof chartLibraries)[number]
const npmSchema = z.object({ name: npmName, version: z.string(), license: z.string(), peerDependencies: z.record(z.string(), z.string()).default({}) })
// Exact, audited expressions only. Do not accept an arbitrary license merely
// because its string mentions MIT; unknown/changed terms still fail sync.
const freeLicenses = new Set(["MIT", "Apache-2.0", "ISC", "BSD-3-Clause", "MIT OR WTFPL", "(Apache-2.0 OR MIT)"])
const externalDemos = new Set(["recharts", "chartjs", "echarts", "nivo", "visx", "plotly", "uplot", "react-flow", "chartist", "billboard", "vis-network", "react-force-graph"])

/** Catalog references only. Package metadata checks never install dependencies or copy example source. */
export function chartLibraryEntries(library: ChartLibrary, metadata: Record<string, unknown>) {
  const packages = [...new Set([library.package, ...library.packages, ...library.examples.flatMap((example) => example.packages ?? [])])]
  const npm = packages.map((name) => {
    const item = npmSchema.parse(metadata[name])
    if (item.name !== name || !freeLicenses.has(item.license)) throw new Error(`Review changed package/access: ${name}`)
    if (name === library.package && item.license !== library.license) throw new Error(`Review changed license: ${name}`)
    return item
  })
  const primary = npm.find((item) => item.name === library.package)!
  const compatibility = Object.entries(primary.peerDependencies).map(([name, version]) => `${name} ${version}`).join("; ")
  const provenance = `Upstream: ${library.repository}. License: ${library.license}. Package metadata: ${library.package}@${primary.version}${compatibility ? `; peers: ${compatibility}` : ""}. Runtime integration is not verified by this metadata sync.`
  const base = {
    source: library.slug, access: "free" as const, moods: library.moods, curated: true,
    integration: "recipe" as const, appliesTo: [library.category],
    tags: ["data-visualization", "visualization-reference", ...library.renderers], notes: `${library.notes} ${provenance}`,
  }
  const entries = [CatalogEntry.parse({
    ...base, id: `${library.slug}/library`, name: "library", title: library.name,
    description: library.description, kind: "package", categories: [library.category],
    install: `pnpm add ${library.packages.join(" ")}`, dependencies: library.packages, docs: library.url,
  }), ...library.examples.map((example, index) => {
    const type = example.category ?? library.category
    const install = example.packages ?? library.packages
    return CatalogEntry.parse({
      ...base, id: `${library.slug}/${example.name}`, name: example.name, title: `${library.name} · ${example.title}`,
      description: example.purpose, kind: "component", categories: [type], integration: "recipe", appliesTo: [type],
      curated: index < 2, install: `pnpm add ${install.join(" ")}`, dependencies: install, docs: example.url,
      ...(externalDemos.has(library.slug) && { live: example.url }),
      tags: [...base.tags, ...example.tags, "integration-recipe", example.name],
      notes: `Integration recipe: the command installs the library, not a standalone finished component. Adapt the linked upstream API/example to your data and brand. ${base.notes}`,
    })
  })]
  if (new Set(entries.map((entry) => entry.id)).size !== entries.length) throw new Error(`Duplicate chart IDs: ${library.slug}`)
  return entries
}
