# Hosted demo components

These copies support local, component-only previews. They do not create new registry items or replace upstream install commands. The catalog retains each vendor's original ID. The broad catalog client imports descriptors, not these implementations; implementations load only inside `/preview/<source>/<name>`.

| Folder | Upstream registry | Licence | Adaptation |
| --- | --- | --- | --- |
| smoothui | `https://smoothui.dev/r/{name}.json` | MIT, adjacent LICENSE | Original components, no implementation changes |
| kibo-ui | `https://www.kibo-ui.com/r/spinner.json` | MIT, adjacent LICENSE | Internal `@repo/shadcn-ui/components/ui/spinner` import redirected to official shadcn Spinner |
| magicui | `https://magicui.design/r/animated-circular-progress-bar.json` | MIT, adjacent LICENSE | Original component, no implementation changes |
| shadcn | `https://ui.shadcn.com/r/styles/new-york-v4/spinner.json` | MIT, adjacent LICENSE | Official primitive used by Kibo's default variant |

Fetched 2026-10-11. The imported components include a source URL comment. Source-file SHA-256 hashes and supported adapters are recorded in `catalog/preview-demos.json`; update the record when intentionally refreshing an import. Original licence texts must stay with each folder. `thinking-orbs` is used through its installed MIT npm package rather than copied here.

Demo wrappers and controls live in `../loading-demos.tsx`. New adapters need an explicit manifest entry, upstream attribution/licence, browser verification, a generated poster and catalog regeneration. Do not add paid or link-only sources to this folder.
