import assert from "node:assert/strict"
import test from "node:test"
import { referencesFor } from "../lib/catalog/references"

test("a named gallery can be found without a component keyword", () => {
  assert.equal(referencesFor("Mobbin")[0]?.slug, "mobbin")
  assert.equal(referencesFor("Landbook")[0]?.slug, "land-book")
  assert.equal(referencesFor("https://mobbin.com/")[0]?.slug, "mobbin")
})

test("explicit Mobbin requests lead and retain paid-access requirements", () => {
  const hits = referencesFor("Mobbin web dashboard")
  assert.equal(hits[0].slug, "mobbin")
  assert.equal(hits[0].url, "https://mobbin.com/explore/web/screens")
  assert.equal(hits[0].access, "paid")
  assert.match(hits[0].accessNote!, /confirm.*account/)
  assert.equal(new Set(hits.map((h) => h.slug)).size, hits.length)
})

test("generic requests stay free-first, and explicit paid exclusion still wins", () => {
  const hits = referencesFor("web dashboard table", undefined)
  assert.ok(hits.some((h) => h.access !== "paid"))
  assert.ok(hits.some((h) => h.slug === "mobbin"))
  assert.equal(hits[0].access === "paid", false)
  assert.ok(!referencesFor({ text: "Mobbin dashboard", includePaid: false }).some((h) => h.slug === "mobbin"))
})
