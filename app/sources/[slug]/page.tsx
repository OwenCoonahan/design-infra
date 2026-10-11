import Link from "next/link"
import { notFound } from "next/navigation"

import { CopyCommand } from "@/components/site/copy-command"
import { Markdown } from "@/components/site/markdown"
import { Badge } from "@/components/ui/badge"
import { getCatalog, getSource, getSources } from "@/lib/data"

export async function generateStaticParams() {
  return (await getSources()).map((s) => ({ slug: s.meta.slug }))
}

export async function generateMetadata(props: PageProps<"/sources/[slug]">) {
  const { slug } = await props.params
  return { title: (await getSource(slug))?.meta.name ?? slug }
}

export default async function SourcePage(props: PageProps<"/sources/[slug]">) {
  const { slug } = await props.params
  const src = await getSource(slug)
  if (!src) notFound()
  const { meta, body } = src
  const picks = (await getCatalog()).filter((e) => e.source === slug && e.curated)

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[1fr_18rem]">
      <div>
        <Link href="/sources" className="text-xs text-muted-foreground hover:text-foreground">
          ← Sources
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">{meta.name}</h1>
          <Badge variant="outline">{meta.type}</Badge>
          <Badge variant="secondary">{meta.access}</Badge>
        </div>
        <p className="mt-3 text-muted-foreground">{meta.summary}</p>
        <CopyCommand className="mt-5 max-w-2xl" command={meta.install} />
        <Markdown className="mt-4">{body.replace(/^# .*\n/, "")}</Markdown>
      </div>
      <aside className="flex flex-col gap-6 text-sm lg:sticky lg:top-20 lg:self-start">
        <dl className="grid gap-2">
          <dt className="text-xs text-muted-foreground">Website</dt>
          <dd>
            <a className="underline underline-offset-4" href={meta.url}>
              {new URL(meta.url).host}
            </a>
          </dd>
          <dt className="text-xs text-muted-foreground">Licence</dt>
          <dd className="text-muted-foreground">{meta.license}</dd>
          {meta.stack.length ? (
            <>
              <dt className="text-xs text-muted-foreground">Stack</dt>
              <dd>{meta.stack.join(", ")}</dd>
            </>
          ) : null}
          {meta.namespace ? (
            <>
              <dt className="text-xs text-muted-foreground">shadcn namespace</dt>
              <dd className="font-mono">{meta.namespace}</dd>
            </>
          ) : null}
          <dt className="text-xs text-muted-foreground">Vendorable into @design-infra</dt>
          <dd>{meta.vendorable ? "yes" : "no — catalog only"}</dd>
        </dl>
        {picks.length ? (
          <div>
            <h2 className="mb-2 font-semibold">Curated picks</h2>
            <ul className="grid gap-1">
              {picks.map((p) => (
                <li key={p.id}>
                  <Link href={`/components/${p.id}`} className="text-muted-foreground hover:text-foreground">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </aside>
    </div>
  )
}
