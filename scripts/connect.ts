import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { config, NAMESPACE, SITE_URL } from "../lib/config"

export function readProjectJson<T>(root: string, file: string, fallback: T): T {
  const target = path.join(root, file)
  if (!existsSync(target)) return fallback
  try { return JSON.parse(readFileSync(target, "utf8")) as T }
  catch { throw new Error(`${file} contains invalid JSON; repair it before running setup`) }
}

export function mergeEntry(entries: Record<string, unknown>, name: string, value: unknown, overwrite = false) {
  if (name in entries && JSON.stringify(entries[name]) !== JSON.stringify(value) && !overwrite) throw new Error(`${name} already has a different configuration. Review it or use --overwrite explicitly.`)
  entries[name] = value
}

export async function connectProject(root: string, client: string, dry: boolean, overwrite: boolean, withMobbin = false) {
  if (!["claude-code", "codex", "cursor", "http"].includes(client)) throw new Error("--client must be claude-code, codex, cursor or http")
  if (withMobbin && !["claude-code", "codex"].includes(client)) throw new Error("--with-mobbin supports --client claude-code or codex")
  const servers = { "design-infra": `${SITE_URL}/mcp`, ...(withMobbin ? { mobbin: "https://api.mobbin.com/mcp" } : {}) }
  const pending = new Map<string, string>()
  if (client === "codex") {
    const file = ".codex/config.toml"
    const current = existsSync(path.join(root, file)) ? readFileSync(path.join(root, file), "utf8") : ""
    let next = current
    for (const [name, url] of Object.entries(servers)) {
      const section = `[mcp_servers.${name}]\nurl = ${JSON.stringify(url)}\n`
      const existing = new RegExp(`\\[mcp_servers\\.(?:${name}|"${name}")\\][\\s\\S]*?(?=\\n\\[|$)`).exec(next)
      if (existing && existing[0].trim() !== section.trim() && !overwrite) throw new Error(`${file} already configures ${name} differently; review it or use --overwrite`)
      next = existing ? next.replace(existing[0], section) : `${next}${next ? "\n" : ""}${section}`
    }
    pending.set(file, next)
  } else if (client !== "http") {
    const file = client === "cursor" ? ".cursor/mcp.json" : ".mcp.json"
    const current = readProjectJson<{ mcpServers?: Record<string, unknown> }>(root, file, {})
    current.mcpServers ??= {}
    for (const [name, url] of Object.entries(servers)) mergeEntry(current.mcpServers, name, { ...(client === "claude-code" ? { type: "http" } : {}), url }, overwrite)
    pending.set(file, JSON.stringify(current, null, 2) + "\n")
  }
  // Existing shadcn projects can install later; connection never creates a new component stack.
  if (existsSync(path.join(root, "components.json"))) {
    const components = readProjectJson<{ registries?: Record<string, unknown> }>(root, "components.json", {})
    components.registries ??= {}
    for (const name of [NAMESPACE, ...config.legacyNamespaces]) mergeEntry(components.registries, name, `${SITE_URL}/r/{name}.json`, overwrite)
    pending.set("components.json", JSON.stringify(components, null, 2) + "\n")
  }
  const start = "<!-- design-infra:start -->", end = "<!-- design-infra:end -->"
  const block = `${start}\n## Design infrastructure\n\n- Read ${SITE_URL}/integrate/raw before UI work. Preserve this project's stack, brand and existing instructions.\n- Search the catalog before building UI; show 3–5 distinct choices with live/gallery links and a comparison. Recommend one and wait unless the user already authorized a choice.\n- For new pages call plan_ui and inspect the page's research sources before composing. Use product screens/flows for apps and data products, website references for marketing/editorial sites, and Component Gallery for anatomy. Research a few relevant accessible examples even if the user did not name a gallery; record observations and map them to installable components. Mobbin is optional and needs the user's own supported account and OAuth connection; use free alternatives when unavailable. If choosing and building is authorized, research internally and report sources afterward.\n- Inspect reference links/screenshots using your browser/image tools; follow ${SITE_URL}/reference/raw, then call match_reference with observed patterns. For section replacements call propose_options and inspect its references.\n- Install only selected, compatible components. A new theme, framework or paid library requires a request. Use existing DESIGN.md when present.\n- Connection: ${client}; MCP ${SITE_URL}/mcp. HTTP fallback: GET ${SITE_URL}/api/search?q=<query>, /api/options?component=<type>&intent=replace, /api/plan?brief=<brief>, /api/references?pattern=<pattern>; POST /api/reference with observed patterns.\n${end}`
  for (const file of ["AGENTS.md", "CLAUDE.md"]) {
    const current = existsSync(path.join(root, file)) ? readFileSync(path.join(root, file), "utf8") : ""
    if (current.includes(start) !== current.includes(end)) throw new Error(`${file} has an incomplete design-infra instruction block; repair it first`)
    pending.set(file, current.includes(start) ? current.replace(new RegExp(`${start}[\\s\\S]*?${end}`), block) : `${current}${current ? "\n\n" : ""}${block}\n`)
  }
  if (!dry) {
    const response = await fetch(`${SITE_URL}/api/search?q=pricing&limit=3`, { signal: AbortSignal.timeout(15_000) })
    if (!response.ok) throw new Error(`Catalog verification failed: HTTP ${response.status}`)
    const data = await response.json() as unknown
    if (!Array.isArray(data) || !data.length) throw new Error("Catalog verification returned no pricing options")
    if (client !== "http") {
      const mcp = await fetch(`${SITE_URL}/mcp`, { method: "POST", headers: { "content-type": "application/json", accept: "application/json, text/event-stream" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "design-infra-bootstrap", version: "1.0.0" } } }), signal: AbortSignal.timeout(15_000) })
      if (!mcp.ok || !(await mcp.text()).includes('"protocolVersion"')) throw new Error("MCP initialization failed; use --client http for the HTTP connection")
    }
    for (const [file, text] of pending) {
      mkdirSync(path.dirname(path.join(root, file)), { recursive: true })
      writeFileSync(path.join(root, file), text)
    }
  }
  console.log(`${dry ? "Plan (verification not run)" : "Catalog verified; project configuration saved"}: ${[...pending.keys()].join(", ")}`)
  console.log("Restart your agent and approve/trust the project MCP configuration if prompted. Then ask it to search for pricing and show three live options. Client tool availability still needs verification in that session.")
  if (withMobbin) console.log(`${dry ? "Would configure Mobbin URL" : "Mobbin URL configured"}; authentication and access have NOT been verified. ${client === "codex" ? "From this trusted project run: codex mcp login mobbin" : "Restart Claude Code, open /mcp, select mobbin and authenticate"}. Sign in with your own supported Mobbin account, then verify its search tools. Free reference galleries work without this connection.`)
}
