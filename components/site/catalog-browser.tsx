"use client"

import { Check, ExternalLink, Heart, Star } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { MoodChips, MotionBadge } from "@/components/site/entry-badges"
import { Input } from "@/components/ui/input"
import { encodeMotion, INTENSITIES, INTEGRATIONS, TRIGGERS } from "@/lib/catalog/facets"
import { FILTER_KEYS, type Filters, filtersToQuery, parseFilters, searchOptionsFromFilters } from "@/lib/catalog/filters"
import { MOOD_NAMES, MOODS, moodsFromText } from "@/lib/catalog/moods"
import { motionFromText, searchCatalog, type SearchEntry } from "@/lib/catalog/search"
import { shortlist, useShortlist } from "@/lib/shortlist"
import { previewSrc } from "@/lib/thumbnails"
import { cn } from "@/lib/utils"

/** What /components ships per entry — keep it lean (~2,200 of these go to the client). */
export type SlimEntry = SearchEntry & { preview?: string; video?: string; live?: string }

const PAGE = 60

/** Plays the entry's preview video while the card is hovered (loads nothing until then). */
function HoverVideo({ src }: { src: string }) {
  const ref = React.useRef<HTMLVideoElement>(null)
  React.useEffect(() => {
    const card = ref.current?.closest(".group")
    if (!card) return
    const play = () => {
      const v = ref.current
      if (!v) return
      if (!v.src) v.src = src
      v.play().catch(() => undefined)
    }
    const stop = () => ref.current?.pause()
    card.addEventListener("mouseenter", play)
    card.addEventListener("mouseleave", stop)
    return () => {
      card.removeEventListener("mouseenter", play)
      card.removeEventListener("mouseleave", stop)
    }
  }, [src])
  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-200 group-hover:opacity-100"
    />
  )
}

function Chip({
  active,
  onClick,
  muted,
  title,
  children,
}: {
  active: boolean
  onClick: () => void
  muted?: boolean
  title?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={title}
      className={cn(
        "rounded-full border px-2.5 py-0.5 text-xs transition-colors",
        active ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
        muted && !active && "opacity-50"
      )}
    >
      {children}
    </button>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-3">
      <span className="w-20 shrink-0 pt-1 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">{label}</span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function countBy<T>(entries: T[], keys: (e: T) => readonly (string | undefined)[]) {
  const counts = new Map<string, number>()
  for (const e of entries) for (const k of keys(e)) if (k) counts.set(k, (counts.get(k) ?? 0) + 1)
  return counts
}

export function CatalogBrowser({ entries, initial }: { entries: SlimEntry[]; initial: Filters }) {
  const [f, setF] = React.useState(initial)
  const picked = useShortlist()
  const pickedIds = React.useMemo(() => new Set(picked.map((p) => p.id)), [picked])

  const update = (patch: Partial<Filters>) => {
    const next = { ...f, ...patch }
    setF(next)
    // Shallow URL update (no server round trip); Next's router stays in sync with native history.
    const qs = filtersToQuery(next)
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname)
  }
  const toggle = (k: (typeof FILTER_KEYS)[number], v: string) => update({ [k]: f[k] === v ? null : v })

  // Pagination resets whenever the filters change (keyed on them, no effect needed).
  const filterKey = filtersToQuery(f)
  const [page, setPage] = React.useState({ key: filterKey, limit: PAGE })
  const limit = page.key === filterKey ? page.limit : PAGE

  const facets = React.useMemo(() => {
    const motions = entries.map((e) => e.motion)
    return {
      sources: [...new Set(entries.map((e) => e.source))],
      categories: [...countBy(entries, (e) => e.categories)].sort((a, b) => b[1] - a[1]),
      kinds: [...countBy(entries, (e) => [e.kind])].sort((a, b) => b[1] - a[1]),
      moods: countBy(entries, (e) => e.moods),
      integrations: countBy(entries, (e) => [e.integration]),
      triggers: countBy(motions, (m) => m?.triggers ?? []),
      intensities: countBy(motions, (m) => [m?.intensity]),
    }
  }, [entries])

  const filtered = React.useMemo(() => {
    return searchCatalog(entries, { ...searchOptionsFromFilters(f), limit: entries.length })
  }, [entries, f])

  const interpreted = [
    ...moodsFromText(f.q).map((m) => MOODS[m].label),
    ...Object.values(motionFromText(f.q)).filter(Boolean),
  ]

  const active = filterKey !== ""

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            value={f.q}
            onChange={(e) => update({ q: e.target.value })}
            placeholder="Describe it — e.g. 'clean pricing' or 'subtle button hover'"
            className="h-10 max-w-xl"
            aria-label="Search the catalog"
            autoFocus
          />
          {active ? (
            <button
              type="button"
              onClick={() => update(parseFilters({}))}
              className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Reset filters
            </button>
          ) : null}
        </div>
        {!f.q ? (
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Try:</span>
            {["clean pricing", "sharp navbar", "subtle button hover", "loading submit button"].map((q) => (
              <button key={q} type="button" onClick={() => update({ q })} className="rounded-full border px-2.5 py-1 hover:text-foreground">{q}</button>
            ))}
          </div>
        ) : interpreted.length ? (
          <p className="text-xs text-muted-foreground">Looking for: {interpreted.join(" · ")}. Use filters to narrow the results.</p>
        ) : null}
        <Row label="Show">
          <Chip active={f.curated} onClick={() => update({ curated: !f.curated })}>
            <Star className="mr-1 inline size-3 fill-current align-[-1px]" /> curated
          </Chip>
          <Chip active={f.free} onClick={() => update({ free: !f.free, paid: false })}>free only</Chip>
          <Chip active={f.paid} onClick={() => update({ paid: !f.paid, free: false })}>include paid</Chip>
        </Row>
        <details className="rounded-xl border p-3">
          <summary className="cursor-pointer text-sm text-muted-foreground">
            Filter by feeling, motion, library, or category
            {FILTER_KEYS.some((k) => f[k]) ? ` · ${FILTER_KEYS.filter((k) => f[k]).length} active` : ""}
          </summary>
          <div className="mt-3 flex flex-col gap-2.5">
            <Row label="Feel">
              {MOOD_NAMES.map((m) => (
                <Chip key={m} active={f.mood === m} onClick={() => toggle("mood", m)} title={MOODS[m].description} muted={!facets.moods.get(m)}>
                  {MOODS[m].label} <span className="opacity-60">{facets.moods.get(m) ?? 0}</span>
                </Chip>
              ))}
            </Row>
            <Row label="Motion">
              {TRIGGERS.map((t) => (
                <Chip key={t} active={f.trigger === t} onClick={() => toggle("trigger", t)} muted={!facets.triggers.get(t)}>
                  on {t} <span className="opacity-60">{facets.triggers.get(t) ?? 0}</span>
                </Chip>
              ))}
              <span className="mx-1 w-px self-stretch bg-border" />
              {INTENSITIES.map((i) => (
                <Chip key={i} active={f.intensity === i} onClick={() => toggle("intensity", i)} muted={!facets.intensities.get(i)}>
                  {i} <span className="opacity-60">{facets.intensities.get(i) ?? 0}</span>
                </Chip>
              ))}
            </Row>
            <Row label="Use as">
              {INTEGRATIONS.map((i) => (
                <Chip key={i} active={f.integration === i} onClick={() => toggle("integration", i)} muted={!facets.integrations.get(i)}>
                  {i} <span className="opacity-60">{facets.integrations.get(i) ?? 0}</span>
                </Chip>
              ))}
              <span className="mx-1 w-px self-stretch bg-border" />
              {facets.kinds.map(([k, n]) => (
                <Chip key={k} active={f.kind === k} onClick={() => toggle("kind", k)}>
                  {k} <span className="opacity-60">{n}</span>
                </Chip>
              ))}
            </Row>
            <Row label="Source">
              {facets.sources.map((s) => (
                <Chip key={s} active={f.source === s} onClick={() => toggle("source", s)}>
                  {s}
                </Chip>
              ))}
            </Row>
            <Row label="Category">
              {facets.categories.map(([c, n]) => (
                <Chip key={c} active={f.category === c} onClick={() => toggle("category", c)}>
                  {c} <span className="opacity-60">{n}</span>
                </Chip>
              ))}
            </Row>
          </div>
        </details>
      </div>

      <p role="status" className="text-xs text-muted-foreground">
        {filtered.length} results · open a live demo, shortlist your options, then compare side by side
      </p>

      {!filtered.length ? (
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-medium">No matching components yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">Try naming the component, such as “pricing” or “button,” and add how it should feel. You can also widen your filters.</p>
          <button type="button" onClick={() => update({ ...parseFilters({}), q: f.q })} className="mt-3 text-sm underline underline-offset-4">Clear filters, keep my search</button>
          <Link href={`/components?q=${encodeURIComponent(f.category ?? "button")}`} className="ml-4 text-sm underline underline-offset-4">Browse a component type</Link>
        </div>
      ) : null}

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.slice(0, limit).map((e) => {
          const on = pickedIds.has(e.id)
          return (
            <li key={e.id} className="relative flex flex-col">
              <Link
                href={`/components/${e.id}`}
                className={cn(
                  "group flex flex-1 flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-ring",
                  on && "border-foreground"
                )}
              >
                <div className="relative aspect-[16/9] overflow-hidden border-b bg-muted/40">
                  {e.preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewSrc(e.preview)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : null}
                  {e.video ? <HoverVideo src={e.video} /> : null}
                  {e.preview || e.video ? null : (
                    <div className="flex size-full items-center justify-center font-mono text-xs text-muted-foreground">
                      {e.kind}
                    </div>
                  )}
                  {e.motion ? <MotionBadge motion={encodeMotion(e.motion)} className="absolute right-2 bottom-2 bg-background/85 backdrop-blur" /> : null}
                </div>
                <div className="flex flex-1 flex-col gap-1.5 p-3">
                  <div className="flex items-center gap-1.5">
                    {e.favorite ? <Heart aria-label="Catalog favorite" className="size-3.5 shrink-0 fill-current text-destructive" /> : null}
                    {e.curated ? <Star aria-label="curated" className="size-3.5 shrink-0 fill-current text-primary" /> : null}
                    <span className="truncate text-sm font-medium">{e.title}</span>
                  </div>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{e.notes ?? e.description}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-1 pt-1">
                    <span className="rounded-full border px-2 py-0.5 text-[11px] leading-4">{e.source}</span>
                    {e.access !== "free" ? (
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] leading-4 text-secondary-foreground">{e.access}</span>
                    ) : null}
                    {e.integration ? (
                      <span className="rounded-full border border-dashed px-2 py-0.5 text-[11px] leading-4 text-muted-foreground">
                        {e.integration}
                      </span>
                    ) : null}
                    <MoodChips moods={e.moods} />
                  </div>
                </div>
              </Link>
              {e.live ? (
                <a href={e.live} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">
                  Open live demo <ExternalLink className="size-3" />
                </a>
              ) : null}
              <button
                type="button"
                role="checkbox"
                aria-checked={on}
                aria-label={on ? `Remove ${e.title} from shortlist` : `Add ${e.title} to shortlist`}
                title={on ? "Remove from shortlist" : "Add to shortlist"}
                onClick={() => shortlist.toggle({ id: e.id, title: e.title })}
                className={cn(
                  "absolute top-2 left-2 flex size-6 items-center justify-center rounded-md border shadow-sm backdrop-blur transition-colors",
                  on
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/40 bg-background/70 text-transparent hover:border-foreground hover:text-muted-foreground"
                )}
              >
                <Check className="size-3.5" strokeWidth={3} />
              </button>
            </li>
          )
        })}
      </ul>
      {filtered.length > limit ? (
        <button
          type="button"
          onClick={() => setPage({ key: filterKey, limit: limit + PAGE })}
          className="mx-auto rounded-lg border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          Show more ({filtered.length - limit} left)
        </button>
      ) : null}
    </div>
  )
}
