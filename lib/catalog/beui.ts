import { z } from "zod"

const registrySchema = z.object({ items: z.array(z.object({
  name: z.string().regex(/^[a-z0-9-]+$/),
  type: z.enum(["registry:component", "registry:block"]),
  title: z.string(), description: z.string(), dependencies: z.array(z.string()).default([]),
})).min(1) })
const catalogSchema = z.object({ components: z.array(z.object({
  slug: z.string(), category: z.enum(["motion", "agents", "blocks", "charts"]), page_url: z.string().url(),
})).min(1) })

// Public documentation groups contain several independently installable registry items.
const GROUPS: [RegExp, string][] = [
  [/^button-/, "button"],
  [/^(hold|slide)-action-button$/, "expanding-arrow-button"],
  [/^morphing-lightbox$/, "image-viewer"],
  [/^select-morph$/, "select"], [/^popover-morph$/, "popover"],
  [/^(text-(scramble|reveal|shimmer|cascade)|chromatic-text-reveal)$/, "text-animation"],
  [/^(digit-swap|number-ticker|animated-number)$/, "number"],
  [/^action-swap-/, "action-swap"],
  [/^(smooth-scroll|scroll-progress)$/, "scroll-animation"],
  [/^range-slider-/, "range-slider"],
  [/^table-(editable|async)$/, "table"],
  [/^(reasoning-text|thinking-shimmer|agent-progress)$/, "loading-states"],
  [/^knockout-wheel$/, "knockout-bracket"],
  [/^morphing-search-chips$/, "morphing-search"],
  [/^attachment-upload$/, "file-upload"],
  [/^prediction-market-card$/, "prediction-market"],
  [/^not-found-/, "not-found"],
]

/** Strip registry file bodies and require a known public documentation target. */
export function beuiRegistryItems(registry: unknown, catalog: unknown) {
  const items = registrySchema.parse(registry).items
  const docs = new Map(catalogSchema.parse(catalog).components.map((item) => {
    if (new URL(item.page_url).origin !== "https://beui.dev") throw new Error("beUI documentation left the free source")
    return [item.slug, item]
  }))
  if (new Set(items.map((item) => item.name)).size !== items.length) throw new Error("Duplicate beUI registry item")
  return items.map((item) => {
    const slug = docs.has(item.name) ? item.name : GROUPS.find(([pattern]) => pattern.test(item.name))?.[1]
    const doc = slug ? docs.get(slug) : undefined
    // These registry-only scroll helpers are documented as motion recipes.
    if (!doc && /^(parallax|scroll-to|scroll-reveal)$/.test(item.name)) {
      return { ...item, docs: "https://beui.dev/docs/motion-patterns", group: "scroll-animation", section: "motion" }
    }
    if (!doc) throw new Error(`No public beUI documentation for ${item.name}; review its group before syncing`)
    return { ...item, docs: doc.page_url, group: doc.slug, section: doc.category }
  })
}
