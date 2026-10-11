import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Design lab — a TEMPORARY page an agent installs in your project to show candidate variants of
 * one of your components side by side, with your theme and your content. Tell the agent which
 * option you want (e.g. "go with B, but slower"); it applies it and deletes
 * app/design-lab/ + components/design-lab.tsx.
 */
export function DesignLab({
  title,
  description,
  columns = 3,
  className,
  children,
}: {
  title: string
  description?: React.ReactNode
  /** Max options per row on wide screens. */
  columns?: 1 | 2 | 3 | 4
  className?: string
  children: React.ReactNode
}) {
  const cols = { 1: "", 2: "md:grid-cols-2", 3: "md:grid-cols-2 xl:grid-cols-3", 4: "md:grid-cols-2 xl:grid-cols-4" }[columns]
  return (
    <section className={cn("mx-auto w-full max-w-7xl px-6 py-10", className)}>
      <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">Design lab · temporary</p>
      <h1 className="font-heading font-headline mt-2 text-3xl tracking-tight text-foreground">{title}</h1>
      {description ? <div className="mt-2 max-w-2xl text-muted-foreground">{description}</div> : null}
      <p className="mt-4 max-w-2xl rounded-lg border border-dashed bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
        Try each option, then tell your agent which one you want — e.g. <q className="text-foreground">go with B</q> or{" "}
        <q className="text-foreground">A, but with C&apos;s hover</q>. It will apply it and delete this page.
      </p>
      <div className={cn("mt-8 grid grid-cols-1 gap-6", cols)}>{children}</div>
    </section>
  )
}

/** One candidate. `id` is what you say back to the agent ("A", "B", "1"…). */
export function LabOption({
  id,
  label,
  notes,
  chosen = false,
  className,
  stageClassName,
  children,
}: {
  id: string
  label: string
  notes?: React.ReactNode
  /** Marks the agent's (or your) current pick. */
  chosen?: boolean
  className?: string
  /** e.g. "min-h-64" or "p-0" for full-bleed sections. */
  stageClassName?: string
  children: React.ReactNode
}) {
  return (
    <article
      aria-label={`Option ${id}: ${label}`}
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground",
        chosen && "border-primary ring-2 ring-primary",
        className
      )}
    >
      <header className="flex items-center gap-2 border-b px-4 py-2.5">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-xs text-foreground">
          {id}
        </span>
        <span className="min-w-0 truncate text-sm font-medium">{label}</span>
        {chosen ? (
          <span className="ml-auto shrink-0 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
            Chosen
          </span>
        ) : null}
      </header>
      <div className={cn("flex min-h-48 flex-1 items-center justify-center bg-background p-8", stageClassName)}>{children}</div>
      {notes ? <footer className="border-t px-4 py-3 text-xs text-muted-foreground">{notes}</footer> : null}
    </article>
  )
}
