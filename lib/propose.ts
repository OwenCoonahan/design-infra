import "server-only"

import { compareUrl, SITE_URL } from "@/lib/catalog/links"
import { MOTION_LANGUAGES, type MotionLanguage } from "@/lib/catalog/motion"
import { type Mood, moodsFromText } from "@/lib/catalog/moods"
import { loadPlaybooks } from "@/lib/catalog/playbooks"
import { referenceBrief, referencesFor } from "@/lib/catalog/references"
import type { CatalogEntry, Category, MotionIntensity, MotionTrigger, Playbook, PlaybookDirection } from "@/lib/catalog/schema"
import { CATEGORIES } from "@/lib/catalog/schema"
import { searchCatalog, summarize, SYNONYMS } from "@/lib/catalog/search"
import { dislikeFor, loadDislikes } from "@/lib/catalog/taste"
import { getCatalog } from "@/lib/data"

export type Intent = PlaybookDirection["intent"][number]

export type ProposeInput = {
  /** What the user pointed at, in their words: "Request access button", "pricing cards", "logo carousel". */
  component: string
  category?: Category
  /** What they said: "I want this to animate on scroll, subtly", "I don't like how this looks". */
  request?: string
  intent?: Intent
  intensity?: MotionIntensity
  trigger?: MotionTrigger
  moods?: Mood[]
  /** The project's motion language (DESIGN.md `motion:`) — caps intensity. */
  motionLanguage?: MotionLanguage
  /** Design system slug to preview @oc options under on the compare page. */
  theme?: string
  maxDirections?: number
}

const INTENT_WORDS: [RegExp, Intent][] = [
  [/replace|swap|switch (?:this|it|out)|different (?:component|layout)|instead of|something else/, "replace"],
  [/animat|motion|move|moving|transition|alive|smooth|micro.?interaction|hover effect|on scroll|static|flat|lifeless|boring|dead|stiff/, "animate"],
  [/loading|spinner|success|error state|empty state|skeleton|pending|disabled state|feedback/, "add-state"],
  [/don.?t like|ugly|clean(er)?|nicer|better looking|restyle|redesign|modern|refresh|look like/, "restyle"],
  [/polish|feel better|tighten|improve|upgrade/, "polish"],
]

function inferIntent(text: string): Intent {
  const t = text.toLowerCase()
  for (const [re, intent] of INTENT_WORDS) if (re.test(t)) return intent
  return "polish"
}

function inferIntensity(text: string): MotionIntensity | undefined {
  const t = text.toLowerCase()
  if (/subtle|quiet|minimal|gentle|light touch|barely/.test(t)) return "subtle"
  if (/expressive|wow|dramatic|bold|flashy|crazy|impressive/.test(t)) return "expressive"
  if (/noticeable|lively|playful|medium/.test(t)) return "medium"
  return undefined
}

function inferTrigger(text: string): MotionTrigger | undefined {
  const t = text.toLowerCase()
  if (/scroll/.test(t)) return "scroll"
  if (/hover/.test(t)) return "hover"
  if (/click|press|tap/.test(t)) return "press"
  if (/load|appear|enter|mount|in view/.test(t)) return "enter"
  if (/loop|continuous|always/.test(t)) return "loop"
  if (/drag|swipe/.test(t)) return "drag"
  return undefined
}

/** Free text → the best playbook (by component slug, aliases, then category words). */
function resolvePlaybook(text: string, playbooks: { playbook: Playbook; body: string }[]) {
  const t = ` ${text.toLowerCase()} `
  let best: { pb: (typeof playbooks)[number]; score: number } | undefined
  for (const pb of playbooks) {
    const words = [pb.playbook.component.replace(/-/g, " "), pb.playbook.title.toLowerCase(), ...pb.playbook.aliases, ...pb.playbook.categories.map((c) => c.replace(/-/g, " "))]
    let score = 0
    for (const w of words) if (t.includes(` ${w.toLowerCase()}`) || t.includes(`${w.toLowerCase()}s `)) score += w.length
    if (score && (!best || score > best.score)) best = { pb, score }
  }
  return best?.pb
}

function guessCategory(text: string): Category | undefined {
  const words = text.toLowerCase().split(/[^a-z0-9-]+/)
  for (const word of words) {
    if (CATEGORIES.includes(word as Category)) return word as Category
  }
  for (const word of words) {
    if (SYNONYMS[word]?.length) return SYNONYMS[word][0]
  }
  return undefined
}

const INTENSITY_RANK: Record<MotionIntensity, number> = { subtle: 0, medium: 1, expressive: 2 }

/**
 * "I want this to animate" → a short menu of genuinely different directions, each with clickable
 * picks (gallery page, live demo, docs) and one compare link. Agents present this and let the user
 * choose BEFORE installing anything.
 */
export async function proposeOptions(input: ProposeInput) {
  const catalog = await getCatalog()
  const byId = new Map(catalog.map((e) => [e.id, e]))
  const intent = input.intent ?? inferIntent(input.request ?? input.component)
  const intensity = input.intensity ?? inferIntensity(input.request ?? "")
  const trigger = input.trigger ?? inferTrigger(input.request ?? "")
  const moods = input.moods?.length ? input.moods : moodsFromText(input.request ?? "")
  const allowed = input.motionLanguage ? MOTION_LANGUAGES[input.motionLanguage].allows : undefined
  const dislikes = loadDislikes()
  const skipped: { id: string; reason: string }[] = []

  const usable = (e: CatalogEntry | undefined): e is CatalogEntry => {
    if (!e || e.access === "paid") return false
    const d = dislikeFor(e, dislikes)
    if (d) {
      if (!skipped.some((s) => s.id === e.id)) skipped.push({ id: e.id, reason: d.reason })
      return false
    }
    return true
  }

  const playbooks = loadPlaybooks()
  const candidate = resolvePlaybook(input.component, playbooks)
  const category = input.category ?? guessCategory(input.component) ?? candidate?.playbook.categories[0]
  // A pricing card replacement wants pricing sections; a section-reveal playbook is for motion.
  const match = candidate && (
    intent === "animate" || intent === "polish" || intent === "add-state" ||
    !category || candidate.playbook.categories.includes(category)
  ) ? candidate : undefined

  let directions: {
    key: string
    label: string
    feel: string
    when: string
    avoid?: string
    intensity?: MotionIntensity
    fit: { intent: boolean; moods: Mood[]; intensity: boolean; withinMotionLanguage: boolean }
    picks: ReturnType<typeof summarize>[]
  }[] = []

  let bolder: typeof directions = []
  if (match) {
    directions = match.playbook.directions
      .filter((d) => d.intent.includes(intent))
      .map((d) => {
        const picks = d.picks.map((id) => byId.get(id)).filter(usable)
        const withinMotionLanguage = !allowed || !d.intensity || allowed.includes(d.intensity)
        return {
          key: d.key,
          label: d.label,
          feel: d.feel,
          when: d.when,
          avoid: d.avoid,
          intensity: d.intensity,
          fit: {
            intent: d.intent.includes(intent),
            moods: d.moods.filter((m) => moods.includes(m)),
            intensity: !intensity || !d.intensity || d.intensity === intensity,
            withinMotionLanguage,
          },
          picks: picks.map(summarize),
          _score:
            (d.intent.includes(intent) ? 10 : 0) +
            d.moods.filter((m) => moods.includes(m)).length * 3 +
            (intensity && d.intensity === intensity ? 4 : 0) +
            (intensity && d.intensity ? -Math.abs(INTENSITY_RANK[d.intensity] - INTENSITY_RANK[intensity]) : 0) +
            (withinMotionLanguage ? 0 : -8) +
            (trigger && picks.some((p) => p.motion?.triggers.includes(trigger)) ? 3 : 0),
        }
      })
      .filter((d) => d.picks.length)
      .sort((a, b) => b._score - a._score)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ _score, ...d }) => d)
    // Directions more expressive than the project's motion language go to a separate "bolder" list.
    bolder = directions.filter((d) => !d.fit.withinMotionLanguage)
    directions = directions.filter((d) => d.fit.withinMotionLanguage).slice(0, input.maxDirections ?? 5)
  }

  // Beyond the playbook: catalog search for the same component + intent, deduped against picks.
  const picked = new Set([...directions, ...bolder].flatMap((d) => d.picks.map((p) => p.id)))
  const shelf = new Set<Category>(match?.playbook.categories ?? (category ? [category] : []))
  const query = `${input.component} ${intent === "animate" ? "animation" : ""} ${input.request ?? ""}`
  const more = searchCatalog(catalog, { query, category, moods, limit: catalog.length })
    .filter((e) => !picked.has(e.id) && e.kind !== "inspiration" && e.kind !== "theme" && e.kind !== "template")
    // stay on the same shelf: same category, or a wrapper/recipe that applies to it
    .filter((e) => !shelf.size || e.categories.some((c) => shelf.has(c)) || e.appliesTo.some((c) => shelf.has(c)))
    .filter((e) => intent !== "replace" || (e.integration !== "wrapper" && e.integration !== "recipe"))
    .filter(usable)
    .filter((e) => intent !== "animate" || !!e.motion || e.categories.includes("transition"))
    .filter((e) => !allowed || !e.motion || allowed.includes(e.motion.intensity))
    .slice(0, 6)
    .map(summarize)

  // Sections without a curated playbook still need choices and a working comparison.
  for (const pick of more) {
    if (directions.length >= (input.maxDirections ?? 5)) break
    directions.push({
      key: pick.id.replace(/[^a-z0-9-]/gi, "-"),
      label: pick.title,
      feel: pick.notes,
      when: pick.notes ?? `An alternative for ${input.component}; check its live demo and integration requirements.`,
      intensity: pick.motion?.intensity,
      fit: { intent: true, moods: pick.moods.filter((m) => moods.includes(m)), intensity: !intensity || !pick.motion || pick.motion.intensity === intensity, withinMotionLanguage: true },
      picks: [pick],
    })
    picked.add(pick.id)
  }

  // Inspiration galleries for the same pattern — "see how others do it" when no option fits.
  const references = referencesFor({ text: input.component, category, moods, limit: 2 }).map(referenceBrief)

  const topPicks = directions.map((d) => d.picks[0]?.id).filter(Boolean) as string[]
  const label = `${intent === "animate" ? "Animate" : intent === "add-state" ? "States for" : intent === "replace" ? "Replace" : intent === "restyle" ? "Restyle" : "Polish"} — ${input.component}`

  return {
    component: input.component,
    playbook: match ? { component: match.playbook.component, title: match.playbook.title, guidance: match.body } : null,
    understood: { intent, intensity: intensity ?? null, trigger: trigger ?? null, moods, motionLanguage: input.motionLanguage ?? null },
    directions,
    /** Directions beyond the project's motion language — offer only if the user wants bolder. */
    bolder: bolder.map((d) => ({ key: d.key, label: d.label, feel: d.feel, intensity: d.intensity, picks: d.picks.slice(0, 2) })),
    more: more.filter((e) => !picked.has(e.id)),
    skippedByCatalogTaste: skipped,
    skippedBecauseOwenPassed: skipped, // compatibility for older consumers
    compare: topPicks.length ? compareUrl(topPicks, { theme: input.theme, label }) : null,
    compareAll: picked.size ? compareUrl([...picked].slice(0, 12), { theme: input.theme, label }) : null,
    /** Top 2 inspiration galleries for this pattern (exact URLs). Offer when the user wants ideas or nothing fits. */
    references,
    browse: `${SITE_URL}/components?q=${encodeURIComponent(input.component)}${category ? `&category=${category}` : ""}`,
    howToPresent:
      "Show 3–5 distinct approaches as a table: label · feel · cost/tradeoff · links (page + live). Give the compare link so the user can inspect real examples. Recommend one given the project's DESIGN.md and content requirements. Wait for the user's pick unless they already authorized you to choose and implement. Preserve the existing component's required behavior. Keep choices in project notes; share catalog feedback only when requested. If they want ideas or none fit, offer `references` (\"see how others do it: <links>\") — galleries to look at, not install.",
  }
}
