"use client"

import { BorderBeam } from "border-beam"

import { cn } from "@/lib/utils"

/**
 * A theme-aware card with libraries.dev's animated border beam. Use for the one
 * thing on a screen that is "live" (an active agent run, the recommended plan) —
 * not for every card.
 */
export function BeamCard({
  active = true,
  variant = "colorful",
  mode = "dark",
  className,
  children,
}: {
  active?: boolean
  variant?: "colorful" | "mono" | "ocean" | "sunset"
  /** Match the surface the card sits on. */
  mode?: "dark" | "light"
  className?: string
  children: React.ReactNode
}) {
  return (
    <BorderBeam active={active} colorVariant={variant} theme={mode} size="md">
      <div className={cn("rounded-xl border bg-card p-6 text-card-foreground", className)}>{children}</div>
    </BorderBeam>
  )
}
