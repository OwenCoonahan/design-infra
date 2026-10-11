import assert from "node:assert/strict"
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import test from "node:test"
import ts from "typescript"
import { repairFontLayout } from "../scripts/font-layout"

test("a real CLI font replacement artifact becomes valid TSX without dropping the installed font classes", () => {
  const root = mkdtempSync(path.join(tmpdir(), "font-layout-test-"))
  const file = path.join(root, "app/layout.tsx")
  mkdirSync(path.dirname(file))
  const source = 'export default function Layout() { return <html className={cn(, "font-sans", ibmPlexMono.variable, instrumentSerifHeading.variable, inter.variable)}><body /></html> }'
  const diagnostics = (text: string) => (ts.createSourceFile("layout.tsx", text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX) as ts.SourceFile & { parseDiagnostics: readonly ts.Diagnostic[] }).parseDiagnostics
  try {
    assert.ok(diagnostics(source).length)
    writeFileSync(file, source)
    assert.deepEqual(repairFontLayout(root), ["app/layout.tsx"])
    const fixed = readFileSync(file, "utf8")
    assert.equal(diagnostics(fixed).length, 0)
    assert.ok(["ibmPlexMono.variable", "instrumentSerifHeading.variable", "inter.variable", '"font-sans"'].every((value) => fixed.includes(value)))
    assert.deepEqual(repairFontLayout(root), [])
    assert.equal(readFileSync(file, "utf8"), fixed)
  } finally { rmSync(root, { recursive: true, force: true }) }
})
