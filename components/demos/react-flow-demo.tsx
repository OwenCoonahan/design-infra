"use client"

// Original composition using the free MIT React Flow core: https://reactflow.dev/examples/nodes/custom-node
import { useCallback, useState } from "react"
import { ReactFlow, Handle, Position, Background, Controls, addEdge, useNodesState, useEdgesState, type Connection, type NodeProps } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { PreviewShell } from "../site/preview-shell"
import { useChartAnimation } from "./chart-preview-state"

const initialNodes = [
  { id: "source", type: "step", position: { x: 20, y: 100 }, data: { label: "Source", detail: "New event", color: "#ffa674" } },
  { id: "transform", type: "step", position: { x: 220, y: 25 }, data: { label: "Transform", detail: "Shape the data", color: "#b5a4e3" } },
  { id: "review", type: "step", position: { x: 220, y: 185 }, data: { label: "Review", detail: "Check the result", color: "#78c4d4" } },
  { id: "output", type: "step", position: { x: 420, y: 100 }, data: { label: "Output", detail: "Ready to ship", color: "#d3e8ad" } },
]
const initialEdges = [{ id: "a", source: "source", target: "transform" }, { id: "b", source: "source", target: "review" }, { id: "c", source: "transform", target: "output" }, { id: "d", source: "review", target: "output" }]
function Step({ data, selected }: NodeProps) {
  return <div className="w-36 rounded-xl border bg-[#202020] p-3 text-white shadow-lg" style={{ borderColor: selected ? String(data.color) : "#444" }}>
    <Handle type="target" position={Position.Left} />
    <span className="mb-2 block h-2 w-2 rounded-full" style={{ backgroundColor: String(data.color) }} />
    <strong className="block text-sm">{String(data.label)}</strong><span className="text-[11px] text-neutral-400">{String(data.detail)}</span>
    <Handle type="source" position={Position.Right} />
  </div>
}
const nodeTypes = { step: Step }
export default function FlowDemo() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selected, setSelected] = useState("source")
  const motion = useChartAnimation()
  const connect = useCallback((connection: Connection) => setEdges((current) => addEdge(connection, current)), [setEdges])
  return <PreviewShell><section data-graph-demo="react-flow" className="flex min-h-screen flex-col justify-center gap-3 p-4">
    <div className="flex items-center justify-between"><h2 className="font-medium">Build a flow</h2><button className="min-h-10 rounded border px-3 text-xs" onClick={() => { setNodes(initialNodes); setEdges(initialEdges); setSelected("source") }}>Reset graph</button></div>
    <div className="h-[330px] rounded-xl border" data-graph-stage>
      <ReactFlow nodes={nodes} edges={edges.map((edge) => ({ ...edge, animated: motion }))} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={connect} nodeTypes={nodeTypes} onNodeClick={(_, node) => setSelected(node.id)} fitView colorMode="dark" minZoom={0.3} maxZoom={1.5}>
        <Background gap={20} color="#343434" /><Controls showInteractive={false} />
      </ReactFlow>
    </div>
    <label className="flex items-center justify-between text-xs">Selected node<select aria-label="Selected node" className="min-h-10 rounded border bg-background px-3" value={selected} onChange={(event) => { setSelected(event.target.value); setNodes((current) => current.map((node) => ({ ...node, selected: node.id === event.target.value }))) }}>{initialNodes.map((node) => <option key={node.id} value={node.id}>{node.data.label}</option>)}</select></label>
    <p aria-live="polite" className="text-xs text-muted-foreground">{selected} · {edges.length} connections · drag nodes or connect their handles</p>
  </section></PreviewShell>
}
