import { readFileSync } from "node:fs"
import path from "node:path"

import { type Mood, MOOD_NAMES, moodsFromText } from "@/lib/catalog/moods"
import { CATEGORIES, type Category, Reference, type ReferenceFacet } from "@/lib/catalog/schema"
import { SYNONYMS } from "@/lib/catalog/search"

/**
 * Inspiration galleries (catalog/references.json) → "where should I look for ideas on X?".
 * Shared by MCP `find_references`, /api/references, propose_options, plan_ui and scripts/build-references.ts.
 * No `server-only` here: scripts/check.ts and the build script import it too.
 */

export function loadReferences(root = process.cwd()): Reference[] {
  const raw = JSON.parse(readFileSync(path.join(root, "catalog/references.json"), "utf8")) as { references: unknown[] }
  return raw.references.map((r, i) => {
    const parsed = Reference.safeParse(r)
    if (!parsed.success)
      throw new Error(`references[${i}]: ${parsed.error.issues.map((x) => `${x.path.join(".")}: ${x.message}`).join("; ")}`)
    return parsed.data
  })
}

let cache: Reference[] | undefined
/** Cached for route handlers (the file only changes on deploy). */
export const getReferences = () => (cache ??= loadReferences())

const PLACEHOLDER = /\{([a-z]+)\}/g

/**
 * Integrity rules (scripts/check.ts): every template is an https URL on the gallery's own domain once its
 * placeholders are filled, uses only {value} (facets) / {slug} (items), and valued facets list their values.
 * Returns problems; empty = good.
 */
export function validateReferences(refs: Reference[], catalogIds?: Set<string>): string[] {
  const problems: string[] = []
  const slugs = new Set<string>()
  const site = (u: string) => new URL(u).hostname.replace(/^(www|cdn)\./, "")
  for (const r of refs) {
    const where = `${r.slug}`
    if (slugs.has(r.slug)) problems.push(`${where}: duplicate slug`)
    slugs.add(r.slug)
    for (const c of r.covers) if (!(CATEGORIES as readonly string[]).includes(c)) problems.push(`${where}: covers unknown category ${c}`)
    if (new Set(r.covers).size !== r.covers.length) problems.push(`${where}: duplicate covers`)
    const home = site(r.url)

    const checkUrl = (label: string, template: string, allowed: string[]) => {
      const used = [...template.matchAll(PLACEHOLDER)].map((m) => m[1])
      for (const p of used) if (!allowed.includes(p)) problems.push(`${where}: ${label} uses {${p}} (allowed: ${allowed.map((a) => `{${a}}`).join(", ") || "none"})`)
      if (/[{}]/.test(template.replace(PLACEHOLDER, ""))) problems.push(`${where}: ${label} has a stray brace: ${template}`)
      let u: URL
      try {
        u = new URL(template.replace(PLACEHOLDER, "x"))
      } catch {
        problems.push(`${where}: ${label} is not a URL: ${template}`)
        return used
      }
      if (u.protocol !== "https:") problems.push(`${where}: ${label} must be https: ${template}`)
      if (site(u.href) !== home) problems.push(`${where}: ${label} points off-site (${u.hostname} ≠ ${home}): ${template}`)
      return used
    }

    const keys = new Set<string>()
    for (const f of r.patterns) {
      if (keys.has(f.key)) problems.push(`${where}: duplicate facet key ${f.key}`)
      keys.add(f.key)
      const used = checkUrl(`facet "${f.key}"`, f.url, ["value"])
      const templated = used.includes("value")
      if (templated && !f.values.length) problems.push(`${where}: facet "${f.key}" has {value} but no values`)
      if (!templated && f.values.length) problems.push(`${where}: facet "${f.key}" lists values but its URL has no {value}`)
      if (new Set(f.values).size !== f.values.length) problems.push(`${where}: facet "${f.key}" has duplicate values`)
      for (const [k, v] of Object.entries(f.map))
        if (!f.values.includes(v)) problems.push(`${where}: facet "${f.key}" maps "${k}" → "${v}", which is not one of its values`)
      if (!templated && !f.match.length && f.key !== "browse") problems.push(`${where}: valueless facet "${f.key}" needs \`match\` words or nothing can select it`)
    }
    if (r.item) {
      const used = checkUrl("item.page", r.item.page, ["slug"])
      if (!used.includes("slug")) problems.push(`${where}: item.page needs {slug}`)
      if (r.item.video) checkUrl("item.video", r.item.video, ["slug"])
    }
    if (r.access === "paid" && !/paid/i.test(r.notes ?? "")) problems.push(`${where}: paid gallery must say so in notes (free-first)`)
    if (catalogIds) for (const id of r.related) if (!catalogIds.has(id)) problems.push(`${where}: related id ${id} is not in the catalog`)
  }
  return problems
}

/** Fill a facet/item template. */
export const fill = (template: string, vars: { value?: string; slug?: string }) =>
  template.replace(PLACEHOLDER, (_, k: string) => encodeURIComponent((vars as Record<string, string>)[k] ?? ""))

export type ReferenceQuery = {
  /** Pattern in words: "pricing", "mega menu", "animated landing page", "hover interaction", "mobile onboarding flow". */
  text?: string
  /** Catalog category, when the caller already knows it (plan_ui sections, playbooks). */
  category?: Category
  /** Project feel — nudges galleries whose collection skews that way and picks matching style facets. */
  moods?: Mood[]
  /** Paid galleries follow free matches unless explicitly named. false excludes them even by name. Default true. */
  includePaid?: boolean
  limit?: number
}

export type ReferenceLink = { label: string; url: string }

export type ReferenceHit = {
  slug: string
  name: string
  access: Reference["access"]
  /** Present on paid galleries: account and access requirements. */
  accessNote?: string
  score: number
  /** Best concrete URL for this pattern (falls back to the gallery home). */
  url: string
  /** Concrete browse URLs that match the pattern, best first. */
  links: ReferenceLink[]
  why: string
  media: Reference["media"]
  /** One entry's page/video template, e.g. landing.love `/sites/{slug}/` + mp4. */
  item?: Reference["item"]
  etiquette: Reference["etiquette"]
  machine: Reference["machine"]
  notes?: string
}

const STOP = new Set(["a", "an", "the", "for", "of", "to", "and", "or", "with", "my", "our", "this", "that", "some", "ideas", "idea", "inspiration", "examples", "example", "like", "how", "others", "do", "it", "look", "looks", "good", "nice", "page", "design", "section", "show", "me", "want", "need", "i", "we", "on", "in", "is"])

/** Words in, with naive singulars ("navbars" → "navbar", "heroes" → "hero") and hyphenated pairs ("mega-menu"). */
function tokenize(text: string) {
  const words = text.toLowerCase().split(/[^a-z0-9/]+/).filter(Boolean)
  const out = new Set<string>()
  for (const w of words) {
    out.add(w)
    if (w.endsWith("ies") && w.length > 4) out.add(`${w.slice(0, -3)}y`)
    else if (w.endsWith("es") && w.length > 4) out.add(w.slice(0, -2))
    if (w.endsWith("s") && !w.endsWith("ss") && w.length > 3) out.add(w.slice(0, -1))
  }
  for (let i = 0; i < words.length - 1; i++) out.add(`${words[i]}-${words[i + 1]}`)
  return out
}

/** Text + explicit category → categories it asks about (names, "logo cloud", synonyms like navbar/plans/logos). */
function categoriesFor(tokens: Set<string>, category?: Category) {
  const cats = new Set<Category>(category ? [category] : [])
  for (const c of CATEGORIES) if (tokens.has(c)) cats.add(c)
  for (const t of tokens) for (const c of SYNONYMS[t] ?? []) cats.add(c)
  return cats
}

/**
 * Which links of one facet fit the query. Priority: 3 = a word written in the pattern (or the explicit category),
 * 2 = a category implied by a synonym ("landing" → hero), 1 = the project's moods. A valued facet whose `match`
 * words also hit (Mobbin flows ← "onboarding flow") gets +1, so the most specific shelf leads.
 */
function facetLinks(f: ReferenceFacet, direct: Set<string>, derived: Set<string>, text: string, moods: Set<Mood>) {
  const hits: { link: ReferenceLink; priority: number }[] = []
  const hasWord = (w: string) => direct.has(w) || derived.has(w) || (w.includes(" ") && text.includes(` ${w} `))
  const selected = f.match.some(hasWord)
  if (!f.values.length) {
    if (selected) hits.push({ link: { label: f.label, url: f.url }, priority: f.match.some((w) => direct.has(w) || text.includes(` ${w} `)) ? 3 : 2 })
    return hits
  }
  const chosen = new Map<string, number>()
  const pick = (v: string | undefined, p: number) => v && f.values.includes(v) && chosen.set(v, Math.max(chosen.get(v) ?? 0, p))
  const byWord = (words: Iterable<string>, p: number) => {
    for (const w of words) {
      pick(f.values.includes(w) ? w : undefined, p)
      pick(f.map[w], p)
    }
  }
  byWord(direct, 3)
  byWord(derived, 2)
  byWord(moods, 1)
  for (const [v, p] of chosen)
    hits.push({ link: { label: `${f.label}: ${v.replace(/[-_]/g, " ")}`, url: fill(f.url, { value: v }) }, priority: p + (selected && p > 1 ? 1 : 0) })
  return hits
}

/**
 * Pattern (+ category, moods) → galleries ranked best first, each with concrete URLs for that pattern.
 * Free-first by default. An explicitly named gallery leads, while retaining its access requirements.
 */
export function referencesFor(query: ReferenceQuery | string, refs: Reference[] = getReferences()): ReferenceHit[] {
  const q: ReferenceQuery = typeof query === "string" ? { text: query } : query
  const text = ` ${(q.text ?? "").toLowerCase().replace(/[^a-z0-9/ -]+/g, " ")} `
  const normalized = text.replace(/[-/]+/g, " ").replace(/\s+/g, " ")
  const named = new Set(refs.filter((r) => [r.name, r.slug].some((name) => normalized.includes(` ${name.toLowerCase().replace(/[-/]+/g, " ")} `))).map((r) => r.slug))
  const tokens = tokenize(q.text ?? "")
  if (q.category) tokens.add(q.category)
  const moods = new Set<Mood>(q.moods?.length ? q.moods : moodsFromText(q.text ?? ""))
  const cats = categoriesFor(tokens, q.category)
  const isMood = (t: string) => (MOOD_NAMES as string[]).includes(t)
  const meaningful = (t: string) => !STOP.has(t) && !isMood(t)
  // "pricing-page" is content; "minimal-look" (mood + stop word) is not.
  const content = new Set([...tokens].filter((t) => (t.includes("-") && !CATEGORIES.includes(t as Category) ? t.split("-").some(meaningful) : meaningful(t))))
  // Facet matching: words written in the pattern (incl. mood words like "editorial typography") vs categories
  // only implied by synonyms.
  const direct = new Set<string>([...content, ...[...tokens].filter(isMood), ...(q.category ? [q.category] : [])])
  const derived = new Set<string>([...cats].filter((c) => !direct.has(c)))
  const moodOnly = !content.size && !q.category

  const hits: ReferenceHit[] = []
  for (const r of refs) {
    if (r.access === "paid" && q.includePaid === false) continue
    const why: string[] = []
    let score = 0
    if (named.has(r.slug)) {
      score += 50
      why.push("explicitly requested gallery")
    }

    // Category coverage — the strongest shelf wins (not the sum, so broad galleries don't snowball).
    let best = 0
    let bestCat: Category | undefined
    for (const c of cats) {
      const i = r.covers.indexOf(c)
      if (i < 0) continue
      const s = Math.max(3, 10 - 2 * i) + (c === q.category ? 2 : 0)
      if (s > best) [best, bestCat] = [s, c]
    }
    if (bestCat) {
      score += best
      why.push(r.covers[0] === bestCat ? `${bestCat}-focused` : `covers ${bestCat}`)
    }

    // Pattern words the gallery is known for ("mega menu", "animated", "flow"). Phrase match, max 2 count.
    const kw = r.keywords.filter((k) => text.includes(` ${k} `) || text.includes(` ${k}s `) || (k.includes(" ") && text.includes(k)))
    if (kw.length) {
      score += Math.min(2, kw.length) * 6
      why.push(`known for ${kw.slice(0, 3).join(", ")}`)
    }

    // Concrete URLs for this pattern.
    const links = r.patterns.flatMap((f) => facetLinks(f, direct, derived, text, moods))
    const strong = links.filter((l) => l.priority >= 2).length
    score += Math.min(2, strong) * 3

    const contentScore = score
    const moodHits = r.moods.filter((m) => moods.has(m))
    score += moodHits.length * 2 + Math.min(1, links.length - strong)
    if (moodHits.length) why.push(`skews ${moodHits.join(" + ")}`)

    if (moodOnly ? !moodHits.length && !links.length : contentScore < 5) continue

    const ordered = links.sort((a, b) => b.priority - a.priority).map((l) => l.link)
    const uniq = ordered.filter((l, i) => ordered.findIndex((x) => x.url === l.url) === i).slice(0, 4)
    hits.push({
      slug: r.slug,
      name: r.name,
      access: r.access,
      accessNote: r.access === "paid" ? "Paid reference library: confirm the user's supported account and access. A gallery recommendation does not activate access or install components." : undefined,
      score,
      url: uniq[0]?.url ?? r.url,
      links: uniq,
      why: why.join("; ") || "general gallery",
      media: r.media,
      item: r.item,
      etiquette: r.etiquette,
      machine: r.machine,
      notes: r.notes,
    })
  }
  const byScore = (a: ReferenceHit, b: ReferenceHit) => b.score - a.score || a.slug.localeCompare(b.slug)
  const requested = hits.filter((h) => named.has(h.slug)).sort(byScore)
  const free = hits.filter((h) => !named.has(h.slug) && h.access !== "paid").sort(byScore)
  const paid = hits.filter((h) => !named.has(h.slug) && h.access === "paid").sort(byScore)
  return [...requested, ...free, ...paid].slice(0, q.limit ?? 5)
}

/** Compact form for propose_options / plan_ui: just enough to click. */
export const referenceBrief = (h: ReferenceHit) => ({
  name: h.name,
  access: h.access,
  ...(h.accessNote ? { accessNote: h.accessNote } : {}),
  url: h.url,
  links: h.links.slice(0, 3),
  media: h.media,
  attribution: h.etiquette.attribution,
})

export const REFERENCES_HOW_TO_PRESENT =
  'Use these galleries to research relevant patterns, explain the observations, then map them to catalog components. For options requests, show 1–2 source links with the relevant facet. When authorized to choose and build, use the references and report important sources afterward. Follow each gallery\'s etiquette. Generic queries stay free-first; an explicitly named gallery leads, with paid-account requirements still flagged.'
