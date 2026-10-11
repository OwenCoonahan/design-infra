---
slug: librariesdev
name: libraries.dev
url: https://libraries.dev/
summary: '"High-crafted UI libraries for AI agents" — MIT npm packages for agent UIs: thinking-orbs, border-beam, liquid-gooey, voice-glow, bot-avatars, metal-fx, img-fx.'
type: npm
access: free
license: MIT (packages). Pro subscription adds a Studio + agent skills.
stack: [React 18+, canvas 2D, SVG filters, WebGL (img-fx, metal-fx)]
install: pnpm add <package>
vendorable: true
---

# libraries.dev (by Jakub Antalik et al.)

**Use it for:** the "alive" details of AI products — what the agent is doing (orbs), the one
active element (border beam), voice mode (voice glow), agent identity (bot avatars), premium
CTAs (metal). Each is a zero-dependency npm package with a small React API.

| package | what | notes |
|---|---|---|
| `thinking-orbs` | 9 dotted-orb states for agent activity, sizes 64/32/20 | wrapped by `@oc/agent-status`; also `thinking-orbs-native`, SwiftUI |
| `border-beam` | traveling / breathing glow around any element | wrapped by `@oc/beam-card`; `theme` defaults to `dark` |
| `liquid-gooey` | Morph / Move / Melt / Bend gooey effects | SVG filters, Safari-safe |
| `voice-glow` | sound-reactive bottom glow | feed it mic intensity |
| `bot-avatars` | 18 animated bot avatars, idle/working/sleeping | canvas 2D |
| `metal-fx` | liquid-metal rings, buttons, text, badges | Paper Shaders engine |
| `img-fx` | WebGL image-generation loader | peer dep `three` |

Source: https://github.com/Jakubantalik/Libraries.dev (monorepo, `packages/*`).

## Gotchas

- `thinking-orbs` `theme="auto"` reads `.dark` / `data-theme` on ancestors — works with shadcn out of the box.
- `border-beam` does **not** auto-detect theme unless `theme="auto"` (system preference only).
- WebGL packages (`img-fx`, `metal-fx`): client-only, one or two per page.
