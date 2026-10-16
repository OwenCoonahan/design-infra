"use client"

import * as React from "react"
import { activePreviews, type PlaybackCandidate } from "@/lib/catalog/playback"
import { PREVIEW_LABELS, type PreviewDescriptor } from "@/lib/catalog/previews"

type Player = {
  active: Set<string>
  candidates: PlaybackCandidate[]
  enabled: boolean
  preferencesReady: boolean
  reduced: boolean
  visible: (id: string, order: number, visible: boolean) => void
  intent: (id: string, intent: PlaybackCandidate["intent"]) => void
  toggle: () => void
}
const PlaybackContext = React.createContext<Player | null>(null)
export function useGalleryMotion() {
  return React.useContext(PlaybackContext)?.enabled ?? false
}
export function GalleryPlayback({ children }: { children: React.ReactNode }) {
  const [candidates, setCandidates] = React.useState<PlaybackCandidate[]>([])
  const [enabled, setEnabled] = React.useState(true)
  // Wait for the browser preferences before starting any motion.
  const [preferences, setPreferences] = React.useState({ ready: false, reduced: true, hidden: true })
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setPreferences({ ready: true, reduced: mq.matches, hidden: document.hidden })
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
    <PlaybackContext.Provider value={{ active, candidates, enabled, preferencesReady: preferences.ready, reduced: preferences.reduced, visible, intent, toggle }}>
      <noscript><style>{'[data-poster-mode="paused"] > img { visibility: visible !important; }'}</style></noscript>
      {children}
    </PlaybackContext.Provider>
  )
}
export function PlaybackControls() {
  const player = React.useContext(PlaybackContext)!
  return (
    <button type="button" className="min-h-11 rounded-lg border px-3 py-1.5 text-xs" onClick={player.toggle}>
      {player.enabled ? "Pause all" : "Resume all"}
    </button>
  )
}

/** Readiness belongs to a mounted frame, so returning previews cannot expose an empty document. */
function InteractivePreview({ src, title, width, height, scale, interact, onFailure }: {
  src: string
  title: string
  width: number
  height: number
  scale?: number
  interact: boolean
  onFailure: () => void
}) {
  const frame = React.useRef<HTMLIFrameElement>(null)
  const [ready, setReady] = React.useState(false)
  React.useEffect(() => {
    let receivedReady = false
    const message = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow || event.data?.type !== "design-infra-preview") return
      if (event.data.status === "ready") { receivedReady = true; setReady(true) }
      if (event.data.status === "error") onFailure()
    }
    window.addEventListener("message", message)
    // onLoad alone cannot distinguish a valid demo from an HTTP error page.
    const timeout = window.setTimeout(() => { if (!receivedReady) onFailure() }, 20000)
    return () => { window.removeEventListener("message", message); clearTimeout(timeout) }
  }, [src, onFailure])
  return <iframe ref={frame} src={src} title={`${title} interactive demo`} data-ready={ready ? "1" : undefined} tabIndex={interact && ready ? 0 : -1} sandbox="allow-scripts allow-same-origin" className="absolute top-0 left-0 border-0 bg-[#141414] transition-opacity duration-200 ease-out motion-reduce:transition-none" style={{ width, height, transform: scale === undefined ? undefined : `scale(${scale})`, transformOrigin: "top left", pointerEvents: interact && ready ? "auto" : "none", opacity: ready ? 1 : 0 }} />
}

/** Frames exist only while playing. Removing them also stops rAF, timers, WebGL and audio. */
export function GalleryPreview({
  id,
  title,
  descriptor,
  poster,
  order,
  presentation = "gallery",
  interaction = presentation === "scene" ? "direct" : "opt-in",
  responsive = false,
  minHeight = 0,
  posterMode = "always",
}: {
  id: string
  title: string
  descriptor: PreviewDescriptor
  poster?: string
  order: number
  /** Scene cards are immediately usable; catalog cards retain opt-in interaction. */
  presentation?: "gallery" | "scene"
  /** Homepage examples accept input immediately; browsing galleries keep their activation control. */
  interaction?: "direct" | "opt-in"
  responsive?: boolean
  minHeight?: number
  /** Responsive homepage demos reveal from their neutral surface, without a mismatched screenshot swap. */
  posterMode?: "always" | "paused"
}) {
  const player = React.useContext(PlaybackContext)!
  const { visible, intent } = player
  const box = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(0)
  const [interact, setInteract] = React.useState(interaction === "direct")
  const [failed, setFailed] = React.useState(false)
  const moving = descriptor.kind !== "static"
  const playing = moving && !failed && player.active.has(id)
  const playbackIntent = player.candidates.find((candidate) => candidate.id === id)?.intent
  // A scaled raster cannot match a responsive native layout. Keep it for deliberate
  // pauses and fallbacks, never for automatic entry, re-entry or budget changes.
  // Default hidden during SSR/hydration too; noscript restores the static composition.
  const showPoster = posterMode === "always" || !moving || failed || (!playing && player.preferencesReady && (
    playbackIntent === "pause" || (playbackIntent !== "play" && (!player.enabled || player.reduced))
  ))
  React.useEffect(() => {
    const element = box.current
    if (!element || !moving) return
    const observer = new IntersectionObserver(
      // Start at the edge and keep the live surface until it leaves completely.
      // Swapping back to a poster at 20% visibility causes a pop during normal scrolling.
      ([entry]) => visible(id, order, entry.isIntersecting),
      { threshold: 0 },
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
  const previewFailed = React.useCallback(() => { setFailed(true); intent(id, "pause") }, [id, intent])
  const playPause = () => {
    setInteract(interaction === "direct")
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
        data-poster-mode={posterMode}
        className="relative w-full min-w-0 overflow-hidden border-b bg-[#141414]"
        style={{ aspectRatio: descriptor.kind === "interactive" ? descriptor.width / descriptor.height : 16 / 10, minHeight: minHeight || undefined }}
      >
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt={`${title} preview`}
            loading="lazy"
            className="absolute inset-0 size-full object-contain"
            style={{ visibility: showPoster ? "visible" : "hidden" }}
          />
        ) : (
          <div className="flex size-full items-center justify-center text-xs text-muted-foreground">{label}</div>
        )}
        {playing && descriptor.kind === "interactive" && width > 0 ? (
          <InteractivePreview key={descriptor.src} src={descriptor.src} title={title} width={responsive ? width : descriptor.width} height={responsive ? Math.max(minHeight, width * descriptor.height / descriptor.width) : descriptor.height} scale={responsive ? undefined : width / descriptor.width} interact={interact} onFailure={previewFailed} />
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
      <div className={`flex min-h-11 flex-wrap items-center justify-end gap-2 px-3 py-1 text-[11px] text-muted-foreground ${presentation === "gallery" ? "border-b" : ""}`}>
        <span className={presentation === "scene" && !failed ? "sr-only" : "mr-auto"}>{failed ? presentation === "scene" ? "Preview unavailable" : "Preview unavailable · source link below" : presentation === "scene" ? "Try it live" : label}</span>
        {moving && !failed ? (
          <>
            {presentation === "gallery" ? <span aria-live="polite">{playing ? "Playing" : "Paused"}</span> : null}
            <button
              type="button"
              onClick={playPause}
              aria-label={`${playing ? "Pause" : "Play"} ${title}`}
              className="min-h-11 min-w-11 rounded border px-2 py-1 text-foreground"
            >
              {playing ? "Pause" : "Play"}
            </button>
            {playing && interaction === "opt-in" ? (
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
