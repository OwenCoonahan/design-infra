import { getReferences, referenceBrief, referencesFor } from "./references"
import { type Mood } from "./moods"
import { PAGE_TYPES } from "./search"

type PageType = typeof PAGE_TYPES[number]
// Queries choose verified facet URLs from the reference catalog, never invented deep links.
const SOURCES: Record<PageType, string[]> = {
  landing: ["Land Book landing", "Minimal Gallery website", "Mobbin website sections"],
  dashboard: ["Component Gallery table navigation", "Kage dashboard", "Mobbin web dashboard screens"],
  data: ["Component Gallery table chart", "Kage dashboard", "Mobbin web dashboard screens"],
  editorial: ["Minimal Gallery editorial", "Land Book editorial website"],
  docs: ["Component Gallery navigation", "Kage documentation"],
  commerce: ["Land Book ecommerce website", "Component Gallery form", "Mobbin web checkout flows"],
  "ai-app": ["Kage ai chat", "Component Gallery form", "Mobbin web chat screens"],
  "auth-onboarding": ["Component Gallery form", "Kage onboarding", "Mobbin web onboarding flows"],
  portfolio: ["Minimal Gallery portfolio", "Land Book portfolio website"],
}

/** Research destinations, not inspected examples or installable components. */
export function researchForPage(pageType: PageType, brief: string, moods: Mood[]) {
  const requested = referencesFor({ text: brief, moods, limit: getReferences().length })
    .filter((hit) => hit.why.includes("explicitly requested gallery"))
  const defaults = SOURCES[pageType].flatMap((text) => referencesFor({ text, moods, limit: getReferences().length })
    .filter((hit) => hit.why.includes("explicitly requested gallery")))
  const hits = [...requested, ...defaults.filter((hit) => hit.access !== "paid"), ...defaults.filter((hit) => hit.access === "paid")]
    .filter((hit, i, all) => all.findIndex((other) => other.slug === hit.slug) === i)
  return {
    status: "sources-to-inspect",
    instruction: "Inspect a few relevant examples before composing. Record observed layout, typography, density and interaction decisions; map them to installable catalog components. If choosing and building is authorized, research internally and report the sources afterward. These links are research destinations, not evidence that an example has been inspected.",
    sources: hits.map((hit) => ({
      slug: hit.slug,
      ...referenceBrief(hit),
      ...(hit.machine?.mcp ? { mcpSetup: hit.machine.mcp } : {}),
      ...(hit.access === "paid" ? { optional: true, connection: "Account access is unknown. Use only with the user's existing supported access; otherwise continue with the accessible sources." } : {}),
    })),
  }
}
