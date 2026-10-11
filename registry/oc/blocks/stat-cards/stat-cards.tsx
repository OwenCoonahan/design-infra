import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

export type StatCard = {
  label: string
  /** Pre-formatted value ("$48,210", "2,481", "3.2%"). */
  value: string
  /** Change vs. previous period, in percent. Sign decides the arrow. */
  delta?: number
  /** Context for the delta ("vs last month"). */
  deltaLabel?: string
  /** Set when "down" is good (churn, latency, cost). */
  invertDelta?: boolean
  icon?: React.ReactNode
  /** Recent values for a sparkline (drawn in --chart-1). */
  trend?: number[]
}

function Sparkline({ values }: { values: number[] }) {
  const id = React.useId().replace(/:/g, "")
  if (values.length < 2) return null
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const pts = values.map((v, i) => [(i / (values.length - 1)) * 100, 28 - ((v - min) / range) * 24 - 2] as const)
  const line = pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ")
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-10 w-full" aria-hidden>
      <defs>
        <linearGradient id={`spark-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--chart-1)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--chart-1)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,30 ${line} 100,30`} fill={`url(#spark-${id})`} />
      <polyline
        points={line}
        fill="none"
        stroke="var(--chart-1)"
        strokeWidth="1.75"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/** KPI tiles for dashboards: label, big value, delta chip and optional sparkline. */
export function StatCards({ stats, className }: { stats: StatCard[]; className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2",
        stats.length >= 4 ? "xl:grid-cols-4" : stats.length === 3 ? "lg:grid-cols-3" : "",
        className
      )}
    >
      {stats.map((s) => {
        const up = (s.delta ?? 0) >= 0
        const good = s.invertDelta ? !up : up
        return (
          <article key={s.label} className="flex flex-col gap-3 rounded-xl border bg-card p-5 text-card-foreground">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm text-muted-foreground">{s.label}</h3>
              {s.icon ? <span className="text-muted-foreground [&_svg]:size-4">{s.icon}</span> : null}
            </div>
            <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
              <p className="font-heading text-3xl font-headline tracking-tight tabular-nums">{s.value}</p>
              {s.delta !== undefined ? (
                <span
                  className={cn(
                    "mb-1 inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums",
                    good ? "bg-muted text-foreground" : "bg-destructive/10 text-destructive"
                  )}
                >
                  {up ? (
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  ) : (
                    <ArrowDownRight className="size-3.5" aria-hidden />
                  )}
                  {Math.abs(s.delta).toFixed(1)}%<span className="sr-only">{up ? "increase" : "decrease"}</span>
                </span>
              ) : null}
            </div>
            {s.trend ? <Sparkline values={s.trend} /> : null}
            {s.deltaLabel ? <p className="text-xs text-muted-foreground">{s.deltaLabel}</p> : null}
          </article>
        )
      })}
    </div>
  )
}
