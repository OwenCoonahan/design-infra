---
component: carousel
title: Carousels & sliders
categories: [carousel]
aliases: [carousel, slider, slideshow, gallery slider, marquee, ticker, logo strip, testimonial slider, swiper, scroller]
directions:
  - key: polish-slide
    label: Polished slide carousel (snap, arrows, dots)
    feel: Honest swipe/arrow carousel with smooth spring transitions and clear position — nothing flashy, just good.
    when: Product images, testimonials, feature screenshots in product or marketing UI. Upgrade for a janky default carousel.
    avoid: Autoplay with no pause control; hiding important content on slide 4 that nobody reaches.
    intent: [animate, polish, replace]
    intensity: subtle
    moods: [minimal, refined, trustworthy]
    picks: [motion-primitives/carousel, react-bits/carousel, aceternity/carousel, motion/drag]
  - key: marquee
    label: Infinite marquee
    feel: Logos or quotes drift continuously with faded edges; pauses on hover. Social proof without interaction.
    when: Logo clouds, testimonial rows, integrations strips.
    avoid: Content users need to read or click precisely; more than one marquee per page.
    intent: [animate, replace]
    intensity: subtle
    moods: [minimal, calm, refined]
    picks: [oc/logo-cloud, magicui/marquee, motion-primitives/infinite-slider, aceternity/infinite-moving-cards]
  - key: content-swap
    label: Animated panel swap (tabs-like)
    feel: Slides cross-fade/slide in the direction of travel with a progress indicator — reads as a guided tour.
    when: Feature walkthroughs and onboarding steps where each slide is text + visual.
    avoid: Long lists of homogeneous items (use a real carousel or grid).
    intent: [animate, replace]
    intensity: medium
    moods: [refined, technical, calm]
    picks: [motion-primitives/transition-panel, cult-ui/feature-carousel, cult-ui/loading-carousel, motion/animate-presence-modes]
  - key: expand-cards
    label: Card carousel that expands into detail
    feel: Apple-style rail of tall image cards; tapping one opens a rich detail view.
    when: Stories, use cases, product lines — consumer and premium marketing.
    avoid: Data-dense product UI; hard-coded neutral colours need token swaps.
    intent: [replace]
    intensity: medium
    moods: [premium, organic, editorial]
    picks: [aceternity/apple-cards-carousel, motion-primitives/morphing-dialog]
  - key: stack-deck
    label: Stacked deck / swipe cards
    feel: Cards sit in a physical pile; the top one swipes or cycles away to reveal the next.
    when: Testimonials, onboarding tips, playful pickers, mobile-first flows.
    avoid: When users need to compare items side by side.
    intent: [replace]
    intensity: medium
    moods: [playful, warm]
    picks: [aceternity/card-stack, react-bits/stack, kibo-ui/deck, react-bits/card-swap]
  - key: depth-3d
    label: Depth / 3D ring carousel
    feel: Items recede on a perspective rail or ring with momentum drag — showpiece energy.
    when: Portfolios, galleries, product launches, art-directed landing pages.
    avoid: Product UI and accessibility-critical flows; keyboard support varies, test it.
    intent: [replace]
    intensity: expressive
    moods: [experimental, premium, futuristic]
    picks: [react-bits/depth-carousel, cult-ui/three-d-carousel, react-bits/circular-carousel, aceternity/3d-marquee]
  - key: fullbleed-images
    label: Full-bleed image slideshow
    feel: Large images with cinematic transitions (fade, blur or WebGL melt) and overlaid copy.
    when: Hero slideshows for photography, travel, hospitality; image-led brands.
    avoid: When the first slide alone would do (it usually would); WebGL melt on low-end mobile.
    intent: [replace]
    intensity: expressive
    moods: [organic, premium, editorial]
    picks: [aceternity/images-slider, react-bits/morph-slider, originkit/blurcarousel]
---

**Recommend.** First ask whether it should be a scroll-snap row or grid. If it must move: `marquee` for logos/quotes, `polish-slide` for everything else.

**What makes a carousel feel good.** Direct manipulation (drag/swipe follows the finger 1:1, then snaps with a
spring), a visible "there's more" cue (peeking next item, dots, progress), and transitions that move in the
direction of travel. Usually the best carousel is a horizontal scroll-snap row or a grid — ask whether it needs
to be a carousel at all.

**Common mistakes.** Autoplay that moves content while someone reads it. Arrows that only appear on hover
(invisible on touch). Infinite loops that make position meaningless. Marquee items that are links (moving
targets). Duplicated marquee children announced twice by screen readers.

**Accessibility musts.** Autoplay must pause on hover, focus and via an explicit pause button (WCAG 2.2.2);
stop all autoplay and marquees under `prefers-reduced-motion`. Use `aria-roledescription="carousel"`, label
slides "3 of 7", keep arrows as real buttons with `aria-label`, support ←/→. Hide marquee duplicates with
`aria-hidden`.

**Performance.** Lazy-load off-screen slide images (`loading="lazy"`, `sizes`). Marquees should be pure CSS
transform animations; keep items light because they're duplicated. WebGL sliders and 3D rings: one per page,
lazy-mounted, paused off-screen.
