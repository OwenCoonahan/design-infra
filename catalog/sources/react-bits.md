---
slug: react-bits
name: React Bits
url: https://reactbits.dev/
summary: 213 free creative components — text animations, WebGL/shader backgrounds, cursor and hover effects, playful UI and micro-interactions — each in JS/TS × CSS/Tailwind variants. GSAP, motion, ogl, three.js.
type: registry
access: free
license: "MIT + Commons Clause: free to use in commercial apps/sites, but you may not sell or redistribute the components themselves (alone, bundled, or ported). React Bits Pro is a separate paid product."
stack: [React, Tailwind v4 or plain CSS, GSAP, motion, ogl, three.js]
install: npx shadcn@latest add @react-bits/<Name>-TS-TW
namespace: "@react-bits"
llms: https://reactbits.dev/llms.txt
vendorable: false
---

# React Bits (by David Haz)

**Use it for:** memorable, expressive moments — headline text effects (split/blur/decrypt/rotate/
type), shader backgrounds (Aurora, Silk, Threads, Plasma, Beams…), cursor effects, playful cards
and galleries, and the newer "Micro" interactions (switches, hold buttons, dials). Portfolios,
launches, creative/consumer brands. **Don't use it for:** sober product UI — most pieces bring their own
dark palette and heavy runtime deps.

## Install

```bash
# @react-bits is in shadcn's built-in registry directory. Names are PascalCase + variant suffix:
#   <Component>-<JS|TS>-<CSS|TW>   → for our stack always use -TS-TW
npx shadcn@latest add @react-bits/SplitText-TS-TW
npx jsrepo@latest add https://reactbits.dev/r/SplitText-TS-TW     # jsrepo alternative
```

The catalog id is kebab-case (`react-bits/split-text`); the `install` field has the exact CLI name.

## Machine access

- Registry index: `https://reactbits.dev/r/registry.json` (852 items = 213 components × 4 variants; title, description, deps)
- `llms.txt`: section (Text Animations / Animations / Components / Micro / Backgrounds), docs URL and CLI name per component
- Synced into `catalog/generated/react-bits.json` by `pnpm sync react-bits` (TS-TW variant only).
- Pro catalogue (paid, not synced): `https://www.reactbits.dev/pro-manifest.json`.

## Gotchas

- **Licence is not plain MIT** (Commons Clause) — fine to use in Owen's apps, **never vendor into `@oc`**.
- **Not theme-aware.** Colours are hex props with React Bits' purple defaults (`#5227FF`, `#B497CF`,
  `#120F17`) or hard-coded `text-white`/`bg-black`. Text effects (SplitText, BlurText, RotatingText,
  TextType, DecryptedText, CountUp, ScrollReveal) are the exception — they inherit colour.
- **Heavy deps:** `ogl` (52 items), `gsap` (36, incl. SplitText/ScrollTrigger/InertiaPlugin), `three` +
  `@react-three/fiber`/`drei`/`postprocessing`, `matter-js`, `lenis`. Check `dependencies` before picking;
  WebGL backgrounds: one per page, lazy-load, provide a static fallback.
- Some components assume other stacks: `PillNav` imports `react-router-dom` (swap for `next/link`),
  a few use `@hugeicons/react` or `react-icons`.
- Names are case-sensitive: `@react-bits/splittext-ts-tw` returns the site's HTML (HTTP 200, not JSON),
  so the CLI fails with a confusing parse error. Copy the exact `install` command.

## Best picks

See ★ entries: `grep '★ .*react-bits/' catalog/CATALOG.md`. Short list:
`split-text`, `blur-text`, `rotating-text`, `text-type`, `decrypted-text`, `count-up`, `scroll-reveal`,
`shiny-text`, `gradient-text`, `aurora`, `dot-grid`, `beams`, `logo-loop`, `magic-bento`.
