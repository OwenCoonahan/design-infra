import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { beuiRegistryItems } from "../lib/catalog/beui"
import { linkOnlyMedia } from "../lib/catalog/media-policy"
import { previewDescriptor } from "../lib/catalog/previews"
import { searchCatalog } from "../lib/catalog/search"
import { CatalogEntry } from "../lib/catalog/schema"

const registry = { items: [{ name: "button-stateful", type: "registry:component", title: "Stateful Button", description: "Async action states", files: [{ content: "not catalog metadata" }] }] }
const docs = { components: [{ slug: "button", category: "motion", page_url: "https://beui.dev/components/motion/button" }] }

test("beUI joins exact registry installs to documentation groups and rejects silent upstream drift", () => {
  const [item] = beuiRegistryItems(registry, docs)
  assert.equal(item.name, "button-stateful")
  assert.equal(item.docs, docs.components[0].page_url)
  assert.ok(!("files" in item))
  assert.throws(() => beuiRegistryItems({ items: [] }, docs))
  assert.throws(() => beuiRegistryItems(registry, { components: [{ ...docs.components[0], slug: "unknown" }] }), /No public/)
  assert.throws(() => beuiRegistryItems(registry, { components: [{ ...docs.components[0], page_url: "https://pro.beui.dev/components/button" }] }), /left the free source/)
  assert.throws(() => beuiRegistryItems({ items: [...registry.items, ...registry.items] }, docs), /Duplicate/)
})

test("beUI free installs and Pro future references retain distinct access, media and recommendation boundaries", () => {
  const catalog: CatalogEntry[] = JSON.parse(readFileSync("catalog/index.json", "utf8")).map((entry: unknown) => CatalogEntry.parse(entry))
  const free = catalog.filter((entry) => entry.source === "beui")
  const paid = catalog.filter((entry) => entry.source === "beui-pro")
  assert.ok(free.length >= 140)
  assert.ok(paid.length >= 8)
  assert.ok(free.every((entry) => entry.access === "free" && entry.install === `npx shadcn@latest add @beui/${entry.name}` && new URL(entry.docs!).hostname === "beui.dev"))
  assert.ok(paid.every((entry) => entry.access === "paid" && linkOnlyMedia(entry) && previewDescriptor(entry) === undefined && !entry.preview && !entry.video))
  assert.equal(searchCatalog(catalog, { source: "beui-pro", query: "model picker" }).length, 0)
  assert.ok(searchCatalog(catalog, { source: "beui-pro", query: "model picker", maxAccess: "paid" }).some((entry) => entry.id === "beui-pro/model-picker"))
  assert.ok(searchCatalog(catalog, { source: "beui", query: "loader" }).length)
  assert.ok(catalog.find((entry) => entry.id === "beui/voice-orb")?.categories.every((category) => category !== "loader"))
  assert.ok(catalog.find((entry) => entry.id === "beui/scroll-progress")?.categories.every((category) => category !== "loader"))
  assert.ok(catalog.find((entry) => entry.id === "beui/thinking-shimmer")?.categories.includes("loader"))
})
