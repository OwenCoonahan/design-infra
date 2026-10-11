/**
 * design-infra bootstrap — make any repo ready for design work in one command.
 *
 *   curl -fsSL https://design-infra.vercel.app/bootstrap.mjs -o /tmp/di.mjs && node /tmp/di.mjs [options]
 *   (inside the plugin: node <design-infra>/public/bootstrap.mjs [options])
 *
 * Options
 *   --tier <1-4>        include tools up to this tier (default 2). Tier-4 / keyed tools join automatically
 *                       only when explicitly selected and their key is in the secrets file.
 *   --only a,b          only these tool ids        --skip a,b   skip these tool ids
 *   --theme <slug>      also install @oc/theme-<slug> (and align motion presets to its motion language)
 *   --init-next         create a Next.js app here first if there is no package.json
 *   --dry-run           print the plan, change nothing
 *   --list              print the ranked toolchain and exit
 *   --connect --client claude-code|codex   connect without installing components
 *   --with-mobbin       optionally configure Mobbin with --connect; authenticate separately
 *
 * Secrets live OUTSIDE repos: ~/.config/design-infra/secrets.env (KEY=value lines, chmod 600), or the
 * environment. Registry keys are mirrored into the project's gitignored .env.local; MCP keys go to
 * user-scoped `claude mcp add -s user` entries — never into committed files.
 *
 * Built by `pnpm bootstrap:build` (esbuild) into public/bootstrap.mjs with catalog/toolchain.json inlined.
 */
import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import path from "node:path"
import { parseArgs } from "node:util"

import embeddedSystems from "../lib/design-systems.generated.json"
import embeddedToolchain from "../catalog/toolchain.json"
import { config, configureData, NAMESPACE, SITE_URL } from "../lib/config"
import { connectProject, mergeEntry, readProjectJson } from "./connect"
import { repairFontLayout } from "./font-layout"
import { Tool as ToolSchema } from "../lib/catalog/schema"
import type { Tool, ToolStep } from "../lib/catalog/schema"

const SITE = SITE_URL
const CWD = process.cwd()
const SECRETS_FILE = process.env.DESIGN_INFRA_SECRETS_FILE ?? path.join(homedir(), ".config/design-infra/secrets.env")
const MARK_START = "<!-- design-infra:start -->"
const MARK_END = "<!-- design-infra:end -->"

const { values: opt } = parseArgs({
  options: {
    connect: { type: "boolean", default: false },
    "with-mobbin": { type: "boolean", default: false },
    client: { type: "string", default: "claude-code" },
    overwrite: { type: "boolean", default: false },
    tier: { type: "string", default: "2" },
    only: { type: "string" },
    skip: { type: "string" },
    theme: { type: "string" },
    "init-next": { type: "boolean", default: false },
    "dry-run": { type: "boolean", default: false },
    list: { type: "boolean", default: false },
  },
})
const DRY = opt["dry-run"]
const MAX_TIER = Number(opt.tier)
if (![1, 2, 3, 4].includes(MAX_TIER)) throw new Error("--tier must be 1, 2, 3 or 4")
if (opt.theme && !(embeddedSystems as { slug: string }[]).some((s) => s.slug === opt.theme)) throw new Error("Unknown --theme; see /design-systems")

// ---------------------------------------------------------------------------- helpers

const c = { dim: (s: string) => `\x1b[2m${s}\x1b[0m`, ok: (s: string) => `\x1b[32m${s}\x1b[0m`, warn: (s: string) => `\x1b[33m${s}\x1b[0m`, bold: (s: string) => `\x1b[1m${s}\x1b[0m` }
const log = (s = "") => console.log(s)

function sh(cmd: string, { quiet = false, timeout = 300_000, env = {} as Record<string, string> } = {}) {
  if (DRY) {
    log(c.dim(`  $ ${cmd}`))
    return { ok: true, out: "" }
  }
  const r = spawnSync(cmd, { shell: true, cwd: CWD, stdio: "pipe", timeout, env: { ...process.env, ...env, CI: "1" }, encoding: "utf8" })
  let output = `${r.stdout ?? ""}${r.stderr ?? ""}`
  for (const [key, value] of Object.entries({ ...process.env, ...env })) if (value && value.length >= 4 && /KEY|TOKEN|SECRET/.test(key)) output = output.replaceAll(value, "[REDACTED]")
  if (!quiet && output) log(output)
  if (r.status !== 0) throw new Error("A setup command failed; no successful setup recorded. Check the command above and rerun after resolving it.")
  return { ok: true, out: output }
}

const has = (bin: string) => spawnSync(`command -v ${bin}`, { shell: true }).status === 0
const readJson = <T>(file: string, fallback: T): T => readProjectJson(CWD, file, fallback)
const writeJson = (file: string, data: unknown) => {
  if (DRY) return log(c.dim(`  write ${file}`))
  writeFileSync(path.join(CWD, file), JSON.stringify(data, null, 2) + "\n")
}

function loadSecrets(): Record<string, string> {
  const out: Record<string, string> = {}
  if (existsSync(SECRETS_FILE))
    for (const line of readFileSync(SECRETS_FILE, "utf8").split("\n")) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line)
      if (m && !line.trim().startsWith("#")) out[m[1]] = m[2].replace(/^["']|["']$/g, "")
    }
  for (const [k, v] of Object.entries(process.env)) if (v && /^[A-Z0-9_]+$/.test(k) && /KEY|TOKEN|SECRET/.test(k)) out[k] ??= v
  return out
}

const fill = (s: string) => s // Shell expands placeholders from the environment; never interpolate secret values into command text.

function packageManager() {
  if (existsSync(path.join(CWD, "pnpm-lock.yaml"))) return { add: "pnpm add", addDev: "pnpm add -D", dlx: "pnpm dlx" }
  if (existsSync(path.join(CWD, "bun.lock")) || existsSync(path.join(CWD, "bun.lockb"))) return { add: "bun add", addDev: "bun add -d", dlx: "bunx" }
  if (existsSync(path.join(CWD, "yarn.lock"))) return { add: "yarn add", addDev: "yarn add -D", dlx: "npx" }
  return { add: "npm install", addDev: "npm install -D", dlx: "npx" }
}

async function loadToolchain(): Promise<Tool[]> {
  let tools = configureData(embeddedToolchain as unknown as { tools: Tool[] }).tools
  try {
    const res = await fetch(`${SITE}/api/toolchain`, { signal: AbortSignal.timeout(5000) })
    if (res.ok) tools = ((await res.json()) as { tools: Tool[] }).tools // latest ranking wins over the bundled copy
  } catch {
    /* offline → embedded copy */
  }
  // the raw JSON omits schema defaults
  return tools.map((t) => ToolSchema.parse(t))
}

// ---------------------------------------------------------------------------- main

async function main() {
  if (opt["with-mobbin"] && !opt.connect) throw new Error("--with-mobbin requires --connect")
  if (opt.connect) return connectProject(CWD, opt.client!, DRY!, opt.overwrite!, opt["with-mobbin"])
  if (opt.client !== "claude-code") throw new Error("Advanced toolchain setup supports Claude Code; use --connect for other clients")
  const tools = (await loadToolchain()).sort((a, b) => a.rank - b.rank)
  for (const id of [...(opt.only?.split(",") ?? []), ...(opt.skip?.split(",") ?? [])]) if (!tools.some((t) => t.id === id)) throw new Error(`Unknown tool: ${id}`)

  if (opt.list) {
    log(c.bold("design-infra toolchain (ranked)\n"))
    for (const t of tools) log(`${String(t.rank).padStart(2)}. [tier ${t.tier}] ${t.name.padEnd(28)} ${c.dim(t.why)}`)
    return
  }

  log(c.bold(`\n◆ design-infra bootstrap${DRY ? " (dry run)" : ""} — ${CWD}\n`))
  const secrets = loadSecrets()
  const pm = packageManager()

  // 1. project
  if (!existsSync(path.join(CWD, "package.json"))) {
    if (!opt["init-next"]) {
      log(c.warn("No package.json here. Re-run with --init-next to create a Next.js app, or create one first."))
      process.exit(1)
    }
    sh(`npx create-next-app@latest . --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-pnpm --yes`)
  }
  const pkg = readJson<{ dependencies?: Record<string, string>; devDependencies?: Record<string, string> }>("package.json", {})
  const deps = { ...pkg.dependencies, ...pkg.devDependencies }
  const tw = deps.tailwindcss ?? ""
  if (tw && /^[\^~]?3/.test(tw)) throw new Error("Tailwind v3 detected. Use --connect to browse; migrate separately before installing v4 components.")
  if (!existsSync(path.join(CWD, "components.json"))) {
    log(c.bold("• shadcn init"))
    sh(`${pm.dlx} shadcn@latest init -b radix -p nova -y`)
  }

  // 2. choose tools
  const only = opt.only?.split(",").filter(Boolean)
  const skip = new Set(opt.skip?.split(",").filter(Boolean))
  const chosen: Tool[] = []
  const skipped: { tool: Tool; reason: string }[] = []
  for (const t of tools) {
    if (skip.has(t.id)) continue
    const missing = t.secrets.filter((s) => s.required && !secrets[s.env])
    const keyed = t.secrets.length > 0
    // Key presence alone is not intent: selection still follows --tier or --only.
    const wanted = only ? only.includes(t.id) : t.tier <= MAX_TIER
    if (!wanted) {
      if (keyed && missing.length) skipped.push({ tool: t, reason: `optional — add ${missing.map((m) => `${m.env} (${m.get})`).join(", ")}` })
      continue
    }
    if (missing.length) {
      skipped.push({ tool: t, reason: `needs ${missing.map((m) => `${m.env} (${m.get})`).join(", ")}` })
      continue
    }
    chosen.push(t)
  }

  log(c.bold("• plan"))
  for (const t of chosen) log(`  ${c.ok("+")} [tier ${t.tier}] ${t.name} ${c.dim(`— ${t.use}`)}`)
  for (const s of skipped) log(`  ${c.warn("–")} [tier ${s.tool.tier}] ${s.tool.name} ${c.dim(`— ${s.reason}`)}`)
  log()

  // 3. apply
  const steps = chosen.flatMap((t) => t.setup.map((s) => ({ tool: t, step: s })))
  const of = <K extends ToolStep["kind"]>(k: K) => steps.filter((s) => s.step.kind === k) as { tool: Tool; step: Extract<ToolStep, { kind: K }> }[]

  // registries
  const components = readJson<{ registries?: Record<string, unknown> }>("components.json", {})
  components.registries ??= {}
  for (const { step } of of("registry"))
    mergeEntry(components.registries, step.namespace, step.headers || step.params ? { url: step.url, headers: step.headers, params: step.params } : step.url, opt.overwrite)
  if (chosen.some((t) => t.id === "design-infra")) for (const alias of config.legacyNamespaces) mergeEntry(components.registries, alias, `${SITE}/r/{name}.json`, opt.overwrite)
  log(c.bold(`• registries → components.json (${Object.keys(components.registries).join(", ")})`))
  writeJson("components.json", components)

  // registry secrets → .env.local (gitignored) so shadcn can expand ${VAR}
  const registryEnv = new Set(of("registry").flatMap(({ step }) => [...JSON.stringify(step).matchAll(/\$\{([A-Z0-9_]+)\}/g)].map((m) => m[1])))
  if (registryEnv.size) {
    const gitignore = existsSync(path.join(CWD, ".gitignore")) ? readFileSync(path.join(CWD, ".gitignore"), "utf8") : ""
    if (!DRY && spawnSync("git", ["ls-files", "--error-unmatch", ".env.local"], { cwd: CWD, stdio: "ignore" }).status === 0) throw new Error(".env.local is tracked by Git; stop tracking it before adding credentials")
    if (!DRY) {
      writeFileSync(path.join(CWD, ".gitignore"), `${gitignore}\n.env.local\n`)
      if (spawnSync("git", ["check-ignore", "-q", ".env.local"], { cwd: CWD, stdio: "ignore" }).status !== 0) throw new Error("Cannot verify .env.local is ignored; refusing to write credentials")
    }
    const envPath = path.join(CWD, ".env.local")
    let env = existsSync(envPath) ? readFileSync(envPath, "utf8") : ""
    for (const k of registryEnv) if (secrets[k] && !new RegExp(`^${k}=`, "m").test(env)) env += `${env && !env.endsWith("\n") ? "\n" : ""}${k}=${secrets[k]}\n`
    if (!DRY) writeFileSync(envPath, env)
    log(c.bold(`• registry keys → .env.local (gitignored): ${[...registryEnv].join(", ")}`))
  }

  // project MCP servers
  const mcp = readJson<{ mcpServers?: Record<string, unknown> }>(".mcp.json", {})
  mcp.mcpServers ??= {}
  for (const { step } of of("mcp")) mergeEntry(mcp.mcpServers, step.name, step.config, opt.overwrite)
  log(c.bold(`• MCP servers → .mcp.json (${Object.keys(mcp.mcpServers).join(", ")})`))
  writeJson(".mcp.json", mcp)

  // user-scoped MCP servers with secrets
  for (const { step } of of("mcp-user")) {
    if (!has("claude")) {
      log(c.warn(`  skip ${step.name}: Claude Code CLI not found — run later: ${step.command}`))
      continue
    }
    const exists = spawnSync(`claude mcp get ${step.name}`, { shell: true, stdio: "pipe" }).status === 0
    if (exists) log(c.dim(`  ${step.name}: already configured (user scope)`))
    else {
      log(c.bold(`• user MCP: ${step.name}`))
      sh(fill(step.command), { quiet: true, env: secrets })
    }
  }

  // npm packages
  const runtime = [...new Set(of("npm").filter(({ step }) => !step.dev).flatMap(({ step }) => step.packages))].filter((p) => !deps[p])
  const dev = [...new Set(of("npm").filter(({ step }) => step.dev).flatMap(({ step }) => step.packages))].filter((p) => !deps[p])
  if (runtime.length) {
    log(c.bold(`• packages: ${runtime.join(" ")}`))
    sh(`${pm.add} ${runtime.join(" ")}`)
  }
  if (dev.length) {
    log(c.bold(`• dev packages: ${dev.join(" ")}`))
    sh(`${pm.addDev} ${dev.join(" ")}`)
  }

  // shadcn items (+ optional theme)
  const items = [...new Set(of("shadcn").flatMap(({ step }) => step.items))]
  if (opt.theme) items.unshift(`${NAMESPACE}/theme-${opt.theme}`)
  if (items.length) {
    log(c.bold(`• shadcn add ${items.join(" ")}`))
    sh(`${pm.dlx} shadcn@latest add ${items.join(" ")} -y${opt.overwrite ? " --overwrite" : ""}`, { env: secrets })
    if (!DRY && items.some((item) => item.includes("/theme-")))
      for (const file of repairFontLayout(CWD)) log(`  repaired an empty font class argument left by the CLI in ${file}`)
  }

  // align motion presets with the project's motion language (DESIGN.md `motion:` or the theme's)
  const presets = path.join(CWD, "lib/motion-presets.ts")
  const designMd = existsSync(path.join(CWD, "DESIGN.md")) ? readFileSync(path.join(CWD, "DESIGN.md"), "utf8") : ""
  const lang =
    /^motion:\s*(still|quiet|lively|cinematic)\s*$/m.exec(designMd)?.[1] ??
    (embeddedSystems as { slug: string; motion?: string }[]).find((s) => s.slug === opt.theme)?.motion
  if (lang && existsSync(presets) && !DRY) {
    writeFileSync(presets, readFileSync(presets, "utf8").replace(/PROJECT_MOTION: MotionLanguage = "[a-z]+"/, `PROJECT_MOTION: MotionLanguage = "${lang}"`))
    log(c.bold(`• motion presets → ${lang}`))
  }

  // commands (agent skills, CLI inits)
  const manual: string[] = []
  for (const { tool, step } of of("run")) {
    if (step.interactive) {
      manual.push(`${tool.name}: ${step.command}${step.note ? `  (${step.note})` : ""}`)
      continue
    }
    log(c.bold(`• ${tool.name}: ${step.command}`))
    const r = sh(fill(step.command), { env: secrets })
    if (!r.ok) manual.push(`${tool.name}: ${step.command}  (failed here — run it yourself)`)
  }

  // agent notes → CLAUDE.md / AGENTS.md
  const notes = of("agent-note").map(({ step }) => `- ${step.text}`)
  if (notes.length) {
    const block = `${MARK_START}\n## Design (design-infra)\n\n${notes.join("\n")}\n- Toolchain applied by design-infra bootstrap on ${new Date().toISOString().slice(0, 10)}: ${chosen.map((t) => t.id).join(", ")}.\n${MARK_END}`
    for (const file of ["AGENTS.md", "CLAUDE.md"]) {
      const p = path.join(CWD, file)
      const cur = existsSync(p) ? readFileSync(p, "utf8") : ""
      // CLAUDE.md that only imports AGENTS.md: write the block to AGENTS.md instead
      if (file === "CLAUDE.md" && /^@AGENTS\.md\s*$/m.test(cur) && existsSync(path.join(CWD, "AGENTS.md"))) continue
      const next = cur.includes(MARK_START) ? cur.replace(new RegExp(`${MARK_START}[\\s\\S]*?${MARK_END}`), block) : `${cur}${cur ? "\n\n" : ""}${block}\n`
      if (!DRY) writeFileSync(p, next)
      log(c.bold(`• agent instructions → ${file}`))
    }
  }

  // verify
  log(c.bold("\n• verify"))
  for (const t of chosen.filter((t) => t.verify)) {
    if (DRY) { log(c.dim(`  not run: ${t.name} (${t.verify})`)); continue }
    const r = { ok: spawnSync(t.verify!, { shell: true, cwd: CWD, stdio: "pipe", timeout: 60_000, env: { ...process.env, ...secrets } }).status === 0 }
    if (!r.ok) throw new Error(`Verification failed for ${t.name}; setup is incomplete`)
    log(`  ${r.ok ? c.ok("✓") : c.warn("✗")} ${t.name}${r.ok ? "" : c.dim(`  (${t.verify})`)}`)
  }

  // lockfile
  if (!DRY) {
    mkdirSync(path.join(CWD, ".design-infra"), { recursive: true })
    writeFileSync(
      path.join(CWD, ".design-infra/toolchain.json"),
      JSON.stringify({ appliedAt: new Date().toISOString(), tier: MAX_TIER, theme: opt.theme ?? null, tools: chosen.map((t) => t.id), skipped: skipped.map((s) => ({ id: s.tool.id, reason: s.reason })) }, null, 2) + "\n"
    )
  }

  if (manual.length) {
    log(c.bold("\n• needs you (interactive / failed):"))
    for (const m of manual) log(`  - ${m}`)
  }
  if (skipped.length) {
    log(c.bold(`\n• skipped (add keys to ${SECRETS_FILE} and re-run):`))
    for (const s of skipped) log(`  - ${s.tool.name}: ${s.reason}`)
  }
  log(c.bold(DRY ? "\nDry run complete; no files changed and verification not run." : manual.length ? "\nAutomatic steps passed; manual steps remain. Restart the agent and verify its tools." : "\nSelected setup checks passed. Restart the agent and verify its tools."))
  log(c.dim(`  Next: pick a design system (pick-design-system skill) or describe the product (build-ui).\n`))
}

main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : "Setup failed"); process.exitCode = 1 })
