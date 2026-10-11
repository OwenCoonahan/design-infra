"use client"

import { REPOSITORY_URL } from "@/lib/config"

import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"

const NAV = [
  { href: "/design-systems", label: "Design systems" },
  { href: "/templates", label: "Templates" },
  { href: "/starter", label: "Start here" },
  { href: "/feedback", label: "Feedback" },
  { href: "/components", label: "Catalog" },
  { href: "/inspiration", label: "Inspiration" },
  { href: "/sources", label: "Sources" },
  { href: "/registry", label: "Registry" },
  { href: "/toolchain", label: "Toolchain" },
  { href: "/guide", label: "Guide" },
  { href: "/integrate", label: "Connect" },
]

/** Top-level segments rendered without gallery chrome (full-bleed screenshot targets). */
const CHROMELESS_SEGMENTS = new Set(["preview"])

export function SiteHeader() {
  const segment = useSelectedLayoutSegment()
  if (segment && CHROMELESS_SEGMENTS.has(segment)) return null
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex min-h-14 max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-3">
        <Link href="/" className="font-mono text-sm font-semibold tracking-tight">
          design-infra
        </Link>
        <nav aria-label="Main navigation" className="order-3 flex w-full items-center gap-4 overflow-x-auto whitespace-nowrap text-sm text-muted-foreground lg:order-none lg:w-auto lg:flex-1">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="transition-colors hover:text-foreground">
              {n.label}
            </Link>
          ))}
        </nav>
        <a
          href={REPOSITORY_URL}
          className="ml-auto text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          GitHub
        </a>
      </div>
    </header>
  )
}
