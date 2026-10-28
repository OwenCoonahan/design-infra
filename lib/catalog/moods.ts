/**
 * Mood vocabulary — the "feeling" axis of the catalog. Every catalog entry, design system and
 * inspiration site carries 0–3 moods so agents can pick designs by the emotion a product should evoke.
 *
 * Sources of truth, in precedence order:
 *   catalog/curated.json `moods`  >  inspiration/<slug>/README.md  >  keyword RULES  >  SOURCE_DEFAULTS
 * Design systems declare `moods:` in their DESIGN.md front matter.
 */

export const MOODS = {
  calm: {
    label: "Calm",
    description: "Quiet, spacious, low motion; lets content breathe.",
    words: ["calm", "quiet", "serene", "peaceful", "relaxed", "gentle", "spacious", "zen", "mindful", "wellness"],
  },
  minimal: {
    label: "Minimal",
    description: "Sparse, monochrome, restrained; nothing decorative.",
    words: ["minimal", "minimalist", "clean", "simple", "sparse", "understated", "restrained", "monochrome"],
  },
  refined: {
    label: "Refined",
    description: "Polished micro-detail and subtle motion — Linear/Vercel/Stripe craft.",
    words: ["refined", "clean", "polished", "crafted", "precise", "sleek", "sharp", "crisp", "elegant", "sophisticated", "linear", "stripe", "vercel", "apple"],
  },
  technical: {
    label: "Technical",
    description: "Dev-tool energy: mono type, terminals, data density, grids.",
    words: ["technical", "developer", "dev tool", "devtool", "engineering", "api", "cli", "terminal", "data", "dense", "infrastructure", "infra"],
  },
  editorial: {
    label: "Editorial",
    description: "Typographic, serif-led, content-first; magazines and essays.",
    words: ["editorial", "magazine", "publication", "blog", "newsletter", "essay", "journal", "serif", "literary", "storytelling"],
  },
  warm: {
    label: "Warm",
    description: "Friendly, human, soft colours and rounded shapes.",
    words: ["warm", "friendly", "human", "approachable", "cozy", "welcoming", "soft", "kind", "inviting"],
  },
  playful: {
    label: "Playful",
    description: "Bouncy motion, colour, toy-like interactions, delight.",
    words: ["playful", "fun", "bouncy", "whimsical", "delightful", "quirky", "colorful", "colourful", "cute", "toy", "gamified"],
  },
  premium: {
    label: "Premium",
    description: "Dark, cinematic, glow and depth; feels expensive.",
    words: ["premium", "luxury", "luxurious", "high-end", "cinematic", "expensive", "exclusive", "dramatic", "dark"],
  },
  futuristic: {
    label: "Futuristic",
    description: "Sci-fi glow, beams, 3D, space — the AI-launch look.",
    words: ["futuristic", "sci-fi", "scifi", "space", "cosmic", "neon", "cyber", "ai-native", "next-gen", "glowing"],
  },
  experimental: {
    label: "Experimental",
    description: "Art-directed, shaders/WebGL, unusual interactions.",
    words: ["experimental", "artsy", "art-directed", "avant-garde", "weird", "creative", "award", "awwwards", "shader", "webgl", "immersive"],
  },
  bold: {
    label: "Bold",
    description: "Loud, high-contrast, big type, brutalist confidence.",
    words: ["bold", "loud", "brutal", "brutalist", "raw", "punchy", "high-contrast", "confident", "striking", "manifesto"],
  },
  retro: {
    label: "Retro",
    description: "Pixel, dither, ASCII, CRT, nostalgic computing.",
    words: ["retro", "vintage", "nostalgic", "pixel", "8-bit", "ascii", "dither", "crt", "y2k", "old-school"],
  },
  organic: {
    label: "Organic",
    description: "Nature, photography, fluid/gooey shapes, earthy tones.",
    words: ["organic", "natural", "nature", "earthy", "fluid", "flowing", "photographic", "outdoors", "botanical"],
  },
  trustworthy: {
    label: "Trustworthy",
    description: "Conventional, enterprise-safe, clear hierarchy; finance/health/B2B.",
    words: ["trustworthy", "trust", "enterprise", "corporate", "professional", "serious", "secure", "fintech", "finance", "health", "b2b", "reliable"],
  },
} as const

export type Mood = keyof typeof MOODS
export const MOOD_NAMES = Object.keys(MOODS) as Mood[]

/** Name/description/tag keywords → moods (first 3 distinct matches win, then source defaults fill). */
export const RULES: [RegExp, Mood][] = [
  [/terminal|code|cli|encrypted|matrix|hacker|log|diff|json|api/, "technical"],
  [/ascii|dither|pixel|crt|8-?bit|retro|glitch|scanline/, "retro"],
  [/shader|webgl|three|fluid-sim|metaball|liquid|chromatic|distort|noise-field|warp/, "experimental"],
  [/aurora|beam|meteor|star|sparkle|galaxy|space|globe|orbit|neon|glow|spotlight|lamp|vortex/, "futuristic"],
  [/gooey|blob|wave|flow|organic|leaf|petal|water|ink/, "organic"],
  [/confetti|bounce|jelly|wobble|emoji|sticker|cursor-party|squiggly|colou?rful|rainbow|bot-avatar|game/, "playful"],
  [/serif|editorial|magazine|article|blog|newsletter|quote|typewriter/, "editorial"],
  [/brutal|marquee-big|big-text|huge|massive|stamp/, "bold"],
  [/blur-fade|fade|reveal|shimmer|subtle|ticker|morph|layout|spring/, "refined"],
  [/pricing|table|form|auth|login|settings|billing|invoice|dashboard|kpi|stat/, "trustworthy"],
  [/minimal|simple|plain|clean/, "minimal"],
  [/soft|glass|frost|pastel|rounded|friendly/, "warm"],
]

/** Each source's overall feel when nothing more specific matches. */
export const SOURCE_DEFAULTS: Record<string, Mood[]> = {
  "mantine-charts": ["calm", "technical", "refined"],
  "mui-charts": ["technical", "refined"],
  unovis: ["technical", "refined"],
  victory: ["technical", "refined"],
  "frappe-charts": ["minimal", "trustworthy"],
  layerchart: ["refined", "technical"],
  chartist: ["minimal", "technical"],
  billboard: ["technical", "refined"],
  "ag-charts": ["technical", "refined"],
  vchart: ["technical", "refined"],
  "vis-network": ["technical", "refined"],
  "react-force-graph": ["technical", "refined"],
  "lightweight-charts": ["technical", "refined"],
  bklit: ["refined", "technical"],
  tremor: ["minimal", "refined", "technical"],
  oc: ["refined"],
  aceternity: ["premium", "futuristic"],
  magicui: ["refined", "playful"],
  smoothui: ["refined", "playful"],
  "react-bits": ["experimental", "playful"],
  "motion-primitives": ["refined", "minimal"],
  "cult-ui": ["playful", "refined"],
  "kibo-ui": ["trustworthy", "technical"],
  originui: ["minimal", "trustworthy"],
  shadcn: ["minimal", "trustworthy"],
  beautifui: ["calm", "refined"],
  beui: ["refined", "playful"],
  "loading-dev": ["refined", "minimal"],
  "beui-pro": ["refined", "technical"],
  transitions: ["refined"],
  motion: ["refined", "playful"],
  originkit: ["experimental", "premium"],
  librariesdev: ["playful", "futuristic"],
  agentation: ["technical"],
  anatomy: ["technical", "refined", "playful"],
  "recharts": ["technical", "refined"],
  "chartjs": ["technical", "refined"],
  "echarts": ["technical", "refined"],
  "nivo": ["technical", "refined"],
  "visx": ["technical", "refined"],
  "observable-plot": ["editorial", "technical", "refined"],
  "vega-lite": ["technical", "refined"],
  "plotly": ["technical", "refined"],
  "uplot": ["technical", "refined"],
  "antv-g2": ["technical", "refined"],
  "react-flow": ["technical", "refined"],
  "cytoscape": ["technical", "refined"],
  "sigma": ["technical", "refined"],
  "antv-g6": ["technical", "refined"],
  "d3": ["technical", "refined"],
  "mermaid": ["technical", "minimal"],
  "21st": [],
  inspiration: [],
}

export function inferMoods(e: { source: string; name: string; title: string; description: string; tags: string[] }): Mood[] {
  const hay = `${e.name} ${e.title} ${e.description} ${e.tags.join(" ")}`.toLowerCase()
  const out: Mood[] = []
  for (const [re, mood] of RULES) if (re.test(hay) && !out.includes(mood)) out.push(mood)
  for (const m of SOURCE_DEFAULTS[e.source] ?? []) if (out.length < 3 && !out.includes(m)) out.push(m)
  return out.slice(0, 3)
}

/** Free text ("calm, premium fintech app") → moods mentioned or implied. */
export function moodsFromText(text: string): Mood[] {
  const t = ` ${text.toLowerCase()} `
  const hits: Mood[] = []
  for (const m of MOOD_NAMES) {
    if (MOODS[m].words.some((w) => new RegExp(`[^a-z]${w.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}[^a-z]`).test(t)))
      hits.push(m)
  }
  return hits
}
