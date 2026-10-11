"use client"

import * as React from "react"

/**
 * Owen's shortlist — catalog ids he ticked while browsing. Lives in localStorage so it survives
 * navigation between /components, entry pages, /inspiration and /compare (and other tabs).
 */
export type ShortlistItem = { id: string; title: string; install?: string }

const KEY = "design-infra:shortlist"
const EVENT = "design-infra:shortlist"
const EMPTY: ShortlistItem[] = []

let cache: { raw: string | null; items: ShortlistItem[] } = { raw: null, items: EMPTY }

function read(): ShortlistItem[] {
  const raw = localStorage.getItem(KEY)
  if (raw === cache.raw) return cache.items
  let items = EMPTY
  try {
    const parsed = raw ? (JSON.parse(raw) as unknown) : []
    if (Array.isArray(parsed)) items = parsed.filter((i): i is ShortlistItem => typeof i?.id === "string")
  } catch {}
  cache = { raw, items }
  return items
}

function write(items: ShortlistItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items))
  window.dispatchEvent(new Event(EVENT))
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => e.key === KEY && cb()
  window.addEventListener("storage", onStorage)
  window.addEventListener(EVENT, cb)
  return () => {
    window.removeEventListener("storage", onStorage)
    window.removeEventListener(EVENT, cb)
  }
}

export const shortlist = {
  add(item: ShortlistItem) {
    const items = read()
    if (!items.some((i) => i.id === item.id)) write([...items, item])
  },
  remove(id: string) {
    write(read().filter((i) => i.id !== id))
  },
  toggle(item: ShortlistItem) {
    if (read().some((i) => i.id === item.id)) shortlist.remove(item.id)
    else shortlist.add(item)
  },
  /** Fill in details (e.g. install command fetched later) without changing order. */
  update(id: string, patch: Partial<ShortlistItem>) {
    write(read().map((i) => (i.id === id ? { ...i, ...patch, id } : i)))
  },
  clear() {
    write([])
  },
}

export function useShortlist() {
  return React.useSyncExternalStore(subscribe, read, () => EMPTY)
}

/**
 * Copy text that may still be loading. ClipboardItem with a promise keeps the user gesture alive
 * in Safari; Chrome falls back to writeText after the await.
 */
export async function copyText(text: string | Promise<string>) {
  if (typeof text !== "string" && typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ "text/plain": text.then((t) => new Blob([t], { type: "text/plain" })) }),
      ])
      return
    } catch {}
  }
  await navigator.clipboard.writeText(await text)
}
