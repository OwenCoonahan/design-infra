/**
 * Motion / integration / live tags — answers "I want THIS to animate (on hover, subtly)" and "show me
 * it first". Every catalog entry gets:
 *
 *   integration  drop-in | wrapper | recipe — how it's applied to an existing UI
 *   appliesTo    component categories it upgrades (wrappers/recipes) or replaces (drop-ins)
 *   motion       { triggers, intensity, technique, cost, reducedMotion? } — absent = static
 *   live         the clickable interactive demo (lib/catalog/upstream.ts)
 *
 * Sources of truth, in precedence order (same as moods):
 *   catalog/curated.json  >  inferTags() below (name/description/deps + catalog/motion-signals.json,
 *   the code-level signals `pnpm scan-motion` reads from each registry item)
 *
 * Tune the RULES here when tags look off; hand-tag in curated.json when one entry is special.
 */
import type { CatalogEntry, Category, Integration, Motion, MotionIntensity, MotionTechnique, MotionTrigger } from "./schema"
import { liveUrl } from "./upstream"

export const MOTION_FLAGS = [
  "webgl",
  "webgpu",
  "canvas",
  "raf",
  "keyframes",
  "transition",
  "svgAnim",
  "reduced",
  "hover",
  "pointer",
  "press",
  "inview",
  "scroll",
  "loop",
  "drag",
  "presence",
  "spring",
  "mount",
] as const
export type MotionFlag = (typeof MOTION_FLAGS)[number]
/** What `pnpm scan-motion` found in an entry's registry source (catalog/motion-signals.json). */
export type MotionSignals = { imports: string[]; flags: MotionFlag[] }

export type TagInput = Pick<
  CatalogEntry,
  "id" | "source" | "name" | "title" | "description" | "kind" | "categories" | "tags" | "dependencies" | "docs"
>
export type InferredTags = { integration?: Integration; appliesTo: Category[]; motion?: Motion; live?: string }

// ---------------------------------------------------------------------------
// technique
// ---------------------------------------------------------------------------

/** npm package → technique. Matched against `dependencies` and scanned imports. */
const DEP_TECHNIQUE: [RegExp, MotionTechnique][] = [
  [/^(three|three-globe|ogl|postprocessing|@react-three\/.+|@paper-design\/shaders-react|cobe|vgpu|gl-matrix|metal-fx|img-fx|face-api\.js)(@.*)?$/, "webgl"],
  [/^(canvas-confetti|@tsparticles\/.+|matter-js|thinking-orbs|bot-avatars|voice-glow|simplex-noise)(@.*)?$/, "canvas"],
  [/^(gsap|@gsap\/react)(@.*)?$/, "gsap"],
  [/^(motion|framer-motion|motion\/react)(@.*)?$/, "motion"],
  [/^(rough-notation|react-rough-notation|liquid-gooey)(@.*)?$/, "svg"],
  [/^(border-beam|react-fast-marquee|tw-animate-css)(@.*)?$/, "css"],
  [/^@dnd-kit\/.+$/, "js"],
]
/** Heavy runtimes that make an effect expensive regardless of technique. */
const HEAVY_DEPS = /^(three|three-globe|ogl|postprocessing|@react-three\/.+|matter-js|@tsparticles\/.+|lenis|face-api\.js|vgpu)(@.*)?$/

const TECHNIQUE_ORDER: MotionTechnique[] = ["webgl", "canvas", "gsap", "motion", "svg", "css", "js"]

// ---------------------------------------------------------------------------
// triggers — matched against "name title description tags" (lower-case, hyphens → spaces as well)
// ---------------------------------------------------------------------------

const TRIGGER_RULES: [RegExp, MotionTrigger[]][] = [
  // Every matching rule contributes; triggers are then ordered by where their word first appears (name first).
  [/\b(cursor|pointer (trail|follow)|follows? (the |your )?(mouse|pointer|cursor)|mouse ?move|mousemove|mouse[- ]driven|swarm|repel|proximity|crosshair)/, ["cursor"]],
  [/\b(magnet(ic)?|tilt(ed|s)?|spotlight card|card spotlight|glare card|direction aware|3d card|3d pin|3d hover|3d tilt|wobble|evervault|lens|hover parallax|reacts? to (the )?(cursor|pointer|mouse))\b/, ["hover", "cursor"]],
  [/\b(hover(s|ed|ing)?|focus cards|peek|link preview|glimpse|hover card|tooltip|dock)\b/, ["hover"]],
  [/\b(click(s|ed)?|press(ed|es)?|tap(s|ped)?|ripple button|hold|confetti|spark|cool mode|burst|like button|heart|sling|fuse|stateful button|copy button)\b/, ["press"]],
  // "scroll" alone is ambiguous (marquees "scroll" forever) — require scroll-linked wording
  [/\b(on scroll|scroll[- ]?(linked|driven|triggered|based|progress|reveal|velocity|animation|effect|stack|expand|float|spy|text|wave|bulge)|as you scroll|while scrolling|scrolled|scroll y|scroll down|parallax|sticky|tracing|hides on scroll|resizes? on scroll)/, ["scroll"]],
  [/\b(drag(gable|s|ging)?|swipe(s|able)?|fling|flick|sortable|kanban|deck|compare|comparison|shredder|crumple|lanyard|tears? off|by hand|grab(s|bed)?|pull(s|ed)? back|slide[- ]to[- ](confirm|unlock|pay|commit))\b/, ["drag"]],
  [/\b(marquee|aurora|loop(s|ing)?|orbit(s|ing)?|beams?|meteors?|spinner|loader|shimmer(ing|s)?|shiny|shine|pulse|pulsating|flicker(ing|s)?|glitch|waves?|stars? (background|field|fall)|starfield|shooting stars|glowing stars|twinkl\w*|sparkles?|particles?|rotating|spinning|rotate|flip(s|ping)? (words|through)|text flip|word rotate|cycles? through|split flap|infinite|endless(ly)?|forever|gradient animation|animated gradient|noise|grain|plasma|lightning|vortex|lamp|thinking|breath(e|es|ing)|globe|rain|snow|fire|flame|smoke|drift(s|ing)?|ticker tape|equalizer|radar|scan(ner|ning)?|matrix|jitter(y)?|squiggl\w*|moves? around|travel(s|ling|ing)? (along|around)|real[- ]?time|autoplay|infinite scroll|scroll(s|ing)? (horizontally|infinitely|endlessly|forever|continuously)|opposite directions|continuous(ly)?|auto[- ]advanc\w*|every \d+ ?s)\b/, ["loop"]],
  [/\b(fade|blur fade|blur text|reveal(s|ed)?|appear(s)?|in ?view|text generate|generate effect|typewriter|typing|text type|stagger(ed|s)?|entrance|animated list|animated group|animated content|text animate|text effect|split text|rise(s)?|emerge|unfold(s)?|letter drop|count ?up|number ticker|draw(s|ing)? (on|itself|themselves)|on mount)\b/, ["enter"]],
  [/\b((?<!empty )state(s)?|stateful|success|toggle|toggler|switch|tabs?|accordion|disclosure|morph(ing|s)?|dialog|modal|popover|expandable|expand(s|ing)?|collapse|collapsible|number|counter|ticker|progress|stepper|checkbox|check|segmented|dynamic island|theme switcher|icon swap|transition panel|tree|drawer|side panel|notification|toast|stream(ing|ed)?|status|skeleton|wizard|rating|radio|select|menu|loading|queued|generating|done state)\b/, ["state"]],
]

/** Code-level fallback when the words say nothing (most specific first). */
const FLAG_TRIGGERS: [MotionFlag, MotionTrigger][] = [
  ["scroll", "scroll"],
  ["inview", "enter"],
  ["pointer", "cursor"],
  ["drag", "drag"],
  ["loop", "loop"],
  ["presence", "state"],
  ["hover", "hover"],
  ["press", "press"],
  ["mount", "enter"],
]

// ---------------------------------------------------------------------------
// intensity
// ---------------------------------------------------------------------------

/** Big visual moments. CSS-only effects matching these words are capped at medium. */
const EXPRESSIVE =
  /\b(particles?|physics|gravity|explod(e|es|ing)|burst|shatter(ed)?|vortex|hyperspace|tunnel|galaxy|confetti|splash|fluid sim\w*|ballpit|lanyard|macbook scroll|container scroll|hero parallax|scroll stack|dome|sphere|globe|cube|crumple|game|tetris|snake|arkanoid|black ?hole|lightning|fireworks?|warp|distort(ion)?|immersive|cinematic|ferrofluid|plasma|smoke|flame|fire)\b/
const SUBTLE =
  /\b(drag and drop|sortable|kanban|reorder(ing)?|fade|blur fade|in ?view|shimmer|shiny|shine|number|ticker|counter|count ?up|tabs?|toggle|switch|checkbox|check|tooltip|accordion|disclosure|ripple button|skeleton|spinner|progress|icon swap|text states|badge|underline|highlight(er)?|typing|stream(ing)?|status|pulse|pulsating|subtle|gentle|minimal|soft|noise|grain|progressive blur|gradual blur|hover card|link preview|dot pattern|grid pattern|thinking|shake|segmented|select|radio|rating|copy|success|loading)\b/

// ---------------------------------------------------------------------------
// integration
// ---------------------------------------------------------------------------

/** What a wrapper is typically put on, by effect family. */
const FAMILY: Record<string, Category[]> = {
  enter: ["text-effect", "hero", "card", "image", "features"],
  text: ["text-effect", "hero", "cta"],
  border: ["card", "button", "input"],
  pointer: ["card", "button", "image"],
  marquee: ["logo-cloud", "testimonials", "carousel"],
  edge: ["image", "carousel", "card"],
  click: ["button"],
  indicator: ["tabs", "navigation", "button"],
  list: ["toast", "agent-ui", "card"],
  scroll: ["hero", "image", "features"],
  tooltip: ["tooltip", "text-effect"],
  overlay: ["hero", "card", "background"],
}

/**
 * Known wrappers — they take YOUR element as children and add behaviour. Keyed by name (any source)
 * or `source/name` (wins). Value: family key or explicit categories.
 */
const WRAPPERS: Record<string, keyof typeof FAMILY | Category[]> = {
  // entrance / reveal
  "blur-fade": "enter",
  "in-view": "enter",
  "animated-group": ["features", "card", "logo-cloud", "testimonials"],
  "animated-content": "enter",
  "fade-content": "enter",
  "gradual-blur": "edge",
  "progressive-blur": "edge",
  "edge-blur": "edge",
  // borders & glows
  "border-beam": "border",
  "shine-border": "border",
  "border-trail": "border",
  "moving-border": ["button", "card"],
  "star-border": ["button", "card"],
  "electric-border": "border",
  "border-glow": "border",
  "glowing-effect": ["card", "bento", "button"],
  "hover-border-gradient": ["button"],
  "background-gradient": ["card", "button"],
  "neon-gradient-card": ["card"],
  "magic-card": ["card"],
  "glow-effect": ["card", "button"],
  "metal-fx": ["button", "badge", "text-effect"],
  "liquid-gooey": ["button", "navigation", "tabs"],
  meteors: ["card", "testimonials"],
  "noise-background": ["card", "cta", "button"],
  backlight: ["image"],
  // pointer
  magnetic: "pointer",
  magnet: "pointer",
  "dodge-field": ["button"],
  tilt: ["card", "image"],
  "3d-card": ["card", "image"],
  "wobble-card": ["card"],
  "card-spotlight": ["card"],
  "spotlight-card": ["card"],
  "motion-primitives/spotlight": ["card"],
  "glare-hover": "pointer",
  "glare-card": ["card"],
  "comet-card": ["card"],
  "following-pointer": ["card"],
  "svg-mask-effect": ["card", "hero"],
  pointer: ["card", "button"],
  lens: ["image"],
  "pixel-transition": ["card", "image"],
  // click
  "cool-mode": "click",
  confetti: "click",
  "click-spark": ["button", "card"],
  // indicator / panels / lists
  "animated-background": "indicator",
  "transition-panel": ["tabs", "card"],
  "animated-list": "list",
  // marquees that take children
  "magicui/marquee": "marquee",
  "kibo-ui/marquee": "marquee",
  "infinite-slider": "marquee",
  // scroll
  "container-scroll-animation": ["hero", "image", "dashboard"],
  "tracing-beam": ["blog", "features"],
  "scroll-float": "text",
  "scroll-reveal": "text",
  // text that wraps your copy
  "hero-highlight": "text",
  "pointer-highlight": "text",
  highlighter: "text",
  cover: "text",
  "link-preview": "tooltip",
  "tooltip-card": "tooltip",
  "kibo-ui/glimpse": "tooltip",
  "glass-surface": ["card", "button", "navigation"],
  "metallic-paint": ["logo-cloud", "illustration", "text-effect"],
  noise: "overlay",
}

/** Text effects that animate YOUR copy are wrappers (their name says text/heading/letters)… */
const TEXT_WRAPPER = /text|heading|headline|letter|typ(e|ing|ewriter)|highlight|word/
/** …unless they swap between several strings or replace a number. */
const TEXT_DROPIN = /rotat|flip|loop|morph|carousel|circular|curved|spinning|split-flap|flipping|word-|cycle|marquee|velocity|ring|passage|count|number|counter|ticker/

/** motion.dev example → the components the technique is typically applied to. */
const MOTION_APPLIES: Record<string, Category[]> = {
  "shared-layout-animation": ["tabs", "navigation", "button"],
  "layout-animation": ["card", "accordion", "table"],
  "layout-anchor": ["card", "image"],
  "exit-animation": ["modal", "toast", "card"],
  "enter-animation": ["card", "hero", "text-effect"],
  "animate-presence-modes": ["modal", "tabs", "carousel"],
  "scroll-triggered": ["features", "card", "text-effect", "image"],
  "scroll-linked": ["scroll-effect", "hero"],
  "scroll-linked-with-spring": ["scroll-effect", "hero"],
  "scroll-hide-header": ["navigation"],
  "scroll-horizontal": ["carousel", "features"],
  "scroll-track-element-in-viewport": ["scroll-effect", "navigation"],
  "reorder-items": ["table", "card"],
  "reorder-grid": ["card", "image"],
  drag: ["card", "carousel"],
  "drag-constraints": ["card", "carousel"],
  "path-drawing": ["illustration", "loader", "badge"],
  "path-morphing": ["illustration", "button"],
  "rolling-text-button": ["button"],
  "characters-remaining": ["input", "form"],
  "loading-circle-spinner": ["loader"],
  "loading-jumping-dots": ["loader"],
  "loading-three-dots-pulse": ["loader"],
  "follow-pointer-with-spring": ["cursor"],
  "text-scroll-word-reveal": ["text-effect", "hero"],
  "clerk-conditional-field": ["form", "input"],
  "variants": ["navigation", "card"],
  gestures: ["button", "card"],
}

/** transitions.dev recipe → the component it polishes. */
const RECIPE_APPLIES: Record<string, Category[]> = {
  accordion: ["accordion", "faq"],
  "avatar-group-hover": ["badge", "button", "team"],
  "banner-stacking": ["toast", "cta"],
  "card-resize": ["card"],
  "card-tilt": ["card", "image"],
  "checkbox-check": ["input", "form"],
  "error-state-shake": ["form", "input"],
  "icon-swap": ["button", "navigation"],
  "input-clear-dissolve": ["input"],
  "learn-more-hover": ["button", "cta"],
  "like-button": ["button"],
  "matrix-loader": ["loader"],
  "menu-dropdown": ["navigation", "modal"],
  modal: ["modal"],
  "notification-badge": ["badge", "toast"],
  "number-pop-in": ["stats"],
  "page-side-by-side": ["form", "sidebar", "modal"],
  "panel-reveal": ["card", "sidebar"],
  "plus-menu-morph": ["button", "navigation"],
  "reasoning-stream": ["agent-ui", "ai-chat"],
  "shimmer-text": ["text-effect", "loader", "agent-ui"],
  "skeleton-reveal": ["loader", "card"],
  "spinning-counter": ["stats"],
  "streaming-text": ["ai-chat", "text-effect"],
  "success-check": ["button", "form"],
  "tabs-sliding": ["tabs"],
  "text-states-swap": ["button", "text-effect"],
  "texts-reveal": ["hero", "text-effect", "empty-state"],
  "thinking-states": ["agent-ui", "loader"],
  toast: ["toast"],
  toggle: ["input", "form"],
  tooltip: ["tooltip"],
}

// ---------------------------------------------------------------------------
// static vs animated
// ---------------------------------------------------------------------------

/** App-UI sources + our @oc blocks (hand-tagged in curated.json): static unless the code proves otherwise. */
const STATIC_SOURCES = new Set(["shadcn", "originui", "kibo-ui", "oc"])
/**
 * Verified source-wide prefers-reduced-motion handling: transitions.dev recipes (documented, kept in
 * every recipe) and Beautiful UI (foundation.css zeroes every animation/transition under reduce).
 */
const SOURCE_REDUCED_MOTION = new Set(["transitions", "beautifui"])
/**
 * Per-item verified handling, carried as an entry tag by the sync adapter: SmoothUI's `hasReducedMotion`
 * (llms-components.json; every `true` checked against the code — useReducedMotion / prefers-reduced-motion).
 */
const REDUCED_MOTION_TAG = "reduced-motion"
/** Every item animates. */
const ANIMATED_SOURCES = new Set(["react-bits", "transitions", "motion-primitives", "librariesdev", "motion"])
/** Checked first: items in animated sources that don't actually move (verified in their demos). */
const STATIC_IDS = new Set(["react-bits/glass-surface"])
/** Clearly static by name (mockups, patterns, layout helpers) unless the code animates. */
const STATIC_NAMES =
  /^(progressive-blur|backlight|noise-texture|android|iphone|safari|mac-screen|mock-browser-window|avatar-circles|file-icons|file-tree|label|grid|scales|dot-pattern|grid-pattern|hexagon-pattern|striped-pattern|tweet-card|client-tweet-card|tweet-grid|bg-image-texture|texture-card|texture-overlay|neumorph-eyebrow|squiggle-arrow|svg-shapes|svg-bands|gradient-heading|halo-field|speech-bubble|code-comparison|code-block|bg-media|folded-card|shadow-card|vote-tally|feature-voting|choice-poll|feature-poll|ai-instructions|prompt-library|dither-image|bento-grid)$/
/** Words that say "this moves". */
const ANIM_WORDS =
  /anim|motion|glare|tilt|perspective|marquee|scroll|parallax|reveal|fade|typewriter|typing|ticker|count ?up|shimmer|shine|shiny|glow|beam|meteor|sparkle|aurora|ripple|wave|spotlight|orbit|particle|shader|webgl|flip|morph|rotat|spin|loader|loading|pulse|tilt|magnet|drag|swipe|dock|globe|cursor|trail|confetti|gooey|liquid|flicker|glitch|scramble|decrypt|encrypt|shuffle|wobble|bounce|lamp|vortex|lightning|stream|thinking|transition|stagger|generate|dynamic island|expand/
/** Code evidence strong enough to call an app-UI component animated. */
const STRONG_FLAGS: MotionFlag[] = ["webgl", "webgpu", "keyframes", "svgAnim"]
const MOTION_IMPORTS = /^(motion|framer-motion|gsap|@gsap\/react|three|ogl|@react-three\/.+|postprocessing|@paper-design\/shaders-react|cobe|vgpu|matter-js|lenis|canvas-confetti|@tsparticles\/.+|border-beam|thinking-orbs|metal-fx|react-fast-marquee|gl-matrix)$/

// ---------------------------------------------------------------------------
// OriginKit — no public registry; its homepage tag + name are all we have (calibrated on ~90 item pages)
// ---------------------------------------------------------------------------

function originkitTechnique(tag: string, hay: string): MotionTechnique {
  switch (tag) {
    case "background-animation":
      return /ascii|glyph|character|data strings|formula|text wave|dither effect|dotmatrix|blinking/.test(hay) ? "canvas" : "webgl"
    case "cursor":
      return /circle|dot cursor|axis|spin|text button|user ?cursor/.test(hay) ? "js" : "canvas"
    case "games":
      return "canvas"
    case "button":
      return "motion"
    case "border":
      return /electric/.test(hay) ? "canvas" : "js"
    case "image":
      if (/pixel|ascii|dot|particle|money rain/.test(hay)) return "canvas"
      return /liquid|glass|distort|ripple|fluid|burn|frost|curl|lenticular|facet|brick|broken|ember|wax|rubber|scan|noise wipe|dither/.test(hay)
        ? "webgl"
        : "js"
    case "image-gallery":
      return /web gl|liquid glass|tunnel|sphere|depth|ring|rotunda|eye|path/.test(hay) ? "webgl" : "motion"
    case "text":
      return /particle|dust|vaporize|dither|pixel|led|dot scatter|smoky|inkbleed|noise|distortion|light shaft|crystal|emoji/.test(hay)
        ? "canvas"
        : "motion"
    default: // interactive-elements, loader, animation
      return /ascii|dither|svg|newton|xylophone|floating ?icons|kinetic text|text fall|bubble text|arrow cross/.test(hay) ? "canvas" : "webgl"
  }
}

// ---------------------------------------------------------------------------
// inference
// ---------------------------------------------------------------------------

const uniq = <T>(xs: T[]) => [...new Set(xs)]

function haystack(e: TagInput) {
  const raw = `${e.name} ${e.title} ${e.description} ${e.tags.join(" ")}`.toLowerCase()
  return `${raw} ${raw.replace(/[-_/]/g, " ")}`
}

function inferIntegration(e: TagInput, hay: string, animated: boolean): { integration?: Integration; appliesTo: Category[] } {
  const own = e.categories.filter((c) => c !== "misc")
  const fallback = own.length ? own : e.categories
  if (e.kind === "theme" || e.kind === "inspiration" || e.kind === "tool") return { appliesTo: [] }
  if (e.source === "transitions")
    return { integration: "recipe", appliesTo: RECIPE_APPLIES[e.name] ?? own.filter((c) => c !== "transition") }
  // motion.dev examples are techniques you apply to your own markup with the free `motion` package
  if (e.source === "motion")
    return { integration: "recipe", appliesTo: MOTION_APPLIES[e.name] ?? own.filter((c) => c !== "transition") }
  const known = WRAPPERS[`${e.source}/${e.name}`] ?? WRAPPERS[e.name]
  if (known) return { integration: "wrapper", appliesTo: typeof known === "string" ? FAMILY[known] : known }
  if (animated) {
    const textEffect = e.categories.includes("text-effect") && TEXT_WRAPPER.test(e.name) && !/button|card/.test(e.name)
    if (textEffect && !TEXT_DROPIN.test(e.name) && e.kind !== "block") return { integration: "wrapper", appliesTo: FAMILY.text }
    if (/\bwrapper\b|wraps? (any|your)|around any|any (children|child|element)|applied to svg/.test(hay)) {
      const fam = /border|glow|beam/.test(hay)
        ? "border"
        : /fade|reveal|scroll|entrance/.test(hay)
          ? "enter"
          : /hover|magnet|tilt|cursor|pointer/.test(hay)
            ? "pointer"
            : null
      return { integration: "wrapper", appliesTo: fam ? FAMILY[fam] : fallback }
    }
    if (e.source === "originkit" && e.tags.includes("border")) return { integration: "wrapper", appliesTo: FAMILY.border }
  }
  return { integration: "drop-in", appliesTo: fallback }
}

function isAnimated(e: TagInput, hay: string, s: MotionSignals | undefined): boolean {
  if (e.kind === "theme" || e.kind === "inspiration" || e.kind === "tool") return false
  if (STATIC_IDS.has(e.id)) return false
  const deps = [...e.dependencies, ...(s?.imports ?? [])]
  const strong = deps.some((d) => MOTION_IMPORTS.test(d.replace(/(.)@.*$/, "$1"))) || !!s?.flags.some((f) => STRONG_FLAGS.includes(f))
  if (STATIC_SOURCES.has(e.source)) {
    // radix open/close transitions, recharts' bar highlight and setInterval clocks don't count
    if (e.source === "shadcn") return false
    return strong || deps.some((d) => /^@dnd-kit\//.test(d)) // drag-and-drop reordering
  }
  if (ANIMATED_SOURCES.has(e.source)) return true
  if (e.source === "originkit") return e.kind !== "block" // page sections: no code to read, assume static
  if (STATIC_NAMES.test(e.name)) return strong && !!s?.flags.some((f) => f !== "transition" && f !== "hover")
  if (strong) return true
  if (s?.flags.some((f) => ["raf", "loop", "inview", "scroll", "presence", "spring", "mount", "drag", "pointer"].includes(f))) return true
  if (ANIM_WORDS.test(hay)) return true
  // only CSS transition/hover classes: a micro-interaction when the name says what changes
  const css = s?.flags.includes("hover") || s?.flags.includes("transition")
  return !!css && /\b(hover|interactive|tabs?|switch|toggle|segmented|accordion|select|button)\b/.test(hay)
}

function inferTechnique(e: TagInput, hay: string, s: MotionSignals | undefined): MotionTechnique[] {
  const out: MotionTechnique[] = []
  for (const d of [...e.dependencies, ...(s?.imports ?? [])])
    for (const [re, t] of DEP_TECHNIQUE) if (re.test(d)) out.push(t)
  const f = new Set(s?.flags ?? [])
  if (f.has("webgl") || f.has("webgpu")) out.push("webgl")
  if (f.has("canvas") && f.has("raf")) out.push("canvas")
  if (f.has("svgAnim")) out.push("svg")
  if (/\b(shader|webgl|webgpu|raymarch(ed)?|three\.?js)\b/.test(hay) && !out.length) out.push("webgl")
  if (e.source === "originkit" && !s) out.push(originkitTechnique(e.tags[0] ?? "", hay)) // unscanned only
  // "on a dotted canvas" is layout talk; only explicit canvas rendering counts
  if (/\bcanvas[- ](based|2d|rendered|animation|effect|loader|particles?|grid)|rendered on (a )?canvas|<canvas>/.test(hay) && !out.includes("webgl"))
    out.push("canvas")
  if (/\b(svg (path|filter|turbulence)|gooey|stroke[- ]draw)/.test(hay) && !out.length) out.push("svg")
  let tech = uniq(out)
  if (!tech.length) {
    if (f.has("keyframes") || f.has("transition")) tech = ["css"]
    else if (f.has("raf") || f.has("pointer")) tech = ["js"]
    else if (e.source === "aceternity" || e.source === "cult-ui" || e.source === "motion-primitives" || e.source === "motion") tech = ["motion"]
    // SmoothUI is built on motion/react; scanned code with no motion import or CSS animates by hand (timers, WAAPI)
    else if (e.source === "smoothui") tech = [s ? "js" : "motion"]
    else if (e.source === "react-bits") tech = [f.size ? "js" : "css"]
    else tech = ["css"]
  }
  // A bare rAF loop with no library or canvas is hand-rolled JS.
  if (f.has("raf") && !tech.some((t) => t !== "css") && !f.has("keyframes")) tech = ["js"]
  return TECHNIQUE_ORDER.filter((t) => tech.includes(t))
}

function inferTriggers(e: TagInput, hay: string, s: MotionSignals | undefined, tech: MotionTechnique[]): MotionTrigger[] {
  let out: MotionTrigger[] = []
  // Order by where the word first appears: the name and the start of the description say what it mainly does.
  const hits: [number, MotionTrigger[]][] = []
  for (const [re, ts] of TRIGGER_RULES) {
    const m = re.exec(hay)
    if (m) hits.push([m.index, ts])
  }
  for (const [, ts] of hits.sort((a, b) => a[0] - b[0])) out.push(...ts)
  // typing carets and mouse-driven parallax aren't cursor effects / scroll effects
  if (/typ(e|ing|ewriter)|caret/.test(hay) && !/follow|pointer|mouse|trail/.test(hay)) out = out.filter((t) => t !== "cursor")
  if (/mouse[- ]driven|mousemove|pointer[- ]driven/.test(hay) && !/scroll/.test(e.name)) out = out.filter((t) => t !== "scroll")
  const cats = new Set(e.categories)
  const interactive = /interactive|hover|on click|clicked|reacts?/.test(hay)
  const isBg =
    cats.has("background") &&
    (e.kind === "effect" || /background|backdrop|\bbg\b/.test(hay) || e.tags.includes("background-animation") || e.tags.includes("backgrounds"))
  if (isBg && !interactive && !out.includes("loop")) out.unshift("loop")
  // shaders animate continuously
  if (tech.includes("webgl") && !out.includes("loop") && (isBg || cats.has("hero") || cats.has("3d") || e.kind === "effect")) out.unshift("loop")
  if (cats.has("loader") && !out.length) out.push("loop")
  if (cats.has("cursor") && !out.includes("cursor") && !/typ(e|ing|ewriter)/.test(hay)) out.unshift("cursor")
  if (e.source === "originkit") {
    // OriginKit names are terse: its homepage tag says what kind of thing it is
    const tag = e.tags[0]
    if (tag === "games") out.unshift("press")
    if (tag === "button" && !out.includes("hover")) out.unshift("hover")
    if (tag === "border" || tag === "animation" || tag === "interactive-elements") out.push("loop")
    if (!s) {
      if (tag === "interactive-elements") out.push("cursor")
      if (tag === "image" && !out.length) out.push("hover", "cursor")
      if (tag === "image-gallery" && !out.length) out.push("drag")
    }
  }
  // code-level evidence the words don't mention
  const scrollName = /(^|-)scroll(-|$)/.test(e.name) && !/infinite-scroll|scroll-area/.test(e.name)
  if ((s?.flags.includes("scroll") || scrollName) && !out.includes("scroll")) out.unshift("scroll") // scroll-linked (useScroll, ScrollTrigger)
  if ([...e.dependencies, ...(s?.imports ?? [])].some((d) => d.startsWith("@dnd-kit/")) && !out.includes("drag")) out.unshift("drag")
  if (s?.flags.includes("pointer") && (isBg || cats.has("3d")) && !out.includes("cursor")) out.push("cursor")
  if (!out.length) out.push(...FLAG_TRIGGERS.filter(([flag]) => s?.flags.includes(flag)).map(([, t]) => t).slice(0, 2))
  if (!out.length) out.push(cats.has("background") ? "loop" : "enter")
  return uniq(out).slice(0, 3)
}

function inferIntensity(e: TagInput, hay: string, tech: MotionTechnique[], triggers: MotionTrigger[]): MotionIntensity {
  const cssOnly = tech.every((t) => t === "css")
  if (tech.includes("webgl")) return "expressive"
  if (EXPRESSIVE.test(hay)) return cssOnly ? "medium" : "expressive"
  if (SUBTLE.test(hay)) return "subtle"
  const cats = new Set(e.categories)
  if (tech.includes("canvas") && (cats.has("background") || cats.has("cursor") || cats.has("3d"))) return "expressive"
  if (e.source === "originkit" && !cssOnly && ["background-animation", "interactive-elements", "animation", "games"].includes(e.tags[0] ?? ""))
    return "expressive"
  if ((cats.has("cursor") || cats.has("3d")) && !cssOnly) return "expressive"
  if (triggers.length === 1 && (triggers[0] === "press" || triggers[0] === "state" || triggers[0] === "hover") && cssOnly) return "subtle"
  return "medium"
}

function inferCost(e: TagInput, s: MotionSignals | undefined, tech: MotionTechnique[]): Motion["cost"] {
  if (tech.includes("webgl") || tech.includes("canvas")) return "high"
  if ([...e.dependencies, ...(s?.imports ?? [])].some((d) => HEAVY_DEPS.test(d))) return "high"
  if (tech.every((t) => t === "css")) return "low"
  return "medium"
}

/** Deprecated aliases ("Deprecated alias for halo-badge") should carry their target's tags. */
export function aliasOf(e: Pick<CatalogEntry, "source" | "description">): string | undefined {
  const m = /deprecated alias for ([a-z0-9-]+)/i.exec(e.description)
  return m ? `${e.source}/${m[1]}` : undefined
}

/**
 * Infer motion / integration / live for one entry. `signals` = catalog/motion-signals.json[id] if scanned.
 * `reducedMotion` is only set when verified: transitions.dev recipes (documented), a `reduced-motion` entry
 * tag (SmoothUI's hasReducedMotion), and code that checks prefers-reduced-motion / useReducedMotion /
 * motion-reduce: (scan). Otherwise unknown.
 */
export function inferTags(e: TagInput, signals?: MotionSignals): InferredTags {
  const hay = haystack(e)
  const animated = isAnimated(e, hay, signals)
  const { integration, appliesTo } = inferIntegration(e, hay, animated)
  let motion: Motion | undefined
  if (animated) {
    const technique = inferTechnique(e, hay, signals)
    const triggers = inferTriggers(e, hay, signals, technique)
    const reducedMotion =
      SOURCE_REDUCED_MOTION.has(e.source) || e.tags.includes(REDUCED_MOTION_TAG) || signals?.flags.includes("reduced") ? true : undefined
    motion = {
      triggers,
      intensity: inferIntensity(e, hay, technique, triggers),
      technique,
      cost: inferCost(e, signals, technique),
      ...(reducedMotion ? { reducedMotion } : {}),
    }
  }
  return { integration, appliesTo, motion, live: liveUrl(e) }
}


/** `hover+cursor·subtle·css` — the compact form used in CATALOG.md and terminal output. */
export function motionLabel(m: Motion | undefined): string {
  if (!m) return "—"
  return `${m.triggers.join("+")}·${m.intensity}·${m.technique.join("+")}${m.reducedMotion ? "·rm" : ""}`
}
