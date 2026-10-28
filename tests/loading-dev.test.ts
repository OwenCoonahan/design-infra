import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { loadingDevEntry, loadingDevSpinners } from "../lib/catalog/loading-dev"
import { previewDemos, previewDescriptor } from "../lib/catalog/previews"
import { CatalogEntry, Tool } from "../lib/catalog/schema"

const llms = `# loading.dev

## Spinners

- [Arc](https://loading.dev/spinners/arc/markdown): A single open stroke rotating in a circle. Import as \`Arc\`.
- [Bouncing dots](https://loading.dev/spinners/bouncing-dots/markdown): Three staggered dots bouncing up and down. Import as \`BouncingDots\`.

## Optional

- [GitHub](https://github.com/jakubkrehel/loading): Source and issues.
`
const frame = "@media (prefers-reduced-motion: reduce) { .ld-x * { animation: none; } }"

test("loading.dev spinners parse from llms.txt and reject silent upstream drift", () => {
  const spinners = loadingDevSpinners(llms)
  assert.deepEqual(spinners.map((s) => [s.slug, s.importName]), [["arc", "Arc"], ["bouncing-dots", "BouncingDots"]])
  assert.equal(spinners[0].description, "A single open stroke rotating in a circle.")
  assert.throws(() => loadingDevSpinners("# loading.dev\n\n## Spinners\n"), /No loading.dev spinners/)
  assert.throws(() => loadingDevSpinners(llms.replace("loading.dev/spinners/arc", "evil.example/spinners/arc")), /left loading.dev/)
  assert.throws(() => loadingDevSpinners(llms.replace("\n## Optional", "- [Arc](https://loading.dev/spinners/arc/markdown): Again. Import as `Arc`.\n\n## Optional")), /Duplicate/)
})

test("loading.dev technique and reduced motion come from the component source", () => {
  const [arc, dots] = loadingDevSpinners(llms)
  const svg = loadingDevEntry(arc, "<SpinnerStyle name=\"arc\" /><svg viewBox=\"0 0 24 24\" />", frame)
  assert.equal(svg.id, "loading-dev/arc")
  assert.equal(svg.install, "pnpm add loading-dev")
  assert.match(svg.notes!, /import \{ Arc \} from "loading-dev"/)
  assert.deepEqual(svg.motion, { triggers: ["loop"], intensity: "subtle", technique: ["css", "svg"], cost: "low", reducedMotion: true })
  assert.equal(svg.live, "https://loading.dev/spinners/arc")
  const css = loadingDevEntry(dots, "<SpinnerStyle name=\"bouncing-dots\" /><span />", frame)
  assert.deepEqual(css.motion?.technique, ["css"])
  assert.equal(css.motion?.intensity, "medium")
  assert.equal(loadingDevEntry(arc, "<svg />", frame).motion?.reducedMotion, undefined)
  assert.equal(loadingDevEntry(arc, "<SpinnerStyle /><svg />", "").motion?.reducedMotion, undefined)
})

test("loading.dev is a synced, curated, hosted loader source", () => {
  const catalog: CatalogEntry[] = JSON.parse(readFileSync("catalog/index.json", "utf8")).map((e: unknown) => CatalogEntry.parse(e))
  const entries = catalog.filter((e) => e.source === "loading-dev")
  assert.ok(entries.length >= 29)
  assert.ok(entries.every((e) => e.categories.includes("loader") && e.integration === "drop-in" && e.motion?.reducedMotion === true && e.access === "free"))
  const curated = entries.filter((e) => e.curated)
  assert.equal(curated.length, 4)
  for (const e of curated) {
    const demo = previewDemos[e.id]
    assert.ok(demo, `${e.id} has a hosted adapter`)
    assert.equal(demo.adapter, "loading")
    assert.equal(demo.provenance.license, "MIT")
    assert.equal(previewDescriptor(e)?.kind, "interactive")
  }
})

test("Jakub Krehel's skills follow Agentation in tier 2 and ranks stay consecutive", () => {
  const { tools } = JSON.parse(readFileSync("catalog/toolchain.json", "utf8")) as { tools: unknown[] }
  const parsed = tools.map((t) => Tool.parse(t)).sort((a, b) => a.rank - b.rank)
  assert.deepEqual(parsed.map((t) => t.rank), parsed.map((_, i) => i + 1))
  const agentation = parsed.findIndex((t) => t.id === "agentation")
  const skills = parsed[agentation + 1]
  assert.equal(skills.id, "jakub-skills")
  assert.equal(skills.tier, 2)
  assert.ok(skills.setup.some((s) => s.kind === "run" && s.command.includes("jakubkrehel/skills") && s.command.includes("better-ui")))
  assert.ok(skills.setup.some((s) => s.kind === "agent-note" && s.text.includes("interface-review")))
})

test("jakub.kr inspiration links only to real catalog entries", () => {
  const catalog: CatalogEntry[] = JSON.parse(readFileSync("catalog/index.json", "utf8")).map((e: unknown) => CatalogEntry.parse(e))
  const ids = new Set(catalog.map((e) => e.id))
  const entry = catalog.find((e) => e.id === "inspiration/jakub-kr")
  assert.ok(entry)
  assert.deepEqual([...entry.moods].sort(), ["minimal", "refined", "technical"])
  const readme = readFileSync("inspiration/jakub-kr/README.md", "utf8")
  const related = /related:\n((?:  - .+\n)+)/.exec(readme)![1].split("\n").filter(Boolean).map((l) => l.replace("  - ", "").trim())
  assert.ok(related.length >= 3)
  for (const id of related) assert.ok(ids.has(id), id)
})
