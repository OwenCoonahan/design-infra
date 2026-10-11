import { readFile } from "node:fs/promises"
import path from "node:path"

import { configureText } from "@/lib/config"
import { Markdown } from "@/components/site/markdown"

export const metadata = { title: "Guide" }

/** docs/GUIDE.md — how to use design-infra from a project workspace. */
export default async function GuidePage() {
  const md = await readFile(path.join(process.cwd(), "docs/GUIDE.md"), "utf8")
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Markdown className="text-[15px] [&_h1]:mt-0 [&_h1]:text-3xl [&_h1]:tracking-tight [&_hr]:my-10 [&_pre]:text-xs">
        {configureText(md)}
      </Markdown>
      <p className="mt-12 text-xs text-muted-foreground">
        Agents: plain markdown at <a className="underline" href="/guide/raw">/guide/raw</a>.
      </p>
    </div>
  )
}
