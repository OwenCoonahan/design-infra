import "server-only"

import { readdir } from "node:fs/promises"
import path from "node:path"

import { REPOSITORY_URL } from "./config"

const GITHUB_BLOB = `${REPOSITORY_URL}/blob/main`

/** Screenshots `pnpm capture` wrote to public/inspiration/<slug>/ (hero / full / mobile .webp), as URLs. */
export async function inspirationShots(slug: string) {
  const files = await readdir(path.join(process.cwd(), "public/inspiration", slug)).catch(() => [] as string[])
  const url = (name: string) => (files.includes(`${name}.webp`) ? `/inspiration/${slug}/${name}.webp` : undefined)
  return {
    hero: url("hero"),
    full: url("full"),
    mobile: url("mobile"),
    extra: files.filter((f) => f.endsWith(".webp") && !["hero.webp", "full.webp", "mobile.webp"].includes(f)).map((f) => `/inspiration/${slug}/${f}`),
  }
}

/**
 * README bodies are written for the repo (relative links into public/ and sibling files). Rewrite
 * them for the gallery and drop the leading H1 + hero image, which the page renders itself.
 */
export function inspirationBodyForGallery(slug: string, body: string) {
  return body
    .replace(/^\s*# .*\n+/, "")
    .replace(/^!\[[^\]]*\]\([^)]*\/hero\.webp\)\s*\n/m, "")
    .replace(/\]\((?:\.\.\/)+public\//g, "](/")
    .replace(/\]\(\.\/([^)]+)\)/g, `](${GITHUB_BLOB}/inspiration/${slug}/$1)`)
}
