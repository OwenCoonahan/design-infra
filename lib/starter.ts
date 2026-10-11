import "server-only"

import { readFile } from "node:fs/promises"
import { cache } from "react"
import selection from "../catalog/starter.json"
import { summarize } from "./catalog/search"
import { getCatalog } from "./data"
import generated from "./starter.generated.json"

export type StarterReport = { checkedAt: string; fingerprint: string; passed: boolean; checks: string[]; scope: string; limitations: string[]; components: string[] }

export const getStarter = cache(async () => {
  const catalog = await getCatalog()
  const report = await readFile("catalog/starter-verification.json", "utf8").then((text) => JSON.parse(text) as StarterReport).catch(() => undefined)
  const current = !!report?.passed && report.fingerprint === generated.fingerprint && report.components.length === selection.entries.length && selection.entries.every((entry) => report.components.includes(entry.id))
  return {
    description: selection.description,
    verification: { status: current ? "passed" : report ? "needs-recheck" : "not-checked", report },
    entries: selection.entries.map((entry) => {
      const component = catalog.find((item) => item.id === entry.id)
      if (!component) throw new Error(`Missing starter component: ${entry.id}`)
      return { ...summarize(component), use: entry.use }
    }),
  }
})
