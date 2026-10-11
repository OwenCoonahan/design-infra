import Link from "next/link"

import { OC_DEMOS } from "@/components/demos/oc-demos"
import { TEMPLATE_DEMOS } from "@/components/demos/template-demos"
import { LiveFrame, ThumbnailOrFrame } from "@/components/site/live-frame"
import { ScaleToFit } from "@/components/site/scale-to-fit"
import { TemplatePreview } from "@/components/site/template-preview"
import { ThemeStage } from "@/components/site/theme-stage"
import { isFrameable, liveUrl } from "@/lib/catalog/facets"
import type { CatalogEntry } from "@/lib/catalog/schema"
import { previewSrc } from "@/lib/thumbnails"
import type { DesignSystemMeta } from "@/scripts/build-tokens"

export type Stage = {
  kind: "live" | "frame" | "image" | "none"
  node: React.ReactNode
  /** Where "Open live demo" should go. */
  openHref?: string
}

/**
 * The most "real" render we can give an entry inside a compare tile:
 *   @design-infra demo / template / theme  → rendered here under the chosen design system (live)
 *   upstream with a frameable live URL → sandboxed iframe (live)
 *   otherwise → thumbnail + "Open live demo ↗" (+ "Load it here" when the docs host allows framing)
 */
export function entryStage(
  e: CatalogEntry,
  { systems, system, mode }: { systems: DesignSystemMeta[]; system: DesignSystemMeta; mode: "light" | "dark" }
): Stage {
  const resolvedMode = system.modes.includes(mode) ? mode : system.modes[0]
  if (e.source === "oc") {
    const preview = (name: string) => `/preview/oc/${name}?theme=${system.slug}&mode=${resolvedMode}`
    const demo = OC_DEMOS[e.name]
    if (demo)
      return {
        kind: "live",
        openHref: preview(e.name),
        node: (
          // the stage background fills the tile; the demo is scaled from a desktop-ish width
          <ThemeStage key={`${system.slug}-${resolvedMode}`} theme={system.slug} modes={[resolvedMode]} className="rounded-none border-0">
            <div className="flex min-h-60 items-center">
              <ScaleToFit minWidth={e.kind === "block" ? 1024 : 720} maxHeight={1100}>
                {demo()}
              </ScaleToFit>
            </div>
          </ThemeStage>
        ),
      }
    if (TEMPLATE_DEMOS[e.name])
      return {
        kind: "live",
        openHref: `/templates/${e.name}?system=${system.slug}&mode=${resolvedMode}`,
        node: (
          <ScaleToFit minWidth={1280} maxHeight={800}>
            <TemplatePreview name={e.name} theme={system.slug} mode={resolvedMode} className="rounded-none border-0" />
          </ScaleToFit>
        ),
      }
    if (e.kind === "theme") {
      // a design system renders under itself, whatever the page theme is
      const slug = e.name.replace(/^theme-/, "")
      const own = systems.find((s) => s.slug === slug)
      return {
        kind: "live",
        openHref: `/design-systems/${slug}`,
        node: (
          <ScaleToFit minWidth={1024} maxHeight={900}>
            <ThemeStage theme={slug} modes={own?.modes} className="rounded-none border-0">
              {OC_DEMOS["theme-preview"]()}
            </ThemeStage>
          </ScaleToFit>
        ),
      }
    }
  }
  if (e.kind === "inspiration")
    return {
      kind: "image",
      openHref: e.docs,
      node: (
        <Link href={`/inspiration/${e.name}`} className="block aspect-[16/10] overflow-hidden bg-muted/40">
          {e.preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewSrc(e.preview)} alt={`${e.title} screenshot`} className="size-full object-cover object-top" />
          ) : null}
        </Link>
      ),
    }

  // A preview video shows how it MOVES — better than any screenshot or a full docs page in an iframe.
  if (e.video)
    return {
      kind: "image",
      openHref: liveUrl(e) ?? e.docs,
      node: (
        <video
          src={e.video}
          poster={e.preview ? previewSrc(e.preview) : undefined}
          autoPlay
          muted
          loop
          playsInline
          className="block aspect-[16/10] w-full bg-muted/40 object-cover"
        />
      ),
    }

  const live = liveUrl(e)
  if (isFrameable(live))
    return { kind: "frame", openHref: live, node: <LiveFrame src={live} title={e.title} width={760} height={520} /> }
  const openHref = live ?? e.docs
  if (!e.preview && !isFrameable(e.docs))
    return {
      kind: "none",
      openHref,
      node: (
        <div className="flex aspect-[16/10] flex-col items-center justify-center gap-2 bg-muted/40 text-xs text-muted-foreground">
          No preview yet
          {openHref ? (
            <a href={openHref} target="_blank" rel="noreferrer" className="rounded-lg bg-foreground px-3 py-1.5 font-medium text-background">
              Open live demo ↗
            </a>
          ) : null}
        </div>
      ),
    }
  return {
    kind: "image",
    openHref,
    node: (
      <ThumbnailOrFrame
        preview={e.preview}
        title={e.title}
        openHref={openHref}
        frameSrc={isFrameable(e.docs) ? e.docs : undefined}
      />
    ),
  }
}
