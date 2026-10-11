import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import { matchReference, ReferenceInput } from "../lib/catalog/reference"
import { CatalogEntry } from "../lib/catalog/schema"

const catalog = (JSON.parse(readFileSync("catalog/index.json", "utf8")) as unknown[]).map((e) => CatalogEntry.parse(e))

test("an observed page maps its own ordered sections to reusable pieces and live comparisons", () => {
  const input = ReferenceInput.parse({
    source: "https://example.com/reference",
    description: "A clean, sharp landing page with a split hero, feature grid, and pricing.",
    patterns: [
      { name: "split hero", category: "hero", requiredFeatures: ["product image"] },
      { name: "feature section", category: "features", description: "bento grid" },
      { name: "pricing", category: "pricing", requiredFeatures: ["yearly toggle"] },
    ],
  })
  const result = matchReference(catalog, input)
  assert.deepEqual(result.patterns.map((p) => p.name), input.patterns.map((p) => p.name))
  assert.deepEqual(result.patterns[2].requiredFeatures, ["yearly toggle"])
  for (const pattern of result.patterns) {
    assert.equal(pattern.status, "review-options")
    assert.equal(pattern.options.length, 3)
    assert.ok(pattern.options.every((e) => e.categories.includes(pattern.category!) && e.install && e.page && (e.live || e.docs)))
    assert.ok(pattern.options.every((e) => !["theme", "template", "inspiration"].includes(e.kind) && e.access !== "paid"))
    assert.deepEqual(new URL(pattern.compare!).searchParams.get("ids")?.split(","), pattern.options.map((e) => e.id))
  }
  assert.ok(result.moods.includes("minimal") && result.moods.includes("refined"))
})

test("screenshot observations work without a URL and respect motion and preview settings", () => {
  const result = matchReference(catalog, ReferenceInput.parse({
    description: "A calm feature grid shown in a screenshot.",
    patterns: [{ name: "features", category: "features" }],
    motion_language: "quiet", theme: "editorial", options_per_pattern: 5,
  }))
  assert.equal(result.reference.source, null)
  assert.ok(result.patterns[0].options.length)
  assert.ok(result.patterns[0].options.every((e) => !e.motion || e.motion.intensity === "subtle"))
  assert.equal(new URL(result.patterns[0].compare!).searchParams.get("theme"), "editorial")
})

test("unmatched reference details remain a gap instead of a generic page recipe", () => {
  const result = matchReference(catalog, ReferenceInput.parse({ description: "An unusual custom widget", patterns: [{ name: "moonwalking platypus" }] }))
  assert.equal(result.patterns[0].status, "catalog-gap")
  assert.deepEqual(result.patterns[0].options, [])
  assert.equal(result.patterns[0].compare, null)
})

test("a URL alone cannot masquerade as inspected reference observations", () => {
  assert.equal(ReferenceInput.safeParse({ source: "https://example.com" }).success, false)
  assert.equal(ReferenceInput.safeParse({ description: "A page", patterns: [] }).success, false)
})
