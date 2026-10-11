/**
 * Every option an agent proposes must be clickable before anything is installed.
 * These are the canonical URLs (gallery pages live on the deployed site).
 */
import { config, SITE_URL } from "../config"

export { SITE_URL }

/** Gallery detail page for a catalog id: notes, install, thumbnail, live demo when we have one. */
export const entryPage = (id: string) => `${SITE_URL}/components/${id.startsWith("oc/") ? `${config.namespace.slice(1)}/${id.slice(3)}` : id}`

/** Side-by-side live comparison of several entries, optionally under a design system. */
export function compareUrl(ids: string[], opts: { theme?: string; label?: string } = {}) {
  const q = new URLSearchParams({ ids: ids.join(",") })
  if (opts.theme) q.set("theme", opts.theme)
  if (opts.label) q.set("label", opts.label)
  return `${SITE_URL}/compare?${q.toString().replace(/%2C/g, ",").replace(/%2F/g, "/")}`
}
