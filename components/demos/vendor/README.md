# Hosted demo components

These copies support local, component-only previews. They do not create new registry items or replace upstream install commands. The catalog retains each vendor's original ID. The broad catalog client imports descriptors, not these implementations; implementations load only inside `/preview/<source>/<name>`.

| Folder | Upstream registry | Licence | Adaptation |
| --- | --- | --- | --- |
| smoothui | `https://smoothui.dev/r/{name}.json` | MIT, adjacent LICENSE | Original components; Dot Morph Button resolves its SmoothButton import to the adjacent upstream copy. Scoped lint annotations retain upstream behavior. |
| kibo-ui | `https://www.kibo-ui.com/r/spinner.json` | MIT, adjacent LICENSE | Internal `@repo/shadcn-ui/components/ui/spinner` import redirected to official shadcn Spinner |
| magicui | `https://magicui.design/r/animated-circular-progress-bar.json` | MIT, adjacent LICENSE | Original component, no implementation changes |
| shadcn | `https://ui.shadcn.com/r/styles/new-york-v4/spinner.json` | MIT, adjacent LICENSE | Official primitive used by Kibo's default variant |

Loading components fetched 2026-10-11. Dither Chart, Progressive Blur, Dot Morph Button and its SmoothButton dependency fetched 2026-10-16; the upstream MIT licence was rechecked unchanged. The imported components include a source URL comment. Source-file SHA-256 hashes and supported adapters are recorded in `catalog/preview-demos.json`; update the record when intentionally refreshing an import. Original licence texts must stay with each folder. `thinking-orbs` is used through its installed MIT npm package rather than copied here.

Demo wrappers and controls live in `../loading-demos.tsx` and `../showcase-demos.tsx`. The homepage scene uses the same isolated native previews as the catalog, with a compact responsive presentation; vendor implementations do not enter the parent page bundle. The SmoothButton dependency hash is recorded with Dot Morph Button in the manifest. New adapters need an explicit manifest entry, upstream attribution/licence, browser verification, a generated poster and catalog regeneration. Do not add paid or link-only sources to this folder.
