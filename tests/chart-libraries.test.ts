import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { chartLibraries, chartLibraryEntries } from "../lib/catalog/chart-libraries"
import { CatalogEntry } from "../lib/catalog/schema"
import { parseFilters, filtersToQuery, searchOptionsFromFilters } from "../lib/catalog/filters"
import { previewDescriptor } from "../lib/catalog/previews"
import { searchCatalog } from "../lib/catalog/search"
import { proposeOptions } from "../lib/propose"
import { chartFacets } from "../lib/catalog/chart-styles"
import { bklitCharts, tremorCharts } from "../lib/catalog/chart-ui"

const catalog: CatalogEntry[] = JSON.parse(readFileSync("catalog/index.json", "utf8")).map((entry: unknown) => CatalogEntry.parse(entry))

test("chart sync rejects missing, mismatched and changed-license metadata instead of silently promoting access", () => {
  const source = chartLibraries.find((library) => library.slug === "chartjs")!
  const metadata = { "chart.js": { name: "chart.js", version: "4.test", license: "MIT" } }
  const entries = chartLibraryEntries(source, metadata)
  assert.equal(entries.length, 6)
  assert.ok(entries.every((entry) => entry.access === "free"))
  assert.ok(entries.slice(1).every((entry) => entry.integration === "recipe" && entry.notes?.includes("not a standalone")))
  assert.throws(() => chartLibraryEntries(source, {}))
  assert.throws(() => chartLibraryEntries(source, { "chart.js": { ...metadata["chart.js"], name: "other" } }), /Review changed/)
  assert.throws(() => chartLibraryEntries(source, { "chart.js": { ...metadata["chart.js"], license: "Proprietary" } }), /Review changed/)
  assert.throws(() => chartLibraryEntries(source, { "chart.js": { ...metadata["chart.js"], license: "ISC" } }), /changed license/)
})

test("visualization references preserve exact modules and do not claim hosted coverage or install every engine", () => {
  const sources = new Set(chartLibraries.map((library) => library.slug))
  const entries = catalog.filter((entry) => sources.has(entry.source))
  assert.equal(entries.length, 189)
  assert.equal(entries.filter((entry) => entry.kind === "package").length, 29)
  assert.ok(entries.every((entry) => entry.access === "free" && previewDescriptor(entry) === undefined))
  assert.equal(catalog.find((entry) => entry.id === "sigma/library")?.motion, undefined, "WebGL capability must not become an unverified animation claim")
  assert.equal(catalog.find((entry) => entry.id === "plotly/box")?.motion, undefined)
  assert.equal(catalog.find((entry) => entry.id === "nivo/bar")?.install, "pnpm add @nivo/bar")
  assert.equal(catalog.find((entry) => entry.id === "react-flow/custom-nodes")?.install, "pnpm add @xyflow/react")
  const tools = JSON.parse(readFileSync("catalog/toolchain.json", "utf8")).tools as { source?: string }[]
  assert.ok(!tools.some((tool) => tool.source && sources.has(tool.source)), "these engines remain choices rather than bootstrap dependencies")
})

test("network and numeric searches stay on their requested shelves, including shareable graph URLs", () => {
  const graph = parseFilters({ category: "graph", q: "network", source: "sigma", free: "1" })
  assert.deepEqual(parseFilters(Object.fromEntries(new URLSearchParams(filtersToQuery(graph)))), graph)
  const networks = searchCatalog(catalog, searchOptionsFromFilters(graph))
  assert.ok(networks.some((entry) => entry.id === "sigma/network"))
  assert.ok(networks.every((entry) => entry.categories.includes("graph") && entry.access === "free"))
  const charts = searchCatalog(catalog, { category: "chart", query: "bar", limit: 100 })
  assert.ok(charts.some((entry) => entry.id === "chartjs/bar"))
  assert.ok(charts.every((entry) => entry.categories.includes("chart")))
  assert.ok(!catalog.find((entry) => entry.id === "beautifui/flowchart")?.categories.includes("chart"))
})

test("agents get distinct data-task approaches for charts and editable/exploratory graphs", async () => {
  const charts = await proposeOptions({ component: "chart", intent: "replace" })
  assert.equal(charts.playbook?.component, "chart")
  assert.ok(charts.directions.length >= 3 && charts.compare)
  assert.ok(charts.playbook?.guidance.includes("units"))
  const graphs = await proposeOptions({ component: "network diagram", category: "graph", intent: "replace" })
  assert.equal(graphs.playbook?.component, "graph")
  assert.ok(graphs.directions.length >= 3 && graphs.compare)
  assert.ok(graphs.directions.flatMap((direction) => direction.picks).every((entry) => entry.categories.includes("graph") && entry.access === "free"))
})

test("chart forms and visual treatments work across engines without matching unrelated notes", () => {
  const filters = parseFilters({ category: "chart", chartType: "area", chartStyle: "gradient", free: "1", view: "grid" })
  assert.deepEqual(parseFilters(Object.fromEntries(new URLSearchParams(filtersToQuery(filters)))), filters)
  const results = searchCatalog(catalog, { ...searchOptionsFromFilters(filters), limit: catalog.length })
  assert.ok(results.some((entry) => entry.id === "bklit/area-gradient"))
  assert.ok(results.some((entry) => entry.id === "shadcn/chart-area-gradient"))
  assert.ok(results.every((entry) => chartFacets(entry).types.includes("area") && chartFacets(entry).styles.includes("gradient")))
  assert.ok(!results.some((entry) => entry.kind === "package"))
  assert.deepEqual(searchCatalog(catalog, { chartType: "candlestick", chartStyle: "dither" }), [])
  const entry = catalog.find((entry) => entry.id === "chartjs/bar")!
  assert.deepEqual(chartFacets({ ...entry, notes: "Could replace a gradient line" } as typeof entry).styles, [])
  assert.ok(chartFacets(catalog.find((entry) => entry.id === "tremor/spark-chart")!).types.includes("sparkline"))
})

test("chart UI adapters exclude registry plumbing and distinguish public source from the editor", () => {
  const entries = catalog.filter((entry) => entry.source === "bklit")
  assert.equal(entries.filter((entry) => entry.integration === "drop-in").length, 16)
  assert.equal(entries.filter((entry) => entry.integration === "recipe").length, 8)
  assert.ok(entries.every((entry) => entry.access === "free" && !entry.install.includes("studio")))
  assert.ok(!entries.some((entry) => /chart-context|chart-animation|-example/.test(entry.id)))
  assert.equal(catalog.filter((entry) => entry.source === "tremor").length, 11)
  assert.ok(catalog.filter((entry) => entry.source === "tremor").every((entry) => entry.integration === "recipe" && !entry.install.includes("@tremor/react")))
  assert.throws(() => bklitCharts({ items: [{ name: "line-chart", type: "registry:component" }] }), /Review changed/)
  assert.throws(() => tremorCharts([{ name: "AreaChart", type: "dir" }]), /Review removed/)
})

test("additional libraries keep free editions, framework requirements and financial attribution explicit", () => {
  const entry = (id: string) => catalog.find((entry) => entry.id === id)!
  assert.match(entry("mantine-charts/library").install, /@mantine\/charts @mantine\/core @mantine\/hooks recharts/)
  assert.match(entry("layerchart/library").notes!, /Svelte 5.*do not install it into a React project/)
  for (const source of ["mui-charts", "ag-charts"]) {
    const entries = catalog.filter((entry) => entry.source === source)
    assert.ok(entries.length >= 6)
    assert.ok(entries.every((entry) => entry.access === "free" && !/x-charts-pro|x-charts-premium|ag-charts-enterprise/.test(entry.install)))
    assert.ok(entries.every((entry) => /Community/.test(entry.notes!)))
  }
  assert.ok(catalog.filter((entry) => entry.source === "react-force-graph").every((entry) => entry.install === "pnpm add react-force-graph-2d" && !/3d|vr/.test(entry.docs ?? "")))
  assert.match(entry("lightweight-charts/library").notes!, /NOTICE.*visible TradingView attribution/)
  const volume = chartFacets(entry("lightweight-charts/volume-bars"))
  assert.ok(volume.types.includes("bar") && !volume.types.includes("histogram"), "time-indexed volume bars are not statistical distribution histograms")
  const stacked = searchCatalog(catalog, { category: "chart", chartType: "bar", chartStyle: "stacked", limit: catalog.length })
  for (const id of ["chartist/stacked-bar", "billboard/stacked-bar", "unovis/stacked-bar"]) assert.ok(stacked.some((entry) => entry.id === id), id)
})

test("known dual-license expressions are audited exactly; arbitrary MIT-containing expressions still fail", () => {
  for (const slug of ["chartist", "vis-network"]) {
    const library = chartLibraries.find((library) => library.slug === slug)!
    const metadata = Object.fromEntries(library.packages.map((name) => [name, { name, version: "1.test", license: library.license }]))
    assert.ok(chartLibraryEntries(library, metadata).every((entry) => entry.access === "free"))
    assert.throws(() => chartLibraryEntries(library, { ...metadata, [library.package]: { name: library.package, version: "1.test", license: "MIT OR Proprietary" } }), /Review changed/)
  }
})
