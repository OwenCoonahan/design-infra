import { galleryBase } from "./lib/gallery-base"
/** Real Chrome checks: pnpm smoke:visual --base http://localhost:3330 */
import assert from "node:assert/strict"
import { existsSync, mkdirSync } from "node:fs"
import { parseArgs } from "node:util"
import puppeteer, { type HTTPRequest } from "puppeteer-core"

const { values } = parseArgs({ options: { base: { type: "string", default: "http://localhost:3000" } } })
const base = galleryBase(values.base!)
const loading = [
  "oc/agent-status",
  "librariesdev/thinking-orbs",
  "kibo-ui/spinner",
  "smoothui/ai-loader",
  "smoothui/skeleton-loader",
  "smoothui/grid-loader",
  "smoothui/motion-loader",
  "magicui/animated-circular-progress-bar",
]
const executablePath =
  process.env.CHROME_PATH ??
  ["/usr/bin/google-chrome", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find(existsSync)
async function main() {
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  })
  const page = await browser.newPage()
  const errors: string[] = []
  page.on("pageerror", (e) => errors.push(String(e)))
  mkdirSync(".context", { recursive: true })
  try {
    await page.setViewport({ width: 1440, height: 1200 })
    for (const id of loading) {
      const response = await page.goto(`${base}/preview/${id}?surface=neutral`, { waitUntil: "networkidle2" })
      assert.equal(response?.status(), 200, id)
      await page.waitForSelector("[data-preview-content]")
      assert.ok(
        await page.$("svg, canvas, [aria-busy], [role=status], [aria-label=Loading]"),
        `${id} renders an actual component`,
      )
      assert.equal(await page.$('[role="alert"]'), null)
      const select = await page.$("select")
      if (select) {
        const option = await page.$eval("select", (e) => (e as HTMLSelectElement).options[1].value)
        await page.select("select", option)
        assert.equal(await page.$eval("select", (e) => (e as HTMLSelectElement).value), option)
      }
      if (id === "smoothui/skeleton-loader") {
        await page.locator("button ::-p-text(Show loaded content)").click()
        assert.equal(await page.$("[aria-busy=true]"), null)
      }
      if (id.startsWith("magicui/")) {
        await page.focus('input[type="range"]')
        await page.keyboard.press("ArrowRight")
        assert.equal(await page.$eval('input[type="range"]', (e) => (e as HTMLInputElement).value), "65")
      }
    }
    const legacy = await fetch(`${base}/preview/oc/agent-status?theme=editorial`)
    assert.ok((await legacy.text()).includes('data-theme="editorial"'))
    assert.equal((await fetch(`${base}/preview/design-infra/agent-status?surface=neutral`)).status, 200)
    assert.equal((await fetch(`${base}/preview/unknown/spinner`)).status, 404)
    console.log("✓ all eight real hosted demos, controls, legacy URLs and explicit adapter allowlist")
    // The reported Hero shelf must not display still screenshots under Live view.
    await page.goto(`${base}/components?category=hero&source=aceternity&free=1`, { waitUntil: "networkidle2" })
    assert.equal((await page.$$('ul[aria-label="Visual examples"] li')).length, 0)
    assert.ok(await page.locator("h2 ::-p-text(No live previews available)").waitHandle())
    assert.ok(await page.$('[aria-label="More examples without live previews"]'))
    await page.locator("button ::-p-text(Browse screenshots)").click()
    await page.waitForSelector('ul[aria-label="Visual examples"] img')
    assert.equal(new URL(page.url()).searchParams.get("view"), "grid")
    assert.equal((await page.$$("main iframe, main video")).length, 0)
    console.log("✓ Live view excludes still screenshots; Grid view keeps them browsable")

    await page.goto(`${base}/components?category=loader&free=1`, { waitUntil: "networkidle2" })
    await page.waitForSelector('[data-gallery-preview][data-playing="true"] iframe')
    assert.equal(await page.$eval("button ::-p-text(Live view)", (e) => e.getAttribute("aria-pressed")), "true")
    await page.waitForFunction(() =>
      Array.from(document.querySelectorAll<HTMLVideoElement>("main video")).some(
        (v) => v.readyState >= 2 && !v.paused && v.currentTime > 0,
      ),
    )
    assert.equal(await page.$('[data-preview-kind="static"]'), null)
    const initialCount = await page.$$eval('[data-gallery-preview][data-playing="true"]', (e) => e.length)
    assert.ok(initialCount > 0 && initialCount <= 3)
    await page.evaluate(
      `window.__galleryPeak = 0; window.__galleryObserver = new MutationObserver(() => { window.__galleryPeak = Math.max(window.__galleryPeak, document.querySelectorAll('[data-gallery-preview][data-playing="true"]').length) }); window.__galleryObserver.observe(document.querySelector('main'), {subtree:true, childList:true, attributes:true, attributeFilter:['data-playing']});`,
    )
    await page.locator("button ::-p-text(Pause all)").click()
    await page.waitForFunction(() => !document.querySelector('[data-gallery-preview][data-playing="true"]'))
    assert.equal((await page.$$("main iframe, main video")).length, 0)
    await page.locator("button ::-p-text(Resume all)").click()
    await page.waitForSelector('[data-gallery-preview][data-playing="true"] iframe')
    const first = await page.$eval('[data-gallery-preview][data-playing="true"]', (e) =>
      e.getAttribute("data-gallery-preview"),
    )
    await page.locator(`[data-entry-id="${first}"] button ::-p-text(Pause)`).click()
    await page.waitForFunction(
      (id) => document.querySelector(`[data-gallery-preview="${id}"]`)?.getAttribute("data-playing") === "false",
      {},
      first,
    )
    assert.equal(await page.$(`[data-gallery-preview="${first}"] iframe`), null)
    await page.locator(`[data-entry-id="${first}"] button ::-p-text(Play)`).click()
    await page.waitForSelector(`[data-gallery-preview="${first}"] iframe`)
    await page.locator(`[data-entry-id="${first}"] button ::-p-text(Interact)`).click()
    assert.equal(
      await page.$eval(`[data-gallery-preview="${first}"] iframe`, (e) => (e as HTMLIFrameElement).style.pointerEvents),
      "auto",
    )
    const unchanged = page.url()
    const iframeElement = await page.$(`[data-gallery-preview="${first}"] iframe`)
    const iframe = await iframeElement!.contentFrame()
    // Parent controls never navigate away from the catalog.
    if (await iframe?.$("select")) {
      const option = await iframe!.$eval("select", (e) => (e as HTMLSelectElement).options[1].value)
      await iframe!.select("select", option)
    }
    const skeletonElement = await page.$('[data-entry-id="smoothui/skeleton-loader"] iframe')
    assert.ok(skeletonElement)
    await page.locator('[data-entry-id="smoothui/skeleton-loader"] button ::-p-text(Interact)').click()
    const skeletonFrame = await skeletonElement.contentFrame()
    await skeletonFrame!.waitForSelector("button")
    // Chrome's automation coordinates omit iframe transforms; use the actual scaled viewport.
    const outer = await skeletonElement.boundingBox()
    const inner = await skeletonFrame!.$eval("button", (button) => {
      const rect = button.getBoundingClientRect()
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
    })
    const scale = outer!.width / 520
    await page.mouse.click(
      outer!.x + (inner.x + inner.width / 2) * scale,
      outer!.y + (inner.y + inner.height / 2) * scale,
    )
    await skeletonFrame!.waitForFunction(() => document.querySelector("button")?.textContent === "Load again")
    assert.equal(await skeletonFrame!.$("[aria-busy=true]"), null)
    assert.equal(page.url(), unchanged)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForFunction((id) => !document.querySelector(`[data-gallery-preview="${id}"] iframe`), {}, first)
    assert.ok(await page.evaluate("window.__galleryPeak <= 3"))
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForSelector('[data-gallery-preview][data-playing="true"] iframe')
    await page.evaluate(
      `Object.defineProperty(document, 'hidden', {configurable:true, get:()=>true}); document.dispatchEvent(new Event('visibilitychange'))`,
    )
    await page.waitForFunction(() => !document.querySelector('[data-gallery-preview][data-playing="true"]'))
    await page.evaluate(
      `Object.defineProperty(document, 'hidden', {configurable:true, get:()=>false}); document.dispatchEvent(new Event('visibilitychange'))`,
    )
    console.log("✓ shared playback budget, individual/all controls, interaction, offscreen and visibility cleanup")

    await page.locator("button ::-p-text(Grid view)").click()
    await page.waitForFunction(() => new URL(location.href).searchParams.get("view") === "grid")
    const reloadURL = page.url()
    await page.reload({ waitUntil: "networkidle2" })
    assert.equal(page.url(), reloadURL)
    assert.equal((await page.$$("main iframe, main video")).length, 0)
    const scripts = await page.$$eval("script[src]", (nodes) => nodes.map((e) => (e as HTMLScriptElement).src))
    const bundles = await Promise.all(scripts.map(async (src) => (await fetch(src)).text()))
    assert.ok(
      bundles.every((code) => !code.includes("newton-cradle")),
      "Loading implementations stay out of the catalog bundle",
    )
    await page.locator("button ::-p-text(Buttons)").click()
    await page.waitForFunction(() => document.querySelector("h1")?.textContent === "Buttons gallery")
    assert.equal(new URL(page.url()).searchParams.get("free"), "1")
    assert.equal(new URL(page.url()).searchParams.get("view"), "grid")
    await page.goto(`${base}/components?category=loader&source=smoothui&free=1&view=live`, {
      waitUntil: "networkidle2",
    })
    const entries = await page.$$eval("li[data-entry-id]", (nodes) => nodes.map((e) => e.getAttribute("data-entry-id")))
    assert.ok(entries.length && entries.every((id) => id?.startsWith("smoothui/")))
    await page.locator('input[aria-label="Search the catalog"]').fill("skeleton")
    await page.waitForFunction(() => document.querySelectorAll("li[data-entry-id]").length === 1)
    await page.click('li[data-entry-id] [role="checkbox"]')
    await page.waitForSelector('[aria-label="Shortlist"]')
    assert.ok(
      await page.$eval('[aria-label="Shortlist"] a[href*="/compare?"]', (e) =>
        e.getAttribute("href")?.includes("smoothui/skeleton-loader"),
      ),
    )
    await browser
      .defaultBrowserContext()
      .overridePermissions(new URL(base).origin, ["clipboard-read", "clipboard-write", "clipboard-sanitized-write"])
    await page.locator("button ::-p-text(Copy for agent)").click()
    await page.waitForFunction(() =>
      Array.from(document.querySelectorAll("button")).some((b) => b.textContent?.includes("Copied")),
    )
    const handoff = await page.evaluate(() => navigator.clipboard.readText())
    assert.ok(handoff.includes("smoothui/skeleton-loader") && handoff.includes("shadcn"))
    await page.goto(`${base}/components?category=card&view=grid`, { waitUntil: "domcontentloaded" })
    await page.waitForSelector("li[data-entry-id]")
    const before = (await page.$$("li[data-entry-id]")).length
    assert.equal(before, 60)
    await page.locator("button ::-p-text(Show more)").click()
    await page.waitForFunction(() => document.querySelectorAll("li[data-entry-id]").length > 60)
    await page.locator("button ::-p-text(Loading)").click()
    await page.waitForFunction(() => new URL(location.href).searchParams.get("category") === "loader")
    assert.ok((await page.$$("li[data-entry-id]")).length <= 60)
    console.log(
      "✓ URL reload, switching, source/access/search filters, pagination, shortlist, compare and real clipboard handoff",
    )

    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }])
    await page.goto(`${base}/components?category=loader&free=1`, { waitUntil: "networkidle2" })
    assert.equal((await page.$$("main iframe, main video")).length, 0)
    await page.locator('[data-entry-id="smoothui/ai-loader"] button ::-p-text(Play)').click()
    await page.waitForSelector('[data-entry-id="smoothui/ai-loader"] iframe')
    assert.equal((await page.$$("main iframe, main video")).length, 1)
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }])

    await page.setRequestInterception(true)
    const failRequest = (request: HTTPRequest) => {
      if (request.isNavigationRequest() && request.url().includes("/preview/smoothui/ai-loader")) {
        void request.respond({
          status: 200,
          contentType: "text/html",
          body: `<script>parent.postMessage({type:'design-infra-preview',status:'error'},location.origin)</script>`,
        })
      } else void request.continue()
    }
    page.on("request", failRequest)
    await page.goto(`${base}/components?category=loader&source=smoothui&q=ai-loader`, { waitUntil: "networkidle2" })
    await page.waitForSelector('[data-entry-id="smoothui/ai-loader"] img')
    await page.waitForFunction(() =>
      document.querySelector('[data-entry-id="smoothui/ai-loader"]')?.textContent?.includes("Preview unavailable"),
    )
    assert.equal(await page.$('[data-entry-id="smoothui/ai-loader"] iframe'), null)
    assert.ok(await page.$('[data-entry-id="smoothui/ai-loader"] a[target="_blank"]'))
    page.off("request", failRequest)
    await page.setRequestInterception(false)
    console.log("✓ reduced-motion opt-in and failed-preview thumbnail/source fallback")

    await page.evaluate(() => window.localStorage.clear())
    for (const width of [1440, 768, 390]) {
      await page.setViewport({ width, height: 1100 })
      for (const category of ["loader", "button", "pricing"]) {
        await page.goto(`${base}/components?category=${category}&free=1`, { waitUntil: "networkidle2" })
        assert.ok(
          await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
          `${category} ${width} horizontal overflow`,
        )
        await page.screenshot({ path: `.context/gallery-${category}-${width}.png`, fullPage: false })
      }
    }
    assert.deepEqual(errors, [])
    console.log("✓ Loading, Buttons and Pricing at desktop/tablet/phone widths; no browser errors")
  } finally {
    await browser.close()
  }
}
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
