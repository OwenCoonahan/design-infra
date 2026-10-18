/** Visual discovery facets, independent of the underlying chart engine. */
export const CHART_TYPES = [
  ["line", "Line"], ["area", "Area"], ["bar", "Bar"], ["donut", "Donut / ring"],
  ["pie", "Pie"], ["sparkline", "Sparkline"], ["scatter", "Scatter"], ["heatmap", "Heatmap"],
  ["radar", "Radar"], ["gauge", "Gauge"], ["sankey", "Sankey"], ["candlestick", "Candlestick"],
  ["treemap", "Treemap"], ["histogram", "Histogram"], ["box", "Box plot"], ["funnel", "Funnel"],
  ["sunburst", "Sunburst"], ["map", "Map"],
] as const
export const CHART_STYLES = [
  ["gradient", "Gradient"], ["stacked", "Stacked"], ["dotted", "Dots"], ["labeled", "Labels"],
  ["pattern", "Pattern / texture"], ["step", "Step"], ["interactive", "Interactive"],
  ["streaming", "Streaming"], ["dither", "Dither"],
] as const

type Entry = { id: string; title: string; tags: string[]; categories: string[]; kind: string }
/** Only named/tagged treatments count; broad descriptions and notes mention unrelated alternatives. */
export function chartFacets(entry: Entry) {
  if (!entry.categories.includes("chart") || entry.kind === "package") return { types: [], styles: [] }
  const name = `${entry.id.split("/").slice(1).join("/")} ${entry.title} ${entry.tags.join(" ")}`.toLowerCase()
  const match = (pattern: RegExp) => pattern.test(name)
  const types = CHART_TYPES.filter(([key]) => ({
    line: /\bline\b/, area: /\barea\b/, bar: /\bbars?\b/, donut: /\b(donut|doughnut|ring)\b/,
    pie: /\bpie\b/, sparkline: /\b(sparkline|spark)\b/, scatter: /\b(scatter|bubble|dot plot)\b/,
    heatmap: /\b(heatmap|heat map|contribution)\b/, radar: /\b(radar|spider)\b/, gauge: /\bgauge\b/,
    sankey: /\bsankey\b/, candlestick: /\b(candlestick|ohlc)\b/, treemap: /\btreemap\b/,
    histogram: /\bhistogram\b/, box: /\bbox\b/, funnel: /\bfunnel\b/, sunburst: /\bsunburst\b/,
    map: /\b(choropleth|geographic)\b/,
  }[key].test(name))).map(([key]) => key)
  const styles = CHART_STYLES.filter(([key]) => match({
    gradient: /\bgradient\b/, stacked: /\b(stacked|stack)\b/, dotted: /\b(dots?|dotted|markers)\b/,
    labeled: /\b(labels?|labeled)\b/, pattern: /\b(pattern|texture|hatched)\b/, step: /\bstep\b/,
    interactive: /\b(interactive|brush|selection)\b/, streaming: /\b(streaming|live line|real.time)\b/,
    dither: /\bdither\b/,
  }[key])).map(([key]) => key)
  return { types, styles }
}
