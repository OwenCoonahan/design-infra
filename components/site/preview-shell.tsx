"use client"
import * as React from "react"

function signal(status: "ready" | "error") {
  if (window.parent !== window)
    window.parent.postMessage({ type: "design-infra-preview", status }, window.location.origin)
}
class DemoBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    signal("error")
  }
  render() {
    return this.state.failed ? (
      <p role="alert" className="p-8 text-sm">
        Demo unavailable. Open the component on its source site.
      </p>
    ) : (
      this.props.children
    )
  }
}
function Ready({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    let cancelled = false
    let firstFrame = 0
    let secondFrame = 0
    // ResizeObserver-driven demos need a layout pass after hydration. Revealing them
    // from this effect exposes their default dimensions before that measurement lands.
    void document.fonts.ready.then(() => {
      if (cancelled) return
      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => { if (!cancelled) signal("ready") })
      })
    })
    // Native hero demos relay pointer position without an overlay intercepting their controls.
    const relay = new URLSearchParams(location.search).get("presentation") === "hero" && parent !== window
    const move = (event: PointerEvent) => parent.postMessage({ type: "design-infra-pointer", x: event.clientX / innerWidth, y: event.clientY / innerHeight }, location.origin)
    if (relay) window.addEventListener("pointermove", move, { passive: true })
    return () => {
      cancelled = true
      cancelAnimationFrame(firstFrame)
      cancelAnimationFrame(secondFrame)
      window.removeEventListener("pointermove", move)
    }
  }, [])
  return children
}
export function PreviewShell({ children, ready = true }: { children: React.ReactNode; ready?: boolean }) {
  return (
    <DemoBoundary>
      {ready ? <Ready>{children}</Ready> : children}
    </DemoBoundary>
  )
}
