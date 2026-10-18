import { z } from "zod"
import { CatalogEntry } from "./schema"

const chartItem = z.object({ name: z.string(), type: z.string(), title: z.string().optional(), description: z.string().default(""), dependencies: z.array(z.string()).default([]) })
/** Index public chart components, excluding infrastructure, editor code and duplicate v0 examples. */
export function bklitCharts(input: unknown) {
  const registry = z.object({ items: z.array(chartItem) }).parse(input)
  const charts = registry.items.filter((item) => item.type === "registry:component" && item.name.endsWith("-chart"))
  if (charts.length < 10 || new Set(charts.map((item) => item.name)).size !== charts.length) throw new Error("Review changed Bklit chart registry")
  return charts.map((item) => CatalogEntry.parse({
    id: `bklit/${item.name}`, source: "bklit", name: item.name, title: `${item.title ?? item.name} · Bklit`,
    description: item.description, kind: "component", categories: ["chart"], access: "free",
    install: `npx shadcn@latest add https://ui.bklit.com/r/${item.name}.json`,
    docs: `https://bklit.com/docs/components/${item.name}`, live: `https://bklit.com/charts/${item.name}`,
    dependencies: item.dependencies, tags: ["react", "visx", "motion", "chart-ui", item.name],
    moods: ["refined", "technical"], curated: ["area-chart", "line-chart", "bar-chart", "ring-chart", "heatmap-chart"].includes(item.name),
    integration: "drop-in", appliesTo: ["chart"], themeAware: true,
    notes: "Public MIT chart component, not the proprietary Bklit Studio editor. Browse the linked gallery for visual variants and composition props. Uses visx and Motion; inspect dependencies, React peers and chart token mappings before integrating. Registry endpoints checked; fresh-project runtime integration is not yet verified. Preserve the upstream license.",
  }))
}

const tremorTypes = [
  ["AreaChart", "area-chart", "Area chart"], ["BarChart", "bar-chart", "Bar chart"],
  ["ComboChart", "combo-chart", "Combo chart"], ["BarList", "bar-list", "Bar list"],
  ["CategoryBar", "category-bar", "Category bar"], ["DonutChart", "donut-chart", "Donut chart"],
  ["LineChart", "line-chart", "Line chart"], ["ProgressBar", "progress-bar", "Progress bar"],
  ["ProgressCircle", "progress-circle", "Progress circle"], ["SparkChart", "spark-chart", "Spark chart"],
  ["Tracker", "tracker", "Tracker"],
] as const
export function tremorCharts(input: unknown) {
  const directories = new Set(z.array(z.object({ name: z.string(), type: z.string() })).parse(input).filter((item) => item.type === "dir").map((item) => item.name))
  return tremorTypes.map(([directory, name, title]) => {
    if (!directories.has(directory)) throw new Error(`Review removed Tremor component: ${directory}`)
    const docs = `https://www.tremor.so/docs/visualizations/${name === "bar-list" ? "barlist" : name}`
    return CatalogEntry.parse({
      id: `tremor/${name}`, source: "tremor", name, title: `${title} · Tremor Raw`,
      description: `Copy-and-paste ${title.toLowerCase()} UI for dashboard cards and reports. Adapt its palette, labels and component props to the project's brand and real data.`,
      kind: "component", categories: ["chart"], access: "free", docs, live: docs,
      install: `Copy the public Tremor Raw ${directory} component and helpers from ${docs}; follow its per-component dependency instructions.`,
      tags: ["chart-ui", "react", "tailwind-v4", "copy-paste", name], moods: ["minimal", "refined", "technical"],
      integration: "recipe", appliesTo: ["chart"], curated: ["area-chart", "bar-chart", "spark-chart", "donut-chart"].includes(name),
      notes: `Tremor Raw, Apache-2.0 with MIT notices for listed subcomponents. Public component: https://github.com/tremorlabs/tremor/tree/main/src/components/${directory}. Requires React 18.2+ and Tailwind 4 according to the current guide; chart utilities, color helpers and dependencies vary by component. This is manual source integration, not a package/registry install. Do not substitute the legacy @tremor/react package or paid Tremor Blocks. Source/docs checked; runtime integration remains unverified.`,
    })
  })
}
