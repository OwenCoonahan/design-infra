---
slug: kitbitz
name: Kitbitz
url: https://kitbitz.art/
summary: 2,043 free hand-drawn illustrations (SVG + PNG) in 13 themed kits (city, space, nature, cyberpunk, interior…), CC0, with a free read-only MCP server for search and download URLs, Figma kits and a Figma plugin.
type: reference
access: free
license: 'Illustrations: CC0 1.0 Universal — free to use, edit and remix, commercially, no attribution required. "The illustrations are CC0; the website, Figma plugin and MCP server source are not."'
stack: [SVG, PNG, Figma]
install: 'MCP (HTTP): https://mcp.kitbitz.art — or download SVG/PNG from kitbitz.art'
mcp: https://mcp.kitbitz.art
llms: https://kitbitz.art/llms.txt
vendorable: true
---

# Kitbitz

**Use it for:** illustration for empty states, onboarding, 404s, feature sections and marketing spots when a product
needs warmth or play and has no illustrator — consistent hand-drawn kits, so a whole app can share one style.
**Don't use it for:** icons (use lucide) or brand illustration that has to be ownable/unique (CC0 means anyone can
use the same art).

No catalog rows — the catalog has no asset kind yet; agents reach it through the MCP (toolchain tier 3).

## MCP tools (verified: `initialize` → serverInfo `kitbitz` 1.0.0; `search_illustrations` reports 2,043 assets)

| tool | does |
|---|---|
| `search_illustrations` | search the catalog (filters, pagination, optional variety) → name, kit, colours, preview + detail URLs, SVG/PNG resources |
| `get_illustration` | full public metadata + resource links for one asset id |
| `find_related_illustrations` | same kit, function or palette (analogous / complementary) |
| `curate_scene` | a coherent set from a creative brief and object roles |
| `prepare_asset_pack` | read-only download manifest with safe filenames (writes nothing) |

```bash
claude mcp add --transport http kitbitz https://mcp.kitbitz.art     # or via the toolchain (--tier 3)
```

## Gotchas

- Read-only server: it returns URLs (`https://assets.kitbitz.art/kits/<kit>/<name>.svg`); the agent downloads the
  chosen SVGs into the project (`public/illustrations/`) — don't hotlink.
- Illustrations are full-colour per kit, not theme-aware; pick kits whose palette suits the design system, or recolour
  SVG fills to tokens.
- Machine-readable catalog: `https://kitbitz.art/catalog.v1.json`.
