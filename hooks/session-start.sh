#!/usr/bin/env bash
# design-infra SessionStart hook: tell the agent where design work lives — but only in web/UI projects
# (or brand-new empty repos), so backend-only sessions stay quiet. Stdout becomes session context.
set -euo pipefail
cat >/dev/null 2>&1 || true  # drain hook JSON on stdin

dir="${CLAUDE_PROJECT_DIR:-$PWD}"
is_web=0
if [ -f "$dir/package.json" ] && grep -qE '"(next|react|react-dom|vite|tailwindcss|@remix-run/[a-z-]+|astro|svelte|vue)"' "$dir/package.json"; then
  is_web=1
elif [ -z "$(ls -A "$dir" 2>/dev/null | grep -vE '^(\.git|\.context|README\.md|LICENSE|\.gitignore|CLAUDE\.md|AGENTS\.md)$' || true)" ]; then
  is_web=1  # empty / brand-new repo: likely about to scaffold something
fi
[ "$is_web" = 1 ] || exit 0

design_md="no DESIGN.md yet — inspect existing styling and record it; choose a new system only if requested"
[ -f "$dir/DESIGN.md" ] && design_md="./DESIGN.md exists — read it before writing any UI and follow its tokens and Do's/Don'ts"

plugin_root="$(cd "$(dirname "$0")/.." && pwd)"
site="$(node -e 'process.stdout.write(JSON.parse(require("fs").readFileSync(process.argv[1], "utf8")).siteUrl)' "$plugin_root/design-infra.config.json")"

cat <<MSG
[design-infra] the shared design infrastructure is installed. For UI work in this project, ASSEMBLE from it instead of writing components from scratch:
- New page/app from a brief → build-ui skill (or MCP tool plan_ui). Specific piece → find-component skill (or MCP search_components).
- A ranked component catalog (the shared @design-infra registry, shadcn blocks, Aceternity, Magic UI, Beautiful UI, libraries.dev, transitions.dev…), 4 DESIGN.md design systems, starter templates. Gallery: ${site}
- Design system: ${design_md}.
- Tooling: $( [ -f "$dir/.design-infra/toolchain.json" ] && echo "bootstrapped (.design-infra/toolchain.json)" || echo "use setup-project for a minimal connection; install only selected components" ).
MSG
