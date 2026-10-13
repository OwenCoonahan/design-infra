import assert from "node:assert/strict"
import { existsSync, mkdirSync } from "node:fs"
import { parseArgs } from "node:util"
import puppeteer from "puppeteer-core"

import systems from "../lib/design-systems.generated.json"

declare global {
  interface Window { __fieldProbe: { frames: number; marks: number[][] } }
}

const { values } = parseArgs({ options: { base: { type: "string", default: "http://localhost:3000" } } })
const base = new URL(values.base!).origin
const executablePath = process.env.CHROME_PATH ?? ["/usr/bin/google-chrome", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find(existsSync)
if (!executablePath) throw new Error("Set CHROME_PATH to Chrome's executable")
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function main() {
  mkdirSync(".context", { recursive: true })
  const browser = await puppeteer.launch({ executablePath, args: ["--no-sandbox", "--disable-dev-shm-usage", "--blink-settings=primaryPointerType=4,availablePointerTypes=4,primaryHoverType=2,availableHoverTypes=2"] })
  const page = await browser.newPage()
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(String(error)))
  page.on("console", (message) => {
    if (message.type() === "error" && /hydrat|React error/i.test(message.text())) errors.push(message.text())
  })
  await page.evaluateOnNewDocument(`
    window.__fieldProbe = {frames: 0, marks: []};
    const clear = CanvasRenderingContext2D.prototype.clearRect;
    const fill = CanvasRenderingContext2D.prototype.fillRect;
    CanvasRenderingContext2D.prototype.clearRect = function(...args) {
      if (this.canvas.closest('[data-kinetic-field]')) { window.__fieldProbe.frames++; window.__fieldProbe.marks = []; }
      return clear.apply(this, args);
    };
    CanvasRenderingContext2D.prototype.fillRect = function(...args) {
      if (this.canvas.closest('[data-kinetic-field]') && window.__fieldProbe.marks.length < 96) window.__fieldProbe.marks.push(args);
      return fill.apply(this, args);
    };
  `)
  const state = (value: string) => page.waitForSelector(`[data-kinetic-field][data-motion-state="${value}"]`)
  const frames = () => page.evaluate(() => window.__fieldProbe.frames)
  const still = async () => {
    await wait(150)
    const count = await frames()
    await wait(250)
    assert.equal(await frames(), count, "drawing continues while paused/offscreen/hidden")
  }
  try {
    await page.setViewport({ width: 1440, height: 1100 })
    await page.goto(base, { waitUntil: "networkidle2" })
    await state("playing")
    await page.waitForFunction(() => window.__fieldProbe.frames > 4)
    const sample = await page.evaluate(() => window.__fieldProbe.marks)
    await wait(180)
    const idle = await page.evaluate(() => window.__fieldProbe.marks)
    const bounds = await (await page.$("[data-kinetic-field] canvas"))?.boundingBox()
    assert.ok(bounds)
    await page.mouse.move(bounds.x + bounds.width * 0.92, bounds.y + bounds.height * 0.3)
    await wait(300)
    const influenced = await page.evaluate(() => window.__fieldProbe.marks)
    const displacement = (a: number[][], b: number[][]) => Math.max(...a.map((mark, i) => Math.hypot(mark[0] - b[i][0], mark[1] - b[i][1])))
    assert.ok(displacement(idle, influenced) > displacement(sample, idle) * 3 + 5, "pointer response should exceed the gentle idle movement")
    await page.screenshot({ path: ".context/motion-homepage-desktop.png" })
    await page.locator('button[aria-label="Pause motion"]').click()
    await state("paused")
    await still()
    const orbit = await page.$eval("[data-kinetic-field] canvas", (canvas) => (canvas as HTMLCanvasElement).toDataURL())
    await page.locator('[aria-label="Motion field shape"] button ::-p-text(Sphere)').click()
    assert.ok(await page.$('[aria-label="Motion field shape"] button[aria-pressed="true"] ::-p-text(Sphere)'))
    const sphere = await page.$eval("[data-kinetic-field] canvas", (canvas) => (canvas as HTMLCanvasElement).toDataURL())
    assert.notEqual(sphere, orbit, "shape selection must change the actual drawing")
    await still()
    await page.focus('button[aria-label="Play motion"]')
    await page.keyboard.press("Space")
    await state("playing")
    const count = await frames()
    await page.waitForFunction((previous) => window.__fieldProbe.frames > previous + 3, {}, count)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await state("offscreen")
    await still()
    await page.evaluate(() => window.scrollTo(0, 0))
    await state("playing")
    // Exercise the visibility handler explicitly; headless Chrome does not reliably background tabs.
    await page.evaluate("Object.defineProperty(document, 'hidden', {configurable:true, get:()=>true}); document.dispatchEvent(new Event('visibilitychange'))")
    await state("hidden")
    await still()
    await page.evaluate("Object.defineProperty(document, 'hidden', {configurable:true, get:()=>false}); document.dispatchEvent(new Event('visibilitychange'))")
    await state("playing")
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }])
    await state("paused")
    await still()
    await page.locator('button[aria-label="Play motion"]').click()
    await state("playing")
    await page.reload({ waitUntil: "networkidle2" })
    await state("paused")
    await still()
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewport({ width, height: 1000 })
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}px`)
      await page.screenshot({ path: `.context/motion-homepage-${width}.png` })
    }
    for (const system of systems) {
      for (const mode of system.modes) {
        const response = await page.goto(`${base}/preview/oc/kinetic-field?theme=${system.slug}&mode=${mode}`, { waitUntil: "networkidle2" })
        assert.equal(response?.status(), 200)
        await state("paused")
        assert.ok(await page.$eval("[data-kinetic-field] canvas", (element) => (element as HTMLCanvasElement).width > 0))
        await page.screenshot({ path: `.context/kinetic-field-${system.slug}-${mode}.png` })
      }
    }
    const fallback = await browser.newPage()
    await fallback.evaluateOnNewDocument(`HTMLCanvasElement.prototype.getContext = function() { return null; }`)
    await fallback.goto(base, { waitUntil: "networkidle2" })
    await fallback.waitForSelector('[data-motion-state="fallback"]')
    assert.equal(await fallback.$eval("[data-kinetic-field] svg", (svg) => getComputedStyle(svg).visibility), "visible")
    assert.equal(await fallback.$eval('button[aria-label="Pause motion"]', (button) => getComputedStyle(button).visibility), "hidden")
    assert.ok(await fallback.$$eval("[data-kinetic-field] svg rect", (rects) => rects.length > 100))
    await fallback.setJavaScriptEnabled(false)
    await fallback.reload({ waitUntil: "networkidle2" })
    assert.equal(await fallback.$eval("[data-kinetic-field] svg", (svg) => getComputedStyle(svg).visibility), "visible")
    await fallback.close()
    assert.deepEqual(errors, [])
    console.log("✓ motion header: real drawing, pointer influence, shapes, keyboard, pause/play, offscreen/visibility cleanup, reduced motion, responsive layout, all themes and Canvas/JS fallback")
  } finally { await browser.close() }
  const touchBrowser = await puppeteer.launch({ executablePath, args: ["--no-sandbox", "--disable-dev-shm-usage"] })
  try {
    const touch = await touchBrowser.newPage()
    await touch.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
    await touch.goto(base, { waitUntil: "networkidle2" })
    await touch.waitForSelector('[data-kinetic-field][data-motion-state="paused"]')
    await touch.locator('button[aria-label="Play motion"]').click()
    await touch.waitForSelector('[data-kinetic-field][data-motion-state="playing"]')
    console.log("✓ touch starts static with explicit play")
  } finally { await touchBrowser.close() }
}

main().catch((error: unknown) => { console.error(error); process.exitCode = 1 })
