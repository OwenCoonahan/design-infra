import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export type Testimonial = {
  quote: string
  name: string
  role?: string
  avatar?: string
  /** One highlighted quote per grid — rendered on a --primary fill, larger type. */
  featured?: boolean
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

/** Masonry grid of customer quotes (1 → 2 → 3 columns). */
export function TestimonialsGrid({
  heading,
  subheading,
  testimonials,
  className,
}: {
  heading?: React.ReactNode
  subheading?: React.ReactNode
  testimonials: Testimonial[]
  className?: string
}) {
  return (
    <section className={cn("mx-auto w-full max-w-6xl px-6 py-20", className)}>
      {heading || subheading ? (
        <header className="mx-auto mb-12 max-w-2xl text-center">
          {heading ? (
            <h2 className="font-heading text-3xl font-headline tracking-tight text-balance text-foreground sm:text-4xl">
              {heading}
            </h2>
          ) : null}
          {subheading ? <p className="mt-3 text-pretty text-muted-foreground">{subheading}</p> : null}
        </header>
      ) : null}
      <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
        {testimonials.map((t) => (
          <figure
            key={t.name + t.quote.slice(0, 12)}
            className={cn(
              "mb-4 flex break-inside-avoid flex-col gap-5 rounded-xl border p-6",
              t.featured ? "border-primary bg-primary text-primary-foreground" : "bg-card text-card-foreground"
            )}
          >
            <blockquote
              className={
                t.featured
                  ? "font-heading text-xl leading-snug font-headline text-pretty"
                  : "text-sm leading-relaxed text-pretty"
              }
            >
              <p>&ldquo;{t.quote}&rdquo;</p>
            </blockquote>
            <figcaption className="mt-auto flex items-center gap-3">
              <Avatar className="size-9">
                {t.avatar ? <AvatarImage src={t.avatar} alt="" /> : null}
                <AvatarFallback className={cn("text-xs", t.featured && "bg-primary-foreground text-primary")}>
                  {initials(t.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 text-sm">
                <div className="font-medium">{t.name}</div>
                {t.role ? (
                  <div className={cn("truncate", t.featured ? "text-primary-foreground/80" : "text-muted-foreground")}>
                    {t.role}
                  </div>
                ) : null}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
