"use client"

// Original demo compositions using the MIT Chart.js package, not a screenshot or docs iframe.
import { useContext, useEffect, useRef, useState } from "react"
import Chart from "chart.js/auto"
import type { ChartConfiguration, ChartType } from "chart.js"
import { ChartPreviewContext, useChartAnimation } from "./chart-preview-state"

const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
const samples = [[42, 65, 54, 91, 76, 112], [72, 48, 81, 63, 105, 89]]
const titles: Record<string, string> = { line: "Line chart", bar: "Grouped bars", doughnut: "Doughnut", bubble: "Bubble chart", scatter: "Scatter plot" }

export function ChartJsDemo({ id, colors }: { id: string; colors: string[] }) {
  const type = id.split("/")[1] as ChartType
  const canvas = useRef<HTMLCanvasElement>(null)
  const chart = useRef<Chart | null>(null)
  const { dataset, interacted } = useContext(ChartPreviewContext)
  const motion = useChartAnimation()
  const [second, setSecond] = useState(true)
  useEffect(() => {
    const config: ChartConfiguration = {
      type,
      data: { labels, datasets: [] },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false,
        plugins: { legend: { labels: { color: "#bdbdbd", padding: 16, usePointStyle: true } }, tooltip: { backgroundColor: "#242424", titleColor: "#fff", bodyColor: "#ddd", padding: 12 } },
        ...(type === "doughnut" ? { cutout: "70%" } : { scales: { x: { grid: { color: "#ffffff0a" }, ticks: { color: "#969696" } }, y: { beginAtZero: true, grid: { color: "#ffffff10" }, ticks: { color: "#969696" } } } }),
      },
    }
    const instance = new Chart(canvas.current!, config)
    chart.current = instance
    return () => { instance.destroy(); chart.current = null }
  }, [type])
  useEffect(() => {
    const instance = chart.current
    if (!instance) return
    const values = samples[dataset]
    const points = (offset: number) => values.map((value, index) => ({ x: index * 12 + 8 + offset, y: value - offset * 2, r: 6 + index * 2 }))
    instance.data.datasets = type === "doughnut" ? [{ label: "Sessions", data: values, backgroundColor: colors, borderColor: "#181818", borderWidth: 4, hoverOffset: 7 }] : [
      { label: "Product", data: type === "scatter" || type === "bubble" ? points(0) : values, borderColor: colors[0], backgroundColor: `${colors[0]}b0`, borderWidth: 2, tension: 0.35, pointRadius: 4, borderRadius: 5 },
      ...(second ? [{ label: "Reference", data: type === "scatter" || type === "bubble" ? points(5) : values.map((value) => Math.round(value * 0.65)), borderColor: colors[1], backgroundColor: `${colors[1]}90`, borderWidth: 2, tension: 0.35, pointRadius: 4, borderRadius: 5 }] : []),
    ]
    instance.options.animation = motion && interacted ? { duration: 400 } : false
    instance.stop()
    instance.update(motion && interacted ? undefined : "none")
  }, [type, dataset, colors, second, motion, interacted])
  return <section data-chartjs={type} className="rounded-xl border bg-card p-5">
    <div className="mb-3 flex min-h-10 items-center justify-between gap-2"><h2 className="text-base font-medium">{titles[type]}</h2>{type !== "doughnut" ? <button aria-pressed={second} className="min-h-10 rounded border px-3 text-xs" onClick={() => setSecond(!second)}>{second ? "Hide" : "Show"} reference</button> : null}</div>
    <div className="relative h-[280px]"><canvas ref={canvas} role="img" aria-label={`${titles[type]}, illustrative dataset ${dataset === 0 ? "A" : "B"}`} /></div>
    <div className="sr-only"><table><caption>Illustrative values; not real analytics</caption><tbody>{samples[dataset].map((value, index) => <tr key={labels[index]}><th>{labels[index]}</th><td>{value}</td></tr>)}</tbody></table></div>
  </section>
}
