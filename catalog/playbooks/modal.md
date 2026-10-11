---
component: modal
title: Modals, sheets & drawers
categories: [modal]
aliases: [modal, dialog, popup, pop-up, overlay, lightbox, sheet, side sheet, drawer, bottom sheet, popover, alert dialog, confirm dialog, command palette]
directions:
  - key: native-timing
    label: Native-feeling open/close timing
    feel: Scale from 96% + fade in ~180ms, exit faster than entry, backdrop fades separately. Feels like the OS, not a web page.
    when: Default upgrade for every shadcn Dialog/AlertDialog/Sheet.
    avoid: Bouncy springs on alerts and destructive confirms; slow (300ms+) exits.
    intent: [animate, polish]
    intensity: subtle
    moods: [refined, minimal, trustworthy]
    picks: [transitions/modal, motion-primitives/dialog, motion/exit-animation]
  - key: morph-from-trigger
    label: Morph from the trigger
    feel: The button or card grows into the dialog/popover and shrinks back — the user never loses their place.
    when: Galleries, quick-create (+) menus, feedback/waitlist mini-forms, card → detail.
    avoid: Long forms or flows that need a URL; alert dialogs.
    intent: [animate, replace]
    intensity: medium
    moods: [refined, playful, organic]
    picks: [motion-primitives/morphing-dialog, motion-primitives/morphing-popover, transitions/plus-menu-morph, cult-ui/popover-form]
  - key: restyle-dialogs
    label: Restyle with purpose-built dialog layouts
    feel: Same Radix dialog, better content — destructive confirm with typed name, command palette, onboarding steps.
    when: The dialog is functional but generic, or you need a ready pattern (delete, ⌘K, signup, checkout).
    avoid: Modals for content that should be inline (settings, short edits).
    intent: [restyle]
    moods: [trustworthy, minimal, technical]
    picks: [originui/comp-333, originui/comp-320, originui/comp-313, originui/comp-332]
  - key: multi-view-drawer
    label: Multi-view drawer / sheet
    feel: One drawer whose content slides between views (choose → confirm → done) with height animating smoothly.
    when: Mobile-first flows, settings sub-pages, confirmations with steps — the Family/Vaul pattern.
    avoid: Desktop-only data entry (use a side sheet or page).
    intent: [replace, animate]
    intensity: medium
    moods: [warm, playful, refined]
    picks: [cult-ui/family-drawer, transitions/page-side-by-side, cult-ui/side-panel]
  - key: stacked-wizard
    label: Stacked / multi-step dialog
    feel: Steps stack like cards inside the dialog; back/next feel spatial and the user sees how deep they are.
    when: Wizards, nested forms, feature announcements with media steps.
    avoid: More than ~4 steps (make it a page).
    intent: [replace, add-state]
    intensity: medium
    moods: [refined, trustworthy, warm]
    picks: [kibo-ui/dialog-stack, cult-ui/intro-disclosure, motion-primitives/transition-panel]
  - key: fullscreen-expand
    label: Full-screen expand / video lightbox
    feel: A CTA or thumbnail expands to fill the screen — cinematic, immersive.
    when: Waitlists, product demo videos, launch pages.
    avoid: Product UI; anything without a very obvious close.
    intent: [replace]
    intensity: expressive
    moods: [premium, futuristic, experimental]
    picks: [cult-ui/expandable-screen, magicui/hero-video-dialog]
---

**Recommend.** `native-timing` for every dialog; `morph-from-trigger` when the dialog grows out of a card or + button; `multi-view-drawer` on mobile.

**What makes a modal feel good.** It appears from somewhere meaningful (centre scale for alerts, edge slide for
sheets, the trigger for morphs), opens in ~150–200ms and closes faster, and the page behind dims but stays
recognisable. Most of all: it's only a modal when it must interrupt. Inline edits, popovers and side panels are
usually kinder.

**Common mistakes.** Modal-on-modal. Exit animations longer than entry (users already decided to leave).
Morph animations that animate text size and blur the copy. Drawers that can't be dismissed by swipe on mobile.
Losing form state on accidental backdrop click. Hard-coded `bg-white`/`#121212` surfaces in Cult UI pieces —
swap to `bg-popover`.

**Accessibility musts.** Use Radix Dialog/AlertDialog semantics (`role="dialog"`, `aria-modal`, labelled by the
title, described by the body). Trap focus, restore it to the trigger on close, Esc closes (except
mid-destructive-action), scroll-lock the body. AlertDialog for destructive confirms, focusing the safe action.
Under `prefers-reduced-motion` use a plain ≤150ms fade — no scale, no morph.

**Performance.** Animate `transform`/`opacity`; never animate `backdrop-filter` blur amount. Shared-layout morphs
measure on open — keep the morphing element light (image + title), fade the rest in after. Lazy-load heavy
dialog content (video, editors) on open.
