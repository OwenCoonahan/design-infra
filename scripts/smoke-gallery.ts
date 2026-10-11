/** Run against a gallery: pnpm smoke:gallery --base http://localhost:3300 */
import assert from "node:assert/strict"
import { existsSync, mkdirSync } from "node:fs"
import { parseArgs } from "node:util"

import puppeteer from "puppeteer-core"

import { SETUP_PROMPT } from "../lib/integration"

const { values } = parseArgs({ options: { base: { type: "string", default: "http://localhost:3000" } } })
const base = values.base!
const executablePath = process.env.CHROME_PATH ?? [
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].find(existsSync)
if (!executablePath) throw new Error("Set CHROME_PATH to your Chrome executable.")

async function main() {
  const browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] })
  const page = await browser.newPage()
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(String(error)))
  try {
    await page.setViewport({ width: 1440, height: 1000 })
    await page.goto(`${base}/feedback?component=oc%2Fpricing-simple`, { waitUntil: "networkidle2" })
    await page.locator("#feedback-request").fill("Replace our pricing")
    await page.locator("#feedback-stack").fill("Next.js / Codex")
    await page.locator("#feedback-details").fill("Found three good options")
    await browser.defaultBrowserContext().overridePermissions(base, ["clipboard-read", "clipboard-write", "clipboard-sanitized-write"])
    await page.locator('button ::-p-text(Copy feedback report)').click()
    await page.waitForFunction(() => document.querySelector('[role="status"]')?.textContent?.includes("Copied."))
    const report = await page.evaluate(() => navigator.clipboard.readText())
    assert.ok(report.includes("Replace our pricing") && report.includes("oc/pricing-simple") && report.includes("Next.js / Codex"))
    await page.screenshot({ path: ".context/feedback-pilot.png", fullPage: true })
    const oldLink = await fetch(`${base}/components/oc/pricing-simple`, { redirect: "manual" })
    assert.equal(oldLink.status, 308)
    assert.ok(oldLink.headers.get("location")?.endsWith("/components/design-infra/pricing-simple"))
    const starterResponse = await fetch(`${base}/api/starter`)
    assert.ok(starterResponse.ok)
    assert.equal((await starterResponse.json()).entries.length, 20)
    await browser.defaultBrowserContext().overridePermissions(base, ["clipboard-read", "clipboard-write", "clipboard-sanitized-write"])
    // This page has no vendor embeds; wait for its scripts before testing clipboard interaction.
    await page.goto(`${base}/integrate`, { waitUntil: "networkidle2", timeout: 60_000 })
    await page.waitForSelector("#setup-prompt")
    assert.equal(await page.$eval("#setup-prompt", (e) => (e as HTMLTextAreaElement).value), SETUP_PROMPT)
    await page.locator('button ::-p-text(Copy setup prompt)').click()
    await page.waitForFunction(() => Array.from(document.querySelectorAll("button")).some((b) => b.textContent === "Copied setup prompt"))
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), SETUP_PROMPT)
    const instructions = await fetch(`${base}/integrate/raw`)
    assert.ok(instructions.ok && instructions.headers.get("content-type")?.includes("text/markdown"))
    const text = await instructions.text()
    assert.ok(text.includes("## 1. Inspect the project") && text.includes("HTTP endpoints") && text.includes("Do not overwrite existing components"))
    const referenceResponse = await fetch(`${base}/api/reference`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: "Observed a clean landing page with a split hero and a feature grid.",
        patterns: [{ name: "split hero", category: "hero" }, { name: "feature grid", category: "features" }],
      }),
    })
    assert.ok(referenceResponse.ok)
    const reference = await referenceResponse.json() as { patterns: { name: string; options: { categories: string[]; install?: string }[]; compare: string }[] }
    assert.deepEqual(reference.patterns.map((p) => p.name), ["split hero", "feature grid"])
    assert.ok(reference.patterns.every((p, i) => p.compare && p.options.length && p.options.every((e) => e.categories.includes(i === 0 ? "hero" : "features") && e.install)))
    const invalidReference = await fetch(`${base}/api/reference`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ source: "https://example.com" }) })
    assert.equal(invalidReference.status, 400)
    const replacements = await fetch(`${base}/api/options?component=feature%20section&intent=replace&request=switch%20this%20out`)
    assert.ok(replacements.ok)
    const options = await replacements.json() as { directions: { picks: { id: string }[] }[]; compare: string }
    const replacementIds = options.directions.flatMap((d) => d.picks.map((e) => e.id))
    assert.ok(options.compare && ["oc/feature-bento", "oc/feature-list", "oc/feature-levels"].every((id) => replacementIds.includes(id)))
    for (const [query, expected] of [["clean pricing", "oc/pricing-simple"], ["sharp navbar", "oc/navbar"], ["loading submit button", "aceternity/stateful-button"]]) {
      await page.goto(`${base}/components?q=${encodeURIComponent(query)}`, { waitUntil: "domcontentloaded", timeout: 120_000 })
      await page.waitForSelector('input[aria-label="Search the catalog"]')
      await page.waitForSelector("main ul.grid li a")
      const first = await page.$eval("main ul.grid li a", (a) => a.getAttribute("href"))
      assert.equal(first, `/components/${expected}`)
      assert.ok(await page.$(`a[href*="${expected.split("/")[1]}"][target="_blank"]`) || await page.$('main a[target="_blank"]'))
      const response = await fetch(`${base}/api/search?q=${encodeURIComponent(query)}`)
      assert.ok(response.ok)
      const api = await response.json() as { id: string }[]
      assert.equal(api[0].id, expected)
    }

    await page.locator('input[aria-label="Search the catalog"]').fill("subtle button hover")
    await page.waitForFunction(() => new URL(location.href).searchParams.get("q") === "subtle button hover")
    await page.click("summary")
    await page.locator('button ::-p-text(on hover)').click()
    await page.waitForFunction(() => new URL(location.href).searchParams.get("trigger") === "hover")
    await page.locator('button ::-p-text(subtle)').click()
    await page.waitForFunction(() => new URL(location.href).searchParams.get("intensity") === "subtle")
    const filteredQuery = new URL(page.url()).search
    const filteredResponse = await fetch(`${base}/api/search${filteredQuery}`)
    const filteredApi = await filteredResponse.json() as { id: string; motion?: { triggers: string[]; intensity: string } }[]
    assert.ok(filteredApi.length)
    assert.ok(filteredApi.every((e) => e.motion?.triggers.includes("hover") && e.motion.intensity === "subtle"))
    assert.equal(await page.$eval("main ul.grid li a", (a) => a.getAttribute("href")), `/components/${filteredApi[0].id}`)

    await page.goto(`${base}/components?q=clean+pricing`, { waitUntil: "domcontentloaded" })
    await page.waitForSelector('[role="checkbox"]')
    await page.click('[role="checkbox"]')
    await page.waitForSelector('[aria-label="Shortlist"]')
    const compareHref = await page.$eval('[aria-label="Shortlist"] a[href^="/compare"]', (a) => a.getAttribute("href"))
    assert.ok(compareHref?.includes("oc/pricing-simple"))
    await browser.defaultBrowserContext().overridePermissions(base, ["clipboard-read", "clipboard-write", "clipboard-sanitized-write"])
    await page.locator('button ::-p-text(Copy for agent)').click()
    await page.waitForFunction(() => {
      const region = document.querySelector('[aria-label="Shortlist"]')
      if (region?.querySelector('[role="alert"]')) throw new Error(region.querySelector('[role="alert"]')!.textContent ?? "Copy failed")
      return region?.textContent?.includes("Copied")
    })
    const handoff = await page.evaluate(() => navigator.clipboard.readText())
    assert.ok(handoff.includes("Install:") && handoff.includes("oc/pricing-simple") && handoff.includes("rather than recreating"))

    mkdirSync(".context", { recursive: true })
    assert.ok(await page.$eval("main ul.grid > li", (e) => {
      const live = e.querySelector('a[target="_blank"]')
      return !!live && live.getBoundingClientRect().bottom <= e.getBoundingClientRect().bottom + 1
    }), "The live link must stay inside its grid row")
    await page.screenshot({ path: ".context/catalog-pilot.png" })

    await page.goto(`${base}${compareHref}`, { waitUntil: "domcontentloaded", timeout: 120_000 })
    await page.waitForSelector('a[href*="/preview/oc/pricing-simple"]')
    await page.locator('button ::-p-text(Pick)').click()
    await page.waitForFunction(() => Array.from(document.querySelectorAll("pre")).some((e) => e.textContent?.includes("I picked:")))
    await page.locator('button ::-p-text(Copy feedback)').click()
    await page.waitForFunction(() => Array.from(document.querySelectorAll("button")).some((b) => b.textContent?.trim() === "Copied"))
    const feedback = await page.evaluate(() => navigator.clipboard.readText())
    assert.ok(feedback.includes("I picked:") && feedback.includes("oc/pricing-simple"))
    await page.screenshot({ path: ".context/compare-pilot.png" })
    await page.locator('button ::-p-text(Clear)').click()

    await page.goto(`${base}/components?q=moonwalking+platypus`, { waitUntil: "domcontentloaded" })
    assert.ok((await page.$eval("main", (e) => e.textContent))?.includes("No matching components yet"))

    await page.setViewport({ width: 390, height: 844 })
    await page.goto(`${base}/components?q=sharp+navbar`, { waitUntil: "domcontentloaded" })
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), "Page overflows on mobile")
    assert.ok(await page.$eval("main ul.grid", (e) => e.getBoundingClientRect().top < window.innerHeight), "Results should be visible without scrolling past all filters")
    await page.screenshot({ path: ".context/catalog-pilot-mobile.png" })
    assert.deepEqual(errors, [], "Browser runtime errors")
    console.log("✓ gallery smoke: setup prompt/instructions, reference mapping, section replacements, search/API parity, live links, shortlist, clipboard handoff, compare feedback, empty state, and mobile layout")
  } catch (error) {
    console.error("Gallery URL:", page.url())
    console.error("Gallery state:", await page.evaluate(() => document.querySelector('[aria-label="Shortlist"]')?.textContent ?? document.querySelector("main")?.textContent?.slice(-500)))
    mkdirSync(".context", { recursive: true })
    await page.screenshot({ path: ".context/gallery-smoke-failure.png" })
    throw error
  } finally {
    await browser.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
