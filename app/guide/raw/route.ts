import { configureText } from "@/lib/config"
import { readFile } from "node:fs/promises"
import path from "node:path"

/** GET /guide/raw — the guide as markdown (for agents). Static: rendered at build time. */
export const dynamic = "force-static"

export async function GET() {
  const md = await readFile(path.join(process.cwd(), "docs/GUIDE.md"), "utf8")
  return new Response(configureText(md), { headers: { "content-type": "text/markdown; charset=utf-8" } })
}
