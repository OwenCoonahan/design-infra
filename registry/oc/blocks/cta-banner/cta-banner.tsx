import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Closing call-to-action. `variant="primary"` is a full --primary panel (buttons invert
 * to primary-foreground so it works on acid-yellow and rust alike); `variant="card"` is a
 * quieter bordered card with a primary glow.
 */
export function CtaBanner({
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = "primary",
  className,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  primaryAction?: { label: string; href: string }
  secondaryAction?: { label: string; href: string }
  variant?: "primary" | "card"
  className?: string
}) {
  const filled = variant === "primary"
  return (
    <section className={cn("mx-auto w-full max-w-6xl px-6 py-16", className)}>
      <div
        className={cn(
          "relative isolate overflow-hidden rounded-2xl border px-6 py-14 sm:px-12 md:py-16",
          filled ? "border-primary bg-primary text-primary-foreground" : "bg-card text-card-foreground"
        )}
      >
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 -z-10",
            filled
              ? "bg-[linear-gradient(to_right,color-mix(in_oklch,var(--primary-foreground)_9%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--primary-foreground)_9%,transparent)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_right,black,transparent_70%)] bg-[size:32px_32px]"
              : "bg-[radial-gradient(ellipse_at_top_right,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_60%)]"
          )}
        />
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl font-headline tracking-tight text-balance sm:text-4xl">{title}</h2>
            {description ? (
              <p className={cn("mt-3 text-pretty", filled ? "text-primary-foreground/80" : "text-muted-foreground")}>
                {description}
              </p>
            ) : null}
          </div>
          {primaryAction || secondaryAction ? (
            <div className="flex shrink-0 flex-wrap gap-3">
              {secondaryAction ? (
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className={cn(
                    filled &&
                      "border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground dark:border-primary-foreground/30 dark:bg-transparent dark:hover:bg-primary-foreground/10"
                  )}
                >
                  <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
                </Button>
              ) : null}
              {primaryAction ? (
                <Button
                  size="lg"
                  asChild
                  className={cn(filled && "bg-primary-foreground text-primary hover:bg-primary-foreground/90")}
                >
                  <Link href={primaryAction.href}>
                    {primaryAction.label}
                    <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
