import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { anatomyFigures } from "../lib/catalog/anatomy"
import { searchCatalog } from "../lib/catalog/search"
import { CatalogEntry } from "../lib/catalog/schema"
import { previewDescriptor } from "../lib/catalog/previews"

test("Anatomy sync rejects missing exports/live links and excludes early palette-limited figures", () => {
  const readme =
    "## Figures\n\n- `HashMap` (`anatomy-figures/hash-map`): Hash map collisions\n\n## Early examples\n\n- `OnePane` (`anatomy-figures/one-pane`): One pane\n"
  const links = '<section id="svg"><a href="/anatomy/collection/hash-map">Hash map</a></section>'
  assert.deepEqual(anatomyFigures(readme, { "./hash-map": {} }, links), [
    { slug: "hash-map", exportName: "HashMap", title: "Hash map collisions", renderer: "svg" },
  ])
  assert.throws(() => anatomyFigures(readme, {}, links), /no published package export/)
  assert.throws(() => anatomyFigures(readme, { "./hash-map": {} }, ""), /no renderer group|no verified collection link/)
  assert.throws(() => anatomyFigures("## Figures\n\n## Early examples\n", {}, ""), /empty/)
})

test("Anatomy figures and skill are discoverable with accurate install and preview expectations", () => {
  const catalog = JSON.parse(readFileSync("catalog/index.json", "utf8")).map((e: unknown) => CatalogEntry.parse(e))
  const figures = catalog.filter((e: CatalogEntry) => e.source === "anatomy" && e.kind === "component")
  assert.ok(figures.length >= 33)
  assert.ok(
    figures.every(
      (e: CatalogEntry) => e.access === "free" && e.install === "pnpm add anatomy-figures" && e.live && !e.themeAware,
    ),
  )
  for (const query of ["isometric explainer", "hash map", "LRU cache", "debounce"]) {
    assert.ok(
      searchCatalog(catalog, { query, source: "anatomy", limit: 5 }).some((e) => e.kind === "component"),
      query,
    )
  }
  assert.ok(
    catalog.some(
      (e: CatalogEntry) =>
        e.id === "anatomy/anatomy-skill" && e.kind === "tool" && e.install.includes("claude-code codex"),
    ),
  )
  assert.ok(
    figures.every((e: CatalogEntry) => previewDescriptor(e)?.kind !== "interactive"),
    "External documentation is not a hosted adapter",
  )
})
