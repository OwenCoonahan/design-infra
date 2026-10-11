import { cn } from "@/lib/utils"

export type BentoFeature = {
  title: string
  description: string
  icon?: React.ReactNode
  /** Visual for the top of the tile (image, illustration, mini demo). */
  visual?: React.ReactNode
  /** Grid span on md+ screens. */
  span?: "1" | "2" | "row"
}

const SPAN = {
  "1": "md:col-span-1",
  "2": "md:col-span-2",
  row: "md:col-span-1 md:row-span-2",
} as const

export function FeatureBento({
  heading,
  subheading,
  features,
  className,
}: {
  heading?: React.ReactNode
  subheading?: React.ReactNode
  features: BentoFeature[]
  className?: string
}) {
  return (
    <section className={cn("mx-auto w-full max-w-6xl px-6 py-20", className)}>
      {heading || subheading ? (
        <header className="mb-10 max-w-2xl">
          {heading ? (
            <h2 className="font-heading text-3xl font-headline tracking-tight text-balance text-foreground sm:text-4xl">
              {heading}
            </h2>
          ) : null}
          {subheading ? <p className="mt-3 text-pretty text-muted-foreground">{subheading}</p> : null}
        </header>
      ) : null}
      <div className="grid auto-rows-[16rem] grid-cols-1 gap-4 md:grid-cols-3">
        {features.map((f) => (
          <article
            key={f.title}
            className={cn(
              "group/bento relative flex flex-col justify-between overflow-hidden rounded-xl border bg-card p-5 text-card-foreground transition-colors hover:border-ring/60",
              SPAN[f.span ?? "1"]
            )}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklch,var(--primary)_12%,transparent),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100" />
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg">
              {f.visual ?? (
                <div className="h-full w-full rounded-lg bg-[linear-gradient(135deg,var(--muted),transparent)] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
              )}
            </div>
            <div className="relative mt-4 transition-transform duration-200 group-hover/bento:translate-x-1">
              {f.icon ? <div className="mb-2 text-muted-foreground [&_svg]:size-5">{f.icon}</div> : null}
              <h3 className="font-heading text-lg leading-snug font-headline text-foreground">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
