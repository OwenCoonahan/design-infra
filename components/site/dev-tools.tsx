"use client"

import dynamic from "next/dynamic"

// Agentation: click any element in dev, annotate it, and Claude Code picks it up via the
// agentation MCP server (see catalog/sources/agentation.md).
const Agentation = dynamic(() => import("agentation").then((m) => m.Agentation), { ssr: false })

export function DevTools() {
  if (process.env.NODE_ENV !== "development") return null
  return <Agentation endpoint="http://localhost:4747" />
}
