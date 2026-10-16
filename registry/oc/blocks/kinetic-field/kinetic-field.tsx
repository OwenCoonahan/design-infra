"use client"

import { useSpring } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { motionPreset } from "@/lib/motion-presets"
import { cn } from "@/lib/utils"

// Original composition, inspired by the idea of a cursor-influenced hero on motion.dev.
// Uses the free Motion library. No Motion website assets, shaders or Motion+ source.
const WIDTH = 600
const HEIGHT = 260
type Layout = "wide" | "square"
const SHAPES = ["Orbit", "Wave", "Sphere"] as const
const SPRING = motionPreset("lively").tokens.spring

type Mark = { x: number; y: number; size: number; opacity: number; accent: boolean }

function marks(time: number, shape: number, tiltX = 0, tiltY = 0, pointer?: { x: number; y: number }, layout: Layout = "wide"): Mark[] {
  const output: Mark[] = []
  const angleY = 0.5 + tiltX * 0.65
  const angleX = 0.7 + tiltY * 0.5
  for (let row = 0; row < 16; row++) {
    for (let column = 0; column < 48; column++) {
      const u = column / 48 * Math.PI * 2
      const v = row / 16 * Math.PI * 2
      const phase = time * 0.3
      const radius = 1.6 + 0.42 * Math.cos(v + phase)
      const orbit = [radius * Math.cos(u), radius * Math.sin(u), 0.42 * Math.sin(v + phase) + 0.22 * Math.sin(u * 3 + phase)]
      const wave = [(column / 47 - 0.5) * 4.6, (row / 15 - 0.5) * 1.7, Math.sin(u * 1.5 + phase) * 0.7 + Math.cos(v + phase) * 0.18]
      const latitude = row / 15 * Math.PI
      const sphere = [1.65 * Math.sin(latitude) * Math.cos(u + phase), 1.65 * Math.cos(latitude), 1.65 * Math.sin(latitude) * Math.sin(u + phase)]
      const forms = [orbit, wave, sphere]
      const low = Math.max(0, Math.min(2, Math.floor(shape)))
      const high = Math.min(2, low + 1)
      const mix = Math.max(0, Math.min(1, shape - low))
      const [x, y, z] = forms[low].map((value, i) => value + (forms[high][i] - value) * mix)
      const rx = x * Math.cos(angleY) + z * Math.sin(angleY)
      const rz = z * Math.cos(angleY) - x * Math.sin(angleY)
      const ry = y * Math.cos(angleX) - rz * Math.sin(angleX)
      const depth = y * Math.sin(angleX) + rz * Math.cos(angleX)
      const perspective = 4.8 / (4.8 - depth)
      let screenX = WIDTH / 2 + rx * (layout === "square" ? 110 : 74) * perspective
      let screenY = (layout === "square" ? WIDTH : HEIGHT) / 2 + ry * (layout === "square" ? 110 : 55) * perspective
      if (pointer) {
        const dx = screenX - pointer.x
        const dy = screenY - pointer.y
        const distance = Math.hypot(dx, dy)
        const force = Math.max(0, 1 - distance / 110) ** 2 * 26
        screenX += dx / Math.max(1, distance) * force
        screenY += dy / Math.max(1, distance) * force
      }
      output.push({ x: screenX, y: screenY, size: Math.max(1.1, 2.6 * perspective), opacity: Math.max(0.15, Math.min(1, 0.52 + depth * 0.23)), accent: (row + column) % 4 !== 0 })
    }
  }
  return output
}

// Quantize SSR attributes: Node and browser trigonometry can differ by a few ulps.
const poster = (layout: Layout) => marks(0, 0, 0, 0, undefined, layout).map((mark) => ({ ...mark, x: mark.x.toFixed(3), y: mark.y.toFixed(3), size: mark.size.toFixed(3), height: (mark.size * 0.65).toFixed(3), opacity: mark.opacity.toFixed(3) }))
const POSTERS = { wide: poster("wide"), square: poster("square") }

export type KineticFieldProps = { className?: string; accent?: string; layout?: Layout; active?: boolean }

/** Bounded Canvas 2D illustration with an SSR SVG poster and free Motion springs. */
export function KineticField({ className, accent = "var(--primary)", layout = "wide", active = true }: KineticFieldProps) {
  const height = layout === "square" ? WIDTH : HEIGHT
  const root = useRef<HTMLDivElement>(null)
  const surface = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const ink = useRef<SVGRectElement>(null)
  const clock = useRef(0)
  const pointer = useRef<{ x: number; y: number } | undefined>(undefined)
  const [shape, setShape] = useState(0)
  const [canvasAvailable, setCanvasAvailable] = useState(true)
  const [preference, setPreference] = useState<boolean | null>(null)
  const [activity, setActivity] = useState({ ready: false, visible: true, tab: true, reduced: false, fine: false })
  const tiltX = useSpring(0, SPRING)
  const tiltY = useSpring(0, SPRING)
  const form = useSpring(0, SPRING)
  const enabled = active && (preference ?? (!activity.reduced && activity.fine))
  const playing = canvasAvailable && activity.ready && activity.visible && activity.tab && enabled
  const state = !activity.ready ? "static" : !canvasAvailable ? "fallback" : !activity.tab ? "hidden" : !activity.visible ? "offscreen" : playing ? "playing" : "paused"

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)")
    const fine = matchMedia("(hover: hover) and (pointer: fine)")
    const sync = () => setActivity((current) => ({ ...current, ready: true, reduced: reduced.matches, fine: fine.matches, tab: !document.hidden }))
    const motionChanged = () => { setPreference(null); sync() }
    sync()
    reduced.addEventListener("change", motionChanged)
    fine.addEventListener("change", sync)
    document.addEventListener("visibilitychange", sync)
    const observer = new IntersectionObserver(([entry]) => setActivity((current) => ({ ...current, visible: entry.isIntersecting })))
    observer.observe(root.current!)
    return () => {
      observer.disconnect()
      reduced.removeEventListener("change", motionChanged)
      fine.removeEventListener("change", sync)
      document.removeEventListener("visibilitychange", sync)
    }
  }, [])

  useEffect(() => {
    if (playing) form.set(shape)
    else form.jump(shape)
  }, [shape, playing, form])

  useEffect(() => {
    if (!playing || !activity.fine) return
    const element = surface.current!
    const move = (event: PointerEvent) => {
      const bounds = element.getBoundingClientRect()
      pointer.current = { x: (event.clientX - bounds.left) / bounds.width * WIDTH, y: (event.clientY - bounds.top) / bounds.height * height }
      tiltX.set((pointer.current.x / WIDTH - 0.5) * 2)
      tiltY.set((pointer.current.y / height - 0.5) * 2)
    }
    const leave = () => { pointer.current = undefined; tiltX.set(0); tiltY.set(0) }
    element.addEventListener("pointermove", move, { passive: true })
    element.addEventListener("pointerleave", leave)
    return () => {
      element.removeEventListener("pointermove", move)
      element.removeEventListener("pointerleave", leave)
      pointer.current = undefined
      tiltX.jump(0)
      tiltY.jump(0)
    }
  }, [playing, activity.fine, tiltX, tiltY, height])

  useEffect(() => {
    const element = canvas.current
    const field = surface.current
    const accentInk = ink.current
    if (!element || !field || !accentInk) return
    const context = element.getContext("2d")
    if (!context) { setCanvasAvailable(false); return } // Keep the SVG and hide unavailable controls.
    let frame = 0
    let last: number | undefined
    let foreground = ""
    let highlight = ""
    let active = true
    const draw = () => {
      if (!active || !element.isConnected) return
      context.clearRect(0, 0, WIDTH, height)
      for (const mark of marks(clock.current, form.get(), tiltX.get(), tiltY.get(), playing ? pointer.current : undefined, layout)) {
        context.globalAlpha = mark.opacity
        context.fillStyle = mark.accent ? highlight : foreground
        context.fillRect(mark.x, mark.y, mark.size, mark.size * 0.65)
      }
      context.globalAlpha = 1
      field.dataset.painted = "true"
      element.style.opacity = "1"
    }
    const resize = () => {
      if (!active || !element.isConnected) return
      const bounds = element.getBoundingClientRect()
      const ratio = Math.min(devicePixelRatio || 1, 2)
      element.width = Math.max(1, Math.round(bounds.width * ratio))
      element.height = Math.max(1, Math.round(bounds.height * ratio))
      context.setTransform(element.width / WIDTH, 0, 0, element.height / height, 0, 0)
      foreground = getComputedStyle(element).color
      highlight = getComputedStyle(accentInk).fill
      draw()
    }
    const tick = (now: number) => {
      if (!active || !element.isConnected) return
      // Preserve phase across pauses and cap elapsed time after a suspended frame.
      if (last !== undefined) clock.current += Math.min((now - last) / 1000, 0.05)
      last = now
      draw()
      frame = requestAnimationFrame(tick)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(field)
    if (playing) frame = requestAnimationFrame(tick)
    return () => { active = false; cancelAnimationFrame(frame); observer.disconnect() }
  }, [playing, shape, form, tiltX, tiltY, height, layout])

  return (
    <div ref={root} className={cn("w-full text-foreground", className)} data-kinetic-field data-motion-state={state} data-layout={layout}>
      <div ref={surface} className={cn("relative w-full overflow-hidden [&[data-painted=true]>svg]:invisible", layout === "square" ? "aspect-square" : "aspect-[30/13]")} aria-hidden="true">
        <svg viewBox={`0 0 ${WIDTH} ${height}`} className="absolute inset-0 size-full" fill="currentColor">
          <rect ref={ink} fill={accent} width="0" height="0" />
          {POSTERS[layout].map((mark, index) => <rect key={index} x={mark.x} y={mark.y} width={mark.size} height={mark.height} opacity={mark.opacity} fill={mark.accent ? accent : "currentColor"} />)}
        </svg>
        <canvas ref={canvas} className="absolute inset-0 size-full opacity-0" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 text-xs" style={{ visibility: activity.ready && canvasAvailable ? "visible" : "hidden" }}>
        <div role="group" aria-label="Motion field shape" className="flex gap-1">
          {SHAPES.map((name, index) => (
            <button key={name} type="button" aria-pressed={shape === index} onClick={() => setShape(index)} className="min-h-11 rounded-md px-3 font-mono text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-pressed:text-foreground">{name}</button>
          ))}
        </div>
        <button type="button" aria-label={enabled ? "Pause motion" : "Play motion"} aria-pressed={enabled} onClick={() => setPreference(!enabled)} className="inline-flex min-h-11 items-center gap-2 rounded-md px-2 font-mono text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">{enabled ? <path d="M2 1h2v8H2zM6 1h2v8H6z" /> : <path d="M2 1l7 4-7 4z" />}</svg>
          {enabled ? "Pause" : "Play"}
        </button>
      </div>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{playing && activity.fine ? "Move your cursor. Change the shape." : "A small playground for good motion."}</p>
    </div>
  )
}
