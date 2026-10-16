"use client"

import Link from "next/link"
import { motion, useMotionValue, useSpring } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { GalleryPreview, useGalleryMotion } from "./gallery-preview"
import { MOTION_TOKENS } from "@/lib/catalog/motion"
import type { PreviewDescriptor } from "@/lib/catalog/previews"

export type HomeExample = { id: string; name: string; href: string; poster?: string; descriptor: PreviewDescriptor }

/** Real, isolated component demos. Their frames share the homepage's three-preview budget. */
export function ComponentScene({ examples }: { examples: HomeExample[] }) {
  const root = useRef<HTMLDivElement>(null)
  const motionEnabled = useGalleryMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(y, { stiffness: 110, damping: 24 })
  const rotateY = useSpring(x, { stiffness: 110, damping: 24 })
  const [active, setActive] = useState(false)
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    const element = root.current!
    const reduced = matchMedia("(prefers-reduced-motion: reduce)")
    const pointer = matchMedia("(hover: hover) and (pointer: fine)")
    let visible = false
    const sync = () => {
      const allowed = motionEnabled && visible && !document.hidden && !reduced.matches && pointer.matches
      setActive(allowed)
      if (allowed) setEntered(true)
      else { x.set(0); y.set(0); rotateX.jump(0); rotateY.jump(0) }
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
    observer.observe(element)
    reduced.addEventListener("change", sync)
    pointer.addEventListener("change", sync)
    document.addEventListener("visibilitychange", sync)
    return () => { observer.disconnect(); reduced.removeEventListener("change", sync); pointer.removeEventListener("change", sync); document.removeEventListener("visibilitychange", sync); rotateX.stop(); rotateY.stop() }
  }, [x, y, rotateX, rotateY, motionEnabled])
  useEffect(() => {
    if (!active) return
    const move = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.data?.type !== "design-infra-pointer" || !Number.isFinite(event.data.x) || !Number.isFinite(event.data.y)) return
      const element = root.current
      if (!element?.isConnected) return
      const frame = [...element.querySelectorAll("iframe")].find((frame) => frame.contentWindow === event.source)
      if (!frame) return
      const scene = element.getBoundingClientRect()
      const bounds = frame.getBoundingClientRect()
      x.set(((bounds.left + bounds.width * event.data.x - scene.left) / scene.width - 0.5) * 8)
      y.set(-((bounds.top + bounds.height * event.data.y - scene.top) / scene.height - 0.5) * 6)
    }
    window.addEventListener("message", move)
    return () => window.removeEventListener("message", move)
  }, [active, x, y])
  const positions = ["sm:absolute sm:top-[1%] sm:left-[4%] sm:w-[90%] sm:-rotate-3", "sm:absolute sm:right-0 sm:bottom-0 sm:w-[43%] sm:rotate-6", "sm:absolute sm:bottom-[2%] sm:left-0 sm:w-[43%] sm:-rotate-6"]
  return (
    <div ref={root} data-component-scene data-scene-active={active} className="relative isolate [perspective:1400px]" onPointerMove={(event) => {
      if (!active) return
      const bounds = event.currentTarget.getBoundingClientRect()
      x.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 8)
      y.set(-((event.clientY - bounds.top) / bounds.height - 0.5) * 6)
    }} onPointerLeave={() => { x.set(0); y.set(0) }}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-[4%] rounded-full bg-[radial-gradient(ellipse_at_center,#ffa6740c,transparent_65%)]" />
      <motion.div data-scene-plane style={{ rotateX, rotateY }} className="grid grid-cols-1 gap-3 sm:relative sm:block sm:aspect-[1/1.08]">
        {examples.map((example, i) => <motion.article key={example.id} data-scene-card={example.id} initial={false} animate={active && entered ? { y: [18 + i * 8, 0], opacity: [0.4, 1] } : { y: 0, opacity: 1 }} transition={{ ...MOTION_TOKENS.lively.spring, delay: active ? i * 0.09 : 0 }} className={`${positions[i]} relative overflow-hidden rounded-xl border border-white/15 bg-[#141414] shadow-[0_18px_55px_-16px_#000c] transition-[box-shadow,border-color] hover:z-20 hover:border-white/30 hover:shadow-[0_24px_70px_-10px_#000] focus-within:z-20`}>
          <header className="flex min-h-10 items-center border-b border-white/10 px-3"><Link href={example.href} className="truncate text-xs font-medium underline-offset-4 hover:underline">{example.name}</Link></header>
          <GalleryPreview id={`home-scene:${example.id}`} title={example.name} descriptor={example.descriptor} poster={example.poster} order={i} presentation="scene" responsive minHeight={i === 0 ? 220 : 232} />
        </motion.article>)}
      </motion.div>
    </div>
  )
}
