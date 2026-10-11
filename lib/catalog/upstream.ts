/**
 * Where each upstream source demos its items. Shared by scripts/thumbnails.ts (what to screenshot)
 * and lib/catalog/tags.ts (the clickable `live` link an agent shows before installing).
 */
import { entryPage, SITE_URL } from "./links"
import type { CatalogEntry } from "./schema"

type EntryRef = Pick<CatalogEntry, "id" | "source" | "name" | "kind" | "docs">

/** libraries.dev package → its showcase page (libraries.dev/<page>.html). */
export const LIBRARIES_DEV_PAGES: Record<string, string> = {
  "border-beam": "beam",
  "thinking-orbs": "orbs",
  "metal-fx": "metal",
  "liquid-gooey": "gooey",
  "img-fx": "image",
  "voice-glow": "voice",
  "bot-avatars": "bots",
}

/** Beautiful UI atoms: shared building blocks with no demo section of their own. */
export const BEAUTIFUI_NO_DEMO = new Set(["button", "entity-chip", "glide-menu", "shimmer", "stream-text", "value-pill"])

/** Items whose docs page lives under another slug (the synced `docs` URL 404s). */
export const DOCS_ALIASES: Record<string, string> = {
  "cult-ui/bg-animated-fractal-dot-grid": "https://www.cult-ui.com/docs/components/bg-animated-fractal-grid",
  "magicui/client-tweet-card": "https://magicui.design/docs/components/tweet-card",
  "cult-ui/hero-color-panel": "https://www.cult-ui.com/docs/components/hero-color-panels",
  // Base UI primitives without a page of their own: the component that demos them
  "cult-ui/base-select": "https://www.cult-ui.com/docs/components/halo-select",
  "cult-ui/base-tooltip": "https://www.cult-ui.com/docs/components/apple-pro-display-xdr",
  // Aceternity registry names whose /components/<name> page 404s (docs live under the effect's page name)
  "aceternity/3d-card": "https://ui.aceternity.com/components/3d-card-effect",
  "aceternity/cover": "https://ui.aceternity.com/live-preview/cover-demo",
  "aceternity/globe": "https://ui.aceternity.com/components/github-globe",
  "aceternity/glowing-stars": "https://ui.aceternity.com/components/glowing-stars-effect",
  "aceternity/grid": "https://ui.aceternity.com/components/grid-and-dot-backgrounds",
  "aceternity/input": "https://ui.aceternity.com/components/signup-form",
  "aceternity/label": "https://ui.aceternity.com/components/signup-form",
  "aceternity/lamp": "https://ui.aceternity.com/components/lamp-effect",
  "aceternity/moving-line": "https://ui.aceternity.com/live-preview/moving-line",
  "aceternity/parallax-scroll-2": "https://ui.aceternity.com/components/parallax-scroll",
  "aceternity/shooting-stars": "https://ui.aceternity.com/components/shooting-stars-and-stars-background",
  "aceternity/stars-background": "https://ui.aceternity.com/components/shooting-stars-and-stars-background",
}

/** Registry items with no demo page anywhere upstream (checked) — better no `live` link than a 404. */
const NO_DEMO_PAGE = new Set(["cult-ui/bg-animated-gradient"])

const DOCS_PATTERNS: Record<string, (name: string) => string> = {
  magicui: (n) => `https://magicui.design/docs/components/${n}`,
  "cult-ui": (n) => `https://www.cult-ui.com/docs/components/${n}`,
  "kibo-ui": (n) => `https://www.kibo-ui.com/components/${n}`,
  "motion-primitives": (n) => `https://motion-primitives.com/docs/${n}`,
}

/** The item's docs page (with its demo pane), correcting known-bad synced URLs. */
export function docsPage(e: EntryRef): string | undefined {
  return DOCS_ALIASES[e.id] ?? e.docs ?? DOCS_PATTERNS[e.source]?.(e.name)
}

/**
 * The best interactive preview to click before choosing: a chrome-less live page where one exists,
 * otherwise the docs page with its demo. Falls back to `docs`.
 */
export function liveUrl(e: EntryRef): string | undefined {
  if (NO_DEMO_PAGE.has(e.id)) return undefined
  switch (e.source) {
    case "oc":
      if (e.kind === "template") return `${SITE_URL}/templates/${e.name}`
      if (e.kind === "theme") return `${SITE_URL}/design-systems/${e.name.replace(/^theme-/, "")}`
      return entryPage(e.id)
    case "aceternity":
      // Blocks have no docs page — their live preview is the demo; components demo on their docs page.
      return e.kind === "block"
        ? `https://ui.aceternity.com/live-preview/${e.name}`
        : (DOCS_ALIASES[e.id] ?? `https://ui.aceternity.com/components/${e.name}`)
    case "shadcn":
      return `https://ui.shadcn.com/view/new-york-v4/${e.name}`
    case "transitions":
      return `https://transitions.dev/detail.html?t=${e.name}`
    case "beautifui":
      return BEAUTIFUI_NO_DEMO.has(e.name) ? e.docs : `https://www.beautifului.dev/#${e.name}`
    case "librariesdev":
      return LIBRARIES_DEV_PAGES[e.name] ? `https://libraries.dev/${LIBRARIES_DEV_PAGES[e.name]}.html` : e.docs
  }
  // magicui, cult-ui, kibo-ui, motion-primitives, react-bits, originkit, originui (its category grid —
  // comps have no anchors), tools, inspiration: the docs page is the demo.
  return docsPage(e)
}
