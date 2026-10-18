---
slug: tremor
name: Tremor Raw
url: https://www.tremor.so/
summary: Copy-and-paste chart and dashboard UI, including sparklines, bar lists, category bars, rings and activity trackers.
type: reference
access: free
license: Apache-2.0 with MIT notices for listed subcomponents; paid Tremor Blocks are separate and excluded.
stack: [React 18.2+, Tailwind v4, Recharts, Radix UI]
install: Copy the selected public Tremor Raw component and helpers using its documentation's dependency instructions.
vendorable: true
---

# Tremor Raw

Use it for restrained dashboard chart styling: line/area/bar/donut charts, mixed charts, compact sparklines in KPI cards, ranked bar lists, segmented category bars, progress indicators and activity trackers. Moods: minimal, refined and technical. Compare its chart UI to shadcn, Bklit and beUI; the underlying engine alone does not define the visual result.

## Integration

Follow the current [framework setup](https://www.tremor.so/docs/getting-started/installation) and the selected component's dependency steps. Copy the public component, chart utilities and helpers into the consuming project; update aliases and map colors to the brand. There is no registry install command for the Raw components indexed here.

The current guide requires React 18.2+ and Tailwind 4. Do not silently install the older `@tremor/react` npm package as a substitute. Recharts-dependent charts and small CSS indicators have different dependencies; use the actual component instructions rather than installing all of Tremor.

## Machine access and licensing

- [Repository components](https://github.com/tremorlabs/tremor/tree/main/src/components) and [public directory API](https://api.github.com/repos/tremorlabs/tremor/contents/src/components).
- [Apache license and MIT notices](https://github.com/tremorlabs/tremor/blob/main/LICENSE); preserve them when copying source.
- `pnpm sync tremor` verifies the known visualization folders before producing catalog references.
- Paid Tremor Blocks and Figma resources are separate offerings; no paid content or screenshots are imported.

## Best starting points

[Spark charts](https://www.tremor.so/docs/visualizations/spark-chart) for compact KPI cards; [bar lists](https://www.tremor.so/docs/visualizations/barlist) for ranked comparisons; [category bars](https://www.tremor.so/docs/visualizations/category-bar) for segmented status; [donut charts](https://www.tremor.so/docs/visualizations/donut-chart) for a few parts of a total; [trackers](https://www.tremor.so/docs/visualizations/tracker) for sequential status.

Choose chart form for the actual data, then choose styling. Keep units, readable legends, a nonvisual explanation/table and explicit missing-data states. Avoid small decorative charts that obscure the decision.

Public source folders, license and documentation URLs checked 2026-10-18. Runtime compatibility, accessibility and hosted adapters are unverified. These are manual integration references, not automatically installed finished screens; demos remain on the source site.
