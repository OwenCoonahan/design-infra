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
    signal("ready")
  }, [])
  return children
}
export function PreviewShell({ children }: { children: React.ReactNode }) {
  return (
    <DemoBoundary>
      <Ready>{children}</Ready>
    </DemoBoundary>
  )
}
