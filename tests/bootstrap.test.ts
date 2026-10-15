import assert from "node:assert/strict"
import { execFile } from "node:child_process"
import { mkdtemp, mkdir, readFile, writeFile, readdir, rm } from "node:fs/promises"
import { createServer } from "node:http"
import { tmpdir } from "node:os"
import path from "node:path"
import { promisify } from "node:util"
import test from "node:test"

const exec = promisify(execFile)
const bundle = path.resolve("public/bootstrap.mjs")

async function fixture(callback: (root: string, run: (args: string[]) => Promise<{ stdout: string; stderr: string }>) => Promise<void>, broken = false, tools: unknown[] = [], basePath = "") {
  const root = await mkdtemp(path.join(tmpdir(), "design-infra-bootstrap-test-"))
  const server = createServer((req, res) => {
    if (!req.url?.startsWith(`${basePath}/`)) { res.statusCode = 404; res.end("{}"); return }
    const route = req.url.slice(basePath.length)
    res.setHeader("content-type", "application/json")
    if (broken) { res.statusCode = 503; res.end("{}"); return }
    if (route.startsWith("/api/search")) res.end(JSON.stringify([{ id: "oc/pricing-simple" }]))
    else if (route === "/mcp") res.end(JSON.stringify({ jsonrpc: "2.0", id: 1, result: { protocolVersion: "2025-03-26" } }))
    else if (route === "/api/toolchain") res.end(JSON.stringify({ tools }))
    else { res.statusCode = 404; res.end("{}") }
  })
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const address = server.address(); assert.ok(address && typeof address !== "string")
  const run = (args: string[]) => exec(process.execPath, [bundle, ...args], { cwd: root, env: { ...process.env, NEXT_PUBLIC_SITE_URL: `http://127.0.0.1:${address.port}${basePath}`, DESIGN_INFRA_SECRETS_FILE: path.join(root, "missing-secrets") }, timeout: 30_000 })
  try { await callback(root, run) }
  finally { await new Promise<void>((resolve) => server.close(() => resolve())); await rm(root, { recursive: true, force: true }) }
}

test("Claude Code and Codex connections verify and save endpoints below a site path", async () => {
  for (const client of ["claude-code", "codex"]) await fixture(async (root, run) => {
    const result = await run(["--connect", "--client", client])
    assert.match(result.stdout, /Catalog verified/)
    const saved = await readFile(path.join(root, client === "codex" ? ".codex/config.toml" : ".mcp.json"), "utf8")
    assert.match(saved, /\/tools\/design\/mcp/)
    assert.match(await readFile(path.join(root, "AGENTS.md"), "utf8"), /\/tools\/design\/integrate\/raw/)
  }, false, [], "/tools/design")
})

for (const client of ["claude-code", "codex", "cursor", "http"]) test(`minimal ${client} connection works without a package manifest or theme`, async () => {
  await fixture(async (root, run) => {
    await writeFile(path.join(root, "AGENTS.md"), "Keep our existing brand.\n")
    const output = await run(["--connect", "--client", client])
    assert.match(output.stdout, /Catalog verified/)
    assert.match(output.stdout, /still needs verification/)
    const first = await readFile(path.join(root, "AGENTS.md"), "utf8")
    assert.match(first, /^Keep our existing brand/)
    assert.match(first, /search|Search/)
    assert.match(first, /research sources before composing/)
    await run(["--connect", "--client", client])
    assert.equal(await readFile(path.join(root, "AGENTS.md"), "utf8"), first)
    const files = await readdir(root)
    assert.ok(!files.includes("package.json") && !files.includes("components.json") && !files.includes("DESIGN.md"))
    if (client === "codex") assert.match(await readFile(path.join(root, ".codex/config.toml"), "utf8"), /\[mcp_servers.design-infra\]\nurl = "http:/)
    if (client === "claude-code" || client === "cursor") {
      const config = JSON.parse(await readFile(path.join(root, client === "cursor" ? ".cursor/mcp.json" : ".mcp.json"), "utf8"))
      assert.match(config.mcpServers["design-infra"].url, /\/mcp$/)
      assert.equal(config.mcpServers["design-infra"].type, client === "claude-code" ? "http" : undefined)
      assert.ok(!config.mcpServers.mobbin)
    }
  })
})

for (const client of ["claude-code", "codex"]) test(`optional Mobbin ${client} connection saves URLs without claiming authentication`, async () => {
  await fixture(async (root, run) => {
    const file = client === "codex" ? ".codex/config.toml" : ".mcp.json"
    const original = client === "codex" ? '[mcp_servers.other]\nurl = "https://example.com/mcp"\n' : JSON.stringify({ mcpServers: { other: { command: "custom" } } })
    if (client === "codex") await mkdir(path.join(root, ".codex"))
    await writeFile(path.join(root, file), original)
    const output = await run(["--connect", "--client", client, "--with-mobbin"])
    assert.match(output.stdout, /authentication and access have NOT been verified/)
    assert.match(output.stdout, client === "codex" ? /codex mcp login mobbin/ : /open \/mcp/)
    const saved = await readFile(path.join(root, file), "utf8")
    assert.match(saved, /https:\/\/api.mobbin.com\/mcp/)
    assert.match(saved, /other/)
    await run(["--connect", "--client", client, "--with-mobbin"])
    assert.equal(await readFile(path.join(root, file), "utf8"), saved)
    await run(["--connect", "--client", client])
    assert.equal(await readFile(path.join(root, file), "utf8"), saved)
    const conflict = client === "codex" ? '[mcp_servers.mobbin]\nurl = "https://other.example/mcp"\n' : JSON.stringify({ mcpServers: { mobbin: { url: "https://other.example/mcp" } } })
    await writeFile(path.join(root, file), conflict)
    const rules = await readFile(path.join(root, "AGENTS.md"), "utf8")
    await assert.rejects(run(["--connect", "--client", client, "--with-mobbin"]), /differently|different configuration/)
    assert.equal(await readFile(path.join(root, file), "utf8"), conflict)
    assert.equal(await readFile(path.join(root, "AGENTS.md"), "utf8"), rules)
  })
})

test("Mobbin requires an explicit supported connection and dry run leaves files untouched", async () => {
  await fixture(async (root, run) => {
    for (const args of [["--with-mobbin"], ["--connect", "--client", "http", "--with-mobbin"], ["--connect", "--client", "cursor", "--with-mobbin"]]) await assert.rejects(run(args), /requires --connect|supports --client/)
    const output = await run(["--connect", "--client", "codex", "--with-mobbin", "--dry-run"])
    assert.match(output.stdout, /Would configure Mobbin URL/)
    assert.deepEqual(await readdir(root), [])
  })
})

test("connection preserves other MCP servers and registry aliases", async () => {
  await fixture(async (root, run) => {
    await writeFile(path.join(root, ".mcp.json"), JSON.stringify({ mcpServers: { other: { command: "custom" } } }))
    await writeFile(path.join(root, "components.json"), JSON.stringify({ aliases: { ui: "@/brand/ui" }, registries: { "@other": "https://example.com/{name}" } }))
    await run(["--connect"])
    const config = JSON.parse(await readFile(path.join(root, "components.json"), "utf8"))
    assert.equal(config.aliases.ui, "@/brand/ui")
    assert.equal(config.registries["@other"], "https://example.com/{name}")
    assert.equal(config.registries["@oc"], config.registries["@design-infra"])
    assert.equal(JSON.parse(await readFile(path.join(root, ".mcp.json"), "utf8")).mcpServers.other.command, "custom")
  })
})

test("configuration conflicts and malformed JSON leave files untouched", async () => {
  for (const original of ['{broken', JSON.stringify({ mcpServers: { "design-infra": { url: "https://other.example/mcp" } } })]) await fixture(async (root, run) => {
    await writeFile(path.join(root, ".mcp.json"), original)
    await assert.rejects(run(["--connect"]), /invalid JSON|different configuration/)
    assert.equal(await readFile(path.join(root, ".mcp.json"), "utf8"), original)
    assert.deepEqual(await readdir(root), [".mcp.json"])
  })
})

test("Codex connection preserves other TOML sections and refuses conflicting server tables", async () => {
  await fixture(async (root, run) => {
    await mkdir(path.join(root, ".codex"))
    const original = 'model = "example"\n[mcp_servers.other]\nurl = "https://example.com/mcp"\n'
    await writeFile(path.join(root, ".codex/config.toml"), original)
    await run(["--connect", "--client", "codex"])
    assert.ok((await readFile(path.join(root, ".codex/config.toml"), "utf8")).startsWith(original))
    await writeFile(path.join(root, ".codex/config.toml"), original + '[mcp_servers.design-infra]\nurl = "https://other.example/mcp"\n')
    await assert.rejects(run(["--connect", "--client", "codex"]), /differently/)
  })
})

test("dry run does not mutate or claim verification", async () => {
  await fixture(async (root, run) => {
    const result = await run(["--connect", "--dry-run"])
    assert.match(result.stdout, /verification not run/)
    assert.deepEqual(await readdir(root), [])
  }, true)
})

test("unreachable catalog fails without writing setup files", async () => {
  await fixture(async (root, run) => {
    await assert.rejects(run(["--connect"]), /verification failed/)
    assert.deepEqual(await readdir(root), [])
  }, true)
})

test("invalid setup options fail before writing files", async () => {
  await fixture(async (root, run) => {
    for (const args of [["--tier", "9"], ["--connect", "--client", "unknown"], ["--theme", "made-up"], ["--only", "unknown"]]) await assert.rejects(run(args))
    assert.deepEqual(await readdir(root), [])
  })
})

test("advanced verification failure is fatal and cannot claim ready or record a successful lock", async () => {
  await fixture(async (root, run) => {
    await writeFile(path.join(root, "package.json"), '{"name":"existing"}')
    await writeFile(path.join(root, "components.json"), '{}')
    await assert.rejects(run(["--only", "fixture"]), (error: unknown) => {
      const result = error as { stdout: string; stderr: string }
      assert.match(result.stderr, /Verification failed/)
      assert.ok(!result.stdout.includes("✓ ready"))
      return true
    })
    assert.ok(!(await readdir(root)).includes(".design-infra"))
  }, false, [{ id: "fixture", name: "Fixture", tier: 1, rank: 1, track: "foundation", why: "test", use: "test", setup: [], verify: `${JSON.stringify(process.execPath)} -e "process.exit(1)"` }])
})

test("advanced command failure exits nonzero and redacts credential-shaped environment values", async () => {
  await fixture(async (root, run) => {
    await writeFile(path.join(root, "package.json"), '{"name":"existing"}')
    await writeFile(path.join(root, "components.json"), '{}')
    await writeFile(path.join(root, "missing-secrets"), 'FIXTURE_TOKEN=not-a-real-key-for-a-test\n')
    await assert.rejects(run(["--only", "fixture"]), (error: unknown) => {
      const result = error as { stdout: string; stderr: string }
      assert.match(result.stderr, /setup command failed/)
      assert.match(result.stdout, /\[REDACTED\]/)
      assert.ok(!result.stdout.includes("not-a-real-key-for-a-test"))
      return true
    })
    assert.ok(!(await readdir(root)).includes(".design-infra"))
  }, false, [{ id: "fixture", name: "Fixture", tier: 1, rank: 1, track: "foundation", why: "test", use: "test", setup: [{ kind: "run", command: `${JSON.stringify(process.execPath)} -e "console.log(process.env.FIXTURE_TOKEN); process.exit(1)"` }] }])
})

test("advanced dry run keeps component overwrites opt-in", async () => {
  await fixture(async (root, run) => {
    await writeFile(path.join(root, "package.json"), '{"name":"existing"}')
    await writeFile(path.join(root, "components.json"), '{}')
    const normal = await run(["--only", "fixture", "--dry-run"])
    assert.match(normal.stdout, /shadcn@latest add/)
    assert.ok(!normal.stdout.includes("--overwrite"))
    assert.match((await run(["--only", "fixture", "--dry-run", "--overwrite"])).stdout, /--overwrite/)
  }, false, [{ id: "fixture", name: "Fixture", tier: 1, rank: 1, track: "foundation", why: "test", use: "test", setup: [{ kind: "shadcn", items: ["button"] }] }])
})
