import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type HeroSpotlightProps = {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  primaryAction?: { label: string; href: string }
  secondaryAction?: { label: string; href: string }
  className?: string
  children?: React.ReactNode
}

export function HeroSpotlight({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
  children,
}: HeroSpotlightProps) {
  return (
    <section
      className={cn(
        "relative isolate flex min-h-[36rem] w-full flex-col items-center justify-center overflow-hidden bg-background px-6 py-24 text-center",
        className
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-70" style={{ background: "conic-gradient(from 155deg at 50% -15%, transparent 0deg, color-mix(in oklch, var(--primary) 18%, transparent) 25deg, transparent 55deg, color-mix(in oklch, var(--primary) 9%, transparent) 85deg, transparent 110deg)" }} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklch,var(--primary)_10%,transparent),transparent_60%)]"
      />
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6">
        {eyebrow ? (
          <Badge variant="outline" className="bg-background/60 backdrop-blur">
            {eyebrow}
          </Badge>
        ) : null}
        <h1 className="font-heading text-4xl font-headline tracking-tight text-balance text-foreground sm:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-xl text-lg text-pretty text-muted-foreground">{description}</p>
        ) : null}
        {primaryAction || secondaryAction ? (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {primaryAction ? (
              <Button size="lg" asChild>
                <Link href={primaryAction.href}>{primaryAction.label}</Link>
              </Button>
            ) : null}
            {secondaryAction ? (
              <Button size="lg" variant="outline" asChild>
                <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
              </Button>
            ) : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  )
}
