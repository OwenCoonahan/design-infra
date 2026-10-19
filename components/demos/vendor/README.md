# Hosted demo components

These copies support local, component-only previews. They do not create new registry items or replace upstream install commands. The catalog retains each vendor's original ID. The broad catalog client imports descriptors, not these implementations; implementations load only inside `/preview/<source>/<name>`.

| Folder | Upstream registry | Licence | Adaptation |
| --- | --- | --- | --- |
| smoothui | `https://smoothui.dev/r/{name}.json` | MIT, adjacent LICENSE | Original components; Dot Morph Button resolves its SmoothButton import to the adjacent upstream copy. Scoped lint annotations retain upstream behavior. |
| kibo-ui | `https://www.kibo-ui.com/r/spinner.json` | MIT, adjacent LICENSE | Internal `@repo/shadcn-ui/components/ui/spinner` import redirected to official shadcn Spinner |
| magicui | `https://magicui.design/r/animated-circular-progress-bar.json` | MIT, adjacent LICENSE | Original component, no implementation changes |
| shadcn | `https://ui.shadcn.com/r/styles/new-york-v4/{name}.json` | MIT, adjacent LICENSE | Spinner plus 20 actual upstream chart examples; local imports, shared sample data/palette controls, playback-aware animation and hidden canned trend footer |
| chartjs | `chart.js@4.5.1` | MIT, adjacent LICENSE | Installed package; original line, grouped-bar, doughnut, bubble and scatter demo compositions |
| react-flow | `@xyflow/react@12.12.0` | MIT, adjacent LICENSE | Installed free core; original custom-node workflow, vendor attribution retained |
| react-force-graph | `react-force-graph-2d@1.29.2` | MIT, adjacent LICENSE | Installed 2D Canvas package; original fixed-layout network with node selection/dragging |

Loading components fetched 2026-10-11. Dither Chart, Progressive Blur, Dot Morph Button, Pixel Brush Canvas, Scrubber, Card Swipe Deck and the SmoothButton dependency fetched 2026-10-16; the upstream MIT licence was rechecked unchanged. The imported components include a source URL comment. Source-file SHA-256 hashes and supported adapters are recorded in `catalog/preview-demos.json`; update the record when intentionally refreshing an import. Original licence texts must stay with each folder. `thinking-orbs` is used through its installed MIT npm package rather than copied here.

Demo wrappers and controls live in `../loading-demos.tsx` and `../showcase-demos.tsx` / `../creative-demos.tsx`. The homepage scene uses the same isolated native previews as the catalog, with a compact responsive presentation; vendor implementations do not enter the parent page bundle. The SmoothButton dependency hash is recorded with Dot Morph Button in the manifest. New adapters need an explicit manifest entry, upstream attribution/licence, browser verification, a generated poster and catalog regeneration. Do not add paid or link-only sources to this folder.

Chart examples and package licences checked 2026-10-19. The chart/graph adapters are in `../chart-demos.tsx`, `../chartjs-demos.tsx`, `../react-flow-demo.tsx` and `../force-graph-demo.tsx`. Graph engines load only in browser preview frames; their readiness signal waits until the engine module mounts. Native sample-data rendering is verified separately from fresh-project consumer integration. These packages are not added to the bootstrap.
