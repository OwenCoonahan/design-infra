import { getStarter } from "@/lib/starter"
import { configureData, configureText } from "@/lib/config"
import { readFile } from "node:fs/promises"
import path from "node:path"

import { createMcpHandler } from "mcp-handler"
import { z } from "zod"

import { MOOD_NAMES, MOODS } from "@/lib/catalog/moods"
import { PAGE_TYPES, searchCatalog, summarize } from "@/lib/catalog/search"
import { CATEGORIES, Mood, MotionIntensity, MotionTrigger } from "@/lib/catalog/schema"
import { getCatalog, getDesignSystem, getDesignSystems, getSources } from "@/lib/data"
import { MOTION_LANGUAGE_NAMES } from "@/lib/catalog/motion"
import { getRegistriesPreset, planUi, SITE_URL } from "@/lib/plan"
import { proposeOptions } from "@/lib/propose"
import { referencesFor, REFERENCES_HOW_TO_PRESENT } from "@/lib/catalog/references"
import { matchReference, ReferenceInput } from "@/lib/catalog/reference"

const json = (data: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] })

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "match_reference",
      {
        title: "Match a website or screenshot to reusable components",
        description: "Use after YOU inspect a pasted URL or screenshot. Supply observed sections and visual/behavior requirements; returns ranked reusable components and live comparisons for each pattern. Does not fetch websites or analyse images. For replacing an existing section without a reference, use propose_options.",
        inputSchema: ReferenceInput,
      },
      async (input) => json(matchReference(await getCatalog(), input))
    )
    server.registerTool("get_starter_components", { title: "Tested starter collection", description: "Twenty free, theme-aware starting points with install/live links, verification scope and check date. A useful first shelf; verify each selection in the actual project.", inputSchema: z.object({}) }, async () => json(await getStarter()))
    server.registerTool(
      "plan_ui",
      {
        title: "Plan a UI from a product brief",
        description:
          "START HERE when building a website or app. Describe its purpose, audience, tasks and look. Returns a structure appropriate to marketing, data, editorial, docs, commerce, dashboards or AI interfaces, ranked reusable components and live references. Preserve the project brand; derive new design rules from real references and a working composition instead of selecting a preset theme from mood words.",
        inputSchema: z.object({
          brief: z.string().describe("What the product is, audience, pages needed, desired look/feel"),
          page_types: z
            .array(z.enum(PAGE_TYPES))
            .optional()
            .describe("Override the auto-detected page types"),
          picks_per_section: z.number().int().min(1).max(8).optional(),
          moods: z.array(Mood).max(3).optional().describe(`How it should feel (overrides moods read from the brief): ${MOOD_NAMES.join(", ")}`),
        }),
      },
      async ({ brief, page_types, picks_per_section, moods }) => json(await planUi(brief, page_types, picks_per_section ?? 3, moods))
    )

    server.registerTool(
      "propose_options",
      {
        title: "Propose options for one component",
        description:
          "Use when the user points at ONE component (screenshot, element, file) and says things like 'I want this to animate', 'I don't like this', 'make this cleaner', 'add a loading state', 'what are my options for this carousel?'. Returns a short menu of genuinely different directions (feel, when to use, tradeoffs) with clickable picks (gallery page + live demo + docs), a compare link showing them side by side, and items skipped by shared catalog curation. Present the options with links and let the user choose BEFORE installing.",
        inputSchema: z.object({
          component: z.string().describe("What they pointed at, in their words: 'Request access button', 'logo carousel', 'pricing cards'"),
          category: z.enum(CATEGORIES).optional().describe("Target component category identified from the project, e.g. features, pricing, hero."),
          request: z.string().optional().describe("What they said they want, verbatim"),
          intent: z.enum(["animate", "restyle", "replace", "add-state", "polish"]).optional(),
          intensity: MotionIntensity.optional(),
          trigger: MotionTrigger.optional(),
          moods: z.array(Mood).max(3).optional().describe("Project feel, e.g. from its DESIGN.md `moods:`"),
          motion_language: z.enum(MOTION_LANGUAGE_NAMES as [string, ...string[]]).optional().describe("Project's DESIGN.md `motion:` (still|quiet|lively|cinematic) — caps intensity"),
          theme: z.string().optional().describe("Design system slug for previews on the compare page"),
          max_directions: z.number().int().min(2).max(8).optional(),
        }),
      },
      async (a) =>
        json(
          await proposeOptions({
            component: a.component,
            category: a.category,
            request: a.request,
            intent: a.intent,
            intensity: a.intensity,
            trigger: a.trigger,
            moods: a.moods,
            motionLanguage: a.motion_language as never,
            theme: a.theme,
            maxDirections: a.max_directions,
          })
        )
    )

    server.registerTool(
      "find_references",
      {
        title: "Where to look for ideas (inspiration galleries)",
        description:
          "Use when the user wants IDEAS for a pattern ('show me nice footers', 'how do others do pricing pages', 'animated landing page inspiration', 'hover interactions', 'a more minimal look', 'mobile onboarding flow') or none of the propose_options picks fit. Returns the best inspiration galleries (navbar.gallery, footer.design, cta.gallery, pricingpages.design, land-book, landing.love videos, supahero, recent.design, minimal.gallery, awwwards, hoverstat.es, kage, component.gallery; Mobbin flagged as paid) ranked for that pattern, each with exact browse URLs, media type, access and etiquette (attribution, crawl limits, no hotlinking). Galleries are for looking, not installing — map what you find back to catalog components.",
        inputSchema: z.object({
          pattern: z.string().describe("The pattern in words: 'pricing', 'mega menu', 'footer', 'animated landing page', 'hover interaction', 'mobile onboarding flow'"),
          category: z.enum(CATEGORIES).optional().describe("Catalog category when known (e.g. from a plan_ui section)"),
          moods: z.array(Mood).max(3).optional().describe("Project feel (DESIGN.md `moods:`) — picks matching style pages"),
          include_paid: z.boolean().optional().describe("List paid galleries (flagged, after free ones). Default true"),
          limit: z.number().int().min(1).max(14).optional(),
        }),
      },
      async ({ pattern, category, moods, include_paid, limit }) =>
        json({
          pattern,
          results: referencesFor({ text: pattern, category, moods, includePaid: include_paid ?? true, limit: limit ?? 5 }),
          howToPresent: REFERENCES_HOW_TO_PRESENT,
          all: `${SITE_URL}/api/references?pattern=${encodeURIComponent(pattern)}`,
        })
    )

    server.registerTool(
      "search_components",
      {
        title: "Search the component catalog",
        description:
          "Search the ranked UI components/blocks/effects (the shared @design-infra registry first, then curated picks from Aceternity, Magic UI, Beautiful UI, libraries.dev, transitions.dev, OriginKit, 21st.dev…). Returns install commands and notes. Use before writing any component yourself.",
        inputSchema: z.object({
          query: z.string().describe("e.g. 'pricing with yearly toggle', 'hero background', 'agent thinking indicator'"),
          category: z.enum(CATEGORIES).optional(),
          source: z.string().optional().describe("e.g. oc, aceternity, magicui, shadcn, originui, beautifui, librariesdev, transitions, inspiration"),
          include_paid: z.boolean().optional().describe("Include paid-tier items (default false)"),
          curated_only: z.boolean().optional(),
          moods: z.array(Mood).max(3).optional().describe("Favour entries with these feelings (also read from the query text)"),
          limit: z.number().int().min(1).max(50).optional(),
        }),
      },
      async ({ query, category, source, include_paid, curated_only, moods, limit }) => {
        const results = searchCatalog(await getCatalog(), {
          query,
          moods,
          category,
          source,
          excludeInspiration: source !== "inspiration",
          curatedOnly: curated_only,
          maxAccess: include_paid ? "paid" : "metered",
          limit: limit ?? 10,
        })
        return json(results.map((r) => ({ ...summarize(r), score: r.score })))
      }
    )

    server.registerTool(
      "browse_moods",
      {
        title: "Choose by feeling",
        description:
          "The mood vocabulary (calm, minimal, refined, technical, editorial, warm, playful, premium, futuristic, experimental, bold, retro, organic, trustworthy) with, for each mood: what it feels like, matching design systems, saved inspiration sites, and top components. Use when the user describes a vibe rather than specific components, or to offer them mood options.",
        inputSchema: z.object({
          moods: z.array(Mood).optional().describe("Only these moods (default: all)"),
          picks: z.number().int().min(0).max(20).optional().describe("Top components per mood (default 6)"),
        }),
      },
      async ({ moods, picks }) => {
        const [catalog, systems] = await Promise.all([getCatalog(), getDesignSystems()])
        return json(
          (moods?.length ? moods : MOOD_NAMES).map((m) => ({
            mood: m,
            feels: MOODS[m].description,
            briefWords: MOODS[m].words,
            designSystems: systems.filter((s) => s.moods.includes(m)).map((s) => s.slug),
            inspiration: catalog
              .filter((e) => e.kind === "inspiration" && e.moods.includes(m))
              .map((e) => ({ id: e.id, name: e.title, url: e.docs })),
            components: searchCatalog(catalog, { moods: [m], query: m, limit: picks ?? 6 }).map(summarize),
          }))
        )
      }
    )

    server.registerTool(
      "get_inspiration",
      {
        title: "Get a saved inspiration site",
        description: "A saved analysis of an inspiration website or app: feel, palette, type, layout patterns, motion, and which catalog components reproduce it. Ids look like 'inspiration/<slug>'.",
        inputSchema: z.object({ id: z.string().regex(/^(?:inspiration\/)?[a-z0-9-]+$/) }),
      },
      async ({ id }) => {
        const slug = id.replace(/^inspiration\//, "")
        const md = await readFile(path.join(process.cwd(), "inspiration", slug, "README.md"), "utf8").catch(() => null)
        if (!md) return { ...json({ error: `No inspiration "${slug}". Use browse_moods or search_components with source "inspiration".` }), isError: true }
        return { content: [{ type: "text" as const, text: `${md}\n\nReference analysis: ${SITE_URL}/inspiration/${slug}. Inspect the original website linked above for current visual examples; captured screenshots are private review material.` }] }
      }
    )

    server.registerTool(
      "get_component",
      {
        title: "Get one catalog entry",
        description: "Full details for a catalog id (e.g. 'oc/hero-spotlight', 'aceternity/spotlight-new'), including the source library's install notes and gotchas.",
        inputSchema: z.object({ id: z.string() }),
      },
      async ({ id }) => {
        const entry = (await getCatalog()).find((e) => e.id === id)
        if (!entry) return { ...json({ error: `No catalog entry "${id}". Use search_components.` }), isError: true }
        const source = (await getSources()).find((s) => s.meta.slug === entry.source)
        const gotchas = source?.body.match(/## Gotchas\s+([\s\S]*?)(\n## |$)/)?.[1]?.trim()
        return json({ ...entry, sourceInfo: source ? { ...source.meta, gotchas } : undefined, page: `${SITE_URL}/components/${entry.id}` })
      }
    )

    server.registerTool(
      "list_design_systems",
      {
        title: "List design systems",
        description: "All DESIGN.md design systems available as installable shadcn themes (tokens + Google fonts + type scale + DESIGN.md).",
        inputSchema: z.object({}),
      },
      async () =>
        json(
          (await getDesignSystems()).map((s) => ({
            slug: s.slug,
            name: s.name,
            description: s.description,
            fonts: s.fonts,
            radius: s.radius,
            modes: s.modes,
            install: `npx shadcn@latest add ${s.registryItem}`,
            preview: `${SITE_URL}/design-systems/${s.slug}`,
          }))
        )
    )

    server.registerTool(
      "get_design_system",
      {
        title: "Get a DESIGN.md",
        description: "The full DESIGN.md (tokens + brand guidance + do's/don'ts + agent prompt) for a design system slug. Save it as ./DESIGN.md in the project if not installing via shadcn.",
        inputSchema: z.object({ slug: z.string() }),
      },
      async ({ slug }) => {
        const ds = await getDesignSystem(slug)
        if (!ds) return { ...json({ error: `Unknown design system "${slug}". Use list_design_systems.` }), isError: true }
        return { content: [{ type: "text" as const, text: `Install: npx shadcn@latest add ${ds.meta.registryItem}\n\n${ds.raw}` }] }
      }
    )

    server.registerTool(
      "get_setup_instructions",
      {
        title: "Project setup instructions",
        description: "How to wire a Next.js project to the shared design infra: shadcn init, the registries block for components.json (@design-infra, @aceternity, @magicui, …), theme install, MCP and optional tools.",
        inputSchema: z.object({}),
      },
      async () =>
        json({
          registries: await getRegistriesPreset(),
          steps: [
            "Read /integrate/raw. Inspect the stack and existing brand; connect MCP or HTTP before installing anything.",
            "For selected compatible React components, merge only the required registry into existing components.json; review shadcn initialization if absent.",
            "Only if a new design system is requested: install its selected theme (see list_design_systems)",
            'Add to CLAUDE.md/AGENTS.md: "Follow ./DESIGN.md. Before building UI, call the design-infra MCP (plan_ui / search_components) and install components instead of writing them."',
            "Optional: npx skills add Jakubantalik/transitions.dev (motion recipes); pnpm add -D agentation (visual feedback → agent)",
          ],
          gallery: SITE_URL,
        })
    )

    server.registerTool(
      "get_toolchain",
      {
        title: "Toolchain: what to install, ranked",
        description:
          "The available CLIs, MCP servers, agent skills, registries and packages, ranked by tier (1 foundation · 2 default libraries · 3 situational · 4 paid/keyed), with why, when to use, setup steps, required secrets and verify commands — plus the one-command bootstrap that applies it to the current repo. Use when starting a new repo, when the user says 'set up design infra', or to decide which library to reach for first.",
        inputSchema: z.object({
          max_tier: z.number().int().min(1).max(4).optional().describe("Only tools up to this tier"),
          track: z.enum(["foundation", "components", "motion", "agent", "dev-tool", "paid"]).optional(),
        }),
      },
      async ({ max_tier, track }) => {
        const raw = JSON.parse(await readFile(path.join(process.cwd(), "catalog/toolchain.json"), "utf8")) as {
          tools: { tier: number; track: string; rank: number }[]
        }
        const tools = configureData(raw).tools
          .filter((t) => (!max_tier || t.tier <= max_tier) && (!track || t.track === track))
          .sort((a, b) => a.rank - b.rank)
        return json({
          bootstrap: {
            command: `curl -fsSL ${SITE_URL}/bootstrap.mjs -o /tmp/di.mjs && node /tmp/di.mjs --connect --client claude-code`,
            options: "--tier 1-4 (default 2) · --only a,b · --skip a,b · --theme <slug> · --init-next · --dry-run · --list",
            secrets: "~/.config/design-infra/secrets.env (KEY=value, outside any repo). Keyed tools are skipped until their key exists.",
          },
          tools,
        })
      }
    )

    server.registerTool(
      "list_sources",
      {
        title: "List component sources",
        description: "Every library/tool the catalog draws from, with licence, access level and install method.",
        inputSchema: z.object({}),
      },
      async () => json((await getSources()).map((s) => s.meta))
    )
  },
  {
    serverInfo: { name: "design-infra", version: "0.2.0" },
    instructions:
      configureText("Shared design infrastructure. Setup instructions: https://design-infra.vercel.app/integrate/raw. Pasted URL or screenshot? Inspect it with your browser/image tools, follow https://design-infra.vercel.app/reference/raw, then call match_reference with observed patterns. It does not fetch URLs or inspect images. Replacing a section? Identify its type and required behavior, call propose_options with replace/restyle intent, and show distinct approaches with live examples. Preserve the existing brand and stack. Working on ONE component ('animate this', 'I don't like this', 'add a loading state')? call propose_options and show the user the options with links before installing. For new pages/apps: call plan_ui with the product brief (include how it should FEEL) first, show live options and recommend a direction. Wait for the user's pick unless they already authorized you to choose and build. Install the chosen components; install a new design system only when requested. Write custom UI for catalog gaps. browse_moods when the user describes a vibe; search_components for specific needs; get_inspiration for saved sites; find_references when the user wants ideas for a pattern or none of the options fit (galleries with exact links)."),
  }
)

export { handler as GET, handler as POST, handler as DELETE }
