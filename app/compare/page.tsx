import type { Metadata } from "next"
import Link from "next/link"

import { CompareBoard, type CompareTile } from "@/components/site/compare-board"
import { entryStage } from "@/components/site/entry-stage"
import { comparePath } from "@/lib/catalog/compare-path"
import { encodeMotion } from "@/lib/catalog/facets"
import { compareUrl } from "@/lib/catalog/links"
import { getCatalog, getDesignSystems } from "@/lib/data"
import { cn } from "@/lib/utils"

/**
 *   /compare?ids=a/x,b/y,c/z&theme=<design-system>&mode=light|dark&label=<heading>
 * Same format as lib/catalog/links.ts `compareUrl` — agents hand the user these links.
 */
export const metadata: Metadata = { title: "Compare" }

const DEFAULT_THEME = "editorial"
const MAX = 12

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

export default async function ComparePage(props: PageProps<"/compare">) {
  const sp = await props.searchParams
  const ids = [...new Set((one(sp.ids) ?? "").split(",").map((s) => s.trim()).filter(Boolean))].slice(0, MAX)
  const label = one(sp.label)?.trim() || undefined
  const [catalog, systems] = await Promise.all([getCatalog(), getDesignSystems()])
  const system = systems.find((s) => s.slug === one(sp.theme)) ?? systems.find((s) => s.slug === DEFAULT_THEME) ?? systems[0]
  const requestedMode = one(sp.mode)
  const mode = system.modes.includes(requestedMode as "light" | "dark") ? (requestedMode as "light" | "dark") : system.modes[0]
  const byId = new Map(catalog.map((e) => [e.id, e]))

  const theme = system.slug
  // switching design system resets the mode to that system's default; everything else keeps it
  const href = (next: { ids?: string[]; theme?: string; mode?: string }) => {
    const path = comparePath(next.ids ?? ids, { theme: next.theme ?? theme, label })
    const m = next.mode ?? (next.theme ? undefined : one(sp.mode) && mode)
    return m ? `${path}&mode=${m}` : path
  }

  if (!ids.length)
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Compare</h1>
        <p className="mt-3 text-muted-foreground">
          Nothing to compare yet. Tick a few cards in the <Link href="/components" className="underline underline-offset-4">catalog</Link>{" "}
          and hit <em>Compare</em> in the shortlist bar — or open a link like{" "}
          <code className="font-mono text-xs">/compare?ids=oc/beam-card,magicui/blur-fade&amp;label=Animate+the+card</code>.
        </p>
      </div>
    )

  const tiles: CompareTile[] = ids.map((id) => {
    const removeHref = href({ ids: ids.filter((x) => x !== id) })
    const e = byId.get(id)
    if (!e) return { id, found: false, stageKind: "none", stage: null, removeHref }
    const stage = entryStage(e, { systems, system, mode })
    const m = e.motion
    return {
      id,
      found: true,
      title: e.title,
      source: e.source,
      kind: e.kind,
      access: e.access,
      favorite: e.favorite,
      moods: e.moods,
      motion: encodeMotion(m),
      motionDetail: m
        ? [
            m.technique.join(" + "),
            `${m.cost} cost`,
            m.reducedMotion === true ? "respects reduced motion" : m.reducedMotion === false ? "ignores reduced motion" : undefined,
          ]
            .filter(Boolean)
            .join(" · ")
        : undefined,
      integration: e.integration,
      appliesTo: e.appliesTo,
      notes: e.notes ?? e.description,
      install: e.kind === "inspiration" ? undefined : e.install,
      live: stage.openHref,
      docs: e.docs,
      stageKind: stage.kind,
      stage: stage.node,
      removeHref,
    }
  })

  const found = tiles.filter((t) => t.found).length
  const hasOc = tiles.some((t) => t.source === "oc")

  return (
    <div className="mx-auto max-w-[96rem] px-6 py-10">
      <Link href="/components" className="text-xs text-muted-foreground hover:text-foreground">
        ← Catalog
      </Link>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{label ?? `Compare ${found} option${found === 1 ? "" : "s"}`}</h1>
      <p className="mt-2 max-w-3xl text-muted-foreground">
        {label ? `${found} option${found === 1 ? "" : "s"} side by side. ` : null}
        Our <code className="font-mono text-sm">@design-infra</code> pieces render live under the design system you choose; upstream
        pieces show their live demo where the host allows embedding, otherwise a screenshot with a link to the real thing.
        Pick or pass, then copy the feedback for your agent.
      </p>

      <CompareBoard
        tiles={tiles}
        label={label}
        url={compareUrl(ids, { theme: hasOc ? theme : undefined, label })}
        toolbar={
          <>
            <span className="text-xs text-muted-foreground">Design system</span>
            <nav aria-label="Design system" className="flex flex-wrap gap-1">
              {systems.map((s) => (
                <Link
                  key={s.slug}
                  href={href({ theme: s.slug })}
                  scroll={false}
                  aria-current={s.slug === theme ? "page" : undefined}
                  className={cn(
                    "rounded-md border px-2.5 py-1 text-xs transition-colors hover:bg-muted",
                    s.slug === theme && "border-foreground bg-foreground text-background hover:bg-foreground"
                  )}
                >
                  {s.name}
                </Link>
              ))}
            </nav>
            {system.modes.length > 1 ? (
              <nav aria-label="Mode" className="flex gap-1">
                {system.modes.map((m) => (
                  <Link
                    key={m}
                    href={href({ mode: m })}
                    scroll={false}
                    aria-current={m === mode ? "page" : undefined}
                    className={cn(
                      "rounded-md border px-2.5 py-1 text-xs capitalize transition-colors hover:bg-muted",
                      m === mode && "border-foreground bg-foreground text-background hover:bg-foreground"
                    )}
                  >
                    {m}
                  </Link>
                ))}
              </nav>
            ) : (
              <span className="text-xs text-muted-foreground">{system.modes[0]} only</span>
            )}
          </>
        }
      />
    </div>
  )
}
