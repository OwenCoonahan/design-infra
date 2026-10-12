export type AnatomyFigure = { slug: string; exportName: string; title: string; renderer: "svg" | "webgl" | "3d" }
/** Published main figures only: early examples have limited theming and stay outside the primary catalog. */
export function anatomyFigures(readme: string, exports: Record<string, unknown>, collection: string): AnatomyFigure[] {
  const main = readme.split(/^## Figures\s*$/m)[1]?.split(/^## /m)[0]
  if (!main) throw new Error("Anatomy README no longer contains a Figures section")
  const live = new Set([...collection.matchAll(/href="\/anatomy\/collection\/([a-z0-9-]+)"/g)].map((m) => m[1]))
  const renderers = new Map<string, "svg" | "webgl" | "3d">()
  for (const [, renderer, section] of collection.matchAll(
    /<section[^>]+id="(svg|webgl|3d)"[^>]*>([\s\S]*?)<\/section>/g,
  )) {
    for (const [, slug] of section.matchAll(/href="\/anatomy\/collection\/([a-z0-9-]+)"/g))
      renderers.set(slug, renderer as "svg" | "webgl" | "3d")
  }
  const figures = [...main.matchAll(/^- `([A-Za-z0-9]+)` \(`anatomy-figures\/([a-z0-9-]+)`\): (.+)$/gm)].map(
    ([, exportName, slug, title]) => {
      const renderer = renderers.get(slug)
      if (!renderer) throw new Error(`Anatomy figure ${slug} has no renderer group in the collection`)
      return { slug, exportName, title: title.trim(), renderer }
    },
  )
  if (!figures.length) throw new Error("Anatomy figure list was empty; refusing to erase the catalog")
  for (const figure of figures) {
    if (!exports[`./${figure.slug}`]) throw new Error(`Anatomy figure ${figure.slug} has no published package export`)
    if (!live.has(figure.slug)) throw new Error(`Anatomy figure ${figure.slug} has no verified collection link`)
  }
  return figures
}
