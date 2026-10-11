import { Mood } from "@/lib/catalog/schema"
import { planUi } from "@/lib/plan"

/** GET /api/plan?brief=...&types=landing,ai-app — same as the MCP plan_ui tool. */
export async function GET(req: Request) {
  const p = new URL(req.url).searchParams
  const brief = p.get("brief")
  if (!brief || brief.length > 8000) return Response.json({ error: "brief is required (maximum 8000 characters)" }, { status: 400 })
  const types = p.get("types")?.split(",").filter(Boolean)
  const moods = (p.get("moods") ?? "").split(",").flatMap((m) => (Mood.safeParse(m).success ? [m as Mood] : []))
  return Response.json(await planUi(brief, types, Number(p.get("picks") ?? 3) || 3, moods))
}
