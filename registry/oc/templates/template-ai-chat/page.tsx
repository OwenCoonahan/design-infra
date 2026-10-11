"use client"

import { History, MessageSquare, Plus, Settings, Sparkles, SquarePen } from "lucide-react"
import * as React from "react"

import { type AgentActivity, AgentStatus } from "@/components/agent-status"
import { AppShell } from "@/components/app-shell"
import { type ChatMessage, ChatThread } from "@/components/chat-thread"
import { PromptComposer } from "@/components/prompt-composer"
import { Button } from "@/components/ui/button"

/*
 * @oc/template-ai-chat — assistant UI: conversation sidebar, scrolling thread with tool
 * calls, agent status while "thinking", and the prompt composer pinned to the bottom.
 * `respond()` fakes a model; replace it with your streaming call (AI SDK useChat, etc.).
 */

const SEED: ChatMessage[] = [
  {
    id: "m1",
    role: "user",
    content: "Summarise this week's feedback about onboarding and tell me what to fix first.",
    attachments: [{ name: "onboarding-survey.csv", meta: "48 KB" }],
  },
  {
    id: "m2",
    role: "assistant",
    toolCalls: [
      { name: "search_feedback", status: "done", detail: "onboarding · last 7 days · 214 items" },
      { name: "cluster_themes", status: "done", detail: "5 themes" },
    ],
    content: `I read **214 items** from Slack, Intercom and the survey you attached. Three themes account for 71% of the onboarding complaints:

1. **Workspace invite emails land in spam** — 64 mentions, mostly Outlook users.
2. **The CSV importer rejects files with BOM headers** — 41 mentions, blocks first value.
3. **Nobody finds the Slack integration** — 47 mentions; it's three clicks deep in Settings.

### What I'd fix first
Fix the importer. It's the smallest change with the biggest drop-off: 38% of people who hit it never come back. The fix is a one-liner:

\`\`\`ts
const text = raw.replace(/^\\uFEFF/, "") // strip BOM before parsing
\`\`\`

Want me to draft a Linear ticket with the quotes attached?`,
  },
  { id: "m3", role: "user", content: "Yes — draft it, and include the top 3 quotes." },
  {
    id: "m4",
    role: "assistant",
    toolCalls: [{ name: "linear.create_issue", status: "done", detail: "draft · ONB-412" }],
    content: `Drafted **ONB-412 · CSV importer rejects files with a BOM header** in *Onboarding*. Included quotes:

- "Import just says *invalid file* — I exported it from Excel 5 minutes ago."
- "Gave up on the import and typed 40 contacts by hand."
- "Your importer hates every CSV I have."

It's assigned to nobody yet. Should I ping the on-call engineer?`,
  },
]

const CANNED = `Done — I pinged **@sam** in #eng-onboarding with a link to [ONB-412](#). They usually reply within the hour.

Anything else from this week's feedback you want me to dig into?`

export default function ChatPage() {
  const [messages, setMessages] = React.useState<ChatMessage[]>(SEED)
  const [pending, setPending] = React.useState<{ activity: AgentActivity; detail?: string } | null>(null)
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([])

  React.useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const stop = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setPending(null)
  }

  const respond = (text: string) => {
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", content: text }])
    setPending({ activity: "thinking" })
    timers.current.push(
      setTimeout(() => setPending({ activity: "searching", detail: "slack · #eng-onboarding" }), 900),
      setTimeout(() => setPending({ activity: "writing" }), 1900),
      setTimeout(() => {
        setPending(null)
        setMessages((m) => [
          ...m,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            toolCalls: [{ name: "slack.post_message", status: "done", detail: "#eng-onboarding" }],
            content: CANNED,
          },
        ])
      }, 2800)
    )
  }

  return (
    <AppShell
      className="h-svh overflow-hidden"
      contentClassName="min-h-0 gap-0 p-0 md:p-0"
      brand={{ name: "Relay AI", subtitle: "Feedback analyst", logo: <Sparkles /> }}
      nav={[
        {
          items: [
            { title: "New chat", href: "#", icon: <SquarePen /> },
            { title: "History", href: "#", icon: <History /> },
          ],
        },
        {
          label: "Today",
          items: [
            { title: "Onboarding feedback triage", href: "#", icon: <MessageSquare />, active: true },
            { title: "Churn reasons Q3", href: "#", icon: <MessageSquare /> },
          ],
        },
        {
          label: "Previous 7 days",
          items: [
            { title: "Pricing page objections", href: "#", icon: <MessageSquare /> },
            { title: "Release notes draft", href: "#", icon: <MessageSquare /> },
            { title: "NPS verbatims → themes", href: "#", icon: <MessageSquare /> },
          ],
        },
      ]}
      user={{ name: "Maya Chen", email: "maya@acme.com" }}
      userMenu={[{ label: "Settings", href: "#", icon: <Settings /> }]}
      breadcrumbs={[{ label: "Chats", href: "#" }, { label: "Onboarding feedback triage" }]}
      headerActions={
        <>
          <AgentStatus
            activity={pending?.activity ?? "idle"}
            label={pending ? undefined : "Ready"}
            className="hidden sm:inline-flex"
          />
          <Button variant="outline" size="sm">
            <Plus data-icon="inline-start" />
            New chat
          </Button>
        </>
      }
    >
      <ChatThread messages={messages} pending={pending} onRegenerate={() => respond("Try that again, shorter.")} />
      <div className="shrink-0 bg-gradient-to-t from-background via-background to-transparent px-4 pt-2 pb-4">
        <PromptComposer
          busy={!!pending}
          onStop={stop}
          onSubmit={({ text }) => respond(text || "Here are the files.")}
          placeholder="Ask about your customer feedback…"
          suggestions={
            messages.length <= 4 ? ["Yes, ping them", "Show the churn themes", "Draft release notes"] : undefined
          }
          footnote="Relay AI can make mistakes. Check important numbers against the source."
        />
      </div>
    </AppShell>
  )
}
