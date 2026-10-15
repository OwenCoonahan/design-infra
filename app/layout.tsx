import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { designSystemFontVariables } from "@/app/fonts.generated"
import { DevTools } from "@/components/site/dev-tools"
import { ShortlistBar } from "@/components/site/shortlist-bar"
import { SiteHeader } from "@/components/site/site-header"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { SITE_URL } from "@/lib/config"

import "./globals.css"

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: { default: "design-infra", template: "%s · design-infra" },
  description: "Design systems, curated component catalog and the @design-infra shadcn registry.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("dark h-full antialiased", geistSans.variable, geistMono.variable, designSystemFontVariables)}
    >
      <body className="flex min-h-full flex-col font-sans [--font-heading:var(--font-sans)]">
        <TooltipProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <ShortlistBar />
        </TooltipProvider>
        <DevTools />
      </body>
    </html>
  )
}
