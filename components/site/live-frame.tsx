"use client"

import { ExternalLink, MonitorPlay } from "lucide-react"
import * as React from "react"

import { ScaleToFit } from "@/components/site/scale-to-fit"
import { previewSrc } from "@/lib/thumbnails"

/** Sandboxed, scaled iframe of an upstream live demo (host must be in FRAMEABLE_HOSTS). */
export function LiveFrame({
  src,
  title,
  width = 1024,
  height = 640,
}: {
  src: string
  title: string
  /** virtual viewport width the page is laid out at before scaling to fit */
  width?: number
  height?: number
}) {
  return (
    <ScaleToFit minWidth={width}>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        referrerPolicy="no-referrer"
        className="block w-full border-0 bg-white"
        style={{ height }}
      />
    </ScaleToFit>
  )
}

/**
 * Thumbnail first; if the docs page can be framed, a button swaps in the live page in place
 * (docs pages are heavier and carry site chrome, so they're opt-in).
 */
export function ThumbnailOrFrame({
  preview,
  frameSrc,
  openHref,
  title,
}: {
  preview?: string
  frameSrc?: string
  openHref?: string
  title: string
}) {
  const [live, setLive] = React.useState(false)
  if (live && frameSrc) return <LiveFrame src={frameSrc} title={title} />
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/40">
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={previewSrc(preview)} alt={`${title} preview`} className="size-full object-cover object-top" />
      ) : (
        <div className="flex size-full items-center justify-center text-xs text-muted-foreground">no preview image</div>
      )}
      <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-2">
        {openHref ? (
          <a
            href={openHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow hover:opacity-90"
          >
            Open live demo <ExternalLink className="size-3.5" />
          </a>
        ) : null}
        {frameSrc ? (
          <button
            type="button"
            onClick={() => setLive(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border bg-background/90 px-3 py-1.5 text-xs font-medium backdrop-blur hover:bg-background"
          >
            <MonitorPlay className="size-3.5" /> Load it here
          </button>
        ) : null}
      </div>
    </div>
  )
}
