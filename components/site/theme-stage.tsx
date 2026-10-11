"use client"

import { Moon, Sun } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Renders children under a design system's tokens ([data-theme] vars from
 * app/themes.generated.css) with a light/dark toggle. `.light` disables `dark:` variants
 * inside the dark gallery chrome.
 */
export function ThemeStage({
  theme,
  modes = ["light", "dark"],
  initialMode,
  className,
  children,
}: {
  theme: string
  modes?: ("light" | "dark")[]
  initialMode?: "light" | "dark"
  className?: string
  children: React.ReactNode
}) {
  const [mode, setMode] = React.useState<"light" | "dark">(initialMode ?? modes[0])
  return (
    <div className={cn("relative overflow-hidden rounded-xl border", className)}>
      {modes.length > 1 ? (
        <div className="absolute top-3 right-3 z-50 flex rounded-lg border bg-background/80 p-0.5 backdrop-blur">
          {modes.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              aria-label={`${m} mode`}
              className={cn(
                "rounded-md p-1.5 text-muted-foreground transition-colors",
                mode === m && "bg-muted text-foreground"
              )}
            >
              {m === "light" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
            </button>
          ))}
        </div>
      ) : null}
      <div
        data-theme={theme}
        data-mode={mode}
        className={cn(mode, "bg-background font-sans text-foreground")}
      >
        {children}
      </div>
    </div>
  )
}
