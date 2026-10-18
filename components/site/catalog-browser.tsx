"use client"

import { Check, ExternalLink, Plus, Star } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { GalleryPlayback, GalleryPreview, PlaybackControls } from "@/components/site/gallery-preview"
import { FEATURED_TYPES, SECTION_TYPES, categoryLabel } from "@/lib/catalog/galleries"
import { CHART_TYPES, CHART_STYLES, chartFacets } from "@/lib/catalog/chart-styles"
import { visualFirst, type PreviewDescriptor } from "@/lib/catalog/previews"
import { MoodChips, MotionBadge } from "@/components/site/entry-badges"
import { Input } from "@/components/ui/input"
import { encodeMotion, INTENSITIES, INTEGRATIONS, TRIGGERS } from "@/lib/catalog/facets"
import {
  FILTER_KEYS,
  type Filters,
  galleryView,
  filtersToQuery,
  parseFilters,
  searchOptionsFromFilters,
} from "@/lib/catalog/filters"
import { MOOD_NAMES, MOODS, moodsFromText } from "@/lib/catalog/moods"
import { motionFromText, searchCatalog, type SearchEntry } from "@/lib/catalog/search"
import { shortlist, useShortlist } from "@/lib/shortlist"
import { previewSrc } from "@/lib/thumbnails"
import { cn } from "@/lib/utils"

/** What /components ships per entry — keep it lean (~2,200 of these go to the client). */
export type SlimEntry = SearchEntry & {
  preview?: string
  video?: string
  live?: string
  sourceHref?: string
  visual?: PreviewDescriptor
}

const PAGE = 60
const FEATURED_CHART_FORMS = new Set(["line", "area", "bar", "donut", "sparkline", "heatmap"])
const DETAIL_FILTER_KEYS = FILTER_KEYS.filter((key) => !["category", "chartType", "chartStyle"].includes(key))

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
        muted && !active && "opacity-50",
      )}
    >
      {children}
    </button>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-3">
      <span className="w-20 shrink-0 pt-1 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </span>
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
    const next = { ...f, ...patch, ...("category" in patch && patch.category !== "chart" ? { chartType: null, chartStyle: null } : {}) }
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
  const view = galleryView(f)
  const groups = visualFirst(filtered, view)
  const visual = groups.visual.slice(0, limit)
  const sourceOnly = groups.sourceOnly.slice(0, Math.max(0, limit - groups.visual.length))
  const large = f.category ? SECTION_TYPES.has(f.category) : false
  const { chartTypes, chartStyles } = React.useMemo(() => {
    const charts = entries.filter((entry) => entry.categories.includes("chart"))
    return { chartTypes: countBy(charts, (entry) => chartFacets(entry).types), chartStyles: countBy(charts, (entry) => chartFacets(entry).styles) }
  }, [entries])

  return (
    <GalleryPlayback>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {f.category ? `${categoryLabel(f.category)} gallery` : "Component catalog"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {f.category
              ? view === "live"
                ? groups.visual.length
                  ? `Compare playable ${categoryLabel(f.category).toLowerCase()} examples. Try a demo, then shortlist your picks and send them to your agent.`
                  : `Browse ${categoryLabel(f.category).toLowerCase()} libraries and examples on their source sites. Shortlist your picks and send them to your agent.`
                : `Compare ${categoryLabel(f.category).toLowerCase()} screenshots. Open a source demo to see its behavior, then shortlist your picks.`
              : "Find components by type and feeling. Explore live examples, shortlist your options, and copy your picks to your agent."}
          </p>
        </div>
        <nav aria-label="Component types" className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={!f.category}
            onClick={() => update({ category: null })}
            className={cn("rounded-lg border px-3 py-2 text-sm", !f.category && "bg-foreground text-background")}
          >
            Everything
          </button>
          {FEATURED_TYPES.map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={f.category === key}
              onClick={() => update({ category: key })}
              className={cn(
                "rounded-lg border px-3 py-2 text-sm",
                f.category === key && "bg-foreground text-background",
              )}
            >
              {label}
            </button>
          ))}
          <label className="sr-only" htmlFor="all-types">
            All types
          </label>
          <select
            id="all-types"
            aria-label="All types"
            value={FEATURED_TYPES.some(([key]) => key === f.category) ? "" : (f.category ?? "")}
            onChange={(e) => update({ category: e.target.value || null })}
            className="max-w-full rounded-lg border bg-background px-3 py-2 text-sm"
          >
            <option value="">All types</option>
            {facets.categories
              .filter(([key]) => !FEATURED_TYPES.some(([featured]) => featured === key))
              .map(([key]) => (
                <option key={key} value={key}>
                  {categoryLabel(key)}
                </option>
              ))}
          </select>
        </nav>
        {f.category === "chart" ? (
          <div className="flex flex-col gap-2.5" aria-label="Chart styles">
            <Row label="Chart form">
              <Chip active={!f.chartType} onClick={() => update({ chartType: null })}>All forms</Chip>
              {CHART_TYPES.filter(([key]) => chartTypes.has(key) && FEATURED_CHART_FORMS.has(key)).map(([key, label]) => (
                <Chip key={key} active={f.chartType === key} onClick={() => update({ chartType: f.chartType === key ? null : key, view: f.view ?? "grid" })}>{label}</Chip>
              ))}
              <select aria-label="More chart forms" className="max-w-full rounded-full border bg-background px-2.5 py-0.5 text-xs" value={f.chartType && !FEATURED_CHART_FORMS.has(f.chartType) ? f.chartType : ""} onChange={(event) => update({ chartType: event.target.value || null, view: f.view ?? "grid" })}>
                <option value="">More forms</option>
                {CHART_TYPES.filter(([key]) => chartTypes.has(key) && !FEATURED_CHART_FORMS.has(key)).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </Row>
            <Row label="Treatment">
              <Chip active={!f.chartStyle} onClick={() => update({ chartStyle: null })}>All treatments</Chip>
              {CHART_STYLES.filter(([key]) => chartStyles.has(key)).map(([key, label]) => (
                <Chip key={key} active={f.chartStyle === key} onClick={() => update({ chartStyle: f.chartStyle === key ? null : key, view: f.view ?? "grid" })}>{label}</Chip>
              ))}
            </Row>
          </div>
        ) : null}
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center gap-3">
            <Input
              value={f.q}
              onChange={(e) => update({ q: e.target.value })}
              placeholder={f.category === "chart" ? "Describe a chart style — e.g. 'gradient area' or 'compact sparkline'" : "Describe it — e.g. 'clean pricing' or 'subtle button hover'"}
              className="h-10 max-w-xl"
              aria-label="Search the catalog"
              autoFocus={!f.category}
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
              {(f.category === "chart" ? ["gradient area", "compact sparkline", "stacked bars", "dither chart"] : ["clean pricing", "sharp navbar", "subtle button hover", "loading submit button"]).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => update({ q })}
                  className="rounded-full border px-2.5 py-1 hover:text-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
          ) : interpreted.length ? (
            <p className="text-xs text-muted-foreground">
              Looking for: {interpreted.join(" · ")}. Use filters to narrow the results.
            </p>
          ) : null}
          <Row label="Show">
            <Chip active={f.curated} onClick={() => update({ curated: !f.curated })}>
              <Star className="mr-1 inline size-3 fill-current align-[-1px]" /> curated
            </Chip>
            <Chip active={f.free} onClick={() => update({ free: !f.free, paid: false })}>
              free only
            </Chip>
            <Chip active={f.paid} onClick={() => update({ paid: !f.paid, free: false })}>
              include paid
            </Chip>
          </Row>
          <details className="rounded-xl border p-3">
            <summary className="cursor-pointer text-sm text-muted-foreground">
              Filter by feeling, motion, usage or library
              {DETAIL_FILTER_KEYS.some((k) => f[k])
                ? ` · ${DETAIL_FILTER_KEYS.filter((k) => f[k]).length} active`
                : ""}
            </summary>
            <div className="mt-3 flex flex-col gap-2.5">
              <Row label="Feel">
                {MOOD_NAMES.map((m) => (
                  <Chip
                    key={m}
                    active={f.mood === m}
                    onClick={() => toggle("mood", m)}
                    title={MOODS[m].description}
                    muted={!facets.moods.get(m)}
                  >
                    {MOODS[m].label} <span className="opacity-60">{facets.moods.get(m) ?? 0}</span>
                  </Chip>
                ))}
              </Row>
              <Row label="Motion">
                {TRIGGERS.map((t) => (
                  <Chip
                    key={t}
                    active={f.trigger === t}
                    onClick={() => toggle("trigger", t)}
                    muted={!facets.triggers.get(t)}
                  >
                    on {t} <span className="opacity-60">{facets.triggers.get(t) ?? 0}</span>
                  </Chip>
                ))}
                <span className="mx-1 w-px self-stretch bg-border" />
                {INTENSITIES.map((i) => (
                  <Chip
                    key={i}
                    active={f.intensity === i}
                    onClick={() => toggle("intensity", i)}
                    muted={!facets.intensities.get(i)}
                  >
                    {i} <span className="opacity-60">{facets.intensities.get(i) ?? 0}</span>
                  </Chip>
                ))}
              </Row>
              <Row label="Use as">
                {INTEGRATIONS.map((i) => (
                  <Chip
                    key={i}
                    active={f.integration === i}
                    onClick={() => toggle("integration", i)}
                    muted={!facets.integrations.get(i)}
                  >
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
            </div>
          </details>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" className="text-xs text-muted-foreground">
            {filtered.length} total results · {groups.visual.length} with {view === "live" ? "live" : "visual"} previews
            · {groups.sourceOnly.length} {view === "live" ? "without live previews" : "on source sites"}
          </p>
          <div className="flex items-center gap-2">
            <div aria-label="Gallery view" className="flex rounded-lg border p-1 text-xs">
              {(["live", "grid"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={view === mode}
                  onClick={() => update({ view: mode })}
                  className={cn("rounded px-3 py-1", view === mode && "bg-foreground text-background")}
                >
                  {mode === "live" ? "Live view" : "Grid view"}
                </button>
              ))}
            </div>
            {view === "live" ? <PlaybackControls /> : null}
          </div>
        </div>
        {!filtered.length ? (
          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-medium">No matching components yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try naming the component, such as “pricing” or “button,” and add how it should feel. You can also widen
              your filters.
            </p>
            <button
              type="button"
              onClick={() => update({ ...parseFilters({}), q: f.q })}
              className="mt-3 text-sm underline underline-offset-4"
            >
              Clear filters, keep my search
            </button>
            <Link
              href={`/components?q=${encodeURIComponent(f.category ?? "button")}`}
              className="ml-4 text-sm underline underline-offset-4"
            >
              Browse a component type
            </Link>
          </div>
        ) : null}

        {view === "live" && filtered.length > 0 && groups.visual.length === 0 ? (
          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-medium">No live previews available in this selection</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse still screenshots in Grid view, or open a source demo below.
            </p>
            <button
              type="button"
              onClick={() => update({ view: "grid" })}
              className="mt-3 rounded-lg border px-3 py-2 text-sm"
            >
              Browse screenshots
            </button>
          </div>
        ) : null}

        <ul
          aria-label="Visual examples"
          className={cn(
            "grid items-start gap-5 sm:grid-cols-2",
            view === "grid" ? "lg:grid-cols-3 xl:grid-cols-4" : !large && "lg:grid-cols-3",
          )}
        >
          {visual.map((e, order) => {
            const on = pickedIds.has(e.id)
            return (
              <li
                key={e.id}
                data-entry-id={e.id}
                className={cn("overflow-hidden rounded-xl border bg-card", on && "border-foreground")}
              >
                {view === "live" && e.visual ? (
                  <GalleryPreview id={e.id} title={e.title} descriptor={e.visual} poster={e.preview} order={order} />
                ) : (
                  <div className="relative aspect-[16/10] overflow-hidden border-b bg-muted/40">
                    {e.preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previewSrc(e.preview)}
                        alt={`${e.title} preview`}
                        loading="lazy"
                        decoding="async"
                        className="size-full object-contain"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                        {e.visual?.kind === "clip"
                          ? "Motion clip · switch to Live view"
                          : "Interactive demo · switch to Live view"}
                      </div>
                    )}
                    {e.motion ? (
                      <MotionBadge
                        motion={encodeMotion(e.motion)}
                        className="absolute right-2 bottom-2 bg-background/85"
                      />
                    ) : null}
                  </div>
                )}
                <div className="space-y-2 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/components/${e.id}`}
                      className="text-sm font-medium underline-offset-4 hover:underline"
                    >
                      {e.title}
                    </Link>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={on}
                      aria-label={`${on ? "Remove" : "Add"} ${e.title} ${on ? "from" : "to"} shortlist`}
                      onClick={() => shortlist.toggle({ id: e.id, title: e.title })}
                      className={cn(
                        "flex min-h-8 shrink-0 items-center gap-1 rounded-md border px-2 text-[11px]",
                        on && "bg-foreground text-background",
                      )}
                    >
                      {on ? <Check className="size-3" /> : <Plus className="size-3" />}
                      {on ? "Saved" : "Shortlist"}
                    </button>
                  </div>
                  {view === "grid" ? (
                    <p className="line-clamp-2 text-xs text-muted-foreground">{e.notes ?? e.description}</p>
                  ) : null}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{e.source}</span>
                    {e.access !== "free" ? <span className="rounded border px-1.5">{e.access}</span> : null}
                    {view === "grid" ? <MoodChips moods={e.moods} /> : null}
                    {e.live || e.sourceHref ? (
                      <a
                        href={e.live ?? e.sourceHref}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-auto inline-flex items-center gap-1 underline underline-offset-4"
                      >
                        Source <ExternalLink className="size-3" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
        {sourceOnly.length ? (
          <section
            aria-label={view === "live" ? "More examples without live previews" : "More examples on source sites"}
            className="mt-3 space-y-3 border-t pt-6"
          >
            <h2 className="text-lg font-medium">
              {view === "live" ? "More examples without live previews" : "More examples on source sites"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {view === "live"
                ? "These examples have screenshots or source links, but no playable preview here. Browse screenshots in Grid view or open the source demo."
                : "These entries have no hosted visual preview. Open the vendor demo to explore them; access requirements still apply."}
            </p>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sourceOnly.map((e) => {
                const on = pickedIds.has(e.id)
                return (
                  <li key={e.id} data-entry-id={e.id} className="flex flex-col gap-3 rounded-xl border p-4">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/components/${e.id}`} className="text-sm font-medium hover:underline">
                        {e.title}
                      </Link>
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={on}
                        aria-label={`${on ? "Remove" : "Add"} ${e.title} ${on ? "from" : "to"} shortlist`}
                        onClick={() => shortlist.toggle({ id: e.id, title: e.title })}
                        className="rounded border px-2 py-1 text-xs"
                      >
                        {on ? "Saved" : "Shortlist"}
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{e.source}</span>
                      {e.visual?.kind === "static" ? <span>Screenshot only</span> : null}
                      {e.access !== "free" ? <span>{e.access}</span> : null}
                      {e.live || e.sourceHref ? (
                        <a
                          href={e.live ?? e.sourceHref}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-auto underline underline-offset-4"
                        >
                          External demo ↗
                        </a>
                      ) : (
                        <span>Source details</span>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        ) : null}
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
    </GalleryPlayback>
  )
}
