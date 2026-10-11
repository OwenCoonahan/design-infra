import { readFile } from "node:fs/promises"
import path from "node:path"

import { configureText } from "@/lib/config"
import { Markdown } from "@/components/site/markdown"

export const metadata = { title: "Use a reference or replace a section" }

export default async function ReferencePage() {
  const instructions = await readFile(path.join(process.cwd(), "docs/REFERENCE.md"), "utf8")
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Markdown className="[&_h1]:mt-0">{configureText(instructions)}</Markdown>
      <p className="mt-12 text-xs text-muted-foreground">Agents: <a className="underline" href="/reference/raw">plain markdown instructions</a>.</p>
    </div>
  )
}
