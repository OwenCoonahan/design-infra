---
version: alpha
name: Soft Glass
moods: [warm, calm, playful]
motion: lively
description: Friendly, luminous AI/consumer product system — soft blue-violet gradients, translucent frosted cards and generous rounded shapes. Best for AI assistants, consumer apps, onboarding flows and approachable product marketing.
colors:
  background: "#F7F7FC"
  foreground: "#16162A"
  card: "#FFFFFF"
  card-foreground: "#16162A"
  popover: "#FFFFFF"
  popover-foreground: "#16162A"
  primary: "#5B5FE3"
  primary-foreground: "#FFFFFF"
  secondary: "#EEEEFB"
  secondary-foreground: "#2A2A5C"
  muted: "#F0F0F7"
  muted-foreground: "#5F6178"
  accent: "#ECEBFF"
  accent-foreground: "#2E2A8C"
  destructive: "#CF2A45"
  border: "#E4E4F0"
  input: "#DCDCEB"
  ring: "#8B8FF5"
  chart-1: "#5B5FE3"
  chart-2: "#8B5CF6"
  chart-3: "#38BDF8"
  chart-4: "#F472B6"
  chart-5: "#34D399"
  sidebar: "#F2F2FA"
  sidebar-foreground: "#16162A"
  sidebar-primary: "#5B5FE3"
  sidebar-primary-foreground: "#FFFFFF"
  sidebar-accent: "#E8E8FA"
  sidebar-accent-foreground: "#2E2A8C"
  sidebar-border: "#E4E4F0"
  sidebar-ring: "#8B8FF5"
  gradient-from: "#C7D2FE"
  gradient-via: "#E9D5FF"
  gradient-to: "#BAE6FD"
  dark-background: "#0E0E1A"
  dark-foreground: "#ECECF7"
  dark-card: "#171728"
  dark-card-foreground: "#ECECF7"
  dark-popover: "#1B1B2E"
  dark-popover-foreground: "#ECECF7"
  dark-primary: "#8E92FF"
  dark-primary-foreground: "#0E0E1A"
  dark-secondary: "#232338"
  dark-secondary-foreground: "#E0E0F2"
  dark-muted: "#1C1C2E"
  dark-muted-foreground: "#A0A2BD"
  dark-accent: "#26264A"
  dark-accent-foreground: "#E6E5FF"
  dark-destructive: "#FF6B81"
  dark-border: "#FFFFFF1A"
  dark-input: "#FFFFFF24"
  dark-ring: "#8E92FF"
  dark-chart-1: "#8E92FF"
  dark-chart-2: "#A78BFA"
  dark-chart-3: "#7DD3FC"
  dark-chart-4: "#F9A8D4"
  dark-chart-5: "#6EE7B7"
  dark-sidebar: "#0B0B16"
  dark-sidebar-foreground: "#DCDCEE"
  dark-sidebar-primary: "#8E92FF"
  dark-sidebar-primary-foreground: "#0E0E1A"
  dark-sidebar-accent: "#1F1F36"
  dark-sidebar-accent-foreground: "#E6E5FF"
  dark-sidebar-border: "#FFFFFF14"
  dark-sidebar-ring: "#8E92FF"
  dark-gradient-from: "#312E81"
  dark-gradient-via: "#4C1D95"
  dark-gradient-to: "#0C4A6E"
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.005em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.01em
  mono:
    fontFamily: Geist Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
rounded:
  none: 0px
  sm: 10px
  md: 12px
  lg: 16px
  xl: 22px
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
  card-padding: 24px
  max-width: 1200px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 44px
    padding: 20px
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 44px
    padding: 20px
  button-ghost:
    backgroundColor: "{colors.background}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 40px
  button-destructive:
    backgroundColor: "{colors.background}"
    textColor: "{colors.destructive}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 44px
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.xl}"
    padding: 24px
  popover:
    backgroundColor: "{colors.popover}"
    textColor: "{colors.popover-foreground}"
    rounded: "{rounded.lg}"
    padding: 6px
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    height: 44px
    padding: 14px
  input-border:
    backgroundColor: "{colors.input}"
    width: 1px
  divider:
    backgroundColor: "{colors.border}"
    height: 1px
  focus-ring:
    backgroundColor: "{colors.ring}"
    width: 3px
  badge:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    height: 24px
    padding: 10px
  chip-muted:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    height: 28px
  hero-gradient-from:
    backgroundColor: "{colors.gradient-from}"
  hero-gradient-via:
    backgroundColor: "{colors.gradient-via}"
  hero-gradient-to:
    backgroundColor: "{colors.gradient-to}"
  sidebar:
    backgroundColor: "{colors.sidebar}"
    textColor: "{colors.sidebar-foreground}"
  sidebar-item-active:
    backgroundColor: "{colors.sidebar-accent}"
    textColor: "{colors.sidebar-accent-foreground}"
    rounded: "{rounded.md}"
  sidebar-item-primary:
    backgroundColor: "{colors.sidebar-primary}"
    textColor: "{colors.sidebar-primary-foreground}"
    rounded: "{rounded.md}"
  sidebar-divider:
    backgroundColor: "{colors.sidebar-border}"
    height: 1px
  sidebar-focus-ring:
    backgroundColor: "{colors.sidebar-ring}"
    width: 3px
  chart-series-1:
    backgroundColor: "{colors.chart-1}"
  chart-series-2:
    backgroundColor: "{colors.chart-2}"
  chart-series-3:
    backgroundColor: "{colors.chart-3}"
  chart-series-4:
    backgroundColor: "{colors.chart-4}"
  chart-series-5:
    backgroundColor: "{colors.chart-5}"
  page-dark:
    backgroundColor: "{colors.dark-background}"
    textColor: "{colors.dark-foreground}"
  button-primary-dark:
    backgroundColor: "{colors.dark-primary}"
    textColor: "{colors.dark-primary-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
  button-secondary-dark:
    backgroundColor: "{colors.dark-secondary}"
    textColor: "{colors.dark-secondary-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
  button-destructive-dark:
    backgroundColor: "{colors.dark-background}"
    textColor: "{colors.dark-destructive}"
  card-dark:
    backgroundColor: "{colors.dark-card}"
    textColor: "{colors.dark-card-foreground}"
    rounded: "{rounded.xl}"
  popover-dark:
    backgroundColor: "{colors.dark-popover}"
    textColor: "{colors.dark-popover-foreground}"
  chip-muted-dark:
    backgroundColor: "{colors.dark-muted}"
    textColor: "{colors.dark-muted-foreground}"
  badge-dark:
    backgroundColor: "{colors.dark-accent}"
    textColor: "{colors.dark-accent-foreground}"
  input-border-dark:
    backgroundColor: "{colors.dark-input}"
    width: 1px
  divider-dark:
    backgroundColor: "{colors.dark-border}"
    height: 1px
  focus-ring-dark:
    backgroundColor: "{colors.dark-ring}"
    width: 3px
  hero-gradient-from-dark:
    backgroundColor: "{colors.dark-gradient-from}"
  hero-gradient-via-dark:
    backgroundColor: "{colors.dark-gradient-via}"
  hero-gradient-to-dark:
    backgroundColor: "{colors.dark-gradient-to}"
  sidebar-dark:
    backgroundColor: "{colors.dark-sidebar}"
    textColor: "{colors.dark-sidebar-foreground}"
  sidebar-item-active-dark:
    backgroundColor: "{colors.dark-sidebar-accent}"
    textColor: "{colors.dark-sidebar-accent-foreground}"
  sidebar-item-primary-dark:
    backgroundColor: "{colors.dark-sidebar-primary}"
    textColor: "{colors.dark-sidebar-primary-foreground}"
  sidebar-divider-dark:
    backgroundColor: "{colors.dark-sidebar-border}"
    height: 1px
  sidebar-focus-ring-dark:
    backgroundColor: "{colors.dark-sidebar-ring}"
    width: 3px
  chart-series-1-dark:
    backgroundColor: "{colors.dark-chart-1}"
  chart-series-2-dark:
    backgroundColor: "{colors.dark-chart-2}"
  chart-series-3-dark:
    backgroundColor: "{colors.dark-chart-3}"
  chart-series-4-dark:
    backgroundColor: "{colors.dark-chart-4}"
  chart-series-5-dark:
    backgroundColor: "{colors.dark-chart-5}"
---

# Soft Glass

## Overview

Soft Glass is the look of a helpful, slightly magical product. It is the visual language
of AI assistants, consumer apps and onboarding flows that want to feel **warm, optimistic
and effortless** — like the interface is gently lit from behind. Nothing is sharp, nothing
shouts; the product feels approachable to people who have never read a changelog.

The world is built from three materials: a pale lavender-white **canvas**, **frosted glass
cards** floating above a soft periwinkle-lilac-sky **gradient wash**, and one confident
**blue-violet** for actions. Dark mode keeps the same materials at night: deep indigo-black,
smoked glass, and a brighter periwinkle primary.

Use generous radius, generous padding and a calm rhythm. Motion is soft and springy, never
snappy or mechanical.

## Colors

- **Background (#F7F7FC) — "Cloud":** the canvas, a barely-lavender white.
- **Card / Popover (#FFFFFF) — "Frost":** cards are rendered as glass: `bg-card/70` with
  `backdrop-blur-xl`, a 1px `border` hairline and a white inner highlight. The token is
  opaque white so text contrast is guaranteed even when blur is unsupported.
- **Foreground (#16162A) — "Deep Indigo Ink":** text and icons. Never pure black.
- **Primary (#5B5FE3) — "Periwinkle":** the main action colour. White text on it is 5.0:1.
  Primary buttons may carry a subtle vertical gradient from `primary` to ~6% lighter.
- **Secondary (#EEEEFB) / Accent (#ECEBFF):** pale lilac fills for secondary buttons, chips,
  hover rows and selected list items; text on them is a deep indigo (#2A2A5C / #2E2A8C).
- **Muted (#F0F0F7) / Muted foreground (#5F6178) — "Mist":** helper text, timestamps,
  placeholders. AA on every light surface.
- **Border (#E4E4F0) / Input (#DCDCEB):** soft lavender hairlines. **Ring (#8B8FF5)** is a
  3px periwinkle halo at 50% opacity.
- **Destructive (#CF2A45):** a rosy red, used as text on tinted fills.
- **Gradient wash:** `gradient-from` #C7D2FE (periwinkle) → `gradient-via` #E9D5FF (lilac) →
  `gradient-to` #BAE6FD (sky). Use as large blurred blobs or a mesh behind hero sections and
  empty states; in dark mode the same roles become indigo, violet and deep ocean.
- **Charts:** periwinkle, violet, sky, pink, mint — soft, friendly, rounded line caps.

Dark mode: `dark-background` #0E0E1A, cards #171728 (rendered as `bg-card/60` glass),
`dark-primary` #8E92FF with deep-indigo text (7.0:1), translucent white borders at 10–14%.

## Typography

**Plus Jakarta Sans** carries everything — its open, slightly rounded geometric forms read
as friendly without being childish. **Geist Mono** is for code, tokens, model names and
numbers that need to align.

- **Display (56px/700, -0.03em):** hero statements. Can be filled with the gradient
  (`bg-clip-text`) for one or two words, never a whole paragraph.
- **Headline-lg (36px/700) / Headline-md (22px/600):** page and card titles.
- **Body-lg (18px/400, 1.65):** hero subcopy and onboarding text.
- **Body-md (15px/400, 1.6):** the default; slightly larger than typical SaaS for warmth.
- **Body-sm (13px):** captions and helper text in muted-foreground.
- **Label-md (14px/600) / Label-sm (12px/600):** buttons, tabs, chips, badges. Sentence
  case always — no uppercase labels in this system.
- **Mono (Geist Mono 13px):** code blocks, API keys, token counts, model ids.

## Layout

A 4px base with an 8px rhythm and roomy defaults: 24px card padding, 16–24px gaps inside
cards, 40–64px between sections. Content max-width is 1200px; chat and reading surfaces
cap at 720px and are centred. Layouts favour **centred compositions** and **bento grids**
of rounded cards over dense tables. Leave breathing room around the gradient wash — it
should feel like ambient light, not a pattern.

## Elevation & Depth

Depth is **glass over light**. Three layers:

1. **Ambient:** the background plus a blurred gradient wash (`blur-3xl`, 40–60% opacity).
2. **Glass:** cards at 70% white with `backdrop-blur-xl`, 1px `border`, an inner top
   highlight (`inset 0 1px 0 #FFFFFFB3`), and a soft coloured shadow
   `0 8px 32px -8px #5B5FE326`.
3. **Floating:** popovers, dialogs and the composer: opaque `popover` with
   `0 16px 48px -12px #16162A33`.

Shadows are always soft, large and tinted with the primary hue — never grey and tight.

## Shapes

Generous and consistent. `--radius` is **16px** (`rounded.lg`): popovers, menus and medium
cards. Large cards and dialogs use `rounded.xl` (22px); inputs `rounded.md` (12px); small
chips inside cards `rounded.sm` (10px). Buttons, badges, tabs and the chat composer are
**pills** (`rounded.full`). Nested radii must shrink inward (outer radius = inner radius +
padding). Icons are 20px Lucide/Tabler at 1.75px stroke with rounded joins.

## Components

- **Primary button:** periwinkle pill, white label-md, 44px tall, 20px padding, soft tinted
  shadow; hover lifts 1px and brightens ~6%; press scales to 0.98.
- **Secondary button:** lilac pill with deep-indigo text; no border.
- **Ghost button:** transparent, muted text, accent fill on hover.
- **Card:** frosted glass (see Elevation), 22px radius, 24px padding.
- **Input / composer:** white fill, 1px `input` border, 12px radius (composer is a pill or
  20px-radius textarea), 44px min height; focus shows a 3px periwinkle halo.
- **Badge:** accent fill, deep-indigo label-sm text, pill.
- **Chip:** muted fill pill for filters and suggestions ("Summarise this", "Draft a reply").
- **Thinking / status:** use animated orbs or shimmer text rather than spinners.

## Do's and Don'ts

- Do place a soft periwinkle-lilac-sky gradient wash behind heroes and empty states.
- Do render cards as frosted glass with a hairline border and a tinted, diffuse shadow.
- Do use pills for buttons, badges and the chat composer; 16–22px radius for surfaces.
- Do keep copy in sentence case with a friendly, plain-spoken voice.
- Do use springy, soft motion (200–400ms, gentle overshoot) for appearing elements.
- Don't use hard grey shadows, sharp corners or 1px-radius controls.
- Don't put text directly on the raw gradient without a glass card or sufficient contrast.
- Don't use more than one saturated colour per screen besides the gradient wash.
- Don't use uppercase labels, monospace for UI text, or dense 32px table rows.
- Don't let glass blur stack more than two layers deep — it turns muddy and slow.

## Motion

Motion language: **lively** ([MOTION.md](../MOTION.md#lively)). Friendly, springy, never frantic.

- **Durations:** 160ms (press), 260ms (cards, menus), 380ms (dialogs, page sections).
- **Easing:** springs — `stiffness 380, damping 30` for UI, `stiffness 220, damping 26` for larger surfaces; CSS fallback `cubic-bezier(0.34, 1.3, 0.64, 1)`.
- **What animates:** press squish (0.97), hover lift (−2px + shadow), staggered card entrances (40ms), blur-fade section reveals, shimmering "thinking" states, number pops.
- **Use sparingly:** one ambient effect per page (aurora/gradient drift). No shaders or 3D.
- Respect `prefers-reduced-motion`: replace springs with 120ms fades.

## Agent Prompt

You are designing in the Soft Glass system: a friendly, luminous AI/consumer interface on a
pale lavender canvas (#F7F7FC) with a periwinkle primary (#5B5FE3; #8E92FF in dark mode).
Surfaces are frosted glass cards (white at ~70% with backdrop blur, 1px lavender hairline,
soft primary-tinted shadow) floating over a blurred periwinkle-lilac-sky gradient wash. Set
everything in Plus Jakarta Sans (700 headlines, 400 body at 15px, 600 sentence-case labels)
and use Geist Mono only for code and model ids. Radius is generous — 16px base, 22px for
large cards, pills for buttons, badges and the chat composer. Motion is soft and springy
(200–400ms), with orbs, shimmer text and aurora-style backgrounds for AI moments. Prefer
centred layouts, bento grids and roomy spacing over dense tables.

## Pairs well with

- aceternity/aurora-background
- aceternity/bento-grid
- aceternity/floating-dock
- aceternity/text-generate-effect
- aceternity/dotted-glow-background
- beautifui/chat-composer
- beautifui/thinking-state
- librariesdev/thinking-orbs
- librariesdev/border-beam
- transitions/shimmer-text
- transitions/number-pop-in
- oc/feature-bento
- oc/agent-status
