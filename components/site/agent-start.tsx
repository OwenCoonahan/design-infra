import Link from "next/link"

import { CopyPrompt } from "@/components/site/copy-prompt"
import { SETUP_PROMPT } from "@/lib/integration"

export function AgentStart() {
  return (
    <div id="use-with-agent" className="scroll-mt-24 rounded-2xl border bg-card p-5 sm:p-7">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Use it in your project</p>
      <h2 className="mt-3 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">Start with one prompt.</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">First, open your project in Claude Code or Codex. Copy this prompt and paste it into your agent.</p>
      <CopyPrompt id="home-agent-prompt" prompt={SETUP_PROMPT} label="Start here · paste into your coding agent" buttonLabel="Copy agent prompt" rows={8} framed={false} description="Connects the catalog. Then tell your agent what to change and attach a screenshot or link." />
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <Link href="/integrate" className="underline underline-offset-4">Setup & connection details</Link>
        <a href="/integrate/raw" className="underline underline-offset-4">Instructions for agents ↗</a>
      </div>
    </div>
  )
}
