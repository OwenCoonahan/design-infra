---
slug: kage
name: Kage
url: https://kage.design/
summary: Free reference library of 372 analysed real product designs and 1,978 extracted components (heroes, pricing tables, navs, footers…) from 207 products, each with a ready-to-paste prompt — searchable through a free, keyless MCP server.
type: reference
access: free
license: 'Terms: "The prompts and design analyses Kage generates are provided free for you to use, adapt and build from, commercially or otherwise, with no attribution required." Screenshots, logos and trademarks belong to their owners (shown for commentary and inspiration only). "Do not scrape, mirror or bulk download the library."'
stack: []
install: 'MCP (HTTP): https://kage.design/mcp — no key'
mcp: https://kage.design/mcp
vendorable: false
---

# Kage (by Chris Gregori)

**Use it for:** design references *beyond* this catalog — "how do fintech pricing pages look", "a site like Linear
for a dental clinic", "dark developer-tool heroes". It complements `inspiration/` (Owen's own saved sites) and
`plan_ui`: Kage shows how real products solved a section; design-infra decides what to build and installs it.
**Don't use it for:** code (there is none — prompts and screenshots only) or copying a product's look wholesale.

## MCP tools (verified: `initialize` → serverInfo `kage` 1.0.0, protocol 2025-06-18)

| tool | does |
|---|---|
| `search_designs` | free-text and/or taxonomy search over the screenshots (product, page type, style, industry, colour) |
| `design_brief` | builds a design brief for a request by finding the closest published designs |
| `get_design` | one design by slug: prompt, taxonomy, every extracted component, the screenshot |
| `get_component` | one extracted component (hero, pricing table…) with its prompt and cropped image |
| `list_taxonomy` | the fixed vocabulary: page types, visual styles, industries, colours, stacks, component kinds |

```bash
claude mcp add --transport http kage https://kage.design/mcp     # or via the toolchain (tier 2)
```

## Gotchas

- **Never bulk-download** — no loops over `get_design` to mirror the library; the terms forbid scraping and Kage
  blocks offenders. Fetch the handful of designs you need.
- Screenshots are other companies' work: use them for patterns and feel, then build with our design system and
  catalog — don't reproduce logos, copy or distinctive brand assets.
- Analyses and prompts are AI-generated and can be wrong or stale.
