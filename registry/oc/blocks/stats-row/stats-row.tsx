import { cn } from "@/lib/utils"

export type Stat = {
  /** Display value, pre-formatted ("99.99%", "2.4M", "<50ms"). */
  value: string
  label: string
  description?: string
}

/**
 * Big-number proof row for marketing pages. `variant="divided"` uses hairlines between
 * stats; `variant="cards"` puts each on its own card.
 */
export function StatsRow({
  heading,
  subheading,
  stats,
  variant = "divided",
  className,
}: {
  heading?: React.ReactNode
  subheading?: React.ReactNode
  stats: Stat[]
  variant?: "divided" | "cards"
  className?: string
}) {
  const cols =
    stats.length === 3 ? "sm:grid-cols-3" : stats.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"
  return (
    <section className={cn("mx-auto w-full max-w-6xl px-6 py-16", className)}>
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
      <dl
        className={cn(
          "grid grid-cols-1",
          cols,
          // hairlines between cells: 1px gaps over a border-coloured backdrop
          variant === "divided" ? "gap-px border-y bg-border" : "gap-4"
        )}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className={cn(
              "flex flex-col gap-1",
              variant === "divided"
                ? "bg-background px-1 py-8 sm:px-6"
                : "rounded-xl border bg-card p-6 text-card-foreground"
            )}
          >
            <dt className="order-2 text-sm text-foreground">{s.label}</dt>
            <dd className="order-1 font-heading text-4xl font-headline tracking-tight text-foreground tabular-nums sm:text-5xl">
              {s.value}
            </dd>
            {s.description ? <dd className="order-3 text-sm text-muted-foreground">{s.description}</dd> : null}
          </div>
        ))}
      </dl>
    </section>
  )
}
