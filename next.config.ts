import type { NextConfig } from "next"
import { readdirSync } from "node:fs"
import { BASE_PATH } from "./lib/config"

function runtimeFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = `${directory}/${entry.name}`
    return entry.isDirectory() ? runtimeFiles(file) : /\.(json|md)$/.test(entry.name) ? [file] : []
  })
}
const content = ["catalog", "design-systems", "inspiration", "presets"].flatMap(runtimeFiles)

const nextConfig: NextConfig = {
  basePath: BASE_PATH,
  // Old Vercel URLs, including MCP POSTs and registry installs, still resolve.
  // Prefix-aware requests bypass this rule, so the personal site's rewrite stays on its domain.
  async redirects() {
    return BASE_PATH ? [{
      source: "/",
      destination: BASE_PATH,
      basePath: false,
      permanent: false,
    }, {
      // Vercel's own /_vercel/* routes (Web Analytics) must stay at the root.
      source: `/:path((?!(?:${BASE_PATH.slice(1)}|_vercel)(?:/|$)).+)`,
      destination: `${BASE_PATH}/:path`,
      basePath: false,
      permanent: false,
    }] : []
  },
  // Web Analytics posts to <basePath>/_vercel/insights (see app/layout.tsx); Vercel serves it at the root.
  async rewrites() {
    return BASE_PATH ? { beforeFiles: [{
      source: `${BASE_PATH}/_vercel/insights/:path*`,
      destination: "/_vercel/insights/:path*",
      basePath: false,
    }] } : []
  },
  // Route handlers (MCP, /api/*) and on-demand pages read the catalog + DESIGN.md files at runtime.
  // Careful: a glob like "./docs/**/*.md" also matches docs/ folders inside node_modules (pnpm's symlinked
  // store) and breaks Vercel packaging ("invalid deployment package … symlinked directories"). Prefer
  // explicit files or folders that only exist at the repo root.
  outputFileTracingExcludes: { "/*": ["**/.context/**", "**/.git/**", "**/.claude/worktrees/**"] },
  outputFileTracingIncludes: {
    "/*": [...content, "registry.json", "lib/design-systems.generated.json", "docs/GUIDE.md", "docs/INTEGRATE.md", "docs/REFERENCE.md", "docs/PILOT.md"],
  },
}

export default nextConfig
