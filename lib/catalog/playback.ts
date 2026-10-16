export type PlaybackCandidate = {
  id: string
  order: number
  visible: boolean
  visibility?: number
  intent: "auto" | "play" | "pause"
  requested: number
}
/** A shared budget for frames AND clips; explicit play takes priority over autoplay. */
export function activePreviews(
  candidates: PlaybackCandidate[],
  enabled: boolean,
  reducedMotion: boolean,
  hidden: boolean,
) {
  if (hidden) return []
  return candidates
    .filter((c) => c.visible && c.intent !== "pause" && (c.intent === "play" || (enabled && !reducedMotion)))
    .sort(
      (a, b) =>
        Number(b.intent === "play") - Number(a.intent === "play") || b.requested - a.requested || (b.visibility ?? 0) - (a.visibility ?? 0) || a.order - b.order,
    )
    .slice(0, 3)
    .map((c) => c.id)
}
