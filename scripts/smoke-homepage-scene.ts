/** Real-browser checks for the homepage composition and its native component demos. */
import assert from "node:assert/strict"
import { parseArgs } from "node:util"
import puppeteer, { type Frame, type HTTPRequest } from "puppeteer-core"
import { galleryBase } from "./lib/gallery-base"
import { sitePath } from "../lib/config"
import { observeHandoffs, assertStableHandoff } from "./lib/handoff-probe"

const { values } = parseArgs({ options: { base: { type: "string", default: "http://localhost:3000" } } })
const base = galleryBase(values.base!)
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
async function main() {
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome", args: ["--no-sandbox", "--disable-dev-shm-usage", "--blink-settings=primaryPointerType=4,availablePointerTypes=4,primaryHoverType=2,availableHoverTypes=2"] })
  try {
    const page = await browser.newPage()
    await observeHandoffs(page)
    const errors: string[] = []
    let fontAsset: string | undefined
    page.on("pageerror", (error) => errors.push(String(error)))
    page.on("requestfinished", (request) => {
      if (!fontAsset && request.resourceType() === "font") fontAsset = request.url()
    })
    await page.setViewport({ width: 1440, height: 1000 })
    await page.goto(base, { waitUntil: "networkidle2" })
    const readyScene = () => page.waitForFunction(() => document.querySelectorAll('[data-scene-card] iframe[data-ready="1"]').length === 3)
    const budget = async () => assert.ok(await page.$$eval('[data-playing="true"]', (items) => items.length) <= 3, "one shared three-preview budget")
    const frame = (name: string): Frame => { const found = page.frames().find((frame) => frame.url().includes(`/preview/smoothui/${name}?`)); assert.ok(found, name); return found }
    await readyScene()
    await budget()
    assert.equal(await page.$('[data-ambient-sound]'), null)
    assert.equal(await page.$$eval("[data-scene-card] header a", (links) => links.length), 3)
    assert.equal(await page.$$eval("[data-home-example]", (cards) => cards.length), 4)
    for (const id of ["oc/beam-card", "oc/kinetic-field"]) assert.ok(await page.$(`[data-home-example="${id}"]`), `${id} stays featured`)
    assert.equal(await page.$('[data-home-example="smoothui/motion-loader"]'), null, "the orbit loader is no longer a homepage example")
    const chart = frame("dither-chart")
    const canvas = () => chart.$eval("canvas", (canvas) => (canvas as HTMLCanvasElement).toDataURL())
    await wait(1100)
    const line = await canvas()
    await chart.locator('[aria-label="Chart style"] button ::-p-text(donut)').click()
    await wait(1100)
    assert.notEqual(await canvas(), line, "chart style changes the rendered pixels")
    assert.match(await chart.$eval(".sr-only", (element) => element.textContent!), /donut variant/)
    const drawing = frame("pixel-brush-canvas")
    const art = () => drawing.$eval("canvas", (canvas) => (canvas as HTMLCanvasElement).toDataURL())
    const originalArt = await art()
    await drawing.locator('[aria-label="Use lilac ink"]').click()
    await drawing.waitForFunction(() => document.querySelector('[aria-label="Use lilac ink"]')!.getAttribute("aria-pressed") === "true")
    await wait(100)
    await drawing.locator("canvas").click()
    assert.ok(await art() !== originalArt, "clicking the native canvas actually paints")
    await drawing.locator('[aria-label="Undo drawing"]').click()
    assert.equal(await art(), originalArt, "undo restores the artwork")
    await drawing.focus('[aria-label="Pixel art drawing canvas"]')
    await page.keyboard.press("Space")
    assert.ok(await art() !== originalArt, "pixel drawing works from the keyboard too")
    const scrubber = frame("scrubber")
    await scrubber.locator('[role="slider"]').click()
    await page.keyboard.press("End")
    assert.equal(await scrubber.$eval('[role="slider"]', (slider) => slider.getAttribute("aria-valuenow")), "100")
    assert.equal(await scrubber.$eval('[data-reshape-tile]', (tile) => (tile as HTMLElement).style.borderRadius), "50%", "scrubbing visibly reshapes the tile")
    assert.ok(await page.$eval('[data-scene-card="smoothui/scrubber"]', (card) => card.querySelector('[data-gallery-preview]')!.clientWidth <= card.clientWidth), "the focused scrubber fits its desktop card")
    const slider = await scrubber.$('[role="slider"]')
    const track = (await slider!.boundingBox())!
    await page.mouse.move(track.x + track.width * 0.25, track.y + track.height / 2)
    await page.mouse.down()
    await page.mouse.move(track.x + track.width * 0.7, track.y + track.height / 2, { steps: 10 })
    await page.mouse.up()
    assert.ok(Number(await scrubber.$eval('[role="slider"]', (slider) => slider.getAttribute("aria-valuenow"))) < 95, "real pointer dragging changes the scrubber value")
    assert.equal(page.url().replace(/\/$/, ""), base, "trying a component never navigates the parent")
    const plane = () => page.$eval("[data-scene-plane]", (element) => getComputedStyle(element).transform)
    await page.mouse.move(710, 140)
    await wait(500)
    const left = await plane()
    await page.mouse.move(1290, 150)
    await wait(500)
    assert.notEqual(await plane(), left, "cursor influences scene depth")
    const beforeFramePointer = await plane()
    await chart.hover("canvas")
    await wait(500)
    assert.notEqual(await plane(), beforeFramePointer, "trusted native-frame pointer events influence depth too")
    await page.mouse.move(300, 160)
    await wait(900)
    const matrix = () => page.$eval("[data-scene-plane]", (element) => Array.from(new DOMMatrixReadOnly(getComputedStyle(element).transform).toFloat64Array()))
    const trusted = await matrix()
    await page.evaluate("window.postMessage({type:'design-infra-pointer', x:1000, y:1000}, location.origin)")
    await wait(400)
    assert.ok((await matrix()).every((value, index) => Math.abs(value - trusted[index]) < 0.01), "unrecognized message sources cannot move the scene")
    await page.screenshot({ path: ".context/home-scene-desktop.png" })
    await page.click('[data-hero-playground] button ::-p-text(Pause all)')
    await page.waitForFunction(() => document.querySelectorAll('[data-gallery-preview] iframe').length === 0)
    assert.ok(await page.$$eval('[data-scene-card] img', (images) => images.every((image) => getComputedStyle(image).visibility === "visible")), "Pause all restores static examples")
    await page.waitForSelector('[data-scene-active="false"]')
    await page.mouse.move(720, 180)
    await wait(500)
    const paused = await plane()
    await page.mouse.move(1290, 180)
    await wait(350)
    assert.equal(await plane(), paused, "pause all also stops cursor motion")
    await page.click('[data-hero-playground] button ::-p-text(Resume all)')
    await readyScene()
    await page.evaluate("Object.defineProperty(document, 'hidden', {configurable:true, get:()=>true}); document.dispatchEvent(new Event('visibilitychange'))")
    await page.waitForFunction(() => document.querySelectorAll('[data-gallery-preview] iframe').length === 0)
    await page.waitForSelector('[data-scene-active="false"]')
    await page.evaluate("Object.defineProperty(document, 'hidden', {configurable:true, get:()=>false}); document.dispatchEvent(new Event('visibilitychange'))")
    await readyScene()
    await page.$eval("#live-components", (element) => element.scrollIntoView({ block: "start" }))
    await page.waitForFunction(() => document.querySelectorAll('[data-scene-card] iframe').length === 0)
    await budget()
    await page.waitForSelector('[data-home-example="smoothui/progressive-blur"] iframe[data-ready="1"]')
    for (const id of ["smoothui/progressive-blur", "smoothui/card-swipe-deck"]) await assertStableHandoff(page, id)
    assert.equal(await page.$('#live-components button ::-p-text(Interact)'), null, "homepage demos require no interaction gate")
    const blur = frame("progressive-blur")
    await blur.select('[aria-label="Blur direction"]', "top")
    assert.ok(await blur.$$eval('[style*="backdrop-filter"]', (layers) => layers.some((layer) => (layer as HTMLElement).style.maskImage.includes("to top"))))
    await blur.focus('[aria-label="Blur intensity"]')
    await page.keyboard.press("Home")
    assert.ok(await blur.$$eval('[style*="backdrop-filter"]', (layers) => layers.every((layer) => (layer as HTMLElement).style.opacity === "0")))
    await blur.focus('[aria-label="Scrollable activity example"]')
    await page.keyboard.press("End")
    await blur.waitForFunction(() => document.querySelector('[aria-label="Scrollable activity example"]')!.scrollTop > 0)
    await page.waitForSelector('[data-home-example="smoothui/card-swipe-deck"] iframe[data-ready="1"]')
    const deck = frame("card-swipe-deck")
    const deckBounds = (await (await deck.$('[aria-label="Swipeable card deck"]'))!.boundingBox())!
    await page.mouse.move(deckBounds.x + deckBounds.width / 2, deckBounds.y + deckBounds.height / 2)
    await page.mouse.down()
    await page.mouse.move(deckBounds.x + 10, deckBounds.y + deckBounds.height / 2, { steps: 16 })
    await page.mouse.up()
    await deck.waitForFunction(() => document.querySelector('[role="status"]')!.textContent!.includes("Passed: A little play."))
    await deck.locator('[aria-label="Reset cards"]').click()
    await deck.locator('button ::-p-text(Keep)').click()
    await deck.waitForFunction(() => document.querySelector('[role="status"]')!.textContent!.includes("Kept: A little play."))
    await wait(600)
    await deck.focus('[aria-label="Swipeable card deck"]')
    await page.keyboard.press("ArrowLeft")
    await deck.waitForFunction(() => document.querySelector('[role="status"]')!.textContent!.includes("Passed: Keep it calm."))
    await deck.locator('[aria-label="Reset cards"]').click()
    // Explicit playback isolates visibility cleanup from the shared three-frame budget.
    await page.click('[aria-label="Pause Progressive blur"]')
    assert.equal(await page.$eval('[data-home-example="smoothui/progressive-blur"] img', (image) => getComputedStyle(image).visibility), "visible", "individual pause restores the poster")
    await page.click('[aria-label="Play Progressive blur"]')
    assert.equal(await page.$eval('[data-home-example="smoothui/progressive-blur"] img', (image) => getComputedStyle(image).visibility), "hidden", "explicit play reveals from the neutral surface too")
    await page.waitForSelector('[data-home-example="smoothui/progressive-blur"] iframe[data-ready="1"]')
    const partialFrame = frame("progressive-blur")
    await page.$eval('[data-home-example="smoothui/progressive-blur"] [data-gallery-preview]', (element) => {
      const bounds = element.getBoundingClientRect()
      scrollTo(0, scrollY + bounds.top - innerHeight + bounds.height * 0.1)
    })
    await wait(250)
    assert.ok(page.frames().includes(partialFrame), "a demo stays mounted while its last 10% is visible")
    await page.$eval("#live-components", (element) => element.scrollIntoView({ block: "start" }))
    // Scroll away and back with the new frame request held: its previous ready state must not leak.
    await page.$eval('[data-home-example="oc/beam-card"]', (element) => element.scrollIntoView({ block: "center" }))
    await page.waitForSelector('[data-home-example="oc/beam-card"] iframe[data-ready="1"]')
    await page.$eval('[data-component-scene]', (element) => element.scrollIntoView({ block: "center" }))
    await page.waitForFunction(() => !document.querySelector('[data-home-example="oc/beam-card"] iframe'))
    await page.setRequestInterception(true)
    let receiveBeam!: (request: HTTPRequest) => void
    const pendingBeam = new Promise<HTTPRequest>((resolve) => { receiveBeam = resolve })
    let held = false
    const holdBeam = (request: HTTPRequest) => {
      if (!held && request.url().includes("/preview/oc/beam-card?")) { held = true; receiveBeam(request) }
      else void request.continue()
    }
    page.on("request", holdBeam)
    await page.$eval('[data-home-example="oc/beam-card"]', (element) => element.scrollIntoView({ block: "center" }))
    const heldBeam = await Promise.race([pendingBeam, wait(10000).then(() => { throw new Error("Returning Beam frame was not requested") })])
    await page.waitForSelector('[data-home-example="oc/beam-card"] iframe')
    assert.equal(await page.$eval('[data-home-example="oc/beam-card"] iframe', (frame) => getComputedStyle(frame).opacity), "0", "a returning demo stays hidden until this frame is ready")
    assert.equal(await page.$eval('[data-home-example="oc/beam-card"] img', (image) => getComputedStyle(image).visibility), "hidden", "a delayed returning frame never shows a mismatched screenshot")
    await page.evaluate("window.postMessage({type:'design-infra-preview', status:'ready'}, location.origin)")
    assert.equal(await page.$eval('[data-home-example="oc/beam-card"] iframe', (frame) => getComputedStyle(frame).opacity), "0", "unrecognized message sources cannot expose an unready frame")
    const posterColor = await page.$eval('[data-home-example="oc/beam-card"] img', (image) => {
      const canvas = document.createElement("canvas")
      canvas.width = canvas.height = 1
      const context = canvas.getContext("2d")!
      context.drawImage(image as HTMLImageElement, 0, 0)
      return [...context.getImageData(0, 0, 1, 1).data].slice(0, 3)
    })
    assert.ok(posterColor.every((channel) => channel < 50), "Beam's poster uses the same dark surface as its live demo")
    await heldBeam.continue()
    page.off("request", holdBeam)
    await page.setRequestInterception(false)
    await page.waitForSelector('[data-home-example="oc/beam-card"] iframe[data-ready="1"]')
    await page.screenshot({ path: ".context/home-showcase-desktop.png" })
    await page.setViewport({ width: 1440, height: 2400 })
    await wait(350)
    await budget()
    for (const width of [320, 390, 768]) {
      await page.setViewport({ width, height: 1000 })
      await page.$eval("[data-component-scene]", (element) => element.scrollIntoView({ block: "center" }))
      await readyScene()
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `parent overflow at ${width}px`)
      assert.ok(await page.$$eval('[data-scene-card]', (cards) => cards.every((card) => card.querySelector('[data-gallery-preview]')!.clientWidth <= card.clientWidth)), `preview frames stay inside scene cards at ${width}px`)
      for (const demo of ["dither-chart", "pixel-brush-canvas", "scrubber"]) {
        const size = await frame(demo).evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, height: innerHeight, tall: document.documentElement.scrollHeight }))
        assert.ok(size.scroll <= size.width + 1 && size.tall <= size.height + 1, `${demo} should fit its native frame at ${width}px: ${JSON.stringify(size)}`)
      }
      await page.screenshot({ path: `.context/home-scene-${width}.png` })
      await budget()
      for (const demo of ["progressive-blur", "card-swipe-deck"]) {
        await page.$eval(`[data-home-example="smoothui/${demo}"]`, (element) => element.scrollIntoView({ block: "center" }))
        await page.waitForSelector(`[data-home-example="smoothui/${demo}"] iframe[data-ready="1"]`)
        assert.ok(await page.$eval(`[data-home-example="smoothui/${demo}"]`, (card) => card.querySelector('[data-gallery-preview]')!.clientWidth <= card.clientWidth), `${demo} preview stays inside its card at ${width}px`)
        const size = await frame(demo).evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, height: innerHeight, tall: document.documentElement.scrollHeight }))
        assert.ok(size.scroll <= size.width + 1 && size.tall <= size.height + 1, `${demo} controls fit at ${width}px: ${JSON.stringify(size)}`)
      }
    }
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }])
    await page.reload({ waitUntil: "networkidle2" })
    await page.$eval("[data-component-scene]", (element) => element.scrollIntoView({ block: "center" }))
    await wait(300)
    assert.equal(await page.$$eval('[data-gallery-preview] iframe', (items) => items.length), 0, "reduced motion starts on posters")
    assert.equal(await page.$eval('[data-component-scene]', (element) => (element as HTMLElement).dataset.sceneActive), "false")
    assert.ok(await page.$$eval('[data-scene-card] img', (images) => images.length === 3 && images.every((image) => image.complete && image.naturalWidth > 0 && getComputedStyle(image).visibility === "visible")), "reduced motion has visible, useful generated posters")
    await page.click('[data-scene-card="smoothui/pixel-brush-canvas"] button ::-p-text(Play)')
    await page.waitForSelector('[data-scene-card="smoothui/pixel-brush-canvas"] iframe[data-ready="1"]')
    assert.equal(await page.$eval('[data-scene-card="smoothui/pixel-brush-canvas"] img', (image) => getComputedStyle(image).visibility), "hidden", "explicit reduced-motion playback hides its poster")
    assert.equal(await page.$eval('[data-scene-card="smoothui/pixel-brush-canvas"] iframe', (frame) => getComputedStyle(frame).transitionProperty), "none", "reduced motion disables the handoff fade")
    await frame("pixel-brush-canvas").locator('[aria-label="Use lime ink"]').click()
    assert.equal(await frame("pixel-brush-canvas").$eval('[aria-label="Use lime ink"]', (button) => button.getAttribute("aria-pressed")), "true")
    await page.click(`nav a[href="${sitePath("/guide")}"]`)
    await page.waitForFunction(() => document.querySelectorAll('[data-gallery-preview] iframe').length === 0 && !document.querySelector('[data-component-scene]'))
    for (const name of ["dither-chart", "progressive-blur", "pixel-brush-canvas", "scrubber", "card-swipe-deck"]) {
      await page.goto(`${base}/components/smoothui/${name}`, { waitUntil: "networkidle2" })
      const source = await page.$eval(`iframe[src*="/preview/smoothui/${name}?"]`, (frame) => (frame as HTMLIFrameElement).src)
      assert.equal(new URL(source).origin, new URL(base).origin, "detail pages keep the hosted demo on the same site")
      assert.ok(await page.evaluate((command) => document.body.innerText.includes(command), `npx shadcn@latest add @smoothui/${name}`), "the upstream installation command remains available beside the demo")
    }
    assert.equal(errors.length, 0, errors.join("\n"))
    console.log("✓ homepage scene: real chart pixels, pixel painting/undo, pointer/keyboard scrubbing, swipe dragging/buttons/keyboard, pointer depth/relay validation, dark Beam poster/returning-frame readiness, frame containment, global pause, shared budget, hidden/offscreen cleanup, responsive native frames, blur controls/scrolling, reduced motion, navigation disposal and hosted detail/install handoff")

    const failure = await browser.newPage()
    await failure.setViewport({ width: 1440, height: 1000 })
    await failure.setRequestInterception(true)
    failure.on("request", (request) => request.url().includes("/preview/smoothui/dither-chart") ? request.abort() : request.continue())
    await failure.goto(base, { waitUntil: "networkidle2" })
    await failure.waitForSelector('[data-scene-card="smoothui/dither-chart"] iframe')
    await failure.waitForSelector('[data-scene-card="smoothui/dither-chart"] ::-p-text(Preview unavailable)', { timeout: 25000 })
    assert.ok(await failure.$('[data-scene-card="smoothui/dither-chart"] header a'))
    assert.ok(await failure.$eval('[data-scene-card="smoothui/dither-chart"] img', (image) => (image as HTMLImageElement).naturalWidth > 0 && getComputedStyle(image).visibility === "visible"), "failed demos restore a visible poster")
    await failure.setJavaScriptEnabled(false)
    await failure.reload({ waitUntil: "networkidle2" })
    assert.equal(await failure.$$eval('[data-scene-card] header a', (links) => links.length), 3)
    assert.equal(await failure.$$eval('[data-scene-card] img', (images) => images.length), 3)
    assert.ok(await failure.$$eval('[data-scene-card] img', (images) => images.every((image) => getComputedStyle(image).visibility === "visible")), "no-JavaScript visitors retain the static composition")
    console.log("✓ homepage scene: failed-frame poster/source fallback and useful no-JavaScript composition")
    await failure.close()

    const delayed = await browser.newPage()
    await observeHandoffs(delayed)
    // Parent and iframe font requests can coalesce even with the HTTP cache off.
    // A distinct real font request in the child's FontFaceSet makes this check
    // independent of shared font caches and unrelated, unused preload requests.
    assert.ok(fontAsset, "the page loaded a real hosted font asset")
    const delayedFont = new URL(fontAsset)
    delayedFont.searchParams.set("preview-readiness-check", "1")
    await delayed.evaluateOnNewDocument((url) => {
      if (!location.pathname.includes("/preview/smoothui/progressive-blur")) return
      const face = new FontFace("Preview readiness check", `url(${JSON.stringify(url)})`)
      document.fonts.add(face)
      void face.load().catch(() => {})
    }, delayedFont.href)
    // Watch every parent animation frame, including before hydration. Rect checks
    // alone miss a differently scaled raster being replaced by stable native UI.
    await delayed.evaluateOnNewDocument(`(() => {
      if (top !== self) return;
      window.__posterFlashes = [];
      const check = () => {
        document.querySelectorAll('[data-poster-mode="paused"] > img').forEach((image) => {
          if (getComputedStyle(image).visibility !== 'hidden') window.__posterFlashes.push(image.alt);
        });
        requestAnimationFrame(check);
      };
      requestAnimationFrame(check);
    })()`)
    await delayed.setViewport({ width: 1440, height: 1000 })
    await delayed.setCacheEnabled(false)
    await delayed.setRequestInterception(true)
    const fonts: HTTPRequest[] = []
    let holdFonts = true
    let receiveFont!: () => void
    const firstFont = new Promise<void>((resolve) => { receiveFont = resolve })
    const holdFont = (request: HTTPRequest) => {
      if (holdFonts && request.resourceType() === "font" && request.url() === delayedFont.href && request.frame()?.url().includes("/preview/smoothui/progressive-blur?")) { fonts.push(request); receiveFont() }
      else void request.continue()
    }
    delayed.on("request", holdFont)
    await delayed.goto(base, { waitUntil: "domcontentloaded" })
    await delayed.$eval("#live-components", (element) => element.scrollIntoView({ block: "start" }))
    await Promise.race([firstFont, wait(10000).then(() => { throw new Error("No preview font request intercepted") })])
    await delayed.evaluate(async () => { await document.fonts.ready })
    await wait(100)
    const loadingFrame = delayed.frames().find((frame) => frame.url().includes("/preview/smoothui/progressive-blur?"))
    assert.ok(loadingFrame)
    assert.equal(await loadingFrame.evaluate(() => document.fonts.status), "loading", "the delayed request actually blocks the child's font readiness")
    assert.equal(await delayed.$eval('[data-home-example="smoothui/progressive-blur"] iframe', (frame) => getComputedStyle(frame).opacity), "0", "a demo stays hidden while real font requests are pending")
    assert.equal(await delayed.$eval('[data-home-example="smoothui/progressive-blur"] img', (image) => getComputedStyle(image).visibility), "hidden", "slow fonts do not expose a screenshot before the native layout")
    holdFonts = false
    await Promise.all(fonts.map((request) => request.continue()))
    delayed.off("request", holdFont)
    await delayed.setRequestInterception(false)
    await delayed.waitForSelector('[data-home-example="smoothui/progressive-blur"] iframe[data-ready="1"]')
    await assertStableHandoff(delayed, "smoothui/progressive-blur")
    await delayed.waitForFunction(() => getComputedStyle(document.querySelector('[data-home-example="smoothui/progressive-blur"] iframe')!).opacity === "1")
    assert.equal(await delayed.$eval('[data-home-example="smoothui/progressive-blur"] iframe', (frame) => getComputedStyle(frame).transitionDuration), "0.2s")
    for (const width of [1440, 768, 390]) {
      await delayed.setViewport({ width, height: 1000 })
      for (const selector of ['[data-home-example="oc/beam-card"]', '[data-component-scene]', '[data-home-example="smoothui/card-swipe-deck"]', '[data-component-scene]']) {
        await delayed.$eval(selector, (element) => element.scrollIntoView({ block: "center" }))
        await wait(350)
        assert.ok(await delayed.$$eval('[data-playing="true"]', (items) => items.length) <= 3)
        assert.ok(await delayed.$$eval('[data-poster-mode="paused"] > img', (images) => images.length === 7 && images.every((image) => getComputedStyle(image).visibility === "hidden")), `automatic scroll entry/re-entry and budget changes never show posters at ${width}px`)
      }
    }
    const flashes = await delayed.evaluate(() => (window as unknown as { __posterFlashes: string[] }).__posterFlashes)
    assert.deepEqual(flashes, [], "no screenshot is painted during automatic playback, from first paint through scroll/re-entry and resizing")
    await delayed.close()
    console.log("✓ homepage handoff: no automatic screenshot swaps from first paint through delayed loads, scrolling both ways, budget changes and responsive resizing; pause/reduced-motion/failure/no-JS posters retained")
  } finally { await browser.close() }
}
main().catch((error: unknown) => { console.error(error); process.exitCode = 1 })
