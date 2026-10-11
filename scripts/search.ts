/**
 * Ranked catalog search from the terminal — same ranking as the MCP `search_components` tool.
 *
 *   pnpm lookup "pricing toggle"
 *   pnpm lookup "hero" --moods premium,futuristic --limit 8
 *   pnpm lookup "calm" --source inspiration
 *   pnpm lookup "chat" --category ai-chat --json
 *   pnpm lookup "card" --trigger hover,cursor --intensity subtle      # "make this card react on hover, subtly"
 *   pnpm lookup "button" --integration wrapper --applies-to button      # effects that wrap MY button
 * (`pnpm search` is a pnpm built-in, hence `lookup`.)
 */
import { readFileSync } from "node:fs"
import { parseArgs } from "node:util"

import { MOOD_NAMES, type Mood } from "../lib/catalog/moods"
import { CatalogEntry, Category, Integration, MotionIntensity, MotionTrigger } from "../lib/catalog/schema"
import { searchCatalog, summarize } from "../lib/catalog/search"
import { motionLabel } from "../lib/catalog/tags"

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    moods: { type: "string" },
    category: { type: "string" },
    source: { type: "string" },
    trigger: { type: "string" },
    intensity: { type: "string" },
    integration: { type: "string" },
    "applies-to": { type: "string" },
    limit: { type: "string", default: "12" },
    paid: { type: "boolean", default: false },
    json: { type: "boolean", default: false },
  },
})

/** Validate a flag against its enum so a typo fails loudly instead of matching nothing. */
function flag<T>(schema: { safeParse: (v: unknown) => { success: boolean; data?: T } }, name: string, v: string | undefined) {
  if (v === undefined) return undefined
  const r = schema.safeParse(v)
  if (!r.success) {
    console.error(`✗ --${name} ${v}: not one of ${(schema as unknown as { options: string[] }).options.join(", ")}`)
    process.exit(1)
  }
  return r.data
}

const catalog = (JSON.parse(readFileSync("catalog/index.json", "utf8")) as unknown[]).map((e) => CatalogEntry.parse(e))
const moods = (values.moods ?? "").split(",").filter((m): m is Mood => (MOOD_NAMES as string[]).includes(m))
const results = searchCatalog(catalog, {
  query: positionals.join(" "),
  moods,
  category: flag<Category>(Category, "category", values.category),
  source: values.source,
  triggers: values.trigger?.split(",").map((t) => flag<MotionTrigger>(MotionTrigger, "trigger", t.trim())!),
  intensity: flag<MotionIntensity>(MotionIntensity, "intensity", values.intensity),
  integration: flag<Integration>(Integration, "integration", values.integration),
  appliesTo: flag<Category>(Category, "applies-to", values["applies-to"]),
  excludeInspiration: values.source !== "inspiration",
  maxAccess: values.paid ? "paid" : "metered",
  limit: Number(values.limit),
})

if (values.json) console.log(JSON.stringify(results.map((r) => ({ ...summarize(r), score: r.score })), null, 2))
else
  for (const r of results) {
    const how = r.integration && r.integration !== "drop-in" ? `${r.integration}→${r.appliesTo.join(",")}` : (r.integration ?? "")
    console.log(
      `${String(r.score).padStart(5)}  ${r.favorite ? "♥" : " "}${r.curated ? "★" : " "}${r.themeAware ? "◐" : " "} ${r.id.padEnd(48)} [${r.moods.join(", ")}]  ${motionLabel(r.motion)}  ${how}`
    )
    console.log(`${" ".repeat(11)}${r.install}${r.live ? `  ·  ${r.live}` : ""}`)
  }
