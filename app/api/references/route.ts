import { referencesFor, REFERENCES_HOW_TO_PRESENT } from "@/lib/catalog/references"
import { Category, Mood } from "@/lib/catalog/schema"

/**
 * GET /api/references?pattern=pricing&category=pricing&moods=trustworthy,refined&paid=0&limit=5
 * Inspiration galleries for one pattern, best first, with concrete URLs + etiquette (catalog/references.json).
 */
export async function GET(req: Request) {
  const p = new URL(req.url).searchParams
  const pattern = p.get("pattern") ?? p.get("q") ?? ""
  const category = Category.safeParse(p.get("category"))
  if (!pattern && !category.success) return Response.json({ error: "pattern (or category) is required" }, { status: 400 })
  const moods = (p.get("moods") ?? "").split(",").flatMap((m) => (Mood.safeParse(m).success ? [m as Mood] : []))
  const limit = Math.min(14, Math.max(1, Number(p.get("limit")) || 5))
  const results = referencesFor({
    text: pattern,
    category: category.success ? category.data : undefined,
    moods,
    includePaid: p.get("paid") !== "0",
    limit,
  })
  return Response.json({ pattern, category: category.success ? category.data : null, moods, results, howToPresent: REFERENCES_HOW_TO_PRESENT })
}
