import { searchCatalog, summarize } from "@/lib/catalog/search"
import { Mood } from "@/lib/catalog/schema"
import { parseFilters, searchOptionsFromFilters } from "@/lib/catalog/filters"
import { getCatalog } from "@/lib/data"

/** GET /api/search?q=pricing+toggle&category=pricing&source=oc&moods=calm,premium&limit=10&paid=1 */
export async function GET(req: Request) {
  const p = new URL(req.url).searchParams
  const options = searchOptionsFromFilters(parseFilters(Object.fromEntries(p)))
  const results = searchCatalog(await getCatalog(), {
    ...options,
    ...(p.has("moods") && { moods: (p.get("moods") ?? "").split(",").flatMap((m) => (Mood.safeParse(m).success ? [m as Mood] : [])) }),
    limit: Math.max(1, Math.min(Math.floor(Number(p.get("limit") ?? 10)) || 10, 50)),
  })
  return Response.json(results.map((r) => ({ ...summarize(r), score: r.score })))
}
