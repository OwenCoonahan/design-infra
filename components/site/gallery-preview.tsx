"use client"

import * as React from "react"
import { activePreviews, type PlaybackCandidate } from "@/lib/catalog/playback"
import { PREVIEW_LABELS, type PreviewDescriptor } from "@/lib/catalog/previews"

type Player = {
  active: Set<string>
  candidates: PlaybackCandidate[]
  enabled: boolean
  visible: (id: string, order: number, visible: boolean) => void
  intent: (id: string, intent: PlaybackCandidate["intent"]) => void
  toggle: () => void
}
const PlaybackContext = React.createContext<Player | null>(null)
export function GalleryPlayback({ children }: { children: React.ReactNode }) {
  const [candidates, setCandidates] = React.useState<PlaybackCandidate[]>([])
  const [enabled, setEnabled] = React.useState(true)
  // Wait for the browser preferences before starting any motion.
  const [preferences, setPreferences] = React.useState({ reduced: true, hidden: true })
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setPreferences({ reduced: mq.matches, hidden: document.hidden })
    update()
    mq.addEventListener("change", update)
    document.addEventListener("visibilitychange", update)
    return () => {
      mq.removeEventListener("change", update)
      document.removeEventListener("visibilitychange", update)
    }
  }, [])
  const visible = React.useCallback((id: string, order: number, visible: boolean) => {
    setCandidates((previous) => {
      const existing = previous.find((c) => c.id === id)
      if (existing?.visible === visible && existing.order === order) return previous
      return existing
        ? previous.map((c) => (c.id === id ? { ...c, visible, order } : c))
        : [...previous, { id, order, visible, intent: "auto", requested: 0 }]
    })
  }, [])
  const intent = React.useCallback((id: string, intent: PlaybackCandidate["intent"]) => {
    setCandidates((previous) =>
      previous.map((c) => (c.id === id ? { ...c, intent, requested: intent === "play" ? Date.now() : 0 } : c)),
    )
  }, [])
  const toggle = () => {
    setEnabled(!enabled)
    setCandidates((previous) => previous.map((c) => ({ ...c, intent: "auto", requested: 0 })))
  }
  const active = new Set(activePreviews(candidates, enabled, preferences.reduced, preferences.hidden))
  return (
    <PlaybackContext.Provider value={{ active, candidates, enabled, visible, intent, toggle }}>
      {children}
    </PlaybackContext.Provider>
  )
}
export function PlaybackControls() {
  const player = React.useContext(PlaybackContext)!
  return (
    <button type="button" className="rounded-lg border px-3 py-1.5 text-xs" onClick={player.toggle}>
      {player.enabled ? "Pause all" : "Resume all"}
    </button>
  )
}

/** Frames exist only while playing. Removing them also stops rAF, timers, WebGL and audio. */
export function GalleryPreview({
  id,
  title,
  descriptor,
  poster,
  order,
}: {
  id: string
  title: string
  descriptor: PreviewDescriptor
  poster?: string
  order: number
}) {
  const player = React.useContext(PlaybackContext)!
  const { visible, intent } = player
  const box = React.useRef<HTMLDivElement>(null)
  const frame = React.useRef<HTMLIFrameElement>(null)
  const [width, setWidth] = React.useState(0)
  const [interact, setInteract] = React.useState(false)
  const [failed, setFailed] = React.useState(false)
  const [ready, setReady] = React.useState(false)
  const moving = descriptor.kind !== "static"
  const playing = moving && !failed && player.active.has(id)
  React.useEffect(() => {
    const element = box.current
    if (!element || !moving) return
    const observer = new IntersectionObserver(
      ([entry]) => visible(id, order, entry.isIntersecting && entry.intersectionRatio >= 0.2),
      { threshold: [0, 0.2] },
    )
    observer.observe(element)
    const resize = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    resize.observe(element)
    return () => {
      observer.disconnect()
      resize.disconnect()
      visible(id, order, false)
    }
  }, [id, moving, order, visible])
  React.useEffect(() => {
    if (!playing || descriptor.kind !== "interactive") return
    const message = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== frame.current?.contentWindow ||
        event.data?.type !== "design-infra-preview"
      )
        return
      if (event.data.status === "ready" && frame.current) {
        frame.current.dataset.ready = "1"
        setReady(true)
      }
      if (event.data.status === "error") {
        setFailed(true)
        intent(id, "pause")
      }
    }
    window.addEventListener("message", message)
    const timeout = window.setTimeout(() => {
      // onLoad alone cannot distinguish a valid demo from an HTTP error page.
      if (!frame.current?.dataset.ready) {
        setFailed(true)
        intent(id, "pause")
      }
    }, 20000)
    return () => {
      window.removeEventListener("message", message)
      clearTimeout(timeout)
    }
  }, [playing, descriptor.kind, id, intent])
  const playPause = () => {
    setReady(false)
    setInteract(false)
    intent(id, playing ? "pause" : "play")
  }
  const label = PREVIEW_LABELS[descriptor.kind]
  return (
    <>
      <div
        ref={box}
        data-gallery-preview={id}
        data-preview-kind={descriptor.kind}
        data-playing={playing}
        className="relative overflow-hidden border-b bg-[#141414]"
        style={{ aspectRatio: descriptor.kind === "interactive" ? descriptor.width / descriptor.height : 16 / 10 }}
      >
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt={`${title} preview`}
            loading="lazy"
            className="absolute inset-0 size-full object-contain"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-xs text-muted-foreground">{label}</div>
        )}
        {playing && descriptor.kind === "interactive" && width > 0 ? (
          <iframe
            ref={frame}
            src={descriptor.src}
            title={`${title} interactive demo`}
            tabIndex={interact ? 0 : -1}
            sandbox="allow-scripts allow-same-origin"
            className="absolute top-0 left-0 border-0"
            style={{
              width: descriptor.width,
              height: descriptor.height,
              transform: `scale(${width / descriptor.width})`,
              transformOrigin: "top left",
              pointerEvents: interact ? "auto" : "none",
              opacity: ready ? 1 : 0,
            }}
          />
        ) : null}
        {playing && descriptor.kind === "clip" ? (
          <video
            src={descriptor.src}
            poster={poster}
            muted
            autoPlay
            loop
            playsInline
            controls={interact}
            tabIndex={interact ? 0 : -1}
            className="absolute inset-0 size-full object-contain"
            onError={() => {
              setFailed(true)
              intent(id, "pause")
            }}
          />
        ) : null}
      </div>
      <div className="flex min-h-11 flex-wrap items-center gap-2 border-b px-3 py-2 text-[11px] text-muted-foreground">
        <span className="mr-auto">{failed ? "Preview unavailable · source link below" : label}</span>
        {moving && !failed ? (
          <>
            <span aria-live="polite">{playing ? "Playing" : "Paused"}</span>
            <button
              type="button"
              onClick={playPause}
              aria-label={`${playing ? "Pause" : "Play"} ${title}`}
              className="rounded border px-2 py-1 text-foreground"
            >
              {playing ? "Pause" : "Play"}
            </button>
            {playing ? (
              <button
                type="button"
                onClick={() => setInteract(!interact)}
                aria-pressed={interact}
                className="rounded border px-2 py-1 text-foreground"
              >
                {interact ? "Stop interacting" : "Interact"}
              </button>
            ) : null}
          </>
        ) : null}
      </div>
    </>
  )
}
