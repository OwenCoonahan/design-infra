import { getRegistriesPreset } from "@/lib/plan"

/** GET /api/setup — the `registries` block to merge into components.json. */
export async function GET() {
  return Response.json({ registries: await getRegistriesPreset() })
}
