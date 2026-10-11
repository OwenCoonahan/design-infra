/**
 * Markdown summary of catalog changes vs a git ref (used by the weekly sync PR body).
 *
 *   tsx scripts/catalog-diff.ts [ref=HEAD]
 */
import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"

type E = { id: string; title: string; access: string; categories: string[]; install: string }

const ref = process.argv[2] ?? "HEAD"
const before: E[] = (() => {
  try {
    return JSON.parse(execFileSync("git", ["show", `${ref}:catalog/index.json`], { encoding: "utf8", maxBuffer: 64 << 20 }))
  } catch {
    return []
  }
})()
const after: E[] = JSON.parse(readFileSync("catalog/index.json", "utf8"))

const old = new Set(before.map((e) => e.id))
const now = new Set(after.map((e) => e.id))
const added = after.filter((e) => !old.has(e.id))
const removed = before.filter((e) => !now.has(e.id))

const bySource = (list: E[]) => {
  const m = new Map<string, E[]>()
  for (const e of list) m.set(e.id.split("/")[0], [...(m.get(e.id.split("/")[0]) ?? []), e])
  return m
}

const lines = [`**${added.length} added, ${removed.length} removed** (catalog now ${after.length} entries).`, ""]
for (const [source, list] of bySource(added)) {
  lines.push(`### New from ${source} (${list.length})`, "", "| id | title | categories | access |", "|---|---|---|---|")
  for (const e of list.slice(0, 60)) lines.push(`| \`${e.id}\` | ${e.title} | ${e.categories.join(", ")} | ${e.access} |`)
  if (list.length > 60) lines.push(`| … | ${list.length - 60} more | | |`)
  lines.push("")
}
if (removed.length) lines.push("### Removed upstream", "", ...removed.map((e) => `- \`${e.id}\``), "")
lines.push("Curate: add the best new entries to `catalog/curated.json` with notes, then `pnpm catalog`.")
console.log(lines.join("\n"))
