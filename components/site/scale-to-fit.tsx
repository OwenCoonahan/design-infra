"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Renders children at a desktop-ish virtual width and scales them down to fit the container, so a
 * hero or a live-preview iframe in a narrow compare tile looks like a shrunken desktop, not a
 * squashed mobile layout. Interactive (hover/click still work through the transform).
 * `maxHeight` (virtual px) clips very tall content, e.g. whole templates.
 */
export function ScaleToFit({
  minWidth,
  maxHeight,
  className,
  children,
}: {
  minWidth: number
  maxHeight?: number
  className?: string
  children: React.ReactNode
}) {
  const outer = React.useRef<HTMLDivElement>(null)
  const inner = React.useRef<HTMLDivElement>(null)
  const [size, setSize] = React.useState({ w: 0, h: 0 })

  React.useEffect(() => {
    const o = outer.current
    const i = inner.current
    if (!o || !i) return
    const ro = new ResizeObserver(() => setSize({ w: o.clientWidth, h: i.offsetHeight }))
    ro.observe(o)
    ro.observe(i)
    return () => ro.disconnect()
  }, [])

  const width = Math.max(size.w, minWidth)
  const scale = size.w ? size.w / width : 1
  const height = Math.min(size.h, maxHeight ?? Infinity) * scale

  return (
    <div
      ref={outer}
      className={cn("relative w-full overflow-hidden", !size.w && "opacity-0", className)}
      style={{ height: size.w ? height : undefined }}
    >
      <div
        ref={inner}
        className="absolute top-0 left-0 origin-top-left"
        style={{ width, transform: scale === 1 ? undefined : `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  )
}
