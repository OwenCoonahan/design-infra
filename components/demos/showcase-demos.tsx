"use client"

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react"
import DitherChart, { type DitherChartVariant } from "./vendor/smoothui/dither-chart"
import ProgressiveBlur, { type ProgressiveBlurDirection } from "./vendor/smoothui/progressive-blur"
import DotMorphButton from "./vendor/smoothui/dot-morph-button"
import { PixelCanvasDemo, ScrubberDemo, SwipeDeckDemo } from "./creative-demos"
import { usePreviewPlayback } from "@/components/site/preview-playback"

const palette = ["#ffa674", "#b5a4e3", "#d3e8ad"]
const data = [
  { name: "This week", points: [24, 38, 31, 58, 46, 72, 64, 88].map((value, i) => ({ value, label: `Day ${i + 1}` })) },
  { name: "Last week", points: [12, 24, 18, 36, 30, 44, 40, 55].map((value, i) => ({ value, label: `Day ${i + 1}` })) },
]
const control = "min-h-11 rounded-md border px-3 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

export function ShowcaseDemo({ id, compact = false }: { id: string; compact?: boolean }) {
  const playing = usePreviewPlayback()
  const root = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(280)
  const [variant, setVariant] = useState<DitherChartVariant>("line")
  const [direction, setDirection] = useState<ProgressiveBlurDirection>("bottom")
  const [intensity, setIntensity] = useState(1)
  const [clicked, setClicked] = useState(false)
  useLayoutEffect(() => {
    const element = root.current!
    const style = getComputedStyle(element)
    // Initialize from this frame's content box before it can be painted.
    setWidth(Math.max(80, element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)))
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(80, entry.contentRect.width)))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={root} data-showcase-demo={id} className={`flex min-h-screen w-full flex-col items-center justify-center ${compact ? "gap-2 px-3 py-2" : "gap-4 px-4 py-4"}`} style={{ containerType: "inline-size", "--color-brand": "#ffa674", "--color-brand-secondary": "#e88c57", "--color-on-brand": "#16120f" } as CSSProperties}>
      {id === "smoothui/pixel-brush-canvas" ? <PixelCanvasDemo width={width} compact={compact} /> : id === "smoothui/scrubber" ? <ScrubberDemo compact={compact} /> : id === "smoothui/card-swipe-deck" ? <SwipeDeckDemo width={width} /> : id === "smoothui/dither-chart" ? <>
        <DitherChart animate={playing} data={data} variant={variant} palette={palette} pixelSize={2} width={Math.floor(width)} height={Math.round(Math.min(compact ? 174 : 220, width * 0.31))} label="Interface activity" caption="Illustrative data · try a chart style" />
        <div role="group" aria-label="Chart style" className="flex flex-wrap justify-center gap-2">
          {(["line", "donut", "bar"] as const).map((style) => <button key={style} type="button" aria-pressed={variant === style} className={`${control} capitalize aria-pressed:bg-foreground aria-pressed:text-background`} onClick={() => setVariant(style)}>{style}</button>)}
        </div>
      </> : id === "smoothui/dot-morph-button" ? <>
        <DotMorphButton label={clicked ? "Nice!" : "Try me"} className="min-h-11 w-fit !gap-2 !px-3 !text-foreground [&>span:last-child]:!text-sm" onClick={() => setClicked(!clicked)} />
        {!compact ? <p role="status" className="text-xs text-muted-foreground">{clicked ? "A real click, a little feedback. Click again to reset." : "Hover to stretch the dot. Click to try the button."}</p> : null}
      </> : id === "smoothui/progressive-blur" ? <>
        <div className="relative isolate w-full overflow-hidden rounded-xl border bg-[#171717]">
          <div tabIndex={0} aria-label="Scrollable activity example" style={{ height: "clamp(136px, 50cqw, 256px)" }} className="overflow-y-auto p-5 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-ring">
            <p className="mb-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">A little room to focus</p>
            {["Explore an idea", "Find the right component", "Try a different direction", "Make it feel like you", "Build with real pieces", "Keep refining", "Ready for your project"].map((label, i) => <div key={label} className="mb-4 flex items-center gap-4 border-b border-white/10 pb-4"><span className="flex size-9 shrink-0 items-center justify-center rounded-full text-sm" style={{ background: `${palette[i % 3]}20`, color: palette[i % 3] }}>0{i + 1}</span><div><p className="text-sm font-medium">{label}</p><p className="mt-1 text-xs text-muted-foreground">An example activity in your workspace.</p></div></div>)}
          </div>
          <ProgressiveBlur direction={direction} intensity={intensity} blur={16} layers={6} fadeIn={false} className={direction === "bottom" ? "!top-auto h-28" : ""} />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <label className="flex items-center gap-2 text-xs">Direction<select aria-label="Blur direction" value={direction} onChange={(event) => setDirection(event.target.value as ProgressiveBlurDirection)} className={`${control} bg-background`}><option value="bottom">Bottom</option><option value="top">Top</option><option value="radial">Radial</option></select></label>
          <label className="flex min-h-11 items-center gap-2 text-xs">Blur<input type="range" aria-label="Blur intensity" min={0} max={1} step={0.1} value={intensity} onChange={(event) => setIntensity(Number(event.target.value))} className="h-11 w-24 accent-[#ffa674]" /></label>
        </div>
      </> : null}
    </div>
  )
}
