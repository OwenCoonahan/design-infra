---
slug: shadcn
name: shadcn/ui blocks
url: https://ui.shadcn.com/blocks
summary: 97 official free MIT blocks — dashboard-01, 16 sidebar app shells, 5 login + 5 signup pages, and 70 Recharts chart variants (area, bar, line, pie, radar, radial, tooltip). Pure shadcn tokens.
type: registry
access: free
license: MIT (shadcn-ui/ui)
stack: [React, Next.js App Router, Tailwind v4, Radix UI, Recharts]
install: npx shadcn@latest add <block-name>
llms: https://ui.shadcn.com/llms.txt
vendorable: true
---

# shadcn/ui blocks

**Use it for:** the default *app* scaffolding — dashboard layout, sidebar shells, auth pages, and
charts. They're built only from stock shadcn components and tokens, so they look right under every
design system with zero adaptation. This is the first place to look for app screens; reach for
Aceternity/Magic UI only for marketing pages. (Stock shadcn *components* — button, dialog, form… —
are not catalogued; use `npx shadcn@latest add <component>` directly.)

## Install

```bash
# default registry — no namespace or config needed; the style comes from components.json
npx shadcn@latest add dashboard-01
npx shadcn@latest add sidebar-07 login-03 chart-area-interactive
```

## Machine access

- Blocks index: `https://ui.shadcn.com/r/styles/new-york-v4/registry.json` (filter `type === "registry:block"`; also has
  `categories`). `https://ui.shadcn.com/r/index.json` lists only the 63 UI components.
- Docs/previews: `https://ui.shadcn.com/blocks/<sidebar|login|signup|dashboard>#<name>`, `https://ui.shadcn.com/charts/<type>#<name>`;
  screenshots at `https://ui.shadcn.com/r/styles/new-york/<name>-light.png` (non-chart blocks; not all exist).
- shadcn MCP server: `npx shadcn@latest mcp`.
- Synced into `catalog/generated/shadcn.json` by `pnpm sync shadcn`.

## Gotchas

- **Blocks write routes.** `dashboard-01` and every `sidebar-NN` write `app/dashboard/page.tsx`; login/signup
  write `app/login/page.tsx` / `app/signup/page.tsx` — Next.js App Router assumed. Move them if your routes differ.
- **Shared filenames.** Most sidebar blocks (and `dashboard-01`) write `components/app-sidebar.tsx`, `nav-main.tsx`, `nav-user.tsx`…
  Installing a second sidebar block overwrites the first — pick one shell.
- `dashboard-01` pulls `@tabler/icons-react`, dnd-kit, `@tanstack/react-table`, `zod` and ~19 shadcn components, plus a `data.json` fixture.
- Login/signup blocks import `cn` from the new **`cn` npm package** (shadcn-ui/cn) rather than `@/lib/utils`.
- Charts read `--chart-1…5`; every design system here defines them. Check contrast of the chart palette in dark mode.
- Only the `new-york-v4` style has charts; the `base-nova` (Base UI) style currently ships dashboard/sidebar/login/signup but no chart blocks.

## Best picks

See ★ entries: `grep '★ .*shadcn/' catalog/CATALOG.md`. Short list:
`dashboard-01`, `sidebar-07`, `sidebar-08`, `sidebar-16`, `sidebar-15`, `login-03`, `login-04`, `login-02`, `signup-05`,
`chart-area-interactive`, `chart-bar-interactive`, `chart-pie-donut-text`, `chart-radar-dots`.
