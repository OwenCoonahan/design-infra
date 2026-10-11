import assert from "node:assert/strict"
import test from "node:test"

import { guessRecipes } from "../lib/catalog/search"
import { planUi } from "../lib/plan"
import { researchForPage } from "../lib/catalog/research"
import { PAGE_TYPES } from "../lib/catalog/search"

test("page research routes product tasks and website composition to appropriate sources", async () => {
  const data = await planUi("a clean data focused website")
  const research = data.pages[0].research
  assert.equal(research.status, "sources-to-inspect")
  assert.deepEqual(research.sources.map((source) => source.slug), ["component-gallery", "kage", "mobbin"])
  const mobbin = research.sources.find((source) => source.slug === "mobbin")!
  assert.equal(mobbin.url, "https://mobbin.com/explore/web/screens")
  assert.equal(mobbin.access, "paid")
  assert.equal(mobbin.optional, true)
  assert.match(mobbin.connection!, /unknown/)
  const landing = researchForPage("landing", "clean SaaS landing", [])
  assert.deepEqual(landing.sources.map((source) => source.slug), ["land-book", "minimal-gallery", "mobbin"])
  assert.ok(researchForPage("auth-onboarding", "web onboarding", []).sources.find((source) => source.slug === "mobbin")?.links.some((link) => link.url === "https://mobbin.com/explore/web/flows"))
  for (const type of PAGE_TYPES) {
    const sources = researchForPage(type, "clean", []).sources
    assert.ok(sources.length >= 2, type)
    assert.ok(sources.some((source) => source.access !== "paid"), type)
    assert.equal(new Set(sources.map((source) => source.slug)).size, sources.length)
  }
})

test("named research sources lead and retain access requirements and accessible alternatives", () => {
  const sources = researchForPage("data", "Use Mobbin web dashboard examples", []).sources
  assert.equal(sources[0].slug, "mobbin")
  assert.equal(sources[0].access, "paid")
  assert.ok(sources.some((source) => source.access !== "paid"))
})

test("project purpose determines structure without a generic website or SaaS override", () => {
  for (const [brief, types] of [
    ["a clean data focused website", ["data"]],
    ["an analytics dashboard with charts", ["data"]],
    ["clean SaaS landing page", ["landing"]],
    ["an editorial website for an energy institution", ["editorial"]],
    ["API documentation website", ["docs"]],
    ["an online store website", ["commerce"]],
    ["a SaaS app", ["dashboard"]],
    ["a portfolio website", ["portfolio"]],
    ["a marketing landing page and analytics dashboard", ["landing", "data"]],
  ] as const) assert.deepEqual(guessRecipes(brief), types, brief)
})

test("a clean data plan contains data controls and records, not marketing sections or an automatic theme", async () => {
  const plan = await planUi("a clean data focused website", undefined, 3)
  assert.deepEqual(plan.pages.map((page) => page.pageType), ["data"])
  assert.equal(plan.designSystem.recommended, null)
  assert.ok(plan.moods.detected.some((m) => m.mood === "refined"))
  assert.ok(plan.inspiration.some((i) => i.id === "inspiration/vela-energy"))
  assert.ok(plan.inspiration.some((i) => i.id === "inspiration/breakthrough-energy"))
  const sections = plan.pages[0].sections
  assert.ok(sections.some((s) => s.section.includes("Filters")))
  assert.ok(sections.some((s) => s.picks.some((p) => p.categories.includes("chart"))))
  assert.ok(sections.some((s) => s.picks.some((p) => p.categories.includes("table"))))
  assert.ok(!sections.some((s) => /Hero|Pricing|Testimonials/.test(s.section)))
  assert.match(plan.pages[0].guidance.join(" "), /freshness/)
  assert.ok(sections.every((s) => s.picks.every((p) => p.install && p.live && p.access !== "paid")))
})

test("explicit project types override words in a reference or product description", async () => {
  const plan = await planUi("clean data product inspired by an editorial marketing website", ["data"])
  assert.deepEqual(plan.pages.map((p) => p.pageType), ["data"])
})
