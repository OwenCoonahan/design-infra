"use client"

import { Check, Plus } from "lucide-react"

import { shortlist, useShortlist, type ShortlistItem } from "@/lib/shortlist"
import { cn } from "@/lib/utils"

/** "Add to shortlist" toggle for entry pages and compare tiles. */
export function ShortlistButton({ item, className }: { item: ShortlistItem; className?: string }) {
  const on = useShortlist().some((i) => i.id === item.id)
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => shortlist.toggle(item)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors",
        on ? "border-foreground bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {on ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
      {on ? "Shortlisted" : "Add to shortlist"}
    </button>
  )
}
