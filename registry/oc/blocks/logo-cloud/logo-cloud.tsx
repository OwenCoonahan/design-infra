import { cn } from "@/lib/utils"

export type Logo = {
  name: string
  /** SVG / <img>. Use `currentColor` fills so logos follow the theme. Omit for a text wordmark. */
  logo?: React.ReactNode
  href?: string
}

function LogoItem({ item }: { item: Logo }) {
  const content = item.logo ? (
    <span className="flex h-8 items-center [&_img]:h-full [&_img]:w-auto [&_svg]:h-full [&_svg]:w-auto">
      {item.logo}
      <span className="sr-only">{item.name}</span>
    </span>
  ) : (
    <span className="font-heading text-xl font-headline tracking-tight whitespace-nowrap">{item.name}</span>
  )
  const cls =
    "flex shrink-0 items-center justify-center text-muted-foreground opacity-80 grayscale transition hover:text-foreground hover:opacity-100 hover:grayscale-0"
  return item.href ? (
    <a href={item.href} className={cls}>
      {content}
    </a>
  ) : (
    <div className={cls}>{content}</div>
  )
}

/**
 * "Trusted by" strip. `variant="static"` lays logos out in a wrapping row;
 * `variant="marquee"` scrolls them forever with faded edges (pauses on hover and
 * respects prefers-reduced-motion).
 */
export function LogoCloud({
  heading = "Trusted by teams at",
  logos,
  variant = "static",
  speed = 40,
  className,
}: {
  heading?: React.ReactNode
  logos: Logo[]
  variant?: "static" | "marquee"
  /** Seconds per loop (marquee only). */
  speed?: number
  className?: string
}) {
  return (
    <section className={cn("mx-auto w-full max-w-6xl px-6 py-12", className)}>
      {heading ? <p className="mb-8 text-center text-sm tracking-wide text-muted-foreground">{heading}</p> : null}
      {variant === "marquee" ? (
        <div className="group/marquee relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1 || undefined}
              className="flex shrink-0 animate-[oc-marquee_var(--oc-marquee-duration)_linear_infinite] items-center gap-14 pr-14 group-hover/marquee:[animation-play-state:paused] motion-reduce:animate-none"
              style={{ "--oc-marquee-duration": `${speed}s` } as React.CSSProperties}
            >
              {logos.map((l) => (
                <li key={l.name}>
                  <LogoItem item={l} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      ) : (
        <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {logos.map((l) => (
            <li key={l.name}>
              <LogoItem item={l} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
