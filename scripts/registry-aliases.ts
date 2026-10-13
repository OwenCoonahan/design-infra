/**
 * Templates (registry/oc/templates/*) import blocks the way a *consumer* sees them —
 * `@/components/<block>` — because that is where `shadcn add @oc/<block>` writes
 * registry:component files. In this repo those blocks live at
 * registry/oc/blocks/<block>/<block>.tsx, so we keep one exact-match tsconfig path per
 * block. TypeScript and Turbopack both prefer exact matches over the `@/*` wildcard, the
 * template source ships to consumers unchanged, and nothing extra lands in their repo.
 *
 * `pnpm registry:build` rewrites the aliases; `pnpm check` fails if they drift.
 */
import { readFile, writeFile } from "node:fs/promises"

type Item = { name: string; files?: { path: string; type: string; target?: string }[] }

export async function blockAliases(): Promise<Record<string, string[]>> {
  const { items } = JSON.parse(await readFile("registry/oc/blocks/registry.json", "utf8")) as { items: Item[] }
  const out: Record<string, string[]> = {}
  for (const item of items.sort((a, b) => a.name.localeCompare(b.name))) {
    // single-file blocks, or multi-file items (e.g. design-lab: page + component) whose component is <name>.tsx
    const components = item.files?.filter((f) => f.type === "registry:component") ?? []
    const file =
      components.find((f) => f.path.endsWith(`/${item.name}.tsx`)) ?? (item.files?.length === 1 ? components[0] : undefined)
    if (file) out[`@/components/${item.name}`] = [`./${file.path}`]
  }
  return out
}

/** Returns true if tsconfig.json was already in sync. With `write`, fixes it. */
export async function syncTsconfigPaths({ write }: { write: boolean }) {
  const tsconfig = JSON.parse(await readFile("tsconfig.json", "utf8"))
  // Blocks also import registry libraries by their consumer target, e.g. @/lib/motion-presets.
  const { items } = JSON.parse(await readFile("registry/oc/lib/registry.json", "utf8")) as { items: Item[] }
  const libraries = Object.fromEntries(items.flatMap((item) => (item.files ?? [])
    .filter((file) => file.type === "registry:lib" && file.target)
    .map((file) => [`@/${file.target!.replace(/\.tsx?$/, "")}`, [`./${file.path}`]])))
  const paths = { "@/*": ["./*"], ...(await blockAliases()), ...libraries }
  const inSync = JSON.stringify(tsconfig.compilerOptions.paths) === JSON.stringify(paths)
  if (!inSync && write) {
    tsconfig.compilerOptions.paths = paths
    // keep short string arrays on one line, like the hand-written original
    const json = JSON.stringify(tsconfig, null, 2).replace(/\[\n\s+("[^\]]*?")\n\s+\]/g, (m, body: string) => {
      const one = `[${body.split(/,\n\s+/).join(", ")}]`
      return one.length <= 80 ? one : m
    })
    await writeFile("tsconfig.json", json + "\n")
  }
  return inSync
}
