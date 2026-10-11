import { compareUrl, SITE_URL } from "./links"

/** Root-relative version of `compareUrl` for links inside the gallery (works on previews/localhost too). */
export function comparePath(ids: string[], opts: { theme?: string; label?: string } = {}) {
  return compareUrl(ids, opts).slice(SITE_URL.length)
}
