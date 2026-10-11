/**
 * Client-safe helpers for the refinement tags (motion / integration / live) — shared by the
 * catalog browser, entry pages and /compare. Every field is optional in the catalog, so all of
 * these tolerate `undefined`.
 */
import type { Integration, Motion, MotionIntensity, MotionTrigger } from "./schema"

export const TRIGGERS: MotionTrigger[] = ["hover", "press", "enter", "scroll", "loop", "drag", "state", "cursor"]
export const INTENSITIES: MotionIntensity[] = ["subtle", "medium", "expressive"]
export const INTEGRATIONS: Integration[] = ["drop-in", "wrapper", "recipe"]

export const INTEGRATION_HINT: Record<Integration, string> = {
  "drop-in": "replaces your component",
  wrapper: "wraps your existing element",
  recipe: "technique you apply to your own markup",
}

/**
 * Compact motion encoding for the slim client payload: "hover+enter:subtle".
 * Absent motion → undefined (static).
 */
export function encodeMotion(m: Pick<Motion, "triggers" | "intensity"> | undefined): string | undefined {
  return m ? `${m.triggers.join("+")}:${m.intensity}` : undefined
}

export function decodeMotion(s: string | undefined): { triggers: string[]; intensity?: string } {
  if (!s) return { triggers: [] }
  const [t, intensity] = s.split(":")
  return { triggers: t ? t.split("+") : [], intensity }
}

/** Human badge text, e.g. "hover · enter — subtle". */
export function motionLabel(s: string | undefined) {
  const { triggers, intensity } = decodeMotion(s)
  if (!triggers.length) return undefined
  return `${triggers.join(" · ")}${intensity ? ` — ${intensity}` : ""}`
}

/**
 * Hosts whose pages may be embedded in an <iframe>. Tested 2026-10-02: none send
 * X-Frame-Options or a CSP frame-ancestors directive (headers + <meta>), and each rendered inside a
 * sandboxed iframe in headless Chrome (no frame-busting). Re-test before adding hosts:
 *   curl -sSIL <url> | grep -iE 'x-frame-options|content-security-policy'
 */
export const FRAMEABLE_HOSTS = [
  "ui.aceternity.com", // /live-preview/<demo> is a clean, chrome-less demo page
  "ui.shadcn.com", // /view/<style>/<block> is chrome-less
  "magicui.design",
  "coss.com",
  "reactbits.dev",
  "www.reactbits.dev",
  "cult-ui.com",
  "www.cult-ui.com",
  "kibo-ui.com",
  "www.kibo-ui.com",
  "motion-primitives.com",
  "transitions.dev",
  "www.beautifului.dev",
  "libraries.dev",
  "www.originkit.dev",
]

export function isFrameable(url: string | undefined): url is string {
  if (!url) return false
  try {
    return FRAMEABLE_HOSTS.includes(new URL(url).host)
  } catch {
    return false
  }
}

/** Upstream pages that are already a chrome-less live demo (good enough to treat as `live`). */
const CLEAN_PREVIEW = [/^https:\/\/ui\.aceternity\.com\/live-preview\//, /^https:\/\/ui\.shadcn\.com\/view\//]

/** The best interactive URL for an entry: explicit `live`, else a docs URL that is itself a clean demo. */
export function liveUrl(e: { live?: string; docs?: string }): string | undefined {
  if (e.live) return e.live
  if (e.docs && CLEAN_PREVIEW.some((re) => re.test(e.docs!))) return e.docs
  return undefined
}
