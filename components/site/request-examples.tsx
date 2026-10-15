"use client"

import { ArrowRight, Check, ChevronLeft, ChevronRight, Copy, Pause, Play } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"

import { motionPreset } from "@/lib/motion-presets"
import { projectRequestPrompt } from "@/lib/integration"
import { RequestScreenshot } from "@/components/site/request-screenshot"

const EXAMPLES = [
  { id: "loading", label: "Loading indicators", question: "Find a loading component to put here.", guidance: "Show three compatible options with live links and recommend one. Match our existing style and wait for my pick before installing.", href: "/components?category=loader", link: "Explore loading components" },
  { id: "navigation", label: "Navigation", question: "Make this navbar feel sharper.", guidance: "Find three navbar options that fit our project. Include mobile and keyboard behavior, live links and a comparison. Recommend one and wait for my pick.", href: "/components?category=navigation", link: "Explore navigation" },
  { id: "pricing", label: "Pricing sections", question: "Show me a cleaner pricing layout.", guidance: "Find three different layouts that fit our actual plans and pricing model. Include live links and a comparison; wait for my pick before replacing the section.", href: "/components?category=pricing", link: "Explore pricing layouts" },
  { id: "features", label: "Section replacements", question: "Replace this features section.", guidance: "I don’t like its look. Show three different component layouts with live examples, explain which fits our content, and wait for my pick.", href: "/components?category=features", link: "Explore feature sections" },
  { id: "tables", label: "Data and tables", question: "Find a table that’s easier to scan.", guidance: "Keep our required columns, sorting and filters. Show three compatible options with live links, explain their tradeoffs and wait for my pick.", href: "/components?category=table", link: "Explore tables" },
  { id: "reference", label: "Design references", question: "Build a page from this reference.", guidance: "Inspect the website link or screenshot I provide, match suitable catalog components, and implement in our existing stack and brand. If I haven’t supplied the reference, ask for it before planning the design.", href: "/reference", link: "See the reference workflow" },
  { id: "motion", label: "Motion and polish", question: "Add subtle motion to these cards.", guidance: "Recommend three reusable motion treatments with live examples. Keep the content and keyboard behavior intact, respect reduced motion and wait for my pick.", href: "/components?q=card&integration=wrapper", link: "Explore card treatments" },
  { id: "data-screen", label: "Whole pages", question: "Build a clean data screen.", guidance: "Choose suitable catalog tables, filters and charts for the actual task. Implement in our existing stack and brand, preserve units and data states, and verify the result.", href: "/components?category=chart", link: "Explore charts" },
] as const

const ROTATION_MS = 2000
const MOTION = motionPreset("quiet")
const QUESTION_CLASS = "col-start-1 row-start-1 max-w-3xl text-3xl leading-tight font-medium tracking-tight sm:text-4xl lg:text-5xl"

export function RequestExamples() {
  const root = useRef<HTMLDivElement>(null)
  const manualCopy = useRef<HTMLTextAreaElement>(null)
  const copyAttempt = useRef(0)
  const requestedIndex = useRef(0)
  const [index, setIndex] = useState(0)
  const [target, setTarget] = useState(0)
  const [preference, setPreference] = useState<boolean | null>(null)
  const [focused, setFocused] = useState(false)
  const [activity, setActivity] = useState({ ready: false, visible: false, tab: true, reduced: false })
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle")
  const enabled = preference ?? !activity.reduced
  const playing = activity.ready && activity.visible && activity.tab && enabled && !focused
  const animateChanges = activity.ready && activity.visible && activity.tab && !activity.reduced
  const leaving = target !== index
  const example = EXAMPLES[index]
  const prompt = projectRequestPrompt(`${example.question} ${example.guidance} Use the screenshot or link I attach to identify the target and its visual context; if the target is unclear, ask me for it.`)

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => {
      if (reduced.matches || document.hidden) setIndex(requestedIndex.current)
      setActivity((current) => ({ ...current, ready: true, reduced: reduced.matches, tab: !document.hidden }))
    }
    const motionChanged = () => { setPreference(null); sync() }
    sync()
    reduced.addEventListener("change", motionChanged)
    document.addEventListener("visibilitychange", sync)
    const observer = new IntersectionObserver(([entry]) => {
      const visible = entry.intersectionRatio >= 0.35
      if (!visible) setIndex(requestedIndex.current)
      setActivity((current) => ({ ...current, visible }))
    }, { threshold: 0.35 })
    observer.observe(root.current!)
    return () => { observer.disconnect(); reduced.removeEventListener("change", motionChanged); document.removeEventListener("visibilitychange", sync) }
  }, [])

  const select = useCallback((next: number) => {
    const normalized = (next + EXAMPLES.length) % EXAMPLES.length
    requestedIndex.current = normalized
    copyAttempt.current++
    setCopyStatus("idle")
    setTarget(normalized)
    if (!animateChanges) setIndex(normalized)
  }, [animateChanges])

  useEffect(() => {
    if (!playing) return
    const timer = setInterval(() => select(target + 1), ROTATION_MS)
    return () => clearInterval(timer)
  }, [playing, target, select])

  useEffect(() => {
    if (copyStatus === "failed") { manualCopy.current?.focus(); manualCopy.current?.select() }
  }, [copyStatus])

  async function copy() {
    const attempt = ++copyAttempt.current
    requestedIndex.current = index
    setTarget(index)
    setPreference(false)
    try {
      await navigator.clipboard.writeText(prompt)
      if (attempt === copyAttempt.current) setCopyStatus("copied")
    } catch {
      if (attempt === copyAttempt.current) setCopyStatus("failed")
    }
  }

  return (
    <div ref={root} role="region" aria-label="Example requests" aria-roledescription="carousel" data-request-examples data-rotation={playing ? "playing" : "paused"} data-request-id={example.id} className="rounded-2xl border bg-card p-5 sm:p-8 lg:p-10" onPointerDownCapture={() => setFocused(false)} onFocusCapture={(event) => setFocused(event.target.matches(":focus-visible"))} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid min-w-0 max-w-full font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {/* Invisible copies reserve the largest label at the current width. */}
          {EXAMPLES.map((item) => <p key={item.id} aria-hidden="true" className="invisible col-start-1 row-start-1 select-none">Try asking · {item.label}</p>)}
          <p className="col-start-1 row-start-1">Try asking · {example.label}</p>
        </div>
        <div className="flex items-center gap-1" style={{ visibility: activity.ready ? "visible" : "hidden" }}>
          <span className="mr-2 font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")} / {String(EXAMPLES.length).padStart(2, "0")}</span>
          <button type="button" aria-label="Previous example" onClick={() => select(requestedIndex.current - 1)} className="inline-flex size-11 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"><ChevronLeft className="size-4" aria-hidden="true" /></button>
          <button type="button" aria-label={enabled ? "Pause examples" : "Play examples"} aria-pressed={enabled} onClick={() => { setPreference(!enabled); setFocused(false) }} className="inline-flex size-11 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring">{enabled ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}</button>
          <button type="button" aria-label="Next example" onClick={() => select(requestedIndex.current + 1)} className="inline-flex size-11 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"><ChevronRight className="size-4" aria-hidden="true" /></button>
        </div>
      </div>
      <div className="grid items-center gap-6 py-8 lg:min-h-72 lg:grid-cols-[1fr_18rem] lg:gap-10">
        <div aria-live={playing ? "off" : "polite"} aria-atomic="true" className="grid min-h-40 items-center sm:min-h-44">
          {/* All questions share a grid cell so wrapping never moves the preview or controls. */}
          {EXAMPLES.map((item) => <blockquote key={item.id} aria-hidden="true" className={`${QUESTION_CLASS} invisible select-none`}>“{item.question}”</blockquote>)}
          {/* A static node replaces any in-flight animation when motion is disabled. */}
          <motion.blockquote
            key={`${example.id}:${animateChanges ? "motion" : "static"}`}
            data-request-question
            initial={animateChanges ? { opacity: 0, y: MOTION.tokens.travel } : false}
            animate={leaving ? { opacity: 0, y: -MOTION.tokens.travel } : { opacity: 1, y: 0 }}
            transition={!animateChanges ? { duration: 0 } : leaving ? MOTION.transition.exit : MOTION.transition.slow}
            onAnimationComplete={() => { if (leaving) setIndex(requestedIndex.current) }}
            className={QUESTION_CLASS}
          >“{example.question}”</motion.blockquote>
        </div>
        <RequestScreenshot />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-5">
        <div className="flex flex-wrap items-center gap-4">
          <button type="button" onClick={copy} disabled={!activity.ready} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">{copyStatus === "copied" ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}{copyStatus === "copied" ? "Copied request" : "Copy request"}</button>
          <div className="grid min-w-0 max-w-full">
            {EXAMPLES.map((item) => <span key={item.id} aria-hidden="true" className="invisible col-start-1 row-start-1 flex min-h-11 items-center pr-6 text-sm select-none">{item.link}</span>)}
            <Link href={example.href} data-request-link className="col-start-1 row-start-1 inline-flex min-h-11 w-fit max-w-full items-center gap-2 text-sm underline underline-offset-4">{example.link} <ArrowRight className="size-3.5 shrink-0" aria-hidden="true" /></Link>
          </div>
        </div>
        <div role="group" aria-label="Choose an example" className="flex gap-1" style={{ visibility: activity.ready ? "visible" : "hidden" }}>
          {EXAMPLES.map((item, next) => <button key={item.id} type="button" aria-label={`Show example ${next + 1}: ${item.label}`} aria-pressed={next === index} onClick={() => select(next)} className="inline-flex h-11 w-6 items-center justify-center rounded-md focus-visible:outline-2 focus-visible:outline-ring"><span className={`size-1.5 rounded-full ${next === index ? "bg-foreground" : "bg-muted-foreground/40"}`} /></button>)}
        </div>
      </div>
      <p role="status" className="mt-3 min-h-4 text-xs text-muted-foreground">{copyStatus === "copied" ? "Copied. Paste it into your project’s agent and attach your own screenshot or link." : copyStatus === "failed" ? "Clipboard unavailable. Select the request below and copy it manually." : "Copy a request, attach your screenshot in Claude Code or Codex, and point out what to change."}</p>
      {copyStatus === "failed" ? <label className="mt-4 block text-sm">Copy this request manually<textarea ref={manualCopy} readOnly value={prompt} rows={5} className="mt-2 w-full rounded-md border bg-background p-3 text-sm leading-relaxed focus-visible:outline-2 focus-visible:outline-ring" onFocus={(event) => event.currentTarget.select()} /></label> : null}
    </div>
  )
}
