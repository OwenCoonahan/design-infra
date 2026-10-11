import assert from "node:assert/strict"
import test from "node:test"

import { agentMessage } from "../lib/catalog/handoff"

test("handoff preserves the selection, context, and install instructions", () => {
  const message = agentMessage([{
    id: "oc/pricing-simple", title: "Pricing", install: "pnpm dlx shadcn@latest add @oc/pricing-simple",
    live: "https://example.com/pricing", notes: "Keep the yearly toggle.", moods: ["minimal"], themeAware: true,
  }], "our pricing section")
  assert.ok(message.includes("oc/pricing-simple"))
  assert.ok(message.includes("Install: pnpm dlx shadcn@latest add @oc/pricing-simple"))
  assert.ok(message.includes("Live demo: https://example.com/pricing"))
  assert.ok(message.includes("Keep the yearly toggle."))
  assert.ok(message.includes("Apply to: our pricing section"))
  assert.ok(message.includes("rather than recreating them from scratch"))
  const url = new URL(message.split("Compare them live: ")[1])
  assert.equal(url.searchParams.get("ids"), "oc/pricing-simple")
  assert.equal(url.searchParams.get("label"), "our pricing section")
})

test("paid and non-theme-aware selections carry their integration requirements", () => {
  const message = agentMessage([{ id: "vendor/block", title: "Block", access: "paid", themeAware: false }], "")
  assert.ok(message.includes("confirm I have the required vendor access"))
  assert.ok(message.includes("project's theme tokens"))
  assert.ok(message.includes("ask which part of my project"))
  assert.ok(message.includes("Gallery:"))
})
