/** Build-time fingerprint only: never traverse workspace files from a hosted route. */
import { writeFileSync } from "node:fs"
import { starterFingerprint } from "../lib/starter-fingerprint"

writeFileSync("lib/starter.generated.json", JSON.stringify({ fingerprint: starterFingerprint() }, null, 2) + "\n")
console.log("✓ starter source fingerprint generated")
