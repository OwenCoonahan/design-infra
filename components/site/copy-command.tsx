"use client"

import { Check, Copy } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

export function CopyCommand({ command, className }: { command: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)
  return (
    <div
      className={cn(
        "group flex items-center gap-2 rounded-lg border bg-muted/40 py-1.5 pr-1.5 pl-3 font-mono text-xs text-foreground",
        className
      )}
    >
      <span className="text-muted-foreground select-none">$</span>
      <code className="min-w-0 flex-1 truncate">{command}</code>
      <button
        type="button"
        aria-label="Copy command"
        onClick={() => {
          navigator.clipboard.writeText(command)
          setCopied(true)
          setTimeout(() => setCopied(false), 1200)
        }}
        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  )
}
