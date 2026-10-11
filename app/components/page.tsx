import { CatalogBrowser, type SlimEntry } from "@/components/site/catalog-browser"
import { liveUrl } from "@/lib/catalog/facets"
import { filtersToQuery, parseFilters } from "@/lib/catalog/filters"
import { getCatalog } from "@/lib/data"
import { previewDescriptor } from "@/lib/catalog/previews"
import { previewSrc } from "@/lib/thumbnails"

export const metadata = { title: "Catalog" }

export default async function CatalogPage(props: PageProps<"/components">) {
  const initial = parseFilters(await props.searchParams)
  const catalog = await getCatalog()
  // Optional fields only when set — RSC would otherwise serialise every `undefined` × ~2,200 entries.
  const entries: SlimEntry[] = catalog.map((e) => ({
    id: e.id,
    source: e.source,
    title: e.title,
    description: e.description,
    categories: e.categories,
    tags: e.tags,
    appliesTo: e.appliesTo,
    access: e.access,
    curated: e.curated,
    favorite: e.favorite,
    kind: e.kind,
    moods: e.moods,
    ...(previewDescriptor(e) && { visual: previewDescriptor(e) }),
    ...(e.themeAware && { themeAware: true }),
    ...(e.preview && { preview: previewSrc(e.preview) }),
    ...(e.video && { video: e.video }),
    ...(e.notes && { notes: e.notes }),
    ...(e.integration && { integration: e.integration }),
    ...(e.motion && { motion: { triggers: e.motion.triggers, intensity: e.motion.intensity } }),
    ...(e.docs && { sourceHref: e.docs }),
    ...(liveUrl(e) && { live: liveUrl(e) }),
  }))
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* keyed so a link to another filtered view (e.g. a mood chip) resets the client state */}
      <CatalogBrowser key={filtersToQuery(initial)} entries={entries} initial={initial} />
    </div>
  )
}
