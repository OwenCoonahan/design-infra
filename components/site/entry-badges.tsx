import { Activity, Puzzle } from "lucide-react"
import Link from "next/link"

import { INTEGRATION_HINT, motionLabel } from "@/lib/catalog/facets"
import { MOODS, type Mood } from "@/lib/catalog/moods"
import type { Integration } from "@/lib/catalog/schema"
import { cn } from "@/lib/utils"

/** Mood chips; `link` makes each one filter the catalog by that mood. */
export function MoodChips({ moods, link = false, className }: { moods: readonly string[]; link?: boolean; className?: string }) {
  if (!moods.length) return null
  return (
    <span className={cn("flex flex-wrap gap-1", className)}>
      {moods.map((m) => {
        const label = MOODS[m as Mood]?.label ?? m
        const cls = "rounded-full bg-muted px-2 py-0.5 text-[11px] leading-4 text-muted-foreground"
        return link ? (
          <Link key={m} href={`/components?mood=${m}`} className={cn(cls, "hover:text-foreground")}>
            {label}
          </Link>
        ) : (
          <span key={m} className={cls}>
            {label}
          </span>
        )
      })}
    </span>
  )
}

/** Compact motion badge from the slim encoding ("hover+enter:subtle"). Renders nothing when static. */
export function MotionBadge({ motion, className }: { motion?: string; className?: string }) {
  const label = motionLabel(motion)
  if (!label) return null
  return (
    <span
      title="Motion: trigger — intensity"
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] leading-4 text-foreground",
        className
      )}
    >
      <Activity className="size-3 shrink-0" aria-hidden />
      {label}
    </span>
  )
}

export function IntegrationBadge({ integration, className }: { integration?: Integration; className?: string }) {
  if (!integration) return null
  return (
    <span
      title={INTEGRATION_HINT[integration]}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-dashed px-2 py-0.5 text-[11px] leading-4 text-muted-foreground",
        className
      )}
    >
      <Puzzle className="size-3 shrink-0" aria-hidden />
      {integration}
    </span>
  )
}
