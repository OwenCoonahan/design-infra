import { readFile } from "node:fs/promises"
import path from "node:path"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { configureText } from "@/lib/config"
import { Markdown } from "@/components/site/markdown"
import { CopyPrompt } from "@/components/site/copy-prompt"
import { RequestScreenshot } from "@/components/site/request-screenshot"
import { SETUP_PROMPT } from "@/lib/integration"

export const metadata = { title: "Guide" }

/** docs/GUIDE.md — how to use design-infra from a project workspace. */
export default async function GuidePage() {
  const md = await readFile(path.join(process.cwd(), "docs/GUIDE.md"), "utf8")
  const [introduction, ...sections] = configureText(md).split(/\n(?=## )/)
  const content = sections.map((section) => {
    const newline = section.indexOf("\n")
    return { title: section.slice(0, newline).replace(/^## /, ""), body: section.slice(newline + 1).trim().replace(/\n---\s*$/, "") }
  })
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">From a screenshot to working UI</p>
      <Markdown className="[&_h1]:mt-0 [&_h1]:text-4xl [&_h1]:leading-tight [&_h1]:tracking-tight sm:[&_h1]:text-5xl lg:[&_h1]:text-6xl [&_p]:mt-5 [&_p]:text-lg">{introduction}</Markdown>
      <ol aria-label="Four steps to use design-infra" className="mt-12 border-t">
        {content.slice(0, 4).map((section, index) => (
          <li key={section.title} data-guide-step className="grid gap-6 border-b py-10 sm:grid-cols-[7rem_1fr] sm:gap-10 sm:py-14">
            <span aria-hidden="true" className="font-mono text-7xl leading-none tracking-tighter text-muted-foreground sm:text-8xl">0{index + 1}</span>
            <section aria-labelledby={`guide-step-${index + 1}`} className="min-w-0">
              <h2 id={`guide-step-${index + 1}`} className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">{section.title.replace(/^\d\. /, "")}</h2>
              <div className={`mt-4 ${index === 1 ? "grid items-start gap-6 lg:grid-cols-[1fr_18rem]" : "max-w-2xl"}`}>
                <Markdown className="text-base [overflow-wrap:anywhere] [&_p]:first:mt-0">{section.body}</Markdown>
                {index === 1 ? <RequestScreenshot /> : null}
              </div>
              {index === 0 ? <div className="max-w-2xl"><CopyPrompt id="guide-agent-prompt" prompt={SETUP_PROMPT} buttonLabel="Copy starting prompt" rows={6} description="Paste into the agent working in your project. Then describe your first task." /></div> : null}
              {index === 2 ? <Link href="/components" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm underline underline-offset-4">Explore the catalog <ArrowRight className="size-3.5" aria-hidden="true" /></Link> : null}
            </section>
          </li>
        ))}
      </ol>
      <section aria-labelledby="more-guidance" className="mt-14">
        <h2 id="more-guidance" className="text-3xl font-semibold tracking-tight sm:text-4xl">Everything else.</h2>
        <p className="mt-3 mb-8 text-muted-foreground">Go deeper when you need to. The four steps above are enough to get started.</p>
        {content.slice(4).map((section) => (
          <details key={section.title} className="group border-b py-1" data-guide-detail>
            <summary className="cursor-pointer py-5 text-lg font-medium focus-visible:outline-2 focus-visible:outline-ring">{section.title}</summary>
            <Markdown className="max-w-3xl pb-6 [overflow-wrap:anywhere] [&_pre]:text-xs [&_table]:block [&_table]:overflow-x-auto">{section.body}</Markdown>
          </details>
        ))}
      </section>
      <p className="mt-10 text-xs text-muted-foreground">Agents: <a className="underline" href="/guide/raw">read the complete guide as markdown</a>.</p>
    </div>
  )
}
