import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"

import { parse as parseYaml } from "yaml"

import { Playbook } from "@/lib/catalog/schema"

/** catalog/playbooks/<component>.md → front matter (directions) + body (guidance prose). */
export function loadPlaybooks(root = process.cwd()) {
  const dir = path.join(root, "catalog/playbooks")
  const out: { playbook: Playbook; body: string; file: string }[] = []
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".md") && f !== "README.md").sort()) {
    const src = readFileSync(path.join(dir, f), "utf8")
    const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(src)
    if (!m) throw new Error(`catalog/playbooks/${f}: missing front matter`)
    const parsed = Playbook.safeParse(parseYaml(m[1]))
    if (!parsed.success)
      throw new Error(`catalog/playbooks/${f}: ${parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`)
    if (parsed.data.component !== f.replace(/\.md$/, "")) throw new Error(`catalog/playbooks/${f}: component must equal file name`)
    out.push({ playbook: parsed.data, body: m[2].trim(), file: `catalog/playbooks/${f}` })
  }
  return out
}
