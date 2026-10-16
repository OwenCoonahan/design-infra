import Link from "next/link"

import { CopyPrompt } from "@/components/site/copy-prompt"
import { SETUP_PROMPT } from "@/lib/integration"
import { sitePath } from "@/lib/config"

export function AgentStart() {
  return (
    <div id="use-with-agent" className="scroll-mt-24">
      <CopyPrompt id="home-agent-prompt" prompt={SETUP_PROMPT} label="Use it in your project" buttonLabel="Copy agent prompt" rows={3} framed={false} compact description="Paste into Claude Code or Codex. Then describe what you want to build." />
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <Link href="/integrate" className="underline underline-offset-4">Setup & connection details</Link>
        <Link href="#what-you-can-do" className="underline underline-offset-4">What to ask</Link>
        <a href={sitePath("/integrate/raw")} className="underline underline-offset-4">Instructions for agents ↗</a>
      </div>
    </div>
  )
}
