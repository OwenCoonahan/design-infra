"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { GalleryPreview, PlaybackControls } from "./gallery-preview"
import type { HomeExample } from "./component-scene"

export function HomeShowcase({ examples }: { examples: HomeExample[] }) {
  return <section id="live-components" aria-labelledby="live-components-title" className="scroll-mt-24 border-b py-14 lg:py-20">
    <div className="flex flex-wrap items-end justify-between gap-5">
      <div><h2 id="live-components-title" className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">Small details.<br />Big difference.</h2><p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">Try a component. Open it for the source and install command.</p></div>
      <PlaybackControls />
    </div>
    <div className="mt-9 grid gap-5 md:grid-cols-2">
      {examples.map((example, i) => <article key={example.id} className="min-w-0 overflow-hidden rounded-xl border bg-[#141414]" data-home-example={example.id}>
        <GalleryPreview id={`home-showcase:${example.id}`} title={example.name} descriptor={example.descriptor} poster={example.poster} order={i + 3} interaction="direct" responsive={example.id.startsWith("smoothui/")} minHeight={example.id === "smoothui/card-swipe-deck" ? 420 : example.id === "smoothui/progressive-blur" ? 360 : 0} />
        <div className="p-5"><Link href={example.href} className="flex min-h-11 items-center justify-between gap-3 text-lg font-medium underline-offset-4 hover:underline">{example.name}<ArrowUpRight aria-hidden="true" className="size-4 shrink-0" /></Link></div>
      </article>)}
    </div>
    <Link href="/components?view=live" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm underline underline-offset-4">Find your next component <ArrowUpRight aria-hidden="true" className="size-4" /></Link>
  </section>
}
