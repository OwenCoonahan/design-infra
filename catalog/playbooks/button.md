---
component: button
title: Buttons
categories: [button]
aliases: [button, cta, call to action, submit, submit button, primary button, action, link button, icon button, like button, copy button, hero cta, save button]
directions:
  - key: press-and-hover
    label: Press-down + hover acknowledgement
    feel: Tactile and quick. The button dips 2–3% on press and a trailing chevron or label nudges on hover; nobody notices it, everybody feels it.
    when: Default upgrade for every button in product UI and marketing. Start here before anything louder.
    avoid: Never animate layout (width/padding) on hover; keep it to transform and opacity.
    intent: [animate, polish]
    intensity: subtle
    moods: [refined, minimal, trustworthy, technical]
    picks: [transitions/learn-more-hover, magicui/interactive-hover-button, transitions/avatar-group-hover, motion/rolling-text-button]
  - key: loading-success
    label: Loading → success states
    feel: The button owns the async action. Label swaps to a spinner, then morphs into a check, then settles back. No layout jump, no separate toast.
    when: Submit, save, send, deploy, any action that takes 300ms+. The most valuable button upgrade in app UI.
    avoid: Don't disable without feedback, and don't let the width change when the label swaps (fix a min-width).
    intent: [add-state, animate]
    intensity: subtle
    moods: [refined, trustworthy, technical]
    picks: [transitions/success-check, transitions/text-states-swap, originui/comp-90, aceternity/stateful-button]
  - key: micro-celebration
    label: Toggle micro-celebrations (like, copy, follow)
    feel: A single tap flips a boolean and gets a tiny reward. Heart fills and pops, copy icon swaps to a check.
    when: Like/favourite/bookmark, copy-to-clipboard, follow, upvote. Small icon buttons repeated in lists.
    avoid: Primary CTAs; keep the celebration under 400ms so repeated use never feels slow.
    intent: [animate, add-state]
    intensity: subtle
    moods: [playful, warm, refined]
    picks: [transitions/like-button, transitions/icon-swap, cult-ui/copy-button, react-bits/pulse-heart]
  - key: border-light
    label: Travelling border light for the one hero CTA
    feel: A thin beam or shimmer orbits the button edge. Draws the eye without changing the button's shape or colour.
    when: One primary CTA per landing page (hero, pricing featured tier). Dark or soft-glass themes especially.
    avoid: More than one per screen, dense app chrome, editorial and brutalist themes. Retint the beam to var(--primary).
    intent: [animate, polish]
    intensity: medium
    moods: [premium, futuristic, refined]
    picks: [cult-ui/border-beam-button, magicui/border-beam, magicui/shimmer-button, aceternity/moving-border]
  - key: magnetic
    label: Magnetic pull toward the cursor
    feel: The button drifts a few pixels toward the pointer and springs back. Feels alive and physical.
    when: Portfolio, agency and playful marketing CTAs; floating action buttons.
    avoid: Dense UIs and forms (a moving target hurts precision); touch devices get nothing, so never rely on it.
    intent: [animate]
    intensity: medium
    moods: [playful, experimental, premium]
    picks: [motion-primitives/magnetic, aceternity/magnetic-button, react-bits/magnet, microkit/magnetic-fill-button]
  - key: confirm-destructive
    label: Hold-to-confirm / undo-on-fuse for destructive actions
    feel: Deleting takes deliberate intent. A fill rises while held, or the done state carries its own undo on a burning fuse.
    when: Delete, archive, revoke, irreversible actions where a confirm dialog feels heavy.
    avoid: Anything that must be keyboard-fast; always keep an accessible non-hold path (Enter confirms, or an undo).
    intent: [add-state, replace]
    intensity: medium
    moods: [refined, playful, technical]
    picks: [react-bits/fuse-button, react-bits/hold-button, react-bits/slide-commit]
  - key: material-restyle
    label: Restyle with material (frosted rim, texture, metal)
    feel: The button itself becomes the brand moment — frosted gradient rim, skeuomorphic texture or liquid-metal ring.
    when: Consumer/AI products on soft-glass, premium launches, a single hero or badge.
    avoid: Flat themes (linear-dark, brutalist-mono, editorial); shaders cost GPU, so one or two per page.
    intent: [restyle, replace]
    intensity: expressive
    moods: [premium, playful, futuristic]
    picks: [cult-ui/halo-button, cult-ui/texture-button, cult-ui/metal-button, librariesdev/metal-fx]
---

**Recommend.** Start with `press-and-hover` everywhere and `loading-success` on every async action; reach for `border-light` only for the single hero CTA.

**What makes a button feel good.** Immediate feedback (≤100ms) on press, a clear resting/hover/active/disabled/loading
ladder, and a label that says what happens ("Create project", not "Submit"). The best upgrade is almost never
decoration — it's the press dip (`active:scale-[0.97]`, 120ms ease-out) plus a real loading → success state.

**Common mistakes.** Glow/shimmer on every button (one hero CTA, max). Hover effects that change size and shift
the layout. Spinners that replace the label and collapse the width. Disabling the button with no explanation.
Using `text-primary` for a ghost button's label on themes where primary is a fill colour (brutalist-mono's acid
yellow) — use `bg-primary text-primary-foreground` instead. Hard-coded orange/purple beams from Magic UI defaults:
always pass `var(--primary)`.

**Accessibility musts.** Visible `focus-visible` ring that survives every theme. While loading set
`aria-busy="true"` and keep the accessible name (e.g. visually hidden "Saving…"); announce success via the
button's text change or a polite live region. Hold-to-confirm needs a keyboard path. Icon-only buttons need
`aria-label`. Under `prefers-reduced-motion` drop magnetic/beam/shimmer loops entirely and keep only colour and
opacity changes.

**Performance.** Animate `transform`/`opacity` only. Border beams and shimmers are infinite animations — pause them
off-screen. Shader buttons (`metal-fx`, `metal-button`) pull WebGL; lazy-load and cap at one per viewport.
