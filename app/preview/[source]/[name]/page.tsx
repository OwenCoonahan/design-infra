import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { OC_DEMOS } from "@/components/demos/oc-demos"
import { TEMPLATE_DEMOS } from "@/components/demos/template-demos"
import { AppFrame } from "@/components/site/app-frame"
import { getDesignSystems } from "@/lib/data"
import { config } from "@/lib/config"
import { cn } from "@/lib/utils"

/**
 * Chrome-less, full-bleed render of ONE @design-infra demo — the page `pnpm thumbnails` screenshots.
 *
 *   /preview/oc/<name>?theme=<design-system>&mode=light|dark
 *   /preview/oc/theme-<slug>        → theme-preview under that design system
 *   /preview/oc/template-<x>        → the template's first viewport (1280×800 crop)
 *
 * Any key in OC_DEMOS works automatically; the site header skips the `preview` segment
 * (see components/site/site-header.tsx).
 */
export const metadata: Metadata = { robots: { index: false } }

const DEFAULT_THEME = "editorial"

export default async function PreviewPage(props: PageProps<"/preview/[source]/[name]">) {
  const { source, name } = await props.params
  const search = await props.searchParams
  if (source !== "oc" && source !== config.namespace.slice(1)) notFound()

  const systems = await getDesignSystems()
  // `theme-<slug>` catalog entries (the design-system registry items) preview as theme-preview under that system.
  const themeSystem = OC_DEMOS[name] ? undefined : systems.find((s) => `theme-${s.slug}` === name)
  const template = TEMPLATE_DEMOS[name]
  const demo: (() => React.ReactNode) | undefined = template
    ? () => (
        // Templates are whole pages — show the first viewport, like a browser screenshot.
        <div className="h-[800px] overflow-hidden">
          {template.frame === "app" ? (
            <AppFrame height="800px">
              <template.Page />
            </AppFrame>
          ) : (
            <template.Page />
          )}
        </div>
      )
    : (OC_DEMOS[name] ?? (themeSystem ? OC_DEMOS["theme-preview"] : undefined))
  if (!demo) notFound()

  const requested = typeof search.theme === "string" ? search.theme : DEFAULT_THEME
  const system = themeSystem ?? systems.find((s) => s.slug === requested) ?? systems[0]
  const mode = search.mode === "dark" || search.mode === "light" ? search.mode : system.modes[0]
  const resolvedMode = system.modes.includes(mode) ? mode : system.modes[0]

  return (
    <div
      data-theme={system.slug}
      data-mode={resolvedMode}
      className={cn(resolvedMode, "flex min-h-screen flex-col bg-background font-sans text-foreground")}
    >
      {/* my-auto centres short demos but lets tall ones start at the top instead of overflowing upwards */}
      <div data-preview-content className="my-auto w-full">
        {demo()}
      </div>
    </div>
  )
}
