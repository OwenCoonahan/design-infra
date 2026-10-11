import "server-only"

import { readFile } from "node:fs/promises"
import path from "node:path"

import { MOODS, moodsFromText, type Mood } from "@/lib/catalog/moods"
import { referenceBrief, referencesFor } from "@/lib/catalog/references"
import { researchForPage } from "@/lib/catalog/research"
import { guessRecipes, PAGE_RECIPES, PAGE_TYPES, searchCatalog, summarize } from "@/lib/catalog/search"
import { getCatalog, getDesignSystems } from "@/lib/data"

import { SITE_URL } from "@/lib/catalog/links"

export { SITE_URL }

export async function getRegistriesPreset() {
  const raw = await readFile(path.join(process.cwd(), "presets/components.registries.json"), "utf8")
  return (JSON.parse(raw) as { registries: Record<string, unknown> }).registries
}

/**
 * Brief → a concrete, installable UI plan: reference sites, legacy theme options, per-section component picks
 * (best first), and the setup commands. This is the "don't build from scratch" entry point.
 */
export async function planUi(brief: string, pageTypes?: string[], picksPerSection = 3, moodOverride?: Mood[]) {
  picksPerSection = Math.max(1, Math.min(8, Math.floor(picksPerSection) || 3))
  const [catalog, systems] = await Promise.all([getCatalog(), getDesignSystems()])
  const recipes = (pageTypes?.length ? pageTypes : guessRecipes(brief)).filter((r): r is typeof PAGE_TYPES[number] => PAGE_TYPES.includes(r as typeof PAGE_TYPES[number]))
  const moods: Mood[] = moodOverride?.length ? moodOverride : moodsFromText(brief)
  const inspiration = catalog
    .filter((e) => e.kind === "inspiration" && e.moods.some((m) => moods.includes(m)))
    .sort((a, b) => ((b.favorite ? 3 : 0) + b.moods.filter((m) => moods.includes(m)).length) - ((a.favorite ? 3 : 0) + a.moods.filter((m) => moods.includes(m)).length))
    .slice(0, 5)
  const templates = catalog.filter((e) => e.source === "oc" && e.name.startsWith("template-"))

  const pages = recipes.map((r) => {
    const recipe = PAGE_RECIPES[r]
    return {
      pageType: r,
      label: recipe.label,
      research: researchForPage(r, brief, moods),
      guidance: recipe.guidance ?? ["Adapt the outline to the project's content, audience and primary task. It is a starting structure, not a mandatory page template."],
      template: templates.find((t) => t.name.includes(r === "ai-app" ? "ai" : r === "dashboard" ? "dashboard" : r))?.install,
      sections: recipe.sections.map((s) => {
        // Brief words refine each section's query ("pricing" + "usage-based enterprise").
        // Sections want parts, not whole pages or themes.
        const sectionPicks = (opts: Parameters<typeof searchCatalog>[1]) =>
          searchCatalog(catalog, { ...opts, limit: picksPerSection + 4 })
            .filter((e) => e.kind !== "template" && e.kind !== "theme")
            .slice(0, picksPerSection)
        const picks = sectionPicks({ query: s.query, category: s.category, moods })
        const fallback = picks.length ? picks : sectionPicks({ query: s.query, moods })
        // Where to look for ideas on this section (inspiration galleries, exact URLs, free first).
        const references = referencesFor({ text: s.query, category: s.category, moods, limit: 2 }).map(referenceBrief)
        return { section: s.section, picks: fallback.map(summarize), references }
      }),
    }
  })

  return {
    brief,
    moods: {
      detected: moods.map((m) => ({ mood: m, feels: MOODS[m].description })),
      note: moods.length
        ? "Picks below are boosted toward these moods. Override with the `moods` argument."
        : "No mood words in the brief — ask the user how it should FEEL (e.g. calm, premium, playful, technical, editorial, bold) or pass `moods`.",
    },
    inspiration: inspiration.map((e) => ({ id: e.id, name: e.title, url: e.docs, moods: e.moods, why: e.notes ?? e.description, readme: `inspiration/${e.name}/README.md` })),
    designSystem: {
      recommended: null,
      reason: "Preserve the project's existing design. For a new direction, inspect real references, compose suitable components, then derive typography, spacing, color and motion rules from the working page. Mood words alone do not select a theme.",
      candidates: systems.map((s) => ({ slug: s.slug, name: s.name, legacy: true, moods: s.moods, motion: s.motion, description: s.description, install: `npx shadcn@latest add ${s.registryItem}` })),
    },
    pages,
    setup: [
      "Inspect the existing framework, package manager, styling and DESIGN.md. Preserve the project's stack and brand.",
      `Connect the catalog using ${SITE_URL}/integrate/raw. MCP and HTTP work without installing a framework or components.`,
      "For a selected React component: check React/Tailwind compatibility and existing components.json before initializing shadcn.",
      `Merge the required registry from ${SITE_URL}/api/setup without replacing existing registries or aliases.`,
      "Install selected picks section by section using their install commands. Adapt to existing tokens and behavior; avoid --overwrite.",
      "Only when a NEW design system is explicitly requested: build a reference-grounded composition first, then document its approved tokens and component rules in DESIGN.md. Existing theme presets are legacy options, not defaults.",
      "Compose from selected components; write original UI for catalog gaps. Whole-page templates are optional and require review of their target page.",
    ],
    rules: [
      "Follow the existing ./DESIGN.md and project tokens. A suggested design system is a reference, not permission to replace the brand.",
      "Choose project structure separately from visual feeling. A clean data product needs filters, charts and records; it does not inherit a marketing site's hero, pricing and testimonial sequence.",
      "Use each page's research sources before composing; inspect actual examples with your own browser/image tools or an already-authorized gallery MCP. Paid research is optional and does not authorize a purchase, login or paid component installation.",
      "Plain app UI (dialogs, selects, forms, tables) → stock shadcn/ui.",
      "Never install access=paid items; key/metered need the user's account.",
      "One heavy effect (WebGL/shader/scroll) per viewport; respect prefers-reduced-motion.",
      "Each section's `references` are galleries to LOOK at for ideas (follow their attribution/no-hotlinking etiquette), not installs.",
    ],
  }
}
