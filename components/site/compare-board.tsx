"use client"

import { Check, ClipboardCopy, ExternalLink, Heart, ThumbsDown, ThumbsUp, X } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { CopyCommand } from "@/components/site/copy-command"
import { IntegrationBadge, MoodChips, MotionBadge } from "@/components/site/entry-badges"
import { ShortlistButton } from "@/components/site/shortlist-button"
import type { Integration } from "@/lib/catalog/schema"
import { copyText } from "@/lib/shortlist"
import { cn } from "@/lib/utils"

export type CompareTile = {
  id: string
  found: boolean
  title?: string
  source?: string
  kind?: string
  access?: string
  favorite?: boolean
  moods?: string[]
  /** encoded, see lib/catalog/facets.ts */
  motion?: string
  motionDetail?: string
  integration?: Integration
  appliesTo?: string[]
  notes?: string
  install?: string
  live?: string
  docs?: string
  /** "live" = rendered here; "frame" = upstream iframe; "image" = thumbnail only */
  stageKind: "live" | "frame" | "image" | "none"
  stage: React.ReactNode
  removeHref: string
}

type Verdict = { v?: "pick" | "pass"; reason: string }

export function feedbackMessage(
  tiles: CompareTile[],
  verdicts: Record<string, Verdict>,
  { label, url, note }: { label?: string; url: string; note: string }
) {
  const picks = tiles.filter((t) => verdicts[t.id]?.v === "pick")
  const passes = tiles.filter((t) => verdicts[t.id]?.v === "pass")
  const why = (t: CompareTile) => (verdicts[t.id]?.reason.trim() ? ` because ${verdicts[t.id].reason.trim()}` : "")
  const lines = [`From design-infra compare${label ? ` — ${label}` : ""}:`]
  if (picks.length) {
    lines.push("I picked:")
    for (const t of picks) lines.push(`- ${t.id}${t.install ? ` (${t.install})` : ""}${why(t).replace(" because", " —")}`)
  }
  if (passes.length) {
    lines.push("I passed on:")
    for (const t of passes) lines.push(`- ${t.id}${why(t)}`)
  }
  if (!picks.length && !passes.length) lines.push("(no picks yet)")
  if (note.trim()) lines.push("", note.trim())
  lines.push("", `Compare: ${url}`)
  return lines.join("\n")
}

const COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 xl:grid-cols-4",
}

export function CompareBoard({
  tiles,
  label,
  url,
  toolbar,
}: {
  tiles: CompareTile[]
  label?: string
  /** absolute compare URL (what goes in the feedback message) */
  url: string
  toolbar: React.ReactNode
}) {
  const [verdicts, setVerdicts] = React.useState<Record<string, Verdict>>({})
  const [note, setNote] = React.useState("")
  const [cols, setCols] = React.useState(Math.min(Math.max(tiles.length, 1), tiles.length === 5 || tiles.length === 6 ? 3 : 4))
  const [copied, setCopied] = React.useState(false)

  const set = (id: string, v: "pick" | "pass") =>
    setVerdicts((s) => ({ ...s, [id]: { reason: s[id]?.reason ?? "", v: s[id]?.v === v ? undefined : v } }))
  const setReason = (id: string, reason: string) => setVerdicts((s) => ({ ...s, [id]: { ...s[id], reason } }))
  const decided = Object.values(verdicts).filter((v) => v.v).length
  const message = feedbackMessage(tiles, verdicts, { label, url, note })

  const copy = async () => {
    await copyText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <>
      <div className="sticky top-14 z-40 -mx-6 mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-y bg-background/90 px-6 py-2.5 backdrop-blur">
        {toolbar}
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-0.5 rounded-lg border p-0.5 md:flex" aria-label="Columns">
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={cols === n}
                onClick={() => setCols(n)}
                className={cn("rounded-md px-2 py-0.5 text-xs text-muted-foreground", cols === n && "bg-muted text-foreground")}
              >
                {n}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={copy}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-foreground px-3 text-xs font-medium text-background hover:opacity-90"
          >
            {copied ? <Check className="size-3.5" /> : <ClipboardCopy className="size-3.5" />}
            {copied ? "Copied" : `Copy feedback${decided ? ` (${decided})` : ""}`}
          </button>
        </div>
      </div>

      <ul className={cn("mt-6 grid items-start gap-4", COLS[cols])}>
        {tiles.map((t, i) => {
          const v = verdicts[t.id]
          const letter = String.fromCharCode(65 + i)
          if (!t.found)
            return (
              <li key={t.id} className="flex flex-col gap-2 rounded-xl border border-dashed p-5 text-sm">
                <span className="font-mono text-xs text-muted-foreground">{letter}</span>
                <p>
                  Unknown id <code className="font-mono">{t.id}</code> — not in the catalog (renamed or removed?).
                </p>
                <div className="flex gap-3 text-xs">
                  <Link href={`/components?q=${encodeURIComponent(t.id.split("/").pop() ?? t.id)}`} className="underline underline-offset-4">
                    Search for it
                  </Link>
                  <Link href={t.removeHref} className="text-muted-foreground underline underline-offset-4">
                    Remove from compare
                  </Link>
                </div>
              </li>
            )
          return (
            <li
              key={t.id}
              className={cn(
                "flex flex-col overflow-hidden rounded-xl border bg-card transition-colors",
                v?.v === "pick" && "border-foreground ring-1 ring-foreground",
                v?.v === "pass" && "opacity-60"
              )}
            >
              <div className="flex items-center gap-2 border-b px-3 py-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-xs">{letter}</span>
                {t.favorite ? <Heart aria-label="Catalog favorite" className="size-3.5 shrink-0 fill-current text-destructive" /> : null}
                <Link href={`/components/${t.id}`} className="min-w-0 truncate text-sm font-medium hover:underline">
                  {t.title}
                </Link>
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{t.source}</span>
                <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
                  {t.stageKind === "live" ? "live" : t.stageKind === "frame" ? "live (upstream)" : "image"}
                </span>
                <Link href={t.removeHref} aria-label={`Remove ${t.title} from compare`} className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                  <X className="size-3.5" />
                </Link>
              </div>

              <div className="border-b">{t.stage}</div>

              <div className="flex flex-col gap-2.5 p-3">
                <div className="flex flex-wrap items-center gap-1">
                  <MotionBadge motion={t.motion} />
                  <IntegrationBadge integration={t.integration} />
                  {t.access && t.access !== "free" ? (
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground">{t.access}</span>
                  ) : null}
                  <MoodChips moods={t.moods ?? []} />
                </div>
                {t.motionDetail ? <p className="text-[11px] text-muted-foreground">{t.motionDetail}</p> : null}
                {t.notes ? <p className="line-clamp-4 text-xs text-muted-foreground" title={t.notes}>{t.notes}</p> : null}
                {t.install ? <CopyCommand command={t.install} /> : null}
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                  <Link href={`/components/${t.id}`} className="underline underline-offset-4">
                    Gallery page
                  </Link>
                  {t.live ? (
                    <a href={t.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium underline underline-offset-4">
                      Open live demo <ExternalLink className="size-3" />
                    </a>
                  ) : null}
                  {t.docs && t.docs !== t.live ? (
                    <a href={t.docs} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-muted-foreground underline underline-offset-4">
                      Docs <ExternalLink className="size-3" />
                    </a>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    aria-pressed={v?.v === "pick"}
                    onClick={() => set(t.id, "pick")}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors",
                      v?.v === "pick" ? "border-foreground bg-foreground text-background" : "hover:bg-muted"
                    )}
                  >
                    <ThumbsUp className="size-3.5" /> Pick
                  </button>
                  <button
                    type="button"
                    aria-pressed={v?.v === "pass"}
                    onClick={() => set(t.id, "pass")}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors",
                      v?.v === "pass" ? "border-destructive text-destructive" : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <ThumbsDown className="size-3.5" /> Pass
                  </button>
                  <ShortlistButton item={{ id: t.id, title: t.title ?? t.id, install: t.install }} className="ml-auto px-2.5 py-1.5 text-xs" />
                </div>
                {v?.v ? (
                  <input
                    value={v.reason}
                    onChange={(e) => setReason(t.id, e.target.value)}
                    placeholder={v.v === "pass" ? "Why not? (optional) — e.g. too flashy" : "Note for the agent (optional) — e.g. but slower"}
                    aria-label={`Reason for ${t.title}`}
                    className="h-8 rounded-lg border bg-transparent px-2.5 text-xs outline-none placeholder:text-muted-foreground focus:border-ring"
                  />
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>

      <section className="mt-10 grid gap-4 lg:grid-cols-[1fr_28rem]">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Feedback for your agent</h2>
          <p className="text-sm text-muted-foreground">
            Pick or pass on each option (add a reason if you like), then paste this back into your agent&apos;s chat.
          </p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Anything else? e.g. 'like A's motion but with B's colours'"
            rows={3}
            className="rounded-lg border bg-transparent p-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
          />
        </div>
        <div className="flex flex-col gap-2">
          <pre className="max-h-64 overflow-auto rounded-lg border bg-muted/40 p-3 font-mono text-xs whitespace-pre-wrap">{message}</pre>
          <button
            type="button"
            onClick={copy}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-foreground px-3 text-sm font-medium text-background hover:opacity-90"
          >
            {copied ? <Check className="size-4" /> : <ClipboardCopy className="size-4" />}
            {copied ? "Copied" : "Copy feedback"}
          </button>
        </div>
      </section>
    </>
  )
}
