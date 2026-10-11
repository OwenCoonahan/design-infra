import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { ThemeStage } from "@/components/site/theme-stage"
import { Badge } from "@/components/ui/badge"
import { MOOD_NAMES, MOODS } from "@/lib/catalog/moods"
import { getCatalog, getDesignSystems, getSources } from "@/lib/data"
import { HeroSpotlight } from "@/registry/oc/blocks/hero-spotlight/hero-spotlight"

export default async function Home() {
  const [catalog, systems, sources] = await Promise.all([getCatalog(), getDesignSystems(), getSources()])
  const curated = catalog.filter((e) => e.curated && e.source !== "oc").length
  const ours = catalog.filter((e) => e.source === "oc").length
  const moodCounts = new Map<string, number>()
  for (const e of catalog) for (const m of e.moods) moodCounts.set(m, (moodCounts.get(m) ?? 0) + 1)

  return (
    <>
      <HeroSpotlight
        eyebrow={`${catalog.length} components · ${systems.length} design systems · ${sources.length} sources`}
        title="Design infrastructure for every repo"
        description="Describe how your UI should feel, explore real components, and compare them live. Pick what works and give your agent the pieces to build with."
        primaryAction={{ label: "Find components", href: "/components" }}
        secondaryAction={{ label: "Connect your project", href: "/integrate" }}
        className="min-h-[32rem] border-b"
      />

      <section className="mx-auto grid max-w-7xl gap-4 px-6 py-12 md:grid-cols-3">
        {[
          {
            step: "1",
            title: "Connect your project",
            href: "/integrate",
            body: "Copy the setup prompt into your project's agent. It checks your stack, connects the catalog, and keeps your current brand.",
          },
          {
            step: "2",
            title: "See real options",
            href: "/components",
            body: "Paste a reference link or screenshot, or ask to replace a section you dislike. See real component options with live demos before choosing.",
          },
          {
            step: "3",
            title: "Use your picks",
            href: "/guide",
            body: "Copy your selection to the agent. It installs and adapts the chosen components, then verifies them in your actual UI.",
          },
        ].map((s) => (
          <div key={s.step} className="flex flex-col gap-3 rounded-xl border bg-card p-5">
            <span className="font-mono text-xs text-muted-foreground">STEP {s.step}</span>
            <h2 className="font-semibold">{s.title}</h2>
            <p className="text-sm text-muted-foreground">{s.body}</p>
            <Link href={s.href} className="mt-auto flex items-center gap-1 text-sm underline underline-offset-4">
              {s.title} <ArrowRight className="size-4" />
            </Link>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-4">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">Browse by feel</h2>
          <p className="text-sm text-muted-foreground">Start from how it should feel — every entry carries 1–3 moods.</p>
        </div>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {MOOD_NAMES.map((m) => (
            <li key={m}>
              <Link
                href={`/components?mood=${m}`}
                title={MOODS[m].description}
                className="flex h-full flex-col gap-0.5 rounded-xl border bg-card px-3 py-2.5 transition-colors hover:border-ring"
              >
                <span className="flex items-baseline justify-between gap-2 text-sm font-medium">
                  {MOODS[m].label}
                  <span className="font-mono text-[11px] font-normal text-muted-foreground">{moodCounts.get(m) ?? 0}</span>
                </span>
                <span className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">{MOODS[m].description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Design systems</h2>
            <p className="text-sm text-muted-foreground">DESIGN.md files compiled to shadcn themes.</p>
          </div>
          <Link href="/design-systems" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            All <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {systems.map((s) => (
            <Link key={s.slug} href={`/design-systems/${s.slug}`} className="group">
              <ThemeStage theme={s.slug} modes={[s.modes[0]]} className="transition-colors group-hover:border-ring">
                <div className="flex h-44 flex-col justify-between p-5">
                  <div className="flex gap-1.5">
                    {["bg-primary", "bg-secondary", "bg-accent", "bg-muted", "bg-foreground"].map((c) => (
                      <span key={c} className={`size-5 rounded-full border ${c}`} />
                    ))}
                  </div>
                  <div>
                    <p className="font-heading text-2xl leading-tight text-foreground">{s.name}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{s.description}</p>
                  </div>
                </div>
              </ThemeStage>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 py-12 md:grid-cols-3">
        <Link href="/components?curated=1" className="rounded-xl border bg-card p-5 transition-colors hover:border-ring">
          <Badge variant="secondary">{curated} curated</Badge>
          <h3 className="mt-3 font-semibold">Curated third-party picks</h3>
          <p className="mt-1 text-sm text-muted-foreground">With notes on when to use them and what to fix after install.</p>
        </Link>
        <Link href="/registry" className="rounded-xl border bg-card p-5 transition-colors hover:border-ring">
          <Badge variant="secondary">{ours} @design-infra items</Badge>
          <h3 className="mt-3 font-semibold">Our registry</h3>
          <p className="mt-1 text-sm text-muted-foreground">Theme-aware blocks + themes, installable with the shadcn CLI.</p>
        </Link>
        <Link href="/sources" className="rounded-xl border bg-card p-5 transition-colors hover:border-ring">
          <Badge variant="secondary">{sources.length} sources</Badge>
          <h3 className="mt-3 font-semibold">Libraries & tools</h3>
          <p className="mt-1 text-sm text-muted-foreground">Licence, install, gotchas and best picks for each source.</p>
        </Link>
      </section>
    </>
  )
}
