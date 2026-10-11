import { cn } from "@/lib/utils"

export type FeatureListItem = {
  title: string
  description: string
  icon?: React.ReactNode
}

/**
 * Icon + text feature rows. `columns` 2 or 3 lays them in a grid; `columns={1}` with a
 * heading gives the classic "heading left, list right" split.
 */
export function FeatureList({
  eyebrow,
  heading,
  subheading,
  features,
  columns = 3,
  className,
}: {
  eyebrow?: string
  heading?: React.ReactNode
  subheading?: React.ReactNode
  features: FeatureListItem[]
  columns?: 1 | 2 | 3
  className?: string
}) {
  const split = columns === 1
  return (
    <section
      className={cn(
        "mx-auto w-full max-w-6xl px-6 py-20",
        split && "grid gap-12 md:grid-cols-[1fr_1.3fr] md:gap-16",
        className
      )}
    >
      {eyebrow || heading || subheading ? (
        <header className={cn("max-w-2xl", !split && "mb-12")}>
          {eyebrow ? (
            <p className="mb-3 font-mono text-xs tracking-wider text-muted-foreground uppercase">{eyebrow}</p>
          ) : null}
          {heading ? (
            <h2 className="font-heading text-3xl font-headline tracking-tight text-balance text-foreground sm:text-4xl">
              {heading}
            </h2>
          ) : null}
          {subheading ? <p className="mt-3 text-pretty text-muted-foreground">{subheading}</p> : null}
        </header>
      ) : null}
      <ul
        className={cn(
          "grid gap-x-10 gap-y-10",
          columns === 2 && "sm:grid-cols-2",
          columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
          split && "gap-y-8"
        )}
      >
        {features.map((f) => (
          <li key={f.title} className="flex gap-4">
            {f.icon ? (
              <span
                aria-hidden
                className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-[color-mix(in_oklch,var(--primary)_14%,var(--card))] text-foreground [&_svg]:size-5"
              >
                {f.icon}
              </span>
            ) : null}
            <div className="min-w-0">
              <h3 className="font-heading text-lg leading-snug font-headline text-foreground">{f.title}</h3>
              <p className="mt-1 text-sm text-pretty text-muted-foreground">{f.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
