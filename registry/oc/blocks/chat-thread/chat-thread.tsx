"use client"

import { Check, Copy, FileText, Loader2, RotateCcw, Sparkles, ThumbsDown, ThumbsUp, Wrench, X } from "lucide-react"
import * as React from "react"

import { AgentStatus, type AgentActivity } from "@/components/agent-status"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ChatToolCall = {
  name: string
  status: "running" | "done" | "error"
  /** Argument summary or result ("query: pricing pages", "3 files"). */
  detail?: string
}

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  /** Markdown-ish text: paragraphs, **bold**, *italic*, `code`, ``` fences ```, - lists, 1. lists, ### headings, [links](url). */
  content: string
  toolCalls?: ChatToolCall[]
  attachments?: { name: string; meta?: string }[]
}

/* ------------------------------------------------------------------ tiny markdown */

function inline(text: string, keyPrefix: string): React.ReactNode[] {
  const out: React.ReactNode[] = []
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)\s]+\))/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const t = m[0]
    const k = `${keyPrefix}-${i++}`
    if (t.startsWith("`"))
      out.push(
        <code key={k} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground">
          {t.slice(1, -1)}
        </code>
      )
    else if (t.startsWith("**"))
      out.push(
        <strong key={k} className="font-semibold text-foreground">
          {t.slice(2, -2)}
        </strong>
      )
    else if (t.startsWith("["))
      out.push(
        <a
          key={k}
          href={t.slice(t.indexOf("(") + 1, -1)}
          className="text-foreground underline decoration-primary decoration-2 underline-offset-4"
        >
          {t.slice(1, t.indexOf("]"))}
        </a>
      )
    else out.push(<em key={k}>{t.slice(1, -1)}</em>)
    last = m.index + t.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = React.useState(false)
  return (
    <div className="overflow-hidden rounded-lg border bg-muted/60">
      <div className="flex items-center justify-between border-b px-3 py-1.5 font-mono text-xs text-muted-foreground">
        <span>{lang || "text"}</span>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 1200)
          }}
          className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-[13px] leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  )
}

/** Renders the markdown subset assistants actually use. Swap for react-markdown if you need tables/HTML. */
export function ChatMarkdown({ content, className }: { content: string; className?: string }) {
  const blocks: React.ReactNode[] = []
  const parts = content.split(/```/)
  parts.forEach((part, pi) => {
    if (pi % 2 === 1) {
      const nl = part.indexOf("\n")
      const lang = nl === -1 ? "" : part.slice(0, nl).trim()
      blocks.push(
        <CodeBlock key={`c${pi}`} lang={lang} code={(nl === -1 ? part : part.slice(nl + 1)).replace(/\n$/, "")} />
      )
      return
    }
    part
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean)
      .forEach((para, bi) => {
        const key = `b${pi}-${bi}`
        const lines = para.split("\n")
        if (lines.every((l) => /^\s*[-*]\s+/.test(l)))
          blocks.push(
            <ul key={key} className="ml-5 list-disc space-y-1 marker:text-muted-foreground">
              {lines.map((l, li) => (
                <li key={li}>{inline(l.replace(/^\s*[-*]\s+/, ""), `${key}-${li}`)}</li>
              ))}
            </ul>
          )
        else if (lines.every((l) => /^\s*\d+[.)]\s+/.test(l)))
          blocks.push(
            <ol key={key} className="ml-5 list-decimal space-y-1 marker:text-muted-foreground">
              {lines.map((l, li) => (
                <li key={li}>{inline(l.replace(/^\s*\d+[.)]\s+/, ""), `${key}-${li}`)}</li>
              ))}
            </ol>
          )
        else if (/^#{1,4}\s/.test(lines[0]))
          blocks.push(
            <React.Fragment key={key}>
              <h4 className="mt-1 font-heading text-lg font-headline text-foreground">
                {lines[0].replace(/^#+\s/, "")}
              </h4>
              {lines.length > 1 ? <p>{inline(lines.slice(1).join(" "), key)}</p> : null}
            </React.Fragment>
          )
        else
          blocks.push(
            <p key={key} className="text-pretty">
              {lines.map((l, li) => (
                <React.Fragment key={li}>
                  {li > 0 ? <br /> : null}
                  {inline(l, `${key}-${li}`)}
                </React.Fragment>
              ))}
            </p>
          )
      })
  })
  return <div className={cn("flex flex-col gap-3 text-[0.9375rem] leading-relaxed", className)}>{blocks}</div>
}

/* ------------------------------------------------------------------ pieces */

function ToolCallChip({ call }: { call: ChatToolCall }) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 font-mono text-xs text-muted-foreground",
        call.status === "error" && "border-destructive/40 text-destructive"
      )}
    >
      {call.status === "running" ? (
        <Loader2 className="size-3.5 shrink-0 animate-spin" aria-label="running" />
      ) : call.status === "error" ? (
        <X className="size-3.5 shrink-0" aria-label="failed" />
      ) : (
        <Wrench className="size-3.5 shrink-0" aria-hidden />
      )}
      <span className="text-foreground">{call.name}</span>
      {call.detail ? <span className="truncate">· {call.detail}</span> : null}
      {call.status === "done" ? <Check className="size-3.5 shrink-0" aria-label="done" /> : null}
    </span>
  )
}

function AssistantAvatar({ children }: { children?: React.ReactNode }) {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground [&_svg]:size-4">
      {children ?? <Sparkles />}
    </span>
  )
}

function MessageActions({ content, onRegenerate }: { content: string; onRegenerate?: () => void }) {
  const [copied, setCopied] = React.useState(false)
  const [vote, setVote] = React.useState<"up" | "down" | null>(null)
  return (
    <div className="-ml-1.5 flex items-center gap-0.5 text-muted-foreground opacity-70 transition-opacity group-hover/msg:opacity-100">
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label="Copy message"
        onClick={() => {
          navigator.clipboard?.writeText(content)
          setCopied(true)
          setTimeout(() => setCopied(false), 1200)
        }}
      >
        {copied ? <Check /> : <Copy />}
      </Button>
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label="Good response"
        aria-pressed={vote === "up"}
        onClick={() => setVote("up")}
      >
        <ThumbsUp className={cn(vote === "up" && "fill-current")} />
      </Button>
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label="Bad response"
        aria-pressed={vote === "down"}
        onClick={() => setVote("down")}
      >
        <ThumbsDown className={cn(vote === "down" && "fill-current")} />
      </Button>
      {onRegenerate ? (
        <Button variant="ghost" size="icon-xs" aria-label="Regenerate" onClick={onRegenerate}>
          <RotateCcw />
        </Button>
      ) : null}
    </div>
  )
}

/* ------------------------------------------------------------------ thread */

/**
 * Scrollable conversation: right-aligned user bubbles, full-width assistant turns with
 * markdown-ish rendering, tool-call chips and hover actions. `pending` shows @oc/agent-status
 * while the next turn streams. Sticks to the bottom as messages arrive.
 */
export function ChatThread({
  messages,
  pending,
  assistantAvatar,
  onRegenerate,
  empty,
  className,
}: {
  messages: ChatMessage[]
  /** In-progress assistant turn. */
  pending?: { activity: AgentActivity; label?: string; detail?: string } | null
  assistantAvatar?: React.ReactNode
  onRegenerate?: (messageId: string) => void
  /** Shown when there are no messages (suggestions, greeting). */
  empty?: React.ReactNode
  className?: string
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const mounted = React.useRef(false)
  React.useEffect(() => {
    const el = scrollRef.current
    // jump on first render, glide for new messages
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: mounted.current ? "smooth" : "instant" })
    mounted.current = true
  }, [messages.length, pending])

  return (
    <div ref={scrollRef} className={cn("min-h-0 flex-1 overflow-y-auto", className)}>
      <div role="log" aria-live="polite" className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6">
        {messages.length === 0 && !pending ? empty : null}
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={m.id} className="flex flex-col items-end gap-2">
              {m.attachments?.length ? (
                <div className="flex flex-wrap justify-end gap-2">
                  {m.attachments.map((a) => (
                    <span
                      key={a.name}
                      className="inline-flex items-center gap-2 rounded-lg border bg-card px-2.5 py-1.5 text-xs"
                    >
                      <FileText className="size-4 text-muted-foreground" />
                      <span className="text-foreground">{a.name}</span>
                      {a.meta ? <span className="text-muted-foreground">{a.meta}</span> : null}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="max-w-[85%] rounded-2xl rounded-br-md bg-muted px-4 py-2.5 text-[0.9375rem] leading-relaxed whitespace-pre-wrap text-foreground">
                {m.content}
              </div>
            </div>
          ) : (
            <div key={m.id} className="group/msg flex gap-3">
              <AssistantAvatar>{assistantAvatar}</AssistantAvatar>
              <div className="flex min-w-0 flex-1 flex-col gap-3 pt-1">
                {m.toolCalls?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {m.toolCalls.map((c, ci) => (
                      <ToolCallChip key={c.name + ci} call={c} />
                    ))}
                  </div>
                ) : null}
                {m.content ? <ChatMarkdown content={m.content} className="text-foreground" /> : null}
                {m.content ? (
                  <MessageActions
                    content={m.content}
                    onRegenerate={onRegenerate && i === messages.length - 1 ? () => onRegenerate(m.id) : undefined}
                  />
                ) : null}
              </div>
            </div>
          )
        )}
        {pending ? (
          <div className="flex gap-3">
            <AssistantAvatar>{assistantAvatar}</AssistantAvatar>
            <AgentStatus activity={pending.activity} label={pending.label} detail={pending.detail} className="pt-1" />
          </div>
        ) : null}
      </div>
    </div>
  )
}
