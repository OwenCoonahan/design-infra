import Link from "next/link"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type EmptyStateAction = { label: string; href?: string; onClick?: () => void; icon?: React.ReactNode }

/**
 * Zero-data / first-run placeholder for lists, tables and dashboards. One clear next step,
 * an optional secondary, and an optional help link. `variant="dashed"` outlines the
 * drop-zone; `"plain"` sits inside an existing card.
 */
export function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  help,
  variant = "dashed",
  className,
  children,
}: {
  icon?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  /** `onClick` only works from client components; use `href` in server pages. */
  primaryAction?: EmptyStateAction
  secondaryAction?: EmptyStateAction
  /** Small link under the actions ("Read the docs →"). */
  help?: { label: string; href: string }
  variant?: "dashed" | "plain"
  className?: string
  /** Extra content under the description (e.g. a checklist or code snippet). */
  children?: React.ReactNode
}) {
  const action = (a: EmptyStateAction, primary: boolean) => {
    const inner = (
      <>
        {a.icon}
        {a.label}
      </>
    )
    return (
      <Button variant={primary ? "default" : "outline"} asChild={!!a.href} onClick={a.onClick}>
        {a.href ? <Link href={a.href}>{inner}</Link> : inner}
      </Button>
    )
  }
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden px-6 py-16 text-center",
        variant === "dashed" && "rounded-xl border border-dashed bg-card/40",
        className
      )}
    >
      {icon ? (
        <div className="relative mb-6 flex items-center justify-center" aria-hidden>
          <span className="absolute size-28 rounded-full border border-dashed opacity-60" />
          <span className="absolute size-20 rounded-full border bg-[color-mix(in_oklch,var(--primary)_8%,transparent)]" />
          <span className="relative flex size-12 items-center justify-center rounded-xl border bg-card text-foreground shadow-sm [&_svg]:size-5">
            {icon}
          </span>
        </div>
      ) : null}
      <h3 className="font-heading text-xl font-headline tracking-tight text-foreground">{title}</h3>
      {description ? <p className="mt-2 max-w-sm text-sm text-pretty text-muted-foreground">{description}</p> : null}
      {children ? <div className="mt-6 w-full max-w-md">{children}</div> : null}
      {primaryAction || secondaryAction ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {secondaryAction ? action(secondaryAction, false) : null}
          {primaryAction ? action(primaryAction, true) : null}
        </div>
      ) : null}
      {help ? (
        <Link
          href={help.href}
          className="mt-4 text-sm text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
        >
          {help.label}
        </Link>
      ) : null}
    </div>
  )
}
