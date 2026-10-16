import { sitePath } from "../lib/config"
import { galleryBase } from "./lib/gallery-base"
import assert from "node:assert/strict"
import { existsSync, mkdirSync } from "node:fs"
import { parseArgs } from "node:util"
import puppeteer from "puppeteer-core"

import { SETUP_PROMPT } from "../lib/integration"

const { values } = parseArgs({ options: { base: { type: "string", default: "http://localhost:3000" } } })
const base = galleryBase(values.base!)
const executablePath = process.env.CHROME_PATH ?? ["/usr/bin/google-chrome", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find(existsSync)
if (!executablePath) throw new Error("Set CHROME_PATH to Chrome's executable")

async function main() {
  mkdirSync(".context", { recursive: true })
  const browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] })
  const page = await browser.newPage()
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(String(error)))
  try {
    await browser.defaultBrowserContext().overridePermissions(new URL(base).origin, ["clipboard-read", "clipboard-write", "clipboard-sanitized-write"])
    await page.setViewport({ width: 1440, height: 1000 })
    await page.goto(base, { waitUntil: "networkidle2" })
    const prompt = () => page.$eval("#home-agent-prompt", (element) => (element as HTMLTextAreaElement).value)
    assert.equal(await prompt(), SETUP_PROMPT)
    await page.click("#use-with-agent button")
    await page.waitForFunction(() => document.querySelector('[role="status"]')?.textContent?.startsWith("Copied."))
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), SETUP_PROMPT)
    assert.equal(await page.$('[aria-label="Agent behavior"]'), null)
    assert.match(await prompt(), /Integrate https:\/\/github\.com\//)
    assert.match(await prompt(), /into this project and show me how to use it/)
    assert.ok((await prompt()).split(/\s+/).length <= 25, "starting prompt should stay brief")
    assert.ok(await page.$('[data-hero-introduction] #home-agent-prompt'), "copy prompt belongs with the introduction")
    const composition = await page.evaluate(() => {
      const introduction = document.querySelector("[data-hero-introduction]")!.getBoundingClientRect()
      const playground = document.querySelector("[data-hero-playground]")!.getBoundingClientRect()
      const canvas = document.querySelector("[data-hero-playground] canvas")!.getBoundingClientRect()
      return { left: introduction.x, right: playground.x, width: canvas.width, height: canvas.height }
    })
    assert.ok(composition.left < composition.right && composition.width > 500 && Math.abs(composition.width - composition.height) < 1, "desktop pairs left-hand copy with a large square playground")
    assert.match(await page.$eval("#use-with-agent", (element) => element.textContent!), /Use it in your project[\s\S]*Setup & connection details[\s\S]*What to ask/)
    await page.locator('button ::-p-text(More)').click()
    assert.ok(await page.$(`[role="menuitem"][href="${sitePath("/design-systems")}"]`))
    await page.keyboard.press("Escape")
    await page.waitForSelector('[role="menu"]', { hidden: true })
    await page.click("h1")
    await page.screenshot({ path: ".context/landing-desktop.png", fullPage: true })
    await page.screenshot({ path: ".context/landing-hero.png" })
    for (const width of [320, 390, 768]) {
      await page.setViewport({ width, height: 844 })
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `horizontal overflow at ${width}px`)
      assert.equal(await prompt(), SETUP_PROMPT)
      assert.ok(await page.$eval("#home-agent-prompt", (element) => element.scrollHeight <= element.clientHeight), "the complete starting prompt remains readable")
      assert.ok(await page.evaluate(() => document.querySelector("[data-hero-introduction]")!.getBoundingClientRect().bottom <= document.querySelector("[data-hero-playground]")!.getBoundingClientRect().top), "introduction and prompt precede motion on small screens")
    }
    await page.setViewport({ width: 390, height: 844 })
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }])
    await page.screenshot({ path: ".context/landing-mobile.png", fullPage: true })
    await page.evaluate('Object.defineProperty(navigator.clipboard, "writeText", { configurable: true, value: async () => { throw new Error("Clipboard unavailable") } })')
    await page.click("#use-with-agent button")
    await page.waitForFunction(() => document.querySelector('[role="status"]')?.textContent?.includes("copy it manually"))
    await page.focus("#home-agent-prompt")
    assert.equal(await page.$eval("#home-agent-prompt", (element) => {
      const text = element as HTMLTextAreaElement
      return text.value.slice(text.selectionStart, text.selectionEnd)
    }), SETUP_PROMPT)
    const destinations = await page.$$eval('main a[href^="/"]', (links) => [...new Set(links.map((link) => link.getAttribute("href")!))])
    for (const destination of destinations) {
      const response = await page.evaluate(async (url) => {
        const response = await fetch(url, { signal: AbortSignal.timeout(15_000) })
        await response.arrayBuffer()
        return { status: response.status }
      }, new URL(destination, base).href)
      assert.equal(response.status, 200, destination)
    }
    const index = await page.evaluate(async (url) => { const response = await fetch(url); return { status: response.status, contentType: response.headers.get("content-type"), text: await response.text() } }, base + "/llms.txt")
    assert.equal(index.status, 200)
    assert.match(index.contentType!, /text\/plain/)
    const instructions = index.text
    assert.ok(instructions.includes("/integrate/raw") && instructions.includes("Recommend first:") && instructions.includes("Choose and build:"))
    await page.goto(base + "/guide", { waitUntil: "networkidle2" })
    assert.equal(await page.$$eval("[data-guide-step]", (steps) => steps.length), 4)
    assert.equal(await page.$$eval("[data-guide-detail][open]", (items) => items.length), 0)
    assert.ok(await page.$eval("[data-guide-step] > span", (element) => parseFloat(getComputedStyle(element).fontSize) >= 72))
    assert.equal(await page.$eval("#guide-agent-prompt", (element) => (element as HTMLTextAreaElement).value), SETUP_PROMPT)
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewport({ width, height: 1000 })
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `guide horizontal overflow at ${width}px`)
      await page.screenshot({ path: `.context/guide-${width}.png`, fullPage: true })
    }
    await page.locator('summary ::-p-text(Browse components visually)').click()
    assert.ok(await page.$("[data-guide-detail][open]"))
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "expanded guide horizontal overflow")
    await page.$$eval("[data-guide-detail]", (items) => items.forEach((element) => { (element as HTMLDetailsElement).open = true }))
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "all expanded guide sections fit on a phone")
    const raw = await page.evaluate(async (url) => (await fetch(url)).text(), base + "/guide/raw")
    for (const step of ["1. Connect your agent", "2. Show what you want to change", "3. Find the right parts", "4. Build, check, refine"]) assert.ok(raw.includes(step))
    assert.deepEqual(errors, [])
    console.log("✓ landing: neutral starting prompt, actual clipboard, failure fallback, menu, responsive layout, reduced motion, links, agent index and four-step guide/disclosures")
  } finally { await browser.close() }
}
main().catch((error: unknown) => { console.error(error); process.exitCode = 1 })
