# Category taxonomy

Every catalog entry has 1–4 categories from this list (source of truth: `lib/catalog/schema.ts`).
Names follow [component.gallery](https://component.gallery/) where one exists. `pnpm sync`
maps upstream categories/names onto these automatically (`scripts/sync-sources.ts` → `NAME_RULES`).

| group | categories | reach for… |
|---|---|---|
| Page sections | `hero` `navigation` `features` `bento` `pricing` `cta` `testimonials` `logo-cloud` `faq` `footer` `blog` `contact` `auth` `team` `stats` `empty-state` | assembling a marketing page or app screen section by section |
| Components | `card` `button` `input` `form` `tabs` `modal` `tooltip` `sidebar` `carousel` `image` `table` `dashboard` `chart` `code` `map` `badge` `accordion` `toast` | a specific UI piece (for plain app UI, prefer stock shadcn/ui first) |
| Effects & motion | `background` `text-effect` `scroll-effect` `cursor` `loader` `transition` `3d` `illustration` | visual polish and delight |
| AI / agent UI | `ai-chat` `agent-ui` | chat, reasoning traces, tool calls, approvals, agent status |
| Foundations | `theme` `dev-tool` `misc` | design systems, Agentation/MCPs, uncategorised |

## Picking order (what `find-component` does)

1. **Stock shadcn/ui** for plain app primitives (button, dialog, select, table, form…), and the official
   `shadcn/*` blocks for app screens (dashboard, sidebar, login, charts). Always themed.
2. **`@oc/*`** — ours, theme-aware, curated.
3. **★ curated** third-party picks (`grep '★' catalog/CATALOG.md`) — ◐ theme-aware ones (Origin UI, Kibo UI,
   Motion Primitives, parts of Magic UI) before hard-coded-colour sources (Aceternity, React Bits).
4. Everything else in `catalog/index.json` with `access: free`.
5. `key`/`metered` sources (21st.dev, OriginKit) — fine, but say so.
6. `paid` — only as an "upgrade" suggestion, never installed by default.
