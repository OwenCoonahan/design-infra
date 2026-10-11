import { Columns3, ExternalLink, Heart, MonitorPlay, Star } from "lucide-react"
import Link from "next/link"
import { notFound, permanentRedirect } from "next/navigation"

import { OC_DEMOS } from "@/components/demos/oc-demos"
import { CopyCommand } from "@/components/site/copy-command"
import { IntegrationBadge, MoodChips, MotionBadge } from "@/components/site/entry-badges"
import { LiveFrame } from "@/components/site/live-frame"
import { ShortlistButton } from "@/components/site/shortlist-button"
import { ThemeStage } from "@/components/site/theme-stage"
import { Badge } from "@/components/ui/badge"
import { comparePath } from "@/lib/catalog/compare-path"
import { encodeMotion, INTEGRATION_HINT, isFrameable, liveUrl } from "@/lib/catalog/facets"
import { similarEntries } from "@/lib/catalog/similar"
import { config } from "@/lib/config"
import { getCatalog, getDesignSystems, getEntry, getSource } from "@/lib/data"
import { previewSrc } from "@/lib/thumbnails"

export async function generateStaticParams() {
  // Pre-render curated entries; the long tail renders on demand.
  return (await getCatalog())
    .filter((e) => e.curated)
    .map((e) => ({ source: e.source === "oc" ? config.namespace.slice(1) : e.source, name: e.name }))
}

export async function generateMetadata(props: PageProps<"/components/[source]/[name]">) {
  const { source, name } = await props.params
  const e = await getEntry(`${source === config.namespace.slice(1) ? "oc" : source}/${name}`)
  return { title: e?.title ?? name }
}

export default async function EntryPage(props: PageProps<"/components/[source]/[name]">) {
  const { source, name } = await props.params
  const e = await getEntry(`${source === config.namespace.slice(1) ? "oc" : source}/${name}`)
  if (!e) notFound()
  if (source === "oc") permanentRedirect(`/components/${config.namespace.slice(1)}/${name}`)
  const src = await getSource(e.source)
  const systems = await getDesignSystems()
  const demo = e.source === "oc" ? OC_DEMOS[e.name] : undefined
  const themeDemo = e.kind === "theme" ? e.name.replace(/^theme-/, "") : undefined
  const live = liveUrl(e)
  const similar = similarEntries(e, await getCatalog())
  const m = e.motion

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link href={`/feedback?component=${encodeURIComponent(e.id)}`} className="mb-4 block text-xs text-muted-foreground underline">Report a problem or share feedback</Link>
      <Link href="/components" className="text-xs text-muted-foreground hover:text-foreground">
        ← Catalog
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">{e.title}</h1>
        {e.curated ? <Badge>
            <Star className="fill-current" /> curated
          </Badge> : null}
        {e.themeAware ? <Badge variant="secondary">theme-aware</Badge> : null}
        <Badge variant="outline">{e.access}</Badge>
      </div>
      <p className="mt-1 font-mono text-xs text-muted-foreground">{e.id}</p>
      {e.description ? <p className="mt-4 max-w-3xl text-muted-foreground">{e.description}</p> : null}

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {e.favorite ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] leading-4">
            <Heart className="size-3 fill-current text-destructive" /> Catalog favorite
          </span>
        ) : null}
        <MotionBadge motion={encodeMotion(m)} />
        <IntegrationBadge integration={e.integration} />
        <MoodChips moods={e.moods} link />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {live ? (
          <a
            href={live}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:opacity-90"
          >
            <MonitorPlay className="size-3.5" /> Open live demo <ExternalLink className="size-3" />
          </a>
        ) : null}
        <ShortlistButton item={{ id: e.id, title: e.title, install: e.install }} />
        {similar.length ? (
          <Link
            href={comparePath([e.id, ...similar.map((x) => x.id)], { label: `${e.title} vs similar` })}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <Columns3 className="size-3.5" /> Compare with similar
          </Link>
        ) : null}
      </div>

      <div className="mt-6 grid gap-3 md:max-w-2xl">
        <CopyCommand command={e.install} />
        {e.dependencies.length ? (
          <p className="text-xs text-muted-foreground">
            npm deps: <span className="font-mono">{e.dependencies.join(", ")}</span>
          </p>
        ) : null}
      </div>

      {e.notes ? (
        <div className="mt-6 max-w-3xl rounded-xl border bg-card p-4 text-sm">
          <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">Our notes</p>
          {e.notes}
        </div>
      ) : null}

      {demo ? (
        <div className="mt-10 flex flex-col gap-6">
          <h2 className="text-lg font-semibold">Live demo — under each design system</h2>
          {systems.map((s) => (
            <div key={s.slug}>
              <p className="mb-2 font-mono text-xs text-muted-foreground">{s.slug}</p>
              <ThemeStage theme={s.slug} modes={s.modes}>
                {demo()}
              </ThemeStage>
            </div>
          ))}
        </div>
      ) : e.kind === "template" ? (
        <div className="mt-10">
          <Link href={`/templates/${e.name}`} className="text-sm text-primary underline underline-offset-4">
            Open the live template preview (all design systems) →
          </Link>
        </div>
      ) : e.kind === "inspiration" ? (
        <div className="mt-10">
          <Link href={`/inspiration/${e.name}`} className="text-sm text-primary underline underline-offset-4">
            Read the full analysis, screenshots and related pieces →
          </Link>
        </div>
      ) : themeDemo ? (
        <div className="mt-10">
          <Link href={`/design-systems/${themeDemo}`} className="text-sm text-primary underline underline-offset-4">
            Open the {themeDemo} design system preview →
          </Link>
        </div>
      ) : isFrameable(live) ? (
        <div className="mt-10 overflow-hidden rounded-xl border">
          <LiveFrame src={live} title={`${e.title} live demo`} height={720} />
        </div>
      ) : e.preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={previewSrc(e.preview)} alt={`${e.title} preview`} className="mt-10 w-full max-w-4xl rounded-xl border" />
      ) : null}

      <dl className="mt-10 grid max-w-3xl grid-cols-[8rem_1fr] gap-x-4 gap-y-2 text-sm">
        <dt className="text-muted-foreground">Source</dt>
        <dd>
          {src ? (
            <Link href={`/sources/${src.meta.slug}`} className="underline underline-offset-4">
              {src.meta.name}
            </Link>
          ) : (
            e.source
          )}
        </dd>
        <dt className="text-muted-foreground">Kind</dt>
        <dd>{e.kind}</dd>
        <dt className="text-muted-foreground">Categories</dt>
        <dd>{e.categories.join(", ")}</dd>
        {e.integration ? (
          <>
            <dt className="text-muted-foreground">Use as</dt>
            <dd>
              {e.integration} <span className="text-muted-foreground">— {INTEGRATION_HINT[e.integration]}</span>
            </dd>
          </>
        ) : null}
        {e.appliesTo.length ? (
          <>
            <dt className="text-muted-foreground">Applies to</dt>
            <dd className="flex flex-wrap gap-x-2">
              {e.appliesTo.map((c) => (
                <Link key={c} href={`/components?category=${c}`} className="underline underline-offset-4">
                  {c}
                </Link>
              ))}
            </dd>
          </>
        ) : null}
        <dt className="text-muted-foreground">Motion</dt>
        <dd>
          {m ? (
            <>
              on {m.triggers.join(", ")} · {m.intensity} · {m.technique.join(" + ")} · {m.cost} cost
              {m.reducedMotion === true ? " · respects reduced motion" : m.reducedMotion === false ? " · ignores reduced motion" : ""}
            </>
          ) : (
            <span className="text-muted-foreground">not tagged (static or unknown)</span>
          )}
        </dd>

        {e.tags.length ? (
          <>
            <dt className="text-muted-foreground">Tags</dt>
            <dd>{e.tags.join(", ")}</dd>
          </>
        ) : null}
        {src ? (
          <>
            <dt className="text-muted-foreground">Licence</dt>
            <dd className="text-muted-foreground">{src.meta.license}</dd>
          </>
        ) : null}
        {live ? (
          <>
            <dt className="text-muted-foreground">Live demo</dt>
            <dd>
              <a href={live} className="inline-flex items-center gap-1 underline underline-offset-4">
                {new URL(live).host} <ExternalLink className="size-3" />
              </a>
            </dd>
          </>
        ) : null}
        {e.docs ? (
          <>
            <dt className="text-muted-foreground">Docs</dt>
            <dd>
              <a href={e.docs} className="inline-flex items-center gap-1 underline underline-offset-4">
                {new URL(e.docs).host} <ExternalLink className="size-3" />
              </a>
            </dd>
          </>
        ) : null}
      </dl>

      {similar.length ? (
        <section className="mt-12">
          <div className="mb-3 flex items-end justify-between gap-4">
            <h2 className="text-lg font-semibold">Similar</h2>
            <Link
              href={comparePath([e.id, ...similar.map((x) => x.id)], { label: `${e.title} vs similar` })}
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Compare all {similar.length + 1} →
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-3">
            {similar.map((x) => (
              <li key={x.id}>
                <Link href={`/components/${x.id}`} className="flex h-full flex-col gap-1 rounded-xl border bg-card p-3 hover:border-ring">
                  <span className="text-sm font-medium">{x.title}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">{x.id}</span>
                  <span className="line-clamp-2 text-xs text-muted-foreground">{x.notes ?? x.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
