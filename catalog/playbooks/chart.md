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
