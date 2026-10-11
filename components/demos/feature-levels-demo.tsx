import { Check, RefreshCw, X } from "lucide-react"

import { FeatureLevels, LevelCard } from "@/registry/oc/blocks/feature-levels/feature-levels"

const img = (id: string) => `https://images.unsplash.com/${id}?w=1600&q=70&auto=format&fit=crop`

function CodeWindow() {
  return (
    <LevelCard className="max-w-lg font-mono text-[11px] leading-relaxed">
      <div className="mb-3 flex gap-1.5">
        <span className="size-2 rounded-full bg-muted-foreground/40" />
        <span className="size-2 rounded-full bg-muted-foreground/40" />
        <span className="size-2 rounded-full bg-muted-foreground/40" />
      </div>
      <pre className="overflow-hidden whitespace-pre text-muted-foreground">
        <span className="text-foreground">const</span> res = <span className="text-foreground">await</span> fetch(
        {"\n"}  &quot;https://api.relay.dev/v1/chat&quot;, {"{"}
        {"\n"}  method: &quot;POST&quot;,
        {"\n"}  body: JSON.stringify({"{"}
        {"\n"}    model: <span className="rounded bg-primary px-1 text-primary-foreground">&quot;claude-sonnet&quot;</span>,
        {"\n"}    messages,
        {"\n"}  {"}"}),
        {"\n"}{"}"})
      </pre>
    </LevelCard>
  )
}

function Failover() {
  const rows = [
    { model: "gpt-5.5", state: "down" as const },
    { model: "claude-sonnet-4", state: "retry" as const },
    { model: "deepseek-chat", state: "ok" as const },
  ]
  return (
    <LevelCard className="flex max-w-xs flex-col gap-2 p-3">
      {rows.map((r) => (
        <div key={r.model} className="flex items-center gap-3 rounded-lg border bg-background/60 px-3 py-2 text-xs">
          <span className="flex-1 font-mono">{r.model}</span>
          {r.state === "down" ? (
            <span className="flex items-center gap-1 text-destructive">
              <X className="size-3.5" /> down
            </span>
          ) : r.state === "retry" ? (
            <span className="flex items-center gap-1 text-muted-foreground">
              <RefreshCw className="size-3.5 animate-spin motion-reduce:animate-none" /> rerouting
            </span>
          ) : (
            <span className="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="size-3" />
            </span>
          )}
        </div>
      ))}
    </LevelCard>
  )
}

function RequestLog() {
  const rows = [
    ["Success", "POST /chat", "gpt-4o", "1.23s"],
    ["Success", "POST /chat", "claude-4", "0.91s"],
    ["Retry", "POST /chat", "gpt-4o", "2.40s"],
  ]
  return (
    <LevelCard className="max-w-lg p-0 font-mono text-[11px]">
      {rows.map(([status, route, model, t], i) => (
        <div key={i} className="flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0">
          <span
            className={
              status === "Retry"
                ? "rounded bg-destructive/15 px-1.5 py-0.5 text-destructive"
                : "rounded bg-secondary px-1.5 py-0.5 text-secondary-foreground"
            }
          >
            {status}
          </span>
          <span className="text-foreground">{route}</span>
          <span className="flex-1 text-muted-foreground">{model}</span>
          <span className="tabular-nums text-muted-foreground">{t}</span>
        </div>
      ))}
    </LevelCard>
  )
}

export function FeatureLevelsDemo() {
  return (
    <FeatureLevels
      heading="Relay simplifies your AI infrastructure,"
      subheading="with one single connection."
      features={[
        {
          label: "One API for every model",
          title: "Use one API for every model",
          description: "Point your existing code at Relay instead of each provider. Swap models by changing one string — no rewrite.",
          image: img("photo-1506905925346-21bda4d32df4"),
          overlay: <CodeWindow />,
          cta: { label: "Book a call", href: "#" },
        },
        {
          label: "Automatic failover",
          title: "Stay online when providers fail",
          description: "If a model goes down or rate-limits, Relay retries and routes traffic to the next provider. Users never see the failure.",
          image: img("photo-1470071459604-3b5ec3a7fe05"),
          overlay: <Failover />,
          cta: { label: "Book a call", href: "#" },
        },
        {
          label: "Load balancing",
          title: "Balance load across providers",
          description: "Spread traffic across models and regions automatically for better latency and cost.",
          image: img("photo-1464822759023-fed622ff2c3b"),
          overlay: <RequestLog />,
          cta: { label: "Book a call", href: "#" },
        },
      ]}
    />
  )
}
