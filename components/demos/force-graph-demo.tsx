"use client"

// Original composition using MIT react-force-graph-2d: https://github.com/vasturiano/react-force-graph
import { useEffect, useRef, useState } from "react"
import ForceGraph, { type ForceGraphMethods, type NodeObject } from "react-force-graph-2d"
import { PreviewShell } from "../site/preview-shell"
import { usePreviewPlayback } from "../site/preview-playback"

type GraphNode = { id: string; color: string }
function sampleGraph() {
  const labels = ["Design", "Systems", "Motion", "Charts", "Research", "Code", "Type"]
  return {
    nodes: labels.map((id, index) => { const angle = (index - 1) * Math.PI / 3; const x = index ? Math.cos(angle) * 100 : 0; const y = index ? Math.sin(angle) * 82 : 0; return { id, color: ["#ffa674", "#b5a4e3", "#78c4d4", "#d3e8ad"][index % 4], x, y, fx: x, fy: y } }),
    links: labels.slice(1).map((target) => ({ source: "Design", target })).concat([{ source: "Motion", target: "Code" }, { source: "Research", target: "Systems" }, { source: "Type", target: "Charts" }]),
  }
}
export default function ForceDemo() {
  const graph = useRef<ForceGraphMethods<GraphNode> | undefined>(undefined)
  const stage = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(608)
  const [data, setData] = useState(sampleGraph)
  const [selected, setSelected] = useState("Design")
  const motion = usePreviewPlayback()
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(stage.current!)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    // Draw one complete frame before pausing; fixed initial positions keep posters aligned.
    const instance = graph.current
    instance?.resumeAnimation()
    instance?.centerAt(0, 0, 0)
    instance?.zoom(1.25, 0)
    const frame = requestAnimationFrame(() => { if (!motion) instance?.pauseAnimation() })
    return () => { cancelAnimationFrame(frame); instance?.pauseAnimation() }
  }, [motion, selected, data, width])
  const draw = (node: NodeObject<GraphNode>, context: CanvasRenderingContext2D) => {
    context.beginPath(); context.arc(node.x!, node.y!, node.id === selected ? 12 : 8, 0, 2 * Math.PI)
    context.fillStyle = node.color; context.fill()
    if (node.id === selected) { context.strokeStyle = "#fff"; context.lineWidth = 2; context.stroke() }
    context.font = "11px sans-serif"; context.textAlign = "center"; context.fillStyle = "#eee"; context.fillText(node.id, node.x!, node.y! + 26)
  }
  return <PreviewShell><section data-graph-demo="force-graph" className="flex min-h-screen flex-col justify-center gap-3 p-4">
    <div className="flex items-center justify-between"><h2 className="font-medium">Explore connections</h2><button className="min-h-10 rounded border px-3 text-xs" onClick={() => { setData(sampleGraph()); setSelected("Design") }}>Reset graph</button></div>
    <div ref={stage} className="h-[330px] overflow-hidden rounded-xl border" data-graph-stage>
      <ForceGraph ref={graph} width={width} height={330} graphData={data} backgroundColor="#181818" nodeCanvasObject={draw} nodePointerAreaPaint={(node, color, context) => { context.fillStyle = color; context.beginPath(); context.arc(node.x!, node.y!, 15, 0, Math.PI * 2); context.fill() }} linkColor={() => "#ffffff40"} linkWidth={1.5} onNodeClick={(node) => setSelected(node.id)} onNodeDragEnd={(node) => { node.fx = node.x; node.fy = node.y }} cooldownTicks={1} enableZoomInteraction={false} enablePanInteraction={false} />
    </div>
    <label className="flex items-center justify-between text-xs">Selected node<select aria-label="Selected node" className="min-h-10 rounded border bg-background px-3" value={selected} onChange={(event) => setSelected(event.target.value)}>{data.nodes.map((node) => <option key={node.id}>{node.id}</option>)}</select></label>
    <p aria-live="polite" className="text-xs text-muted-foreground">{selected} · drag a node or select one to inspect the network</p>
  </section></PreviewShell>
}
