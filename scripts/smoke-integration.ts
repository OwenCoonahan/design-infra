import { galleryBase } from "./lib/gallery-base"
import assert from "node:assert/strict"
import { execFile } from "node:child_process"
import { mkdtemp, readFile, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { parseArgs, promisify } from "node:util"

const { values } = parseArgs({ options: { base: { type: "string", default: "http://localhost:3000" } } })
const base = galleryBase(values.base!)
const exec = promisify(execFile)
let session: string | null = null
let id = 0

async function rpc(method: string, params: unknown) {
  const response = await fetch(`${base}/mcp`, { method: "POST", headers: { "content-type": "application/json", accept: "application/json, text/event-stream", ...(session ? { "mcp-session-id": session } : {}) }, body: JSON.stringify({ jsonrpc: "2.0", id: ++id, method, params }), signal: AbortSignal.timeout(30_000) })
  assert.ok(response.ok, `${method}: HTTP ${response.status}`)
  session = response.headers.get("mcp-session-id") ?? session
  const text = await response.text()
  const data = response.headers.get("content-type")?.includes("event-stream") ? JSON.parse(text.split("\n").find((line) => line.startsWith("data:"))!.slice(5)) : JSON.parse(text)
  assert.ok(!data.error, `${method}: ${JSON.stringify(data.error)}`)
  return data.result
}

async function main() {
  const initialized = await rpc("initialize", { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "design-infra-pilot-check", version: "1.0.0" } })
  assert.equal(initialized.serverInfo.name, "design-infra")
  const listed = await rpc("tools/list", {})
  assert.ok(["search_components", "propose_options", "plan_ui", "match_reference", "get_starter_components"].every((name) => listed.tools.some((tool: { name: string }) => tool.name === name)))
  const call = async (name: string, args: unknown) => {
    const result = await rpc("tools/call", { name, arguments: args })
    assert.ok(!result.isError, name)
    return JSON.parse(result.content.find((content: { type: string }) => content.type === "text").text)
  }
  const search = await call("search_components", { query: "clean pricing", limit: 3 })
  assert.ok(JSON.stringify(search).includes("oc/pricing-simple"))
  const replacement = await call("propose_options", { component: "features section", intent: "replace", request: "I don't like this layout" })
  assert.ok(replacement.compare && replacement.directions.length >= 3)
  const reference = await call("match_reference", { description: "A clean landing with a split hero and pricing", patterns: [{ name: "split hero", category: "hero" }, { name: "pricing", category: "pricing" }] })
  assert.equal(reference.patterns.length, 2)
  const plan = await call("plan_ui", { brief: "Clean SaaS landing page", picks_per_section: 3 })
  assert.ok(plan.setup.some((step: string) => step.includes("Preserve")))
  assert.deepEqual(plan.pages.map((page: { pageType: string }) => page.pageType), ["landing"])
  assert.equal(plan.designSystem.recommended, null)
  const dataPlan = await call("plan_ui", { brief: "Clean data focused website", page_types: ["data"], picks_per_section: 3 })
  assert.deepEqual(dataPlan.pages.map((page: { pageType: string }) => page.pageType), ["data"])
  assert.ok(dataPlan.inspiration.some((entry: { id: string }) => entry.id === "inspiration/vela-energy"))
  assert.ok(dataPlan.inspiration.some((entry: { id: string }) => entry.id === "inspiration/breakthrough-energy"))
  const inspiration = await rpc("tools/call", { name: "get_inspiration", arguments: { id: "inspiration/vela-energy" } })
  assert.ok(!inspiration.isError)
  assert.match(inspiration.content[0].text, /https:\/\/www\.velaenergy\.ai\//)
  assert.ok(!inspiration.content[0].text.includes("hero.webp"))
  const starter = await call("get_starter_components", {})
  assert.equal(starter.entries.length, 20)
  for (const client of ["claude-code", "codex"]) {
    const project = await mkdtemp(path.join(tmpdir(), `design-infra-${client}-pilot-`))
    await writeFile(path.join(project, "AGENTS.md"), "Preserve the project's brand.\n")
    const result = await exec(process.execPath, [path.resolve("public/bootstrap.mjs"), "--connect", "--client", client], { cwd: project, env: { ...process.env, NEXT_PUBLIC_SITE_URL: base }, timeout: 30_000 })
    assert.match(result.stdout, /Catalog verified/)
    assert.ok((await readFile(path.join(project, "AGENTS.md"), "utf8")).startsWith("Preserve the project's brand."))
    console.log(`✓ ${client}: fresh project configuration and real endpoint checks (${project})`)
  }
  console.log("✓ MCP: initialization, tool discovery, search, replacement, reference mapping, page plan and starter collection")
}

main().catch((error: unknown) => { console.error(error); process.exitCode = 1 })
