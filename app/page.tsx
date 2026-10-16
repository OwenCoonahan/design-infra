import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { AgentStart } from "@/components/site/agent-start"
import { RequestExamples } from "@/components/site/request-examples"
import { ComponentScene, type HomeExample } from "@/components/site/component-scene"
import { HomeShowcase } from "@/components/site/home-showcase"
import { GalleryPlayback, PlaybackControls } from "@/components/site/gallery-preview"
import { Button } from "@/components/ui/button"
import { MOOD_NAMES, MOODS } from "@/lib/catalog/moods"
import { BASE_PATH, REPOSITORY_URL, sitePath } from "@/lib/config"
import { getCatalog, getSources } from "@/lib/data"
import { hostedPreview } from "@/lib/catalog/previews"
import { previewSrc } from "@/lib/thumbnails"
import { entryPage } from "@/lib/catalog/links"

export const metadata = {
  title: "Find better components. Build better UI.",
  description: "Find real components and design references for your project. Copy one prompt into Claude Code or Codex to get recommendations or choose and build.",
}

const STEPS = [
  { title: "Copy the prompt.", body: "Open your project in Claude Code or Codex. Paste the prompt above to connect your agent to the component catalog.", href: "#use-with-agent", link: "Get the prompt" },
  { title: "Tell it what to build.", body: "Name the page or component you want to improve. Share a website link, a screenshot, or a feeling like clean, sharp or calm.", href: "#what-you-can-do", link: "See example requests" },
  { title: "Find the right parts.", body: "Your agent finds suitable components. Explore available live demos and compare options. Pick your favorite, or ask the agent to choose.", href: "/components", link: "Browse the catalog" },
  { title: "Build, then refine.", body: "Your agent installs and adapts the chosen components to your stack and brand. Review the result, then tell it what to keep or change.", href: "/guide", link: "Read the usage guide" },
]

export default async function Home() {
  const [catalog, sources] = await Promise.all([getCatalog(), getSources()])
  const components = catalog.filter((entry) => entry.kind === "component" || entry.kind === "block").length
  const example = (id: string, name: string, type: string, hero = false): HomeExample => {
    const entry = catalog.find((entry) => entry.id === id)!
    const descriptor = hostedPreview(id)!
    return { id, name, type, href: new URL(entryPage(id)).pathname.slice(BASE_PATH.length), poster: entry.preview ? previewSrc(entry.preview) : undefined,
      descriptor: hero ? { ...descriptor, src: `${descriptor.src}&presentation=hero`, width: id.endsWith("dither-chart") ? 600 : 400, height: id.endsWith("dither-chart") ? 390 : 320 } : id.endsWith("progressive-blur") ? { ...descriptor, height: 520 } : descriptor }
  }
  const scene = [example("smoothui/dither-chart", "Dither chart", "Data, with texture", true), example("smoothui/scrubber", "Scrub to reshape", "Drag to reshape", true), example("smoothui/pixel-brush-canvas", "Draw something", "Make a little pixel art", true)]
  const featured = [example("smoothui/progressive-blur", "Progressive blur", "Scroll it · change the blur · SmoothUI"), example("smoothui/card-swipe-deck", "Swipe a direction", "Drag a card · or use the buttons · SmoothUI"), example("oc/beam-card", "Beam card", "A little emphasis · Design Infra"), example("oc/kinetic-field", "Kinetic field", "Interactive · Design Infra")]
  return (
    <div className="mx-auto max-w-7xl px-6">
      <GalleryPlayback>
      <section className="home-motion-hero grid items-center gap-8 border-b py-10 lg:grid-cols-[1fr_1.15fr] lg:gap-12 lg:py-12">
        <div className="min-w-0 lg:py-8" data-hero-introduction>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">An open source design toolkit for your coding agent</p>
          <h1 className="mt-5 max-w-2xl text-5xl leading-[1.06] font-semibold tracking-tight sm:text-6xl">Good UI starts with <span className="text-[var(--site-motion-accent)]">better components.</span></h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">Find real components and design references. Use Claude Code or Codex to adapt the right pieces to your project.</p>
          <p className="mt-5 text-sm text-muted-foreground"><span className="font-medium text-foreground">{components.toLocaleString("en-US")} components & blocks</span> from {sources.length} sources. Free choices first.</p>
          <div className="mt-8"><AgentStart /></div>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <Button asChild variant="outline"><Link href="/components">Explore components <ArrowRight aria-hidden="true" /></Link></Button>
            <a href="#how-it-works" className="inline-flex min-h-11 items-center text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">How it works</a>
          </div>
        </div>
        <div className="min-w-0" data-hero-playground>
          <ComponentScene examples={scene} />
          <div className="mt-4 flex items-center justify-between gap-3"><Link href="/components?view=live" className="inline-flex min-h-11 items-center gap-1 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">Find these components <ArrowRight className="size-3" aria-hidden="true" /></Link><PlaybackControls /></div>
        </div>
      </section>

      <HomeShowcase examples={featured} />

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
                <a href={sitePath(step.href)} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm underline underline-offset-4">{step.link} <ArrowRight className="size-3.5" aria-hidden="true" /></a>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="what-you-can-do" aria-labelledby="requests-title" className="scroll-mt-24 border-b py-14 lg:py-20">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h2 id="requests-title" className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl lg:text-6xl">What you can do.</h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">Attach a screenshot in your project’s agent, then say what to change. A website link or component path works too.</p>
          </div>
          <Link href="/guide" className="text-sm text-muted-foreground underline underline-offset-4">How to use it day to day</Link>
        </div>
        <RequestExamples />
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
      </GalleryPlayback>

      <footer className="flex flex-wrap items-center justify-between gap-4 py-8 text-sm text-muted-foreground">
        <p>Browse. Try it in a project. Help make the next search better.</p>
        <div className="flex gap-5"><Link href="/feedback" className="underline underline-offset-4">Share feedback</Link><a href={REPOSITORY_URL} className="underline underline-offset-4">Contribute on GitHub ↗</a></div>
      </footer>
    </div>
  )
}
