"use client"

import { useState } from "react"
import { formatFeedback, type Feedback } from "@/lib/feedback"

export function FeedbackForm({ component = "", link = "" }: { component?: string; link?: string }) {
  const [value, setValue] = useState<Feedback>({ request: "", component, link, stack: "", outcome: "Found useful options", details: "" })
  const [status, setStatus] = useState("")
  const fields: { key: keyof Feedback; label: string; placeholder?: string }[] = [
    { key: "request", label: "What were you trying to do?", placeholder: "Replace our pricing section with something cleaner" },
    { key: "component", label: "Component ID (optional)", placeholder: "oc/pricing-simple" },
    { key: "link", label: "Search, comparison or demo link (optional)" },
    { key: "stack", label: "Project stack and agent", placeholder: "Next.js, Tailwind 4, Codex" },
    { key: "details", label: "What worked, or where did you get stuck?" },
  ]
  const report = formatFeedback(value)
  return <div className="mt-8 space-y-5">
    {fields.map((field) => <div key={field.key}>
      <label htmlFor={`feedback-${field.key}`} className="mb-2 block text-sm font-medium">{field.label}</label>
      <textarea id={`feedback-${field.key}`} rows={field.key === "details" ? 4 : 2} placeholder={field.placeholder} value={value[field.key]} onChange={(event) => { setValue({ ...value, [field.key]: event.target.value }); setStatus("") }} className="w-full rounded-md border bg-background p-3 text-sm" />
    </div>)}
    <div><label htmlFor="feedback-outcome" className="mb-2 block text-sm font-medium">Outcome</label>
      <select id="feedback-outcome" value={value.outcome} onChange={(event) => setValue({ ...value, outcome: event.target.value })} className="w-full rounded-md border bg-background p-3 text-sm">
        {["Found useful options", "Installed successfully", "Search results missed the need", "Demo link failed", "Setup or installation failed", "Other"].map((outcome) => <option key={outcome}>{outcome}</option>)}
      </select>
    </div>
    <label htmlFor="feedback-report" className="block text-sm font-medium">Your report</label>
    <textarea id="feedback-report" readOnly value={report} rows={14} className="w-full rounded-md border bg-muted/30 p-3 font-mono text-xs" />
    <button type="button" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" onClick={async () => {
      try { await navigator.clipboard.writeText(report); setStatus("Copied. Paste the report into your group chat or send it to the maintainer.") }
      catch { setStatus("Clipboard unavailable. Select the report above and copy it manually.") }
    }}>Copy feedback report</button>
    <p role="status" className="text-sm text-muted-foreground">{status}</p>
  </div>
}
