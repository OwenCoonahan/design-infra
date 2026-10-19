"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { usePreviewPlayback } from "@/components/site/preview-playback"

export const ChartPreviewContext = createContext({ dataset: 0, interacted: false })

export function useChartAnimation() {
  const playing = usePreviewPlayback()
  const [motion, setMotion] = useState(false)
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setMotion(!query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])
  return playing && motion
}

/** Retain each upstream example's data shape; change numeric observations only. */
export function useChartSample<T extends Record<string, unknown>>(rows: T[]) {
  const { dataset, interacted } = useContext(ChartPreviewContext)
  const animate = useChartAnimation() && interacted
  const data = useMemo(() => dataset === 0 ? rows : rows.map((row, index) => Object.fromEntries(
    Object.entries(row).map(([key, value]) => [key, typeof value === "number" ? Math.round(value * [0.7, 1.45, 0.9, 1.3, 0.65, 1.1][index % 6]) : value]),
  ) as T), [rows, dataset])
  return { data, animate }
}
