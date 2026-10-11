# Contributing

Start with a concrete request, component or failed search. Share its query, link, stack and outcome through `/feedback` or an issue. No account is needed to copy a feedback report. Propose small changes that help someone find, preview or install a real component.

Use Node 24 and the package manager in package.json. Run `pnpm install --frozen-lockfile`, then `pnpm dev`. For a fork, edit `design-infra.config.json` and run `pnpm generate`.

Read AGENTS.md for catalog, design-system and registry conventions. Edit source inputs, then regenerate outputs; never edit generated catalog files or `public/r/` directly. Stable `oc/` catalog IDs and `registry/oc/` paths preserve saved links; `@design-infra` is the installation namespace, with `@oc` retained as an alias. New blocks use existing design tokens and must work across all design systems. Link to third-party components instead of copying restricted code. Follow NOTICE.md.

Run `pnpm generate`, `pnpm check`, `pnpm test`, `pnpm lint` and `pnpm build` before submitting. For gallery behavior, run `pnpm smoke:gallery --base http://localhost:3000` against a running production build. For starter component changes, run `pnpm verify:starter --base http://localhost:3000` and include the installation/build and browser report. CI checks generated files, tests, type checks, lint, builds, deployment traces and secrets. Use `pnpm build`, which enforces trace exclusions after Next builds; a raw `next build` is not the deployment command.

PRs should explain the request, resulting behavior, validation and remaining limitations. Include desktop/mobile screenshots for visible changes, and the source's licence for catalog additions. Use original screenshots or ones you have permission to redistribute. Keep credentials and private project data out of feedback and commits.
