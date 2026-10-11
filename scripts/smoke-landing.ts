import assert from "node:assert/strict"
import { existsSync, mkdirSync } from "node:fs"
import { parseArgs } from "node:util"
import puppeteer from "puppeteer-core"

import { AGENT_PROMPTS } from "../lib/integration"

const { values } = parseArgs({ options: { base: { type: "string", default: "http://localhost:3000" } } })
const base = new URL(values.base!).origin
const executablePath = process.env.CHROME_PATH ?? ["/usr/bin/google-chrome", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find(existsSync)
if (!executablePath) throw new Error("Set CHROME_PATH to Chrome's executable")

async function main() {
  mkdirSync(".context", { recursive: true })
  const browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] })
  const page = await browser.newPage()
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(String(error)))
  try {
    await browser.defaultBrowserContext().overridePermissions(base, ["clipboard-read", "clipboard-write", "clipboard-sanitized-write"])
    await page.setViewport({ width: 1440, height: 1000 })
    await page.goto(base, { waitUntil: "networkidle2" })
    const prompt = () => page.$eval("#home-agent-prompt", (element) => (element as HTMLTextAreaElement).value)
    assert.equal(await prompt(), AGENT_PROMPTS.recommend)
    await page.locator('button ::-p-text(Copy agent prompt)').click()
    await page.waitForFunction(() => document.querySelector('[role="status"]')?.textContent?.startsWith("Copied."))
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), AGENT_PROMPTS.recommend)
    await page.locator('button ::-p-text(Choose and build)').click()
    assert.equal(await prompt(), AGENT_PROMPTS.implement)
    assert.ok(await page.$('button[aria-pressed="true"] ::-p-text(Choose and build)'))
    assert.match(await page.$eval('[role="status"]', (element) => element.textContent ?? ""), /authorizes/)
    await page.locator('button ::-p-text(Copy agent prompt)').click()
    await page.waitForFunction(() => document.querySelector('[role="status"]')?.textContent?.startsWith("Copied."))
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), AGENT_PROMPTS.implement)
    await page.locator('button ::-p-text(Recommend first)').click()
    await page.locator('button ::-p-text(More)').click()
    assert.ok(await page.$('[role="menuitem"][href="/design-systems"]'))
    await page.keyboard.press("Escape")
    await page.waitForSelector('[role="menu"]', { hidden: true })
    await page.click("h1")
    await page.screenshot({ path: ".context/landing-desktop.png", fullPage: true })
    await page.screenshot({ path: ".context/landing-hero.png" })
    for (const width of [320, 390, 768]) {
      await page.setViewport({ width, height: 844 })
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `horizontal overflow at ${width}px`)
      assert.equal(await prompt(), AGENT_PROMPTS.recommend)
    }
    await page.setViewport({ width: 390, height: 844 })
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }])
    await page.screenshot({ path: ".context/landing-mobile.png", fullPage: true })
    await page.evaluate('Object.defineProperty(navigator.clipboard, "writeText", { configurable: true, value: async () => { throw new Error("Clipboard unavailable") } })')
    await page.locator('button ::-p-text(Copy agent prompt)').click()
    await page.waitForFunction(() => document.querySelector('[role="status"]')?.textContent?.includes("copy it manually"))
    await page.focus("#home-agent-prompt")
    assert.equal(await page.$eval("#home-agent-prompt", (element) => {
      const text = element as HTMLTextAreaElement
      return text.value.slice(text.selectionStart, text.selectionEnd)
    }), AGENT_PROMPTS.recommend)
    const destinations = await page.$$eval('main a[href^="/"]', (links) => [...new Set(links.map((link) => link.getAttribute("href")!))])
    for (const destination of destinations) {
      const response = await fetch(base + destination)
      assert.equal(response.status, 200, destination)
    }
    const index = await fetch(base + "/llms.txt")
    assert.equal(index.status, 200)
    assert.match(index.headers.get("content-type")!, /text\/plain/)
    const instructions = await index.text()
    assert.ok(instructions.includes("/integrate/raw") && instructions.includes("Recommend first:") && instructions.includes("Choose and build:"))
    assert.deepEqual(errors, [])
    console.log("✓ landing: prompt modes, actual clipboard, failure fallback, menu, mobile/tablet layout, reduced motion, links and agent index")
  } finally { await browser.close() }
}
main().catch((error: unknown) => { console.error(error); process.exitCode = 1 })
