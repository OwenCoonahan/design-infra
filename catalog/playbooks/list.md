---
component: list
title: Lists, rows & feeds
categories: [table]
aliases: [list, list items, rows, table rows, feed, activity feed, timeline, task list, todo list, inbox, results list, items entering, reorder, sortable list]
directions:
  - key: stagger-enter
    label: Staggered entrance
    feel: Items fade/slide in 30–50ms apart on first render — the list "lays itself out" instead of popping.
    when: First load of short lists (≤10 visible items), search results, feature lists, menus.
    avoid: Re-staggering on every filter keystroke or pagination; long lists (cap the stagger at ~6 items).
    intent: [animate]
    intensity: subtle
    moods: [refined, calm, minimal]
    picks: [motion-primitives/animated-group, magicui/blur-fade, motion/scroll-triggered]
  - key: live-insert
    label: Live items slide in at the top
    feel: New events push in from the top while older ones shift down smoothly — the list feels alive, not refreshed.
    when: Activity feeds, notifications, logs, chat-like streams, "live" hero visuals.
    avoid: High-frequency streams (batch updates; animate at most a few per second).
    intent: [animate, add-state]
    intensity: medium
    moods: [refined, technical, warm]
    picks: [magicui/animated-list, react-bits/animated-list]
  - key: expand-row
    label: Row expands to show detail
    feel: A row grows in height to reveal detail, with the chevron flipping and siblings sliding down smoothly.
    when: Tables with secondary info, FAQ-like lists, order/task details, agent task rows.
    avoid: Expanding into huge content (open a sheet instead).
    intent: [animate, add-state]
    intensity: subtle
    moods: [refined, trustworthy, minimal]
    picks: [transitions/accordion, transitions/card-resize, motion-primitives/disclosure, motion/layout-animation]
  - key: complete-check
    label: Satisfying complete/check
    feel: Ticking an item fills the box, draws the check and strikes the label in one motion — done feels earned.
    when: To-dos, checklists, onboarding steps, multi-select rows.
    avoid: Bulk-select tables where users tick 50 rows (keep it fast and quiet there).
    intent: [animate, add-state]
    intensity: subtle
    moods: [warm, playful, refined]
    picks: [transitions/checkbox-check, react-bits/spring-check, react-bits/status-mark]
  - key: reorder-swipe
    label: Drag to reorder / swipe for actions
    feel: Rows lift and others make room as you drag; or swipe a row to reveal archive/delete.
    when: Prioritised lists, playlists, kanban-lite, mobile inboxes.
    avoid: Desktop data tables (use explicit controls); swipe as the only way to delete.
    intent: [add-state, replace]
    intensity: medium
    moods: [playful, refined]
    picks: [cult-ui/sortable-list, react-bits/swipe-row, motion/reorder-items]
  - key: restyle-table
    label: Restyle as a real data table / task list
    feel: Toolbar, sortable columns, badges, row selection, pagination — or agent task rows with status.
    when: The list is really tabular data or a set of tasks and looks like plain divs.
    avoid: Tables for 3 items (use a simple list).
    intent: [restyle, replace]
    moods: [trustworthy, technical, minimal]
    picks: [oc/data-table-card, originui/comp-485, beautifui/task-rows, kibo-ui/list]
  - key: hover-highlight
    label: Sliding hover highlight
    feel: A single highlight glides between rows under the pointer — Raycast/Linear-style lists.
    when: Command menus, nav lists, search results, settings lists.
    avoid: Lists where rows aren't interactive.
    intent: [animate, polish]
    intensity: subtle
    moods: [refined, technical, minimal]
    picks: [motion-primitives/animated-background]
---

**Recommend.** `stagger-enter` on first load only, `expand-row` for detail, `live-insert` for feeds. Make sure rows never jump before adding anything else.

**What makes a list feel good.** Stable rows: nothing jumps when data arrives, is inserted or removed — items
move to their new positions (layout animation) instead of teleporting. Clear row affordances (hover, selected,
focused), consistent density, and motion that explains *change* (new, removed, reordered, completed).

**Common mistakes.** Staggering 50 items (the last one arrives seconds later). Replaying entrance animations on
every filter/sort. Inserting at the top and shoving the row the user was about to click. Expanding rows with
`max-height` hacks that ease wrongly. Swipe-only destructive actions.

**Accessibility musts.** Semantic `<ul>/<ol>` or `<table>`; sortable lists need keyboard reordering (dnd-kit's
keyboard sensor) and announcements ("Item moved to position 3"). Live feeds: `aria-live="polite"` region,
summarised ("3 new events"), with a pause control for fast streams. Expand rows: `aria-expanded` on the trigger.
Under `prefers-reduced-motion` drop staggers and layout tweening; items appear in place.

**Performance.** Virtualise long lists (TanStack Virtual) and don't animate virtualised rows on scroll. Use
`AnimatePresence` + `layout` only on the visible slice. Batch high-frequency inserts. Avoid animating `height`
on many rows at once — animate one row, let siblings move via transform.
