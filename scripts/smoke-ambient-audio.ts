/** Native Web Audio signal and lifecycle checks; no autoplay flags or mocked audio graph. */
import assert from "node:assert/strict"
import { build } from "esbuild"
import { parseArgs } from "node:util"
import puppeteer from "puppeteer-core"
import { galleryBase } from "./lib/gallery-base"
import { BASE_PATH, sitePath } from "../lib/config"

const { values } = parseArgs({ options: { base: { type: "string", default: "http://localhost:3000" } } })
const base = galleryBase(values.base!)
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const probe = `
  window.__soundProbe = {contexts: [], analysers: [], filters: [], voices: new Set()};
  const NativeContext = window.AudioContext;
  window.AudioContext = class extends NativeContext {
    constructor(...args) { super(...args); window.__soundProbe.contexts.push(this); }
    createBiquadFilter() { const filter = super.createBiquadFilter(); window.__soundProbe.filters.push(filter); return filter; }
  };
  const connect = AudioNode.prototype.connect;
  AudioNode.prototype.connect = function(destination, ...args) {
    if (destination === this.context.destination && this.context instanceof window.AudioContext) {
      const analyser = this.context.createAnalyser();
      window.__soundProbe.analysers.push(analyser);
      connect.call(this, analyser); connect.call(analyser, destination);
      return destination;
    }
    return connect.call(this, destination, ...args);
  };
  const start = OscillatorNode.prototype.start, stop = OscillatorNode.prototype.stop;
  OscillatorNode.prototype.start = function(...args) { window.__soundProbe.voices.add(this); return start.apply(this, args); };
  OscillatorNode.prototype.stop = function(...args) { window.__soundProbe.voices.delete(this); return stop.apply(this, args); };
`

async function main() {
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome", args: ["--no-sandbox", "--disable-dev-shm-usage"] })
  try {
    const page = await browser.newPage()
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(String(error)))
    await page.evaluateOnNewDocument(probe)
    await page.setViewport({ width: 1440, height: 1000 })
    await page.goto(base, { waitUntil: "networkidle2" })
    assert.equal(await page.evaluate("window.__soundProbe.contexts.length"), 0, "no context before opt-in")
    assert.ok(await page.$('button[aria-label="Enable ambient sound"][aria-pressed="false"]'))
    assert.ok(await page.$('input[aria-label="Ambient volume"][disabled][value="18"]'))

    // Render the exact engine offline, then check fades, bounded output and stereo separation.
    const bundle = await build({ entryPoints: ["lib/ambient-audio.ts"], bundle: true, format: "iife", globalName: "AmbientCheck", write: false })
    await page.addScriptTag({ content: bundle.outputFiles![0].text })
    const signal = await page.evaluate(`(async () => {
      const context = new OfflineAudioContext(2, 22050 * 5, 22050);
      const graph = AmbientCheck.createAmbientGraph(context);
      graph.setVolume(0.18);
      const stopped = context.suspend(3);
      const rendered = context.startRendering();
      await stopped; graph.setVolume(0, 0.045); await context.resume();
      const buffer = await rendered, left = buffer.getChannelData(0), right = buffer.getChannelData(1);
      graph.dispose();
      const rms = (a, start, end) => Math.sqrt(a.slice(start * 22050, end * 22050).reduce((sum, n) => sum + n*n, 0) / ((end-start)*22050));
      let peak = 0, difference = 0;
      for (let i = 22050; i < 22050 * 2; i++) { peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i])); difference += (left[i]-right[i])**2; }
      return {early: rms(left, 0, 0.1), body: rms(left, 1, 2), tail: rms(left, 4, 5), peak, stereo: Math.sqrt(difference/22050)};
    })()` ) as { early: number; body: number; tail: number; peak: number; stereo: number }
    assert.ok(signal.body > 0.001 && signal.body < 0.08, JSON.stringify(signal))
    assert.ok(signal.early < signal.body / 2 && signal.tail < 0.00001, "soft fade in and quiet fade out")
    assert.ok(signal.peak < 0.5 && signal.stereo > 0.0001, "bounded stereo signal")

    const playing = () => page.waitForFunction(`window.__soundProbe.contexts[0]?.state === 'running' && document.querySelector('[data-ambient-sound]')?.dataset.soundState === 'playing'`)
    const suspended = () => page.waitForFunction(`window.__soundProbe.contexts[0]?.state === 'suspended'`)
    const rms = () => page.evaluate(`(() => {
      const analyser = window.__soundProbe.analysers[0], data = new Float32Array(analyser.fftSize);
      analyser.getFloatTimeDomainData(data); return Math.sqrt(data.reduce((sum, value) => sum + value*value, 0)/data.length);
    })()` ) as Promise<number>
    await page.click('button[aria-label="Enable ambient sound"]')
    await playing()
    await wait(1000)
    const quiet = await rms()
    assert.ok(quiet > 0.0001, "actual enabled output contains audio")
    await page.focus('[aria-label="Ambient volume"]')
    await page.keyboard.press("End")
    await wait(800)
    assert.ok(await rms() > quiet * 2, "volume changes actual output")
    await page.keyboard.press("Home")
    await suspended()
    await page.click('button[aria-label="Mute ambient sound"]')
    assert.ok(await page.$('button[aria-label="Enable ambient sound"][aria-pressed="false"]'))
    await page.click('button[aria-label="Enable ambient sound"]')
    await page.focus('[aria-label="Ambient volume"]')
    await page.keyboard.press("End")
    await playing()
    assert.equal(await page.evaluate("window.__soundProbe.contexts.length"), 1, "reuse the opted-in context")

    const bounds = await (await page.$("[data-hero-playground]"))!.boundingBox()
    assert.ok(bounds)
    await page.mouse.move(bounds.x + bounds.width * 0.1, bounds.y + bounds.height * 0.3)
    await wait(800)
    const dark = await page.evaluate("window.__soundProbe.filters[0].frequency.value") as number
    await page.mouse.move(bounds.x + bounds.width * 0.9, bounds.y + bounds.height * 0.3)
    await wait(800)
    assert.ok((await page.evaluate("window.__soundProbe.filters[0].frequency.value") as number) > dark + 300, "cursor gently changes brightness")
    await page.evaluate("Object.defineProperty(document, 'hidden', {configurable:true, get:()=>true}); document.dispatchEvent(new Event('visibilitychange'))")
    await suspended()
    await page.evaluate("Object.defineProperty(document, 'hidden', {configurable:true, get:()=>false}); document.dispatchEvent(new Event('visibilitychange'))")
    await playing()
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await suspended()
    await page.$eval("[data-hero-playground]", (element) => element.scrollIntoView({ block: "center" }))
    await playing()
    await page.click('button[aria-label="Mute ambient sound"]')
    await suspended()
    await page.evaluate("document.dispatchEvent(new Event('visibilitychange'))")
    await wait(350)
    assert.equal(await page.evaluate("window.__soundProbe.contexts[0].state"), "suspended", "muting survives visibility events")
    await page.click('button[aria-label="Enable ambient sound"]')
    await playing()
    await page.click(`nav a[href="${sitePath("/guide")}"]`)
    await page.waitForFunction("window.__soundProbe.contexts[0].state === 'closed' && window.__soundProbe.voices.size === 0")
    await page.click(`header a[href="${BASE_PATH || "/"}"]`)
    await page.waitForSelector('button[aria-label="Enable ambient sound"][aria-pressed="false"]')
    assert.equal(await page.evaluate("window.__soundProbe.contexts.length"), 1, "returning starts muted")
    // Rapid toggles cancel pending fades without creating overlapping engines.
    await page.click('button[aria-label="Enable ambient sound"]')
    await page.$eval('[data-ambient-sound] button', (button) => { for (let i = 0; i < 6; i++) (button as HTMLButtonElement).click() })
    await page.waitForSelector('[data-sound-state="playing"]')
    assert.equal(await page.evaluate("window.__soundProbe.contexts.length"), 2)
    await page.click('button[aria-label="Mute ambient sound"]')
    await page.waitForFunction("window.__soundProbe.contexts[1].state === 'suspended'")
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }])
    await page.click('button[aria-label="Enable ambient sound"]')
    await page.waitForSelector('[data-sound-state="playing"]')
    await page.waitForSelector('[data-kinetic-field][data-motion-state="paused"]')
    await page.reload({ waitUntil: "networkidle2" })
    assert.equal(await page.evaluate("window.__soundProbe.contexts.length"), 0, "reload never remembers audio opt-in")
    assert.ok(await page.$('button[aria-label="Enable ambient sound"][aria-pressed="false"]'))
    assert.equal(errors.length, 0, errors.join("\n"))
    console.log("✓ ambient: native signal/fades/stereo, opt-in, real volume, cursor, mute, zero volume, simulated visibility, offscreen cleanup, context reuse, navigation disposal, rapid toggles, reduced motion and muted reload")

    const fallback = await browser.newPage()
    await fallback.evaluateOnNewDocument("Object.defineProperty(window, 'AudioContext', {configurable:true, value:undefined})")
    fallback.on("pageerror", (error) => errors.push(String(error)))
    await fallback.goto(base, { waitUntil: "networkidle2" })
    await fallback.click('button[aria-label="Enable ambient sound"]')
    assert.ok(await fallback.$('button[disabled] ::-p-text(Sound unavailable)'))
    assert.ok(await fallback.$("#home-agent-prompt"))
    await fallback.close()

    const retry = await browser.newPage()
    await retry.evaluateOnNewDocument(probe + `
      const resume = NativeContext.prototype.resume; let reject = true;
      NativeContext.prototype.resume = function() { if(reject) { reject=false; return Promise.reject(new Error('Blocked audio')); } return resume.call(this); };
    `)
    retry.on("pageerror", (error) => errors.push(String(error)))
    await retry.goto(base, { waitUntil: "networkidle2" })
    await retry.click('button[aria-label="Enable ambient sound"]')
    await retry.waitForSelector('[data-sound-state="error"]')
    await retry.click('button[aria-label="Enable ambient sound"]')
    await retry.waitForSelector('[data-sound-state="playing"]')
    await retry.click('button[aria-label="Mute ambient sound"]')
    await retry.waitForFunction("window.__soundProbe.contexts[0].state === 'suspended'")
    await retry.close()
    assert.equal(errors.length, 0, errors.join("\n"))
    console.log("✓ ambient: unsupported-browser fallback and rejected-start retry")
  } finally { await browser.close() }
}

main().catch((error: unknown) => { console.error(error); process.exitCode = 1 })
