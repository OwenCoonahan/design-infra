import { readFile } from "node:fs/promises"
import path from "node:path"

import { configureData } from "@/lib/config"

/** GET /api/toolchain — ranked CLIs, MCP servers, skills, registries and keys (catalog/toolchain.json). */
export async function GET() {
  const raw = await readFile(path.join(process.cwd(), "catalog/toolchain.json"), "utf8")
  return new Response(JSON.stringify(configureData(JSON.parse(raw))), { headers: { "content-type": "application/json", "cache-control": "public, max-age=300" } })
}
