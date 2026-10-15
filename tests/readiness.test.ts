import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { config, configureData, configureText, ownRegistryDependency, resolveSettings, sitePath } from "../lib/config"
import { linkOnlyMedia } from "../lib/catalog/media-policy"
import { formatFeedback } from "../lib/feedback"
import { planUi } from "../lib/plan"
import selection from "../catalog/starter.json"

test("fork settings rebase self links, namespaces and dependencies while preserving vendor URLs", () => {
  const fork = resolveSettings({ siteUrl: "https://friends.example/", repository: "friends/design-kit", namespace: "@friends", legacyNamespaces: ["@oc"] })
  assert.equal(configureText("https://design-infra.vercel.app/integrate @oc/navbar OwenCoonahan/design-infra", fork), "https://friends.example/integrate @friends/navbar friends/design-kit")
  assert.equal(configureData({ namespace: "@oc" }, fork).namespace, "@friends")
  assert.equal(ownRegistryDependency("@oc/navbar", fork), "https://friends.example/r/navbar.json")
  assert.equal(ownRegistryDependency("@friends/navbar", fork), "https://friends.example/r/navbar.json")
  assert.equal(ownRegistryDependency("https://vendor.example/r/button.json", fork), "https://vendor.example/r/button.json")
  for (const siteUrl of ["https://example.com/path?query=1", "https://example.com/path#hash", "https://example.com/two//slashes", "https://example.com/a%2Fb", "ftp://example.com"]) assert.throws(() => resolveSettings({ ...config, siteUrl }))
})

test("subpath deployments preserve the prefix in agent links and native requests", () => {
  const fork = resolveSettings({ ...config, siteUrl: "https://friends.example/tools/design/" })
  assert.equal(fork.siteUrl, "https://friends.example/tools/design")
  assert.equal(fork.basePath, "/tools/design")
  assert.equal(ownRegistryDependency("@oc/navbar", fork), "https://friends.example/tools/design/r/navbar.json")
  assert.equal(configureText("https://design-infra.vercel.app/mcp", fork), "https://friends.example/tools/design/mcp")
  assert.equal(configureText(`${config.siteUrl}/mcp`, fork), "https://friends.example/tools/design/mcp")
  for (const path of ["/api/entries?ids=oc%2Fagent-status", "/preview/oc/agent-status", "/thumbnails/oc/agent-status.webp", "/guide/raw"]) assert.equal(sitePath(path, fork.basePath), `/tools/design${path}`)
  for (const path of ["#copy", "https://vendor.example/demo", "//vendor.example/demo", "/tools/design", "/tools/design/components", "/tools/design?category=loader"]) assert.equal(sitePath(path, fork.basePath), path)
  assert.equal(sitePath("/components", ""), "/components")
})

test("planning preserves an existing brand and bounds section counts", async () => {
  const result = await planUi("clean SaaS landing page", ["landing"], 500)
  assert.ok(result.pages.every((page) => page.sections.every((section) => section.picks.length <= 8)))
  assert.match(result.setup.join("\n"), /Preserve the project's stack and brand/)
  assert.ok(!result.setup.some((step) => step.includes("create-next-app") || /^pnpm .* add .*theme-/.test(step)))
  assert.ok(result.setup.some((step) => step.includes("explicitly requested")))
})

test("restricted media stays link-only and is absent from generated previews", () => {
  const catalog = JSON.parse(readFileSync("catalog/index.json", "utf8"))
  assert.ok(catalog.some(linkOnlyMedia))
  for (const entry of catalog.filter(linkOnlyMedia)) assert.ok(!entry.preview && !entry.video, entry.id)
  assert.equal(linkOnlyMedia({ source: "oc", access: "free", kind: "block" }), false)
})

test("starter choices are unique free components with install and live links", () => {
  const catalog = JSON.parse(readFileSync("catalog/index.json", "utf8")) as { id: string; access: string; themeAware: boolean; install: string; live?: string }[]
  assert.equal(selection.entries.length, 20)
  assert.equal(new Set(selection.entries.map((entry) => entry.id)).size, 20)
  for (const entry of selection.entries) {
    const component = catalog.find((item) => item.id === entry.id)!
    assert.ok(component && component.access === "free" && component.themeAware && component.install && component.live, entry.id)
  }
})

test("feedback reports capture a reproducible request and outcome without an account", () => {
  const report = formatFeedback({ request: "Replace pricing", component: "oc/pricing-simple", link: "https://example.com/compare", stack: "Next / Codex", outcome: "Installed successfully", details: "Mobile worked" })
  assert.match(report, /Replace pricing/)
  assert.match(report, /Next \/ Codex/)
  assert.match(report, /Installed successfully/)
  assert.match(report, /Mobile worked/)
})
