/** Real engine rendering and interactions: pnpm smoke:charts --base http://localhost:3330 */
import assert from "node:assert/strict"
import { existsSync, mkdirSync, readFileSync } from "node:fs"
import { parseArgs } from "node:util"
import puppeteer from "puppeteer-core"
import { galleryBase } from "./lib/gallery-base"

const { values } = parseArgs({ options: { base: { type: "string", default: "http://localhost:3000" }, id: { type: "string", multiple: true } } })
const base = galleryBase(values.base!)
const manifest = JSON.parse(readFileSync("catalog/preview-demos.json", "utf8")).demos as Record<string, { adapter: string; width: number; height: number }>
const demos = Object.entries(manifest).filter(([id, demo]) => ["charts", "graphs"].includes(demo.adapter) && (!values.id || values.id.includes(id)))
async function main() {
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? ["/usr/bin/google-chrome", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find(existsSync), headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] })
  const page = await browser.newPage()
  await page.setRequestInterception(true)
  page.on("request", (request) => {
    const url = new URL(request.url())
    const marker = "/thumbnails/"
    // Local tests must use the posters being released, rather than older production images.
    if (url.pathname.includes(marker)) void request.continue({ url: `${base}${url.pathname.slice(url.pathname.indexOf(marker))}` })
    else void request.continue()
  })
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(String(error)))
  mkdirSync(".context/chart-previews", { recursive: true })
  try {
    for (const [id, demo] of demos) {
      const poster = await fetch(`${base}/thumbnails/${id}.webp`)
      assert.equal(poster.status, 200, `${id}: generated poster is served`)
      assert.match(poster.headers.get("content-type") ?? "", /image\/webp/)
      await poster.arrayBuffer()
      await page.setViewport({ width: demo.width, height: demo.height })
      assert.equal((await page.goto(`${base}/preview/${id}?surface=neutral`, { waitUntil: "networkidle2" }))?.status(), 200, id)
      if (demo.adapter === "charts") {
        await page.waitForSelector(id.startsWith("shadcn/") ? ".recharts-surface path" : "canvas")
        const pixels = () => page.evaluate(() => {
          const canvas = document.querySelector("canvas")
          return canvas ? canvas.toDataURL() : Array.from(document.querySelectorAll(".recharts-surface path, .recharts-surface rect, .recharts-surface text")).map((element) => element.outerHTML).join("")
        })
        const before = await pixels()
        await page.locator("button ::-p-text(Data B)").click()
        await page.waitForFunction(() => document.querySelector('[data-chart-demo]')?.getAttribute("data-dataset") === "1")
        // Wait for the real chart's transition to finish, not just its button state.
        await new Promise((resolve) => setTimeout(resolve, 1700))
        assert.notEqual(await pixels(), before, `${id}: data changes actual plotted geometry/pixels`)
        await page.select('[aria-label="Chart palette"]', "cool")
        assert.equal(await page.$eval('[data-chart-demo]', (element) => getComputedStyle(element).getPropertyValue("--chart-1")), "#78c4d4")
        if (id === "shadcn/chart-area-gradient") {
          await page.$eval('[role="application"]', (element) => (element as SVGSVGElement).focus())
          await page.keyboard.press("ArrowRight")
          await page.waitForSelector('.recharts-tooltip-wrapper[style*="visible"]')
        }
        if (id === "chartjs/line") {
          const both = await pixels()
          await page.locator("button ::-p-text(Hide reference)").click()
          await new Promise((resolve) => setTimeout(resolve, 500))
          assert.notEqual(await pixels(), both, "hiding a real series changes pixels")
        }
      } else {
        await page.waitForSelector('[data-graph-demo]')
        const canvasBefore = id.startsWith("react-force-graph/") ? await page.$eval("canvas", (element) => element.toDataURL()) : undefined
        await page.select('[aria-label="Selected node"]', id.startsWith("react-flow/") ? "review" : "Charts")
        assert.ok((await page.$eval('[aria-live="polite"]', (element) => element.textContent))?.includes(id.startsWith("react-flow/") ? "review" : "Charts"))
        if (id.startsWith("react-flow/")) {
          const node = await page.$('[data-id="transform"].react-flow__node')
          const before = await node!.boundingBox()
          await page.mouse.move(before!.x + 40, before!.y + 35)
          await page.mouse.down(); await page.mouse.move(before!.x + 70, before!.y + 55, { steps: 8 }); await page.mouse.up()
          assert.notEqual((await node!.boundingBox())?.x, before!.x, "actual flow node is draggable")
          const source = await (await page.$('[data-id="source"] .react-flow__handle.source'))!.boundingBox()
          const target = await (await page.$('[data-id="output"] .react-flow__handle.target'))!.boundingBox()
          await page.mouse.move(source!.x + source!.width / 2, source!.y + source!.height / 2)
          await page.mouse.down(); await page.mouse.move(target!.x + target!.width / 2, target!.y + target!.height / 2, { steps: 12 }); await page.mouse.up()
          await page.waitForFunction(() => document.querySelector('[aria-live="polite"]')?.textContent?.includes("5 connections"))
        } else {
          await page.waitForFunction((before) => document.querySelector("canvas")?.toDataURL() !== before, {}, canvasBefore)
          const canvas = await page.$("canvas")
          assert.ok(canvas)
          assert.ok(await canvas.evaluate((element) => { const context = element.getContext("2d")!; return context.getImageData(0, 0, element.width, element.height).data.some((value, index) => index % 4 !== 3 && value > 70) }), "Canvas contains drawn graph nodes, not only its dark surface")
        }
        await page.locator("button ::-p-text(Reset graph)").click()
        assert.equal(await page.$eval('[aria-label="Selected node"]', (element) => (element as HTMLSelectElement).value), id.startsWith("react-flow/") ? "source" : "Design")
      }
      assert.equal(await page.$('[role="alert"]'), null, `${id}: no error fallback`)
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.documentElement.scrollHeight <= innerHeight + 2), `${id}: controls and plot fit the reserved stage`)
      console.log(`✓ ${id}: real renderer, interaction and stage fit`)
    }
    for (const width of [1440, 820, 390]) {
      await page.setViewport({ width, height: 1000 })
      await page.goto(`${base}/components?category=chart&free=1&source=shadcn`, { waitUntil: "networkidle2" })
      await page.waitForSelector('[data-gallery-preview][data-playing="true"] iframe')
      await page.waitForFunction(() => document.querySelector('[data-gallery-preview][data-ready="true"]') || Array.from(document.querySelectorAll("iframe")).some((frame) => frame.style.opacity === "1"))
      const count = await page.$$eval('[data-gallery-preview][data-playing="true"]', (elements) => elements.length)
      assert.ok(count > 0 && count <= 3)
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}: no horizontal overflow`)
      await page.screenshot({ path: `.context/chart-previews/charts-${width}.png`, fullPage: false })
      await page.locator("button ::-p-text(Pause all)").click()
      await page.waitForFunction(() => !document.querySelector("main iframe"))
      await page.waitForFunction(() => Array.from(document.querySelectorAll<HTMLImageElement>("[data-gallery-preview] img")).some((image) => image.complete && image.naturalWidth > 0))
    }
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }])
    await page.goto(`${base}/components?category=graph&free=1`, { waitUntil: "networkidle2" })
    assert.equal((await page.$$("main iframe")).length, 0, "reduced motion starts on posters")
    const target = '[data-entry-id="react-flow/custom-nodes"]'
    await page.locator(`${target} button ::-p-text(Play)`).click()
    await page.waitForSelector(`${target} iframe`)
    await page.locator(`${target} button ::-p-text(Interact)`).click()
    const frame = await (await page.$(`${target} iframe`))!.contentFrame()
    await frame!.waitForSelector('[aria-label="Selected node"]')
    await frame!.select('[aria-label="Selected node"]', "output")
    assert.ok((await frame!.$eval('[aria-live="polite"]', (element) => element.textContent))?.includes("output"))
    assert.ok(page.url().includes("category=graph"), "frame interactions do not navigate catalog")
    await page.screenshot({ path: ".context/chart-previews/graphs-mobile.png", fullPage: false })
    assert.deepEqual(errors, [])
    console.log(`✓ ${demos.length} hosted demos; responsive galleries, playback budget, pause posters and reduced-motion interaction`)
  } finally {
    await browser.close()
  }

}
main().catch((error) => { console.error(error); process.exitCode = 1 })
