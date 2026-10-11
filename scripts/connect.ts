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

export async function connectProject(root: string, client: string, dry: boolean, overwrite: boolean) {
  if (!["claude-code", "codex", "cursor", "http"].includes(client)) throw new Error("--client must be claude-code, codex, cursor or http")
  const pending = new Map<string, string>()
  if (client === "codex") {
    const file = ".codex/config.toml"
    const current = existsSync(path.join(root, file)) ? readFileSync(path.join(root, file), "utf8") : ""
    const section = `[mcp_servers.design-infra]\nurl = ${JSON.stringify(`${SITE_URL}/mcp`)}\n`
    const existing = /\[mcp_servers\.(?:design-infra|"design-infra")\][\s\S]*?(?=\n\[|$)/.exec(current)
    if (existing && existing[0].trim() !== section.trim() && !overwrite) throw new Error(`${file} already configures design-infra differently; review it or use --overwrite`)
    pending.set(file, existing ? current.replace(existing[0], section) : `${current}${current ? "\n" : ""}${section}`)
  } else if (client !== "http") {
    const file = client === "cursor" ? ".cursor/mcp.json" : ".mcp.json"
    const current = readProjectJson<{ mcpServers?: Record<string, unknown> }>(root, file, {})
    current.mcpServers ??= {}
    mergeEntry(current.mcpServers, "design-infra", { ...(client === "claude-code" ? { type: "http" } : {}), url: `${SITE_URL}/mcp` }, overwrite)
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
  const block = `${start}\n## Design infrastructure\n\n- Read ${SITE_URL}/integrate/raw before UI work. Preserve this project's stack, brand and existing instructions.\n- Search the catalog before building UI; show 3–5 distinct choices with live/gallery links and a comparison. Recommend one and wait unless the user already authorized a choice.\n- Inspect reference links/screenshots using your browser/image tools; follow ${SITE_URL}/reference/raw, then call match_reference with observed patterns. For section replacements call propose_options.\n- Install only selected, compatible components. A new theme, framework or paid library requires a request. Use existing DESIGN.md when present.\n- Connection: ${client}; MCP ${SITE_URL}/mcp. HTTP fallback: GET ${SITE_URL}/api/search?q=<query>, /api/options?component=<type>&intent=replace, /api/plan?brief=<brief>; POST /api/reference with observed patterns.\n${end}`
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
}
