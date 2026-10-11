import { z } from "zod"

import { compareUrl } from "./links"
import { MOTION_LANGUAGES, MOTION_LANGUAGE_NAMES } from "./motion"
import { moodsFromText } from "./moods"
import { CatalogEntry, Category, Mood } from "./schema"
import { searchCatalog, summarize } from "./search"

/** Observations supplied by the project agent after viewing a URL or screenshot. No server-side fetch. */
export const ReferenceInput = z.object({
  source: z.string().url().max(2000).optional().describe("Reference URL, if there is one. Not fetched by this tool."),
  description: z.string().trim().min(1).max(4000).describe("What you observed in the reference: layout, typography, surfaces, spacing, and motion."),
  patterns: z.array(z.object({
    name: z.string().trim().min(1).max(120).describe("Component or section type, e.g. navbar, split hero, pricing."),
    category: Category.optional(),
    description: z.string().max(1000).optional().describe("Visual treatment to reproduce for this section."),
    requiredFeatures: z.array(z.string().min(1).max(160)).max(12).default([]).describe("Behavior/content requirements to check before choosing."),
  })).min(1).max(12).describe("Observed sections in order, or the single component to recreate."),
  moods: z.array(Mood).max(3).optional().describe("Project/reference feel; override inferred moods."),
  motion_language: z.enum(MOTION_LANGUAGE_NAMES as [string, ...string[]]).optional(),
  theme: z.string().max(100).optional(),
  options_per_pattern: z.number().int().min(1).max(5).default(3),
})
export type ReferenceInput = z.infer<typeof ReferenceInput>

/** Match observed patterns to reusable pieces without pretending a URL or image has been analysed here. */
export function matchReference(catalog: CatalogEntry[], input: ReferenceInput) {
  const moods = input.moods?.length ? input.moods : moodsFromText(input.description)
  const motionLanguage = input.motion_language as keyof typeof MOTION_LANGUAGES | undefined
  const allowed = motionLanguage ? MOTION_LANGUAGES[motionLanguage].allows : undefined
  const reusable = catalog.filter((e) =>
    !["theme", "template", "inspiration"].includes(e.kind) && e.access !== "paid" &&
    (!allowed || !e.motion || allowed.includes(e.motion.intensity))
  )
  const patterns = input.patterns.map((pattern) => {
    const options = searchCatalog(reusable, {
      query: `${pattern.name} ${pattern.description ?? ""}`,
      category: pattern.category,
      moods,
      limit: input.options_per_pattern,
    }).map(summarize)
    return {
      ...pattern,
      options,
      compare: options.length ? compareUrl(options.map((e) => e.id), { theme: input.theme, label: pattern.name }) : null,
      status: options.length ? "review-options" : "catalog-gap",
    }
  })
  return {
    reference: { source: input.source ?? null, observations: input.description },
    basis: "Catalog matches use the supplied observations. This tool does not fetch websites or inspect images.",
    moods,
    patterns,
    howToPresent: "Explain the reference's structure, then show 3–5 distinct approaches with gallery/live/compare links. Recommend a fit, identify visual and behavior gaps against requiredFeatures, and let the user choose unless already authorized to implement. Reuse selected components; custom-build only the unmatched details. A catalog match is not a claim of pixel-perfect equivalence.",
  }
}
