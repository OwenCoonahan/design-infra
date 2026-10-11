import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import { filtersToQuery, parseFilters, searchOptionsFromFilters } from "../lib/catalog/filters"
import { moodsFromText } from "../lib/catalog/moods"
import { CatalogEntry } from "../lib/catalog/schema"
import { guessDesignSystems, searchCatalog, type SearchEntry } from "../lib/catalog/search"

const catalog = (JSON.parse(readFileSync("catalog/index.json", "utf8")) as unknown[]).map((e) => CatalogEntry.parse(e))

for (const [query, category] of [
  ["calm pricing", "pricing"],
  ["I want a clean pricing section", "pricing"],
  ["sharp navbar", "navigation"],
  ["subtle button hover", "button"],
  ["loading submit button", "button"],
] as const) {
  test(`everyday request finds usable ${category}: ${query}`, () => {
    const results = searchCatalog(catalog, { query, limit: 5 })
    assert.ok(results.length)
    assert.ok(results[0].categories.includes(category), `Top result was ${results[0].id}`)
    assert.ok(results.some((e) => e.install && (e.live || e.docs)))
    assert.ok(results.every((e) => e.access !== "paid" && e.kind !== "inspiration"))
  })
}

test("compact gallery data and full catalog rank identically", () => {
  const compact: SearchEntry[] = catalog.map((e) => ({
    id: e.id, title: e.title, source: e.source, description: e.description, notes: e.notes,
    tags: e.tags, categories: e.categories, kind: e.kind, access: e.access,
    curated: e.curated, favorite: e.favorite, themeAware: e.themeAware, moods: e.moods,
    integration: e.integration, appliesTo: e.appliesTo,
    motion: e.motion ? { triggers: e.motion.triggers, intensity: e.motion.intensity } : undefined,
  }))
  for (const query of ["calm pricing", "sharp navbar", "subtle button hover", "loading submit button", "clean", ""]) {
    const options = searchOptionsFromFilters(parseFilters({ q: query }))
    assert.deepEqual(searchCatalog(compact, options).map((e) => e.id), searchCatalog(catalog, options).map((e) => e.id))
  }
})

test("explicit filters stay strict even with a conversational query", () => {
  const options = searchOptionsFromFilters(parseFilters({ q: "I want a button", trigger: "hover", intensity: "subtle", free: "1", mood: "refined" }))
  const results = searchCatalog(catalog, { ...options, limit: catalog.length })
  assert.ok(results.length)
  assert.ok(results.every((e) => e.access === "free" && e.motion?.triggers.includes("hover") && e.motion.intensity === "subtle" && e.moods.includes("refined")))
})

test("paid entries require opting in, and free-only takes precedence", () => {
  const paid = catalog.find((e) => e.access === "paid")!
  assert.ok(paid)
  assert.equal(searchCatalog(catalog, { query: paid.id }).some((e) => e.id === paid.id), false)
  assert.equal(searchCatalog(catalog, { query: paid.id, maxAccess: "paid" })[0].id, paid.id)
  assert.equal(searchOptionsFromFilters(parseFilters({ paid: "1", free: "1" })).maxAccess, "free")
})

test("unknown terms do not silently return unrelated favorites", () => {
  assert.deepEqual(searchCatalog(catalog, { query: "moonwalking platypus" }), [])
})

test("a shareable search retains all filters", () => {
  const filters = parseFilters({ q: "sharp navbar", source: "aceternity", category: "navigation", mood: "refined", trigger: "hover", intensity: "subtle", integration: "drop-in", kind: "block", curated: "1", paid: "1" })
  assert.deepEqual(parseFilters(Object.fromEntries(new URLSearchParams(filtersToQuery(filters)))), filters)
})

test("clean and sharp descriptions also steer page design systems", () => {
  assert.ok(moodsFromText("clean and sharp").includes("minimal"))
  assert.ok(moodsFromText("clean and sharp").includes("refined"))
  const systems = [
    { slug: "bold-system", description: "Bold", moods: ["bold" as const] },
    { slug: "clean-system", description: "Clean", moods: ["minimal" as const, "refined" as const] },
  ]
  assert.equal(guessDesignSystems("a clean, sharp website", systems)[0].slug, "clean-system")
  const realSystems = JSON.parse(readFileSync("lib/design-systems.generated.json", "utf8"))
  assert.equal(guessDesignSystems("a clean, sharp app", realSystems)[0].slug, "linear-dark")
})

test("mood words are descriptions even when an explicit mood overrides ranking", () => {
  const results = searchCatalog(catalog, { query: "clean", moods: ["warm"] })
  assert.ok(results.length)
  assert.ok(results.every((e) => e.moods.includes("warm")))
})
