import { ArrowRight, Check } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type HeroSplitProps = {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  primaryAction?: { label: string; href: string }
  secondaryAction?: { label: string; href: string }
  /** Short proof points under the actions ("No credit card", "SOC 2"). */
  bullets?: string[]
  /** Right-hand visual: screenshot, video, illustration. Defaults to a themed product mock. */
  media?: React.ReactNode
  /** Put the media on the left instead. */
  reverse?: boolean
  className?: string
}

/** Two-column hero: copy + actions on one side, product media in a framed window on the other. */
export function HeroSplit({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  bullets,
  media,
  reverse,
  className,
}: HeroSplitProps) {
  return (
    <section className={cn("relative isolate w-full overflow-hidden bg-background", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_20%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_55%)]"
      />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-20 md:py-28 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className={cn("flex flex-col items-start gap-6", reverse && "lg:order-2")}>
          {eyebrow ? (
            <Badge variant="outline" className="bg-background/60 backdrop-blur">
              {eyebrow}
            </Badge>
          ) : null}
          <h1 className="font-heading text-4xl leading-[1.05] font-headline tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description ? <p className="max-w-xl text-lg text-pretty text-muted-foreground">{description}</p> : null}
          {primaryAction || secondaryAction ? (
            <div className="flex flex-wrap items-center gap-3">
              {primaryAction ? (
                <Button size="lg" asChild>
                  <Link href={primaryAction.href}>
                    {primaryAction.label}
                    <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
              ) : null}
              {secondaryAction ? (
                <Button size="lg" variant="outline" asChild>
                  <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
                </Button>
              ) : null}
            </div>
          ) : null}
          {bullets?.length ? (
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-1.5">
                  <Check className="size-4 text-foreground" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className={cn("relative", reverse && "lg:order-1")}>
          <div className="overflow-hidden rounded-xl border bg-card shadow-2xl shadow-[color-mix(in_oklch,var(--primary)_14%,transparent)]">
            <div className="flex h-9 items-center gap-1.5 border-b bg-muted/60 px-3">
              <span className="size-2.5 rounded-full bg-foreground/15" />
              <span className="size-2.5 rounded-full bg-foreground/15" />
              <span className="size-2.5 rounded-full bg-foreground/15" />
            </div>
            <div className="aspect-[4/3] w-full">{media ?? <HeroSplitMock />}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Placeholder product UI drawn with theme tokens — swap for a real screenshot. */
function HeroSplitMock() {
  const bars = [38, 52, 44, 63, 58, 72, 66, 84, 78, 92]
  return (
    <div aria-hidden className="grid h-full grid-cols-[28%_1fr] text-card-foreground">
      <div className="flex flex-col gap-2 border-r bg-muted/40 p-4">
        <div className="mb-2 h-3 w-16 rounded bg-foreground/20" />
        {[70, 55, 80, 60, 45].map((w, i) => (
          <div key={i} className={cn("h-6 rounded-md px-2 py-2", i === 1 && "bg-primary")}>
            <div
              className={cn("h-2 rounded", i === 1 ? "bg-primary-foreground/70" : "bg-foreground/15")}
              style={{ width: `${w}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 p-5">
        <div className="grid grid-cols-3 gap-3">
          {["12.4k", "98.2%", "41ms"].map((v) => (
            <div key={v} className="rounded-lg border bg-background p-3">
              <div className="h-2 w-10 rounded bg-foreground/15" />
              <div className="mt-2 font-heading text-lg font-headline tabular-nums">{v}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-1 items-end gap-2 rounded-lg border bg-background p-4">
          {bars.map((h, i) => (
            <div
              key={i}
              className={cn("flex-1 rounded-sm", i === bars.length - 1 ? "bg-primary" : "bg-foreground/15")}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {[90, 75, 82].map((w, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="size-5 rounded-full bg-foreground/15" />
              <div className="h-2 rounded bg-foreground/10" style={{ width: `${w}%` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
