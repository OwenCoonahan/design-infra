import type { Mood } from "./moods"
import type { Category, Integration, Kind, MotionIntensity, MotionTrigger } from "./schema"
import type { SearchOptions } from "./search"

/** /components filter state ⇄ URL query (shared by the server page and the client browser). */
/** Filter state — mirrored 1:1 in the URL so a filtered view is shareable. */
export type Filters = {
  view: "live" | "grid" | null
  q: string
  source: string | null
  category: string | null
  chartType: string | null
  chartStyle: string | null
  mood: string | null
  trigger: string | null
  intensity: string | null
  integration: string | null
  kind: string | null
  curated: boolean
  free: boolean
  paid: boolean
}

export const FILTER_KEYS = ["source", "category", "chartType", "chartStyle", "mood", "trigger", "intensity", "integration", "kind"] as const

export function parseFilters(sp: Record<string, string | string[] | undefined>): Filters {
  const one = (k: string) => {
    const v = sp[k]
    return (Array.isArray(v) ? v[0] : v) || null
  }
  return {
    view: one("view") === "live" ? "live" : one("view") === "grid" ? "grid" : null,
    q: one("q") ?? "",
    source: one("source"),
    category: one("category"),
    chartType: one("chartType"),
    chartStyle: one("chartStyle"),
    mood: one("mood"),
    trigger: one("trigger"),
    intensity: one("intensity"),
    integration: one("integration"),
    kind: one("kind"),
    curated: one("curated") === "1",
    free: one("free") === "1",
    paid: one("paid") === "1",
  }
}

export function filtersToQuery(f: Filters) {
  const q = new URLSearchParams()
  if (f.view) q.set("view", f.view)
  if (f.q.trim()) q.set("q", f.q.trim())
  for (const k of FILTER_KEYS) if (f[k]) q.set(k, f[k]!)
  if (f.curated) q.set("curated", "1")
  if (f.free) q.set("free", "1")
  if (f.paid) q.set("paid", "1")
  return q.toString()
}

/** The gallery and HTTP search translate the same shareable URL into the same search. */
export function searchOptionsFromFilters(f: Filters): SearchOptions {
  return {
    query: f.q,
    source: f.source ?? undefined,
    category: (f.category ?? undefined) as Category | undefined,
    chartType: f.chartType ?? undefined,
    chartStyle: f.chartStyle ?? undefined,
    kind: (f.kind ?? undefined) as Kind | undefined,
    requiredMood: (f.mood ?? undefined) as Mood | undefined,
    moods: f.mood ? [f.mood as Mood] : undefined,
    triggers: f.trigger ? [f.trigger as MotionTrigger] : undefined,
    intensity: (f.intensity ?? undefined) as MotionIntensity | undefined,
    integration: (f.integration ?? undefined) as Integration | undefined,
    curatedOnly: f.curated,
    maxAccess: f.free ? "free" : f.paid ? "paid" : "metered",
    excludeInspiration: f.source !== "inspiration" && f.kind !== "inspiration",
  }
}

export const galleryView = (f: Filters) => f.view ?? (f.category ? "live" : "grid")
