/** Rebuild static brand assets from the MIT Phosphor mark; no runtime rendering service. */
import { readFile, writeFile } from "node:fs/promises"
import puppeteer from "puppeteer-core"
import { resolve } from "node:path"

async function main() {
  const mark = await readFile(resolve("public/brand/mark.svg"), "utf8")
  const path = mark.match(/<path d="([^"]+)"/)![1]
  const tile = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="8" fill="#141414"/><svg x="7" y="7" width="50" height="50" viewBox="0 0 256 256" fill="#f4f2ec"><path d="${path}"/></svg></svg>`
  await writeFile(resolve("app/icon.svg"), tile + "\n")

  // System sans-serif keeps regeneration independent of network font downloads.
  const artwork = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#141414"/>
  <g fill="#f4f2ec"><svg x="60" y="56" width="38" height="38" viewBox="0 0 256 256"><path d="${path}"/></svg></g>
  <g fill="#f4f2ec" font-family="Arial, Helvetica, sans-serif">
  <text x="112" y="85" font-size="28" letter-spacing="-1">design-infra</text>
  <text x="60" y="239" font-size="72" font-weight="600" letter-spacing="-3"><tspan x="60">Good UI starts</tspan><tspan x="60" dy="82">with better</tspan><tspan x="60" dy="82">components.</tspan></text>
  <text x="62" y="534" font-size="23" fill="#a6a49f">Find real components.</text>
  <text x="62" y="568" font-size="23" fill="#a6a49f">Build with Claude Code or Codex.</text>
  </g>
  <g transform="translate(743 117)" fill="none" stroke="#65635f" stroke-width="1">
  <path d="M200 0 400 200 200 400 0 200Z"/>
  <path d="M200 24 376 200 200 376 24 200Z"/>
  <path d="M200 48 352 200 200 352 48 200Z"/>
  <path d="M200 72 328 200 200 328 72 200Z"/>
  </g>
  <svg x="795" y="169" width="296" height="296" viewBox="0 0 256 256" fill="#f4f2ec"><path d="${path}"/></svg>
  </svg>`
  await writeFile(resolve("public/brand/share.svg"), artwork + "\n")
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] })
  try {
    const page = await browser.newPage()
    async function png(svg: string, size: { width: number; height: number }) {
      await page.setViewport({ ...size, deviceScaleFactor: 1 })
      await page.setContent(`<html><body style="margin:0;overflow:hidden"><img style="display:block;width:100vw;height:100vh" src="data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}"></body></html>`)
      await page.$eval("img", (element) => element.decode())
      // Canvas retains RGBA (including rounded-corner transparency), required by
      // Next's ICO decoder; opaque browser screenshots can be RGB-only PNGs.
      const data = await page.$eval("img", (element, dimensions) => {
        const canvas = document.createElement("canvas")
        canvas.width = dimensions.width
        canvas.height = dimensions.height
        canvas.getContext("2d")!.drawImage(element, 0, 0, canvas.width, canvas.height)
        return canvas.toDataURL("image/png").split(",")[1]
      }, size)
      return Buffer.from(data, "base64")
    }
    const sizes = [16, 32, 48]
    const icons: Buffer[] = []
    for (const size of sizes) icons.push(await png(tile, { width: size, height: size }))
    const header = Buffer.alloc(6 + 16 * icons.length)
    header.writeUInt16LE(1, 2)
    header.writeUInt16LE(icons.length, 4)
    let offset = header.length
    icons.forEach((icon, index) => {
      const entry = 6 + index * 16
      header[entry] = header[entry + 1] = sizes[index]
      header.writeUInt16LE(1, entry + 4)
      header.writeUInt16LE(32, entry + 6)
      header.writeUInt32LE(icon.length, entry + 8)
      header.writeUInt32LE(offset, entry + 12)
      offset += icon.length
    })
    await writeFile(resolve("app/favicon.ico"), Buffer.concat([header, ...icons]))
    await writeFile(resolve("app/apple-icon.png"), await png(tile, { width: 180, height: 180 }))
    await writeFile(resolve("public/brand/share.png"), await png(artwork, { width: 1200, height: 630 }))
  } finally { await browser.close() }
  console.log("✓ brand: SVG icon, 16/32/48px favicon, touch icon and 1200×630 sharing card")
}

main().catch((error: unknown) => { console.error(error); process.exitCode = 1 })
