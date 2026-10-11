"use client"

import {
  BarChart3,
  Bell,
  CreditCard,
  Download,
  LayoutDashboard,
  LifeBuoy,
  Plug,
  Plus,
  Settings,
  Users,
  Wallet,
} from "lucide-react"
import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { AppShell } from "@/components/app-shell"
import { DataTableCard, type DataTableColumn } from "@/components/data-table-card"
import { StatCards } from "@/components/stat-cards"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { cn } from "@/lib/utils"

/*
 * @oc/template-saas-dashboard — SaaS overview page: app shell, KPI tiles, revenue chart,
 * recent activity and a customers table. Swap the sample data for your queries.
 */

/* ---------------------------------------------------------------- sample data */

// Deterministic pseudo-random so server and client renders match.
const noise = (i: number) => Math.sin(i * 12.9898) * 0.5 + Math.sin(i * 4.1414) * 0.5

const REVENUE = Array.from({ length: 90 }, (_, i) => {
  const d = new Date(Date.UTC(2026, 6, 3 + i))
  return {
    date: d.toISOString().slice(0, 10),
    current: Math.round(1400 + i * 14 + noise(i) * 260),
    previous: Math.round(1250 + i * 8 + noise(i + 40) * 220),
  }
})

const chartConfig = {
  current: { label: "This period", color: "var(--chart-1)" },
  previous: { label: "Previous period", color: "var(--chart-3)" },
} satisfies ChartConfig

type Customer = {
  id: string
  name: string
  email: string
  plan: "Starter" | "Team" | "Enterprise"
  status: "Active" | "Trialing" | "Past due" | "Canceled"
  mrr: number
  joined: string
}

const CUSTOMERS: Customer[] = [
  ["Northwind Traders", "ops@northwind.com", "Enterprise", "Active", 2400, "2026-03-14"],
  ["Globex", "billing@globex.io", "Team", "Active", 490, "2026-05-02"],
  ["Initech", "it@initech.com", "Team", "Past due", 490, "2026-01-21"],
  ["Hooli", "finance@hooli.xyz", "Enterprise", "Active", 3200, "2025-11-30"],
  ["Umbrella Labs", "hello@umbrella.dev", "Starter", "Trialing", 0, "2026-09-18"],
  ["Stark & Co", "accounts@stark.co", "Team", "Active", 980, "2026-02-09"],
  ["Wayne Labs", "ap@waynelabs.com", "Enterprise", "Active", 1800, "2026-04-27"],
  ["Pied Piper", "richard@piedpiper.com", "Starter", "Canceled", 0, "2025-12-12"],
  ["Soylent", "team@soylent.food", "Team", "Trialing", 0, "2026-09-22"],
  ["Cyberdyne", "billing@cyberdyne.ai", "Team", "Active", 1470, "2026-06-15"],
  ["Tyrell Corp", "finance@tyrell.com", "Enterprise", "Active", 4100, "2025-10-03"],
  ["Massive Dynamic", "ap@massive.dev", "Team", "Past due", 490, "2026-07-08"],
].map(([name, email, plan, status, mrr, joined], i) => ({
  id: `cus_${i + 1}`,
  name,
  email,
  plan,
  status,
  mrr,
  joined,
})) as Customer[]

const ACTIVITY = [
  { who: "Tyrell Corp", what: "upgraded to Enterprise", amount: "+$2,300", when: "2m ago" },
  { who: "Soylent", what: "started a trial", amount: "", when: "18m ago" },
  { who: "Massive Dynamic", what: "payment failed", amount: "$490", when: "1h ago", bad: true },
  { who: "Cyberdyne", what: "added 6 seats", amount: "+$294", when: "3h ago" },
  { who: "Pied Piper", what: "canceled subscription", amount: "−$49", when: "yesterday", bad: true },
]

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
const initials = (s: string) =>
  s
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

const columns: DataTableColumn<Customer>[] = [
  {
    key: "name",
    header: "Customer",
    sortable: true,
    cell: (c) => (
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarFallback className="text-xs">{initials(c.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground">{c.name}</div>
          <div className="truncate text-xs text-muted-foreground">{c.email}</div>
        </div>
      </div>
    ),
  },
  { key: "plan", header: "Plan", badge: { Enterprise: "default", Team: "secondary", Starter: "outline" } },
  {
    key: "status",
    header: "Status",
    badge: { Active: "outline", Trialing: "secondary", "Past due": "destructive", Canceled: "outline" },
  },
  { key: "mrr", header: "MRR", align: "right", sortable: true, cell: (c) => usd(c.mrr) },
  {
    key: "joined",
    header: "Joined",
    align: "right",
    sortable: true,
    cell: (c) =>
      new Date(c.joined).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      }),
  },
]

/* ---------------------------------------------------------------- page */

const RANGES = [
  { id: "7d", label: "7d", days: 7 },
  { id: "30d", label: "30d", days: 30 },
  { id: "90d", label: "90d", days: 90 },
] as const

export default function DashboardPage() {
  const [range, setRange] = React.useState<(typeof RANGES)[number]["id"]>("30d")
  const data = REVENUE.slice(-RANGES.find((r) => r.id === range)!.days)

  return (
    <AppShell
      brand={{ name: "Relay", subtitle: "Acme workspace" }}
      nav={[
        {
          items: [
            { title: "Overview", href: "#", icon: <LayoutDashboard />, active: true },
            { title: "Customers", href: "#", icon: <Users />, badge: 12 },
            { title: "Revenue", href: "#", icon: <Wallet /> },
            { title: "Reports", href: "#", icon: <BarChart3 /> },
          ],
        },
        {
          label: "Workspace",
          items: [
            { title: "Integrations", href: "#", icon: <Plug /> },
            { title: "Billing", href: "#", icon: <CreditCard /> },
            { title: "Settings", href: "#", icon: <Settings /> },
            { title: "Help", href: "#", icon: <LifeBuoy /> },
          ],
        },
      ]}
      user={{ name: "Maya Chen", email: "maya@acme.com" }}
      userMenu={[
        { label: "Account", href: "#", icon: <Settings /> },
        { label: "Billing", href: "#", icon: <CreditCard /> },
      ]}
      breadcrumbs={[{ label: "Acme", href: "#" }, { label: "Overview" }]}
      headerActions={
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell />
        </Button>
      }
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-headline tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">How Acme is doing this month.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download data-icon="inline-start" />
            Export
          </Button>
          <Button>
            <Plus data-icon="inline-start" />
            New invoice
          </Button>
        </div>
      </div>

      <StatCards
        stats={[
          {
            label: "Monthly recurring revenue",
            value: "$48,210",
            delta: 12.4,
            deltaLabel: "vs. last month",
            trend: [31, 33, 32, 36, 38, 37, 41, 44, 46, 48],
          },
          {
            label: "Active customers",
            value: "1,284",
            delta: 4.1,
            deltaLabel: "vs. last month",
            trend: [1100, 1130, 1150, 1170, 1190, 1210, 1230, 1250, 1270, 1284],
          },
          {
            label: "Churn rate",
            value: "2.1%",
            delta: -0.6,
            invertDelta: true,
            deltaLabel: "lower is better",
            trend: [3, 2.9, 2.8, 2.7, 2.6, 2.5, 2.4, 2.3, 2.2, 2.1],
          },
          {
            label: "Failed payments",
            value: "7",
            delta: 40,
            invertDelta: true,
            deltaLabel: "vs. last month",
            trend: [3, 4, 2, 5, 3, 4, 6, 5, 6, 7],
          },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 data-slot="card-title" className="font-heading text-base leading-snug font-headline">
              Revenue
            </h2>
            <CardDescription>Daily net revenue vs. the previous period</CardDescription>
            <CardAction>
              <div className="flex rounded-lg border p-0.5" role="group" aria-label="Range">
                {RANGES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    aria-pressed={range === r.id}
                    onClick={() => setRange(r.id)}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground",
                      range === r.id && "bg-secondary text-secondary-foreground hover:text-secondary-foreground"
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
              <AreaChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="fill-current" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-current)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--color-current)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(v: string) =>
                    new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
                  }
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={48}
                  domain={[(min: number) => Math.floor((min * 0.8) / 500) * 500, "auto"]}
                  tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}k`}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                      labelFormatter={(v) =>
                        new Date(String(v)).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          timeZone: "UTC",
                        })
                      }
                    />
                  }
                />
                <Area
                  dataKey="previous"
                  type="monotone"
                  isAnimationActive={false}
                  stroke="var(--color-previous)"
                  strokeDasharray="4 4"
                  fill="none"
                  strokeWidth={1.5}
                />
                <Area
                  dataKey="current"
                  type="monotone"
                  isAnimationActive={false}
                  stroke="var(--color-current)"
                  fill="url(#fill-current)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 data-slot="card-title" className="font-heading text-base leading-snug font-headline">
              Recent activity
            </h2>
            <CardDescription>Billing events across all customers</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col divide-y">
              {ACTIVITY.map((a) => (
                <li key={a.who + a.what} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs">{initials(a.who)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="truncate">
                      <span className="font-medium text-foreground">{a.who}</span>{" "}
                      <span className="text-muted-foreground">{a.what}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{a.when}</p>
                  </div>
                  {a.amount ? (
                    <span className={cn("text-sm tabular-nums", a.bad ? "text-destructive" : "text-foreground")}>
                      {a.amount}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <DataTableCard
        title="Customers"
        description="All paying and trialing accounts."
        columns={columns}
        rows={CUSTOMERS}
        rowKey="id"
        searchKeys={["name", "email"]}
        searchPlaceholder="Search customers…"
        filter={{ key: "status", label: "Status", options: ["Active", "Trialing", "Past due", "Canceled"] }}
        actions={
          <Button variant="outline">
            <Download data-icon="inline-start" />
            CSV
          </Button>
        }
        pageSize={6}
      />
    </AppShell>
  )
}
