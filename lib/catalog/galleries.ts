import type { Category } from "./schema"
export const FEATURED_TYPES = [
  ["loader", "Loading"],
  ["button", "Buttons"],
  ["card", "Cards"],
  ["navigation", "Navigation"],
  ["hero", "Heroes"],
  ["pricing", "Pricing"],
  ["table", "Tables"],
  ["chart", "Charts"],
] as const
export const SECTION_TYPES = new Set<string>([
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
  "dashboard",
])
export function categoryLabel(category: string) {
  return (
    FEATURED_TYPES.find(([key]) => key === category)?.[1] ??
    category.replaceAll("-", " ").replace(/^./, (c) => c.toUpperCase())
  )
}
/** Remove known waiting-state false positives without promoting them in recommendation ranking. */
export function correctCategories(name: string, source: string, categories: Category[]): Category[] {
  const target: Category | undefined = /progressive-blur|scroll-progress|reading-progress/.test(name)
    ? "scroll-effect"
    : /orbit-images|orbital-image-wheel/.test(name)
      ? "image"
      : /orbiting-circles/.test(name) || (source === "react-bits" && name === "orb")
        ? "background"
        : undefined
  return target ? [...new Set([target, ...categories.filter((c) => c !== "loader" && c !== "misc")])] : categories
}
