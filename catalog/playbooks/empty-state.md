---
component: empty-state
title: Empty states
categories: [empty-state]
aliases: [empty state, empty, zero state, zero data, no data, no results, blank state, first run, first-run, onboarding state, inbox zero, nothing here, "404"]
directions:
  - key: clarify
    label: Restyle — icon, one sentence, one next step
    feel: A calm layered icon, a title that says what's missing, one primary action (plus an optional help link).
    when: Default for every empty list, table, search with no results, or permission-gated view.
    avoid: Jokes and illustrations instead of a next step; two equal-weight buttons.
    intent: [restyle, replace]
    moods: [calm, minimal, trustworthy, refined]
    picks: [oc/empty-state]
  - key: gentle-entrance
    label: Gentle text + icon entrance
    feel: Icon and copy rise in softly after the data check resolves — it reads as intentional, not broken.
    when: Empty states that appear after loading (so they don't flash in abruptly).
    avoid: Animating before you know it's truly empty (flash of empty state).
    intent: [animate]
    intensity: subtle
    moods: [calm, refined, warm]
    picks: [transitions/texts-reveal, magicui/blur-fade]
  - key: quiet-backdrop
    label: Quiet patterned backdrop
    feel: A faint dot grid or ripple behind the message gives the void some structure.
    when: Large empty canvases (dashboards, boards, editors) that look broken when blank.
    avoid: Loud animation; small inline empty states.
    intent: [restyle, polish]
    intensity: subtle
    moods: [minimal, technical, calm]
    picks: [magicui/dot-pattern, aceternity/dotted-glow-background, magicui/ripple]
  - key: connect-illustration
    label: “Connect your tools” illustration
    feel: Animated beams or orbiting logos show what will appear once integrations are connected.
    when: Integration-driven products whose first step is connecting a data source.
    avoid: Generic empty lists; use real integration logos only.
    intent: [add-state, animate]
    intensity: medium
    moods: [technical, refined, futuristic]
    picks: [magicui/animated-beam, magicui/orbiting-circles]
  - key: first-run
    label: Turn it into first-run onboarding
    feel: Instead of "nothing here", a short guided setup with steps, choices and progress.
    when: Brand-new accounts and workspaces; the very first empty state a user sees.
    avoid: Recurring empty states (after first run, keep it simple).
    intent: [replace, add-state]
    intensity: medium
    moods: [warm, trustworthy, playful]
    picks: [cult-ui/onboarding, cult-ui/intro-disclosure, originui/comp-513]
  - key: dropzone
    label: Make the empty state the drop target
    feel: The empty area is a dashed dropzone — drag a file onto it and it's no longer empty.
    when: Files, media, imports, documents.
    avoid: Data that can't be uploaded.
    intent: [replace, add-state]
    intensity: subtle
    moods: [minimal, refined, warm]
    picks: [kibo-ui/dropzone, oc/empty-state, cult-ui/halo-dropzone]
  - key: ai-suggestions
    label: Suggestions as the empty state
    feel: An empty chat or workspace offers 3–4 concrete starting prompts or suggested actions.
    when: AI chat, agents, search and creation tools.
    avoid: Vague prompts ("Ask me anything") — suggest real, product-specific tasks.
    intent: [replace, add-state]
    intensity: subtle
    moods: [futuristic, calm, warm]
    picks: [oc/prompt-composer, cult-ui/agent-suggest-card-stack]
  - key: celebrate-done
    label: Celebrate "all done"
    feel: Inbox zero earns a check morph or a burst of confetti — empty because the user won.
    when: Task queues, inboxes, review lists cleared by the user.
    avoid: Empty-because-new states; repeated confetti (once per session at most).
    intent: [animate, add-state]
    intensity: expressive
    moods: [playful, warm]
    picks: [transitions/success-check, magicui/confetti]
---

**Recommend.** `clarify` for every empty state (oc/empty-state), plus `gentle-entrance` if it appears after loading. Use `first-run` for brand-new accounts.

**What makes an empty state feel good.** It explains *why* it's empty (new, filtered, no permission, all done)
and offers the one action that fixes it. Different causes deserve different copy: "No results for 'xyz' —
clear filters" is not the same as "No projects yet — create your first". It should look designed, at the same
visual weight as the content it replaces.

**Common mistakes.** One generic "No data" for every cause. Big illustrations with no action. Flashing the empty
state before data loads (show a skeleton until you know). Dead-end empty search results without a reset.
Celebratory animations on states the user didn't earn.

**Accessibility musts.** Use a real heading and a real button/link for the action; when the empty state replaces
results after a search or filter, announce it via `role="status"` ("No results"). Decorative icons/backdrops
get `aria-hidden`. Confetti and looping illustrations stop under `prefers-reduced-motion`.

**Performance.** Empty states are often the first thing a new user sees — keep them light: SVG icons, CSS
patterns. Lazy-load confetti and beam diagrams; don't ship canvas effects for a state most users see once.
