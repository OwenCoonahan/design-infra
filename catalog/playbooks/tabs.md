---
component: tabs
title: Tabs & segmented controls
categories: [tabs]
aliases: [tabs, tab bar, tab list, segmented control, segmented, toggle group, switcher, view switcher, pill tabs, underline tabs, vertical tabs]
directions:
  - key: sliding-indicator
    label: Sliding active indicator
    feel: The pill or underline glides to the selected tab instead of jumping. Instantly reads as "crafted".
    when: Default upgrade for any shadcn Tabs, nav pills or segmented control.
    avoid: Overshooting springs in dense/enterprise UIs — keep it critically damped there.
    intent: [animate, polish]
    intensity: subtle
    moods: [refined, minimal, technical, trustworthy]
    picks: [transitions/tabs-sliding, motion-primitives/animated-background, react-bits/pill-nav, motion/shared-layout-animation]
  - key: panel-transition
    label: Animated content swap
    feel: Panels cross-fade and slide in the direction of travel, so switching tabs feels spatial.
    when: Marketing feature tabs, settings panes, multi-step content where tabs map to a sequence.
    avoid: Data-heavy panels where users flip quickly to compare (keep swaps ≤150ms or instant).
    intent: [animate]
    intensity: medium
    moods: [refined, calm, playful]
    picks: [motion-primitives/transition-panel, cult-ui/direction-aware-tabs, motion/animate-presence-modes]
  - key: restyle-variants
    label: Restyle — underline, pill, icon + count
    feel: Same shadcn tabs, better anatomy — underline with icons, badges/counts, solid pill, or vertical rail.
    when: The tabs look default/generic, or need icons, counts, overflow scroll or a vertical layout.
    avoid: Mixing tab styles within one product.
    intent: [restyle]
    moods: [minimal, trustworthy, technical]
    picks: [originui/comp-437, originui/comp-433, originui/comp-429, originui/comp-442]
  - key: segmented-spring
    label: Segmented control with spring thumb
    feel: A physical toggle — the thumb slides (or stretches like rubber) between 2–4 options.
    when: Mode/period switches (Day/Week/Month, Monthly/Yearly, List/Grid), not page sections.
    avoid: More than 4–5 options; navigation between pages (use tabs/nav).
    intent: [replace, animate]
    intensity: medium
    moods: [playful, warm, refined]
    picks: [cult-ui/halo-segmented, react-bits/rubber-segment, cult-ui/halo-toggle-group, smoothui/animated-tabs]
  - key: showcase-tabs
    label: Showcase tabs for marketing
    feel: Big tabs that swap whole product visuals or illustrations — the tab bar becomes the feature tour.
    when: Landing-page "how it works" or product-area sections.
    avoid: App UI. Restyle Aceternity's hard-coded gradient panels to tokens.
    intent: [replace]
    intensity: medium
    moods: [premium, technical, refined]
    picks: [cult-ui/tabs-illustration-vercel, aceternity/tabs]
  - key: gooey-glow
    label: Gooey or glowing indicator
    feel: The indicator melts between items or glows with a halo — toy-like and memorable.
    when: Playful consumer apps, portfolios, one signature nav.
    avoid: Enterprise/editorial; Halo Tabs' glow palette is hard-coded cyan/purple — retint.
    intent: [animate, restyle]
    intensity: expressive
    moods: [playful, experimental, futuristic]
    picks: [react-bits/gooey-nav, librariesdev/liquid-gooey, cult-ui/halo-tabs]
---

**Recommend.** `sliding-indicator` is the default upgrade; add `panel-transition` only on marketing tabs. `restyle-variants` when they look generic.

**What makes tabs feel good.** The selected state is unmistakable (contrast, not just colour), the indicator
moves continuously from old to new, and the content swap is fast enough that flipping back and forth to compare
never feels slow (≤200ms). Tabs switch views of the *same* thing; if they navigate between pages, they're nav.

**Common mistakes.** Animating panel height with a long ease so the page jumps beneath the user. Indicators
measured once and wrong after font load/resize. Tabs that overflow on mobile with no scroll affordance. Using a
segmented control for 7 options. Springy overshoot on a Linear-style dense UI.

**Accessibility musts.** Use the Radix/shadcn Tabs primitive (or `role="tablist"`/`tab`/`tabpanel` with
`aria-selected`, `aria-controls`) — roving tabindex, ←/→ to move, Home/End. Focus ring on the tab, not just the
sliding pill. Under `prefers-reduced-motion` the indicator jumps and panels swap instantly.

**Performance.** Animate the indicator with `transform` (motion `layoutId` or measured translate), never by
transitioning `left/width` on every frame. Keep inactive panels unmounted or `hidden` if they're heavy; don't
animate both height and content of large panels simultaneously.

**Further reading** (Jakub Krehel, link-only):

- [How I use shared layout animations](https://jakub.kr/work/shared-layout-animations) — `layoutId` highlights and indicators
- [Details that make interfaces feel better](https://jakub.kr/writing/details-that-make-interfaces-feel-better) — why tab motion must be interruptible
