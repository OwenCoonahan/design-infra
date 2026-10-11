"use client"

import { useState } from "react"
import Link from "next/link"

import { CopyPrompt } from "@/components/site/copy-prompt"
import { AGENT_PROMPTS } from "@/lib/integration"

export function AgentStart() {
  const [mode, setMode] = useState<keyof typeof AGENT_PROMPTS>("recommend")
  return (
    <div id="use-with-agent" className="scroll-mt-24 rounded-2xl border bg-card p-5 sm:p-7">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Use it in your project</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight">One prompt. Better starting points.</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Open your project in Claude Code or Codex, then paste this. Choose how much you want the agent to do.</p>
      <div role="group" aria-label="Agent behavior" className="mt-5 flex gap-1 rounded-lg border bg-background p-1">
        {([
          ["recommend", "Recommend first"],
          ["implement", "Choose and build"],
        ] as const).map(([value, label]) => (
          <button key={value} type="button" aria-pressed={mode === value} onClick={() => setMode(value)} className={`min-h-11 flex-1 rounded-md px-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring ${mode === value ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {label}
          </button>
        ))}
      </div>
      <CopyPrompt key={mode} id="home-agent-prompt" prompt={AGENT_PROMPTS[mode]} label="Paste into your coding agent" buttonLabel="Copy agent prompt" rows={7} framed={false} description={mode === "recommend" ? "The agent recommends three options with live links and waits for your pick." : "This prompt authorizes the agent to choose and implement one improvement, then verify it."} />
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <Link href="/integrate" className="underline underline-offset-4">Setup & connection details</Link>
        <a href="/integrate/raw" className="underline underline-offset-4">Instructions for agents ↗</a>
      </div>
    </div>
  )
}
