import { z } from "zod"

import { MOOD_NAMES, type Mood as MoodName } from "./moods"

/**
 * Canonical category taxonomy. Names follow component.gallery where one exists,
 * plus marketing-section and AI-UI categories. Keep in sync with catalog/categories.md.
 */
export const CATEGORIES = [
  // page sections
  "hero",
  "navigation",
  "features",
  "bento",
  "pricing",
  "cta",
  "testimonials",
  "logo-cloud",
  "faq",
  "footer",
  "blog",
  "contact",
  "auth",
  "team",
  "stats",
  "empty-state",
  // components
  "card",
  "button",
  "input",
  "form",
  "tabs",
  "modal",
  "tooltip",
  "sidebar",
  "carousel",
  "image",
  "table",
  "dashboard",
  "chart",
  "graph",
  "code",
  "map",
  "badge",
  "accordion",
  "toast",
  // effects & motion
  "background",
  "text-effect",
  "scroll-effect",
  "cursor",
  "loader",
  "transition",
  "3d",
  "illustration",
  // AI / agent UI
  "ai-chat",
  "agent-ui",
  // foundations & tooling
  "theme",
  "dev-tool",
  "misc",
] as const

export const Category = z.enum(CATEGORIES)
export type Category = z.infer<typeof Category>

/**
 * free    — no account needed
 * key     — free, but needs an account / API key (rate limited)
 * metered — free account with a daily copy limit, paid tier for more
 * paid    — needs a paid plan; suggest as an upgrade only
 */
export const Access = z.enum(["free", "key", "metered", "paid"])
export type Access = z.infer<typeof Access>

export const Mood = z.enum(MOOD_NAMES as [MoodName, ...MoodName[]])
export type Mood = z.infer<typeof Mood>

/**
 * How an entry is used against an existing UI:
 *   drop-in — a whole component that replaces yours (Aceternity carousel, @oc/pricing-simple)
 *   wrapper — wraps your existing element and adds behaviour (blur-fade, in-view, border-beam)
 *   recipe  — a technique/CSS you apply to your own markup (transitions.dev)
 */
export const Integration = z.enum(["drop-in", "wrapper", "recipe"])
export type Integration = z.infer<typeof Integration>

export const MotionTrigger = z.enum(["hover", "press", "enter", "scroll", "loop", "drag", "state", "cursor"])
export type MotionTrigger = z.infer<typeof MotionTrigger>
export const MotionIntensity = z.enum(["subtle", "medium", "expressive"])
export type MotionIntensity = z.infer<typeof MotionIntensity>
export const MotionTechnique = z.enum(["css", "motion", "gsap", "webgl", "canvas", "svg", "js"])
export type MotionTechnique = z.infer<typeof MotionTechnique>

/** Motion profile — answers "I want this to animate (on scroll, subtly)". Absent = static. */
export const Motion = z.object({
  /** What starts it. `state` = data/UI state change (loading → success, tab switch). */
  triggers: z.array(MotionTrigger).min(1),
  intensity: MotionIntensity,
  technique: z.array(MotionTechnique).min(1),
  /** Runtime/bundle cost: low = CSS/transform only; high = WebGL/canvas/large deps. */
  cost: z.enum(["low", "medium", "high"]),
  /** Honors prefers-reduced-motion (true/false), or unknown (absent). */
  reducedMotion: z.boolean().optional(),
})
export type Motion = z.infer<typeof Motion>

export const Kind = z.enum([
  "component", // single UI piece
  "block", // composed page section
  "effect", // background / text / cursor effect
  "transition", // CSS/JS micro-interaction recipe
  "theme", // tokens / design system
  "template", // whole starter page composed from blocks
  "inspiration", // a website/app Owen likes — reference for feel + patterns, not installable
  "package", // npm package with its own API
  "tool", // dev tooling (Agentation etc.)
])
export type Kind = z.infer<typeof Kind>

export const CatalogEntry = z.object({
  /** `<source>/<name>` — globally unique, stable. */
  id: z.string().regex(/^[a-z0-9-]+\/[a-z0-9-]+$/),
  source: z.string(),
  name: z.string(),
  title: z.string(),
  description: z.string().default(""),
  kind: Kind,
  categories: z.array(Category).min(1),
  tags: z.array(z.string()).default([]),
  /** The feeling it gives (see lib/catalog/moods.ts). Curated values win; otherwise inferred. */
  moods: z.array(Mood).max(3).default([]),
  access: Access,
  /** Exact command to add it to a consuming project. */
  install: z.string(),
  docs: z.string().url().optional(),
  preview: z.string().url().optional(),
  /** Short looping preview video (mp4) — shows how it MOVES; galleries play it on hover. */
  video: z.string().url().optional(),
  dependencies: z.array(z.string()).default([]),
  /** Hand-picked by us — ranked first by find-component. */
  curated: z.boolean().default(false),
  /** In catalog/favorites.json — Owen explicitly loves it. Strongest taste signal; ranked first. */
  favorite: z.boolean().default(false),
  /** Our opinion: when to use it, gotchas, pairing advice. */
  notes: z.string().optional(),
  /** Uses shadcn CSS variables (bg-background, text-muted-foreground…) so it follows the installed theme. */
  themeAware: z.boolean().optional(),
  /** Has a live preview in the gallery app. */
  demo: z.boolean().default(false),
  /** How it's applied to an existing UI (see Integration). */
  integration: Integration.optional(),
  /** Component types it can be applied to / upgrades (for wrappers and recipes: what you'd use it on). */
  appliesTo: z.array(Category).default([]),
  motion: Motion.optional(),
  /** Interactive live preview to click before choosing (upstream demo page, live-preview, shadcn view…). */
  live: z.string().url().optional(),
})
export type CatalogEntry = z.infer<typeof CatalogEntry>

/** Curated overrides: anything but id is optional and merged over the synced entry. */
export const CuratedEntry = CatalogEntry.partial().extend({ id: CatalogEntry.shape.id })
export type CuratedEntry = z.infer<typeof CuratedEntry>

export const Favorite = z.object({ id: CatalogEntry.shape.id, note: z.string(), added: z.string() })
export type Favorite = z.infer<typeof Favorite>

export const SourceMeta = z.object({
  slug: z.string(),
  name: z.string(),
  url: z.string().url(),
  summary: z.string(),
  type: z.enum(["registry", "npm", "cli", "skill", "reference", "tool", "marketplace"]),
  access: Access,
  license: z.string(),
  stack: z.array(z.string()).default([]),
  /** How code gets into a project. */
  install: z.string(),
  /** shadcn namespace if the source exposes a registry, e.g. "@aceternity". */
  namespace: z.string().optional(),
  mcp: z.string().optional(),
  llms: z.string().optional(),
  /** May we copy its source into this repo / @oc registry? */
  vendorable: z.boolean(),
})
export type SourceMeta = z.infer<typeof SourceMeta>

/** Front matter of inspiration/<slug>/README.md — a website/app Owen likes. */
export const Inspiration = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  url: z.string().url(),
  /** What it is: marketing site, product UI, portfolio, docs… */
  type: z.enum(["website", "product", "portfolio", "docs", "ecommerce", "other"]).default("website"),
  summary: z.string(),
  /** What Owen likes about it — the reason it's here. */
  likes: z.string().optional(),
  moods: z.array(Mood).min(1).max(3),
  /** Patterns worth taking from it (catalog categories). */
  categories: z.array(Category).min(1),
  tags: z.array(z.string()).default([]),
  /** Catalog ids that reproduce its patterns (existing or @oc recreations). */
  related: z.array(z.string()).default([]),
  added: z.string(),
})
export type Inspiration = z.infer<typeof Inspiration>

/**
 * catalog/references.json — inspiration GALLERIES (navbar.gallery, land-book, landing.love…): where to look when an
 * agent needs ideas for one pattern. Not installable; `find_references` / `referencesFor()` turn a pattern into
 * concrete browse URLs. URL templates may contain `{value}` (one of the facet's `values`) or `{slug}` (one site).
 */
export const ReferenceFacet = z.object({
  /** e.g. "type", "style", "section", "category". */
  key: z.string().regex(/^[a-z0-9-]+$/),
  label: z.string(),
  /** Absolute URL, with `{value}` when the facet has values. */
  url: z.string(),
  /** Allowed `{value}` substitutions — only values verified to return 200. */
  values: z.array(z.string().regex(/^[a-z0-9_-]+$/)).default([]),
  /** Query word / catalog category / mood → value, when the names differ ("logo-cloud" → "brands"). */
  map: z.record(z.string(), z.string()).default({}),
  /** Words / categories that select this (valueless) facet, e.g. land-book /motion ← "animated", "scroll". */
  match: z.array(z.string()).default([]),
})
export type ReferenceFacet = z.infer<typeof ReferenceFacet>

export const Reference = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  url: z.string().url(),
  summary: z.string(),
  /** Catalog categories it is a good place to look for — strongest first. */
  covers: z.array(Category).min(1),
  /** Pattern words beyond categories it answers ("mega menu", "animated", "mobile flow", "hover"). */
  keywords: z.array(z.string()).default([]),
  /** Browse URLs by facet. */
  patterns: z.array(ReferenceFacet).default([]),
  /** One entry's page (and video), e.g. landing.love `/sites/{slug}/` + `cdn.landing.love/videos/{slug}.mp4`. */
  item: z.object({ page: z.string(), video: z.string().optional(), example: z.string() }).optional(),
  /** Feelings its collection skews toward. */
  moods: z.array(Mood).min(1).max(3),
  access: Access,
  /** What you get to look at. */
  media: z.array(z.enum(["screenshots", "full-page", "cropped-sections", "video", "live-links", "prompts", "flows", "code-examples"])).min(1),
  /** Machine-readable surfaces (only ones verified to exist). */
  machine: z
    .object({
      llms: z.string().url().optional(),
      sitemap: z.string().url().optional(),
      rss: z.string().url().optional(),
      api: z.string().url().optional(),
      mcp: z.string().url().optional(),
      /** catalog/toolchain.json id that wires its MCP into projects. */
      toolchain: z.string().optional(),
    })
    .default({}),
  etiquette: z.object({
    /** How to credit when citing it. */
    attribution: z.string(),
    /** Crawling / robots / rate rules. */
    crawl: z.string(),
    /** Don't embed their images directly, etc. */
    hotlinking: z.string().optional(),
  }),
  notes: z.string().optional(),
  /** Inspiration entries (catalog ids) captured from this gallery. */
  related: z.array(z.string()).default([]),
  /** Date the URL patterns were last checked with curl (browser UA). */
  verified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})
export type Reference = z.infer<typeof Reference>

/** catalog/dislikes.json — what Owen passed on, and why. Penalises matching entries in ranking. */
export const Dislike = z
  .object({
    /** A specific entry… */
    id: CatalogEntry.shape.id.optional(),
    /** …or a pattern: any entry whose id/title/tags/notes contain this word (e.g. "glow", "parallax"). */
    pattern: z.string().optional(),
    reason: z.string(),
    added: z.string(),
  })
  .refine((d) => d.id || d.pattern, "dislike needs an id or a pattern")
export type Dislike = z.infer<typeof Dislike>

/**
 * catalog/playbooks/<component>.md front matter — the curated menu of directions for upgrading one
 * component type ("animate my button", "make my carousel nicer"). `propose_options` serves these.
 */
export const PlaybookDirection = z.object({
  /** Short slug, unique within the playbook. */
  key: z.string().regex(/^[a-z0-9-]+$/),
  label: z.string(),
  /** What the user sees/feels. */
  feel: z.string(),
  /** When this direction is the right call. */
  when: z.string(),
  /** When to avoid it. */
  avoid: z.string().optional(),
  intent: z.array(z.enum(["animate", "restyle", "replace", "add-state", "polish"])).min(1),
  intensity: MotionIntensity.optional(),
  moods: z.array(Mood).default([]),
  /** Catalog ids, best first. */
  picks: z.array(CatalogEntry.shape.id).min(1),
})
export type PlaybookDirection = z.infer<typeof PlaybookDirection>

export const Playbook = z.object({
  component: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  /** Catalog categories this playbook covers (used to route a component to it). */
  categories: z.array(Category).min(1),
  /** Words that identify the component in a request ("cta", "submit" → button). */
  aliases: z.array(z.string()).default([]),
  directions: z.array(PlaybookDirection).min(3),
})
export type Playbook = z.infer<typeof Playbook>

/**
 * catalog/toolchain.json — every CLI, MCP server, agent skill, registry, package and key a project needs,
 * ranked by tier. `scripts/bootstrap.ts` (served as /bootstrap.mjs) applies it to a new repo.
 *
 * Tiers: 1 foundation (always) · 2 default libraries (configured by default) · 3 situational (on request /
 * `--tier 3`) · 4 paid, metered or keyed (only when its key/licence is present).
 */
export const ToolStep = z.discriminatedUnion("kind", [
  /** Merge into components.json → registries (URL may contain ${ENV} placeholders shadcn expands). */
  z.object({ kind: z.literal("registry"), namespace: z.string(), url: z.string(), headers: z.record(z.string(), z.string()).optional(), params: z.record(z.string(), z.string()).optional() }),
  /** Add npm packages (dev: devDependencies). */
  z.object({ kind: z.literal("npm"), packages: z.array(z.string()).min(1), dev: z.boolean().optional() }),
  /** shadcn items to install, e.g. @oc/motion-presets. */
  z.object({ kind: z.literal("shadcn"), items: z.array(z.string()).min(1), overwrite: z.boolean().optional() }),
  /** Project-scoped MCP server → .mcp.json (keyless servers only — keyed ones use mcp-user). */
  z.object({ kind: z.literal("mcp"), name: z.string(), config: z.record(z.string(), z.unknown()) }),
  /** User-scoped MCP server needing a secret: `claude mcp add -s user …` with the key from the secrets file. */
  z.object({ kind: z.literal("mcp-user"), name: z.string(), command: z.string(), env: z.array(z.string()).default([]) }),
  /** Shell command run in the project (agent skills, CLI inits). `interactive` = print for the human instead. */
  z.object({ kind: z.literal("run"), command: z.string(), interactive: z.boolean().optional(), note: z.string().optional() }),
  /** Instructions appended to the project's CLAUDE.md / AGENTS.md "## Design" section. */
  z.object({ kind: z.literal("agent-note"), text: z.string() }),
])
export type ToolStep = z.infer<typeof ToolStep>

export const Tool = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  tier: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  /** Rank within the whole toolchain (1 = most important). */
  rank: z.number().int().positive(),
  track: z.enum(["foundation", "components", "motion", "agent", "dev-tool", "paid"]),
  /** Catalog source slug, when it maps to one. */
  source: z.string().optional(),
  /** Why it's ranked here. */
  why: z.string(),
  /** When an agent should reach for it. */
  use: z.string(),
  /** Secrets it needs. Read from ~/.config/design-infra/secrets.env; never written to the repo. */
  secrets: z
    .array(z.object({ env: z.string(), get: z.string().url(), note: z.string().optional(), required: z.boolean().default(true) }))
    .default([]),
  setup: z.array(ToolStep).default([]),
  /** Cheap command that proves it works. */
  verify: z.string().optional(),
  docs: z.string().url().optional(),
})
export type Tool = z.infer<typeof Tool>
