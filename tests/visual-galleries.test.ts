import assert from "node:assert/strict"
import test from "node:test"
import { readFileSync } from "node:fs"
import { createHash } from "node:crypto"
import { activePreviews, type PlaybackCandidate } from "../lib/catalog/playback"
import { galleryView, parseFilters, filtersToQuery, searchOptionsFromFilters } from "../lib/catalog/filters"
import { previewDescriptor, hostedPreview, previewDemos, visualFirst } from "../lib/catalog/previews"
import { correctCategories } from "../lib/catalog/galleries"
import { categoryGallery } from "../lib/catalog/links"
import { CatalogEntry } from "../lib/catalog/schema"
const catalog = JSON.parse(readFileSync("catalog/index.json", "utf8")).map((e: unknown) => CatalogEntry.parse(e))
const loading = [
  "oc/agent-status",
  "librariesdev/thinking-orbs",
  "kibo-ui/spinner",
  "smoothui/ai-loader",
  "smoothui/skeleton-loader",
  "smoothui/grid-loader",
  "smoothui/motion-loader",
  "magicui/animated-circular-progress-bar",
]

test("category defaults and explicit view survive a URL reload without affecting search", () => {
  assert.equal(galleryView(parseFilters({})), "grid")
  assert.equal(galleryView(parseFilters({ category: "loader" })), "live")
  assert.equal(galleryView(parseFilters({ category: "loader", view: "invalid" })), "live")
  const f = parseFilters({
    category: "loader",
    view: "grid",
    source: "smoothui",
    mood: "minimal",
    trigger: "loop",
    free: "1",
    q: "subtle",
  })
  assert.deepEqual(parseFilters(Object.fromEntries(new URLSearchParams(filtersToQuery(f)))), f)
  assert.deepEqual(searchOptionsFromFilters(f), searchOptionsFromFilters({ ...f, view: "live" }))
  assert.ok(categoryGallery("loader").endsWith("/components?category=loader"))
})
test("all eight Loading adapters keep the upstream catalog identity and carry provenance", () => {
  for (const id of loading) {
    const entry = catalog.find((e: CatalogEntry) => e.id === id)!
    assert.ok(entry, id)
    assert.ok(entry.install)
    assert.ok(entry.categories.includes("loader"), id)
    assert.equal(previewDescriptor(entry)?.kind, "interactive", id)
    assert.equal(previewDemos[id].provenance.license, "MIT")
    if (previewDemos[id].provenance.sha256) {
      const code = readFileSync(previewDemos[id].provenance.local!)
      assert.equal(createHash("sha256").update(code).digest("hex"), previewDemos[id].provenance.sha256)
    }
  }
  assert.equal(hostedPreview("unknown/spinner"), undefined)
})
test("link-only policy wins even if an entry has video, thumbnail or an allowed adapter id", () => {
  for (const [source, access, kind] of [
    ["transitions", "free", "transition"],
    ["originkit", "metered", "component"],
    ["aceternity", "paid", "block"],
    ["inspiration", "free", "inspiration"],
  ] as const) {
    assert.equal(
      previewDescriptor({
        id: "oc/agent-status",
        source,
        access,
        kind,
        preview: "https://example.com/a.png",
        video: "https://example.com/a.mp4",
      }),
      undefined,
    )
  }
})
test("visual partition preserves recommendation order in each group", () => {
  const entries = [
    { id: "a" },
    { id: "b", visual: { kind: "static" as const } },
    { id: "c", visual: { kind: "clip" as const, src: "clip.mp4" } },
    { id: "d" },
  ]
  const groups = visualFirst(entries)
  assert.deepEqual(
    groups.visual.map((e) => e.id),
    ["b", "c"],
  )
  assert.deepEqual(
    groups.sourceOnly.map((e) => e.id),
    ["a", "d"],
  )
})
test("decorative and reading effects are not waiting indicators", () => {
  for (const [name, source, category] of [
    ["progressive-blur", "smoothui", "scroll-effect"],
    ["scroll-progress", "magicui", "scroll-effect"],
    ["orbiting-circles", "magicui", "background"],
    ["orb", "react-bits", "background"],
    ["orbital-image-wheel", "smoothui", "image"],
  ] as const) {
    const result = correctCategories(name, source, ["loader"])
    assert.ok(result.includes(category))
    assert.ok(!result.includes("loader"))
  }
  assert.deepEqual(correctCategories("siri-orb", "smoothui", ["loader", "agent-ui"]), ["loader", "agent-ui"])
})
const candidates: PlaybackCandidate[] = Array.from({ length: 7 }, (_, order) => ({
  id: String(order),
  order,
  visible: true,
  intent: "auto",
  requested: 0,
}))
test("one budget bounds frames and clips, prioritizes user choices, and cleans up offscreen", () => {
  assert.deepEqual(activePreviews(candidates, true, false, false), ["0", "1", "2"])
  assert.deepEqual(
    activePreviews(
      candidates.map((c) => (c.id === "6" ? { ...c, intent: "play", requested: 1 } : c)),
      true,
      false,
      false,
    ),
    ["6", "0", "1"],
  )
  assert.deepEqual(
    activePreviews(
      candidates.map((c) => (c.id === "0" ? { ...c, visible: false } : c)),
      true,
      false,
      false,
    ),
    ["1", "2", "3"],
  )
  assert.deepEqual(activePreviews(candidates, true, false, true), [])
  assert.deepEqual(activePreviews(candidates, false, false, false), [])
  assert.deepEqual(activePreviews(candidates, true, true, false), [])
  assert.deepEqual(
    activePreviews(
      candidates.map((c) => (c.id === "4" ? { ...c, intent: "play" } : c)),
      false,
      true,
      false,
    ),
    ["4"],
  )
})

test("all explicit adapters resolve catalog entries and migrated effects cannot target Loading", () => {
  for (const [id, demo] of Object.entries(previewDemos)) {
    assert.ok(
      catalog.some((e: CatalogEntry) => e.id === id),
      id,
    )
    assert.ok(["oc", "loading"].includes(demo.adapter))
    assert.ok(demo.width > 0 && demo.height > 0)
  }
  for (const id of [
    "magicui/orbiting-circles",
    "react-bits/orb",
    "motion-primitives/scroll-progress",
    "smoothui/progressive-blur",
  ]) {
    const entry = catalog.find((e: CatalogEntry) => e.id === id)!
    assert.ok(!entry.categories.includes("loader"), id)
    assert.ok(!entry.appliesTo.includes("loader"), id)
  }
})
