import { matchReference, ReferenceInput } from "@/lib/catalog/reference"
import { getCatalog } from "@/lib/data"

/** POST /api/reference — catalog matches for an agent's observed URL/screenshot patterns. */
export async function POST(req: Request) {
  const parsed = ReferenceInput.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: "Invalid reference observations", issues: parsed.error.issues }, { status: 400 })
  return Response.json(matchReference(await getCatalog(), parsed.data))
}
