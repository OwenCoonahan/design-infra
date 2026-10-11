---
component: headline
title: Headlines & text effects
categories: [text-effect]
aliases: [headline, heading, hero title, hero headline, title, h1, section heading, tagline, eyebrow, kicker, text animation, text effect, display text]
directions:
  - key: rise-fade
    label: Lines rise + fade in
    feel: Headline and subline rise a few pixels with a soft blur, staggered by ~80ms. Confident, never showy.
    when: Default for hero and section headings in product marketing, empty states and onboarding.
    avoid: Re-triggering on every scroll pass; animating body paragraphs.
    intent: [animate]
    intensity: subtle
    moods: [refined, calm, minimal, trustworthy]
    picks: [transitions/texts-reveal, motion-primitives/text-effect, magicui/blur-fade, motion/text-scroll-word-reveal]
  - key: word-stagger
    label: Word-by-word blur/slide entrance
    feel: Words resolve one after another — the headline "speaks". More presence than a line fade.
    when: One hero headline per page; AI product launches; short statements (≤10 words).
    avoid: Long headlines (the last word arrives too late) and secondary headings.
    intent: [animate]
    intensity: medium
    moods: [refined, futuristic, premium]
    picks: [motion-primitives/text-effect, magicui/text-animate, react-bits/blur-text, aceternity/text-generate-effect]
  - key: rotating-keyword
    label: Rotating keyword
    feel: One word in the headline cycles ("Build ___ faster"), the rest stays still. Communicates breadth.
    when: Products with several audiences/use cases; 3–5 short alternatives.
    avoid: When the rotating word carries the core meaning (some users read only the first one).
    intent: [animate, add-state]
    intensity: medium
    moods: [playful, refined, bold]
    picks: [motion-primitives/text-loop, aceternity/container-text-flip, react-bits/rotating-text, magicui/word-rotate]
  - key: two-tone-restyle
    label: Restyle — two-tone, gradient or highlighted phrase
    feel: Static typographic emphasis — muted second clause, a gradient word, or a marker-highlighted phrase.
    when: The headline is flat and needs hierarchy, not motion. Works on every theme when tokens drive the colours.
    avoid: Rainbow gradients from library defaults; more than one emphasised phrase.
    intent: [restyle]
    moods: [refined, editorial, minimal, premium]
    picks: [oc/feature-levels, cult-ui/gradient-heading, magicui/aurora-text, magicui/highlighter]
  - key: highlight-on-view
    label: Highlight draws in on view
    feel: A marker stroke or highlight box sweeps behind the key phrase as it enters.
    when: Editorial and warm brands, landing pages that want to stress one claim.
    avoid: Multiple highlights per screen; dense dark UIs.
    intent: [animate]
    intensity: medium
    moods: [editorial, warm, playful]
    picks: [magicui/highlighter, aceternity/hero-highlight, aceternity/pointer-highlight]
  - key: scramble-decrypt
    label: Scramble / decrypt reveal
    feel: Glyphs shuffle then lock into the real words — terminal, security, hacker energy.
    when: Dev tools, security, infra, brutalist brands; short labels and headlines.
    avoid: Warm/consumer brands; long sentences (unreadable while scrambling).
    intent: [animate]
    intensity: medium
    moods: [technical, bold, retro]
    picks: [aceternity/encrypted-text, react-bits/decrypted-text, motion-primitives/text-scramble, magicui/hyper-text]
  - key: shimmer-eyebrow
    label: Shimmering eyebrow / announcement pill
    feel: A small pill above the headline with a slow light sweep ("New — Agents →").
    when: Launch announcements above a hero headline.
    avoid: Shimmer on the headline itself; set shimmer colours from muted-foreground, not library greys.
    intent: [animate, add-state]
    intensity: subtle
    moods: [refined, futuristic, premium]
    picks: [kibo-ui/announcement, magicui/animated-shiny-text, react-bits/shiny-text]
  - key: kinetic-type
    label: Kinetic display type
    feel: Characters split, fold, stroke-draw or show imagery through the glyphs — the headline is the visual.
    when: Art-directed launches, portfolios, campaign pages with huge type and little else.
    avoid: Product pages where the message matters more than the moment; GSAP weight if you don't already use it.
    intent: [animate, replace]
    intensity: expressive
    moods: [experimental, bold, premium]
    picks: [react-bits/split-text, react-bits/masked-heading, react-bits/fold-text, react-bits/stroke-text]
---

**Recommend.** `rise-fade` by default; `word-stagger` for one hero line on launch pages; `two-tone-restyle` when the problem is hierarchy, not motion.

**What makes a headline feel good.** The words, first: short, specific, set in the theme's heading face
(`font-heading font-headline`) with tight tracking and balanced wrapping (`text-balance`). Motion should finish
within ~600ms of load so the reader never waits for the message, and it should run once.

**Common mistakes.** Animating every heading on the page (pick the hero, maybe one section). Per-character
effects on long lines. Effects that hide text until JavaScript hydrates — the LCP element invisible for a second.
Rainbow/purple library defaults instead of theme tokens. Passing `font-heading` and `font-headline` through the
same `cn()` (tailwind-merge drops one — keep them in a plain string).

**Accessibility musts.** Split-text effects must keep the accessible name intact: put the full string in
`aria-label` on the heading and `aria-hidden` the split spans (motion-primitives/text-effect and most React Bits
pieces need checking). Rotating words: pause on hover/focus and under reduced motion show one static word.
Scramble effects must not be the only state for content. Under `prefers-reduced-motion` render text
immediately — at most a 150ms opacity fade.

**Performance.** Server-render the real text and animate from visible-ish states (opacity ≥ 0 is fine, but never
`display:none` until hydration) so LCP isn't delayed. Per-character spans multiply DOM nodes — fine for a hero,
not for paragraphs. GSAP SplitText pieces add ~30–60KB; prefer motion-based equivalents if motion is already
installed.
