import type { z } from "zod"

import type { CatalogEntry, MotionIntensity } from "./schema"

export type LoadingDevSpinner = { slug: string; title: string; description: string; importName: string; markdown: string }

const LINE = /^- \[([^\]]+)\]\((https:\/\/[^)]+)\/markdown\): (.+?) Import as `([A-Za-z0-9]+)`\.$/

/** `## Spinners` list in https://loading.dev/llms.txt → one record per spinner. */
export function loadingDevSpinners(llms: string): LoadingDevSpinner[] {
  const section = /^## Spinners\n([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(llms)?.[1] ?? ""
  const spinners = section.split("\n").map((line) => LINE.exec(line.trim())).filter((m) => m !== null).map(([, title, page, description, importName]) => {
    const url = new URL(page)
    const slug = /^\/spinners\/([a-z0-9-]+)$/.exec(url.pathname)?.[1]
    if (url.origin !== "https://loading.dev" || !slug) throw new Error(`Spinner page left loading.dev: ${page}`)
    return { slug, title, description, importName, markdown: `${page}/markdown` }
  })
  if (!spinners.length) throw new Error("No loading.dev spinners found in llms.txt; review its format before syncing")
  if (new Set(spinners.map((s) => s.slug)).size !== spinners.length) throw new Error("Duplicate loading.dev spinner")
  return spinners
}

/**
 * Judged from rendering each spinner: rotation, fades and small sweeps read as quiet (subtle); bouncing, flipping,
 * morphing and travelling shapes draw the eye (medium). New upstream spinners default to medium until reviewed.
 */
const SUBTLE = new Set([
  "arc", "ring", "comet", "classic", "classic-v2", "circular-dots", "linear-dots", "clock", "compass",
  "dual", "orbit", "pulse", "radar", "ripple", "snake", "trace", "loading",
])
export function loadingDevIntensity(slug: string): z.infer<typeof MotionIntensity> {
  return SUBTLE.has(slug) ? "subtle" : "medium"
}

/**
 * One catalog entry per spinner. Technique is read from the component source (`<svg` → svg, otherwise styled DOM;
 * every spinner animates with CSS keyframes). Reduced motion is claimed only when the spinner renders the shared
 * SpinnerStyle and that frame source still disables animation under prefers-reduced-motion.
 */
export function loadingDevEntry(spinner: LoadingDevSpinner, source: string, frame: string): z.input<typeof CatalogEntry> {
  const reducedMotion = source.includes("<SpinnerStyle") && /prefers-reduced-motion:\s*reduce/.test(frame) ? true : undefined
  const live = `https://loading.dev/spinners/${spinner.slug}`
  return {
    id: `loading-dev/${spinner.slug}`,
    source: "loading-dev",
    name: spinner.slug,
    title: spinner.title,
    description: spinner.description,
    kind: "component",
    categories: ["loader"],
    tags: ["react", "react-19", "spinner", "css-keyframes"],
    access: "free",
    install: "pnpm add loading-dev",
    docs: live,
    live,
    themeAware: true,
    integration: "drop-in",
    appliesTo: ["loader", "button"],
    notes: `\`import { ${spinner.importName} } from "loading-dev"\` → \`<${spinner.importName} size={16} />\`. Props: size (px, default 20), color (default currentColor), duration (ms), playState, className. Renders aria-hidden; wrap it in role="status" with a text label. React 19+ only (uses hoisted <style>). Agent-readable docs: ${spinner.markdown}`,
    motion: {
      triggers: ["loop"],
      intensity: loadingDevIntensity(spinner.slug),
      technique: source.includes("<svg") ? ["css", "svg"] : ["css"],
      cost: "low",
      ...(reducedMotion ? { reducedMotion } : {}),
    },
  }
}
