import { hostedPreview } from "../lib/catalog/previews"
import { SITE_URL } from "../lib/config"
import { galleryBase } from "./lib/gallery-base"
import { linkOnlyMedia } from "../lib/catalog/media-policy"
/**
 * Give every catalog entry without a `preview` a thumbnail.
 *
 *   pnpm thumbnails                                   # all sources, gallery at http://localhost:3000
 *   pnpm thumbnails --only oc --base http://localhost:3300
 *   pnpm thumbnails --only transitions --force        # re-shoot existing files
 *   pnpm thumbnails --id magicui/globe --id kibo-ui/gantt --force   # just these entries
 *
 * Strategies (per source):
 *   oc           the chrome-less gallery route /preview/oc/<name> (needs a running gallery: --base)
 *   transitions  the demo stage on transitions.dev/detail.html?t=<slug>
 *   beautifui    each component's demo surface (section#<name>) on the beautifului.dev homepage
 *   librariesdev each library's showcase card on the libraries.dev homepage
 *   aceternity   ui.aceternity.com/live-preview/<name> (blocks + the few components without an image)
 *   originkit    no screenshot — the upstream gallery image cdn.originkit.dev/components/<name>-gallery.png
 *   originui     each comp's grid cell (div[data-slot=comp-N]) on its coss.com/origin/<category> page
 *   shadcn       chrome-less ui.shadcn.com/view/new-york-v4/<name> (charts + signup; the rest have upstream PNGs)
 *   magicui, cult-ui, kibo-ui, motion-primitives, react-bits
 *                the first demo pane on the item's docs page, zoomed onto its content
 *   kind "tool"  the entry's docs page
 *
 * Output: public/thumbnails/<source>/<name>.webp (≈800px wide) + catalog/thumbnails.json ({ id: absolute URL }).
 * Local files map to ${THUMBNAIL_BASE_URL:-https://design-infra.vercel.app}/thumbnails/<source>/<name>.webp.
 * Run `pnpm catalog` afterwards — build-catalog merges the manifest into entries that have no preview.
 *
 * Uses the system Chrome through puppeteer-core (CHROME_PATH overrides /usr/bin/google-chrome).
 */
import { existsSync, unlinkSync } from "node:fs"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { parseArgs } from "node:util"

import puppeteer, { type Browser, type Page } from "puppeteer-core"

import type { CatalogEntry } from "../lib/catalog/schema"
import { BEAUTIFUI_NO_DEMO, docsPage, LIBRARIES_DEV_PAGES, liveUrl } from "../lib/catalog/upstream"

const ROOT = process.cwd()
const MANIFEST = path.join(ROOT, "catalog/thumbnails.json")
const OUT_DIR = path.join(ROOT, "public/thumbnails")
const PUBLIC_BASE = (process.env.THUMBNAIL_BASE_URL ?? SITE_URL).replace(/\/$/, "")

const VIEWPORT = { width: 1200, height: 750 }
/** Output width in px — a retina catalog card is ~600px, the detail page ~900px. */
const OUTPUT_WIDTH = 800
const QUALITY = 82
const CONCURRENCY = 3
const RETRIES = 2
const NAV_TIMEOUT = 45_000
/** Fonts + entrance animations. */
const SETTLE_MS = 1_500

const { values: args } = parseArgs({
  options: {
    only: { type: "string", multiple: true },
    id: { type: "string", multiple: true },
    base: { type: "string", default: "http://localhost:3000" },
    prune: { type: "boolean", default: false },
    force: { type: "boolean", default: false },
  },
})
const BASE = galleryBase(args.base!)

// ---------------------------------------------------------------------------
// plans
// ---------------------------------------------------------------------------

type Shot = {
  kind: "shot"
  id: string
  url: string
  /** Tried in order when `url` 404s (or shows `notFoundText`). */
  fallbacks?: string[]
  /** Treat a page containing this text as missing (sites that answer 200 for unknown items). */
  notFoundText?: string
  /** Capture this element instead of the viewport. */
  selector?: string
  /** Crop the element to this aspect ratio (centred, or anchored to the top). */
  aspect?: number
  anchor?: "center" | "top"
  /** Keep only this fraction of the element's height around its centre (zooms into small demos). */
  zoom?: number
  /**
   * Viewport shot zoomed onto the visible content inside this element (16:10, min 60% of the
   * viewport width) — small components don't end up as a speck in an empty 1200px frame.
   */
  fit?: string
  /**
   * With `selector`: zoom onto the visible content inside the element (at `aspect`, default 16:10,
   * min 45% of the element's width) — a small button doesn't end up a speck in a big demo pane.
   */
  tight?: boolean
  /** Sweep the pointer across the element before capturing (cursor trails, pointer-driven shaders). */
  hover?: boolean
  /** Hide the site's own floating chrome. */
  hide?: string
  /** Extra CSS injected before capturing (layout tweaks). */
  css?: string
  /** Defaults to VIEWPORT. */
  viewport?: { width: number; height: number }
  /** Extra settle time (video / WebGL pages). */
  settle?: number
  /** Shots sharing a `url` with batch=true are taken from ONE page load, one after another. */
  batch?: boolean
}
/** Upstream image candidates — the first that answers 200 with an image wins. */
type Probe = { kind: "probe"; id: string; candidates: string[] }
type Skip = { id: string; reason: string }

/** Aceternity components whose own live preview doesn't exist; shown via the demo that uses them. */
const ACETERNITY_DEMOS: Record<string, string[]> = {
  "shooting-stars": ["shooting-stars-and-stars-background-demo"],
  "stars-background": ["shooting-stars-and-stars-background-demo"],
  input: ["signup-form-demo"],
  label: ["signup-form-demo"],
}

/** The first demo pane on a docs page, zoomed onto what it renders. */
function docsDemo(id: string, url: string, selector: string, extra: Partial<Shot> = {}): Shot {
  return { kind: "shot", id, url, selector, tight: true, aspect: 16 / 10, settle: 1_000, ...extra }
}

/** Demos that render wrong in headless Chrome (software WebGL) — better no thumbnail than a misleading one. */
const BROKEN_HEADLESS: Record<string, string> = {
  "magicui/globe": "cobe WebGL globe renders as a black disc under SwiftShader",
  "magicui/icon-cloud": "icon canvas stays empty in headless Chrome (only the pause button renders)",
}

function planFor(e: CatalogEntry): Shot | Probe | Skip {
  if (linkOnlyMedia(e)) return { id: e.id, reason: "Link-only media policy: redistribution not established" }
  const hosted = hostedPreview(e.id)
  if (hosted) return {
    kind: "shot", id: e.id, url: new URL(hosted.src, BASE).href,
    // Capture the complete neutral stage: cropping a short centered demo to the frame's
    // aspect ratio would cut off its sides (and produce a poster unlike the live frame).
    selector: '[data-preview-surface="neutral"]', viewport: { width: hosted.width, height: hosted.height },
    aspect: hosted.width / hosted.height, settle: 1800,
  }
  const { id, name } = e
  if (BROKEN_HEADLESS[id]) return { id, reason: BROKEN_HEADLESS[id] }
  switch (e.source) {
    case "anatomy":
      return e.kind === "tool" || !e.live ? { id, reason: "Skill instructions, not a visual component" } : {
        kind: "shot", id, url: e.live, selector: ".live-stage", aspect: 16 / 10,
        settle: 2000,
      }

    case "originui": {
      // ~25 category pages, each a grid of every comp in it: shoot all cells from one load per page.
      if (!e.docs) return { id, reason: "no category page" }
      return {
        kind: "shot",
        id,
        url: e.docs,
        selector: `[data-slot="${name}"]`,
        batch: true,
        // Cells are wide strips (e.g. 385x166): give each at least 16:10 with the comp centred,
        // drop the cell borders and the hover-only copy / v0 buttons.
        css: `[data-slot^="comp-"] { aspect-ratio: 16 / 10; display: flex; flex-direction: column;
                justify-content: center; border-color: transparent !important; }
              [data-slot^="comp-"] > .absolute.top-2.right-2 { display: none !important; }
              [data-slot^="comp-"]:has(> header) { justify-content: flex-start; }
              [data-slot^="comp-"] > header { zoom: 1.5; }`, // navbars: at the top, legible after downscaling
        hide: "[data-sonner-toaster]", // the site header isn't sticky; navbar comps are <header>s themselves
        aspect: 16 / 10,
        anchor: "top", // tall items (tables, calendars) keep their top
        settle: 300,
      }
    }
    case "shadcn": {
      // Only charts and signup blocks lack the upstream /r/styles/new-york/<name>-light.png screenshot.
      const url = liveUrl(e)!
      if (name.startsWith("chart-")) {
        // The chart card stretches to the viewport; give it the width it has on ui.shadcn.com/charts.
        const width = name.includes("interactive") ? 960 : 460
        return {
          kind: "shot",
          id,
          url,
          css: `body > div:has(> [data-slot=card]) { max-width: ${width}px; margin: 48px auto; }`,
          fit: "body",
          settle: 2_500, // the resize re-runs Recharts' entrance animation
        }
      }
      return { kind: "shot", id, url, viewport: { width: 1440, height: 900 }, fit: "body" } // signup-0N
    }
    case "magicui":
      return docsDemo(id, docsPage(e)!, ".preview", {
        hide: "header, div:has(> .preview) > div:not(.preview)", // site header, "Open in v0" + replay
      })
    case "cult-ui":
      return docsDemo(id, docsPage(e)!, "[data-slot=component-preview] .preview", {
        hide: "header",
      })
    case "kibo-ui":
      return docsDemo(id, docsPage(e)!, '[role=tabpanel][id$="-content-preview"]', {
        // Dashed guide lines framing every demo + the pane's resize handle: would defeat `tight`.
        hide: 'header, [id$="-content-preview"] .absolute.border-dashed, [id$="-content-preview"] .bg-border.w-px',
      })
    case "motion-primitives":
      return docsDemo(id, docsPage(e)!, '[role=tabpanel][id$="-content-preview"]', {
        hide: "header",
      })
    case "react-bits":
      if (!e.docs) return { id, reason: "no reactbits.dev docs URL" }
      return docsDemo(id, docsPage(e)!, ".demo-container", {
        // Replay button; the backgrounds' fake hero overlay ("Demo Content") — show the effect itself.
        hide: "header, .demo-container > button.chakra-button, .background-demo-content",
        hover: /\/(backgrounds|animations)\//.test(e.docs), // cursor effects + pointer-reactive shaders
        settle: 3_000, // WebGL / GSAP
      })
    case "oc":
      // Iterates the catalog, so new OC_DEMOS entries are picked up automatically; no demo → 404 → skipped.
      return { kind: "shot", id, url: `${BASE}/preview/oc/${name}`, fit: "[data-preview-content]" }
    case "transitions":
      // ~880x460 stage with a small demo centred in it.
      return {
        kind: "shot",
        id,
        url: liveUrl(e)!,
        selector: "#detail-stage",
        zoom: 0.78,
        aspect: 16 / 10,
      }
    case "beautifui":
      if (BEAUTIFUI_NO_DEMO.has(name)) return { id, reason: "internal building block — no demo on beautifului.dev" }
      return {
        kind: "shot",
        id,
        url: "https://www.beautifului.dev/",
        selector: `section[id="${name}"] .primitive-demo-surface`,
        batch: true,
        settle: 2_000, // streaming demos restart when scrolled into view
      }
    case "librariesdev": {
      const page = LIBRARIES_DEV_PAGES[name]
      if (!page) return { id, reason: "no known libraries.dev page (add it to LIBRARIES_DEV_PAGES in lib/catalog/upstream.ts)" }
      return {
        kind: "shot",
        id,
        url: "https://libraries.dev/",
        selector: `article:has(a[href="/${page}.html"]) .card-stage`,
        aspect: 16 / 10,
        batch: true,
        settle: 1_000,
      }
    }
    case "aceternity": {
      // Blocks preview under their own name; components under their docs demo (`<name>-demo`).
      const live = (n: string) => `https://ui.aceternity.com/live-preview/${n}`
      const demos = ACETERNITY_DEMOS[name] ?? [`${name}-demo`, name]
      // A few "blocks" are really components whose own preview errors (background-lines).
      const [url, ...fallbacks] = (e.kind === "block" ? [name, `${name}-demo`] : demos).map(live)
      return {
        kind: "shot",
        id,
        url,
        fallbacks,
        notFoundText: "Something went wrong", // unknown names render an error page with HTTP 200
        hide: "nav.fixed, ol.fixed", // "← Blocks · name · Code" pill + toast region
        fit: "body", // many blocks are a small illustration in an empty page
        settle: 2_500, // scroll-in / blur-fade entrance animations
      }
    }
    case "originkit":
      if (e.kind !== "tool")
        return { kind: "probe", id, candidates: [`https://cdn.originkit.dev/components/${name}-gallery.png`] }
  }
  if (e.kind === "tool" && e.docs) return { kind: "shot", id, url: e.docs, settle: 1_000 }
  return { id, reason: `no thumbnail strategy for source "${e.source}" (kind ${e.kind})` }
}

// ---------------------------------------------------------------------------
// capture
// ---------------------------------------------------------------------------

class NotFound extends Error {}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const fileFor = (id: string) => path.join(OUT_DIR, `${id}.webp`) as `${string}.webp`
const publicUrlFor = (id: string) => `${PUBLIC_BASE}/thumbnails/${id}.webp`
type Rect = { x: number; y: number; width: number; height: number }

async function open(browser: Browser, job: Shot, url = job.url) {
  // A window per page, not a tab: in a shared window only the front tab is visible, and hidden tabs
  // get no requestAnimationFrame — entrance animations, GSAP and WebGL demos freeze mid-way.
  const page = await browser.newPage({ type: "window" })
  await page.setViewport({ ...(job.viewport ?? VIEWPORT), deviceScaleFactor: dprFor(job) })
  const res = await page.goto(url, { waitUntil: "load", timeout: NAV_TIMEOUT }).catch(async (err) => {
    await page.close()
    throw err
  })
  // Not res.ok(): pages revisited in the same browser answer 304 from its cache.
  if (res && res.status() >= 400) {
    await page.close()
    const msg = `HTTP ${res.status()} ${url}`
    throw res.status() === 404 ? new NotFound(msg) : new Error(msg)
  }
  // Looping video never goes fully idle — cap the wait.
  await page.waitForNetworkIdle({ idleTime: 500, concurrency: 2, timeout: 15_000 }).catch(() => undefined)
  await page.evaluate(() => document.fonts.ready.then(() => undefined))
  if (job.notFoundText && (await page.evaluate((t) => document.body.innerText.includes(t), job.notFoundText))) {
    await page.close()
    throw new NotFound(`"${job.notFoundText}" on ${url}`)
  }
  // Smooth scrolling would make scrollIntoView() return before the element is in place.
  await page.addStyleTag({ content: "html, body, * { scroll-behavior: auto !important; }" })
  return page
}

/** Union of everything visibly painted inside `selector` (text, media, filled / bordered / shadowed boxes). */
async function contentBox(page: Page, selector: string): Promise<Rect | null> {
  return page.$eval(selector, (root) => {
    const bg = getComputedStyle(root.parentElement ?? root).backgroundColor
    const rects: DOMRect[] = []
    // Skip hidden subtrees whole — e.g. hover-only toolbars (opacity-0 wrapper, visible buttons inside).
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, (n) => {
      if (n.nodeType !== Node.ELEMENT_NODE) return NodeFilter.FILTER_ACCEPT
      const cs = getComputedStyle(n as Element)
      const hidden = cs.visibility === "hidden" || cs.display === "none" || cs.opacity === "0"
      return hidden ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    })
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (n.nodeType === Node.TEXT_NODE) {
        if (!n.textContent?.trim()) continue
        const r = document.createRange()
        r.selectNodeContents(n)
        rects.push(r.getBoundingClientRect())
        continue
      }
      const el = n as Element
      const cs = getComputedStyle(el)
      const painted =
        /^(img|svg|canvas|video|input|textarea|select|button|iframe)$/i.test(el.tagName) ||
        (cs.backgroundColor !== "rgba(0, 0, 0, 0)" && cs.backgroundColor !== bg) ||
        cs.backgroundImage !== "none" ||
        parseFloat(cs.borderTopWidth) + parseFloat(cs.borderLeftWidth) > 0 ||
        cs.boxShadow !== "none"
      if (painted) rects.push(el.getBoundingClientRect())
    }
    const vw = window.innerWidth
    const vh = window.innerHeight
    let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity]
    for (const r of rects) {
      if (r.width < 1 || r.height < 1 || r.right < 0 || r.bottom < 0 || r.left > vw || r.top > vh) continue
      x0 = Math.min(x0, Math.max(0, r.left))
      y0 = Math.min(y0, Math.max(0, r.top))
      x1 = Math.max(x1, Math.min(vw, r.right))
      y1 = Math.max(y1, Math.min(vh, r.bottom))
    }
    return x1 > x0 ? { x: x0, y: y0, width: x1 - x0, height: y1 - y0 } : null
  })
}

/**
 * A region of `aspect` (default: the bounds' own) around `box` with padding, at least `minFrac` of the
 * bounds wide, clamped inside `bounds`. Without a box: the largest such region centred in the bounds.
 */
function fitRegion(box: Rect | null, bounds: Rect, aspect = bounds.width / bounds.height, pad = 40, minFrac = 0.6): Rect {
  const maxW = Math.min(bounds.width, bounds.height * aspect)
  const target = box ?? bounds
  const want = box ? Math.max(box.width + 2 * pad, bounds.width * minFrac, (box.height + 2 * pad) * aspect) : maxW
  // Content wider than the largest `aspect` region (a long headline in a short pane): go wider instead of cutting it.
  const fits = want <= maxW
  const w = fits ? want : Math.min(bounds.width, Math.max(maxW, box!.width + 2 * pad))
  const h = (fits ? w : maxW) / aspect
  const clamp = (v: number, min: number, max: number) => Math.min(Math.max(min, v), max)
  // Content taller than the region keeps its top (headings) rather than its middle.
  const y = box && box.height + 2 * pad > h ? box.y - pad : target.y + target.height / 2 - h / 2
  return {
    x: Math.round(clamp(target.x + target.width / 2 - w / 2, bounds.x, bounds.x + bounds.width - w)),
    y: Math.round(clamp(y, bounds.y, bounds.y + bounds.height - h)),
    width: Math.round(w),
    height: Math.round(h),
  }
}

/** Zoomed shots (element / fitted) render at 2x so crops stay crisp; plain viewport shots at 1x. */
const dprFor = (job: Shot) => (job.selector || job.fit ? 2 : 1)

/**
 * Screenshot a region (document CSS px) and write it as a webp OUTPUT_WIDTH wide.
 *
 * - captureBeyondViewport stays off: it resizes the viewport mid-capture, re-laying out vh-based
 *   pages and shifting the target (the region is in view already).
 * - The DPR is fixed when the page opens (changing it fires resize and restarts WebGL/entrance
 *   animations), and `clip.scale` is dropped by puppeteer without captureBeyondViewport — so we
 *   capture a PNG at the page's DPR and downscale + encode it with Chrome's own canvas (no sharp).
 */
async function shootRegion(page: Page, region: Rect, file: string) {
  const png = await page.screenshot({ type: "png", captureBeyondViewport: false, clip: region, encoding: "base64" })
  const resizer = await page.browser().newPage({ type: "window" })
  try {
    const { dataUrl, blank } = await resizer.evaluate(
      async (b64, width, quality) => {
        const img = new Image()
        img.src = `data:image/png;base64,${b64}`
        await img.decode()
        const scale = Math.min(1, width / img.naturalWidth)
        const canvas = document.createElement("canvas")
        canvas.width = Math.round(img.naturalWidth * scale)
        canvas.height = Math.round(img.naturalHeight * scale)
        const ctx = canvas.getContext("2d")!
        ctx.imageSmoothingQuality = "high"
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        // Luminance spread over the inner 80% (skips the demo pane's own border): ~0 = nothing rendered.
        const [w, h] = [canvas.width, canvas.height]
        const px = ctx.getImageData(Math.round(w * 0.1), Math.round(h * 0.1), Math.round(w * 0.8), Math.round(h * 0.8)).data
        let [lo, hi] = [255, 0]
        for (let i = 0; i < px.length; i += 4 * 7) {
          const l = 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]
          lo = Math.min(lo, l)
          hi = Math.max(hi, l)
        }
        return { dataUrl: canvas.toDataURL("image/webp", quality / 100), blank: hi - lo < 10 }
      },
      png,
      OUTPUT_WIDTH,
      QUALITY
    )
    // Retried like any other error: usually a demo that hadn't rendered yet (or only renders on hover).
    if (blank) throw new Error("blank capture: nothing rendered")
    await writeFile(file, Buffer.from(dataUrl.slice(dataUrl.indexOf(",") + 1), "base64"))
  } finally {
    await resizer.close()
  }
}

/** Styles already injected per page (batched shots share one page). */
const injected = new WeakMap<Page, Set<string>>()
async function injectCss(page: Page, css: string) {
  const done = injected.get(page) ?? new Set<string>()
  injected.set(page, done)
  if (done.has(css)) return
  done.add(css)
  await page.addStyleTag({ content: css })
}

async function capture(page: Page, job: Shot) {
  if (job.hide) await injectCss(page, `${job.hide} { display: none !important; }`)
  if (job.css) await injectCss(page, job.css)
  const viewport = { x: 0, y: 0, ...(job.viewport ?? VIEWPORT) }
  if (!job.selector) {
    await page
      .waitForFunction(() => [...document.images].every((i) => i.complete), { timeout: 10_000 })
      .catch(() => undefined)
    await sleep(SETTLE_MS + (job.settle ?? 0))
    const box = job.fit ? await contentBox(page, job.fit) : null
    const scroll = await page.evaluate(() => ({ x: window.scrollX, y: window.scrollY }))
    const region = box ? fitRegion(box, viewport) : viewport
    await shootRegion(page, { ...region, x: region.x + scroll.x, y: region.y + scroll.y }, fileFor(job.id))
    return
  }

  const element = await page.waitForSelector(job.selector, { timeout: 15_000 }).catch(() => null)
  if (!element) throw new NotFound(`no element ${job.selector}`)
  await element.scrollIntoView()
  // scrollIntoView centres the element; one taller than the viewport would lose its top (hero headings).
  await element.evaluate((el) => {
    const r = el.getBoundingClientRect()
    if (r.height > window.innerHeight) window.scrollBy(0, r.top)
  })
  await sleep(SETTLE_MS + (job.settle ?? 0)) // entrance animations often start on scroll
  const box = await element.boundingBox()
  if (!box || box.width < 10 || box.height < 10) throw new Error(`${job.selector} has no size`)
  if (job.hover) {
    for (let i = 0; i <= 20; i++) {
      const t = i / 20
      await page.mouse.move(box.x + box.width * (0.2 + 0.45 * t), box.y + box.height * (0.5 - 0.25 * Math.sin(t * Math.PI)))
      await sleep(30)
    }
    await sleep(500)
  }

  const scroll = await page.evaluate(() => ({ x: window.scrollX, y: window.scrollY }))
  if (job.tight) {
    // Only the part of the element that's on screen can be captured (captureBeyondViewport is off).
    const vis = {
      x: Math.max(0, box.x),
      y: Math.max(0, box.y),
      width: Math.min(viewport.width, box.x + box.width) - Math.max(0, box.x),
      height: Math.min(viewport.height, box.y + box.height) - Math.max(0, box.y),
    }
    const content = await contentBox(page, job.selector)
    // Nothing detected (e.g. mid-animation, opacity 0): the whole pane.
    const region = content ? fitRegion(content, vis, job.aspect ?? 16 / 10, 40, 0.45) : vis
    await shootRegion(page, { ...region, x: region.x + scroll.x, y: region.y + scroll.y }, fileFor(job.id))
    return
  }

  let { x, y, width, height } = box
  if (job.zoom) {
    const h = height * job.zoom
    y += (height - h) / 2
    height = h
  }
  if (job.aspect) {
    if (width / height > job.aspect) {
      const w = height * job.aspect
      x += (width - w) / 2
      width = w
    } else {
      const h = width / job.aspect
      if (job.anchor !== "top") y += (height - h) / 2
      height = h
    }
  }
  await shootRegion(page, { x: x + scroll.x, y: y + scroll.y, width, height }, fileFor(job.id))
}

async function withRetries(fn: () => Promise<void>) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn()
    } catch (err) {
      if (err instanceof NotFound || attempt >= RETRIES) throw err
      await sleep(2_000 * (attempt + 1))
    }
  }
}

async function probe(job: Probe): Promise<string | null> {
  for (const url of job.candidates) {
    const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(15_000) }).catch(() => null)
    if (res?.ok && res.headers.get("content-type")?.startsWith("image/")) return url
  }
  return null
}

async function pool<T>(items: T[], n: number, fn: (item: T) => Promise<void>) {
  const queue = [...items]
  await Promise.all(
    Array.from({ length: Math.min(n, queue.length) }, async () => {
      for (let item = queue.shift(); item !== undefined; item = queue.shift()) await fn(item)
    })
  )
}

// ---------------------------------------------------------------------------

async function main() {
  const catalog = JSON.parse(await readFile(path.join(ROOT, "catalog/index.json"), "utf8")) as CatalogEntry[]
  const manifest: Record<string, string> = existsSync(MANIFEST) ? JSON.parse(await readFile(MANIFEST, "utf8")) : {}
  for (const entry of catalog.filter(linkOnlyMedia)) {
    delete manifest[entry.id]
    if (existsSync(fileFor(entry.id))) unlinkSync(fileFor(entry.id))
  }
  // Rebase local thumbnail URLs when a fork changes its deployment.
  for (const [id, url] of Object.entries(manifest)) if (new URL(url).pathname.endsWith(`/thumbnails/${id}.webp`)) manifest[id] = publicUrlFor(id)
  await writeFile(MANIFEST, JSON.stringify(Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b))), null, 2) + "\n")
  if (args.prune) { console.log("✓ pruned restricted thumbnails; next: pnpm catalog"); return }
  const only = new Set(args.only ?? [])
  const picked = new Set(args.id ?? [])

  // catalog/index.json already has manifest previews merged in — those don't count as upstream previews.
  const candidates = catalog.filter(
    (e) =>
      (!only.size || only.has(e.source)) &&
      (!picked.size || picked.has(e.id)) &&
      (!e.preview || e.preview === manifest[e.id])
  )

  const skipped: Skip[] = []
  const shots: Shot[] = []
  const probes: Probe[] = []
  let kept = 0
  for (const e of candidates) {
    const plan = planFor(e)
    if (!("kind" in plan)) {
      skipped.push(plan)
      continue
    }
    const exists = plan.kind === "shot" ? existsSync(fileFor(e.id)) : !!manifest[e.id]
    if (exists && !args.force) {
      if (plan.kind === "shot") manifest[e.id] = publicUrlFor(e.id)
      kept++
    } else if (plan.kind === "shot") shots.push(plan)
    else probes.push(plan)
  }
  console.log(`thumbnails: ${shots.length} to shoot, ${probes.length} to probe, ${kept} up to date`)

  const made = new Map<string, number>()
  const ok = (id: string, url = publicUrlFor(id)) => {
    manifest[id] = url
    const source = id.split("/")[0]
    made.set(source, (made.get(source) ?? 0) + 1)
    console.log(`  ✓ ${id}`)
  }
  const fail = (id: string, err: unknown) => {
    const reason = (err as Error).message.split("\n")[0]
    skipped.push({ id, reason })
    console.log(`  ✗ ${id}: ${reason}`)
    // The demo is gone upstream — don't keep serving a stale shot. (Transient errors keep the old one.)
    if (err instanceof NotFound) {
      delete manifest[id]
      if (existsSync(fileFor(id))) unlinkSync(fileFor(id))
    }
  }

  await pool(probes, CONCURRENCY, async (job) => {
    const url = await probe(job)
    if (url) ok(job.id, url)
    else fail(job.id, new Error("no upstream image found"))
  })

  if (shots.length) {
    for (const s of new Set(shots.map((j) => j.id.split("/")[0]))) await mkdir(path.join(OUT_DIR, s), { recursive: true })
    const browser = await puppeteer.launch({
      executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome",
      headless: true,
      args: ["--no-sandbox", "--hide-scrollbars", "--mute-audio", "--autoplay-policy=no-user-gesture-required"],
    })

    // Work units: a single shot, or every batched shot that shares a page.
    const units: Shot[][] = []
    const batches = new Map<string, Shot[]>()
    for (const job of shots) {
      if (!job.batch) units.push([job])
      else if (batches.has(job.url)) batches.get(job.url)!.push(job)
      else {
        const group = [job]
        batches.set(job.url, group)
        units.push(group)
      }
    }

    try {
      await pool(units, CONCURRENCY, async (unit) => {
        if (unit.length === 1 && !unit[0].batch) {
          const job = unit[0]
          await withRetries(async () => {
            const urls = [job.url, ...(job.fallbacks ?? [])]
            for (const [i, url] of urls.entries()) {
              let page: Page
              try {
                page = await open(browser, job, url)
              } catch (err) {
                if (err instanceof NotFound && i < urls.length - 1) continue
                throw err
              }
              try {
                return await capture(page, job)
              } finally {
                await page.close()
              }
            }
          }).then(
            () => ok(job.id),
            (err) => fail(job.id, err)
          )
          return
        }
        let page: Page
        try {
          page = await open(browser, unit[0])
        } catch (err) {
          for (const job of unit) fail(job.id, err)
          return
        }
        try {
          for (const job of unit)
            await withRetries(() => capture(page, job)).then(
              () => ok(job.id),
              (err) => fail(job.id, err)
            )
        } finally {
          await page.close()
        }
      })
    } finally {
      await browser.close()
    }
  }

  // Drop rows for entries that left the catalog or whose local file is gone; stable order for clean diffs.
  const ids = new Set(catalog.map((e) => e.id))
  const sorted = Object.fromEntries(
    Object.entries(manifest)
      .filter(([id, url]) => ids.has(id) && (url !== publicUrlFor(id) || existsSync(fileFor(id))))
      .sort(([a], [b]) => a.localeCompare(b))
  )
  await writeFile(MANIFEST, JSON.stringify(sorted, null, 2) + "\n")

  console.log(`✓ thumbnails: ${[...made].map(([s, n]) => `${s} +${n}`).join(", ") || "nothing new"} → catalog/thumbnails.json`)
  if (skipped.length) {
    console.log(`  skipped ${skipped.length}:`)
    for (const s of skipped) console.log(`    ${s.id} — ${s.reason}`)
  }
  console.log("  next: pnpm catalog")
}

main()
