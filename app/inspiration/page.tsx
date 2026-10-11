import Link from "next/link"

import { MoodChips } from "@/components/site/entry-badges"
import { getInspirations } from "@/lib/data"
import { inspirationShots } from "@/lib/inspiration"

export const metadata = { title: "Inspiration" }

export default async function InspirationIndex() {
  const items = await getInspirations()
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Inspiration</h1>
      <p className="mt-2 mb-8 max-w-2xl text-muted-foreground">
        Websites and apps the contributors like, captured and analysed — what they feel like, the patterns worth taking, and the
        catalog pieces that reproduce them. Agents read the same files from{" "}
        <code className="font-mono text-sm">inspiration/&lt;slug&gt;/README.md</code>.
      </p>
      {items.length ? (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {await Promise.all(
            items.map(async ({ meta }) => {
              const shots = await inspirationShots(meta.slug)
              return (
                <li key={meta.slug}>
                  <Link
                    href={`/inspiration/${meta.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-ring"
                  >
                    <div className="aspect-[16/10] overflow-hidden border-b bg-muted/40">
                      {shots.hero ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={shots.hero}
                          alt=""
                          className="size-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-medium">{meta.name}</span>
                        <span className="truncate font-mono text-[11px] text-muted-foreground">{new URL(meta.url).host}</span>
                      </div>
                      <p className="line-clamp-3 text-sm text-muted-foreground">{meta.likes ?? meta.summary}</p>
                      <div className="mt-auto flex flex-wrap items-center gap-1 pt-1">
                        <MoodChips moods={meta.moods} />
                        <span className="ml-auto text-[11px] text-muted-foreground">{meta.related.length} related</span>
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })
          )}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Nothing captured yet — paste a website into Claude Code and it will run the ingest flow.</p>
      )}
    </div>
  )
}
