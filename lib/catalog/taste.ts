import { readFileSync } from "node:fs"
import path from "node:path"

import { type CatalogEntry, Dislike } from "@/lib/catalog/schema"

/**
 * Owen's taste memory, the negative half (the positive half is catalog/favorites.json).
 * catalog/dislikes.json entries match by exact id or by a word pattern; matched entries are
 * dropped from proposals (and reported as "skipped because you passed on …").
 */
export function loadDislikes(root = process.cwd()): Dislike[] {
  try {
    const raw = JSON.parse(readFileSync(path.join(root, "catalog/dislikes.json"), "utf8")) as unknown[]
    return raw.map((d) => Dislike.parse(d))
  } catch {
    return []
  }
}

export function dislikeFor(e: Pick<CatalogEntry, "id" | "title" | "tags" | "notes" | "description">, dislikes: Dislike[]) {
  const hay = `${e.id} ${e.title} ${e.tags.join(" ")} ${e.notes ?? ""} ${e.description}`.toLowerCase()
  return dislikes.find((d) => (d.id ? d.id === e.id : d.pattern ? hay.includes(d.pattern.toLowerCase()) : false))
}
