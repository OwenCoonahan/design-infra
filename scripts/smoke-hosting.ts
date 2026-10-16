/** Check the complete catalog zone through either its origin or a parent site's rewrite. */
import assert from "node:assert/strict"
import { parseArgs } from "node:util"
import puppeteer from "puppeteer-core"
import { config } from "../lib/config"
import { galleryBase } from "./lib/gallery-base"

const { values } = parseArgs({ options: { base: { type: "string", default: "http://localhost:3000" } } })
const base = galleryBase(values.base!)
const origin = new URL(base).origin
const prefix = new URL(base).pathname.replace(/\/$/, "")
async function main() {
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] })
  try {
    const page = await browser.newPage()
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(String(error)))
    page.on("response", (response) => {
      if (new URL(response.url()).origin === origin && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`)
    })
    for (const path of ["", "/components?category=loader", "/guide", "/integrate", "/registry"]) {
      const response = await page.goto(`${base}${path}`, { waitUntil: "networkidle2", timeout: 60_000 })
      assert.equal(response?.status(), 200, path)
      assert.equal(new URL(page.url()).origin, origin, "browsing left the public domain")
      assert.equal(new URL(page.url()).pathname, (prefix + path.split("?")[0]) || "/")
      const localPaths = await page.$$eval('a[href^="/"], script[src^="/"], link[href^="/"], img[src^="/"], iframe[src^="/"]', (elements) => elements.map((element) => element.getAttribute("href") ?? element.getAttribute("src")!))
      assert.ok(localPaths.every((path) => !prefix || path === prefix || path.startsWith(`${prefix}/`) || path.startsWith(`${prefix}?`) || path.startsWith(`${prefix}#`)), `unprefixed link or asset on ${path}: ${JSON.stringify(localPaths)}`)
      if (!path) {
        const metadata = await page.evaluate(() => ({
          image: document.querySelector('meta[property="og:image"]')?.getAttribute("content"),
          twitter: document.querySelector('meta[name="twitter:card"]')?.getAttribute("content"),
          icons: Array.from(document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]')).map((link) => (link as HTMLLinkElement).href),
        }))
        assert.equal(metadata.image, `${config.siteUrl}/brand/share.png`, "sharing image uses the canonical subpath")
        assert.equal(metadata.twitter, "summary_large_image")
        for (const format of ["favicon.ico", "icon.svg", "apple-icon.png"]) {
          assert.ok(metadata.icons.some((url) => new URL(url).pathname.endsWith(`/${format}`)), `${format} is discoverable`)
        }
        for (const url of [...metadata.icons, `${base}/brand/share.png`]) {
          const asset = await fetch(url)
          assert.equal(asset.status, 200, url)
          assert.match(asset.headers.get("content-type") ?? "", /^image\//, url)
          assert.ok((await asset.arrayBuffer()).byteLength > 100, url)
        }
        const dimensions = await page.evaluate(async (url) => {
          const image = new Image()
          image.src = url
          await image.decode()
          return [image.naturalWidth, image.naturalHeight]
        }, `${base}/brand/share.png`)
        assert.deepEqual(dimensions, [1200, 630])
        const bot = await fetch(base, { headers: { "user-agent": "Twitterbot/1.0" } })
        const html = await bot.text()
        assert.ok(html.includes(`<meta property="og:image" content="${config.siteUrl}/brand/share.png"`), "link unfurling works without JavaScript")
      }
    }
    const alias = await page.goto(`${base}/components/oc/agent-status`, { waitUntil: "networkidle2" })
    assert.equal(alias?.status(), 200)
    assert.equal(page.url(), `${base}/components/${config.namespace.slice(1)}/agent-status`)
    const routes = ["/api/setup", "/api/search?q=loading&limit=3", "/api/entries?ids=oc%2Fagent-status", "/r/agent-status.json", "/bootstrap.mjs", "/integrate/raw", "/llms.txt"]
    for (const route of routes) {
      const result = await page.evaluate(async (url) => {
        const response = await fetch(url)
        return { status: response.status, url: response.url, text: await response.text() }
      }, `${base}${route}`)
      assert.equal(result.status, 200, route)
      assert.equal(new URL(result.url).origin, origin, route)
      assert.ok(result.text.length > 20, route)
    }
    const mcp = await page.evaluate(async (url) => {
      const response = await fetch(url, { method: "POST", headers: { "content-type": "application/json", accept: "application/json, text/event-stream" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "hosting-check", version: "1" } } }) })
      return { status: response.status, text: await response.text() }
    }, `${base}/mcp`)
    assert.equal(mcp.status, 200)
    assert.ok(mcp.text.includes('"name":"design-infra"'))
    assert.deepEqual(errors, [])
    console.log("✓ hosting: same-domain navigation, branded icons, bot-visible sharing image, prefixed assets/previews, legacy detail alias, APIs, registry, bootstrap, raw instructions and MCP POST")
  } finally { await browser.close() }
}

main().catch((error: unknown) => { console.error(error); process.exitCode = 1 })
