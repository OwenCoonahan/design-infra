"use client"

import { Check, ClipboardCopy, Columns3, ListChecks, X } from "lucide-react"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"
import * as React from "react"

import { comparePath } from "@/lib/catalog/compare-path"
import { agentMessage, type HandoffItem } from "@/lib/catalog/handoff"
import { copyText, shortlist, useShortlist, type ShortlistItem } from "@/lib/shortlist"

/** Fetch current install instructions and integration notes, including for saved shortlists. */
async function withInstalls(items: ShortlistItem[]): Promise<HandoffItem[]> {
  const batches = []
  for (let i = 0; i < items.length; i += 24) batches.push(items.slice(i, i + 24))
  const found = (await Promise.all(batches.map(async (batch) => {
    const res = await fetch(`/api/entries?ids=${batch.map((i) => encodeURIComponent(i.id)).join(",")}`)
    if (!res.ok) throw new Error("Could not load component details. Try again.")
    return await res.json() as (HandoffItem & { found: boolean })[]
  }))).flat()
  const byId = new Map(found.map((f) => [f.id, f]))
  return items.map((i) => {
    const details = byId.get(i.id)
    if (!details?.found) throw new Error(`${i.title} is no longer in the catalog. Remove it from your shortlist and try again.`)
    const install = details.install ?? i.install
    if (install && !i.install) shortlist.update(i.id, { install })
    return { ...i, ...details, install }
  })
}

/** Sticky bottom bar on every gallery page once something is shortlisted. */
export function ShortlistBar() {
  const items = useShortlist()
  const segment = useSelectedLayoutSegment()
  const [target, setTarget] = React.useState("")
  const [copied, setCopied] = React.useState(false)
  const [error, setError] = React.useState("")
  if (!items.length || segment === "preview") return null

  const copy = async () => {
    setError("")
    try {
      await copyText(withInstalls(items).then((full) => agentMessage(full, target)))
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not copy. Check clipboard permissions and try again.")
    }
  }

  return (
    <>
    {/* spacer so the fixed bar never covers the end of the page */}
    <div aria-hidden className="h-24" />
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div
        role="region"
        aria-label="Shortlist"
        className="pointer-events-auto flex w-full max-w-5xl flex-wrap items-center gap-2 rounded-2xl border bg-background/95 p-2 pl-4 shadow-2xl backdrop-blur"
      >
        <span className="flex items-center gap-1.5 text-sm font-medium">
          <ListChecks className="size-4" /> Shortlist ({items.length})
        </span>
        <ul className="flex min-w-0 flex-1 gap-1 overflow-x-auto py-0.5">
          {items.map((i) => (
            <li key={i.id} className="flex shrink-0 items-center gap-1 rounded-full border bg-muted/40 py-0.5 pr-1 pl-2.5 text-xs">
              <Link href={`/components/${i.id}`} className="max-w-[12rem] truncate hover:underline" title={i.id}>
                {i.title}
              </Link>
              <button
                type="button"
                aria-label={`Remove ${i.title}`}
                onClick={() => shortlist.remove(i.id)}
                className="rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </li>
          ))}
        </ul>
        <input
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="for… e.g. Request access button"
          aria-label="Which component these are for"
          className="h-8 w-52 rounded-lg border bg-transparent px-2.5 text-xs outline-none placeholder:text-muted-foreground focus:border-ring"
        />
        <Link
          href={comparePath(
            items.map((i) => i.id),
            target.trim() ? { label: target.trim() } : {}
          )}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-foreground px-3 text-xs font-medium text-background hover:opacity-90"
        >
          <Columns3 className="size-3.5" /> Compare
        </Link>
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs hover:bg-muted"
        >
          {copied ? <Check className="size-3.5" /> : <ClipboardCopy className="size-3.5" />}
          {copied ? "Copied" : "Copy for agent"}
        </button>
        <button
          type="button"
          onClick={() => shortlist.clear()}
          className="inline-flex h-8 items-center rounded-lg px-2.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Clear
        </button>
        {error ? <p role="alert" className="w-full px-1 text-xs text-destructive">{error}</p> : null}
      </div>
    </div>
    </>
  )
}
