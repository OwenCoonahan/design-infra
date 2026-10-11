import type { CatalogEntry } from "./schema"

/** These sources stay link-only until redistribution rights are established. */
export function linkOnlyMedia(entry: Pick<CatalogEntry, "source" | "access" | "kind">) {
  return entry.source === "transitions" || entry.source === "originkit" || entry.source === "inspiration" || (entry.source === "aceternity" && entry.access === "paid")
}
