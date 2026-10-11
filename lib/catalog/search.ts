import { categoryGallery, entryPage } from "@/lib/catalog/links"
import { type Mood, moodsFromText } from "@/lib/catalog/moods"
import type {
  Access,
  CatalogEntry,
  Category,
  Integration,
  Kind,
  Motion,
  MotionIntensity,
  MotionTrigger,
} from "@/lib/catalog/schema"

/**
 * Catalog ranking shared by the gallery API, the hosted MCP server and (via the API) skills.
 * Mirrors the picking order in catalog/categories.md: @oc → curated → theme-aware → free.
 */

/** Words people use → our categories. Lets "navbar", "landing", "spinner" etc. hit the right shelf. */
export const SYNONYMS: Record<string, Category[]> = {
  nav: ["navigation"],
  navbar: ["navigation"],
  header: ["navigation"],
  menu: ["navigation"],
  dock: ["navigation"],
  landing: ["hero", "features", "cta"],
  banner: ["cta", "hero"],
  plans: ["pricing"],
  tiers: ["pricing"],
  feature: ["features"],
  testimonial: ["testimonials"],
  reviews: ["testimonials"],
  quotes: ["testimonials"],
  logos: ["logo-cloud"],
  customers: ["logo-cloud", "testimonials"],
  questions: ["faq"],
  signin: ["auth"],
  login: ["auth"],
  signup: ["auth"],
  kpi: ["stats", "dashboard"],
  metrics: ["stats", "dashboard", "chart"],
  graph: ["chart"],
  grid: ["bento", "background"],
  spinner: ["loader"],
  loading: ["loader"],
  thinking: ["loader", "agent-ui"],
  agent: ["agent-ui"],
  ai: ["ai-chat", "agent-ui"],
  chat: ["ai-chat"],
  llm: ["ai-chat", "agent-ui"],
  prompt: ["ai-chat", "input"],
  animation: ["transition", "text-effect", "background"],
  motion: ["transition", "scroll-effect"],
  dialog: ["modal"],
  popup: ["modal"],
  notification: ["toast"],
  marquee: ["carousel", "logo-cloud"],
  slider: ["carousel"],
  gallery: ["image", "carousel"],
  typing: ["text-effect"],
  headline: ["text-effect", "hero"],
  glow: ["background", "card"],
  shader: ["background", "3d"],
  webgl: ["3d", "background"],
  settings: ["form"],
  shell: ["sidebar", "dashboard"],
  admin: ["dashboard", "sidebar", "table"],
  theme: ["theme"],
  "design-system": ["theme"],
}

export type SearchOptions = {
  query?: string
  category?: Category
  source?: string
  kind?: Kind
  /** An explicit mood filter, unlike moods which favour rather than exclude entries. */
  requiredMood?: Mood
  /** Exclude entries above this access level. Default "metered" (never paid unless asked). */
  maxAccess?: Access
  curatedOnly?: boolean
  /** Feelings to favour. Defaults to moods implied by the query text ("calm", "premium"…). */
  moods?: Mood[]
  /** Skip inspiration (reference-only) entries — on by default for component searches. */
  excludeInspiration?: boolean
  /** Only entries that move on ANY of these triggers ("animate on hover" → ["hover"]). */
  triggers?: MotionTrigger[]
  /** Only entries with exactly this motion intensity. */
  intensity?: MotionIntensity
  /** Only drop-ins (replace yours), wrappers (wrap yours) or recipes (CSS/technique applied to yours). */
  integration?: Integration
  /** Only entries that upgrade / replace this component type (`appliesTo` includes it). */
  appliesTo?: Category
  limit?: number
}

const ACCESS_ORDER: Access[] = ["free", "key", "metered", "paid"]

/** Both the full catalog and the gallery's compact payload use the same ranking. */
export type SearchEntry = Pick<CatalogEntry,
  "id" | "title" | "source" | "description" | "notes" | "tags" | "categories" | "kind" |
  "access" | "curated" | "favorite" | "themeAware" | "moods" | "integration" | "appliesTo"
> & { motion?: Pick<Motion, "triggers" | "intensity"> }

export type ScoredEntry<T = CatalogEntry> = T & { score: number }

const FILLER_WORDS = new Set("i me my we our a an the this that these those it its is are be should would could can please want need find show give make build add use with for to of and or some something ui component components feel feels look looks looking like on at in".split(" "))

/** Motion descriptions steer ranking; the explicit motion filters remain strict. */
export function motionFromText(text: string): { trigger?: MotionTrigger; intensity?: MotionIntensity } {
  const t = text.toLowerCase()
  const trigger: MotionTrigger | undefined = /\bhover\b/.test(t) ? "hover"
    : /\bscroll\b/.test(t) ? "scroll"
    : /\b(click|press|tap)\b/.test(t) ? "press"
    : /\b(drag|swipe)\b/.test(t) ? "drag"
    : /\b(loop|continuous)\b/.test(t) ? "loop" : undefined
  const intensity: MotionIntensity | undefined = /\b(subtle|quiet|gentle)\b/.test(t) ? "subtle"
    : /\b(expressive|dramatic|flashy)\b/.test(t) ? "expressive"
    : /\b(lively|noticeable)\b/.test(t) ? "medium" : undefined
  return { trigger, intensity }
}

export function searchCatalog<T extends SearchEntry>(entries: T[], opts: SearchOptions = {}): ScoredEntry<T>[] {
  const maxAccess = ACCESS_ORDER.indexOf(opts.maxAccess ?? "metered")
  const terms = (opts.query ?? "")
    .toLowerCase()
    .split(/[^a-z0-9-]+/)
    .filter((t) => t.length > 1)
  const wantedCats = new Set(terms.flatMap((t) => SYNONYMS[t] ?? []))
  const detectedMoods = moodsFromText(opts.query ?? "")
  const moods = new Set<Mood>(opts.moods?.length ? opts.moods : detectedMoods)
  const describedMotion = motionFromText(opts.query ?? "")
  // Mood words ("calm", "premium") steer ranking but shouldn't have to appear in an entry's text.
  const moodWords = new Set(
    detectedMoods.flatMap((m) => [m, ...terms.filter((w) => moodsFromText(w).includes(m))])
  )
  const motionWords = new Set("hover scroll click press tap drag swipe loop continuous subtle quiet gentle expressive dramatic flashy lively noticeable".split(" "))
  const contentTerms = terms.filter((t) => !moodWords.has(t) && !FILLER_WORDS.has(t) && !motionWords.has(t))

  /** Component types the caller is asking about (explicitly, or by naming a category / synonym). */
  const requestedCats = new Set<string>([...wantedCats, ...terms, ...[opts.appliesTo, opts.category].filter((c) => c !== undefined)])

  const scored: ScoredEntry<T>[] = []
  for (const e of entries) {
    if (ACCESS_ORDER.indexOf(e.access) > maxAccess) continue
    if (opts.category && !e.categories.includes(opts.category)) continue
    if (opts.source && e.source !== opts.source) continue
    if (opts.kind && e.kind !== opts.kind) continue
    if (opts.requiredMood && !e.moods.includes(opts.requiredMood)) continue
    if (opts.curatedOnly && !e.curated) continue
    if ((opts.excludeInspiration ?? true) && e.kind === "inspiration") continue
    if (opts.triggers?.length && !e.motion?.triggers.some((t) => opts.triggers!.includes(t))) continue
    if (opts.intensity && e.motion?.intensity !== opts.intensity) continue
    if (opts.integration && e.integration !== opts.integration) continue
    if (opts.appliesTo && !e.appliesTo.includes(opts.appliesTo)) continue

    let score = 0
    if (terms.length) {
      const name = `${e.id} ${e.title}`.toLowerCase()
      const body = `${e.description} ${e.notes ?? ""} ${e.tags.join(" ")}`.toLowerCase()
      let hits = 0
      for (const t of contentTerms) {
        let hit = false
        if (name.includes(t)) {
          score += 6
          hit = true
        }
        if (e.categories.some((c) => c === t || c.startsWith(t))) {
          score += 5
          hit = true
        }
        if (body.includes(t)) {
          score += 2
          hit = true
        }
        if (hit) hits++
      }
      for (const c of e.categories) if (wantedCats.has(c)) score += 4
      if (contentTerms.length && hits === 0 && !e.categories.some((c) => wantedCats.has(c))) continue
      if (!contentTerms.length && moods.size && !e.moods.some((m) => moods.has(m))) continue
      if (!contentTerms.length && !moods.size && (describedMotion.trigger || describedMotion.intensity) &&
        !((describedMotion.trigger && e.motion?.triggers.includes(describedMotion.trigger)) ||
          (describedMotion.intensity && e.motion?.intensity === describedMotion.intensity))) continue
      // reward matching more of the query
      if (contentTerms.length) score += (hits / contentTerms.length) * 4
    }

    const moodHits = e.moods.filter((m) => moods.has(m)).length
    score += moodHits * 4
    if (describedMotion.trigger && e.motion?.triggers.includes(describedMotion.trigger)) score += 4
    if (describedMotion.intensity && e.motion?.intensity === describedMotion.intensity) score += 4
    if (e.categories.some((c) => requestedCats.has(c))) score += 5
    const exact = (opts.query ?? "").trim().toLowerCase()
    if (exact && e.id.toLowerCase() === exact) score += 40
    if (exact && e.title.toLowerCase() === exact) score += 20

    // A wrapper/recipe made for the component being asked about ("animate my card" → border-beam).
    if ((e.integration === "wrapper" || e.integration === "recipe") && e.appliesTo.some((c) => requestedCats.has(c))) score += 3

    if (e.favorite) score += 6
    if (e.source === "oc") score += 4
    if (e.curated) score += 3
    if (e.themeAware) score += 2
    if (e.access === "free") score += 1
    if (e.access === "paid") score -= 6
    scored.push({ ...e, score: Math.round(score * 10) / 10 })
  }

  return scored.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)).slice(0, opts.limit ?? 12)
}

/** Compact, agent-friendly view of an entry. */
export function summarize(e: CatalogEntry) {
  return {
    id: e.id,
    title: e.title,
    kind: e.kind,
    categories: e.categories,
    access: e.access,
    themeAware: e.themeAware ?? false,
    curated: e.curated,
    favorite: e.favorite,
    moods: e.moods,
    install: e.install,
    notes: e.notes ?? e.description,
    // Links first — the user picks from these before anything is installed.
    page: entryPage(e.id),
    galleries: e.categories.map(category => ({ category, url: categoryGallery(category) })),
    live: e.live,
    preview: e.preview,
    docs: e.docs,
    integration: e.integration,
    appliesTo: e.appliesTo,
    motion: e.motion,
  }
}

/**
 * Typical section lists for common product types. plan_ui uses these as the default outline;
 * agents should adjust to the brief.
 */
export const PAGE_TYPES = ["landing", "dashboard", "data", "editorial", "docs", "commerce", "ai-app", "auth-onboarding", "portfolio"] as const

export const PAGE_RECIPES: Record<typeof PAGE_TYPES[number], { label: string; guidance?: string[]; sections: { section: string; query: string; category?: Category }[] }> = {
  landing: {
    label: "Marketing / landing page",
    sections: [
      { section: "Navigation", query: "navbar", category: "navigation" },
      { section: "Hero", query: "hero", category: "hero" },
      { section: "Social proof", query: "logo cloud", category: "logo-cloud" },
      { section: "Features", query: "features bento", category: "features" },
      { section: "Testimonials", query: "testimonials", category: "testimonials" },
      { section: "Pricing", query: "pricing", category: "pricing" },
      { section: "FAQ", query: "faq", category: "faq" },
      { section: "Call to action", query: "cta", category: "cta" },
      { section: "Footer", query: "footer", category: "footer" },
    ],
  },
  dashboard: {
    label: "SaaS app / dashboard",
    sections: [
      { section: "App shell (sidebar + header)", query: "sidebar app shell", category: "sidebar" },
      { section: "KPI tiles", query: "stats kpi", category: "stats" },
      { section: "Charts", query: "chart", category: "chart" },
      { section: "Data table", query: "table", category: "table" },
      { section: "Empty state", query: "empty state", category: "empty-state" },
      { section: "Settings form", query: "settings form", category: "form" },
    ],
  },
  data: {
    label: "Data exploration / reporting",
    guidance: [
      "Start with the questions users need to answer, dataset shape and available comparisons; choose charts for the data, not decoration.",
      "Keep filters and date ranges visible. Include units, source, freshness, loading, missing-data and error states.",
      "Use readable scales and accessible series labels; preserve dense useful information and provide a table alternative and export when needed.",
    ],
    sections: [
      { section: "Navigation and dataset context", query: "navigation", category: "navigation" },
      { section: "Filters, date range and search", query: "filter date picker input", category: "input" },
      { section: "Summary metrics with units and comparison", query: "stats", category: "stats" },
      { section: "Primary visualization", query: "chart", category: "chart" },
      { section: "Detailed records and sorting", query: "table", category: "table" },
      { section: "No results / missing data", query: "empty state", category: "empty-state" },
    ],
  },
  editorial: {
    label: "Editorial / institutional storytelling",
    guidance: ["Build around the narrative and reading hierarchy: introduction, evidence, stories and related material. Photography and motion should serve the content."],
    sections: [
      { section: "Navigation", query: "navbar", category: "navigation" },
      { section: "Opening statement", query: "hero", category: "hero" },
      { section: "Evidence and figures", query: "stats", category: "stats" },
      { section: "Story / program sections", query: "feature list", category: "features" },
      { section: "Related stories", query: "blog", category: "blog" },
      { section: "Footer", query: "footer", category: "footer" },
    ],
  },
  docs: {
    label: "Documentation / knowledge base",
    guidance: ["Prioritize findability, reading width, navigation, code examples and content hierarchy; do not add marketing sections to a documentation page."],
    sections: [
      { section: "Navigation and search", query: "navbar", category: "navigation" },
      { section: "Documentation tree", query: "sidebar", category: "sidebar" },
      { section: "Search input", query: "search input", category: "input" },
      { section: "Code examples", query: "code", category: "code" },
      { section: "Reference tables", query: "table", category: "table" },
      { section: "Frequently asked questions", query: "faq", category: "faq" },
    ],
  },
  commerce: {
    label: "Storefront / product browsing",
    guidance: ["Prioritize product discovery, comparison and purchase decisions. Show product details, price and availability; connect cart and checkout to the project's real commerce flow."],
    sections: [
      { section: "Store navigation", query: "navbar", category: "navigation" },
      { section: "Search and filters", query: "search input", category: "input" },
      { section: "Product cards", query: "card", category: "card" },
      { section: "Product imagery", query: "image carousel", category: "carousel" },
      { section: "Reviews", query: "testimonials", category: "testimonials" },
      { section: "Purchase action", query: "button", category: "button" },
      { section: "Footer", query: "footer", category: "footer" },
    ],
  },
  "ai-app": {
    label: "AI / agent product",
    sections: [
      { section: "App shell", query: "sidebar app shell", category: "sidebar" },
      { section: "Chat thread", query: "chat thread messages", category: "ai-chat" },
      { section: "Prompt composer", query: "prompt composer input", category: "ai-chat" },
      { section: "Agent status / thinking", query: "agent thinking status", category: "agent-ui" },
      { section: "Reasoning / tool calls", query: "reasoning tool calls trace", category: "agent-ui" },
      { section: "Approvals / human-in-the-loop", query: "approval", category: "agent-ui" },
    ],
  },
  "auth-onboarding": {
    label: "Auth & onboarding",
    sections: [
      { section: "Sign in / sign up", query: "login signup", category: "auth" },
      { section: "Onboarding steps", query: "multi step loader onboarding", category: "loader" },
      { section: "Empty state / first run", query: "empty state", category: "empty-state" },
    ],
  },
  portfolio: {
    label: "Portfolio / personal site",
    sections: [
      { section: "Navigation", query: "dock navbar", category: "navigation" },
      { section: "Hero", query: "hero text effect", category: "hero" },
      { section: "Work grid", query: "image gallery cards", category: "image" },
      { section: "Timeline / about", query: "timeline", category: "scroll-effect" },
      { section: "Contact", query: "contact", category: "contact" },
      { section: "Footer", query: "footer", category: "footer" },
    ],
  },
}

/** Pick a recipe from free text. */
export function guessRecipes(brief: string): string[] {
  const b = brief.toLowerCase()
  const out: string[] = []
  const marketing = /\b(landing|marketing|homepage|launch|waitlist)\b/.test(b)
  if (marketing) out.push("landing")
  if (/\b(data[- ]focused|data[- ]heavy|data[- ]driven|data exploration|dataset|analytics|reporting|visuali[sz]ation|observability)\b/.test(b)) out.push("data")
  if (/\b(editorial|magazine|publication|newsroom|journal|institutional|storytelling)\b/.test(b)) out.push("editorial")
  if (/\b(documentation|docs|knowledge base|api reference)\b/.test(b)) out.push("docs")
  if (/\b(ecommerce|e-commerce|storefront|online store|shopping|checkout)\b/.test(b)) out.push("commerce")
  if (/\b(dashboard|admin|internal tool|crm)\b/.test(b) && !out.includes("data")) out.push("dashboard")
  if (/\bai\b|agent|chat|assistant|llm|copilot|gpt|claude/.test(b)) out.push("ai-app")
  if (/login|sign ?up|auth|onboard/.test(b)) out.push("auth-onboarding")
  if (/\b(portfolio|personal site|resume|agency)\b/.test(b)) out.push("portfolio")
  if (out.length) return out
  if (/\b(saas|app|application)\b/.test(b)) return ["dashboard"]
  return ["landing"]
}

/** Brief → design systems ranked by mood overlap (+ a few domain hints). Agent should still confirm. */
export function guessDesignSystems(brief: string, systems: { slug: string; description: string; moods?: Mood[] }[]) {
  const b = brief.toLowerCase()
  const moods = moodsFromText(brief)
  const hints: [RegExp, string][] = [
    [/dev ?tool|developer|cli|issue|linear|raycast|dense|internal|dashboard|dark|\bsharp\b|\bcrisp\b|\bsleek\b|\bpolished\b/, "linear-dark"],
    [/blog|editorial|magazine|publication|newsletter|essay|content|journal|serif/, "editorial"],
    [/\bai\b|assistant|consumer|friendly|soft|glass|onboarding|wellness|playful/, "soft-glass"],
    [/brutal|raw|indie|manifesto|bold|loud|zine|mono/, "brutalist-mono"],
  ]
  const scored = systems.map((s) => {
    const moodHits = (s.moods ?? []).filter((m) => moods.includes(m))
    const hint = hints.some(([re, slug]) => slug === s.slug && re.test(b)) ? 1 : 0
    return { slug: s.slug, score: moodHits.length * 2 + hint, moodHits }
  })
  return scored.sort((a, b2) => b2.score - a.score)
}
