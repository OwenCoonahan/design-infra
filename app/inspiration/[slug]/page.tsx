import { Columns3, ExternalLink } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { MoodChips, MotionBadge } from "@/components/site/entry-badges"
import { Markdown } from "@/components/site/markdown"
import { ShortlistButton } from "@/components/site/shortlist-button"
import { comparePath } from "@/lib/catalog/compare-path"
import { encodeMotion } from "@/lib/catalog/facets"
import { getCatalog, getInspiration, getInspirations } from "@/lib/data"
import { inspirationBodyForGallery, inspirationShots } from "@/lib/inspiration"
import { previewSrc } from "@/lib/thumbnails"

export const dynamicParams = false

export async function generateStaticParams() {
  return (await getInspirations()).map((i) => ({ slug: i.meta.slug }))
}

export async function generateMetadata(props: PageProps<"/inspiration/[slug]">) {
  const { slug } = await props.params
  return { title: (await getInspiration(slug))?.meta.name ?? slug }
}

export default async function InspirationPage(props: PageProps<"/inspiration/[slug]">) {
  const { slug } = await props.params
  const ins = await getInspiration(slug)
  if (!ins) notFound()
  const { meta, body } = ins
  const [catalog, shots] = await Promise.all([getCatalog(), inspirationShots(slug)])
  const byId = new Map(catalog.map((e) => [e.id, e]))
  const related = meta.related.map((id) => ({ id, e: byId.get(id) }))
  // A related design system becomes the compare page's theme, so the @design-infra blocks render in the site's style.
  const themeId = meta.related.find((id) => /^oc\/theme-/.test(id) && byId.has(id))
  const compareIds = related.filter((r) => r.e && r.e.kind !== "theme").map((r) => r.id)
  const compareHref = comparePath(compareIds, {
    theme: themeId?.replace(/^oc\/theme-/, ""),
    label: `Patterns from ${meta.name}`,
  })

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link href="/inspiration" className="text-xs text-muted-foreground hover:text-foreground">
        ← Inspiration
      </Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold tracking-tight">{meta.name}</h1>
          <a href={meta.url} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground">
            {meta.url.replace(/^https?:\/\//, "")} <ExternalLink className="size-3" />
          </a>
        </div>
        <div className="flex flex-wrap gap-2">
          <ShortlistButton item={{ id: `inspiration/${slug}`, title: meta.name }} />
          {compareIds.length ? (
            <Link
              href={compareHref}
              className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:opacity-90"
            >
              <Columns3 className="size-3.5" /> Compare related ({compareIds.length})
            </Link>
          ) : null}
        </div>
      </div>
      <p className="mt-4 max-w-3xl text-muted-foreground">{meta.summary}</p>
      {meta.likes ? (
        <div className="mt-4 max-w-3xl rounded-xl border bg-card p-4 text-sm">
          <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">Why it is here</p>
          {meta.likes}
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <MoodChips moods={meta.moods} link />
        <span>·</span>
        {meta.categories.map((c) => (
          <Link key={c} href={`/components?category=${c}`} className="hover:text-foreground">
            {c}
          </Link>
        ))}
      </div>

      {shots.hero ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={shots.hero} alt={`${meta.name} hero`} className="mt-8 w-full rounded-xl border" />
      ) : null}

      {related.length ? (
        <section className="mt-12">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Reproduce it with</h2>
              <p className="text-sm text-muted-foreground">Catalog pieces that rebuild its patterns.</p>
            </div>
            {compareIds.length ? (
              <Link href={compareHref} className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
                Compare related →
              </Link>
            ) : null}
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map(({ id, e }) => (
              <li key={id}>
                {e ? (
                  <Link href={`/components/${id}`} className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card hover:border-ring">
                    <div className="relative aspect-[16/9] overflow-hidden border-b bg-muted/40">
                      {e.preview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={previewSrc(e.preview)} alt="" loading="lazy" className="size-full object-cover object-top" />
                      ) : (
                        <div className="flex size-full items-center justify-center font-mono text-xs text-muted-foreground">{e.kind}</div>
                      )}
                      {e.motion ? (
                        <MotionBadge motion={encodeMotion(e.motion)} className="absolute right-2 bottom-2 bg-background/85" />
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col gap-1 p-3">
                      <span className="truncate text-sm font-medium">{e.title}</span>
                      <span className="font-mono text-[11px] text-muted-foreground">{id}</span>
                    </div>
                  </Link>
                ) : (
                  <div className="flex h-full flex-col gap-1 rounded-xl border border-dashed p-3 text-sm text-muted-foreground">
                    <span className="font-mono text-xs">{id}</span>
                    not in the catalog yet
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Markdown className="[&_img]:my-4 [&_img]:rounded-xl [&_img]:border">{inspirationBodyForGallery(slug, body)}</Markdown>
        {shots.full || shots.mobile ? (
          <aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
            {shots.full ? (
              <figure>
                <figcaption className="mb-1.5 text-xs text-muted-foreground">Full page</figcaption>
                <div className="max-h-[36rem] overflow-y-auto rounded-xl border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={shots.full} alt={`${meta.name} full page`} loading="lazy" className="w-full" />
                </div>
              </figure>
            ) : null}
            {shots.mobile ? (
              <figure>
                <figcaption className="mb-1.5 text-xs text-muted-foreground">Mobile</figcaption>
                <div className="mx-auto max-h-[28rem] w-48 overflow-y-auto rounded-xl border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={shots.mobile} alt={`${meta.name} mobile`} loading="lazy" className="w-full" />
                </div>
              </figure>
            ) : null}
          </aside>
        ) : null}
      </div>
    </div>
  )
}
