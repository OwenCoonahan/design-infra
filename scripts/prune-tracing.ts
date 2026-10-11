/** Turbopack can retain broad traces despite configured excludes. Enforce the private-file boundary after building. */
import { readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

async function prune(directory: string): Promise<number> {
  let removed = 0
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) removed += await prune(file)
    else if (entry.name.endsWith(".nft.json")) {
      const trace = JSON.parse(await readFile(file, "utf8")) as { files: string[] }
      const files = trace.files.filter((item) => !/(?:^|\/)(?:\.context|\.git)(?:\/|$)|\.claude\/worktrees\//.test(item))
      if (files.length !== trace.files.length) {
        removed += trace.files.length - files.length
        await writeFile(file, JSON.stringify({ ...trace, files }))
      }
    }
  }
  return removed
}

prune(".next").then((removed) => console.log(`✓ deployment traces: removed ${removed} private-workspace references`)).catch((error: unknown) => { console.error(error); process.exitCode = 1 })
