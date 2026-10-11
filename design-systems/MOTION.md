# Motion languages

A project adopts **one** motion language. It sets how long things take, how they ease, and which playbook
directions (`catalog/playbooks/*.md`) are allowed. A design system declares its default in DESIGN.md front matter
(`motion: quiet`) and its `## Motion` section links here (`design-systems/MOTION.md#quiet`) and lists only the
project's overrides.

There are four languages, from least to most motion: [still](#still), [quiet](#quiet), [lively](#lively) and
[cinematic](#cinematic).

## Rules for every language

- **Interaction feedback is always fast.** Press, hover, focus, toggles, menus and tooltips stay within 100–200ms
  in *every* language — cinematic pages get slow scroll scenes, not slow buttons.
- **Exits are faster than entrances** (about 75% of the entrance duration) and use an accelerating ease.
- **Animate `transform` and `opacity`.** Never animate layout properties (width, height, top, margin) except
  through a layout/FLIP helper. Don't animate `filter: blur` on large surfaces.
- **Motion explains change.** Animate state changes (enter, exit, move, complete), not resting UI. Loops are for
  "something is in progress", and only while it is.
- **`prefers-reduced-motion: reduce` collapses every language to `still`:** opacity-only fades of 150ms or less,
  no travel, scale, parallax, scroll-scrubbing, autoplay or loops. Content is visible immediately.

Tokens to expose in CSS (values per language below):

```css
:root {
  --motion-fast: 120ms;   /* press, hover, focus, toggles */
  --motion-base: 180ms;   /* menus, popovers, dialogs, toasts, tab swaps */
  --motion-slow: 240ms;   /* panels, sheets, section reveals */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);       /* entrances */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);            /* exits */
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);    /* moves/resizes on screen */
}
@media (prefers-reduced-motion: reduce) {
  :root { --motion-fast: 0ms; --motion-base: 120ms; --motion-slow: 150ms; }
}
```

## Using the tokens

Installing `@oc/theme-<slug>` ships the system's language as CSS variables — `--motion-fast`, `--motion-base`,
`--motion-slow`, `--motion-ease-{out,in,in-out}` (collapsed under `prefers-reduced-motion`) — plus Tailwind
utilities `ease-motion-out` / `ease-motion-in` / `ease-motion-in-out`:

```tsx
<button className="transition-transform duration-(--motion-fast) ease-motion-out active:scale-97">
```

For Motion (`motion/react`) code, `npx shadcn add @oc/motion-presets` → `lib/motion-presets.ts` (generated from
`lib/catalog/motion.ts`, the source of truth for the values below):

```tsx
const m = motionPreset() // PROJECT_MOTION = DESIGN.md `motion:`
<motion.li variants={m.variants.fadeUp} />            // inside <motion.ul variants={m.variants.stagger} initial="hidden" whileInView="show">
<motion.button whileTap={m.press} transition={m.transition.fast} />
<AnimatePresence>{open && <motion.div variants={m.variants.scaleIn} initial="hidden" animate="show" exit="exit" />}</AnimatePresence>
```

## still

Almost no motion. Things change state instantly or with a short fade; nothing travels, bounces or loops. The
interface feels like print.

| token | value |
|---|---|
| fast / base / slow | 0–100ms / 150ms / 200ms (content fade-ins may reach 300ms) |
| ease-out | `cubic-bezier(0.2, 0, 0, 1)` |
| ease-in | `cubic-bezier(0.4, 0, 1, 1)` |
| ease-in-out | `linear` for opacity; `cubic-bezier(0.4, 0, 0.2, 1)` otherwise |
| spring | none. If a library needs one: `{ type: "spring", bounce: 0, visualDuration: 0.15 }` |
| travel | 0px (opacity only); scale none |
| stagger | none |

**Playbook directions allowed:** no intensity, or `subtle` directions that are state feedback only — press,
focus, loading → success, skeleton reveal, error, toast fade, scroll progress. No entrances that travel, no
hover effects beyond colour, no loops except a loader while loading.

**Typical picks:** `transitions/skeleton-reveal`, `transitions/success-check`, `transitions/text-states-swap`,
`transitions/error-state-shake` (reduced to a colour change), `motion-primitives/scroll-progress`, a single
`transitions/texts-reveal` fade for the hero.

**Default for:** `editorial`. Moods: editorial, minimal, calm (content-first), trustworthy (health, legal,
finance back-office).

## quiet

Fast, precise, ease-out. Elements fade and move a few pixels; indicators slide; nothing overshoots. Motion is
felt rather than seen — the Linear/Vercel/Stripe register.

| token | value |
|---|---|
| fast / base / slow | 120ms / 180ms / 240ms |
| ease-out | `cubic-bezier(0.23, 1, 0.32, 1)` (ease-out-quint) |
| ease-in | `cubic-bezier(0.4, 0, 1, 1)` |
| ease-in-out | `cubic-bezier(0.65, 0, 0.35, 1)` |
| spring | `{ type: "spring", bounce: 0, visualDuration: 0.2 }` ≈ stiffness 500, damping 45, mass 1 (critically damped) |
| travel | 4–8px; scale 0.96–1 for dialogs/popovers, 0.97 for press |
| stagger | 30ms, max 6 items |

**Playbook directions allowed:** `subtle` — press-and-hover, loading-success, sliding indicators, native dialog
timing, Sonner tuning, rolling digits, fade-up on view, staggered lists, shimmer labels, quiet patterns.
`medium` only for a single marketing hero moment (one spotlight, one border beam), never in app chrome.

**Typical picks:** `transitions/tabs-sliding`, `motion-primitives/animated-background`, `transitions/modal`,
`transitions/toast`, `transitions/number-pop-in`, `motion-primitives/in-view`, `magicui/blur-fade`,
`oc/agent-status`.

**Default for:** `linear-dark` (120–160ms, opacity and small translate) and `brutalist-mono` — which overrides
the easing to `linear` or `steps(2–4)` and travel to 0, so state changes snap (press = translate into the hard
shadow). Moods: refined, technical, minimal, trustworthy, bold, retro (with steps easing).

## lively

Springy and warm. Things arrive with a gentle overshoot, lists cascade, toggles feel physical. Motion is part of
the personality, but it still finishes quickly.

| token | value |
|---|---|
| fast / base / slow | 160ms / 280ms / 400ms |
| ease-out | `cubic-bezier(0.34, 1.56, 0.64, 1)` (back-out, ~10% overshoot) for entrances; `cubic-bezier(0.22, 1, 0.36, 1)` for things that must not overshoot (text, panels) |
| ease-in | `cubic-bezier(0.5, 0, 0.75, 0)` |
| ease-in-out | `cubic-bezier(0.65, 0, 0.35, 1)` |
| spring | `{ type: "spring", bounce: 0.25, visualDuration: 0.35 }` ≈ stiffness 260, damping 22, mass 1. Small controls (switch thumbs, pills): stiffness 500, damping 30 |
| travel | 8–16px; scale 0.9–1 for popovers and toasts |
| stagger | 40–60ms, max 8 items |

**Playbook directions allowed:** `subtle` and `medium` — everything in quiet, plus morph-from-trigger dialogs,
multi-view drawers, segmented springs, micro-celebrations, magnetic CTAs, cursor spotlights, tilt cards,
rotating keywords, word-by-word headlines, live feeds, stack/deck carousels. `expressive` directions are out
(one exception: a confetti "all done" moment).

**Typical picks:** `motion-primitives/morphing-dialog`, `cult-ui/family-drawer`, `cult-ui/halo-segmented`,
`transitions/like-button`, `transitions/toggle`, `motion-primitives/text-effect`, `magicui/animated-list`,
`librariesdev/thinking-orbs`.

**Default for:** `soft-glass` (200–400ms, gentle overshoot). Moods: warm, playful, organic, calm (consumer),
futuristic (in product UI).

## cinematic

Choreographed. Scroll drives scenes, long eases glide, shaders and 3D carry atmosphere. Reserved for marketing,
launches and art-directed pages — product UI inside a cinematic site still uses [quiet](#quiet) or
[lively](#lively) for its controls.

| token | value |
|---|---|
| fast / base / slow | 200ms / 600ms / 1200ms (scroll-scrubbed scenes are tied to scroll, not time) |
| ease-out | `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) |
| ease-in | `cubic-bezier(0.7, 0, 0.84, 0)` |
| ease-in-out | `cubic-bezier(0.83, 0, 0.17, 1)` (ease-in-out-quint) |
| spring | `{ type: "spring", bounce: 0.15, visualDuration: 0.8 }` ≈ stiffness 100, damping 20, mass 1. Scroll smoothing: `useSpring(scrollYProgress, { stiffness: 100, damping: 30 })` |
| travel | 24–80px, parallax depth 0.1–0.4×; scale 0.85–1 for product reveals |
| stagger | 60–120ms per line or word |

**Playbook directions allowed:** all intensities — `subtle`, `medium` and `expressive`: sticky walkthroughs,
scroll-linked product reveals, scroll stacks, text scrubbing, parallax, shader backgrounds, kinetic type, 3D
carousels, WebGL galleries. Budget: **one expressive scene per viewport**, one WebGL context at a time.

**Typical picks:** `oc/feature-levels`, `aceternity/container-scroll-animation`, `react-bits/scroll-stack`,
`react-bits/scroll-reveal`, `react-bits/split-text`, `react-bits/grainient`, `aceternity/hero-parallax`.

**Default for:** no shipped design system — opt in per project (typically a launch page on top of `linear-dark`
or `soft-glass`). Moods: premium, futuristic, experimental (and organic for photo-led brands).

## Choosing

| design system | default | notes |
|---|---|---|
| `editorial` | [still](#still) | fades and gentle 300ms reveals only; never bounce or glow |
| `linear-dark` | [quiet](#quiet) | 120–160ms, opacity + small translate; a spotlight/beam only on marketing heroes |
| `brutalist-mono` | [quiet](#quiet) | `linear`/`steps()` easing, no travel, instant state changes |
| `soft-glass` | [lively](#lively) | springy 200–400ms, orbs/shimmer for AI moments |

| mood | language |
|---|---|
| calm, minimal, editorial | still or quiet |
| refined, technical, trustworthy | quiet |
| bold, retro | quiet with `steps()` easing |
| warm, playful, organic | lively |
| premium, futuristic, experimental | cinematic on marketing pages, quiet/lively in product UI |

When a direction in a playbook is above the project's language (e.g. an `expressive` pick in a quiet project),
offer it only if the user asks for something louder, and say it breaks the motion language.
