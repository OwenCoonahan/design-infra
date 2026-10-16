"use client"

import { Volume2, VolumeX } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { createAmbientGraph } from "@/lib/ambient-audio"

type Engine = { context: AudioContext; graph: ReturnType<typeof createAmbientGraph> }
type Status = "off" | "starting" | "playing" | "paused" | "error" | "unavailable"

export function AmbientSound() {
  const root = useRef<HTMLDivElement>(null)
  const engine = useRef<Engine | null>(null)
  const wanted = useRef(false)
  const level = useRef(0.18)
  const visible = useRef(false)
  const mounted = useRef(false)
  const epoch = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [enabled, setEnabled] = useState(false)
  const [volume, setVolume] = useState(18)
  const [status, setStatus] = useState<Status>("off")

  const reconcile = useCallback(async () => {
    const current = engine.current
    if (!current || !mounted.current) return
    const revision = ++epoch.current
    clearTimeout(timer.current)
    const audible = () => wanted.current && level.current > 0 && visible.current && !document.hidden
    if (!audible()) {
      current.graph.setVolume(0, 0.045)
      setStatus(wanted.current ? "paused" : "off")
      timer.current = setTimeout(() => {
        if (epoch.current === revision && !audible() && current.context.state !== "closed") void current.context.suspend().catch(() => {})
      }, 280)
      return
    }
    try {
      await current.context.resume()
      if (!mounted.current || epoch.current !== revision || !audible()) return
      if (current.context.state !== "running") { setStatus("paused"); return }
      current.graph.setVolume(level.current)
      setStatus("playing")
    } catch {
      if (!mounted.current || epoch.current !== revision) return
      current.graph.setVolume(0, 0.045)
      wanted.current = false
      setEnabled(false)
      setStatus("error")
      void current.context.suspend().catch(() => {})
    }
  }, [])

  useEffect(() => {
    mounted.current = true
    epoch.current++
    const playground = root.current!.closest("[data-hero-playground]")!
    const observer = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; void reconcile() })
    observer.observe(playground)
    const sync = () => { void reconcile() }
    const move = (event: Event) => {
      if (!wanted.current || engine.current?.context.state !== "running") return
      const bounds = playground.getBoundingClientRect()
      const pointer = event as PointerEvent
      engine.current.graph.position((pointer.clientX - bounds.left) / bounds.width, (pointer.clientY - bounds.top) / bounds.height)
    }
    const leave = () => engine.current?.graph.position(0.5, 0.5)
    playground.addEventListener("pointermove", move, { passive: true })
    playground.addEventListener("pointerleave", leave)
    document.addEventListener("visibilitychange", sync)
    return () => {
      mounted.current = false
      wanted.current = false
      clearTimeout(timer.current)
      observer.disconnect()
      playground.removeEventListener("pointermove", move)
      playground.removeEventListener("pointerleave", leave)
      document.removeEventListener("visibilitychange", sync)
      const current = engine.current
      engine.current = null
      if (current) current.context.onstatechange = null
      current?.graph.dispose()
      if (current && current.context.state !== "closed") void current.context.close().catch(() => {})
    }
  }, [reconcile])

  const toggle = () => {
    if (wanted.current && !(status === "paused" && level.current > 0 && visible.current && !document.hidden)) {
      wanted.current = false
      setEnabled(false)
      void reconcile()
      return
    }
    if (typeof window.AudioContext !== "function") { setStatus("unavailable"); return }
    if (!engine.current) {
      let context: AudioContext | undefined
      try {
        context = new AudioContext()
        engine.current = { context, graph: createAmbientGraph(context) }
        const active = context
        context.onstatechange = () => {
          if (mounted.current && wanted.current && engine.current?.context === active && active.state !== "running") setStatus("paused")
        }
      } catch {
        if (context) void context.close().catch(() => {})
        setStatus("error")
        return
      }
    }
    wanted.current = true
    setEnabled(true)
    setStatus("starting")
    void reconcile()
  }
  const paused = enabled && status === "paused" && volume > 0
  return (
    <div ref={root} data-ambient-sound data-sound-state={status} className="flex items-center gap-3 text-xs text-muted-foreground">
      <button type="button" onClick={toggle} disabled={status === "unavailable"} aria-pressed={enabled} aria-label={paused ? "Resume ambient sound" : enabled ? "Mute ambient sound" : "Enable ambient sound"} className="inline-flex min-h-11 items-center gap-2 rounded-md px-2 font-mono transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-default disabled:opacity-50">
        {enabled ? <Volume2 className="size-3.5" aria-hidden="true" /> : <VolumeX className="size-3.5" aria-hidden="true" />}
        {status === "unavailable" ? "Sound unavailable" : paused ? "Resume sound" : enabled ? "Sound on" : "Sound off"}
      </button>
      <input type="range" aria-label="Ambient volume" aria-valuetext={`${volume}%`} min={0} max={100} value={volume} disabled={!enabled} className="h-11 w-20 accent-[var(--site-motion-accent)] disabled:opacity-30" onChange={(event) => {
        const next = Number(event.currentTarget.value)
        level.current = next / 100
        setVolume(next)
        void reconcile()
      }} />
      <span role="status" className="sr-only">{status === "error" ? "Sound could not start. Try enabling it again." : status === "unavailable" ? "Ambient sound is not available in this browser." : ""}</span>
    </div>
  )
}
