import manifest from "@/catalog/preview-demos.json"
import { linkOnlyMedia } from "./media-policy"
import type { CatalogEntry } from "./schema"

export type PreviewDescriptor =
  | { kind: "interactive"; src: string; width: number; height: number }
  | { kind: "clip"; src: string }
  | { kind: "static" }

export const previewDemos = manifest.demos as Record<
  string,
  {
    adapter: string
    width: number
    height: number
    provenance: { source: string; license: string; local?: string; sha256?: string }
  }
>
export function hostedPreview(id: string) {
  const demo = previewDemos[id]
  return demo
    ? { kind: "interactive" as const, src: `/preview/${id}?surface=neutral`, width: demo.width, height: demo.height }
    : undefined
}
/** Only explicit local adapters and media approved for redistribution can autoplay. */
export function previewDescriptor(
  e: Pick<CatalogEntry, "id" | "source" | "access" | "kind" | "preview" | "video">,
): PreviewDescriptor | undefined {
  if (linkOnlyMedia(e)) return undefined
  return hostedPreview(e.id) ?? (e.video ? { kind: "clip", src: e.video } : e.preview ? { kind: "static" } : undefined)
}
export function visualFirst<T extends { visual?: PreviewDescriptor }>(entries: T[]) {
  return { visual: entries.filter((e) => e.visual), sourceOnly: entries.filter((e) => !e.visual) }
}
export const PREVIEW_LABELS = {
  interactive: "Interactive demo",
  clip: "Motion clip",
  static: "Static preview",
} as const
