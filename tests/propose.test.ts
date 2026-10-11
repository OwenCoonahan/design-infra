import assert from "node:assert/strict"
import test from "node:test"

import { proposeOptions } from "../lib/propose"

test("switching out a feature section gives real alternative layouts and a comparison", async () => {
  const result = await proposeOptions({ component: "feature section", request: "I want to switch this out. I don't like the look." })
  assert.equal(result.understood.intent, "replace")
  const picks = result.directions.flatMap((d) => d.picks)
  assert.ok(picks.length >= 3 && result.directions.length <= 5)
  for (const id of ["oc/feature-bento", "oc/feature-list", "oc/feature-levels"]) assert.ok(picks.some((e) => e.id === id), `Missing distinct option ${id}`)
  assert.ok(picks.every((e) => e.categories.includes("features") && e.access !== "paid" && e.install && e.page))
  assert.equal(new Set(picks.map((e) => e.id)).size, picks.length)
  assert.deepEqual(new URL(result.compare!).searchParams.get("ids")?.split(","), result.directions.map((d) => d.picks[0].id))
})

test("replacing pricing cards stays on the pricing shelf rather than card hover effects", async () => {
  const result = await proposeOptions({ component: "pricing cards", intent: "replace", request: "different layout, cleaner" })
  const picks = result.directions.flatMap((d) => d.picks)
  assert.ok(picks.length >= 3)
  assert.ok(picks.every((e) => e.categories.includes("pricing") && e.integration !== "wrapper" && e.integration !== "recipe"))
  assert.ok(result.compare)
})

test("animation choices retain their playbook and the project's quiet motion budget", async () => {
  const result = await proposeOptions({ component: "button", request: "subtle hover animation", motionLanguage: "quiet" })
  assert.equal(result.playbook?.component, "button")
  assert.ok(result.directions.length)
  assert.ok(result.directions.every((d) => d.fit.intent && d.fit.withinMotionLanguage && (!d.intensity || d.intensity === "subtle")))
  assert.ok(result.directions.flatMap((d) => d.picks).every((e) => e.access !== "paid"))
})

test("unknown replacement targets report a catalog gap without unrelated comparisons", async () => {
  const result = await proposeOptions({ component: "moonwalking platypus", intent: "replace" })
  assert.deepEqual(result.directions, [])
  assert.equal(result.compare, null)
})

test("explicit replacement intent wins over motion words and keeps signup buttons on the button shelf", async () => {
  const result = await proposeOptions({ component: "signup button", request: "Replace this boring animation with something cleaner" })
  assert.equal(result.understood.intent, "replace")
  assert.equal(result.playbook?.component, "button")
  assert.ok(result.directions.length)
  assert.ok(result.directions.every((d) => d.picks[0].categories.includes("button")))
})
