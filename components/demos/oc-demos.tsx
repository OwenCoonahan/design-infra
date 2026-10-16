import {
  Bell,
  Bot,
  Boxes,
  FolderOpen,
  Gauge,
  GitBranch,
  Inbox,
  KeyRound,
  Layers,
  LayoutDashboard,
  Lock,
  Palette,
  Plus,
  Rss,
  Settings,
  ShieldCheck,
  Sparkles,
  Upload,
  Users,
  Workflow,
  Zap,
} from "lucide-react"

import { FeatureLevelsDemo } from "@/components/demos/feature-levels-demo"
import { AppFrame } from "@/components/site/app-frame"
import { KineticDemo, BeamDemo } from "@/components/demos/motion-showcase-demos"
import { Button } from "@/components/ui/button"
import { AgentStatus } from "@/registry/oc/blocks/agent-status/agent-status"
import { AppShell } from "@/registry/oc/blocks/app-shell/app-shell"
import { ChatThread } from "@/registry/oc/blocks/chat-thread/chat-thread"
import { CtaBanner } from "@/registry/oc/blocks/cta-banner/cta-banner"
import { DataTableCard } from "@/registry/oc/blocks/data-table-card/data-table-card"
import DesignLabPage from "@/registry/oc/blocks/design-lab/page"
import { EmptyState } from "@/registry/oc/blocks/empty-state/empty-state"
import { Faq } from "@/registry/oc/blocks/faq/faq"
import { FeatureBento } from "@/registry/oc/blocks/feature-bento/feature-bento"
import { FeatureList } from "@/registry/oc/blocks/feature-list/feature-list"
import { FooterColumns } from "@/registry/oc/blocks/footer-columns/footer-columns"
import { HeroSplit } from "@/registry/oc/blocks/hero-split/hero-split"
import { HeroSpotlight } from "@/registry/oc/blocks/hero-spotlight/hero-spotlight"
import { LogoCloud } from "@/registry/oc/blocks/logo-cloud/logo-cloud"
import { Navbar } from "@/registry/oc/blocks/navbar/navbar"
import { PricingSimple } from "@/registry/oc/blocks/pricing-simple/pricing-simple"
import { PromptComposer } from "@/registry/oc/blocks/prompt-composer/prompt-composer"
import { SettingsForm } from "@/registry/oc/blocks/settings-form/settings-form"
import { StatCards } from "@/registry/oc/blocks/stat-cards/stat-cards"
import { StatsRow } from "@/registry/oc/blocks/stats-row/stats-row"
import { TestimonialsGrid } from "@/registry/oc/blocks/testimonials-grid/testimonials-grid"
import { ThemePreview } from "@/registry/oc/blocks/theme-preview/theme-preview"

const LOGOS = ["Northwind", "Globex", "Initech", "Umbrella", "Hooli", "Stark & Co", "Wayne Labs"].map((name) => ({
  name,
}))

const DEPLOYS = [
  ["dpl_8f2a", "acme-web", "Production", "Ready", "main", "2m ago"],
  ["dpl_7c11", "acme-docs", "Preview", "Building", "feat/search", "6m ago"],
  ["dpl_6b90", "acme-api", "Production", "Ready", "main", "1h ago"],
  ["dpl_5e44", "acme-web", "Preview", "Error", "fix/hydration", "3h ago"],
  ["dpl_4d02", "acme-admin", "Production", "Ready", "main", "yesterday"],
  ["dpl_3a77", "acme-docs", "Preview", "Ready", "docs/v2", "yesterday"],
  ["dpl_2f19", "acme-api", "Preview", "Canceled", "chore/deps", "2d ago"],
].map(([id, project, env, status, branch, age]) => ({ id, project, env, status, branch, age }))

const PRICING_SQL = "select page, signups::float / sessions as cvr\nfrom page_stats order by cvr asc limit 3;"

/** Live demos for @oc registry items, keyed by item name. */
export const OC_DEMOS: Record<string, () => React.ReactNode> = {
  "kinetic-field": () => <KineticDemo />,
  "feature-levels": () => <FeatureLevelsDemo />,
  "design-lab": () => <DesignLabPage />,
  "hero-spotlight": () => (
    <HeroSpotlight
      eyebrow="Now with DESIGN.md themes"
      title="Ship interfaces that already look finished"
      description="One registry for themes, blocks and curated components — installable with a single command."
      primaryAction={{ label: "Get started", href: "#" }}
      secondaryAction={{ label: "Browse catalog", href: "#" }}
      className="min-h-[30rem]"
    />
  ),
  "feature-bento": () => (
    <FeatureBento
      heading="Everything a new project needs"
      subheading="Pick a design system, pull components, keep agents on-brand."
      features={[
        {
          title: "Design systems",
          description: "DESIGN.md → tokens, fonts, type scale.",
          icon: <Palette />,
          span: "2",
        },
        { title: "Curated catalog", description: "~1,000 components, ranked.", icon: <Layers />, span: "row" },
        { title: "Agent skills", description: "find-component, pick-design-system.", icon: <Bot /> },
        { title: "Effects", description: "Spotlights, beams, orbs.", icon: <Sparkles /> },
        { title: "Fast", description: "npx shadcn add @oc/…", icon: <Zap />, span: "2" },
      ]}
    />
  ),
  "pricing-simple": () => (
    <PricingSimple
      heading="Simple pricing"
      subheading="Start free, upgrade when your team grows."
      tiers={[
        {
          name: "Hobby",
          description: "For side projects.",
          monthly: 0,
          features: ["1 project", "Community support"],
          cta: { label: "Start free", href: "#" },
        },
        {
          name: "Pro",
          description: "For growing teams.",
          monthly: 25,
          features: ["Unlimited projects", "Private registry", "Priority support"],
          cta: { label: "Upgrade", href: "#" },
          featured: true,
        },
        {
          name: "Enterprise",
          description: "Custom contracts.",
          monthly: null,
          features: ["SSO", "Audit logs", "SLA"],
          cta: { label: "Contact sales", href: "#" },
        },
      ]}
    />
  ),
  "agent-status": () => (
    <div className="flex flex-col items-start gap-6 p-8">
      <AgentStatus activity="searching" detail="catalog/index.json · 'pricing'" size="lg" />
      <div className="flex flex-wrap gap-6">
        <AgentStatus activity="thinking" />
        <AgentStatus activity="writing" detail="hero-spotlight.tsx" />
        <AgentStatus activity="planning" />
        <AgentStatus activity="idle" />
      </div>
    </div>
  ),
  "beam-card": () => <BeamDemo />,
  "theme-preview": () => <ThemePreview />,

  /* ---------------------------------------------------------------- marketing */
  navbar: () => (
    <Navbar
      sticky={false}
      brand={{ name: "Acme", logo: <Boxes /> }}
      links={[
        { label: "Product", href: "#" },
        { label: "Customers", href: "#" },
        { label: "Pricing", href: "#" },
        { label: "Docs", href: "#" },
      ]}
      secondaryAction={{ label: "Sign in", href: "#" }}
      primaryAction={{ label: "Get started", href: "#" }}
    />
  ),
  "hero-split": () => (
    <HeroSplit
      eyebrow="v2.0 · Now with preview environments"
      title="Deploy the moment you push"
      description="Every branch gets a live URL, every merge ships to production. No YAML, no waiting on CI queues."
      primaryAction={{ label: "Start deploying", href: "#" }}
      secondaryAction={{ label: "Read the docs", href: "#" }}
      bullets={["Free for hobby projects", "Global edge network", "Rollback in one click"]}
    />
  ),
  "logo-cloud": () => (
    <div className="divide-y">
      <LogoCloud logos={LOGOS} />
      <LogoCloud heading="Marquee variant" variant="marquee" logos={LOGOS} />
    </div>
  ),
  "feature-list": () => (
    <FeatureList
      eyebrow="Platform"
      heading="Everything between git push and production"
      subheading="Opinionated defaults, escape hatches everywhere."
      features={[
        {
          title: "Preview URLs",
          description: "Every pull request gets its own deployment and a comment with the link.",
          icon: <GitBranch />,
        },
        { title: "Edge functions", description: "Run code in 30+ regions with cold starts under 50ms.", icon: <Zap /> },
        { title: "Secrets", description: "Encrypted env vars scoped per environment and branch.", icon: <KeyRound /> },
        {
          title: "Observability",
          description: "Logs, traces and Web Vitals without a third-party agent.",
          icon: <Gauge />,
        },
        { title: "Workflows", description: "Cron jobs and queues defined next to your code.", icon: <Workflow /> },
        {
          title: "SSO & audit",
          description: "SAML, SCIM and a tamper-proof audit log on Enterprise.",
          icon: <ShieldCheck />,
        },
      ]}
    />
  ),
  "stats-row": () => (
    <StatsRow
      heading="Built for scale from day one"
      stats={[
        { value: "99.99%", label: "Uptime", description: "Rolling 12-month SLA" },
        { value: "2.4B", label: "Requests / day", description: "Across 30 regions" },
        { value: "<50ms", label: "Cold start", description: "p95, edge runtime" },
        { value: "40k", label: "Teams", description: "From side projects to IPOs" },
      ]}
    />
  ),
  "testimonials-grid": () => (
    <TestimonialsGrid
      heading="Loved by teams who ship daily"
      testimonials={[
        {
          quote: "We went from weekly releases to forty deploys a day without hiring a platform team.",
          name: "Maya Chen",
          role: "CTO, Northwind",
          featured: true,
        },
        {
          quote: "Preview URLs changed how design reviews work. Nobody screenshots anymore.",
          name: "Daniel Ortiz",
          role: "Design Lead, Globex",
        },
        {
          quote: "Rollbacks are boring now. That is the highest compliment I can give infra.",
          name: "Priya Raman",
          role: "SRE, Initech",
        },
        { quote: "Moved 40 services over a weekend.", name: "Tom Becker", role: "Founder, Hooli" },
        {
          quote: "The audit log alone got us through SOC 2 two months early.",
          name: "Sara Lindqvist",
          role: "Security, Umbrella",
        },
      ]}
    />
  ),
  faq: () => (
    <Faq
      subheading="Still stuck? Our team answers in under an hour."
      defaultOpen={0}
      items={[
        {
          question: "Can I bring my own domain?",
          answer: "Yes. Add it in project settings; we provision TLS automatically within a minute.",
        },
        {
          question: "What happens if I exceed my plan?",
          answer: "Nothing breaks. We email you and bill overages at the published rate, capped by your spend limit.",
        },
        {
          question: "Do you support monorepos?",
          answer: "Turborepo, Nx and pnpm workspaces are detected automatically; each app deploys independently.",
        },
        {
          question: "Where is my data stored?",
          answer: "In the region you choose at project creation. EU-only processing is available on every plan.",
        },
      ]}
    />
  ),
  "cta-banner": () => (
    <div className="flex flex-col">
      <CtaBanner
        title="Ship your next idea tonight"
        description="Free for personal projects. Upgrade when your team grows."
        primaryAction={{ label: "Start deploying", href: "#" }}
        secondaryAction={{ label: "Talk to sales", href: "#" }}
        className="pb-4"
      />
      <CtaBanner
        variant="card"
        title="Card variant, for quieter pages"
        description="Same API — a bordered card with a primary glow."
        primaryAction={{ label: "Get started", href: "#" }}
        className="pt-4"
      />
    </div>
  ),
  "footer-columns": () => (
    <FooterColumns
      brand={{ name: "Acme", logo: <Boxes />, description: "The deployment platform for teams who ship every day." }}
      columns={[
        {
          title: "Product",
          links: [
            { label: "Deployments", href: "#" },
            { label: "Edge functions", href: "#" },
            { label: "Pricing", href: "#" },
          ],
        },
        {
          title: "Company",
          links: [
            { label: "About", href: "#" },
            { label: "Careers", href: "#" },
            { label: "Blog", href: "#" },
          ],
        },
        {
          title: "Resources",
          links: [
            { label: "Docs", href: "#" },
            { label: "Guides", href: "#" },
            { label: "Status", href: "#" },
          ],
        },
        {
          title: "Legal",
          links: [
            { label: "Privacy", href: "#" },
            { label: "Terms", href: "#" },
            { label: "DPA", href: "#" },
          ],
        },
      ]}
      legal={[
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
      ]}
      socials={[{ label: "RSS", href: "#", icon: <Rss /> }]}
      copyright="© 2026 Acme Inc."
    />
  ),

  /* ---------------------------------------------------------------- app */
  "app-shell": () => (
    <AppFrame height="34rem">
      <AppShell
        brand={{ name: "Acme", subtitle: "Pro workspace", logo: <Boxes /> }}
        nav={[
          {
            items: [
              { title: "Dashboard", href: "#", icon: <LayoutDashboard />, active: true },
              { title: "Inbox", href: "#", icon: <Inbox />, badge: 4 },
              { title: "Projects", href: "#", icon: <FolderOpen /> },
              { title: "Team", href: "#", icon: <Users /> },
            ],
          },
          { label: "Workspace", items: [{ title: "Settings", href: "#", icon: <Settings /> }] },
        ]}
        user={{ name: "Maya Chen", email: "maya@acme.com" }}
        breadcrumbs={[{ label: "Acme", href: "#" }, { label: "Dashboard" }]}
        headerActions={
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell />
          </Button>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="aspect-video rounded-xl border border-dashed bg-muted/40" />
          ))}
        </div>
        <div className="min-h-64 flex-1 rounded-xl border border-dashed bg-muted/40" />
      </AppShell>
    </AppFrame>
  ),
  "stat-cards": () => (
    <div className="p-6">
      <StatCards
        stats={[
          {
            label: "Revenue",
            value: "$48,210",
            delta: 12.4,
            deltaLabel: "vs. last month",
            trend: [31, 33, 32, 36, 38, 37, 41, 44, 46, 48],
          },
          {
            label: "Active users",
            value: "8,904",
            delta: 3.2,
            deltaLabel: "vs. last month",
            trend: [70, 72, 75, 74, 78, 80, 83, 85, 87, 89],
          },
          {
            label: "Churn",
            value: "2.1%",
            delta: -0.6,
            invertDelta: true,
            deltaLabel: "lower is better",
            trend: [3, 2.9, 2.7, 2.8, 2.5, 2.4, 2.3, 2.3, 2.2, 2.1],
          },
          {
            label: "p95 latency",
            value: "182ms",
            delta: 18.5,
            invertDelta: true,
            deltaLabel: "vs. last week",
            trend: [140, 150, 148, 155, 160, 158, 170, 175, 179, 182],
          },
        ]}
      />
    </div>
  ),
  "data-table-card": () => (
    <div className="p-6">
      <DataTableCard
        title="Deployments"
        description="Latest builds across all projects."
        rows={DEPLOYS}
        rowKey="id"
        columns={[
          { key: "project", header: "Project", sortable: true, className: "font-medium" },
          { key: "env", header: "Environment", badge: { Production: "default", Preview: "outline" } },
          {
            key: "status",
            header: "Status",
            badge: { Ready: "secondary", Building: "outline", Error: "destructive", Canceled: "outline" },
          },
          { key: "branch", header: "Branch", className: "font-mono text-xs text-muted-foreground" },
          { key: "age", header: "Created", align: "right" },
        ]}
        searchKeys={["project", "branch"]}
        filter={{ key: "status", label: "Status" }}
        actions={
          <Button>
            <Plus data-icon="inline-start" />
            Deploy
          </Button>
        }
        pageSize={5}
      />
    </div>
  ),
  "empty-state": () => (
    <div className="grid gap-6 p-6 md:grid-cols-2">
      <EmptyState
        icon={<FolderOpen />}
        title="No projects yet"
        description="Import a Git repository or start from a template. It takes about a minute."
        primaryAction={{ label: "New project", href: "#", icon: <Plus /> }}
        secondaryAction={{ label: "Import", href: "#", icon: <Upload /> }}
        help={{ label: "Read the quickstart →", href: "#" }}
      />
      <EmptyState
        variant="plain"
        icon={<Lock />}
        title="You don't have access"
        description="Ask a workspace admin to invite you to this project."
        primaryAction={{ label: "Request access", href: "#" }}
        className="rounded-xl border bg-card"
      />
    </div>
  ),
  "settings-form": () => (
    <div className="p-6 md:p-10">
      <SettingsForm
        defaultValues={{
          name: "Maya Chen",
          email: "maya@acme.com",
          username: "maya",
          bio: "Head of Product at Acme. Previously design at Northwind.",
          timezone: "Europe/Berlin",
        }}
      />
    </div>
  ),

  /* ---------------------------------------------------------------- AI */
  "chat-thread": () => (
    <ChatThread
      messages={[
        { id: "1", role: "user", content: "Which of our landing pages has the worst conversion this month?" },
        {
          id: "2",
          role: "assistant",
          toolCalls: [
            { name: "analytics.query", status: "done", detail: "sessions → signups · 30d" },
            { name: "pages.list", status: "done", detail: "14 pages" },
          ],
          content: [
            "**/pricing** converts worst at **1.8%** (site average 4.1%). Two likely causes:",
            "- The plan table hides the free tier below the fold on mobile.\n- 38% of visitors open the FAQ, but the `Enterprise` question has no answer.",
            "```sql\n" + PRICING_SQL + "\n```",
          ].join("\n\n"),
        },
        { id: "3", role: "user", content: "Draft a fix for the mobile plan table." },
      ]}
      pending={{ activity: "writing", detail: "pricing-table.tsx" }}
    />
  ),
  "prompt-composer": () => (
    <div className="flex flex-col gap-10 px-6 py-10">
      <PromptComposer
        suggestions={["Summarise this week's feedback", "Draft release notes", "Find churn reasons"]}
        footnote="AI can make mistakes. Check important info."
      />
      <PromptComposer busy placeholder="Generating…" />
      <p className="mx-auto flex w-full max-w-3xl items-center gap-2 text-sm text-muted-foreground">
        <Bot className="size-4" /> Pairs with @oc/chat-thread and @oc/agent-status.
      </p>
    </div>
  ),
}
