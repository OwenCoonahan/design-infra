# Component playbooks

One file per component type (`button.md`, `carousel.md`, …). Each is a curated **menu of directions** for
upgrading that component — what `propose_options` / the `refine` skill offers when Owen says "animate this",
"I don't like this", or "make this better". Directions differ in *approach* (subtle CSS vs. motion wrapper vs.
drop-in replacement), not just in which library.

Front matter (schema `Playbook` in `lib/catalog/schema.ts`; `pnpm check` validates picks exist and aren't paid):

```yaml
---
component: button
title: Buttons
categories: [button]
aliases: [cta, submit, call to action]
directions:
  - key: press-and-lift
    label: Press-down + hover lift
    feel: Tactile and quick; barely noticeable but the UI feels responsive.
    when: Any product UI; default upgrade for every button.
    avoid: —
    intent: [animate, polish]
    intensity: subtle
    moods: [refined, minimal, trustworthy]
    picks: [transitions/learn-more-hover]
---
```

Body: short guidance — what makes this component good, common mistakes, a11y musts.
