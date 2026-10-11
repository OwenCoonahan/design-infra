---
slug: originui
name: Origin UI (coss.com origin)
url: https://coss.com/origin
summary: ~600 free MIT app-UI components (inputs, selects, data tables, calendars, steppers, trees, navbars, notifications) as numbered shadcn-registry items. Theme-token based, Radix + Tailwind v4. Now a legacy snapshot under coss.com.
type: registry
access: free
license: MIT (apps/origin in cosscom/coss; the rest of that monorepo is AGPL-3.0)
stack: [React, Tailwind v4, Radix UI, react-aria-components (some), shadcn tokens]
install: npx shadcn@latest add https://coss.com/origin/r/comp-<N>.json
vendorable: true
---

# Origin UI → coss.com origin

Origin UI was acquired by coss.com. `originui.com` now **redirects to coss.com/ui** (the new
Base UI–based "coss ui" library, namespace `@coss`, Particles `p-*` items). The original Radix-based
collection lives on at **https://coss.com/origin** as a "legacy snapshot — available, limited
maintenance". This source catalogues the legacy collection; coss ui is a candidate for a separate source.

**Use it for:** real application UI beyond stock shadcn — input variants (password, search+kbd, OTP,
masks), comboboxes and multiselects, range calendars, TanStack data tables, steppers, timelines,
trees, file/avatar upload with cropping, app navbars, notifications, an event calendar.
Everything uses shadcn tokens, so it follows any of our design systems. **Don't use it for:**
marketing flourish (no motion effects) — use Magic UI / Aceternity there.

## Install

```bash
# no namespace — install by URL (find the comp number on the category page)
npx shadcn@latest add https://coss.com/origin/r/comp-485.json
```

Items are named `comp-<N>` and grouped on category pages (`https://coss.com/origin/<category>`).
The catalog titles them `<Category>: <tags>` so `grep -i 'multiselect' catalog/CATALOG.md` works.

## Machine access

- No index on the site (`/origin/r/registry.json` 404s), but item JSON is at `https://coss.com/origin/r/<name>.json`.
- Full index + tags: `https://raw.githubusercontent.com/cosscom/coss/main/apps/origin/registry.json`;
  categories: `apps/origin/config/components.ts`. Synced by `pnpm sync originui` (599 entries).
- Sitemap: `https://coss.com/origin/sitemap.xml` (category pages only).

## Gotchas

- **Origin ships its own primitives.** Items depend on `https://coss.com/origin/r/button.json`,
  `input.json`, `select.json`… which install into `components/ui/` and **collide with your stock
  shadcn files** — the CLI asks before overwriting. They're near-identical shadcn variants; decline
  if you've customised yours, but some comps (`multiselect`, `stepper`, `timeline`, `tree`,
  `cropper`, `calendar-rac`, `datefield-rac`) need Origin-only primitives.
- Some comps use **react-aria-components** (`*-rac` primitives) rather than Radix — mixed a11y models in one app.
- Icons: mostly `lucide-react`, but the event calendar and a few others use `@remixicon/react`.
- Heavy items: event calendar (`comp-542`: dnd-kit + date-fns + 12 primitives), data tables (`@tanstack/react-table`),
  payment dialogs (`react-payment-inputs`).
- Legacy status: no new components; active development moved to coss ui (Base UI).

## Best picks

See ★ entries: `grep '★ .*originui/' catalog/CATALOG.md`. Short list:
`comp-485` (data table), `comp-542` (event calendar), `comp-229` (combobox), `comp-235` (multiselect),
`comp-25` (search + kbd), `comp-23` (password), `comp-333` (command palette), `comp-554` (avatar crop upload),
`comp-508` (range calendar), `comp-583` (app navbar), `comp-565` (tree), `comp-513` (stepper), `comp-530` (timeline).
