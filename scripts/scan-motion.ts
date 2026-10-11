/**
 * Read each entry's registry source once and record HOW it moves — imports and code-level motion
 * signals (requestAnimationFrame, WebGL context, @keyframes, whileInView, prefers-reduced-motion…).
 * build-catalog feeds these to lib/catalog/tags.ts so `motion.technique` / `reducedMotion` come from
 * the code, not just the name.
 *
 *   pnpm scan-motion                      # entries not scanned yet
 *   pnpm scan-motion --only magicui       # one source
 *   pnpm scan-motion --force              # rescan everything
 *
 * Output: catalog/motion-signals.json  { "<id>": { "imports": [...], "flags": [...] } }
 * Only derived flags are stored — never upstream source. Sources without a public registry
 * (OriginKit, Aceternity blocks behind sign-in, transitions.dev) are inferred from metadata alone.
 * Run `pnpm catalog` afterwards.
 */
import { existsSync } from "node:fs"
import { readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { parseArgs } from "node:util"

import { type CatalogEntry, CatalogEntry as EntrySchema } from "../lib/catalog/schema"
import { MOTION_FLAGS, type MotionSignals } from "../lib/catalog/tags"

const ROOT = process.cwd()
const OUT = path.join(ROOT, "catalog/motion-signals.json")
const CONCURRENCY = 8

const { values: args } = parseArgs({
  options: { only: { type: "string", multiple: true }, force: { type: "boolean", default: false } },
})

/** Registry item JSON for an entry, or null when the source has no public registry. */
function registryUrl(e: CatalogEntry): string | null {
  switch (e.source) {
    case "aceternity":
      return e.kind === "component" ? `https://ui.aceternity.com/registry/${e.name}.json` : null // blocks need sign-in
    case "magicui":
      return `https://magicui.design/r/${e.name}.json`
    case "react-bits": {
      const cli = /@react-bits\/(\S+)/.exec(e.install)?.[1]
      return cli ? `https://reactbits.dev/r/${cli}.json` : null
    }
    case "cult-ui":
      return `https://www.cult-ui.com/r/${e.name}.json`
    case "motion-primitives":
      return `https://motion-primitives.com/c/${e.name}.json`
    case "kibo-ui":
      return `https://www.kibo-ui.com/r/${e.name}.json`
    case "beautifui":
      return `https://www.beautifului.dev/r/${e.name}.json`
    case "smoothui":
      return `https://smoothui.dev/r/${e.name}.json`
    case "originui":
      return `https://coss.com/origin/r/${e.name}.json`
    case "shadcn":
      return `https://ui.shadcn.com/r/styles/new-york-v4/${e.name}.json`
    case "originkit":
      // No registry, but component pages embed the source in their RSC payload (page sections don't).
      return e.kind === "block" || e.kind === "tool" ? null : `https://www.originkit.dev/components/${e.name}`
  }
  return null
}

/** OriginKit page → the first ("base" preset) source file embedded in its `self.__next_f.push` chunks. */
function originkitCode(html: string): string | null {
  for (const m of html.matchAll(/self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)/g)) {
    let chunk: string
    try {
      chunk = JSON.parse(`"${m[1]}"`) as string
    } catch {
      continue
    }
    if (chunk.length > 300 && /from "react"/.test(chunk) && /export (default )?function/.test(chunk)) return chunk
  }
  return null
}

const FLAG_RE: Record<(typeof MOTION_FLAGS)[number], RegExp> = {
  webgl:
    /getContext\(\s*["'`](?:webgl2?|experimental-webgl)|WebGL(?:2)?RenderingContext|WebGLRenderer|gl_FragColor|gl_Position|fragmentShader|from ["'](?:three|ogl|@react-three\/fiber|postprocessing|@paper-design\/shaders-react|cobe|gl-matrix|metal-fx)["']/,
  webgpu: /navigator\.gpu|from ["']vgpu["']/,
  canvas: /getContext\(\s*["'`]2d|from ["'](?:canvas-confetti|@tsparticles\/[a-z-]+|matter-js|thinking-orbs)["']/,
  raf: /requestAnimationFrame/,
  keyframes: /@keyframes|\banimation(?:Name)?:\s*["'`{]|animation-name|animate-\[|\banimate-(?:spin|pulse|ping|bounce|marquee|shimmer|shine|ripple|meteor|aurora|gradient|orbit|border|beam|shake|wiggle|float|grid)/,
  transition: /\btransition(?:-all|-colors|-opacity|-transform|-\[|\b)|transition:\s|transitionDuration/,
  // SVG motion (a static feTurbulence noise texture is not)
  svgAnim: /pathLength|strokeDashoffset|stroke-dashoffset|<animate(?:Motion|Transform)?\b|motion\.path|offsetPath|offset-path/,
  reduced: /prefers-reduced-motion|useReducedMotion|motion-reduce:|motion-safe:|reducedMotion/,
  hover: /whileHover|onMouseEnter|onHoverStart|onPointerEnter|group-hover[:/]|:hover\b/,
  pointer: /onMouseMove|onPointerMove|["']mousemove["']|["']pointermove["']|useMouse\b/,
  press: /whileTap|onTapStart|onPointerDown|onMouseDown|active:(?:scale|translate)/,
  inview: /whileInView|useInView|IntersectionObserver/,
  // scroll-LINKED animation only (a generic scroll listener in a carousel or navbar does not count)
  scroll: /useScroll\b|scrollYProgress|scrollXProgress|ScrollTrigger|from ["']lenis|animation-timeline:\s*(?:scroll|view)/,
  loop: /repeat:\s*(?:Infinity|-1)|\binfinite\b|setInterval\(/,
  drag: /\bdrag(?:=|\s*:|Constraints|Elastic|Snap)|onDrag\b|onDragEnd|useDrag\b|@use-gesture|@dnd-kit|onPanStart|setPointerCapture/,
  presence: /AnimatePresence|layoutId|data-\[state=(?:open|closed|active|checked)\]:animate|\banimate-(?:in|out)\b/,
  spring: /type:\s*["']spring["']|useSpring\b|stiffness/,
  mount: /\binitial=\{|gsap\.(?:from|fromTo)\(|useAnimate\(/,
}

const IMPORT_RE = /\bfrom\s+["']([^"'./][^"']*)["']|\bimport\(\s*["']([^"'./][^"']*)["']\s*\)/g
const pkg = (spec: string) => (spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0])
/** Imports worth recording: animation / rendering runtimes, not icons or utilities. */
const INTERESTING = /^(motion|framer-motion|gsap|@gsap\/react|three|ogl|@react-three\/[a-z-]+|postprocessing|@paper-design\/shaders-react|cobe|gl-matrix|vgpu|matter-js|lenis|canvas-confetti|@tsparticles\/[a-z-]+|simplex-noise|border-beam|thinking-orbs|metal-fx|react-fast-marquee|@use-gesture\/react|@dnd-kit\/[a-z-]+|embla-carousel[a-z-]*|vaul|sonner|rough-notation|react-rough-notation)$/

export function signalsFromCode(code: string): MotionSignals {
  const imports = new Set<string>()
  for (const m of code.matchAll(IMPORT_RE)) {
    const p = pkg(m[1] ?? m[2])
    if (INTERESTING.test(p)) imports.add(p === "framer-motion" ? "motion" : p)
  }
  const flags = MOTION_FLAGS.filter((f) => FLAG_RE[f].test(code))
  return { imports: [...imports].sort(), flags }
}

async function fetchCode(url: string): Promise<string | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20_000) })
      if (res.status === 404 || res.status === 401 || res.status === 403) return null
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const text = await res.text()
      if (url.startsWith("https://www.originkit.dev/")) return originkitCode(text)
      if (!text.trimStart().startsWith("{")) return null // some registries answer 200 with an HTML page
      const item = JSON.parse(text) as { files?: { content?: string }[]; css?: unknown; cssVars?: unknown; tailwind?: unknown }
      if (!item.files?.some((f) => f.content)) return null
      return [...item.files.map((f) => f.content ?? ""), JSON.stringify(item.css ?? {}), JSON.stringify(item.cssVars ?? {}), JSON.stringify(item.tailwind ?? {})].join("\n")
    } catch (err) {
      if (attempt === 2) {
        console.warn(`  ! ${url}: ${(err as Error).message}`)
        return null
      }
      await new Promise((r) => setTimeout(r, 1_000 * (attempt + 1)))
    }
  }
  return null
}

/** Our own blocks: read the files in registry/oc/blocks/<name>/. */
async function localCode(name: string): Promise<string | null> {
  const dir = path.join(ROOT, "registry/oc/blocks", name)
  if (!existsSync(dir)) return null
  const files = (await readdir(dir)).filter((f) => /\.(tsx?|css)$/.test(f))
  return (await Promise.all(files.map((f) => readFile(path.join(dir, f), "utf8")))).join("\n")
}

async function main() {
  const entries: CatalogEntry[] = []
  for (const f of (await readdir(path.join(ROOT, "catalog/generated"))).filter((f) => f.endsWith(".json")).sort())
    for (const raw of JSON.parse(await readFile(path.join(ROOT, "catalog/generated", f), "utf8")) as unknown[])
      entries.push(EntrySchema.parse(raw))
  const blocks = JSON.parse(await readFile(path.join(ROOT, "registry/oc/blocks/registry.json"), "utf8")) as { items: { name: string }[] }
  for (const b of blocks.items)
    entries.push(EntrySchema.parse({ id: `oc/${b.name}`, source: "oc", name: b.name, title: b.name, kind: "block", categories: ["misc"], access: "free", install: "" }))

  const out: Record<string, MotionSignals> = existsSync(OUT) ? JSON.parse(await readFile(OUT, "utf8")) : {}
  const todo = entries.filter(
    (e) => (!args.only || args.only.includes(e.source)) && (args.force || !out[e.id]) && (e.source === "oc" || registryUrl(e))
  )
  console.log(`scanning ${todo.length} entries…`)
  let done = 0
  const queue = [...todo]
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      for (let e = queue.shift(); e; e = queue.shift()) {
        const code = e.source === "oc" ? await localCode(e.name) : await fetchCode(registryUrl(e)!)
        if (code) out[e.id] = signalsFromCode(code)
        if (++done % 100 === 0) console.log(`  ${done}/${todo.length}`)
      }
    })
  )
  // One line per entry: diffable, and small enough to grep. Entries gone from the catalog are dropped.
  const known = new Set(entries.map((e) => e.id))
  const ids = Object.keys(out)
    .filter((id) => known.has(id))
    .sort()
  await writeFile(OUT, `{\n${ids.map((id) => `  ${JSON.stringify(id)}: ${JSON.stringify(out[id])}`).join(",\n")}\n}\n`)
  console.log(`✓ motion signals: ${ids.length} entries → catalog/motion-signals.json (run pnpm catalog)`)
}

if (process.argv[1]?.endsWith("scan-motion.ts")) main()
