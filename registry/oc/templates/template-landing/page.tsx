import { BarChart3, Inbox, Layers, Mail, MessageSquareText, Rss, Sparkles, Tags } from "lucide-react"

import { CtaBanner } from "@/components/cta-banner"
import { Faq } from "@/components/faq"
import { FeatureBento } from "@/components/feature-bento"
import { FooterColumns } from "@/components/footer-columns"
import { HeroSplit } from "@/components/hero-split"
import { LogoCloud } from "@/components/logo-cloud"
import { Navbar } from "@/components/navbar"
import { PricingSimple } from "@/components/pricing-simple"
import { StatsRow } from "@/components/stats-row"
import { TestimonialsGrid } from "@/components/testimonials-grid"

/*
 * @oc/template-landing — a complete SaaS marketing page composed from @oc blocks.
 * Every colour/font comes from the installed theme (npx shadcn add @oc/theme-<slug>).
 * Replace the copy below; keep the section order unless DESIGN.md says otherwise.
 */

const BRAND = "Relay"

function Mark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="var(--primary)" />
      <path
        d="M8 16V8h5a3 3 0 0 1 0 6h-5m5 0 3 2"
        stroke="var(--primary-foreground)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* Small token-only illustrations for the bento tiles — replace with product screenshots. */

const chip = "rounded-md border bg-background px-2 py-1 text-xs text-muted-foreground"
const chipOn = "rounded-md border border-primary bg-primary px-2 py-1 text-xs text-primary-foreground"

function InboxVisual() {
  const rows = [
    { tag: "Bug", text: "Export to CSV drops the last row", votes: 42, from: "Intercom" },
    { tag: "Request", text: "Slack thread → ticket in one click", votes: 31, from: "Slack" },
  ]
  return (
    <div className="flex h-full flex-col justify-center gap-2 text-xs">
      {rows.map((r, i) => (
        <div key={r.text} className="flex items-center gap-2 rounded-md border bg-background px-2.5 py-2">
          <span className={i === 0 ? chipOn : chip}>{r.tag}</span>
          <span className="min-w-0 flex-1 truncate text-foreground">{r.text}</span>
          <span className="hidden text-muted-foreground sm:inline">{r.from}</span>
          <span className="text-muted-foreground tabular-nums">▲ {r.votes}</span>
        </div>
      ))}
    </div>
  )
}

function ThemesVisual() {
  const themes = [
    ["Invite emails land in spam", 64],
    ["Slack integration hard to find", 47],
    ["CSV importer rejects BOM", 41],
    ["Dark mode for the inbox", 23],
    ["Bulk-edit tags", 17],
  ] as const
  return (
    <ul className="flex h-full flex-col justify-center gap-3 text-xs">
      {themes.map(([name, n], i) => (
        <li key={name} className="flex flex-col gap-1.5">
          <div className="flex justify-between gap-2">
            <span className="truncate text-foreground">{name}</span>
            <span className="text-muted-foreground tabular-nums">{n}</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted">
            <div
              className={i === 0 ? "h-full rounded-full bg-primary" : "h-full rounded-full bg-foreground/25"}
              style={{ width: `${(n / 64) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

function TagsVisual() {
  return (
    <div className="flex h-full flex-wrap content-center gap-1.5">
      {["Bug", "Request", "Praise", "Billing", "Onboarding", "Mobile", "API"].map((t, i) => (
        <span key={t} className={i === 1 ? chipOn : chip}>
          {t}
        </span>
      ))}
    </div>
  )
}

function ImpactVisual() {
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      <p className="font-heading text-3xl font-headline tracking-tight tabular-nums text-foreground">$412k</p>
      <p className="text-xs text-muted-foreground">ARR asking for “SSO for Starter”</p>
    </div>
  )
}

function LoopVisual() {
  return (
    <div className="flex h-full items-center">
      <div className="flex w-full max-w-md items-center gap-3 rounded-lg border bg-background p-3 text-xs shadow-sm">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <MessageSquareText className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-foreground">Shipped: CSV export keeps every row</p>
          <p className="text-muted-foreground">42 requesters notified · 2m ago</p>
        </div>
      </div>
    </div>
  )
}

function IntegrationsVisual() {
  return (
    <div className="grid h-full grid-cols-6 content-center gap-2">
      {["Li", "Ji", "Gh", "Hs", "Sl", "+"].map((s) => (
        <span
          key={s}
          className="flex aspect-square items-center justify-center rounded-md border bg-background font-mono text-xs text-muted-foreground"
        >
          {s}
        </span>
      ))}
    </div>
  )
}

export default function Page() {
  return (
    <div className="flex flex-col bg-background text-foreground">
      <Navbar
        brand={{ name: BRAND, logo: <Mark /> }}
        links={[
          { label: "Product", href: "#features" },
          { label: "Customers", href: "#customers" },
          { label: "Pricing", href: "#pricing" },
          { label: "FAQ", href: "#faq" },
        ]}
        secondaryAction={{ label: "Sign in", href: "#" }}
        primaryAction={{ label: "Start free", href: "#pricing" }}
      />

      <main className="flex-1">
        <HeroSplit
          eyebrow="New · AI triage for every channel"
          title="Every piece of customer feedback, sorted before standup"
          description={`${BRAND} pulls feedback from Slack, email, Intercom and app reviews, then groups it into themes your team can actually ship against.`}
          primaryAction={{ label: "Start free", href: "#pricing" }}
          secondaryAction={{ label: "Book a demo", href: "#" }}
          bullets={["Free for small teams", "Set up in 5 minutes", "SOC 2 Type II"]}
        />

        <LogoCloud
          heading="Product teams at 2,000+ companies listen with Relay"
          variant="marquee"
          logos={["Northwind", "Globex", "Initech", "Umbrella", "Hooli", "Stark & Co", "Wayne Labs", "Acme"].map(
            (name) => ({ name })
          )}
        />

        <div id="features">
          <FeatureBento
            heading="From noise to roadmap in one inbox"
            subheading="Stop copy-pasting quotes into spreadsheets. Relay does the sorting so you can do the deciding."
            features={[
              {
                title: "Unified inbox",
                description: "Slack, email, Intercom, Zendesk and app-store reviews in one stream.",
                icon: <Inbox />,
                span: "2",
                visual: <InboxVisual />,
              },
              {
                title: "AI themes",
                description: "Similar requests cluster automatically, with a summary.",
                icon: <Sparkles />,
                span: "row",
                visual: <ThemesVisual />,
              },
              {
                title: "Auto-tagging",
                description: "Bug, request, praise — tagged on arrival.",
                icon: <Tags />,
                visual: <TagsVisual />,
              },
              {
                title: "Impact scores",
                description: "Weight feedback by revenue and plan.",
                icon: <BarChart3 />,
                visual: <ImpactVisual />,
              },
              {
                title: "Close the loop",
                description: "Notify every requester when you ship — automatically.",
                icon: <MessageSquareText />,
                span: "2",
                visual: <LoopVisual />,
              },
              {
                title: "Integrations",
                description: "Linear, Jira, GitHub, HubSpot.",
                icon: <Layers />,
                visual: <IntegrationsVisual />,
              },
            ]}
          />
        </div>

        <StatsRow
          stats={[
            { value: "11h", label: "saved per PM, per week" },
            { value: "3.2×", label: "more feedback captured" },
            { value: "92%", label: "auto-tag accuracy" },
            { value: "<5 min", label: "to first insight" },
          ]}
        />

        <div id="customers">
          <TestimonialsGrid
            heading="Teams ship what customers actually asked for"
            subheading="Don't take our word for it."
            testimonials={[
              {
                quote:
                  "We replaced three tools and a weekly spreadsheet ritual. Our roadmap reviews now start with evidence instead of opinions.",
                name: "Maya Chen",
                role: "Head of Product, Northwind",
                featured: true,
              },
              {
                quote: "The AI themes are scarily good. It found a churn driver we'd been missing for two quarters.",
                name: "Daniel Ortiz",
                role: "PM, Globex",
              },
              {
                quote: "Closing the loop used to be a promise. Now it just happens.",
                name: "Priya Raman",
                role: "Customer Success, Initech",
              },
              {
                quote: "Setup took one coffee. Slack and Intercom were flowing in before it cooled down.",
                name: "Tom Becker",
                role: "Founder, Hooli",
              },
              {
                quote:
                  "Impact scores changed how we prioritise. Enterprise asks no longer drown out everyone else — or vice versa.",
                name: "Sara Lindqvist",
                role: "VP Product, Umbrella",
              },
              {
                quote: "Finally a feedback tool engineers open voluntarily.",
                name: "Kenji Watanabe",
                role: "Staff Engineer, Wayne Labs",
              },
            ]}
          />
        </div>

        <div id="pricing">
          <PricingSimple
            heading="Simple, per-team pricing"
            subheading="Start free. Upgrade when feedback starts paying for itself."
            tiers={[
              {
                name: "Starter",
                description: "For small teams getting organised.",
                monthly: 0,
                features: ["Up to 3 seats", "2 sources", "500 items / month", "Community support"],
                cta: { label: "Start free", href: "#" },
              },
              {
                name: "Team",
                description: "For product teams that live in feedback.",
                monthly: 49,
                features: ["Unlimited seats", "All sources", "AI themes & impact scores", "Linear / Jira sync"],
                cta: { label: "Start 14-day trial", href: "#" },
                featured: true,
              },
              {
                name: "Enterprise",
                description: "Security, scale and support.",
                monthly: null,
                features: ["SSO & SCIM", "Audit log", "Custom data retention", "Dedicated CSM"],
                cta: { label: "Talk to sales", href: "#" },
              },
            ]}
          />
        </div>

        <div id="faq">
          <Faq
            subheading="Can't find an answer? Email support@relay.dev — a human replies within a day."
            defaultOpen={0}
            items={[
              {
                question: "Which channels can Relay pull feedback from?",
                answer:
                  "Slack, email, Intercom, Zendesk, HubSpot, App Store and Google Play reviews, plus a public API and a browser extension for everything else.",
              },
              {
                question: "How does the AI grouping work?",
                answer:
                  "Each item is embedded and clustered with similar requests; a model writes a one-line theme summary. You can merge, split or rename themes and Relay learns from it.",
              },
              {
                question: "Is our data used to train models?",
                answer: "No. Your data is never used for training, and Enterprise plans can pin processing to the EU.",
              },
              {
                question: "Can I try it before paying?",
                answer: "Yes — Starter is free forever, and Team comes with a 14-day trial, no card required.",
              },
              {
                question: "Do you offer discounts for startups or non-profits?",
                answer: "50% off Team for the first year for companies under $1M ARR and registered non-profits.",
              },
            ]}
          />
        </div>

        <CtaBanner
          title="Hear every customer. Ship the right thing."
          description="Connect your first source in under five minutes. Free for small teams."
          primaryAction={{ label: "Start free", href: "#pricing" }}
          secondaryAction={{ label: "Book a demo", href: "#" }}
        />
      </main>

      <FooterColumns
        brand={{
          name: BRAND,
          logo: <Mark />,
          description: "The feedback inbox for product teams. Made with care in Lisbon and Toronto.",
        }}
        columns={[
          {
            title: "Product",
            links: [
              { label: "Inbox", href: "#" },
              { label: "AI themes", href: "#" },
              { label: "Integrations", href: "#" },
              { label: "Changelog", href: "#" },
            ],
          },
          {
            title: "Company",
            links: [
              { label: "About", href: "#" },
              { label: "Customers", href: "#" },
              { label: "Careers", href: "#" },
              { label: "Blog", href: "#" },
            ],
          },
          {
            title: "Resources",
            links: [
              { label: "Docs", href: "#" },
              { label: "API", href: "#" },
              { label: "Guides", href: "#" },
              { label: "Status", href: "#" },
            ],
          },
          {
            title: "Get in touch",
            links: [
              { label: "Contact sales", href: "#" },
              { label: "Support", href: "#" },
              { label: "Community", href: "#" },
            ],
          },
        ]}
        legal={[
          { label: "Privacy", href: "#" },
          { label: "Terms", href: "#" },
        ]}
        socials={[
          { label: "Changelog RSS", href: "#", icon: <Rss /> },
          { label: "Newsletter", href: "#", icon: <Mail /> },
        ]}
      />
    </div>
  )
}
