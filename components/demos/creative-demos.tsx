"use client"

import { useRef, useState } from "react"
import { RotateCcw, Undo2 } from "lucide-react"
import PixelBrushCanvas, { type PixelBrushCanvasHandle } from "./vendor/smoothui/pixel-brush-canvas"
import Scrubber from "./vendor/smoothui/scrubber"
import CardSwipeDeck, { type CardSwipeDeckHandle } from "./vendor/smoothui/card-swipe-deck"

const palette = ["#ffa674", "#b5a4e3", "#d3e8ad"]
const control = "inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border px-3 text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
// Original, editable artwork. No stock images or vendor screenshot assets.
const initial = ["..........", "..0....0..", ".000..000.", "..000000..", "...0000...", "....00...."].map((row) => [...row].map((pixel) => pixel === "." ? -1 : 0))

export function PixelCanvasDemo({ width, compact = false }: { width: number; compact?: boolean }) {
  const editor = useRef<PixelBrushCanvasHandle>(null)
  const [color, setColor] = useState(0)
  return <>
    <PixelBrushCanvas ref={editor} width={10} height={6} pixelSize={Math.max(9, Math.min(18, Math.floor((width - 24) / 10)))} palette={palette} initial={initial} color={color} grid showTools={false} />
    <div role="group" aria-label="Drawing tools" className="flex justify-center gap-1">
      {palette.map((ink, i) => <button key={ink} type="button" aria-label={`Use ${["peach", "lilac", "lime"][i]} ink`} aria-pressed={color === i} onClick={() => setColor(i)} className={`${control} !px-2 aria-pressed:border-white`}><span aria-hidden="true" className="size-4 rounded-full" style={{ background: ink }} /></button>)}
      <button type="button" aria-label="Undo drawing" title="Undo" className={`${control} !px-2`} onClick={() => editor.current?.undo()}><Undo2 aria-hidden="true" className="size-4" /></button>
    </div>
    <p className={compact ? "sr-only" : "text-center text-xs text-muted-foreground"}>Draw here · arrows + space work too</p>
  </>
}

export function ScrubberDemo({ compact = false }: { compact?: boolean }) {
  const [roundness, setRoundness] = useState(36)
  return <>
    <div aria-hidden="true" className="flex h-20 items-center justify-center">
      <div data-reshape-tile className="size-16 border border-white/20 bg-[#b5a4e3] shadow-[6px_6px_0_#b5a4e326]" style={{ borderRadius: `${roundness / 2}%`, transform: `rotate(${(roundness - 36) / 2}deg)` }} />
    </div>
    <div className="w-full max-w-64" onPointerDownCapture={(event) => {
      // The upstream drag handler prevents default; retain keyboard focus after a click.
      (event.currentTarget.querySelector('[role="slider"]') as HTMLElement | null)?.focus({ preventScroll: true })
    }}><Scrubber label="Shape" value={roundness} onValueChange={setRoundness} min={0} max={100} step={1} decimals={0} className="h-11 rounded-lg" /></div>
    <p className={compact ? "sr-only" : "text-center text-xs text-muted-foreground"}>Drag the value · or use arrow keys</p>
  </>
}

const directions = [
  { id: "play", title: "A little play.", detail: "Make room for the unexpected.", color: "#b5a4e3", radius: "28%", rotation: -12 },
  { id: "calm", title: "Keep it calm.", detail: "Less noise. More space to think.", color: "#d3e8ad", radius: "50%", rotation: 0 },
  { id: "bold", title: "Go a bit bold.", detail: "Give the good stuff some presence.", color: "#ffa674", radius: "8%", rotation: 12 },
]

export function SwipeDeckDemo({ width }: { width: number }) {
  const deck = useRef<CardSwipeDeckHandle>(null)
  const [result, setResult] = useState("Swipe left to pass, right to keep.")
  return <>
    <CardSwipeDeck ref={deck} className="!h-64 !w-72" threshold={Math.min(80, width * 0.25)} labels={{ left: "Pass", right: "Keep" }} onSwipe={(id, direction) => setResult(`${direction === "right" ? "Kept" : "Passed"}: ${directions.find((item) => item.id === id)!.title}`)} items={directions.map((item, i) => ({ id: item.id, content: <div className="flex h-full select-none flex-col justify-between p-6" style={{ background: item.color, color: "#201c25" }}><div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest"><span>Find your direction</span><span>0{i + 1}</span></div><div aria-hidden="true" className="mx-auto size-20 border-[10px] border-current" style={{ borderRadius: item.radius, transform: `rotate(${item.rotation}deg)` }} /><div><p className="text-2xl font-semibold tracking-tight">{item.title}</p><p className="mt-1 text-xs">{item.detail}</p></div></div> }))} />
    <div role="group" aria-label="Review directions" className="mt-4 flex flex-wrap justify-center gap-2">
      <button type="button" className={control} onClick={() => deck.current?.swipeLeft()}>Pass</button>
      <button type="button" className={`${control} bg-foreground text-background`} onClick={() => deck.current?.swipeRight()}>Keep</button>
      <button type="button" aria-label="Reset cards" className={control} onClick={() => { deck.current?.reset(); setResult("Swipe left to pass, right to keep.") }}><RotateCcw aria-hidden="true" className="size-4" /></button>
    </div>
    <p role="status" className="text-center text-xs text-muted-foreground">{result}</p>
  </>
}
