"use client"

import { useState } from "react"

export function CopyPrompt({ prompt }: { prompt: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle")
  return (
    <div className="my-6 rounded-xl border bg-card p-4">
      <label htmlFor="setup-prompt" className="text-sm font-medium">Paste this into your project&apos;s agent</label>
      <textarea id="setup-prompt" readOnly value={prompt} rows={7} className="mt-3 w-full resize-y rounded-md border bg-muted/40 p-3 text-sm leading-relaxed" />
      <button type="button" className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" onClick={async () => {
        try {
          await navigator.clipboard.writeText(prompt)
          setStatus("copied")
        } catch {
          setStatus("failed")
        }
      }}>
        {status === "copied" ? "Copied setup prompt" : "Copy setup prompt"}
      </button>
      <p role="status" className="mt-2 text-xs text-muted-foreground">
        {status === "failed" ? "Clipboard unavailable. Select the text above and copy it manually." : "Open your project first. The agent will inspect it before configuring anything."}
      </p>
    </div>
  )
}
