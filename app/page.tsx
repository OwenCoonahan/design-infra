import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { AgentStart } from "@/components/site/agent-start"
import { Button } from "@/components/ui/button"
import { MOOD_NAMES, MOODS } from "@/lib/catalog/moods"
import { REPOSITORY_URL } from "@/lib/config"
import { getCatalog, getSources } from "@/lib/data"
import { KineticField } from "@/registry/oc/blocks/kinetic-field/kinetic-field"

export const metadata = {
  title: "Find better components. Build better UI.",
  description: "Find real components and design references for your project. Copy one prompt into Claude Code or Codex to get recommendations or choose and build.",
}

const EXAMPLES = [
  { label: "Find the right component", request: "Find a clean pricing section that fits our site. Show three live options and recommend one.", href: "/components?q=clean%20pricing", link: "Explore pricing components" },
  { label: "Replace something you dislike", request: "I don’t like our features section. Find a few different layouts, show examples and explain which fits best.", href: "/reference", link: "See the replacement workflow" },
  { label: "Build from a reference", request: "Use this link or screenshot as a design reference. Choose suitable catalog components and implement the page in our existing style.", href: "/inspiration", link: "Explore design references" },
]

export default async function Home() {
  const [catalog, sources] = await Promise.all([getCatalog(), getSources()])
  const components = catalog.filter((entry) => entry.kind === "component" || entry.kind === "block").length
  return (
    <div className="mx-auto max-w-7xl px-6">
      <section className="home-motion-hero grid items-center gap-10 border-b py-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-12">
        <div>
          <div className="mb-8">
            <KineticField accent="var(--site-motion-accent)" />
            <Link href="/components/oc/kinetic-field" className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">Use this effect <ArrowRight className="size-3" aria-hidden="true" /></Link>
          </div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">An open source design toolkit for your coding agent</p>
          <h1 className="mt-6 max-w-2xl text-5xl leading-[1.06] font-semibold tracking-tight sm:text-6xl">Good UI starts with <span className="text-[var(--site-motion-accent)]">better components.</span></h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">Find real components, explore live examples, and build from design references you like. Give your agent a better place to start.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><a href="#use-with-agent">Use with your agent <ArrowRight aria-hidden="true" /></a></Button>
            <Button asChild variant="outline" size="lg"><Link href="/components">Explore components</Link></Button>
          </div>
          <p className="mt-8 text-sm text-muted-foreground"><span className="font-medium text-foreground">{components.toLocaleString("en-US")} components & blocks</span> from {sources.length} sources. Free choices first.</p>
          <p className="mt-2 text-xs text-muted-foreground">Start without cloning the repo, installing a plugin or buying a subscription.</p>
        </div>
        <AgentStart />
      </section>

      <section aria-labelledby="requests-title" className="border-b py-12 lg:py-16">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="requests-title" className="text-2xl font-semibold tracking-tight">Start with what you need.</h2>
          <Link href="/guide" className="text-sm text-muted-foreground underline underline-offset-4">How to use it day to day</Link>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {EXAMPLES.map((example, index) => (
            <article key={example.label} className="flex flex-col items-start">
              <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
              <h3 className="mt-3 font-medium">{example.label}</h3>
              <blockquote className="mt-3 mb-5 text-sm leading-relaxed text-muted-foreground">“{example.request}”</blockquote>
              <Link href={example.href} className="mt-auto inline-flex items-center gap-2 text-sm underline underline-offset-4">{example.link} <ArrowRight className="size-3.5" aria-hidden="true" /></Link>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="agent-workflow-title" className="grid gap-8 border-b py-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16 lg:py-16">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">For the agent in your project</p>
          <h2 id="agent-workflow-title" className="mt-3 text-2xl font-semibold tracking-tight">Research. Recommend. Reuse.</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Structure comes from the project’s tasks. Visual direction comes from real references. The implementation starts with compatible components.</p>
          <a href="/integrate/raw" className="mt-5 inline-flex items-center gap-2 text-sm underline underline-offset-4">Read the agent instructions <ArrowRight className="size-3.5" aria-hidden="true" /></a>
        </div>
        <ol className="divide-y">
          {[
            ["Understand the project", "Inspect the stack, existing UI, content and brand. Preserve the parts that already work."],
            ["Find relevant examples", "Inspect the reference link or image, research the right page type, then search reusable components."],
            ["Recommend or choose", "Return a useful shortlist with live links, a comparison and a clear recommendation. If asked to choose and build, proceed."],
            ["Implement and verify", "Install compatible selections, adapt them to the project and test the actual result. Report sources, changes and checks."],
          ].map(([title, body], index) => (
            <li key={title} className="flex gap-4 py-4 first:pt-0 last:pb-0">
              <span className="pt-0.5 font-mono text-xs text-muted-foreground">0{index + 1}</span>
              <div><h3 className="text-sm font-medium">{title}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="moods-title" className="border-b py-12 lg:py-16">
        <h2 id="moods-title" className="text-2xl font-semibold tracking-tight">Have a feeling in mind?</h2>
        <p className="mt-2 text-sm text-muted-foreground">Use words like clean, sharp or calm to narrow the choices. Keep the structure right for your project.</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {MOOD_NAMES.map((mood) => (
            <li key={mood}><Link href={`/components?mood=${mood}`} title={MOODS[mood].description} className="inline-flex min-h-11 items-center rounded-full border px-4 text-sm transition-colors hover:bg-muted">{MOODS[mood].label}</Link></li>
          ))}
        </ul>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-4 py-8 text-sm text-muted-foreground">
        <p>Browse. Try it in a project. Help make the next search better.</p>
        <div className="flex gap-5"><Link href="/feedback" className="underline underline-offset-4">Share feedback</Link><a href={REPOSITORY_URL} className="underline underline-offset-4">Contribute on GitHub ↗</a></div>
      </footer>
    </div>
  )
}
