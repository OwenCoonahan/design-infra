/**
 * Pull the live component lists from each external source into catalog/generated/<source>.json.
 *
 *   pnpm sync                 # all sources
 *   pnpm sync aceternity      # one source
 *
 * Only metadata is stored (name, description, categories, install command, preview image) —
 * never upstream source code. Run `pnpm catalog` afterwards to rebuild catalog/index.json.
 */
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

import type { z } from "zod"

import { type Category, CatalogEntry as Entry } from "../lib/catalog/schema"

const OUT_DIR = path.join(process.cwd(), "catalog/generated")

/** Adapters return schema *input* (defaults like curated/demo are filled in by the parse). */
type Adapter = () => Promise<z.input<typeof Entry>[]>

// ---------------------------------------------------------------------------
// category inference
// ---------------------------------------------------------------------------

/** Ordered: first match wins for the primary category, all matches are kept. */
const NAME_RULES: [RegExp, Category][] = [
  [/hero/, "hero"],
  [/nav|navbar|dock|notch|menu|breadcrumb/, "navigation"],
  [/pricing/, "pricing"],
  [/bento/, "bento"],
  [/feature/, "features"],
  [/cta|call-to-action|banner/, "cta"],
  [/testimonial/, "testimonials"],
  [/logo/, "logo-cloud"],
  [/faq|frequently-asked/, "faq"],
  [/accordion/, "accordion"],
  [/footer/, "footer"],
  [/blog/, "blog"],
  [/contact/, "contact"],
  [/login|signup|sign-up|auth|registration/, "auth"],
  [/team/, "team"],
  [/stats|number-ticker|counter/, "stats"],
  [/empty-state/, "empty-state"],
  [/sidebar/, "sidebar"],
  [/carousel|slider|marquee|moving-cards/, "carousel"],
  [/modal|dialog/, "modal"],
  [/tooltip|link-preview/, "tooltip"],
  [/toast|notification/, "toast"],
  [/tabs/, "tabs"],
  [/table|records|diff-table/, "table"],
  [/chart|graph/, "chart"],
  [/dashboard/, "dashboard"],
  [/code|terminal/, "code"],
  [/map|globe/, "map"],
  [/badge|chip|pill/, "badge"],
  [/button/, "button"],
  [/input|search|composer|prompt-bar|file-upload|checkbox|toggle|switch/, "input"],
  [/form/, "form"],
  [/card/, "card"],
  [/image|gallery|photo|lens|compare|focus-cards/, "image"],
  [/background|aurora|beams|stars|meteors|vortex|lamp|wavy|grid|dots|noise|shader|ripple|sparkles|gradient/, "background"],
  [/text|word|typewriter|letter|font|encrypted|colourful|squiggly/, "text-effect"],
  [/scroll|parallax|tracing-beam|sticky/, "scroll-effect"],
  [/cursor|pointer/, "cursor"],
  [/loader|loading|spinner|skeleton|thinking|orb/, "loader"],
  [/3d|isometric|canvas/, "3d"],
  [/illustration|macbook|iphone|ipad|keyboard/, "illustration"],
  [/chat|stream|reasoning/, "ai-chat"],
]

const UPSTREAM_CATEGORY: Record<string, Category> = {
  background: "background",
  backgrounds: "background",
  "background-animation": "background",
  text: "text-effect",
  card: "card",
  cards: "card",
  hero: "hero",
  "hero section": "hero",
  features: "features",
  feature: "features",
  "call to action": "cta",
  cta: "cta",
  CTA: "cta",
  footer: "footer",
  testimonials: "testimonials",
  testimonial: "testimonials",
  navbar: "navigation",
  navigation: "navigation",
  sidebar: "sidebar",
  form: "form",
  loader: "loader",
  loaders: "loader",
  loading: "loader",
  carousel: "carousel",
  marquee: "carousel",
  image: "image",
  images: "image",
  "image-gallery": "image",
  button: "button",
  modal: "modal",
  tooltip: "tooltip",
  "bento grid": "bento",
  parallax: "scroll-effect",
  scroll: "scroll-effect",
  "3D": "3d",
  "3d": "3d",
  canvas: "3d",
  cursor: "cursor",
  pointer: "cursor",
  map: "map",
  code: "code",
  dashboard: "dashboard",
  illustration: "illustration",
  pricing: "pricing",
  animation: "misc",
  "interactive-elements": "misc",
  games: "misc",
  border: "misc",
  // React Bits (llms.txt section headings, lower-cased)
  "text animations": "text-effect",
  // Origin UI (coss.com/origin category slugs)
  accordion: "accordion",
  badge: "badge",
  breadcrumb: "navigation",
  "calendar-date-picker": "input",
  checkbox: "input",
  dialog: "modal",
  dropdown: "navigation",
  "event-calendar": "dashboard",
  "file-upload": "input",
  "image-cropper": "image",
  input: "input",
  notification: "toast",
  pagination: "navigation",
  popover: "tooltip",
  radio: "input",
  select: "input",
  slider: "input",
  stepper: "form",
  switch: "input",
  table: "table",
  tabs: "tabs",
  textarea: "input",
  tree: "navigation",
  // shadcn/ui blocks (registry categories)
  charts: "chart",
  authentication: "auth",
  login: "auth",
  signup: "auth",
}

/**
 * Extra name rules for sources added after the first batch (Magic UI, React Bits, Motion Primitives,
 * Cult UI, Kibo UI). Opt-in via inferCategories' third argument so the categories of the original
 * sources (several of whose names match these, e.g. OriginKit's `*-field` effects) don't shift.
 */
const EXTRA_NAME_RULES: [RegExp, Category][] = [
  [/pattern|particles|light-rays/, "background"],
  [/android|safari|iphone|mockup|mac-screen|apple-|browser-window/, "illustration"],
  [/typing|highlighter|heading/, "text-effect"],
  [/kanban|gantt|calendar|contribution-graph/, "dashboard"],
  [/combobox|choicebox|dropzone|color-picker|rating|tags|editor|select|(^|-)field$|segmented|radio/, "input"],
  [/number|(^|-)ticker/, "stats"],
  [/progress/, "loader"],
  [/drawer|side-panel|floating-panel|popover/, "modal"],
  [/toolbar|tree/, "navigation"],
  [/video/, "image"],
  [/snippet|sandbox/, "code"],
  [/stepper|onboarding|wizard|poll|vote/, "form"],
  [/announcement/, "badge"],
  [/blur-fade|fade-content|animated-content|in-view|animated-group|transition-panel|pixel-transition/, "transition"],
  [/prompt-library|ai-instructions/, "ai-chat"],
  [/agent/, "agent-ui"],
]

function inferCategories(name: string, upstream: string[] = [], extra: [RegExp, Category][] = []): Category[] {
  const out = new Set<Category>()
  for (const [re, cat] of NAME_RULES) if (re.test(name)) out.add(cat)
  for (const u of upstream) {
    const mapped = UPSTREAM_CATEGORY[u]
    if (mapped && mapped !== "misc") out.add(mapped)
  }
  for (const [re, cat] of extra) if (re.test(name)) out.add(cat)
  if (out.size === 0) out.add("misc")
  return [...out].slice(0, 4)
}

function titleCase(slug: string) {
  return slug
    .split("-")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ")
}

async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) throw new Error(`${url} → ${res.status}`)
  return (await res.json()) as T
}

async function getText(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} → ${res.status}`)
  return res.text()
}

/** Effects (backgrounds, text, cursor, scroll) vs. regular components, from inferred categories. */
const EFFECT_CATEGORIES = new Set<Category>(["background", "text-effect", "cursor", "scroll-effect"])
function kindFor(categories: Category[]) {
  return EFFECT_CATEGORIES.has(categories[0]) ? ("effect" as const) : ("component" as const)
}

/** Standard shadcn registry index item (registry.json → items[]). */
type ShadcnItem = {
  name: string
  type: string
  title?: string
  description?: string
  dependencies?: string[]
  registryDependencies?: string[]
  categories?: string[]
}

// ---------------------------------------------------------------------------
// adapters
// ---------------------------------------------------------------------------

const aceternity: Adapter = async () => {
  type ApiComponent = {
    name: string
    title: string
    description: string
    categories: string[]
    dependencies: string[]
    documentationUrl: string
    image: string | null
  }
  type RegistryItem = { name: string; type: string; description?: string; dependencies?: string[] }

  const api = await getJson<{ components: ApiComponent[] }>("https://ui.aceternity.com/api/components")
  const registry = await getJson<{ items: RegistryItem[] }>("https://ui.aceternity.com/registry/registry.json")

  const components = api.components.map((c) => ({
    id: `aceternity/${c.name}`,
    source: "aceternity",
    name: c.name,
    title: c.title,
    description: c.description.replace(/ component for React\/Next\.js$/, ""),
    kind: "component" as const,
    categories: inferCategories(c.name, c.categories),
    tags: c.categories.filter((t) => !UPSTREAM_CATEGORY[t]),
    access: "free" as const,
    install: `npx shadcn@latest add @aceternity/${c.name}`,
    docs: c.documentationUrl,
    preview: c.image ?? undefined,
    dependencies: c.dependencies,
  }))

  // Blocks are only in the registry index (the API lists a handful). Their docs live on
  // category pages, so we link the registry item itself.
  // Most blocks are Pro: they're listed in the public index, but their registry item answers
  // "Unauthorized" without an All-Access token. Probe each one so `access` is honest.
  const blockItems = registry.items.filter((i) => i.type === "registry:block")
  const isPro = new Map<string, boolean>()
  for (let i = 0; i < blockItems.length; i += 8) {
    await Promise.all(
      blockItems.slice(i, i + 8).map(async (b) => {
        const res = await fetch(`https://ui.aceternity.com/registry/${b.name}.json`)
        const body = await res.text()
        isPro.set(b.name, res.status === 401 || res.status === 403 || /unauthori[sz]ed/i.test(body.slice(0, 200)))
      })
    )
  }

  const blocks = blockItems.map((b) => {
    const pro = isPro.get(b.name) ?? false
    return {
      id: `aceternity/${b.name}`,
      source: "aceternity",
      name: b.name,
      title: b.description || titleCase(b.name),
      description: b.description ?? "",
      kind: "block" as const,
      categories: inferCategories(b.name),
      tags: pro ? ["block", "pro"] : ["block"],
      access: pro ? ("paid" as const) : ("free" as const),
      install: `npx shadcn@latest add @aceternity/${b.name}`,
      // Public, chrome-less preview page (works for Pro blocks too).
      docs: `https://ui.aceternity.com/live-preview/${b.name}`,
      dependencies: b.dependencies ?? [],
    }
  })

  return [...components, ...blocks]
}

const beautifui: Adapter = async () => {
  type Item = { name: string; type: string; title?: string; description?: string; dependencies?: string[] }
  const reg = await getJson<{ items: Item[] }>("https://www.beautifului.dev/r/registry.json")
  // The index only carries titles; descriptions live on each item.
  const items = await Promise.all(
    reg.items
      .filter((i) => i.type !== "registry:style")
      .map(async (i) => ({ ...i, ...(await getJson<Item>(`https://www.beautifului.dev/r/${i.name}.json`)) }))
  )
  return items.map((i) => ({
      id: `beautifui/${i.name}`,
      source: "beautifui",
      name: i.name,
      title: i.title ?? titleCase(i.name),
      description: i.description ?? "",
      kind: "component" as const,
      categories: ["agent-ui" as Category, ...inferCategories(i.name).filter((c) => c !== "misc")],
      tags: ["ai", i.type.replace("registry:", "")],
      access: "free" as const,
      install: `npx shadcn@latest add @beautifui/${i.name}`,
      docs: "https://www.beautifului.dev/",
      dependencies: i.dependencies ?? [],
    }))
}

const originkit: Adapter = async () => {
  // No public registry/API; the homepage embeds the full catalogue in its RSC payload.
  type Item = {
    name: string
    displayName: string
    kind: "component" | "section"
    category: string
    categories: string[]
    paid?: boolean
    galleryPoster?: string
  }
  const html = await (await fetch("https://www.originkit.dev/")).text()
  const marker = 'registry\\":'
  const start = html.indexOf(marker)
  if (start < 0) throw new Error("originkit: embedded registry not found (page layout changed?)")
  const seg = html
    .slice(start + marker.length, start + marker.length + 1_500_000)
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\")
  let depth = 0
  let end = 0
  for (let i = 0; i < seg.length; i++) {
    if (seg[i] === "[") depth++
    else if (seg[i] === "]" && --depth === 0) {
      end = i + 1
      break
    }
  }
  const items = JSON.parse(seg.slice(0, end)) as Item[]
  return items.map((i) => ({
    id: `originkit/${i.name}`,
    source: "originkit",
    name: i.name,
    title: i.displayName,
    description: "",
    kind: i.kind === "section" ? ("block" as const) : i.category === "background-animation" ? ("effect" as const) : ("component" as const),
    categories: inferCategories(i.name, i.categories),
    tags: i.categories,
    access: i.paid ? ("paid" as const) : ("metered" as const),
    install: `npx originkit add ${i.name}`,
    docs: `https://www.originkit.dev/${i.kind === "section" ? "sections" : "components"}/${i.name}`,
    preview: i.galleryPoster?.split("?")[0],
  }))
}

const transitions: Adapter = async () => {
  type GhFile = { name: string }
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" }
  if (process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN)
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN}`
  const files = await getJson<GhFile[]>(
    "https://api.github.com/repos/Jakubantalik/transitions.dev/contents/skills/transitions-dev",
    { headers },
  )
  const recipes = files
    .map((f) => /^(\d+)-(.+)\.md$/.exec(f.name))
    .filter((m): m is RegExpExecArray => !!m)
  // raw.githubusercontent.com isn't rate limited like the contents API.
  const raw = "https://raw.githubusercontent.com/Jakubantalik/transitions.dev/main/skills/transitions-dev"
  const withDocs = await Promise.all(
    recipes.map(async (m) => {
      const md = await (await fetch(`${raw}/${m[0]}`)).text()
      const title = /^#\s+(.+)$/m.exec(md)?.[1]?.trim()
      const when = /## When to use\s+([\s\S]*?)(\n## |$)/.exec(md)?.[1]?.trim().split("\n\n")[0]
      return { slug: m[2], title, when }
    })
  )
  return withDocs.map(({ slug, title, when }) => ({
      id: `transitions/${slug}`,
      source: "transitions",
      name: slug,
      title: title ?? titleCase(slug),
      description: (when ?? "").replace(/\s+/g, " "),
      kind: "transition" as const,
      categories: ["transition" as Category, ...inferCategories(slug).filter((c) => c !== "misc")].slice(0, 3),
      tags: ["css"],
      access: "free" as const,
      // Installed as an agent skill; the agent applies the recipe to your markup.
      install: `npx skills add Jakubantalik/transitions.dev  # then ask: "apply the ${slug} transition"`,
      docs: `https://transitions.dev/detail.html?t=${slug}`,
    }))
}

const magicui: Adapter = async () => {
  // registry.json carries title + description + deps for every item; examples/demos are skipped.
  const reg = await getJson<{ items: ShadcnItem[] }>("https://magicui.design/r/registry.json")
  return reg.items
    .filter((i) => i.type === "registry:ui")
    .map((i) => {
      const categories = inferCategories(i.name, [], EXTRA_NAME_RULES)
      return {
        id: `magicui/${i.name}`,
        source: "magicui",
        name: i.name,
        title: i.title ?? titleCase(i.name),
        description: i.description ?? "",
        kind: kindFor(categories),
        categories,
        tags: (i.dependencies ?? []).includes("motion") ? ["motion"] : [],
        access: "free" as const,
        install: `npx shadcn@latest add @magicui/${i.name}`,
        docs: `https://magicui.design/docs/components/${i.name}`,
        dependencies: i.dependencies ?? [],
      }
    })
}

const originui: Adapter = async () => {
  // Origin UI is now "coss.com origin" (legacy, Radix-based). No public index on the site, but the
  // MIT-licensed app in the coss monorepo has its registry.json (tags) and category config.
  type Item = ShadcnItem & { meta?: { tags?: string[] } }
  const raw = "https://raw.githubusercontent.com/cosscom/coss/main/apps/origin"
  const reg = await getJson<{ items: Item[] }>(`${raw}/registry.json`)
  const config = await getText(`${raw}/config/components.ts`)

  // categories: [{ components: [{ name: "comp-1" }, …], name: "Input", slug: "input" }, …]
  const catOf = new Map<string, { slug: string; name: string }[]>()
  const block = /components:\s*\[([\s\S]*?)\],[\s\S]*?name:\s*"([^"]+)",\s*slug:\s*"([^"]+)"/g
  for (const [, list, name, slug] of config.matchAll(block))
    for (const [comp] of list.matchAll(/comp-\d+/g)) catOf.set(comp, [...(catOf.get(comp) ?? []), { slug, name }])
  if (catOf.size < 100) throw new Error("originui: category config not parsed (format changed?)")

  return reg.items
    .filter((i) => i.type === "registry:component" && catOf.has(i.name))
    .map((i) => {
      const cats = catOf.get(i.name)!
      const tags = (i.meta?.tags ?? []).flatMap((t) => t.split(/,\s*/))
      const label = tags.filter((t) => t !== cats[0].slug && t !== cats[0].name.toLowerCase()).slice(0, 3)
      return {
        id: `originui/${i.name}`,
        source: "originui",
        name: i.name,
        title: label.length ? `${cats[0].name}: ${label.join(", ")}` : `${cats[0].name} ${i.name.replace("comp-", "#")}`,
        description: `${cats[0].name} variant (${i.name})${tags.length ? ` — ${tags.join(", ")}` : ""}.`,
        kind: "component" as const,
        // Upstream category only (names are opaque comp-N; slugs like "textarea"/"slider" would trip NAME_RULES).
        categories: inferCategories("", cats.map((c) => (c.slug === "banner" ? "cta" : c.slug))),
        tags,
        access: "free" as const,
        install: `npx shadcn@latest add https://coss.com/origin/r/${i.name}.json`,
        docs: `https://coss.com/origin/${cats[0].slug}`,
        dependencies: i.dependencies ?? [],
      }
    })
}

const reactBits: Adapter = async () => {
  // Every component ships in 4 variants (JS|TS × CSS|TW); we catalogue the TypeScript + Tailwind one.
  // llms.txt gives the site section (category), docs URL and CLI name; registry.json gives deps.
  const reg = await getJson<{ items: ShadcnItem[] }>("https://reactbits.dev/r/registry.json")
  const llms = await getText("https://reactbits.dev/llms.txt")
  const SECTIONS = new Set(["text animations", "animations", "components", "micro", "backgrounds"])
  const info = new Map<string, { title: string; docs: string; section: string }>()
  let section = ""
  for (const line of llms.split("\n")) {
    const h = /^## (.+)$/.exec(line)
    if (h) section = h[1].trim().toLowerCase()
    const m = /^- \[([^\]]+)\]\((https:\/\/www\.reactbits\.dev\/[^)]+)\).*CLI: `([A-Za-z0-9]+)`/.exec(line)
    if (m && SECTIONS.has(section)) info.set(m[3], { title: m[1], docs: m[2], section })
  }
  if (info.size < 100) throw new Error("reactbits: llms.txt not parsed (format changed?)")

  return reg.items
    .filter((i) => i.name.endsWith("-TS-TW"))
    .map((i) => {
      const cli = i.name.replace(/-TS-TW$/, "")
      const meta = info.get(cli)
      const slug =
        meta?.docs.split("/").pop() ??
        cli.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").toLowerCase()
      const categories = inferCategories(slug, meta ? [meta.section] : [], EXTRA_NAME_RULES)
      const isEffect = meta && ["text animations", "animations", "backgrounds"].includes(meta.section)
      const deps = (i.dependencies ?? []).map((d) => d.replace(/(.)@[^@]+$/, "$1"))
      return {
        id: `react-bits/${slug}`,
        source: "react-bits",
        name: slug,
        title: meta?.title ?? i.title ?? titleCase(slug),
        description: i.description ?? "",
        kind: isEffect ? ("effect" as const) : ("component" as const),
        categories,
        tags: [meta?.section.replace(" ", "-"), ...["gsap", "motion", "three", "ogl"].filter((d) => deps.includes(d))].filter(
          (t): t is string => !!t
        ),
        access: "free" as const,
        install: `npx shadcn@latest add @react-bits/${cli}-TS-TW`,
        docs: meta?.docs,
        dependencies: deps,
      }
    })
}

const motionPrimitives: Adapter = async () => {
  const reg = await getJson<{ items: ShadcnItem[] }>("https://motion-primitives.com/c/registry.json")
  return reg.items.map((i) => {
    const categories = inferCategories(i.name, [], EXTRA_NAME_RULES)
    return {
      id: `motion-primitives/${i.name}`,
      source: "motion-primitives",
      name: i.name,
      title: i.title ?? titleCase(i.name),
      description: i.description ?? "",
      kind: kindFor(categories),
      categories,
      tags: ["motion"],
      access: "free" as const,
      install: `npx shadcn@latest add @motion-primitives/${i.name}`,
      docs: `https://motion-primitives.com/docs/${i.name}`,
      dependencies: i.dependencies ?? [],
    }
  })
}

const cultUi: Adapter = async () => {
  const reg = await getJson<{ items: ShadcnItem[] }>("https://www.cult-ui.com/r/registry.json")
  return reg.items
    .filter((i) => i.type === "registry:ui")
    .map((i) => {
      const categories = inferCategories(i.name, [], EXTRA_NAME_RULES)
      return {
        id: `cult-ui/${i.name}`,
        source: "cult-ui",
        name: i.name,
        title: i.title ?? titleCase(i.name),
        description: i.description ?? "",
        kind: kindFor(categories),
        categories,
        tags: (i.dependencies ?? []).includes("motion") ? ["motion"] : [],
        access: "free" as const,
        install: `npx shadcn@latest add @cult-ui/${i.name}`,
        docs: `https://www.cult-ui.com/docs/components/${i.name}`,
        dependencies: i.dependencies ?? [],
      }
    })
}

const kiboUi: Adapter = async () => {
  // Components only — Kibo's /blocks install via the same /r/ endpoint but returned HTTP 500 when ingested.
  const reg = await getJson<{ items: ShadcnItem[] }>("https://www.kibo-ui.com/r/registry.json")
  return reg.items
    .filter((i) => i.type === "registry:ui")
    .map((i) => ({
      id: `kibo-ui/${i.name}`,
      source: "kibo-ui",
      name: i.name,
      title: titleCase(i.name),
      description: i.description ?? "",
      kind: "component" as const,
      categories: inferCategories(i.name, [], EXTRA_NAME_RULES),
      tags: [],
      access: "free" as const,
      install: `npx shadcn@latest add @kibo-ui/${i.name}`,
      docs: `https://www.kibo-ui.com/components/${i.name}`,
      dependencies: i.dependencies ?? [],
    }))
}

const COMPLEXITY: Record<string, string> = { simple: "low", moderate: "medium", complex: "high" }
/** SmoothUI's own element/page transitions (shared-axis, fade-through, shader reveals…) — wrappers around your content. */
const SMOOTHUI_TRANSITION = /-transition$|^shared-axis-|^fade-through$|^short-slide-|^scale-down-fade$|^soft-blur-in$|^blur-out-up$|^micro-scale-fade$|^mask-reveal-up$|^spring-scale-in$|^focus-blur-resolve$|^stagger-from-/

const smoothui: Adapter = async () => {
  // llms-components.json carries per-item metadata the registry index lacks: category, tags, animationType,
  // complexity and hasReducedMotion (verified accurate when true; ~80 more items handle it without the flag —
  // `pnpm scan-motion --only smoothui` finds those).
  type Item = {
    name: string
    displayName?: string
    description?: string
    category?: string
    blockType?: string
    tags?: string[]
    animationType?: string
    complexity?: string
    dependencies?: string[]
    hasReducedMotion?: boolean
    docUrl?: string
  }
  const llms = await getJson<{ components: Item[]; blocks: Item[] }>("https://smoothui.dev/llms-components.json")
  if (llms.components.length < 150) throw new Error("smoothui: llms-components.json looks truncated (format changed?)")
  const extra: [RegExp, Category][] = [...EXTRA_NAME_RULES, [SMOOTHUI_TRANSITION, "transition"]]
  const entry = (i: Item, block: boolean) => {
    // upstream category: ai → agent UI; block types header → hero (footer/pricing/testimonials map as-is)
    const upstream = [i.category, i.blockType].filter((c): c is string => !!c && c !== "other").map((c) => (c === "header" ? "hero" : c))
    const inferred = inferCategories(i.name, upstream, extra)
    // ai → agent UI first; its own transitions lead with `transition` (NAME_RULES reads "shader-reveal" as a background)
    const lead: Category | null = i.category === "ai" ? "agent-ui" : SMOOTHUI_TRANSITION.test(i.name) ? "transition" : null
    const categories = (lead ? [lead, ...inferred.filter((c) => c !== "misc" && c !== lead)] : inferred).slice(0, 4)
    const title = block
      ? titleCase(i.name)
      : (i.displayName ?? i.name).replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    return {
      id: `smoothui/${i.name}`,
      source: "smoothui",
      name: i.name,
      title,
      description: i.description ?? "",
      kind: block ? ("block" as const) : kindFor(categories),
      categories,
      tags: [
        ...new Set([
          ...(i.tags ?? []).filter((t) => t !== "animated"),
          ...(i.animationType && i.animationType !== "none" ? [i.animationType] : []),
          // code complexity, not feel: "simple" as a bare tag would read as the `minimal` mood (lib/catalog/moods.ts)
          ...(i.complexity ? [`complexity-${COMPLEXITY[i.complexity] ?? i.complexity}`] : []),
          ...(i.hasReducedMotion ? ["reduced-motion"] : []),
        ]),
      ],
      access: "free" as const,
      // @smoothui is in shadcn's built-in registry directory (resolves without a components.json entry).
      install: `npx shadcn@latest add @smoothui/${i.name}`,
      docs: i.docUrl,
      dependencies: i.dependencies ?? [],
    }
  }
  return [...llms.components.map((i) => entry(i, false)), ...llms.blocks.map((i) => entry(i, true))]
}

const shadcn: Adapter = async () => {
  // Official blocks (dashboard, sidebar, login, signup, charts). The CLI resolves the style from the
  // project's components.json, so the install is just the bare name.
  const reg = await getJson<{ items: ShadcnItem[] }>("https://ui.shadcn.com/r/styles/new-york-v4/registry.json")
  const blocks = reg.items.filter((i) => i.type === "registry:block")
  return Promise.all(
    blocks.map(async (b) => {
      const isChart = b.name.startsWith("chart-")
      const [, chartType, ...rest] = b.name.split("-")
      // Screenshots exist for the non-chart blocks only (and not all of them) — probe.
      let preview: string | undefined
      if (!isChart) {
        const url = `https://ui.shadcn.com/r/styles/new-york/${b.name}-light.png`
        const res = await fetch(url, { method: "HEAD" })
        if (res.ok && res.headers.get("content-type")?.startsWith("image/")) preview = url
      }
      const group = isChart ? chartType : b.name.replace(/-\d+$/, "")
      return {
        id: `shadcn/${b.name}`,
        source: "shadcn",
        name: b.name,
        title: isChart ? `${titleCase(chartType)} Chart · ${titleCase(rest.join("-"))}` : titleCase(b.name),
        description: b.description ?? (isChart ? `${titleCase(chartType)} chart (${rest.join(" ")}) built on Recharts + shadcn chart.` : ""),
        kind: "block" as const,
        categories: inferCategories("", b.categories ?? []),
        tags: ["block", ...(isChart ? ["recharts"] : [])],
        access: "free" as const,
        install: `npx shadcn@latest add ${b.name}`,
        docs: isChart ? `https://ui.shadcn.com/charts/${group}#${b.name}` : `https://ui.shadcn.com/blocks/${group}#${b.name}`,
        preview,
        dependencies: b.dependencies ?? [],
      }
    })
  )
}


/**
 * Motion (motion.dev) examples — React only. ~460 examples across React/JS/Vue; each has a public poster +
 * preview video. Source is free for a minority; the rest need Motion+ (paid). Examples that use Motion+
 * APIs (Ticker, Cursor, AnimateNumber, splitText…) are paid even when their page shows code.
 */
const MOTION_PLUS_APIS = /\b(Ticker|Cursor|AnimateNumber|Typewriter|ScrambleText|scrambleText|splitText|useCurtains|curtains|Carousel|AnimateActivity|animateLayout)\b/
const motion: Adapter = async () => {
  const listing = await (await fetch("https://motion.dev/examples")).text()
  type Card = { slug: string; title: string; poster?: string; video?: string }
  const cards = new Map<string, Card>()
  for (const m of listing.matchAll(/<a href="\/examples\/(react-[a-z0-9-]+)" aria-label="([^"]+?), React"[^>]*>([\s\S]*?)<\/a>/g)) {
    const [, slug, title, inner] = m
    cards.set(slug, {
      slug,
      title: title.replace(/&amp;/g, "&").replace(/&#x27;/g, "'"),
      poster: /<img src="([^"]+poster[^"]*)"/.exec(inner)?.[1],
      video: /<video src="([^"]+\.mp4)"/.exec(inner)?.[1],
    })
  }
  const list = [...cards.values()]
  const out: z.input<typeof Entry>[] = []
  for (let i = 0; i < list.length; i += 6) {
    await Promise.all(
      list.slice(i, i + 6).map(async (c) => {
        const url = `https://motion.dev/examples/${c.slug}`
        const page = await (await fetch(url)).text()
        const gated = /unlocks the full|Unlock all \d/i.test(page)
        const text = page.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
        const builtWith = /Built with (.+?) Open fullscreen/.exec(text)?.[1].split(" ").filter(Boolean) ?? []
        const plusApis = builtWith.filter((b) => MOTION_PLUS_APIS.test(b))
        const paid = gated || plusApis.length > 0
        const description = (/<meta name="description" content="([^"]*)"/.exec(page)?.[1] ?? "").replace(/&amp;/g, "&").replace(/&#x27;/g, "'")
        const name = c.slug.replace(/^react-/, "")
        out.push({
          id: `motion/${name}`,
          source: "motion",
          name,
          title: c.title,
          description,
          kind: "transition",
          // Name is reliable; descriptions only contribute component-type words (not "keyboard" → illustration).
          categories: [
            ...new Set<Category>([
              "transition",
              ...inferCategories(name, [], EXTRA_NAME_RULES),
              ...inferCategories(description.toLowerCase(), [], EXTRA_NAME_RULES).filter(
                (x) => !["illustration", "image", "3d", "map", "code"].includes(x)
              ),
            ]),
          ]
            .filter((x) => x !== "misc")
            .slice(0, 3),
          tags: [...new Set(["motion", ...builtWith.slice(0, 8), ...(plusApis.length ? ["motion-plus"] : [])])],
          access: paid ? "paid" : "free",
          install: paid
            ? `Motion+ (paid) — reference only: ${url}`
            : `pnpm add motion  # then adapt the free source from ${url}`,
          docs: url,
          preview: c.poster,
          video: c.video,
          dependencies: ["motion"],
        })
      })
    )
  }
  return out
}

const ADAPTERS: Record<string, Adapter> = {
  motion,
  aceternity,
  beautifui,
  originkit,
  transitions,
  magicui,
  originui,
  "react-bits": reactBits,
  "motion-primitives": motionPrimitives,
  "cult-ui": cultUi,
  "kibo-ui": kiboUi,
  smoothui,
  shadcn,
}

// ---------------------------------------------------------------------------

async function main() {
  const only = process.argv.slice(2)
  const names = only.length ? only : Object.keys(ADAPTERS)
  await mkdir(OUT_DIR, { recursive: true })

  let failed = false
  for (const name of names) {
    const adapter = ADAPTERS[name]
    if (!adapter) throw new Error(`unknown source "${name}" (have: ${Object.keys(ADAPTERS).join(", ")})`)
    try {
      const raw = await adapter()
      const entries = raw.map((e) => Entry.parse(e)).sort((a, b) => a.id.localeCompare(b.id))
      await writeFile(path.join(OUT_DIR, `${name}.json`), JSON.stringify(entries, null, 2) + "\n")
      console.log(`✓ ${name}: ${entries.length} entries`)
    } catch (err) {
      failed = true
      console.error(`✗ ${name}: ${(err as Error).message}`)
    }
  }
  if (failed) process.exit(1)
}

main()
