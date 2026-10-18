import { sitePath } from "../lib/config"
import { galleryBase } from "./lib/gallery-base"
import assert from "node:assert/strict"
import { existsSync, mkdirSync } from "node:fs"
import { parseArgs } from "node:util"
import puppeteer from "puppeteer-core"

const { values } = parseArgs({ options: { base: { type: "string", default: "http://localhost:3000" } } })
const base = galleryBase(values.base!)
const executablePath = process.env.CHROME_PATH ?? ["/usr/bin/google-chrome", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find(existsSync)
if (!executablePath) throw new Error("Set CHROME_PATH to Chrome's executable")

const root = "[data-request-examples]"
const expected = [
  ["loading", "/components?category=loader"],
  ["navigation", "/components?category=navigation"],
  ["pricing", "/components?category=pricing"],
  ["features", "/components?category=features"],
  ["tables", "/components?category=table"],
  ["reference", "/reference"],
  ["motion", "/components?q=card&integration=wrapper"],
  ["data-screen", "/components?category=chart"],
]

async function main() {
  mkdirSync(".context", { recursive: true })
  const browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] })
  const page = await browser.newPage()
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(String(error)))
  page.on("console", (message) => { if (message.type() === "error" && /hydration|hydrated|React error/i.test(message.text())) errors.push(message.text()) })
  try {
    await browser.defaultBrowserContext().overridePermissions(new URL(base).origin, ["clipboard-read", "clipboard-write", "clipboard-sanitized-write"])
    // Observe real carousel intervals without accelerating their two-second delay.
    await page.evaluateOnNewDocument(`
      window.__requestTimers = new Set();
      const originalSetInterval = window.setInterval;
      const originalClearInterval = window.clearInterval;
      window.setInterval = (...args) => {
        const id = originalSetInterval(...args);
        if (args[1] === 2000) window.__requestTimers.add(id);
        return id;
      };
      window.clearInterval = (id) => {
        window.__requestTimers.delete(id);
        return originalClearInterval(id);
      };
    `)
    const state = (playing: boolean) => page.waitForFunction(`
      document.querySelector('${root}')?.dataset.rotation === '${playing ? "playing" : "paused"}' &&
      window.__requestTimers.size === ${playing ? 1 : 0}
    `)
    const show = async () => {
      await page.$eval(root, (element) => element.scrollIntoView({ block: "center" }))
      await page.mouse.move(0, 0)
      await page.evaluate("document.activeElement?.blur()")
    }
    const button = (label: string) => `${root} button[aria-label="${label}"]`
    const id = () => page.$eval(root, (element) => (element as HTMLElement).dataset.requestId)
    const waitForId = (value: string) => page.waitForFunction((selector, expectedId) => (document.querySelector(selector) as HTMLElement)?.dataset.requestId === expectedId, {}, root, value)
    const select = async (index: number) => {
      await page.click(`${root} [aria-label="Choose an example"] button:nth-child(${index + 1})`)
      await page.waitForFunction((selector, value) => (document.querySelector(selector) as HTMLElement)?.dataset.requestId === value, {}, root, expected[index][0])
    }

    await page.setViewport({ width: 1440, height: 1000 })
    await page.goto(base, { waitUntil: "networkidle2" })
    await page.waitForSelector(`${root} button:not([disabled])`)
    await state(false) // No carousel timer while the section is below the fold.
    await show()
    await state(true)
    assert.equal(await id(), "loading")
    assert.equal(await page.$eval(`${root} [aria-live]`, (element) => element.getAttribute("aria-live")), "off")
    await page.waitForFunction((selector) => (document.querySelector(selector) as HTMLElement)?.dataset.requestId === "navigation", { timeout: 4500 }, root)
    await page.hover(`${root} [data-request-question]`)
    await state(true)
    await page.waitForFunction((selector) => (document.querySelector(selector) as HTMLElement)?.dataset.requestId === "pricing", { timeout: 4500 }, root)
    await page.focus(button("Previous example"))
    await page.keyboard.press("Tab") // Keyboard focus pauses; mouse hover does not.
    await state(false)
    await page.keyboard.press("Enter") // Explicitly pause, then play from the focused control.
    await state(false)
    await page.keyboard.press("Enter")
    await state(true) // Play works without blurring or moving the pointer away.
    await select(0)
    await state(true)
    await page.click(button("Previous example"))
    await waitForId("data-screen")
    assert.equal(await id(), "data-screen")
    await state(true) // Arrow clicks keep cycling rather than silently pausing.
    await page.click(button("Next example"))
    await waitForId("loading")
    assert.equal(await id(), "loading")
    await state(true)
    await page.click(button("Pause examples"))
    await show()
    await state(false)
    await select(1)
    await state(false) // Manual selection respects an explicit pause.
    assert.equal(await page.$eval(`${root} [aria-live]`, (element) => element.getAttribute("aria-live")), "polite")
    await page.click(button("Play examples"))
    await state(true)
    await page.evaluate("window.scrollTo(0, 0)")
    await state(false)
    await show()
    await state(true)
    await page.evaluate("Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange'))")
    await state(false)
    await page.evaluate("Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); document.dispatchEvent(new Event('visibilitychange'))")
    await state(true)

    await page.click(button("Pause examples"))
    await state(false)
    assert.ok(await page.$(`${root} [data-request-screenshot] svg[role="img"]`))
    assert.match(await page.$eval(`${root} [data-request-screenshot]`, (element) => element.textContent!), /Example attachment[\s\S]*Screenshot added/)

    await select(0)
    await page.waitForFunction(() => {
      const question = document.querySelector("[data-request-question]")!
      const style = getComputedStyle(question)
      return style.opacity === "1" && Math.abs(new DOMMatrixReadOnly(style.transform).m42) < 0.01
    })
    // Record real animation frames: one readable question and matching link throughout.
    await page.evaluate(`(() => {
      window.__requestFrames = [];
      const record = () => {
        const root = document.querySelector('[data-request-examples]');
        const question = root.querySelector('[data-request-question]');
        const style = getComputedStyle(question);
        window.__requestFrames.push({
          id: root.dataset.requestId, text: question.textContent,
          opacity: Number(style.opacity), y: new DOMMatrixReadOnly(style.transform).m42,
          height: root.getBoundingClientRect().height,
          href: root.querySelector('[data-request-link]').getAttribute('href')
        });
        if (window.__requestFrames.length < 40) requestAnimationFrame(record);
      };
      requestAnimationFrame(record);
      document.querySelector('[data-request-examples] button[aria-label="Next example"]').click();
    })()`)
    await page.waitForFunction("window.__requestFrames.length === 40")
    const frames = await page.evaluate("window.__requestFrames") as { id: string; text: string; opacity: number; y: number; height: number; href: string }[]
    assert.ok(frames.some((frame) => frame.id === "loading" && frame.opacity > 0 && frame.opacity < 1 && frame.y < 0), "outgoing question fades and slides up")
    assert.ok(frames.some((frame) => frame.id === "navigation" && frame.opacity > 0 && frame.opacity < 1 && frame.y > 0), "incoming question fades and settles into place")
    for (const frame of frames) {
      assert.equal(frame.href, sitePath(frame.id === "loading" ? expected[0][1] : expected[1][1]))
      assert.match(frame.text, frame.id === "loading" ? /Find a loading component/ : /Make this navbar/)
      assert.ok(Math.abs(frame.height - frames[0].height) < 1, "card stays steady during transition")
    }
    // Rapid navigation coalesces to the latest choice; Copy pins the visible request.
    await page.evaluate(`(() => {
      const root = document.querySelector('[data-request-examples]');
      root.querySelector('button[aria-label="Next example"]').click();
      root.querySelector('button[aria-label="Next example"]').click();
      root.querySelector('button[aria-label="Previous example"]').click();
    })()`)
    await waitForId("pricing")
    await page.waitForFunction("getComputedStyle(document.querySelector('[data-request-question]')).opacity === '1'")
    await page.evaluate(`(() => {
      const root = document.querySelector('[data-request-examples]');
      root.querySelector('button[aria-label="Next example"]').click();
      setTimeout(() => {
        window.__copiedQuestion = root.querySelector('[data-request-question]').textContent.slice(1, -1);
        window.__copiedId = root.dataset.requestId;
        [...root.querySelectorAll('button')].find(button => button.textContent === 'Copy request').click();
      }, 40);
    })()`)
    await page.waitForFunction((selector) => document.querySelector(`${selector} [role="status"]`)?.textContent?.startsWith("Copied."), {}, root)
    const copiedQuestion = await page.evaluate("window.__copiedQuestion") as string
    assert.ok((await page.evaluate(() => navigator.clipboard.readText())).includes(copiedQuestion))
    await page.waitForFunction("getComputedStyle(document.querySelector('[data-request-question]')).opacity === '1'")
    assert.equal(await id(), await page.evaluate("window.__copiedId"))
    console.log("✓ requests: playback, transition frames, rapid navigation and in-flight clipboard")

    for (let index = 0; index < expected.length; index++) {
      await select(index)
      assert.equal(await page.$eval(`${root} [data-request-link]`, (element) => element.getAttribute("href")), sitePath(expected[index][1]))
      assert.equal(await page.$$eval(`${root} [aria-label="Choose an example"] button[aria-pressed="true"]`, (elements) => elements.length), 1)
      const response = await page.evaluate(async (url) => {
        const response = await fetch(url, { signal: AbortSignal.timeout(15_000) })
        // Drain streamed catalog pages before opening another; unread bodies can
        // occupy the browser's per-origin connections as the catalog grows.
        await response.arrayBuffer()
        return { status: response.status }
      }, base + expected[index][1])
      assert.equal(response.status, 200, expected[index][1])
    }
    for (const index of [0, 7]) {
      await select(index)
      const question = await page.$eval(`${root} [data-request-question]`, (element) => element.textContent!.slice(1, -1))
      await page.click(`${root} button ::-p-text(Copy request)`)
      await page.waitForFunction((selector) => document.querySelector(`${selector} [role="status"]`)?.textContent?.startsWith("Copied."), {}, root)
      const copied = await page.evaluate(() => navigator.clipboard.readText())
      assert.ok(copied.includes(question) && copied.includes("/integrate/raw") && copied.includes("github.com/") && copied.includes("screenshot or link I attach"))
      assert.match(copied, index === 0 ? /wait for my pick/i : /implement in our existing stack/i)
      await show()
      await state(false)
    }
    await page.evaluate('Object.defineProperty(navigator.clipboard, "writeText", { configurable: true, value: async () => { throw new Error("Clipboard unavailable") } })')
    await select(0)
    await page.click(`${root} button ::-p-text(Copy request)`)
    await page.waitForFunction((selector) => document.querySelector(`${selector} [role="status"]`)?.textContent?.includes("copy it manually"), {}, root)
    assert.ok(await page.$eval(`${root} textarea`, (element) => {
      const text = element as HTMLTextAreaElement
      return document.activeElement === text && text.selectionStart === 0 && text.selectionEnd === text.value.length && text.value.includes("Find a loading component to put here.")
    }))

    await page.evaluate("document.querySelector('[data-request-examples] button[aria-label=\"Next example\"]').click()")
    await waitForId("navigation")
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }])
    await page.evaluate("new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))")
    assert.ok(await page.$eval("[data-request-question]", (element) => {
      const style = getComputedStyle(element)
      return style.opacity === "1" && Math.abs(new DOMMatrixReadOnly(style.transform).m42) < 0.01
    }), "enabling reduced motion stops an incoming transition immediately")
    await page.reload({ waitUntil: "networkidle2" })
    await show()
    await state(false)
    assert.ok(await page.$(button("Play examples")))
    await page.click(button("Play examples"))
    await show()
    await state(true) // Explicit opt-in is available with reduced motion.
    await page.click(button("Pause examples"))
    await show()
    await state(false)
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewport({ width, height: 1000 })
      await select(0)
      const baseline = await page.$eval(root, (element) => {
        const bounds = element.getBoundingClientRect()
        return [bounds.height, element.querySelector("[data-request-screenshot]")!.getBoundingClientRect().top - bounds.top, element.querySelector("[data-request-link]")!.getBoundingClientRect().top - bounds.top]
      })
      for (let index = 0; index < expected.length; index++) {
        await select(index)
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `horizontal overflow at ${width}px, ${expected[index][0]}`)
        const positions = await page.$eval(root, (element) => {
          const bounds = element.getBoundingClientRect()
          return [bounds.height, element.querySelector("[data-request-screenshot]")!.getBoundingClientRect().top - bounds.top, element.querySelector("[data-request-link]")!.getBoundingClientRect().top - bounds.top]
        })
        positions.forEach((value, item) => assert.ok(Math.abs(value - baseline[item]) < 1, `layout shifts at ${width}px, ${expected[index][0]}`))
        assert.equal(await page.$eval("[data-request-question]", (element) => getComputedStyle(element).opacity), "1", "reduced motion switches directly")
      }
      await select(0)
      await page.$eval("#what-you-can-do", (element) => element.scrollIntoView())
      await page.mouse.move(0, 0)
      await page.screenshot({ path: `.context/requests-${width}.png` })
    }
    const staticPage = await browser.newPage()
    await staticPage.setJavaScriptEnabled(false)
    await staticPage.goto(base, { waitUntil: "networkidle2" })
    assert.match(await staticPage.$eval(`${root} [data-request-question]`, (element) => element.textContent!), /Find a loading component/)
    assert.ok(await staticPage.$(`${root} button[disabled]`))
    assert.equal(await staticPage.$eval(`${root} [data-request-question]`, (element) => getComputedStyle(element).opacity), "1")
    assert.deepEqual(errors, [])
    console.log("✓ requests: smooth exit/entry frames, stable card/preview/controls, rapid navigation and in-flight copy, two-second rotation, keyboard/playback controls, offscreen/hidden cleanup, links/clipboard/fallback, reduced motion, responsive layouts and no-JS example")
  } finally { await browser.close() }
}

main().catch((error: unknown) => { console.error(error); process.exitCode = 1 })
