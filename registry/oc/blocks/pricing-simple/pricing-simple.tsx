"use client"

import { Check } from "lucide-react"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export type PricingTier = {
  name: string
  description: string
  /** Monthly price in whole currency units; `null` renders "Custom". */
  monthly: number | null
  /** Yearly price per month. Defaults to monthly × 0.8. */
  yearly?: number | null
  features: string[]
  cta: { label: string; href: string }
  featured?: boolean
}

export function PricingSimple({
  heading = "Pricing",
  subheading,
  tiers,
  currency = "$",
  className,
}: {
  heading?: React.ReactNode
  subheading?: React.ReactNode
  tiers: PricingTier[]
  currency?: string
  className?: string
}) {
  const [yearly, setYearly] = React.useState(true)
  const id = React.useId()

  return (
    <section className={cn("mx-auto w-full max-w-6xl px-6 py-20", className)}>
      <header className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-4 text-center">
        <h2 className="font-heading text-3xl font-headline tracking-tight text-foreground sm:text-4xl">{heading}</h2>
        {subheading ? <p className="text-pretty text-muted-foreground">{subheading}</p> : null}
        <div className="flex items-center gap-3 text-sm">
          <Label htmlFor={id} className={cn(!yearly ? "text-foreground" : "text-muted-foreground")}>
            Monthly
          </Label>
          <Switch id={id} checked={yearly} onCheckedChange={setYearly} />
          <Label htmlFor={id} className={cn(yearly ? "text-foreground" : "text-muted-foreground")}>
            Yearly <Badge variant="secondary">−20%</Badge>
          </Label>
        </div>
      </header>
      <div className={cn("grid gap-4", tiers.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
        {tiers.map((t) => {
          const price = yearly ? (t.yearly ?? (t.monthly === null ? null : Math.round(t.monthly * 0.8))) : t.monthly
          return (
            <article
              key={t.name}
              className={cn(
                "relative flex flex-col rounded-xl border bg-card p-6 text-card-foreground",
                t.featured && "border-primary shadow-lg ring-1 ring-primary/30"
              )}
            >
              {t.featured ? <Badge className="absolute -top-2.5 left-6">Most popular</Badge> : null}
              <h3 className="font-heading text-lg font-headline">{t.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
              <p className="mt-6 flex items-baseline gap-1">
                {price === null ? (
                  <span className="font-heading text-4xl font-headline tracking-tight">Custom</span>
                ) : (
                  <>
                    <span className="font-heading text-4xl font-headline tracking-tight tabular-nums">
                      {currency}
                      {price}
                    </span>
                    <span className="text-sm text-muted-foreground">/mo</span>
                  </>
                )}
              </p>
              <ul className="mt-6 flex-1 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    {/* filled chip, not text-primary: primary may be a fill-only colour (acid yellow) */}
                    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3" strokeWidth={3} aria-hidden />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8 w-full" variant={t.featured ? "default" : "outline"} asChild>
                <a href={t.cta.href}>{t.cta.label}</a>
              </Button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
