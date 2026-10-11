/**
 * Capture a website Owen likes as raw material for an inspiration entry.
 *
 *   pnpm capture <url> [--slug name] [--wait 2500]
 *
 * Writes
 *   public/inspiration/<slug>/hero.webp     first viewport, 1440×900 (served at /inspiration/<slug>/hero.webp)
 *   public/inspiration/<slug>/full.webp     whole page (capped), 720px wide
 *   public/inspiration/<slug>/mobile.webp   first viewport at 390×844
 *   inspiration/<slug>/capture.json         extracted design data: fonts, palette, radii, shadows, CSS custom
 *                                           properties, section outline, motion/tech signals
 *
 * Then follow skills/ingest-inspiration/SKILL.md to write inspiration/<slug>/README.md (the analysis).
 */
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { parseArgs } from "node:util"

import puppeteer, { type Page } from "puppeteer-core"

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { slug: { type: "string" }, wait: { type: "string", default: "2500" } },
})
const url = positionals[0]
if (!url || !/^https?:\/\//.test(url)) {
  console.error("usage: pnpm capture <https://…> [--slug name]")
  process.exit(1)
}
const slug =
  values.slug ??
  new URL(url).hostname
    .replace(/^www\./, "")
    .replace(/\.[a-z]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
const WAIT = Number(values.wait)
const PUBLIC_DIR = path.join(process.cwd(), "public/inspiration", slug)
const DATA_DIR = path.join(process.cwd(), "inspiration", slug)
const MAX_FULL_HEIGHT = 12_000

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** PNG (base64) → webp at `width`, encoded by Chrome's canvas (no sharp). */
async function toWebp(page: Page, pngB64: string, width: number, quality: number) {
  const tab = await page.browser().newPage()
  try {
    const dataUrl = await tab.evaluate(
      async (b64, w, q) => {
        const img = new Image()
        img.src = `data:image/png;base64,${b64}`
        await img.decode()
        const scale = Math.min(1, w / img.naturalWidth)
        const c = document.createElement("canvas")
        c.width = Math.round(img.naturalWidth * scale)
        c.height = Math.round(img.naturalHeight * scale)
        const ctx = c.getContext("2d")!
        ctx.imageSmoothingQuality = "high"
        ctx.drawImage(img, 0, 0, c.width, c.height)
        return c.toDataURL("image/webp", q)
      },
      pngB64,
      width,
      quality
    )
    return Buffer.from(dataUrl.slice(dataUrl.indexOf(",") + 1), "base64")
  } finally {
    await tab.close()
  }
}

async function dismissOverlays(page: Page) {
  // Best effort: accept/close cookie banners and modals so they don't dominate the shots.
  await page
    .evaluate(() => {
      const words = /^(accept|accept all|agree|got it|ok|okay|allow all|i agree|close|dismiss|no thanks)$/i
      for (const el of document.querySelectorAll<HTMLElement>("button, a, [role=button]")) {
        if (words.test((el.innerText || el.getAttribute("aria-label") || "").trim())) el.click()
      }
    })
    .catch(() => undefined)
}

/** Runs in the page: pull the design DNA out of computed styles. */
function extract() {
  const toHex = (c: string) => {
    const m = c.match(/rgba?\(([^)]+)\)/)
    if (!m) return null
    const [r, g, b, a = "1"] = m[1].split(/[ ,/]+/).filter(Boolean)
    if (Number(a) < 0.5) return null
    return "#" + [r, g, b].map((v) => Math.round(Number(v)).toString(16).padStart(2, "0")).join("")
  }
  const visible = (el: Element) => {
    const r = el.getBoundingClientRect()
    const s = getComputedStyle(el)
    return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && Number(s.opacity) > 0.05
  }
  const tally = <T extends string>(m: Map<T, number>, k: T | null | undefined, w = 1) => {
    if (k) m.set(k, (m.get(k) ?? 0) + w)
  }
  const top = <T extends string>(m: Map<T, number>, n: number) =>
    [...m].sort((a, b) => b[1] - a[1]).slice(0, n).map(([value, weight]) => ({ value, weight: Math.round(weight) }))

  const els = [...document.body.querySelectorAll("*")].filter(visible).slice(0, 6000)
  const bg = new Map<string, number>()
  const text = new Map<string, number>()
  const border = new Map<string, number>()
  const radii = new Map<string, number>()
  const shadows = new Map<string, number>()
  const fontsByRole: Record<string, Map<string, number>> = { heading: new Map(), body: new Map(), ui: new Map(), mono: new Map() }
  const sizes = new Map<string, number>()
  let animated = 0

  for (const el of els) {
    const s = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    tally(bg, toHex(s.backgroundColor), (r.width * r.height) / 10_000)
    const ownText = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent?.trim() ?? "").join("")
    if (ownText) {
      tally(text, toHex(s.color), ownText.length)
      const fam = s.fontFamily.split(",")[0].replace(/["']/g, "").trim()
      const tag = el.tagName.toLowerCase()
      const role = /^h[1-3]$/.test(tag) || Number.parseFloat(s.fontSize) >= 28 ? "heading" : tag === "code" || tag === "pre" || /mono/i.test(s.fontFamily) ? "mono" : /^(button|a|label|nav|li)$/.test(tag) ? "ui" : "body"
      tally(fontsByRole[role], fam, ownText.length)
      tally(sizes, `${Math.round(Number.parseFloat(s.fontSize))}px/${s.fontWeight}`, ownText.length)
    }
    if (s.borderTopWidth !== "0px" && s.borderTopStyle !== "none") tally(border, toHex(s.borderTopColor))
    if (s.borderRadius !== "0px" && r.width > 24) tally(radii, s.borderRadius.split(" ")[0])
    if (s.boxShadow !== "none") tally(shadows, s.boxShadow.slice(0, 120))
    if ((s.animationName && s.animationName !== "none") || (s.transitionDuration && s.transitionDuration !== "0s")) animated++
  }

  const rootVars: Record<string, string> = {}
  const rs = getComputedStyle(document.documentElement)
  for (let i = 0; i < rs.length && Object.keys(rootVars).length < 120; i++) {
    const p = rs[i]
    if (p.startsWith("--")) {
      const v = rs.getPropertyValue(p).trim()
      if (v && v.length < 80) rootVars[p] = v
    }
  }

  const outline = [...document.querySelectorAll("h1, h2")]
    .filter(visible)
    .slice(0, 24)
    .map((h) => ({ tag: h.tagName.toLowerCase(), text: (h as HTMLElement).innerText.trim().replace(/\s+/g, " ").slice(0, 120) }))

  const meta = (n: string) => document.querySelector<HTMLMetaElement>(`meta[name="${n}"], meta[property="${n}"]`)?.content ?? null
  return {
    title: document.title,
    description: meta("description") ?? meta("og:description"),
    themeColor: meta("theme-color"),
    pageHeight: document.documentElement.scrollHeight,
    fonts: Object.fromEntries(Object.entries(fontsByRole).map(([k, m]) => [k, top(m, 3)])),
    loadedFontFaces: [...new Set([...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/["']/g, "")))].slice(0, 12),
    typeScale: top(sizes, 10),
    palette: { backgrounds: top(bg, 8), text: top(text, 6), borders: top(border, 5) },
    radii: top(radii, 6),
    shadows: top(shadows, 4),
    cssVariables: rootVars,
    outline,
    signals: {
      sections: document.querySelectorAll("section").length,
      images: document.images.length,
      videos: document.querySelectorAll("video").length,
      canvases: document.querySelectorAll("canvas").length,
      svgs: document.querySelectorAll("svg").length,
      animatedElements: animated,
      prefersReducedMotionCss: [...document.styleSheets].some((sh) => {
        try {
          return [...sh.cssRules].some((r) => r.cssText.includes("prefers-reduced-motion"))
        } catch {
          return false
        }
      }),
      stack: {
        nextjs: !!document.querySelector("#__next, script[src*='/_next/']"),
        framer: !!document.querySelector("[data-framer-name], script[src*='framer']"),
        webflow: !!document.querySelector("html[data-wf-site]"),
        tailwind: document.querySelectorAll("[class*='px-'], [class*='text-']").length > 50,
        gsap: "gsap" in window,
      },
    },
  }
}

async function main() {
  await mkdir(PUBLIC_DIR, { recursive: true })
  await mkdir(DATA_DIR, { recursive: true })
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox", "--hide-scrollbars", "--mute-audio"],
  })
  try {
    const page = await browser.newPage()
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36"
    )
    await page.setViewport({ width: 1440, height: 900 })
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60_000 }).catch(() => undefined)
    await sleep(WAIT)
    await dismissOverlays(page)
    await sleep(600)

    const hero = await page.screenshot({ type: "png", encoding: "base64" })
    await writeFile(path.join(PUBLIC_DIR, "hero.webp"), await toWebp(page, hero, 1200, 0.8))

    // Scroll through once so lazy content and scroll-triggered sections render, then extract + full shot.
    await page.evaluate(async () => {
      for (let y = 0; y < Math.min(document.documentElement.scrollHeight, 12_000); y += 700) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 120))
      }
      window.scrollTo(0, 0)
    })
    await sleep(800)
    // tsx/esbuild wraps named functions with a __name() helper that doesn't exist in the page.
    await page.evaluate("globalThis.__name = (f) => f")
    const data = await page.evaluate(extract)
    const height = Math.min(data.pageHeight, MAX_FULL_HEIGHT)
    const full = await page.screenshot({
      type: "png",
      encoding: "base64",
      clip: { x: 0, y: 0, width: 1440, height },
      captureBeyondViewport: true,
    })
    await writeFile(path.join(PUBLIC_DIR, "full.webp"), await toWebp(page, full, 720, 0.6))

    const mobile = await browser.newPage()
    await mobile.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
    await mobile.goto(url, { waitUntil: "networkidle2", timeout: 60_000 }).catch(() => undefined)
    await sleep(WAIT)
    await dismissOverlays(mobile)
    const m = await mobile.screenshot({ type: "png", encoding: "base64" })
    await writeFile(path.join(PUBLIC_DIR, "mobile.webp"), await toWebp(mobile, m, 390, 0.75))

    const capture = { url, slug, capturedAt: new Date().toISOString(), fullHeightCaptured: height, ...data }
    await writeFile(path.join(DATA_DIR, "capture.json"), JSON.stringify(capture, null, 2) + "\n")
    console.log(`✓ captured ${url}
  public/inspiration/${slug}/{hero,full,mobile}.webp
  inspiration/${slug}/capture.json
  fonts: ${Object.entries(data.fonts).map(([r, f]) => `${r}=${f[0]?.value ?? "-"}`).join(" ")}
  palette: bg ${data.palette.backgrounds.slice(0, 3).map((c) => c.value).join(" ")} · text ${data.palette.text.slice(0, 2).map((c) => c.value).join(" ")}
next: look at the screenshots, then write inspiration/${slug}/README.md (skills/ingest-inspiration/SKILL.md)`)
  } finally {
    await browser.close()
  }
}

main()
