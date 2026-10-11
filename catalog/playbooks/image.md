---
component: image
title: Images, galleries & media
categories: [image]
aliases: [image, images, photo, picture, gallery, image gallery, grid of images, media, video, thumbnail, screenshot, lightbox, before after, hero image]
directions:
  - key: blur-up
    label: Blur-up / fade in on load and view
    feel: Images resolve from a soft blur as they load and enter — never a white box popping into a photo.
    when: Every image-heavy page — galleries, blog covers, product grids. The default.
    avoid: The LCP hero image (render it immediately with priority, no entrance).
    intent: [animate, polish]
    intensity: subtle
    moods: [calm, refined, organic, editorial]
    picks: [magicui/blur-fade, motion-primitives/in-view]
  - key: lightbox-zoom
    label: Click to zoom / morph into lightbox
    feel: The thumbnail grows into a full view from where it sits, and returns there on close.
    when: Product photos, portfolios, screenshots users need to inspect.
    avoid: Decorative images (no reason to zoom).
    intent: [add-state, animate]
    intensity: medium
    moods: [refined, minimal, organic]
    picks: [kibo-ui/image-zoom, motion-primitives/morphing-dialog]
  - key: edge-treatment
    label: Edge treatment — progressive blur, glow, frame
    feel: A blurred edge for overlaid captions, a soft backlight bleeding from the media, or a device/browser frame.
    when: Captions on photos, hero screenshots, video embeds that feel pasted-in.
    avoid: Stacking several backdrop-filter layers (GPU cost) or glow on light editorial themes.
    intent: [restyle, polish]
    intensity: subtle
    moods: [premium, refined, calm]
    picks: [motion-primitives/progressive-blur, magicui/backlight, cult-ui/mock-browser-window, cult-ui/edge-blur]
  - key: compare-lens
    label: Inspect — before/after slider or magnifier lens
    feel: Users drag to compare two states or hover to magnify detail. Images become interactive evidence.
    when: Before/after (edits, redesigns, upscaling), product detail, maps and diagrams.
    avoid: Images with nothing to inspect.
    intent: [add-state, replace]
    intensity: medium
    moods: [technical, refined, trustworthy]
    picks: [motion-primitives/image-comparison, kibo-ui/comparison, magicui/lens, aceternity/compare]
  - key: gallery-layout
    label: Gallery layout — masonry, focus, expand
    feel: The grid itself does the work — masonry flow, hover focus that blurs the rest, or a tile that expands in place.
    when: Portfolios, photo-led brands, case-study indexes.
    avoid: Uniform product grids (a plain grid is clearer).
    intent: [replace]
    intensity: medium
    moods: [organic, editorial, premium]
    picks: [react-bits/masonry, aceternity/focus-cards, aceternity/layout-grid, aceternity/parallax-scroll]
  - key: video-on-hover
    label: Video previews & players
    feel: Thumbnails come alive on hover; a theme-inheriting player for the real thing.
    when: Course, media and product-demo sites; hero demo videos.
    avoid: Autoplaying audio; heavy videos above the fold on mobile.
    intent: [add-state, replace]
    intensity: subtle
    moods: [refined, organic, premium]
    picks: [kibo-ui/video-player, cult-ui/hover-video-player, magicui/hero-video-dialog]
  - key: stylised
    label: Stylised treatment — dither, pixel, ASCII
    feel: Photos rendered as 1-bit dither, pixel art or ASCII — instantly on-brand for retro/technical identities.
    when: Retro, brutalist and dev-tool brands; editorial accents.
    avoid: Product photos users must judge accurately.
    intent: [restyle]
    moods: [retro, technical, bold]
    picks: [cult-ui/dither-image, magicui/pixel-image, aceternity/dither-shader, aceternity/ascii-art]
  - key: webgl-gallery
    label: Immersive WebGL gallery
    feel: Images on a dome, ring or liquid-glass rail; chromatic split on hover — art-directed spectacle.
    when: Portfolios, fashion, art and launch microsites.
    avoid: Anything with SEO/accessibility weight on the images; low-end devices.
    intent: [replace, animate]
    intensity: expressive
    moods: [experimental, premium, futuristic]
    picks: [react-bits/dome-gallery, react-bits/circular-gallery, aceternity/chromatic-image, react-bits/flex-carousel]
---

**Recommend.** `blur-up` everywhere except the LCP hero; `lightbox-zoom` when users need detail. Galleries and WebGL only when images are the product.

**What makes images feel good.** Reserved aspect ratios (no layout shift), correct `sizes`/`srcset` so they're
sharp and light, a placeholder that matches (blur or dominant colour), and consistent radius/framing from the
theme. Motion is for loading and inspection — the photo is the content.

**Common mistakes.** Entrance animation on the LCP hero image (hurts Core Web Vitals). Parallax/zoom on every
image. Lightboxes without keyboard support. Hover-only reveals of captions on touch devices. Rounded corners on
editorial/brutalist themes that are square by design.

**Accessibility musts.** Meaningful `alt` (empty `alt=""` for decorative). Lightbox: dialog semantics, focus
trap, Esc, ←/→, visible close. Comparison sliders: a real `role="slider"` with keyboard steps and a label.
Videos: captions, no autoplay with sound, a pause control for anything that loops >5s. Under
`prefers-reduced-motion` no hover-zoom, parallax or autoplaying video — show the poster.

**Performance.** `next/image` with `priority` only for the hero; lazy everything else. Hover videos: `preload="none"`,
load on hover intent. WebGL galleries load textures for every image — cap counts, use small textures, lazy-mount
the canvas, and provide a plain grid fallback.
