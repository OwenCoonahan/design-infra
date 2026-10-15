import settings from "../design-infra.config.json"

export type Settings = typeof settings

export function resolveSettings(input: Settings) {
  const url = new URL(input.siteUrl)
  if (!/^https?:$/.test(url.protocol) || url.username || url.password || url.search || url.hash || !/^\/(?:[a-z0-9_-]+\/)*[a-z0-9_-]*$/i.test(url.pathname)) throw new Error("siteUrl must be an HTTP(S) URL with an optional plain path")
  if (!/^[\w.-]+\/[\w.-]+$/.test(input.repository)) throw new Error("repository must be owner/name")
  if (![input.namespace, ...input.legacyNamespaces].every((n) => /^@[a-z0-9-]+$/.test(n))) throw new Error("invalid registry namespace")
  const basePath = url.pathname.replace(/\/$/, "")
  return { ...input, siteUrl: `${url.origin}${basePath}`, basePath, repositoryUrl: `https://github.com/${input.repository}` }
}

export const config = resolveSettings({ ...settings, siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? settings.siteUrl })
export const SITE_URL = config.siteUrl
export const REPOSITORY_URL = config.repositoryUrl
export const NAMESPACE = config.namespace
export const BASE_PATH = config.basePath

/** Native anchors, fetches and public assets need the prefix; next/link adds it itself. */
export function sitePath(path: string, basePath = BASE_PATH) {
  if (!path.startsWith("/") || path.startsWith("//") || !basePath || path === basePath || path.startsWith(`${basePath}/`) || path.startsWith(`${basePath}?`) || path.startsWith(`${basePath}#`)) return path
  return `${basePath}${path}`
}

/** Resolve bundled content for a fork without changing catalog IDs or saved choices. */
export function configureText(text: string, target = config) {
  return text.replaceAll(settings.siteUrl, "https://design-infra.vercel.app")
    .replaceAll("https://design-infra.vercel.app", target.siteUrl)
    .replaceAll("https://github.com/OwenCoonahan/design-infra", target.repositoryUrl)
    .replaceAll("OwenCoonahan/design-infra", target.repository)
    .replaceAll("@oc/", `${target.namespace}/`)
}

export function configureData<T>(value: T, target = config): T {
  return JSON.parse(configureText(JSON.stringify(value), target).replaceAll('"@oc"', JSON.stringify(target.namespace))) as T
}

export function ownRegistryDependency(dependency: string, target = config) {
  const prefix = [target.namespace, ...target.legacyNamespaces, "@oc", "@design-infra"].find((n) => dependency.startsWith(`${n}/`))
  return prefix ? `${target.siteUrl}/r/${dependency.slice(prefix.length + 1)}.json` : dependency
}
