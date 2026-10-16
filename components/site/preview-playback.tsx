"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { MotionConfig } from "motion/react"

const PreviewPlaybackContext = createContext(true)
export const usePreviewPlayback = () => useContext(PreviewPlaybackContext)

/** Visible homepage demos stay rendered when their animation budget is reassigned. */
export function PreviewPlayback({ children, initialPlaying }: { children: React.ReactNode; initialPlaying: boolean }) {
  const [playing, setPlaying] = useState(initialPlaying)
  useEffect(() => {
    const message = (event: MessageEvent) => {
      if (parent === window || event.source !== parent || event.origin !== location.origin || event.data?.type !== "design-infra-playback" || typeof event.data.playing !== "boolean") return
      setPlaying(event.data.playing)
    }
    window.addEventListener("message", message)
    return () => window.removeEventListener("message", message)
  }, [])
  return <PreviewPlaybackContext.Provider value={playing}>
    <MotionConfig reducedMotion={playing ? "user" : "always"}>
      <div className="contents" data-preview-playback={playing ? "playing" : "paused"}>
        <style>{'[data-preview-playback="paused"] *, [data-preview-playback="paused"] *::before, [data-preview-playback="paused"] *::after { animation-play-state: paused !important; }'}</style>
        {children}
      </div>
    </MotionConfig>
  </PreviewPlaybackContext.Provider>
}
