"use client"

import { ThinkingOrb, type OrbState } from "thinking-orbs"

import { cn } from "@/lib/utils"

/** What an agent is doing → which orb animation (libraries.dev/orbs) fits it. */
export const AGENT_ACTIVITY = {
  thinking: { orb: "working", label: "Thinking" },
  searching: { orb: "searching", label: "Searching" },
  reasoning: { orb: "solving", label: "Reasoning" },
  listening: { orb: "listening", label: "Listening" },
  connecting: { orb: "connecting", label: "Connecting" },
  planning: { orb: "weaving", label: "Planning" },
  writing: { orb: "composing", label: "Writing" },
  idle: { orb: "breathing", label: "Ready" },
  designing: { orb: "shaping", label: "Designing" },
} as const satisfies Record<string, { orb: OrbState; label: string }>

export type AgentActivity = keyof typeof AGENT_ACTIVITY

export function AgentStatus({
  activity,
  label,
  detail,
  size = "sm",
  className,
}: {
  activity: AgentActivity
  /** Override the default verb ("Searching"). */
  label?: string
  /** Secondary text, e.g. the file or query being worked on. */
  detail?: string
  /** sm = inline (20px orb), lg = avatar (64px orb). */
  size?: "sm" | "lg"
  className?: string
}) {
  const a = AGENT_ACTIVITY[activity]
  const busy = activity !== "idle"
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center text-foreground",
        size === "lg" ? "gap-4" : "gap-2 text-sm",
        className
      )}
    >
      <ThinkingOrb state={a.orb} size={size === "lg" ? 64 : 20} />
      <span className="flex min-w-0 flex-col">
        <span
          className={cn(
            "font-medium",
            size === "lg" && "text-base",
            busy &&
              "animate-[oc-shimmer_2.2s_linear_infinite] bg-[linear-gradient(90deg,var(--muted-foreground)_0%,var(--foreground)_45%,var(--muted-foreground)_90%)] bg-[length:200%_100%] bg-clip-text text-transparent motion-reduce:animate-none motion-reduce:text-foreground"
          )}
        >
          {label ?? a.label}
          {busy ? "…" : null}
        </span>
        {detail ? <span className="truncate text-xs text-muted-foreground">{detail}</span> : null}
      </span>
    </div>
  )
}
