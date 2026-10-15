import { readFile } from "node:fs/promises"
import path from "node:path"
import Link from "next/link"

import { CopyPrompt } from "@/components/site/copy-prompt"
import { configureText } from "@/lib/config"
import { Markdown } from "@/components/site/markdown"
import { SETUP_PROMPT } from "@/lib/integration"

export const metadata = { title: "Connect your project" }

export default async function IntegratePage() {
  const instructions = await readFile(path.join(process.cwd(), "docs/INTEGRATE.md"), "utf8")
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Connect your project</h1>
      <p className="mt-3 text-muted-foreground">Give your agent access to real components, live demos, and install instructions. No clone or paid account is needed to get started.</p>
      <CopyPrompt prompt={SETUP_PROMPT} />
      <p className="mb-8 text-sm text-muted-foreground">Paste this into your project’s agent to connect. Then attach a screenshot or link and describe what to change. The same starting prompt is on the <Link className="underline" href="/#use-with-agent">homepage</Link>. Agents: <a className="underline" href="/integrate/raw">read the setup instructions as markdown</a>.</p>
      <Markdown>{configureText(instructions)}</Markdown>
    </div>
  )
}
