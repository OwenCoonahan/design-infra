---
name: setup-project
description: Connect or optionally bootstrap a repo with the shared design infrastructure — shadcn, every registry, MCP servers (design-infra, shadcn, Motion docs, Agentation…), agent skills (Motion AI Kit, transitions.dev), motion presets, keys from the user's secrets file, a design system and agent instructions. Use for "new repo", "set up design infra", "use the design infra repo", "get this project ready for UI work", "wire up shadcn/registries/MCPs".
---

Read the plugin root `design-infra.config.json` for the deployment URL, repository and installation namespace. Examples below use the default deployment; substitute these settings in a fork. Stable `oc/` catalog IDs are unchanged.

# setup-project — connect first, install as needed

Design-infra repo root = `<this skill's base dir>/../..` (`$DI`). The ranked toolchain (what gets installed and why)
is `$DI/catalog/TOOLCHAIN.md` (MCP: `get_toolchain`).

## Default: minimal project connection

Read `$DI/docs/INTEGRATE.md` (hosted at https://www.owencoonahan.xyz/design-infra/integrate/raw) and follow it.
Inspect the stack and styling, merge the catalog MCP into the actual client's supported configuration or verify the
HTTP fallback, and add persistent project instructions. Preserve the brand and existing configuration. Show a first
shortlist with live/compare links. Install only selected compatible components after a pick (or prior authorization
to choose and build). The repo may be private; the hosted instructions and catalog require no clone.

The broader bootstrap below is optional when the user requests the full toolchain, a fresh starter, or additional tools.
Do not run it as the default friend connection flow.

For Claude Code or Codex, prefer `node $DI/public/bootstrap.mjs --connect --client claude-code` or `--client codex`. Confirm a tool in the restarted/trusted session.

## Optional: run the broader bootstrap

```bash
node $DI/public/bootstrap.mjs --dry-run            # show the plan first (fast, changes nothing)
node $DI/public/bootstrap.mjs --theme <slug>       # apply (tiers 1–2 by default)
```

No local plugin copy? `curl -fsSL https://www.owencoonahan.xyz/design-infra/bootstrap.mjs -o /tmp/di.mjs && node /tmp/di.mjs …`

- **Empty repo:** add `--init-next` to create the Next.js app first (create-next-app needs the folder free of
  conflicting files — move a pre-existing CLAUDE.md/README aside if it complains).
- **Theme:** if the user hasn't chosen a look yet, run the **pick-design-system** skill first (ask how it should
  feel), then pass `--theme <slug>`. Without `--theme` the bootstrap does everything else.
- **More libraries:** `--tier 3` adds situational sources (Kibo, Cult UI, React Bits, Beautiful UI, 21st.dev);
  `--only <ids>` / `--skip <ids>` for precision; `--list` prints the ranking.

What it does (review the dry run and existing files before re-running): shadcn init if missing → registries into `components.json` → keyless MCP
servers into `.mcp.json` → keyed MCP servers as *user-scoped* `claude mcp add` entries → packages (motion…) →
`@design-infra/motion-presets` (+ theme) → agent skills (Motion AI Kit, transitions.dev) → `## Design (design-infra)` block in
CLAUDE.md/AGENTS.md → `.design-infra/toolchain.json` lock → verify table.

## 1b. Existing site: keep its look (DESIGN.md from current styles)

When the project already has a brand ("keep our current look"), **don't install one of our themes**. Use the minimal `--connect` mode, then write `./DESIGN.md` describing what's already there, following
`$DI/design-systems/CONVENTIONS.md` (also at https://github.com/OwenCoonahan/design-infra/blob/main/design-systems/CONVENTIONS.md):

1. Extract tokens from the code: `app/globals.css` / `tailwind.config.*` CSS variables (background, foreground, primary…,
   radius), fonts from `app/layout.tsx` (`next/font`), recurring colours in components. If the site is deployed, look at
   it (screenshot / browser) to confirm.
2. Front matter: `name`, `description`, `moods` (1–3 — ask the user how it should FEEL if it isn't obvious; offer the
   vocabulary: calm, minimal, refined, technical, editorial, warm, playful, premium, futuristic, experimental, bold,
   retro, organic, trustworthy), `motion` (still | quiet | lively | cinematic — default `quiet` for B2B/product sites),
   colors/typography/rounded using the convention's token names.
3. Body: Overview (the feel in plain words), Colors, Typography, Motion (durations/easing to use), Do's and Don'ts,
   Agent Prompt. Keep it honest to the current site; note inconsistencies you found as Don'ts.
4. Set `PROJECT_MOTION` in `lib/motion-presets.ts` to the chosen `motion`. Map the existing CSS to the motion tokens
   (`--motion-fast/base/slow`, `--motion-ease-*`) in `globals.css` using the values for that language from
   `$DI/design-systems/MOTION.md`.
5. Show the user the moods/motion you chose and ask them to confirm — this file steers every later option.
6. Suggest promoting it: in the design-infra workspace, "turn this DESIGN.md into a design system" makes
   `@design-infra/theme-<brand>` installable everywhere.

## 2. Keys

Secrets never go in the repo. They live in `~/.config/design-infra/secrets.env` (`KEY=value`, chmod 600):

```
API_KEY_21ST=…          # https://21st.dev/mcp (free account)
```

Keyed tools are skipped (and listed with where to get the key) until the key exists; re-run the bootstrap after
adding one. Registry keys are mirrored into the gitignored `.env.local` so `shadcn add` can expand them.

## 3. Finish

- Tell the user to **restart Claude Code** so new MCP servers and skills load, and do anything listed under
  "needs you" (interactive logins).
- Read the bootstrap's verify table; fix ✗ rows or report them.
- `pnpm build` passes. Optionally render `@design-infra/theme-preview` on a scratch page to eyeball the theme.

Report: tools applied (by tier), skipped + why, theme, and what the user must do.
