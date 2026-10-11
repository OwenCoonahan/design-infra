import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

/** Repair a known CLI artifact after replacing an existing next/font declaration. */
export function repairFontLayout(root: string) {
  const repaired: string[] = []
  for (const name of ["app/layout.tsx", "src/app/layout.tsx"]) {
    const file = path.join(root, name)
    if (!existsSync(file)) continue
    const current = readFileSync(file, "utf8")
    const next = current.replace(/(className\s*=\s*\{\s*cn\()\s*,\s*/g, "$1")
    if (next !== current) { writeFileSync(file, next); repaired.push(name) }
  }
  return repaired
}
