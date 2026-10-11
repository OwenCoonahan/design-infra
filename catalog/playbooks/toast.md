---
component: toast
title: Toasts & notifications
categories: [toast]
aliases: [toast, notification, snackbar, sonner, alert, banner, flash message, inline notification, notification badge, activity feed, undo toast]
directions:
  - key: sonner-timing
    label: Tune Sonner entrance & stacking
    feel: Toasts rise with a slight blur and scale, older ones tuck behind — calm, native, Vercel-grade.
    when: Default upgrade for any project already using Sonner/shadcn toast.
    avoid: Changing the stack position per page; long (5s+) entrances.
    intent: [animate, polish]
    intensity: subtle
    moods: [refined, minimal, trustworthy]
    picks: [transitions/toast, transitions/banner-stacking, motion/exit-animation]
  - key: restyle-sonner
    label: Restyle — icon, action, undo
    feel: Compact token-based toasts with a status icon, one action (Undo, View) and a close.
    when: The toasts are plain text and need status semantics or an inline action.
    avoid: More than one action per toast; colour-only status.
    intent: [restyle]
    moods: [trustworthy, minimal, refined]
    picks: [originui/comp-300, originui/comp-287, originui/comp-285, originui/comp-299]
  - key: inline-status
    label: Replace the toast with inline status
    feel: The button or row that triggered the action confirms in place ("Saved ✓"), so nothing pops up at all.
    when: Saves, copies, toggles — feedback for actions the user is looking at. Often the better answer.
    avoid: Background events the user didn't trigger (those still need a toast/notification).
    intent: [replace, add-state]
    intensity: subtle
    moods: [calm, minimal, refined]
    picks: [transitions/text-states-swap, transitions/success-check, smoothui/button-copy]
  - key: polished-rim
    label: Polished frosted toasts with rim
    feel: Frosted panel, gradient rim per status, glyph stagger — friendly and premium.
    when: Consumer and AI products on soft-glass-like themes.
    avoid: Dense enterprise UIs and flat themes.
    intent: [restyle, replace]
    intensity: medium
    moods: [warm, playful, premium]
    picks: [cult-ui/halo-toast, cult-ui/halo-notification]
  - key: swipe-dismiss
    label: Swipe-to-dismiss with undo fuse
    feel: One toast rises from the edge, flicks away with velocity, and burns a thin fuse until its undo expires.
    when: Mobile-first apps, undoable destructive actions (archive, delete).
    avoid: Desktop-only apps where swipe is invisible; stacking many toasts.
    intent: [replace, animate]
    intensity: medium
    moods: [playful, refined]
    picks: [react-bits/swipe-toast]
  - key: badge-feed
    label: Notification badge & live activity feed
    feel: A dot pops onto the bell; a feed reveals events one by one. Ambient instead of interruptive.
    when: Inboxes, collaboration, activity/notification centres, "live" hero visuals.
    avoid: Critical errors (they need a proper alert).
    intent: [add-state, animate]
    intensity: subtle
    moods: [refined, warm, playful]
    picks: [transitions/notification-badge, magicui/animated-list]
  - key: dynamic-island
    label: Dynamic Island status
    feel: A black pill morphs between compact and expanded states for live status — device-like and delightful.
    when: Playful products, call/recording/upload status, one signature moment.
    avoid: Most product UI; the pill is hard-coded black.
    intent: [replace]
    intensity: expressive
    moods: [playful, futuristic]
    picks: [cult-ui/dynamic-island]
---

**Recommend.** Before restyling toasts, try `inline-status` — most save/copy toasts should not exist. Then `sonner-timing` + `restyle-sonner` for the rest.

**What makes a toast feel good.** It confirms something the user did or tells them something they didn't see
happen, says it in five words, offers at most one action (Undo beats "Are you sure?"), and leaves on its own
without stealing focus. Position and stacking stay consistent app-wide.

**Common mistakes.** Toasting every save (confirm inline instead). Toasts for errors that need the user to fix
something (put the error at the field). Auto-dismissing toasts that contain the only Undo. Stacks that cover the
primary action on mobile. Status conveyed only by colour.

**Accessibility musts.** Container is a live region: `role="status"`/`aria-live="polite"` for info/success,
`role="alert"` (assertive) only for urgent errors. Never move focus to a toast; make its action reachable by
keyboard (Sonner's hotkey) and give enough time — pause the timer on hover/focus, ≥5s for toasts with actions
(WCAG 2.2.1). Under `prefers-reduced-motion` fade only — no rise, scale or swipe physics.

**Performance.** One toaster mounted at the root. Animate `transform`/`opacity` (avoid animating `height` of the
whole stack). Cap the visible stack at ~3.
