import { liveUrl } from "@/lib/catalog/facets"
import { entryPage } from "@/lib/catalog/links"
import { getCatalog } from "@/lib/data"

/**
 * GET /api/entries?ids=oc/beam-card,magicui/blur-fade
 * Install commands + links for a handful of ids — what the shortlist bar needs to build the
 * "copy for agent" message without shipping every install command to /components.
 */
export async function GET(req: Request) {
  const ids = (new URL(req.url).searchParams.get("ids") ?? "").split(",").filter(Boolean).slice(0, 24)
  const byId = new Map((await getCatalog()).map((e) => [e.id, e]))
  return Response.json(
    ids.map((id) => {
      const e = byId.get(id)
      if (!e) return { id, found: false }
      return {
        id,
        found: true,
        title: e.title,
        install: e.install,
        page: entryPage(id),
        live: liveUrl(e),
        docs: e.docs,
        notes: e.notes ?? e.description,
        access: e.access,
        themeAware: e.themeAware ?? false,
        moods: e.moods,
      }
    })
  )
}
