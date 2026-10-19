"use client"

import { useState, type CSSProperties } from "react"
import { ChartPreviewContext } from "./chart-preview-state"
import { SHADCN_CHART_DEMOS } from "./shadcn-chart-demos"
import { ChartJsDemo } from "./chartjs-demos"

const palettes = {
  warm: ["#ffa674", "#b5a4e3", "#d3e8ad", "#78c4d4", "#f2c875"],
  cool: ["#78c4d4", "#7d94f0", "#b5a4e3", "#b7d5ed", "#8ac5ad"],
  mono: ["#eeeeee", "#bfbfbf", "#929292", "#676767", "#454545"],
}
const control = "min-h-10 rounded-md border bg-background px-3 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-ring"

export function ChartDemo({ id }: { id: string }) {
  const [dataset, setDataset] = useState(0)
  const [interacted, setInteracted] = useState(false)
  const [palette, setPalette] = useState<keyof typeof palettes>("warm")
  const Demo = SHADCN_CHART_DEMOS[id as keyof typeof SHADCN_CHART_DEMOS]
  return <ChartPreviewContext.Provider value={{ dataset, interacted }}>
    <div data-chart-demo={id} data-dataset={dataset} className="flex min-h-screen w-full flex-col justify-center gap-4 p-4" style={Object.fromEntries(palettes[palette].map((color, index) => [`--chart-${index + 1}`, color])) as CSSProperties}>
      <div className="chart-preview-example w-full">
        {Demo ? <Demo /> : <ChartJsDemo id={id} colors={palettes[palette]} />}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div role="group" aria-label="Sample dataset" className="flex gap-1">
          {[0, 1].map((value) => <button key={value} className={`${control} aria-pressed:bg-foreground aria-pressed:text-background`} aria-pressed={dataset === value} onClick={() => { setInteracted(true); setDataset(value) }}>Data {value === 0 ? "A" : "B"}</button>)}
        </div>
        <label className="flex items-center gap-2 text-xs">Palette<select className={control} aria-label="Chart palette" value={palette} onChange={(event) => setPalette(event.target.value as keyof typeof palettes)}><option value="warm">Warm</option><option value="cool">Cool</option><option value="mono">Mono</option></select></label>
      </div>
      <p className="text-center text-[11px] text-muted-foreground">Sample data · hover values or use the chart’s keyboard controls</p>
      <style>{`.chart-preview-example [data-slot="card-footer"] { display: none; } .chart-preview-example [data-slot="card"] { padding-bottom: 16px; } .chart-preview-example [data-slot="chart"] { max-height: 260px; }`}</style>
    </div>
  </ChartPreviewContext.Provider>
}
