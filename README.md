# design-infra

Find existing components, see them live, and give your coding agent the right parts to build with. The catalog combines a theme-aware shadcn registry, curated third-party sources, design systems and reference galleries. Search by component type and feeling: “clean pricing”, “sharp navbar”, “subtle button hover”.

[Connect your project](https://www.owencoonahan.xyz/design-infra/integrate) · [Starter collection](https://www.owencoonahan.xyz/design-infra/starter) · [Browse the catalog](https://www.owencoonahan.xyz/design-infra/components) · [Guide](https://www.owencoonahan.xyz/design-infra/guide) · [Feedback](https://www.owencoonahan.xyz/design-infra/feedback)

## Give this to your agent

Open an existing project in Claude Code or Codex and paste:

> Integrate https://github.com/OwenCoonahan/design-infra into this project and show me how to use it.

Agents: follow the [setup guide](docs/INTEGRATE.md) to connect, verify access, and show a few example requests. Setup alone does not authorize UI changes. No clone, plugin or design-infra API key is required. Then ask for options or say “choose and build” to delegate an actual task.

Prefer a command? Download and inspect the script, then run it in your project:

```bash
curl -fsSL https://www.owencoonahan.xyz/design-infra/bootstrap.mjs -o /tmp/di.mjs
node /tmp/di.mjs --connect --client claude-code
# or:
node /tmp/di.mjs --connect --client codex
```

This saves the client's MCP configuration and persistent agent instructions, verifies the hosted endpoints, and adds our registry only if the project already has components.json. Restart/trust the agent as needed, then ask it to call a tool. It preserves other configuration, installs no packages or theme, and works in projects without a React stack. `--dry-run` previews files without writing them.

## Use it in a project

1. Describe the component and feeling, or paste a website link/screenshot into your agent.
2. The agent inspects the reference, searches reusable parts and shows distinct options with live and comparison links.
3. Pick an option, or ask the agent to choose and build; it installs compatible components and adapts them to your content, behavior and tokens.
4. Check the result at desktop/mobile widths. Share a [feedback report](https://www.owencoonahan.xyz/design-infra/feedback) so the next search improves.

Try “I don't like our features section; show different approaches” or “Make this hero feel like this screenshot”. [Reference workflow](docs/REFERENCE.md). The catalog matches observations supplied by the project agent; it does not inspect images or fetch arbitrary reference URLs itself. For other frameworks, use patterns and references, and let the agent explain the implementation gap.

Browse visually by type: [Loading](https://www.owencoonahan.xyz/design-infra/components?category=loader), [Buttons](https://www.owencoonahan.xyz/design-infra/components?category=button), or [Pricing](https://www.owencoonahan.xyz/design-infra/components?category=pricing). Category galleries start in Live view, with at most three visible demos or clips playing together. Loading has eight hosted demos; other types use existing demos, clips and thumbnails. Source-only entries are listed separately, and paid entries remain opt-in.

Shortlists stay in your browser. Compare URLs can be shared. Favorites/dislikes are shared catalog curation, not each person's private taste. Accounts, private group collections and vendor subscription management are separate future work. [Pilot tasks](docs/PILOT.md) help friends test the real workflow.

## Technical illustrations

[Anatomy](https://skills.wheresryan.sh/anatomy) adds 33 reusable MIT isometric explainers for docs and technical sections, plus an optional Claude Code/Codex skill. [Browse the figures](https://www.owencoonahan.xyz/design-infra/components?source=anatomy&category=illustration&view=grid). Reuse a figure with `pnpm add anatomy-figures` and a per-figure import; choose the skill only for a new mechanism. Setup, theme mapping and limits are in [the source guide](catalog/sources/anatomy.md).

## Install selected components

Our `@design-infra` blocks use React, Tailwind 4 and shadcn tokens. Merge the registry into an existing compatible components.json:

```json
{
  "registries": {
    "@design-infra": "https://www.owencoonahan.xyz/design-infra/r/{name}.json",
    "@oc": "https://www.owencoonahan.xyz/design-infra/r/{name}.json"
  }
}
```

```bash
pnpm dlx shadcn@latest add @design-infra/pricing-simple
```

`@oc` remains an alias, and old gallery links redirect. Stable `oc/` catalog IDs preserve saved choices. Internal directory names are retained for compatibility. Install a theme only when changing the project's design system deliberately; whole-page templates require reviewing their target page. The broader bootstrap is optional: inspect `--dry-run`, choose `--only` or `--tier`, and use `--overwrite` only after reviewing conflicts. Paid tools require your own authorized access; keys stay outside source control.

## Run or fork the catalog

Use Node 24 and pnpm (the version in package.json).

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Edit **design-infra.config.json** to set the site URL (including an optional path such as `/design-infra`), GitHub repository and registry namespace for your deployment. Run `pnpm generate` afterward. The file drives generated registry dependencies, installation commands, toolchain, bootstrap and hosted guides. NEXT_PUBLIC_SITE_URL is an optional deployment override; regenerate outputs under the same value before building. Existing aliases remain supported.

The site identity uses the MIT Phosphor Diamonds Four mark. `pnpm brand:build` regenerates its favicon, touch icon and sharing image using system Chrome (`CHROME_PATH` can override the executable). Attribution is in [NOTICE.md](NOTICE.md).

The [agent contribution and feedback plan](docs/AGENT-CONTRIBUTIONS.md) describes the proposed usage measurement, timely feedback prompts, scoped taste and reviewed contribution loop. These are planned capabilities; the current `/feedback` page prepares a local report without submitting it.

The public catalog lives at **https://www.owencoonahan.xyz/design-infra**. The personal site forwards this entire path to the independently deployed catalog, preserving the visible URL. Next.js derives `basePath` from the configured site URL; native asset, preview and API paths use the same prefix. Old `design-infra.vercel.app` links continue through method-preserving redirects to the prefixed routes.

Agents reading a local fork: read that settings file first and substitute its values in the examples here and in docs/. Share your own deployment's `/integrate` URL with friends.

```bash
pnpm generate
pnpm check
pnpm test
pnpm lint
pnpm build
pnpm start
# In another terminal:
pnpm smoke:gallery --base http://localhost:3000
pnpm verify:starter --base http://localhost:3000
```

Source inputs live in catalog/, design-systems/, registry/oc/ and skills/. Read [AGENTS.md](AGENTS.md) for generator and block conventions, [CONTRIBUTING.md](CONTRIBUTING.md) for changes, and [SECURITY.md](SECURITY.md) for reporting a vulnerability.

## Licence

Original code is MIT. Third-party code, images, fonts, prompts and vendor access retain their own terms: see [NOTICE.md](NOTICE.md). A catalog entry or install command is not a redistribution licence. Restricted previews are link-only.
