# Agent setup instructions

Use design-infra to find existing components, show them live, and install the user's choices in their project. This is a shared catalog, registry, and design reference. These instructions work without cloning the source repository.

When a local checkout is available, read `design-infra.config.json` first and use its deployment, repository and namespace in the examples below. Hosted copies of these instructions resolve those settings for you. Stable catalog IDs such as `oc/pricing-simple` do not change with the installation namespace.

- Gallery: https://design-infra.vercel.app/components
- Streamable HTTP MCP: https://design-infra.vercel.app/mcp
- Registry item: `https://design-infra.vercel.app/r/{name}.json`
- Human usage guide: https://design-infra.vercel.app/guide
- Source: https://github.com/OwenCoonahan/design-infra (currently private; requires collaborator access)

## 1. Inspect the project

Read its agent instructions, package manifest, lockfile, existing components, styles, and DESIGN.md if present. Identify the framework, package manager, React/Tailwind versions, component aliases, and MCP client. Keep the existing brand, dependencies, credentials, and configuration. A catalog connection works with any stack; installing React components requires a compatible React project. Do not convert another framework or upgrade Tailwind just to connect this catalog.

## 2. Connect the catalog

Prefer the agent client's supported MCP configuration. Use its current documentation and merge a server named `design-infra` with URL `https://design-infra.vercel.app/mcp` and HTTP transport into the appropriate configuration. Client configuration formats differ: `.mcp.json` is not universal. Keep existing servers. No design-infra API key is required.

### Claude Code and Codex

Download and inspect the hosted bootstrap, then run a minimal connection from this project's root:

```bash
curl -fsSL https://design-infra.vercel.app/bootstrap.mjs -o /tmp/di.mjs
node /tmp/di.mjs --connect --client claude-code
# For Codex instead:
node /tmp/di.mjs --connect --client codex
```

`--dry-run` previews the files. This mode installs no packages or theme. It verifies the catalog and MCP initialization before writing; still verify a tool in the restarted client. Conflicting configuration requires review, rather than being overwritten silently.

For manual **Claude Code** configuration, merge this into the project's `.mcp.json`:

```json
{ "mcpServers": { "design-infra": { "type": "http", "url": "https://design-infra.vercel.app/mcp" } } }
```

Or use `claude mcp add --transport http --scope project design-infra https://design-infra.vercel.app/mcp`. Restart the session, approve the project MCP server if prompted, and use `/mcp` to inspect availability. [Claude Code MCP documentation](https://code.claude.com/docs/en/mcp).

For manual **Codex** configuration, merge this into `.codex/config.toml`:

```toml
[mcp_servers.design-infra]
url = "https://design-infra.vercel.app/mcp"
```

Codex loads project configuration for trusted projects. Restart/trust this project as appropriate; use `codex mcp list` and call search_components in the active agent to verify. User-level configuration is also available through `codex mcp add design-infra --url https://design-infra.vercel.app/mcp`; it connects all your projects, so prefer project configuration for a pilot. [Official Codex MCP documentation](https://learn.chatgpt.com/docs/extend/mcp?surface=cli).

For **Cursor**, `--connect --client cursor` writes `.cursor/mcp.json`, preserving other servers. The server is `{ "url": "https://design-infra.vercel.app/mcp" }` under `mcpServers.design-infra`. Enable it in the client and verify a tool; this path is not an end-to-end Cursor certification. [Cursor MCP documentation](https://cursor.com/docs/context/mcp).

If MCP configuration is unavailable or needs a restart, use the HTTP endpoints now. URL-encode query values:

```text
GET https://design-infra.vercel.app/api/search?q=clean%20pricing&limit=5
GET https://design-infra.vercel.app/api/options?component=button&request=subtle%20hover
GET https://design-infra.vercel.app/api/plan?brief=a%20clean%20SaaS%20landing%20page
GET https://design-infra.vercel.app/api/entries?ids=oc%2Fpricing-simple
GET https://design-infra.vercel.app/api/setup
```

These APIs return catalog metadata, choices, and installation guidance. They do not install anything. Do not claim MCP is active merely because you saved a configuration file: call a tool in the active session or report that restart is required and verify HTTP access instead.

## 3. Add a small persistent project instruction

Merge the following into the project's existing AGENTS.md, CLAUDE.md, or the agent's supported project rules. Create AGENTS.md if the project has no rules. Avoid duplicate sections and preserve existing instructions.

```markdown
## Design-infra

Before writing new UI, search design-infra for existing components and patterns.
Use MCP search_components / propose_options for a component, or plan_ui for a page.
For pasted links or screenshots, inspect the reference and follow
https://design-infra.vercel.app/reference/raw; use match_reference with observed patterns.
For "replace this section", inspect its code and propose distinct replacement approaches.
If MCP is unavailable, use https://design-infra.vercel.app/api/search?q=<encoded need>
and the setup instructions at https://design-infra.vercel.app/integrate/raw.
Show 3–5 relevant options with gallery/live links and a compare link; recommend one.
Wait for a pick unless the user already authorized you to choose and build.
Install and adapt the selected component; preserve our brand, copy, props, accessibility,
and DESIGN.md. Verify responsive behavior and reduced motion. Default to free components.
Explain any catalog gap before creating something custom. Keep vendor credentials out of
source control. Feedback is shared only when the user asks; choices are project-specific.
```

If there is no DESIGN.md, record the project's existing typography, colors, spacing, and motion conventions in a short file. Derive it from the code; do not install a new theme as part of connection setup.

## 4. Show a useful first shortlist

Pasted website/component URLs, screenshots, and requests to replace an existing section are core workflows. Follow [Build from a reference, or replace a section](https://design-infra.vercel.app/reference/raw). Inspect the reference or current section first, then match real reusable parts and show examples. The catalog does not fetch arbitrary reference URLs or analyse images itself; the project agent uses its own browser/image tools.

Search the full catalog. The tested starter collection at https://design-infra.vercel.app/api/starter is an optional first shelf when it fits the need, not the limit of available components. Its check dates and scope are evidence, not a universal compatibility guarantee.

Choose structure from the project's purpose and tasks separately from visual feeling. `plan_ui` supports `landing`, `dashboard`, `data`, `editorial`, `docs`, `commerce`, `ai-app`, `auth-onboarding` and `portfolio`; pass explicit `page_types` when reference-site wording might confuse detection. A data product needs filters, date ranges, charts, records, source/freshness and data states rather than marketing sections. Existing theme presets are legacy options for explicit selection. Preserve the brand; derive a new system from inspected references and a working composition instead of mapping "clean" to a fixed theme.

Pick an actual component need from the project or the user's request. Search with the component type and desired feeling, such as **clean pricing**, **sharp navbar**, or **subtle button hover**. Use `propose_options` or `plan_ui` when available. Return 3–5 compatible options, their catalog IDs, access requirements, gallery links, live demos, and install instructions. Explain the recommended fit for this project's stack and styling.

When the user names a reference gallery, call `find_references` with that name and the actual pattern, such as "Mobbin web dashboard". Use its available examples to inform structure and visual choices, then search the component catalog for implementation pieces. Mobbin's official MCP is a separate optional OAuth connection through a supported paid account; do not claim that design-infra connects it or grants access. If unavailable, use accessible alternatives or user-provided references and report the limitation.

Share a compare link using comma-separated catalog IDs, for example:
https://design-infra.vercel.app/compare?ids=oc/pricing-simple,smoothui/pricing-1

Some vendor sites prevent embedding: open their live link in a new tab. A demo link alone does not verify a component installation. Wait for the user's pick unless they already asked you to choose and implement.

## 5. Install the chosen component

Use its catalog install command and source notes. Confirm required vendor access for paid/keyed components. Prefer free items by default; credentials belong in the user's local secret store, never in committed files or handoff text.

For our own `@design-infra` blocks, inspect the existing `components.json`. If the project already uses compatible shadcn components, merge this registry entry without replacing its aliases or other registries:

```json
{
  "registries": {
    "@design-infra": "https://design-infra.vercel.app/r/{name}.json"
  }
}
```

Then install only the selected item with the project's package manager, for example:

```bash
pnpm dlx shadcn@latest add @design-infra/pricing-simple
```

If shadcn is not initialized, review its setup against this project's stack before initializing. Our blocks use React and Tailwind v4 theme tokens. For incompatible stacks, use catalog patterns as references and explain what can be reused. Do not overwrite existing components, replace an app page, bulk-install the toolchain, or change the theme during connection setup. The broader bootstrap at `/bootstrap.mjs` is an optional advanced setup; review `--dry-run` before using it.

Preserve existing behavior and content. Adapt upstream hard-coded styles to the project's tokens. Run the project's appropriate build/type checks and inspect the installed component at desktop and mobile widths, including keyboard behavior and reduced motion where relevant.

Optional theme installs: some shadcn CLI versions leave an empty argument when replacing a pre-existing Next font, such as `className={cn(, "font-sans", inter.variable)}` in `app/layout.tsx`. The advanced bootstrap repairs this specific artifact. For a direct CLI installation, inspect the changed layout, remove the invalid leading comma while keeping the font variables, then run the project build. Do not call an installation successful until that build passes. Component-only connections do not replace fonts.

## 6. Report and improve

Report the connection method, project instructions changed, verification performed, first shortlist, and any restart or compatibility limitation. After an installation, identify the component and what was adapted. Do not report success if a check failed.

People can browse, shortlist, compare, and copy choices to an agent without a plugin. Shortlists are stored in their browser; compare URLs are shareable. Shared saved collections, separate taste profiles, and automatic account syncing are not yet available. Current favorites are shared catalog recommendations.

For feedback, include the user's query, component ID, search/compare URL, project stack, and actual outcome. Use https://design-infra.vercel.app/feedback to copy a report without GitHub access; collaborators can also use issue templates. Share feedback only when requested. Never include private source or vendor secrets.
