import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { getCatalog, getSources } from "@/lib/data"

export const metadata = { title: "Sources" }

export default async function SourcesPage() {
  const [sources, catalog] = await Promise.all([getSources(), getCatalog()])
  const count = (slug: string) => catalog.filter((e) => e.source === slug).length
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Sources</h1>
      <p className="mt-2 mb-8 max-w-2xl text-muted-foreground">
        Every library, marketplace and tool we pull from — with licence, install method and gotchas. Paste a new link to
        the design-infra agent to add one (the <code className="font-mono text-sm">ingest-library</code> skill).
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {sources.map(({ meta }) => (
          <Link
            key={meta.slug}
            href={`/sources/${meta.slug}`}
            className="flex flex-col gap-2 rounded-xl border bg-card p-5 transition-colors hover:border-ring"
          >
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">{meta.name}</h2>
              <Badge variant="outline">{meta.type}</Badge>
              <Badge variant="secondary">{meta.access}</Badge>
              {count(meta.slug) ? <span className="ml-auto text-xs text-muted-foreground">{count(meta.slug)} entries</span> : null}
            </div>
            <p className="text-sm text-muted-foreground">{meta.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
