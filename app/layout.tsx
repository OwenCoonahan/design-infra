import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Geist, Geist_Mono } from "next/font/google"

import { designSystemFontVariables } from "@/app/fonts.generated"
import { DevTools } from "@/components/site/dev-tools"
import { ShortlistBar } from "@/components/site/shortlist-bar"
import { SiteHeader } from "@/components/site/site-header"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { BASE_PATH, SITE_URL, sitePath } from "@/lib/config"

import "./globals.css"

// Behind the personal site's /design-infra rewrite, root /_vercel/insights URLs reach that site's project, and
// cross-origin posts to this project's domain fail CORS. Stay same-origin under the base path; next.config.ts
// rewrites it to this deployment's /_vercel/insights.
const analyticsPath = process.env.VERCEL && BASE_PATH ? `${BASE_PATH}/_vercel/insights` : null
const analyticsProps = analyticsPath
  ? { scriptSrc: `${analyticsPath}/script.js`, viewEndpoint: `${analyticsPath}/view`, eventEndpoint: `${analyticsPath}/event` }
  : {}

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: { default: "design-infra", template: "%s · design-infra" },
  description: "Design systems, curated component catalog and the @design-infra shadcn registry.",
  // Declare both formats explicitly so subpath deployments retain the ICO fallback.
  icons: {
    icon: [
      { url: sitePath("/favicon.ico?v=diamonds-1"), type: "image/x-icon", sizes: "16x16 32x32 48x48" },
      { url: sitePath("/icon.svg?v=diamonds-1"), type: "image/svg+xml", sizes: "any" },
    ],
    apple: [{ url: sitePath("/apple-icon.png?v=diamonds-1"), type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: "Design Infra",
    title: "Design Infra — Good UI starts with better components.",
    description: "Find real components. Build with Claude Code or Codex.",
    images: [{ url: `${SITE_URL}/brand/share.png`, width: 1200, height: 630, alt: "Design Infra: Good UI starts with better components. Four geometric diamonds on a dark gallery surface." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Design Infra — Good UI starts with better components.",
    description: "Find real components. Build with Claude Code or Codex.",
    images: [`${SITE_URL}/brand/share.png`],
  },
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
        <Analytics {...analyticsProps} />
      </body>
    </html>
  )
}
