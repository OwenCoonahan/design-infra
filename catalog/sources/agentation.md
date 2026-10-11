---
slug: agentation
name: Agentation
url: https://www.agentation.com/
summary: Dev toolbar for visual feedback to coding agents — click UI, annotate, and the agent receives selector + source file + React tree + computed styles via MCP.
type: tool
access: free
license: Free for individuals and internal team use; commercial license needed only to redistribute it inside a product.
stack: [React, Node 20+]
install: pnpm add -D agentation
mcp: claude mcp add agentation -- npx -y agentation-mcp server
vendorable: false
---

# Agentation

**Use it for:** the design-review loop. Instead of describing "the button in the second card
looks off", click it, type the note, and Claude Code picks it up with exact source location.

## Setup (any Next.js app)

```bash
pnpm add -D agentation
claude mcp add agentation -- npx -y agentation-mcp server   # or: npx agentation-mcp init
```

```tsx
// app/layout.tsx — dev only
import { Agentation } from "agentation"
...
{process.env.NODE_ENV === "development" && <Agentation endpoint="http://localhost:4747" />}
```

The MCP server exposes `agentation_get_all_pending`, `agentation_resolve`, `agentation_reply`,
`agentation_watch_annotations`, etc. Ask the agent: *"check Agentation for pending feedback and fix it"*.

## Gotchas

- Desktop browsers only. Never ship it to production (gate on `NODE_ENV`).
- `npx agentation-mcp doctor` if the toolbar can't reach the MCP server (port 4747).
