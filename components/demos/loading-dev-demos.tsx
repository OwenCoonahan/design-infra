"use client"

// Original demo compositions using the installed MIT `loading-dev` package (Jakub Krehel), not copied example code.
import * as React from "react"
import { Arc, Classic, LinearDots, Trace } from "loading-dev"

type Easing = "linear" | "ease-in-out" | "stacked"
const control = "rounded-md border bg-background px-3 py-1.5 text-xs text-foreground"
const speeds = { default: undefined, slower: 1600, faster: 500 } as const

export const LOADING_DEV_DEMOS = ["loading-dev/arc", "loading-dev/classic", "loading-dev/linear-dots", "loading-dev/trace"]

export function LoadingDevDemo({ id, compact = false }: { id: string; compact?: boolean }) {
  const [easing, setEasing] = React.useState<Easing>("linear")
  const [speed, setSpeed] = React.useState<keyof typeof speeds>("default")
  const name = id.split("/")[1]
  const eased = name === "arc" || name === "trace"
  const spinner = (size: number) => {
    const props = { size, duration: speeds[speed] }
    if (name === "arc") return <Arc {...props} easing={easing} />
    if (name === "trace") return <Trace {...props} easing={easing} />
    if (name === "classic") return <Classic {...props} />
    if (name === "linear-dots") return <LinearDots {...props} />
    return null
  }
  if (!LOADING_DEV_DEMOS.includes(id)) return null
  return (
    <div className={`flex flex-col items-center justify-center ${compact ? "min-h-screen gap-2 px-3 py-2" : "min-h-[360px] gap-8 px-8 py-6"}`}>
      <div className={`flex flex-col items-center justify-center gap-8 ${compact ? "" : "min-h-44"}`}>
        {/* The package renders aria-hidden; the wrapper carries the accessible status. */}
        <span role="status" aria-label="Loading" className="text-foreground">{spinner(compact ? 40 : 48)}</span>
        {!compact ? (
          <div className="flex items-center gap-3">
            <button type="button" disabled aria-busy="true" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              {spinner(16)}
              Saving
            </button>
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              {spinner(14)}
              Syncing 3 files
            </span>
          </div>
        ) : null}
      </div>
      {!compact ? (
        eased ? (
          <select aria-label="Easing" className={control} value={easing} onChange={(e) => setEasing(e.target.value as Easing)}>
            {["linear", "ease-in-out", "stacked"].map((s) => <option key={s}>{s}</option>)}
          </select>
        ) : (
          <select aria-label="Speed" className={control} value={speed} onChange={(e) => setSpeed(e.target.value as keyof typeof speeds)}>
            {Object.keys(speeds).map((s) => <option key={s}>{s}</option>)}
          </select>
        )
      ) : null}
    </div>
  )
}
