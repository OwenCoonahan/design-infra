import { readFile } from "node:fs/promises"
import path from "node:path"
import { Markdown } from "@/components/site/markdown"
import { configureText } from "@/lib/config"

export const metadata = { title: "Try it with friends" }

export default async function PilotPage() {
  const text = await readFile(path.join(process.cwd(), "docs/PILOT.md"), "utf8")
  return <div className="mx-auto max-w-3xl px-6 py-12"><Markdown>{configureText(text)}</Markdown></div>
}
