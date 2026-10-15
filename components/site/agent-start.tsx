import Link from "next/link"

import { CopyPrompt } from "@/components/site/copy-prompt"
import { SETUP_PROMPT } from "@/lib/integration"

export function AgentStart() {
  return (
    <div id="use-with-agent" className="scroll-mt-24 rounded-2xl border bg-card p-5 sm:p-7">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Use it in your project</p>
      <h2 className="mt-3 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">Connect once. Then just ask.</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Paste this into Claude Code or Codex inside your project.</p>
      <CopyPrompt id="home-agent-prompt" prompt={SETUP_PROMPT} label="1. Connect your agent" buttonLabel="Copy agent prompt" rows={4} framed={false} description="Your agent connects the catalog and shows you how to use it." />
      <div className="mb-6 border-t pt-5" aria-labelledby="first-requests-title">
        <h3 id="first-requests-title" className="text-sm font-medium">2. Ask in the same chat</h3>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
          <li>“Find a loading component for this.”</li>
          <li>“Make this section feel sharper.”</li>
          <li>“Choose a pricing layout and build it.”</li>
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Attach a screenshot or link to show what you mean. <Link href="#what-you-can-do" className="underline underline-offset-4">More examples ↓</Link></p>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <Link href="/integrate" className="underline underline-offset-4">Setup & connection details</Link>
        <a href="/integrate/raw" className="underline underline-offset-4">Instructions for agents ↗</a>
      </div>
    </div>
  )
}
