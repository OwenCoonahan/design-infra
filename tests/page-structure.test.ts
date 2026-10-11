import assert from "node:assert/strict"
import test from "node:test"

import { guessRecipes } from "../lib/catalog/search"
import { planUi } from "../lib/plan"

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
