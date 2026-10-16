---
slug: beui
name: beUI (free)
url: https://beui.dev/
summary: Free animated controls, charts and AI interfaces, with independently installable variants in a public shadcn registry.
type: registry
access: free
license: MIT — Copyright (c) 2026 Saurabh Chauhan; retain the upstream notice when copying source.
stack: [React 19, Next.js, Tailwind v4, Motion]
install: npx shadcn@latest add @beui/<name>
namespace: "@beui"
mcp: https://mcp.beui.dev/mcp
llms: https://beui.dev/llms.txt
vendorable: true
---

# beUI — free library

**Use it for:** tactile controls, loading states, animated text, charts, search, upload flows and agent/chat surfaces. Moods: refined and playful. This is Saurabh Chauhan's beUI, separate from Shane Levine's Beautiful UI (`beautifui`).

The current pilot uses free libraries. The maintainer intends to purchase paid libraries later; that is future intent, not current access. beUI's public MIT collection works independently of [beUI Pro](https://pro.beui.dev/). Pro is recorded separately as `beui-pro` and remains opt-in.

## Install

Merge the public registry into the consuming project's existing configuration:

```json
{ "registries": { "@beui": "https://beui.dev/r/{name}.json" } }
```

```bash
npx shadcn@latest add @beui/loader
npx shadcn@latest add @beui/button-stateful
```

Use the exact catalog name. A documentation group may contain several registry items: the Button page includes `button-base`, `button-stateful`, `button-magnetic` and `button-metallic`; `@beui/button` is not the shadcn item in the checked index. Preserve existing aliases and files; review generated imports before replacing existing primitives.

## Machine access

- Public registry metadata: https://beui.dev/r/registry.json
- Documentation groups and exact page URLs: https://beui.dev/r
- Agent guide: https://beui.dev/docs/ai-agents
- Discovery: https://beui.dev/llms.txt
- Optional public MCP: https://mcp.beui.dev/mcp (documented by the vendor; not connected automatically).
- `pnpm sync beui` joins both public indexes and retains stable `beui/<registry-name>` IDs. Only metadata is saved; file bodies are discarded. Unmapped documentation groups fail sync for review instead of creating guessed links.

## Gotchas

- Targets React 19 and Tailwind 4; check compatibility rather than upgrading a project just to install a component.
- Uses shadcn semantic tokens plus additional surface/motion tokens. Inspect [theme setup](https://beui.dev/docs/theme) and map missing extensions to the project's brand; do not replace an established palette with the vendor theme.
- Charts and complex controls bring their listed dependencies. Voice, data, file upload and approval examples still need your application logic.
- `voice-orb` visualizes speech; it is not a waiting indicator. Reading-progress and scroll helpers stay under scroll effects. Genuine loader and agent waiting states are discoverable under Loading.
- Public documentation links are external demos, not locally hosted interactive adapters. Grid captures are static previews; Live view does not turn them into playable components.
- React Native has a separate vendor registry and stack; this source indexes the web registry only.

## Starting picks

`loader`, `button-stateful`, `button-magnetic`, `thinking-shimmer`, `sortable-stack`, `morphing-lightbox`, `notification-stack`, `table-async`, `morphing-search`, `feedback-widget`. See their curated notes for fit and integration limits.

[Upstream MIT license](https://github.com/starc007/ui-components/blob/main/LICENSE). Public metadata, documentation URLs and access split checked 2026-10-16. Authenticated Pro installation is outside this free-library check.

On 2026-10-16, `@beui/loader` and `@beui/button-stateful` were installed through the public registry into a fresh Next.js 16.3.8 / React 19 / Tailwind 4 scratch app and compiled in its production build. This is an automated integration check for those two items, not verification of the entire library or an independent friend trial. The Loader thumbnail is a static capture of its public demo collection; other variants retain source links until their exact preview stages are mapped.
