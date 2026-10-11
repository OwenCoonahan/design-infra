import type { NextConfig } from "next"
import { readdirSync } from "node:fs"

function runtimeFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = `${directory}/${entry.name}`
    return entry.isDirectory() ? runtimeFiles(file) : /\.(json|md)$/.test(entry.name) ? [file] : []
  })
}
const content = ["catalog", "design-systems", "inspiration", "presets"].flatMap(runtimeFiles)

const nextConfig: NextConfig = {
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
