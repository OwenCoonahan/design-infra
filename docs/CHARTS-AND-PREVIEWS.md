# Charts, graphs and broader live previews

Updated 2026-10-19. Library discovery, graph routing and chart-form/treatment filtering are implemented. The preview expansion and dedicated chart workbench below are a roadmap, not shipped capabilities.

The shared [roadmap](ROADMAP.md) also tracks the planned public changelog.

The primary goal is **indexing chart UI and visual design options**: different treatments of the same chart form, reusable components, UI collections and underlying packages. Numeric chart styling leads this work; network/workflow graphs have a separate shelf. Chart-form and treatment filters now work across sources, including the existing visual collections, Bklit's public charts/variants and Tremor Raw. This is a growing index, not a claim to contain every chart on the web.

## Recommendation

Keep one repository and catalog. Give charts and graphs focused browsing within Design Infra, sharing search, sources, comparison, agent handoff and contribution review. Split into another project only when there is a distinct product to maintain, such as saved datasets, collaborative analysis or an embeddable chart authoring SDK. A separate set of bookmarks would duplicate infrastructure and fragment recommendations.

A dedicated `/charts` workbench can follow the current category galleries without changing stable IDs, preview URLs or MCP clients. Renderers can be isolated modules/packages before there is any need for another repository.

## Baseline and current addition

Before this batch, commit `2501def` had 2,857 catalog entries: 37 hosted interactive demos, 206 clips, 1,392 static-only previews and 1,222 entries without an approved local visual. The 98 chart-tagged entries included one hosted interactive demo, one clip, 78 still previews and 18 source-only entries. These are catalog classifications, not unique libraries or counts of fully verified standalone components.

This batch adds 16 free library references and 80 integration recipes, source guides and task-based playbooks. Packages and required peers are checked against public npm metadata, and public documentation/example URLs are audited. This does not establish fresh-project install, browser, accessibility or performance verification. No visualization package is installed into the app or into consumers automatically. Live coverage has not increased merely by adding these references.

For chart UI variety, it also adds Bklit's 16 public MIT chart components plus eight explicit visual variants and Tremor Raw's 11 public Apache-licensed visualization components. Bklit variants install their base chart and require the documented props/composition; Tremor Raw requires manual copying of the public component/helpers. Public registry/source endpoints and example links were checked; runtime integration and local adapters remain unverified. The 35 UI/component/variant records bring the total addition to 131 records across 18 new sources. They are not 131 distinct finished components or hosted demos.

| Need | Libraries to inspect |
| --- | --- |
| Familiar React dashboard charts | Existing shadcn charts, Recharts, Chart.js, Nivo |
| Composed/analytical charts | ECharts, Observable Plot, Vega-Lite, Plotly, G2 |
| Dense monitoring/time-series work | uPlot; benchmark representative data and interactions |
| A custom chart language | visx or D3 when a ready-made component does not fit |
| An editable workflow/builder | React Flow core |
| Connected entities and network exploration | Cytoscape, Sigma, G6 |
| Explanatory diagrams | Mermaid or existing flowchart components |

The npm libraries are separate from their vendors' hosted products, support plans and paid example collections. Free-first discovery remains unchanged. React Flow Pro examples are not imported into this collection. Retain license notices when integrating; this repo's source-vendoring policy remains MIT/Apache only.

### Second library expansion — 2026-10-19

Add 13 sources and 93 records: Mantine Charts, MUI X Charts Community, Unovis, Victory, Frappe Charts, LayerChart, Chartist, Billboard.js, AG Charts Community, VChart, vis-network, React Force Graph 2D and TradingView Lightweight Charts. The package index now covers 29 libraries and 160 recipes, alongside Bklit/Tremor and existing chart collections. The overall catalog has 274 chart-tagged and 48 graph-tagged entries; those counts include package cards and recipes, not unique finished components or hosted demos.

The new sources extend chart UI styles and existing-stack options, rather than forcing a new framework into consumers. Chartist's MIT option and vis-network's Apache/MIT expression are explicitly audited; unknown license strings still fail sync. MUI/AG commercial imports stay excluded, financial chart attribution is documented, and 2D force-graph links are checked against the actual renderer used by the upstream examples. Public metadata and URLs are verified; runtime integration, accessibility/performance and native preview adapters still require separate work. No new visualization package is installed into the catalog app or default bootstrap.

## Expand previews by useful coverage

More live previews will help substantially. Start with supported free examples people can actually use, and cover meaningful differences within each component type. Avoid a target of thousands of autoplaying frames or a promise that every upstream entry has a maintained local clone.

1. **First: 12 representative chart demos and treatments.** Compare several visual styles of line/area/bar charts, compact sparklines, a matrix and distributions. Include different component collections rather than making all examples look like the same default chart. Begin with existing Recharts/shadcn dependencies; choose additional component libraries after checking the exact examples and compatibility. Give each demo actual hover/selection/data-update behavior, not just an animated entrance. Add workflow/network previews on their separate Graphs shelf afterward.
2. **Then: fill gaps in common component galleries.** Buttons, forms, navigation, cards, pricing and table states deserve usable representatives. Expand Loading's styles where existing genuine waiting states lack useful coverage. Prefer a few reliable examples per pattern over many duplicate variants.
3. **Then: specialized views.** Scientific/3D charts, larger network layouts and financial charts need stronger test fixtures, labeling and performance checks. Keep external links available while adapters are unverified.

Each adapter keeps the original catalog ID and install command, uses actual upstream public components/packages, records provenance and license, and loads through `/preview/[source]/[name]`. Implementations stay out of the broad catalog's client bundle. Generated posters come from the same neutral surface and dimensions as the live stage.

The shared budget remains at most three visible playing examples, with offscreen/hidden cleanup, explicit pause/play and reduced-motion defaults. Heavy engines should have a lower measured resource budget if necessary. Reserve frame dimensions and keep a readiness handoff so switching between posters and real components does not recreate the loading jumps previously fixed on the homepage. Failed previews keep a useful fallback and source link. Do not embed whole vendor documentation pages automatically.

## What the chart workbench should let someone do

- Start from a task: compare categories, follow a trend, inspect a distribution, explore a hierarchy, inspect relationships or edit a workflow.
- Filter by stack, renderer, interaction and data shape as well as mood/style. Distinguish React components, framework-neutral engines, reusable recipes and explanatory diagrams.
- Compare the same sample data across a few appropriate engines, with consistent units and labels. Provide realistic empty, missing and stale-data cases, a data table and a clear “sample data” label.
- Use the chart: hover, select a range, filter a series, switch a dataset, inspect a node or move/connect workflow nodes where supported. Keep source, shortlist and copy controls outside the interactive stage.
- Hand the chosen example to the project agent with its ID, package/module command, compatibility notes, data contract, source links and actual verification status. A package install is not reported as a completed chart integration.

Suggested route: `/charts`, with shared links back to `/components?category=chart` and `/components?category=graph`. Keep the existing catalog as the canonical source. New interactive workbench layouts should be reviewed as concrete design options before implementation.

## Better agent decisions

The agent should inspect the project's existing data and chart engine first. Determine the decision, numeric/date/category fields, units, data volume, update frequency and interactions. Ask one pointed question when an essential fact is missing; do not make people repeat their code or brief. Choose the visualization form before the visual treatment.

A clean dashboard, a scientific plot and a workflow editor need different solutions. “Graph” can mean a numeric chart or a network of entities; the new categories/playbooks distinguish them. A weighted Sankey is not an editable workflow. Mood guides typography, color and motion after the data/task choice.

Do not install sixteen engines into every project. Prefer an existing compatible solution, preserve the stack, and evaluate new dependencies only for a selected example. Requirements such as axes, missing-data handling, readable labels, keyboard/nonvisual access and mobile behavior survive visual refinements.

## Verification and release gates for native demos

For each selected adapter:

- Install the exact package/registry item in a clean compatible consumer and compile the adapted example. Record actual versions and checks. Validate React peers and required styles/renderers; keep unknown compatibility labeled unknown.
- Exercise a real interaction and assert a meaningful result: visible series changes, selected range/data rows, node selection, graph connection or another behavior the example promises. An iframe loading is not proof that the component works.
- Check desktop/tablet/phone frames, keyboard behavior, reduced motion, pause, offscreen/hidden disposal and failure fallback. Bound datasets and cancel animation/simulation loops, observers, canvas/WebGL contexts and listeners.
- Measure representative workloads on the actual adapter. Publish sample size/device context beside any performance claim; do not reuse a vendor headline as a benchmark.
- Generate posters from hosted stages, run visual smoke checks and normal generation/tests/checks/lint/build, merge after CI and verify the deployed examples.

The initial measurable target is twelve reliable, interacting chart/graph demos and useful coverage across common component types. Source-only reference counts are reported separately from visual and hosted-demo coverage. Friend trials should record whether people found, previewed and successfully adapted a suitable example; automated checks are not independent friend trials.
