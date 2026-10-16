"use client"

import { usePreviewPlayback } from "@/components/site/preview-playback"
import { KineticField } from "@/registry/oc/blocks/kinetic-field/kinetic-field"
import { BeamCard } from "@/registry/oc/blocks/beam-card/beam-card"
import { AgentStatus } from "@/registry/oc/blocks/agent-status/agent-status"

export function KineticDemo() {
  const playing = usePreviewPlayback()
  return <div className="mx-auto max-w-xl px-6 py-8"><KineticField active={playing} /></div>
}
export function BeamDemo() {
  const playing = usePreviewPlayback()
  return <div className="grid gap-6 p-8 md:grid-cols-2">
    <BeamCard>
      <AgentStatus activity="writing" detail="Generating pricing section" paused={!playing} />
      <p className="mt-3 text-sm text-muted-foreground">The one live thing on screen gets the beam.</p>
    </BeamCard>
    <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">Everything else stays calm.</div>
  </div>
}
