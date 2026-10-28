---
component: loader
title: Loaders, progress & skeletons
categories: [loader]
aliases: [loader, loading, loading state, spinner, skeleton, placeholder, progress, progress bar, shimmer, thinking, generating, busy indicator, pending]
directions:
  - key: skeleton-reveal
    label: Skeleton → content crossfade
    feel: Grey placeholders in the exact shape of the content, then a soft crossfade with zero layout jump.
    when: Any page or card whose layout is known before data arrives — lists, tables, dashboards, profiles.
    avoid: Loads under ~300ms (show nothing; a flash of skeleton is worse) and unknown layouts.
    intent: [add-state, animate]
    intensity: subtle
    moods: [refined, minimal, trustworthy, calm]
    picks: [transitions/skeleton-reveal, smoothui/skeleton-loader]
  - key: inline-spinner
    label: Small inline spinner / dot matrix
    feel: A tiny, quiet "working" glyph next to the thing that's busy — in a button, a row, a field.
    when: Short, local, indeterminate waits (saving a row, validating a field, refreshing a widget).
    avoid: Full-page waits (use skeletons) and anything longer than ~4s without a label.
    intent: [add-state]
    intensity: subtle
    moods: [minimal, technical, trustworthy]
    picks: [loading-dev/arc, kibo-ui/spinner, transitions/matrix-loader, motion/loading-three-dots-pulse]
  - key: determinate-progress
    label: Determinate progress bar or ring
    feel: The user sees how far along it is — spring-driven fill, honest percentage.
    when: Uploads, imports, exports, multi-file processing — anything where you know the total.
    avoid: Faking progress you don't have (use indeterminate + a label instead).
    intent: [add-state, replace]
    intensity: subtle
    moods: [trustworthy, refined, technical]
    picks: [cult-ui/halo-progress, magicui/animated-circular-progress-bar]
  - key: shimmer-label
    label: Shimmering status label
    feel: The text itself shimmers ("Generating…", "Searching docs…") and swaps as phases change. Informative and calm.
    when: AI generation, long fetches, background jobs — when *what* is happening matters more than a glyph.
    avoid: Shimmering static UI labels that aren't actually in progress.
    intent: [add-state, animate]
    intensity: subtle
    moods: [calm, refined, futuristic]
    picks: [transitions/shimmer-text, transitions/thinking-states, motion-primitives/text-shimmer, smoothui/ai-reasoning]
  - key: agent-thinking
    label: Agent activity indicator (orb + verb + trace)
    feel: A living orb or lattice with a verb and detail line; expandable trace for long runs. Users trust what they can see.
    when: Any agent/LLM operation over ~400ms. Default for AI products (see catalog/patterns/agent-status.md).
    avoid: Non-AI loading (it reads as gimmicky); more than one orb per screen.
    intent: [add-state, replace]
    intensity: medium
    moods: [futuristic, calm, technical]
    picks: [oc/agent-status, librariesdev/thinking-orbs, beautifui/thinking-state, react-bits/lattice-loader]
  - key: multi-step
    label: Multi-step progress for long operations
    feel: A checklist of steps ticks through with a success morph at the end — waiting feels like progress.
    when: Provisioning, onboarding setup, generation pipelines that run 5–60s.
    avoid: Steps you can't actually observe (don't animate fake steps on a timer).
    intent: [add-state, replace]
    intensity: medium
    moods: [refined, trustworthy, futuristic]
    picks: [aceternity/multi-step-loader, transitions/success-check, react-bits/status-mark, smoothui/ai-task-list]
  - key: media-generating
    label: Media-generation placeholder
    feel: The image slot itself animates (pixel scan, shader noise) while the model works, then resolves into the result.
    when: Image/video generation products, AI avatars, any reserved-aspect media slot that fills later.
    avoid: Ordinary image lazy-loading (use a blur-up instead — see image playbook).
    intent: [add-state]
    intensity: expressive
    moods: [futuristic, experimental]
    picks: [react-bits/refine-frame, librariesdev/img-fx, aceternity/image-generation-loader]
---

**Recommend.** `skeleton-reveal` for known layouts, `inline-spinner` for local waits, `agent-thinking` for anything AI. Add `multi-step` once waits pass ~10s. For the inline spinner itself, `loading-dev/arc` is the default: one npm import, `currentColor`, reduced motion built in (other loading.dev styles: `loading-dev/classic`, `linear-dots`, `trace`).

**What makes loading feel good.** Matching the indicator to the wait: nothing under ~300ms, an inline spinner
or skeleton up to a few seconds, a labelled/determinate state beyond that, and a step list for anything over
~10s. Reserve the final layout so content swaps in without a jump, and end with a clear done state.

**Common mistakes.** Full-screen spinners for partial updates. Skeletons that don't match the real layout (worse
than nothing). Spinners that flash for 50ms (debounce ~200ms, then show for at least ~400ms). Progress bars that
stall at 99%. Loaders with no text for long operations. Multiple competing indicators on one screen.

**Accessibility musts.** Put the busy region in `aria-busy="true"`, and announce state with
`role="status"`/`aria-live="polite"` ("Loading results", "3 of 5 files uploaded") — don't announce every tick.
Determinate bars need `role="progressbar"` with `aria-valuenow/min/max`. Under `prefers-reduced-motion` stop
shimmer sweeps, orbs and pulsing; keep a static icon + text. Never convey state by animation alone.

**Performance.** CSS keyframes on `opacity`/`transform` only; no JS timers for spinners. Pause loops when hidden.
Canvas orbs and WebGL placeholders (`img-fx`, `image-generation-loader`) are heavier than the content they hold
— one at a time, unmount when done.
