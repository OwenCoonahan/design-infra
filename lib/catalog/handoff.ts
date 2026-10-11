import { compareUrl, entryPage } from "./links"
import type { Mood } from "./moods"
import type { Access } from "./schema"

export type HandoffItem = {
  id: string
  title: string
  install?: string
  page?: string
  live?: string
  notes?: string
  access?: Access
  themeAware?: boolean
  moods?: Mood[]
}

/** A selected component should reach the project agent with enough context to use it well. */
export function agentMessage(items: HandoffItem[], target: string) {
  return [
    "From design-infra I picked:",
    ...items.flatMap((i) => [
      `- ${i.id} — ${i.title}`,
      `  Gallery: ${i.page ?? entryPage(i.id)}`,
      ...(i.live ? [`  Live demo: ${i.live}`] : []),
      ...(i.install ? [`  Install: ${i.install}`] : []),
      ...(i.notes ? [`  Notes: ${i.notes}`] : []),
      ...(i.moods?.length ? [`  Feel: ${i.moods.join(", ")}`] : []),
      ...(i.themeAware === false ? ["  Adapt its hard-coded styling to the project's theme tokens."] : []),
      ...(i.access && i.access !== "free" ? [`  Access: ${i.access}; confirm I have the required vendor access before installing.`] : []),
    ]),
    "",
    `Apply to: ${target.trim() || "ask which part of my project these are for"}`,
    "Install and adapt these components rather than recreating them from scratch. Preserve existing copy, props, accessibility, and brand styling. Follow the project's DESIGN.md; respect reduced motion. Explain any missing functionality before writing a custom component.",
    `Compare them live: ${compareUrl(items.map((i) => i.id), target.trim() ? { label: target.trim() } : {})}`,
  ].join("\n")
}
