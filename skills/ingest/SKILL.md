---
name: ingest
description: Entry point whenever a contributor pastes a link or says he likes something design-related — a component library, a single component/block, a website or app, a Dribbble/Twitter shot, or a design system. Classifies it and routes to the right playbook so it lands in the design-infra catalog with moods, notes and reusable pieces. Use inside the design-infra repo.
---

Read the plugin root `design-infra.config.json` for the deployment URL, repository and installation namespace. Examples below use the default deployment; substitute these settings in a fork. Stable `oc/` catalog IDs are unchanged.

# ingest — anything a contributor pastes

**First check `catalog/SKIPPED.md`** — if the link was already audited and skipped, answer with that reason (and whether
the "revisit if" condition has changed) instead of re-auditing. Add new skips there with a reason.

Design-infra compounds: every link the user shares should leave the repo richer (catalog entries, moods,
favorites, inspiration, `@design-infra` recreations). Classify first, then follow the playbook.

| it's a… | signals | playbook |
|---|---|---|
| **Component library / registry / marketplace** | many components, install docs, npm/shadcn registry | **ingest-library** skill |
| **Single component or block** | a URL to one component page / live preview; "I like this X" | Find it in the catalog (`pnpm lookup "<name>"`) or add it via its library. Add to `catalog/favorites.json` with *what* he likes. If paid/Pro or not theme-aware → build a free, original, theme-aware `@design-infra` recreation (see AGENTS.md "the user says he likes…") and favorite that too |
| **Website / app / landing page** | a product's homepage or app, "love the feel of this site" | **ingest-inspiration** skill |
| **Design system / brand guide / DESIGN.md** | tokens, palettes, type specs | Write `design-systems/<slug>/DESIGN.md` (CONVENTIONS.md + `moods:`), `pnpm generate && pnpm check` |
| **"I don't like X" / passed on an option** | something he rejected, with a reason | Add to `catalog/dislikes.json` (`id` for one entry or `pattern` for a family like "glow"/"parallax", plus `reason`, `added`). Future proposals skip it and say so |
| **Tool / MCP / agent skill** | dev tooling for design work | `catalog/sources/<slug>.md` (type `tool`) + curated entry, like `agentation` |
| **Screenshot / image only** | no URL | Treat as inspiration: create `inspiration/<slug>/` with the image as `public/inspiration/<slug>/hero.webp` and write the README from it |

## Taste issues from other workspaces

Project agents file the shared picks/passes as GitHub issues labelled `taste` (see the refine skill). When asked to
"process taste issues" (or at the start of an ingest session), run:

```bash
gh issue list -R OwenCoonahan/design-infra -l taste -s open --json number,title,body
```

For each: passes with a reason → `catalog/dislikes.json` (`id`, or a `pattern` if the reason is about a family like
"glow"); explicit loves → `catalog/favorites.json`; repeated picks of a non-curated entry → curate it with a note.
`pnpm catalog && pnpm check`, commit, then `gh issue close <n> -c "ingested in <commit>"`.

Always:
- Record **why the contributors like it** in his words (favorites `note`, inspiration `likes`).
- Tag **moods** (1–3 from `lib/catalog/moods.ts`) — this is how future projects find it by feeling.
- Finish with `pnpm generate && pnpm check`, commit, and report: what was added, moods, what it maps to, and
  any `@design-infra` recreation built or proposed.
