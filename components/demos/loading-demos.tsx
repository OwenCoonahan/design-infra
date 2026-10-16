"use client"

import * as React from "react"
import { ThinkingOrb, type OrbState } from "thinking-orbs"
import { AgentStatus } from "@/registry/oc/blocks/agent-status/agent-status"
import AILoader, { type AILoaderVariant } from "./vendor/smoothui/ai-loader"
import Skeleton from "./vendor/smoothui/skeleton-loader"
import GridLoader from "./vendor/smoothui/grid-loader"
import MotionLoader, { MOTION_LOADER_VARIANTS, type MotionLoaderVariant } from "./vendor/smoothui/motion-loader"
import { Spinner } from "./vendor/kibo-ui/spinner"
import { AnimatedCircularProgressBar } from "./vendor/magicui/animated-circular-progress-bar"

const control = "rounded-md border bg-background px-3 py-1.5 text-xs text-foreground"
const orbStates: OrbState[] = [
  "working",
  "searching",
  "solving",
  "listening",
  "connecting",
  "weaving",
  "composing",
  "breathing",
  "shaping",
]
export function LoadingDemo({ id, compact = false }: { id: string; compact?: boolean }) {
  const [orb, setOrb] = React.useState<OrbState>("searching")
  const [ai, setAi] = React.useState<AILoaderVariant>("dots")
  const [motion, setMotion] = React.useState<MotionLoaderVariant>("orbit")
  const [loaded, setLoaded] = React.useState(false)
  const [progress, setProgress] = React.useState(64)
  const [spinner, setSpinner] = React.useState<React.ComponentProps<typeof Spinner>["variant"]>("default")
  let example: React.ReactNode
  let controls: React.ReactNode
  switch (id) {
    case "oc/agent-status":
      example = (
        <div className="flex flex-col gap-6">
          <AgentStatus activity="searching" detail="Finding the right component" size="lg" />
          <AgentStatus activity="writing" detail="Building your interface" />
          <AgentStatus activity="idle" />
        </div>
      )
      break
    case "librariesdev/thinking-orbs":
      example = <ThinkingOrb state={orb} size={64} theme="dark" />
      controls = (
        <select
          aria-label="Orb state"
          className={control}
          value={orb}
          onChange={(e) => setOrb(e.target.value as OrbState)}
        >
          {orbStates.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      )
      break
    case "kibo-ui/spinner":
      example = <Spinner variant={spinner} className="size-12" />
      controls = (
        <select
          aria-label="Spinner variant"
          className={control}
          value={spinner}
          onChange={(e) => setSpinner(e.target.value as typeof spinner)}
        >
          {["default", "throbber", "pinwheel", "circle-filled", "ellipsis", "ring", "bars", "infinite"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      )
      break
    case "smoothui/ai-loader":
      example = <AILoader variant={ai} label="Thinking" showElapsed />
      controls = (
        <select
          aria-label="AI loader variant"
          className={control}
          value={ai}
          onChange={(e) => setAi(e.target.value as AILoaderVariant)}
        >
          {["dots", "bar", "grid"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      )
      break
    case "smoothui/skeleton-loader":
      example = (
        <div className="w-72 space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton loading={!loaded} className="rounded-full">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">JD</div>
            </Skeleton>
            <div className="flex-1 space-y-2">
              <Skeleton loading={!loaded}>
                <p className="font-medium">Jamie Daniels</p>
              </Skeleton>
              <Skeleton loading={!loaded}>
                <p className="text-sm text-muted-foreground">Product designer</p>
              </Skeleton>
            </div>
          </div>
          <Skeleton loading={!loaded}>
            <p className="text-sm text-muted-foreground">A useful component should feel right in your project.</p>
          </Skeleton>
        </div>
      )
      controls = (
        <button className={control} onClick={() => setLoaded(!loaded)}>
          {loaded ? "Load again" : "Show loaded content"}
        </button>
      )
      break
    case "smoothui/grid-loader":
      example = (
        <div className="flex gap-10">
          <GridLoader pattern="checkerboard" size="lg" color={compact ? "#ffa674" : undefined} />
          {!compact ? <GridLoader pattern="border" mode="sequence" size="lg" /> : null}
        </div>
      )
      break
    case "smoothui/motion-loader":
      example = <MotionLoader variant={motion} size={64} />
      controls = (
        <select
          aria-label="Motion loader variant"
          className={control}
          value={motion}
          onChange={(e) => setMotion(e.target.value as MotionLoaderVariant)}
        >
          {MOTION_LOADER_VARIANTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      )
      break
    case "magicui/animated-circular-progress-bar":
      example = <AnimatedCircularProgressBar value={progress} gaugePrimaryColor="#a3e635" gaugeSecondaryColor="#333" />
      controls = (
        <label className="flex items-center gap-3 text-xs text-muted-foreground">
          Progress
          <input
            aria-label="Progress"
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
          />
        </label>
      )
      break
    default:
      return null
  }
  return (
    <div className={`flex flex-col items-center justify-center ${compact ? "min-h-screen gap-2 px-3 py-2" : "min-h-[360px] gap-8 px-8 py-6"}`}>
      <div className={`flex items-center justify-center ${compact ? "" : "min-h-44"}`}>{example}</div>
      {controls}
    </div>
  )
}
