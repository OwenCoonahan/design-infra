import { configureText } from "@/lib/config"
import { readFile } from "node:fs/promises"
import path from "node:path"

export const dynamic = "force-static"

export async function GET() {
  const instructions = await readFile(path.join(process.cwd(), "docs/REFERENCE.md"), "utf8")
  return new Response(configureText(instructions), { headers: { "content-type": "text/markdown; charset=utf-8" } })
}
