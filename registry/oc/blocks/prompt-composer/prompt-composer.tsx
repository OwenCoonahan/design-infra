"use client"

import { ArrowUp, Check, ChevronDown, FileText, Globe, Paperclip, Square, X } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export type ComposerModel = { id: string; label: string; description?: string }
export type ComposerSubmit = { text: string; files: File[]; model: string; webSearch: boolean }

const fmtSize = (b: number) =>
  b < 1024 ? `${b} B` : b < 1024 ** 2 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1024 ** 2).toFixed(1)} MB`

/**
 * Chat input: auto-growing textarea, file attachments (chips), model picker, web-search
 * toggle and send/stop. Enter sends, Shift+Enter adds a newline.
 */
export function PromptComposer({
  onSubmit,
  onStop,
  busy = false,
  models = [
    { id: "fast", label: "Fast", description: "Quick answers, lower cost" },
    { id: "balanced", label: "Balanced", description: "Best for most tasks" },
    { id: "deep", label: "Deep reasoning", description: "Slower, thinks step by step" },
  ],
  defaultModel,
  placeholder = "Ask anything…",
  suggestions,
  footnote,
  accept,
  className,
}: {
  onSubmit?: (value: ComposerSubmit) => void
  /** Shown as a stop button while `busy`. */
  onStop?: () => void
  busy?: boolean
  models?: ComposerModel[]
  defaultModel?: string
  placeholder?: string
  /** Quick-start prompts rendered above the box while it is empty. */
  suggestions?: string[]
  /** Small print under the box ("AI can make mistakes…"). */
  footnote?: React.ReactNode
  /** <input type=file accept>. */
  accept?: string
  className?: string
}) {
  const [text, setText] = React.useState("")
  const [files, setFiles] = React.useState<File[]>([])
  const [model, setModel] = React.useState(defaultModel ?? models[1]?.id ?? models[0]?.id ?? "")
  const [webSearch, setWebSearch] = React.useState(false)
  const fileRef = React.useRef<HTMLInputElement>(null)
  const areaRef = React.useRef<HTMLTextAreaElement>(null)
  const inputId = React.useId()
  const current = models.find((m) => m.id === model) ?? models[0]
  const canSend = !busy && (text.trim().length > 0 || files.length > 0)

  const submit = () => {
    if (!canSend) return
    onSubmit?.({ text: text.trim(), files, model, webSearch })
    setText("")
    setFiles([])
    areaRef.current?.focus()
  }

  return (
    <div className={cn("mx-auto flex w-full max-w-3xl flex-col gap-2", className)}>
      {suggestions?.length && !text ? (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setText(s)
                areaRef.current?.focus()
              }}
              className="rounded-full border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
        className="flex flex-col rounded-2xl border bg-card text-card-foreground shadow-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30"
      >
        {files.length ? (
          <ul className="flex flex-wrap gap-2 px-3 pt-3">
            {files.map((f, i) => (
              <li
                key={f.name + i}
                className="flex items-center gap-2 rounded-lg border bg-muted/60 py-1.5 pr-1 pl-2 text-xs"
              >
                <FileText className="size-4 text-muted-foreground" />
                <span className="max-w-40 truncate text-foreground">{f.name}</span>
                <span className="text-muted-foreground">{fmtSize(f.size)}</span>
                <button
                  type="button"
                  aria-label={`Remove ${f.name}`}
                  onClick={() => setFiles((fs) => fs.filter((_, j) => j !== i))}
                  className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <label className="sr-only" htmlFor={inputId}>
          Message
        </label>
        <textarea
          id={inputId}
          ref={areaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault()
              submit()
            }
          }}
          rows={1}
          placeholder={placeholder}
          className="field-sizing-content max-h-60 min-h-14 w-full resize-none bg-transparent px-4 pt-4 pb-2 text-[0.9375rem] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
        />

        <div className="flex items-center gap-1 px-2 pb-2">
          <input
            ref={fileRef}
            type="file"
            multiple
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const picked = Array.from(e.target.files ?? [])
              setFiles((fs) => [...fs, ...picked])
              e.target.value = ""
            }}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Attach files"
                  onClick={() => fileRef.current?.click()}
                >
                  <Paperclip />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Attach files</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            type="button"
            variant="ghost"
            aria-pressed={webSearch}
            onClick={() => setWebSearch((v) => !v)}
            className={cn(
              "text-muted-foreground",
              webSearch && "bg-secondary text-secondary-foreground hover:bg-secondary hover:text-secondary-foreground"
            )}
          >
            <Globe />
            Search
          </Button>

          <div className="ml-auto flex items-center gap-1">
            {models.length > 1 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="ghost" className="text-muted-foreground">
                    {current?.label}
                    <ChevronDown data-icon="inline-end" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Model</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {models.map((m) => (
                    <DropdownMenuItem key={m.id} onSelect={() => setModel(m.id)} className="items-start">
                      <div className="flex flex-1 flex-col">
                        <span>{m.label}</span>
                        {m.description ? <span className="text-xs text-muted-foreground">{m.description}</span> : null}
                      </div>
                      {m.id === model ? <Check className="mt-0.5" /> : null}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
            {busy ? (
              <Button type="button" size="icon" aria-label="Stop generating" onClick={onStop} className="rounded-full">
                <Square className="fill-current" />
              </Button>
            ) : (
              <Button type="submit" size="icon" aria-label="Send message" disabled={!canSend} className="rounded-full">
                <ArrowUp />
              </Button>
            )}
          </div>
        </div>
      </form>
      {footnote ? <p className="text-center text-xs text-muted-foreground">{footnote}</p> : null}
    </div>
  )
}
