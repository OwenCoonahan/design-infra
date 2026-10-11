---
component: section-reveal
title: Section scroll reveals
categories: [scroll-effect]
aliases: [section reveal, scroll reveal, reveal on scroll, scroll animation, animate on scroll, aos, fade in on scroll, scrollytelling, sticky scroll, parallax, scroll progress, page sections]
directions:
  - key: fade-up-on-view
    label: Fade/blur up once on view
    feel: Each section eases up ~12px and un-blurs as it enters, once. The page feels finished, not animated.
    when: Default for marketing pages — wrap whole sections, not every element.
    avoid: Wrapping the hero (it should be visible at first paint) and replaying on scroll-up.
    intent: [animate]
    intensity: subtle
    moods: [refined, calm, minimal, trustworthy]
    picks: [motion-primitives/in-view, magicui/blur-fade, react-bits/fade-content, motion/scroll-triggered]
  - key: stagger-children
    label: Staggered children inside a section
    feel: Heading, then copy, then cards arrive in a short cascade — reading order made visible.
    when: Feature grids, logo rows, pricing tiers, stat rows.
    avoid: More than ~6 staggered items; staggering text inside paragraphs.
    intent: [animate]
    intensity: subtle
    moods: [refined, warm, playful]
    picks: [motion-primitives/animated-group, react-bits/animated-content]
  - key: sticky-walkthrough
    label: Sticky scroll-spy walkthrough
    feel: A sticky visual or numbered nav while text steps scroll past — the feature tour Owen loves.
    when: Multi-step features, "how it works", product capability tours on landing pages.
    avoid: Fewer than 3 steps (just stack them); mobile without a stacked fallback.
    intent: [replace, animate]
    intensity: medium
    moods: [refined, premium, organic]
    picks: [oc/feature-levels, aceternity/sticky-scroll-reveal, cult-ui/feature-sticky-section]
  - key: product-reveal
    label: Scroll-linked product reveal
    feel: A screenshot tilts flat, a frame grows to full bleed, or a laptop opens as you scroll — the product arrives.
    when: The section right after the hero on SaaS/launch pages. One per page.
    avoid: Dense product UI pages; anything that traps scroll.
    intent: [animate, replace]
    intensity: expressive
    moods: [premium, futuristic, refined]
    picks: [aceternity/container-scroll-animation, react-bits/scroll-expand, aceternity/macbook-scroll]
  - key: scroll-stack
    label: Cards stack as you scroll
    feel: Each section card pins and the next slides over it, building a deck with depth.
    when: Feature or case-study sequences, manifesto steps, pricing comparisons on marketing pages.
    avoid: Long content per card (it gets covered before it's read).
    intent: [animate, replace]
    intensity: medium
    moods: [bold, premium, playful]
    picks: [react-bits/scroll-stack]
  - key: text-scrub
    label: Paragraph un-blurs word by word with scroll
    feel: A manifesto paragraph brightens or un-blurs as you scroll through it — reading becomes the animation.
    when: About/mission sections, one statement per page.
    avoid: Functional copy; more than one per page.
    intent: [animate]
    intensity: medium
    moods: [editorial, premium, calm]
    picks: [react-bits/scroll-reveal, magicui/text-reveal, motion/text-scroll-word-reveal]
  - key: progress-trace
    label: Scroll progress & tracing beam
    feel: A thin bar or beam tracks reading progress down long content — orientation without decoration.
    when: Long articles, docs, changelogs, timelines, case studies.
    avoid: Short pages (meaningless) and pages already busy with motion.
    intent: [add-state, animate]
    intensity: subtle
    moods: [editorial, technical, calm]
    picks: [motion-primitives/scroll-progress, aceternity/tracing-beam, aceternity/timeline, motion/scroll-linked]
  - key: parallax
    label: Parallax depth
    feel: Layers and columns move at different speeds — depth and momentum, art-directed.
    when: Image-led brands, portfolios, campaign pages.
    avoid: Text-heavy pages and anything users need to scan; motion-sensitive audiences.
    intent: [animate]
    intensity: expressive
    moods: [experimental, organic, premium]
    picks: [aceternity/hero-parallax, aceternity/parallax-scroll, originkit/ridge-parallax]
---

**Recommend.** `fade-up-on-view` on whole sections, once, page-wide. Add one `sticky-walkthrough` (oc/feature-levels) for the feature tour; at most one expressive scene per page.

**What makes scroll reveals feel good.** Restraint and consistency: one reveal style for the whole page, triggered
once, slightly before the section is fully in view (`amount: 0.2–0.3`, `margin: "-10% 0px"`), short distances
(8–16px) and durations (300–500ms). Content must never wait for the animation — fast scrollers should not see
blank sections.

**Common mistakes.** Animating every element individually ("everything floats in"). Large travel distances and
slow eases that make the page feel laggy. Hiding content until JS runs (blank page with JS disabled, worse SEO).
Scroll-jacking. Scroll-linked effects on mobile that stutter. Re-triggering on scroll-up.

**Accessibility musts.** Under `prefers-reduced-motion` all content is visible immediately — no fades, no parallax,
no scroll-scrubbed transforms (sticky layouts may stay, just without motion). Never trap or hijack scroll;
keyboard/anchor navigation must land on visible content. Scroll-linked text effects must keep the text readable
at every scroll position (minimum contrast in the "dim" state) and real in the DOM.

**Performance.** IntersectionObserver-based reveals (in-view, blur-fade) are cheap; scroll-linked transforms
should use motion's `useScroll`/CSS scroll-driven animations on `transform`/`opacity` only. Avoid `filter: blur`
on large sections (expensive to paint) — prefer opacity + translate there. One heavy scroll scene per page.
