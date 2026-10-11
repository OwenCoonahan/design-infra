"use client"

import { useState } from "react"

type CopyPromptProps = {
  prompt: string
  id?: string
  label?: string
  buttonLabel?: string
  rows?: number
  framed?: boolean
  description?: string
}

export function CopyPrompt({
  prompt,
  id = "setup-prompt",
  label = "Paste this into your project's agent",
  buttonLabel = "Copy setup prompt",
  rows = 7,
  framed = true,
  description = "Open your project first. The agent will inspect it before configuring anything.",
}: CopyPromptProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle")
  return (
    <div className={framed ? "my-6 rounded-xl border bg-card p-4" : "my-6"}>
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <textarea id={id} readOnly value={prompt} rows={rows} className="mt-3 w-full resize-y rounded-md border bg-muted/40 p-3 text-sm leading-relaxed focus-visible:outline-2 focus-visible:outline-ring" onFocus={(event) => event.currentTarget.select()} />
      <button type="button" className="mt-3 min-h-11 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" onClick={async () => {
        try {
          await navigator.clipboard.writeText(prompt)
          setStatus("copied")
        } catch {
          setStatus("failed")
        }
      }}>
        {status === "copied" ? `Copied ${buttonLabel.replace(/^Copy /, "")}` : buttonLabel}
      </button>
      <p role="status" className="mt-2 text-xs text-muted-foreground">
        {status === "failed" ? "Clipboard unavailable. Select the text above and copy it manually." : status === "copied" ? "Copied. Paste it into the agent working in your project." : description}
      </p>
    </div>
  )
}
