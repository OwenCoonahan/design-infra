"use client"

import { ChevronRight } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type FeatureLevel = {
  /** Nav label; defaults to `title`. */
  label?: string
  title: string
  description: string
  /** Photo/illustration behind the overlay. Omit for a theme-tinted gradient scene. */
  image?: string
  imageAlt?: string
  /** Product UI floating over the image — use <LevelCard> for the glass look. */
  overlay?: React.ReactNode
  cta?: { label: string; href: string }
}

/** Glass card for overlays on feature-level panels (code windows, status lists, logs). */
export function LevelCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "w-full max-w-md rounded-xl border bg-card/85 p-4 text-card-foreground shadow-2xl backdrop-blur-md",
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * Multi-level feature walkthrough: two-tone headline, sticky numbered scroll-spy nav on the left,
 * large image panels with floating product UI on the right. Inspired by Aceternity's (Pro)
 * "multi-level features with illustrations" — original, theme-aware implementation.
 */
export function FeatureLevels({
  heading,
  subheading,
  section = 1,
  features,
  className,
}: {
  heading: React.ReactNode
  /** Second headline line, rendered muted. */
  subheading?: React.ReactNode
  /** Major number for the nav ("1.0, 1.1…"). */
  section?: number
  features: FeatureLevel[]
  className?: string
}) {
  const [active, setActive] = React.useState(0)
  const panels = React.useRef<(HTMLElement | null)[]>([])
  const id = React.useId()

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index))
        }
      },
      { rootMargin: "-35% 0px -55% 0px" }
    )
    for (const el of panels.current) if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [features.length])

  return (
    <section className={cn("mx-auto w-full max-w-6xl border-x bg-background", className)}>
      <header className="border-b px-6 pt-20 pb-12 md:px-10">
        <h2 className="max-w-2xl font-heading text-3xl font-headline tracking-tight text-balance text-foreground sm:text-4xl">
          {heading}
          {subheading ? (
            <>
              <br />
              <span className="text-muted-foreground">{subheading}</span>
            </>
          ) : null}
        </h2>
      </header>

      <div className="grid gap-10 px-6 py-10 md:grid-cols-[13rem_1fr] md:px-10">
        <nav aria-label="Features" className="hidden md:block">
          <ol className="sticky top-24 flex flex-col gap-3 text-sm">
            {features.map((f, i) => (
              <li key={f.title}>
                <a
                  href={`#${id}-${i}`}
                  onClick={(e) => {
                    e.preventDefault()
                    panels.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" })
                  }}
                  aria-current={active === i ? "step" : undefined}
                  className={cn(
                    "flex items-center gap-3 transition-colors",
                    active === i ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="font-mono text-xs tabular-nums">
                    {section}.{i}
                  </span>
                  <span className="flex-1">{f.label ?? f.title}</span>
                  <ChevronRight
                    aria-hidden
                    className={cn("size-3.5 transition-opacity", active === i ? "opacity-100" : "opacity-0")}
                  />
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex flex-col gap-20">
          {features.map((f, i) => (
            <article
              key={f.title}
              id={`${id}-${i}`}
              data-index={i}
              ref={(el) => {
                panels.current[i] = el
              }}
              className="scroll-mt-24"
            >
              <figure className="relative aspect-[16/10] overflow-hidden rounded-xl border bg-muted">
                {f.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={f.image}
                    alt={f.imageAlt ?? ""}
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover"
                  />
                ) : (
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_10%,color-mix(in_oklch,var(--primary)_35%,transparent),transparent_60%),radial-gradient(90%_70%_at_90%_100%,color-mix(in_oklch,var(--accent)_70%,transparent),transparent_70%)]"
                  />
                )}
                {f.overlay ? (
                  <div className="absolute inset-0 grid place-items-center p-4 sm:p-8">{f.overlay}</div>
                ) : null}
              </figure>
              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-xl">
                  <h3 className="font-heading text-lg font-headline text-foreground">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-pretty text-muted-foreground">{f.description}</p>
                </div>
                {f.cta ? (
                  <Button size="sm" asChild className="shrink-0">
                    <a href={f.cta.href}>
                      {f.cta.label}
                      <ChevronRight data-icon="inline-end" />
                    </a>
                  </Button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
