---
component: chart
title: Charts and quantitative plots
categories: [chart]
aliases: [chart, plot, histogram, scatterplot, line chart, bar chart, bar graph, line graph, time series, distribution]
directions:
  - key: trend
    label: Trends over time
    feel: Readable axes and direct series labels, with restrained highlighting.
    when: Ordered timestamps and measured values; monitoring or reporting.
    avoid: Connecting unrelated categories or interpolating missing measurements silently.
    intent: [replace, restyle, polish]
    moods: [refined, trustworthy, technical]
    picks: [shadcn/chart-area-interactive, recharts/line, nivo/line, uplot/timeseries]
  - key: comparison
    label: Compare categories
    feel: A clear baseline and sortable bars that make differences legible.
    when: Comparing discrete groups or ranked values.
    avoid: Truncated bar baselines or too many colored series.
    intent: [replace, restyle, polish]
    moods: [minimal, trustworthy]
    picks: [shadcn/chart-bar-interactive, chartjs/bar, recharts/bar]
  - key: distribution
    label: Distributions and uncertainty
    feel: Bins, quantiles or ranges reveal the shape of observations.
    when: Comparing spread, skew, outliers or uncertainty.
    avoid: Hiding sample size or treating a decorative curve as measured density.
    intent: [replace, restyle, polish]
    moods: [technical, editorial]
    picks: [plotly/box, vega-lite/histogram, observable-plot/histogram]
  - key: composition
    label: Quantities and hierarchy
    feel: Explain parts, stages or nested totals with deliberate labels.
    when: Part-to-whole analysis, nested categories or measured flows.
    avoid: Using a Sankey for an unweighted workflow or many indistinguishable pie slices.
    intent: [replace, restyle, polish]
    moods: [refined, technical]
    picks: [nivo/treemap, echarts/sankey, nivo/sankey]
  - key: exploration
    label: Explore a matrix or relationship
    feel: Hover, selection and clear legends support reading actual data.
    when: Two numeric variables, a matrix, or exploratory analysis.
    avoid: Animation that obscures values or unexplained color scales.
    intent: [replace, restyle, polish]
    moods: [technical, trustworthy]
    picks: [plotly/scatter, echarts/heatmap, observable-plot/dot]
---

Read the project's data and existing chart engine before choosing. Resolve the decision the chart must support, available fields, units, row count, update frequency and required interaction. Ask one pointed question only when necessary information is missing; do not make the person restate what is already in their code or brief.

Choose the chart form before styling it. Preserve actual scales, zero baselines where needed, missing-data behavior, readable labels and keyboard/nonvisual access. Include loading, empty, error and stale-data states. Benchmark representative data in the target app; a vendor capability claim is not our measured performance.

The new library examples are integration recipes. Their commands install packages; they do not generate finished chart components. Reuse an existing compatible shadcn or beUI chart first when it fits. For relationships between entities rather than numeric values, use the Graphs gallery and graph playbook. If “graph” is ambiguous, inspect the data or clarify whether the person means a numeric chart or connected nodes.

For visual design requests, compare treatments of the **same chart form** across UI collections: shadcn, Bklit, Tremor Raw, beUI and SmoothUI. A gradient, patterned fill, stepped curve, small sparkline, labeled bar or dithered surface is a design choice beyond picking a renderer. Browse `category=chart&chartType=area&chartStyle=gradient&view=grid`, or use MCP `search_components` with `chart_type` and `chart_style`. Keep source/install/data requirements visible. Bklit's Studio is proprietary; public MIT chart components and gallery variants are separate. Tremor Raw needs manual source/helper integration.

For an existing Mantine or MUI project, inspect `mantine-charts` or `mui-charts` before bringing in another UI system. LayerChart is Svelte-specific. Chartist, Billboard, Unovis and Victory add different composition/styling options; AG Charts Community and VChart add spec/theme options. Keep commercial modules excluded. Lightweight Charts is useful for financial/time-series surfaces, with mandatory documented TradingView attribution; its time-indexed volume bars are not a statistical histogram. Read source guides and published peers before choosing current versions.
