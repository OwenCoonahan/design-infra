import type { CatalogEntry } from "./schema"

/**
 * Nearest neighbours for "Compare with similar" — a cheap heuristic, not search ranking:
 * shared categories (incl. appliesTo) dominate, then same integration style, kind, shared moods,
 * shared motion triggers; curated/favorite and having something to look at break ties.
 */
export function similarEntries(e: CatalogEntry, catalog: CatalogEntry[], n = 3): CatalogEntry[] {
  const cats = new Set([...e.categories, ...e.appliesTo])
  const triggers = new Set(e.motion?.triggers ?? [])
  const scored: [number, CatalogEntry][] = []
  for (const c of catalog) {
    if (c.id === e.id || c.access === "paid" || c.kind === "inspiration" || c.kind === "theme") continue
    const sharedCats = [...c.categories, ...c.appliesTo].filter((x) => cats.has(x)).length
    if (!sharedCats) continue
    let s = sharedCats * 4
    if (e.integration && c.integration === e.integration) s += 3
    if (c.kind === e.kind) s += 2
    s += c.moods.filter((m) => e.moods.includes(m)).length
    s += (c.motion?.triggers ?? []).filter((t) => triggers.has(t)).length
    if (c.favorite) s += 2
    if (c.curated) s += 1
    if (c.preview || c.demo || c.live) s += 1
    if (c.source !== e.source) s += 0.5 // a little variety
    scored.push([s, c])
  }
  return scored
    .sort((a, b) => b[0] - a[0])
    .slice(0, n)
    .map(([, c]) => c)
}
