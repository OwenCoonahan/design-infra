import assert from "node:assert/strict"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"

async function check(directory: string): Promise<number> {
  let count = 0
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) count += await check(file)
    else if (entry.name.endsWith(".nft.json")) {
      const trace = JSON.parse(await readFile(file, "utf8")) as { files: string[] }
      const privateFiles = trace.files.filter((item) => /(?:^|\/)(?:\.context|\.git)(?:\/|$)|\.claude\/worktrees\//.test(item))
      assert.equal(privateFiles.length, 0, `Private workspace files must not enter deployment traces: ${file}; first match: ${privateFiles[0]}`)
      count++
    }
  }
  return count
}

check(".next/server").then((count) => console.log(`✓ ${count} deployment traces exclude private workspace files`)).catch((error: unknown) => { console.error(error); process.exitCode = 1 })
