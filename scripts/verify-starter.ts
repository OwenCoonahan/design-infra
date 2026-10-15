import { galleryBase } from "./lib/gallery-base"
/** Real installs/builds plus gallery checks. Writes evidence only after every required check passes. */
import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { parseArgs } from "node:util"
import puppeteer from "puppeteer-core"
import selection from "../catalog/starter.json"
import systems from "../lib/design-systems.generated.json"
import { NAMESPACE } from "../lib/config"
import { starterFingerprint } from "../lib/starter-fingerprint"

const { values } = parseArgs({ options: { base: { type: "string", default: "http://localhost:3000" } } })
const base = galleryBase(values.base!)
const root = process.cwd()
const run = (command: string, args: string[], cwd: string) => execFileSync(command, args, { cwd, stdio: "inherit", timeout: 600_000, env: { ...process.env, CI: "1", NEXT_TELEMETRY_DISABLED: "1" } })

async function main() {
  const fixture = await mkdtemp(path.join(tmpdir(), "design-infra-starter-"))
  console.log(`Fresh consumer fixture: ${fixture}`)
  await mkdir(path.join(fixture, "app"))
  const pkg = JSON.parse(await readFile("package.json", "utf8"))
  await writeFile(path.join(fixture, "package.json"), JSON.stringify({ name: "starter-install-check", private: true, scripts: { build: "next build" }, dependencies: { next: pkg.dependencies.next, react: pkg.dependencies.react, "react-dom": pkg.dependencies["react-dom"] }, devDependencies: { typescript: pkg.devDependencies.typescript, "@types/node": pkg.devDependencies["@types/node"], "@types/react": pkg.devDependencies["@types/react"], "@types/react-dom": pkg.devDependencies["@types/react-dom"], tailwindcss: pkg.devDependencies.tailwindcss, "@tailwindcss/postcss": pkg.devDependencies["@tailwindcss/postcss"] } }, null, 2))
  await writeFile(path.join(fixture, "tsconfig.json"), JSON.stringify({ compilerOptions: { target: "ES2017", lib: ["dom", "dom.iterable", "esnext"], strict: true, noEmit: true, esModuleInterop: true, module: "esnext", moduleResolution: "bundler", resolveJsonModule: true, isolatedModules: true, jsx: "react-jsx", skipLibCheck: true, paths: { "@/*": ["./*"] }, plugins: [{ name: "next" }] }, include: ["**/*.ts", "**/*.tsx", ".next/types/**/*.ts"], exclude: ["node_modules"] }, null, 2))
  await writeFile(path.join(fixture, "postcss.config.mjs"), 'export default { plugins: { "@tailwindcss/postcss": {} } }\n')
  await writeFile(path.join(fixture, "next.config.ts"), 'export default {}\n')
  await writeFile(path.join(fixture, "app/globals.css"), '@import "tailwindcss";\n')
  await writeFile(path.join(fixture, "app/layout.tsx"), 'import "./globals.css"\nexport default function Layout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html> }\n')
  await writeFile(path.join(fixture, "app/page.tsx"), 'export default function Page() { return <main>Starter install check</main> }\n')
  run("pnpm", ["install"], fixture)
  run("pnpm", ["exec", "shadcn", "init", "--cwd", fixture, "-b", "radix", "-p", "nova", "-y"], root)
  const componentsPath = path.join(fixture, "components.json")
  const components = JSON.parse(await readFile(componentsPath, "utf8"))
  components.registries = { [NAMESPACE]: `${base}/r/{name}.json` }
  await writeFile(componentsPath, JSON.stringify(components, null, 2))
  const names = selection.entries.map((entry) => entry.id.slice(3))
  run("pnpm", ["exec", "shadcn", "add", "--cwd", fixture, "-y", ...names.map((name) => `${NAMESPACE}/${name}`)], root)
  // Every installed block must be compiled even when it isn't rendered in the fixture's single page.
  await writeFile(path.join(fixture, "app/installed.ts"), names.map((name) => `export * from "@/components/${name}"`).join("\n"))
  run("pnpm", ["build"], fixture)
  // Exercise a legacy-only consumer with a clean target path; its own dependencies resolve by URL.
  components.registries = { "@oc": `${base}/r/{name}.json` }
  await writeFile(componentsPath, JSON.stringify(components, null, 2))
  run("pnpm", ["exec", "shadcn", "add", "--cwd", fixture, "-y", "--path", "components/legacy-check", "@oc/pricing-simple"], root)
  assert.ok(await readFile(path.join(fixture, "components/legacy-check/pricing-simple.tsx"), "utf8"))

  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] })
  let checks = 0
  try {
    const queue = names.flatMap((name) => systems.flatMap((system) => system.modes.flatMap((mode) => [390, 1280].map((width) => ({ name, theme: system.slug, mode, width })))))
    await Promise.all(Array.from({ length: 3 }, async () => {
      const page = await browser.newPage()
      const errors: string[] = []
      page.on("pageerror", (error) => errors.push(String(error)))
      await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }])
      for (let next = queue.shift(); next; next = queue.shift()) {
        errors.length = 0
        await page.setViewport({ width: next.width, height: 900 })
        const url = `${base}/preview/oc/${next.name}?theme=${next.theme}&mode=${next.mode}`
        const response = await page.goto(url, { waitUntil: "networkidle2", timeout: 60_000 })
        assert.equal(response?.status(), 200, url)
        await page.waitForSelector("[data-preview-content]")
        const metrics = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth + 2, text: document.querySelector("[data-preview-content]")?.textContent?.trim().length ?? 0, runningAnimations: document.getAnimations().filter((a) => a.playState === "running" && a.effect?.getTiming().iterations === Infinity).length }))
        assert.ok(metrics.text > 0, `Empty demo: ${url}`)
        assert.equal(metrics.overflow, false, `Horizontal overflow: ${url} at ${next.width}`)
        assert.equal(metrics.runningAnimations, 0, `Continuous animation ignores reduced motion: ${url}`)
        assert.deepEqual(errors, [], `Browser errors: ${url}`)
        checks++
        if (checks % 40 === 0) console.log(`Browser checks passed: ${checks}`)
      }
      await page.close()
    }))
    const page = await browser.newPage()
    await page.setViewport({ width: 390, height: 900 })
    const open = async (name: string) => { await page.goto(`${base}/preview/oc/${name}?theme=editorial`, { waitUntil: "networkidle2" }) }
    await open("navbar")
    await page.focus('button[aria-label="Open menu"]'); await page.keyboard.press("Enter")
    await page.waitForSelector('[role="dialog"]')
    await page.keyboard.press("Escape"); await page.waitForSelector('[role="dialog"]', { hidden: true })
    await open("faq")
    const toggle = 'button[aria-expanded]'
    const before = await page.$eval(toggle, (el) => el.getAttribute("aria-expanded"))
    await page.focus(toggle); await page.keyboard.press("Enter")
    assert.notEqual(await page.$eval(toggle, (el) => el.getAttribute("aria-expanded")), before)
    await open("pricing-simple")
    await page.waitForSelector('[role="switch"]')
    const billingBefore = await page.$eval('[role="switch"]', (el) => el.getAttribute("aria-checked"))
    await page.focus('[role="switch"]'); await page.keyboard.press("Space")
    assert.notEqual(await page.$eval('[role="switch"]', (el) => el.getAttribute("aria-checked")), billingBefore)
    await open("settings-form")
    const field = await page.$('input:not([type="file"]):not([type="checkbox"])'); assert.ok(field)
    await field.focus(); await page.keyboard.type(" edited")
    assert.ok(await page.$('button[type="submit"]:not([disabled])'))
    await open("prompt-composer")
    await page.focus("textarea"); await page.keyboard.type("Pilot test prompt"); await page.keyboard.press("Enter")
    assert.equal(await page.$eval("textarea", (el) => (el as HTMLTextAreaElement).value), "")
    await mkdir(".context", { recursive: true })
    await page.screenshot({ path: ".context/starter-mobile.png", fullPage: true })
  } finally { await browser.close() }
  const report = { checkedAt: new Date().toISOString(), fingerprint: starterFingerprint(), passed: true, checks: ["all 20 registry installs in a fresh project", "consumer Next.js production build", "legacy @oc install", `${checks} desktop/mobile previews across every design system and available mode`, "no browser exceptions or horizontal overflow", "no continuous animation under reduced motion", "keyboard: mobile navigation, FAQ, pricing switch, settings edit and prompt submission"], scope: "Next.js 16 / React 19 / Tailwind 4 consumer fixture; system Chrome gallery checks at 390px and 1280px.", limitations: ["Not an exhaustive accessibility audit or cross-browser certification.", "Gallery demos and one fixture do not prove compatibility with every project's props, content or dependency versions.", "No friend/independent-agent participation is claimed."], components: selection.entries.map((entry) => entry.id) }
  await writeFile("catalog/starter-verification.json", JSON.stringify(report, null, 2) + "\n")
  console.log("✓ starter verification recorded; rebuild the gallery to publish the evidence")
}

main().catch((error: unknown) => { console.error(error); process.exitCode = 1 })
