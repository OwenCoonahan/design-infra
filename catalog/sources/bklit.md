---
slug: bklit
name: Bklit UI
url: https://bklit.com/
summary: Composable chart UI with a public gallery of gradients, patterns, streaming lines, gauges and other visual treatments; built with visx and Motion.
type: registry
access: free
license: MIT for chart components and registry; Bklit Studio is proprietary and excluded.
stack: [React, TypeScript, Tailwind, visx, Motion]
install: npx shadcn@latest add https://ui.bklit.com/r/line-chart.json
namespace: "@bklit"
vendorable: true
---

# Bklit UI

Use this when the **look and behavior of the chart itself** matter: filled areas, patterned surfaces, stepped curves, live lines, ring/gauge KPIs, contribution heatmaps, funnels and more. Browse [chart variants](https://bklit.com/charts/area-chart) alongside existing shadcn, beUI and SmoothUI examples. Moods: refined and technical.

## Install selected components

```bash
npx shadcn@latest add https://ui.bklit.com/r/area-chart.json
```

The direct URL works without adding a project registry preset. The documented namespace is `@bklit`, resolved through `https://ui.bklit.com/r/{name}.json`. Read the selected component's [docs](https://bklit.com/docs/components/area-chart) for data shape, imports and composition. A visual variant installs its underlying chart component; then apply the variant's documented props/composition. It is not a separately generated application screen.

## Machine access

- [Public registry index](https://bklit.com/r/registry.json); `pnpm sync bklit` indexes chart components, excluding plumbing and duplicate v0 examples.
- [Repository](https://github.com/bklit/bklit-ui), [component license](https://github.com/bklit/bklit-ui/blob/main/LICENSE), [Studio license](https://github.com/bklit/bklit-ui/blob/main/LICENSE-STUDIO.md).
- [Installation](https://bklit.com/docs/installation), [theming](https://bklit.com/docs/theming); no `llms.txt` at the current domain when audited.

## Gotchas

Charts are free MIT source; Studio is a separate proprietary editor. This catalog indexes public components and links to public variants; it does not copy the editor, buy access or install an upstream agent skill. Preserve the MIT notice when integrating component source.

Let the registry install its visx/Motion dependencies. Inspect React peer compatibility and existing dependency versions first. Map chart tokens and tooltip surfaces to the project's theme; review any emitted chart CSS variables before overwriting brand choices. Treat streaming charts as live data displays, not decorative animation. Retain accessible summaries, units and missing-data behavior.

Registry JSON/files and public gallery/docs URLs were checked on 2026-10-18. Fresh-project runtime compatibility and local preview adapters are not yet verified. Examples remain external until exact hosted adapters are added; whole documentation pages are not embedded automatically.

## Best starting points

Area variants for filled/gradient/patterned designs; line charts for multiple series; live line for streaming data; rings/gauges for compact KPIs; heatmaps for contribution/activity views. Compare the same chart form across multiple UI collections before reaching for a new low-level engine.
