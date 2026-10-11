import { configureData, SITE_URL } from "@/lib/config"

import { readFile } from "node:fs/promises"
import path from "node:path"

import { CopyCommand } from "@/components/site/copy-command"
import { Badge } from "@/components/ui/badge"
import { type Tool, Tool as ToolSchema } from "@/lib/catalog/schema"

export const metadata = { title: "Toolchain" }

const TIER = { 1: "Foundation — always", 2: "Default libraries", 3: "Situational", 4: "Paid · metered · keyed" } as const

function stepLabel(s: Tool["setup"][number]) {
  switch (s.kind) {
    case "registry":
      return `registry ${s.namespace}`
    case "npm":
      return `${s.dev ? "dev " : ""}npm ${s.packages.join(" ")}`
    case "shadcn":
      return `shadcn add ${s.items.join(" ")}`
    case "mcp":
      return `MCP ${s.name}`
    case "mcp-user":
      return `MCP ${s.name} (user, keyed)`
    case "run":
      return s.interactive ? `manual: ${s.command}` : s.command
    case "agent-note":
      return "agent instructions"
  }
}

export default async function ToolchainPage() {
  const raw = JSON.parse(await readFile(path.join(process.cwd(), "catalog/toolchain.json"), "utf8")) as { tools: unknown[] }
  const tools = configureData(raw).tools.map((t) => ToolSchema.parse(t)).sort((a, b) => a.rank - b.rank)
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Toolchain</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Every CLI, MCP server, agent skill, registry and package a project uses — ranked. One command applies tiers 1–2 to
        a compatible React repo. Start with the lighter connection first. Select paid/keyed tools explicitly; keep keys in <code className="font-mono text-sm">~/.config/design-infra/secrets.env</code>.
      </p>
      <div className="mt-6 grid max-w-3xl gap-2">
        <CopyCommand command={`curl -fsSL ${SITE_URL}/bootstrap.mjs -o /tmp/di.mjs && node /tmp/di.mjs --connect --client claude-code`} />
        <CopyCommand command="node /tmp/di.mjs --connect --client codex" />
      </div>

      {([1, 2, 3, 4] as const).map((tier) => (
        <section key={tier} className="mt-12">
          <h2 className="mb-4 text-lg font-semibold">
            Tier {tier} · <span className="text-muted-foreground">{TIER[tier]}</span>
          </h2>
          <ol className="divide-y rounded-xl border">
            {tools
              .filter((t) => t.tier === tier)
              .map((t) => (
                <li key={t.id} className="grid gap-2 p-4 md:grid-cols-[3rem_14rem_1fr]">
                  <span className="font-mono text-2xl text-muted-foreground tabular-nums">{t.rank}</span>
                  <div>
                    <p className="font-medium">
                      {t.docs ? (
                        <a href={t.docs} className="hover:underline">
                          {t.name}
                        </a>
                      ) : (
                        t.name
                      )}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      <Badge variant="outline">{t.track}</Badge>
                      {t.secrets.map((s) => (
                        <Badge key={s.env} variant="secondary">
                          {s.env}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm">
                    <p>{t.why}</p>
                    <p className="mt-1 text-muted-foreground">
                      <span className="font-medium text-foreground">Use:</span> {t.use}
                    </p>
                    {t.setup.length ? (
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {t.setup.map((s, i) => (
                          <li key={i} className="rounded border bg-muted/40 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                            {stepLabel(s)}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </li>
              ))}
          </ol>
        </section>
      ))}
    </div>
  )
}
