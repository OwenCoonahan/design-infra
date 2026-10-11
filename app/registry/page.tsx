import { NAMESPACE } from "@/lib/config"
import { readFile } from "node:fs/promises"
import path from "node:path"

import Link from "next/link"

import { CopyCommand } from "@/components/site/copy-command"
import { Badge } from "@/components/ui/badge"

export const metadata = { title: "Registry" }

type Item = { name: string; type: string; title?: string; description?: string }

export default async function RegistryPage() {
  const root = process.cwd()
  const registry = JSON.parse(await readFile(path.join(root, "registry.json"), "utf8")) as { items: Item[] }
  const preset = await readFile(path.join(root, "presets/components.registries.json"), "utf8")
  const groups = [
    { label: "Design system themes", items: registry.items.filter((i) => i.type === "registry:theme") },
    { label: "Starter templates", items: registry.items.filter((i) => i.type === "registry:page") },
    { label: "Blocks & components", items: registry.items.filter((i) => ["registry:block", "registry:component"].includes(i.type)) },
    { label: "Fonts (pulled in by themes)", items: registry.items.filter((i) => i.type === "registry:font") },
  ]
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">{NAMESPACE} registry</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        A shadcn registry served from this site at <code className="font-mono text-sm">/r/&#123;name&#125;.json</code>. Add the
        registries preset to a project&apos;s <code className="font-mono text-sm">components.json</code>, then install by name.
      </p>
      <pre className="mt-6 overflow-x-auto rounded-xl border bg-muted/40 p-4 font-mono text-xs">{preset}</pre>
      <CopyCommand className="mt-4 max-w-xl" command={`pnpm dlx shadcn@latest add ${NAMESPACE}/theme-preview`} />

      {groups.map((g) => (
        <section key={g.label} className="mt-10">
          <h2 className="mb-3 text-lg font-semibold">{g.label}</h2>
          <ul className="divide-y rounded-xl border">
            {g.items.map((i) => (
              <li key={i.name} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {i.type === "registry:font" ? (
                      <span className="font-mono text-sm">{NAMESPACE}/{i.name}</span>
                    ) : (
                      <Link href={`/components/oc/${i.name}`} className="font-mono text-sm hover:underline">
                        {NAMESPACE}/{i.name}
                      </Link>
                    )}
                    <Badge variant="outline">{i.type.replace("registry:", "")}</Badge>
                  </div>
                  {i.description ? <p className="mt-1 text-xs text-muted-foreground">{i.description}</p> : null}
                </div>
                <a href={`/r/${i.name}.json`} className="font-mono text-xs text-muted-foreground hover:text-foreground">
                  /r/{i.name}.json
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
