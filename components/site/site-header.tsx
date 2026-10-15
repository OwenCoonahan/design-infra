"use client"

import { REPOSITORY_URL } from "@/lib/config"

import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { useSelectedLayoutSegment } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const NAV = [
  { href: "/components", label: "Catalog" },
  { href: "/guide", label: "Guide" },
  { href: "/integrate", label: "Connect" },
]
const MORE = [
  { href: "/inspiration", label: "Saved references" },
  { href: "/starter", label: "Tested starters" },
  { href: "/templates", label: "Templates" },
  { href: "/design-systems", label: "Legacy themes" },
  { href: "/sources", label: "Sources" },
  { href: "/registry", label: "Registry" },
  { href: "/toolchain", label: "Toolchain" },
  { href: "/feedback", label: "Feedback" },
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
        <nav aria-label="Main navigation" className="order-3 flex w-full items-center gap-3 whitespace-nowrap text-xs text-muted-foreground sm:order-none sm:w-auto sm:flex-1 sm:gap-5 sm:text-sm">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={segment === n.href.slice(1) ? "page" : undefined} className="transition-colors hover:text-foreground aria-[current=page]:text-foreground">
              {n.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-sm py-1 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">More <ChevronDown className="size-3.5" aria-hidden="true" /></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-44">
              {MORE.map((item) => <DropdownMenuItem key={item.href} asChild><Link href={item.href}>{item.label}</Link></DropdownMenuItem>)}
            </DropdownMenuContent>
          </DropdownMenu>
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
