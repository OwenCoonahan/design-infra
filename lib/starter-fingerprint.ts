import { createHash } from "node:crypto"
import { readFileSync, readdirSync } from "node:fs"

export function starterFingerprint(root = process.cwd()) {
  const hash = createHash("sha256")
  const registry = JSON.parse(readFileSync(`${root}/registry.json`, "utf8")) as { items: { files?: { path: string }[] }[] }
  const files = new Set(["registry.json", "catalog/starter.json", "lib/utils.ts", "pnpm-lock.yaml"])
  for (const item of registry.items) for (const file of item.files ?? []) files.add(file.path)
  for (const file of readdirSync(`${root}/components/ui`)) if (file.endsWith(".tsx")) files.add(`components/ui/${file}`)
  for (const file of [...files].sort()) hash.update(file).update(readFileSync(`${root}/${file}`))
  return hash.digest("hex")
}
