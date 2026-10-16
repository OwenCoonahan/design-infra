import { CopyPrompt } from "@/components/site/copy-prompt"
import { SETUP_PROMPT } from "@/lib/integration"

export function AgentStart() {
  return (
    <div id="use-with-agent" className="scroll-mt-24">
      <CopyPrompt id="home-agent-prompt" prompt={SETUP_PROMPT} label="Use it in your project" buttonLabel="Copy agent prompt" rows={3} framed={false} compact minimal description="Paste into Claude Code or Codex." />
    </div>
  )
}
