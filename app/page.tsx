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
  { label: "Find a component.", request: "Find a clean pricing section that fits our site. Show three live options and recommend one.", href: "/components?q=clean%20pricing", link: "Explore pricing components" },
  { label: "Replace a section.", request: "I don’t like our features section. Find a few different layouts, show examples and explain which fits best.", href: "/reference", link: "See the replacement workflow" },
  { label: "Build from a reference.", request: "Use this link or screenshot as a design reference. Choose suitable catalog components and implement the page in our existing style.", href: "/inspiration", link: "Explore design references" },
]

const STEPS = [
  { title: "Copy the prompt.", body: "Open your project in Claude Code or Codex. Paste the prompt above to connect your agent to the component catalog.", href: "#use-with-agent", link: "Get the prompt" },
  { title: "Tell it what to build.", body: "Name the page or component you want to improve. Share a website link, a screenshot, or a feeling like clean, sharp or calm.", href: "#what-you-can-do", link: "See example requests" },
  { title: "Find the right parts.", body: "Your agent finds suitable components. Explore available live demos and compare options. Pick your favorite, or ask the agent to choose.", href: "/components", link: "Browse the catalog" },
  { title: "Build, then refine.", body: "Your agent installs and adapts the chosen components to your stack and brand. Review the result, then tell it what to keep or change.", href: "/guide", link: "Read the usage guide" },
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
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">A library of UI components and design references for your projects. Browse examples yourself, or use Claude Code or Codex to find, adapt and install the right pieces.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><a href="#use-with-agent">Use with your agent <ArrowRight aria-hidden="true" /></a></Button>
            <Button asChild variant="outline" size="lg"><Link href="/components">Explore components</Link></Button>
            <a href="#how-it-works" className="inline-flex min-h-11 items-center px-1 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">How it works</a>
          </div>
          <p className="mt-8 text-sm text-muted-foreground"><span className="font-medium text-foreground">{components.toLocaleString("en-US")} components & blocks</span> from {sources.length} sources. Free choices first.</p>
          <p className="mt-2 text-xs text-muted-foreground">Start without cloning the repo, installing a plugin or buying a subscription.</p>
        </div>
        <AgentStart />
      </section>

      <section id="how-it-works" aria-labelledby="steps-title" className="scroll-mt-24 border-b py-14 lg:py-20">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">From an idea to working UI</p>
        <h2 id="steps-title" className="mt-4 text-4xl leading-tight font-semibold tracking-tight sm:text-5xl lg:text-6xl">How it works.</h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">Connect your agent once. Then use real components and references to build and improve your project.</p>
        <ol role="list" className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="grid grid-cols-[3.5rem_1fr] gap-x-4 border-t pt-6 sm:block">
              <span aria-hidden="true" className="font-mono text-5xl leading-none tracking-tight text-muted-foreground sm:text-6xl">0{index + 1}</span>
              <div className="flex flex-col items-start sm:mt-5">
                <h3 className="text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                <a href={step.href} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm underline underline-offset-4">{step.link} <ArrowRight className="size-3.5" aria-hidden="true" /></a>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="what-you-can-do" aria-labelledby="requests-title" className="scroll-mt-24 border-b py-14 lg:py-20">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h2 id="requests-title" className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl lg:text-6xl">What you can do.</h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">Start with one component, refresh an existing section, or build a page from a reference you like.</p>
          </div>
          <Link href="/guide" className="text-sm text-muted-foreground underline underline-offset-4">How to use it day to day</Link>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {EXAMPLES.map((example, index) => (
            <article key={example.label} className="flex flex-col items-start">
              <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
              <h3 className="mt-3 text-2xl leading-tight font-semibold tracking-tight">{example.label}</h3>
              <blockquote className="mt-3 mb-5 text-sm leading-relaxed text-muted-foreground">“{example.request}”</blockquote>
              <Link href={example.href} className="mt-auto inline-flex items-center gap-2 text-sm underline underline-offset-4">{example.link} <ArrowRight className="size-3.5" aria-hidden="true" /></Link>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="moods-title" className="border-b py-14 lg:py-20">
        <h2 id="moods-title" className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl lg:text-6xl">Choose how it feels.</h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">Use words like clean, sharp or calm to explore different visual directions. Your project’s purpose still determines its layout.</p>
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
