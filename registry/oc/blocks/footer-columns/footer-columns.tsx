import Link from "next/link"

import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export type FooterColumn = { title: string; links: { label: string; href: string }[] }
export type FooterSocial = { label: string; href: string; icon: React.ReactNode }

/** Site footer: brand + blurb, 2–5 link columns, bottom bar with copyright, legal links and socials. */
export function FooterColumns({
  brand,
  columns,
  legal = [],
  socials = [],
  copyright,
  className,
}: {
  brand: { name: string; description?: string; logo?: React.ReactNode; href?: string }
  columns: FooterColumn[]
  legal?: { label: string; href: string }[]
  socials?: FooterSocial[]
  /** Defaults to "© <year> <brand>". */
  copyright?: React.ReactNode
  className?: string
}) {
  return (
    <footer className={cn("border-t bg-background", className)}>
      <div className="mx-auto w-full max-w-6xl px-6 pt-16 pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div className="flex max-w-xs flex-col gap-3">
            <Link href={brand.href ?? "/"} className="flex items-center gap-2 text-foreground">
              {brand.logo ? (
                <span className="flex size-7 items-center justify-center [&_svg]:size-5">{brand.logo}</span>
              ) : null}
              <span className="font-heading text-lg font-headline tracking-tight">{brand.name}</span>
            </Link>
            {brand.description ? (
              <p className="text-sm text-pretty text-muted-foreground">{brand.description}</p>
            ) : null}
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <p className="text-sm font-medium text-foreground">{col.title}</p>
                <ul className="flex flex-col gap-2">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <Separator className="my-10" />
        <div className="flex flex-col-reverse gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{copyright ?? `© ${new Date().getFullYear()} ${brand.name}. All rights reserved.`}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {legal.map((l) => (
              <Link key={l.label} href={l.href} className="transition-colors hover:text-foreground">
                {l.label}
              </Link>
            ))}
            {socials.length ? (
              <div className="flex items-center gap-1">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex size-8 items-center justify-center rounded-md transition-colors hover:bg-muted hover:text-foreground [&_svg]:size-4"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  )
}
