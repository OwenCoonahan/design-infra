"use client"

import dynamic from "next/dynamic"

// Canvas graph packages need a browser. Keep them out of server rendering and the catalog bundle.
const FlowDemo = dynamic(() => import("./react-flow-demo"), { ssr: false, loading: () => <p className="p-8">Loading graph…</p> })
const ForceDemo = dynamic(() => import("./force-graph-demo"), { ssr: false, loading: () => <p className="p-8">Loading graph…</p> })

export function GraphDemo({ id }: { id: string }) {
  return id === "react-flow/custom-nodes" ? <FlowDemo /> : <ForceDemo />
}
