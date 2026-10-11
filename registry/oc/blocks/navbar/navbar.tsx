"use client"

import { Menu } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export type NavbarLink = { label: string; href: string }
export type NavbarAction = { label: string; href: string }

/**
 * Sticky marketing navbar: brand left, links centre, actions right. Below `md` the links
 * and actions move into a sheet menu.
 */
export function Navbar({
  brand,
  links = [],
  primaryAction,
  secondaryAction,
  sticky = true,
  className,
}: {
  brand: { name: string; href?: string; logo?: React.ReactNode }
  links?: NavbarLink[]
  primaryAction?: NavbarAction
  secondaryAction?: NavbarAction
  sticky?: boolean
  className?: string
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <header
      className={cn(
        "z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70",
        sticky && "sticky top-0",
        className
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-6">
        <Link href={brand.href ?? "/"} className="flex shrink-0 items-center gap-2 text-foreground">
          {brand.logo ? (
            <span className="flex size-7 items-center justify-center [&_svg]:size-5">{brand.logo}</span>
          ) : null}
          <span className="font-heading text-lg font-headline tracking-tight">{brand.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href + l.label}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          {secondaryAction ? (
            <Button variant="ghost" asChild>
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          ) : null}
          {primaryAction ? (
            <Button asChild>
              <Link href={primaryAction.href}>{primaryAction.label}</Link>
            </Button>
          ) : null}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-auto md:hidden" aria-label="Open menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-xs">
            <SheetHeader>
              <SheetTitle>{brand.name}</SheetTitle>
              <SheetDescription className="sr-only">Site navigation</SheetDescription>
            </SheetHeader>
            <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
              {links.map((l) => (
                <Link
                  key={l.href + l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-base text-foreground transition-colors hover:bg-muted"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-2 p-4">
              {secondaryAction ? (
                <Button variant="outline" size="lg" asChild>
                  <Link href={secondaryAction.href} onClick={() => setOpen(false)}>
                    {secondaryAction.label}
                  </Link>
                </Button>
              ) : null}
              {primaryAction ? (
                <Button size="lg" asChild>
                  <Link href={primaryAction.href} onClick={() => setOpen(false)}>
                    {primaryAction.label}
                  </Link>
                </Button>
              ) : null}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
