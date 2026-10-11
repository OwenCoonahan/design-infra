---
component: navigation
title: Navigation — navbars, menus, docks
categories: [navigation, sidebar]
aliases: [navigation, nav, navbar, nav bar, header, top bar, menu, dropdown, dropdown menu, mega menu, mobile menu, hamburger, sidebar, dock, toolbar, breadcrumb, command palette]
directions:
  - key: hover-highlight
    label: Sliding hover/active highlight
    feel: A pill glides between nav items under the pointer and settles on the active one. Small detail, big polish.
    when: Default upgrade for marketing navbars, app top-nav, segmented nav pills.
    avoid: Overshooting springs in dense app chrome.
    intent: [animate, polish]
    intensity: subtle
    moods: [refined, minimal, technical]
    picks: [motion-primitives/animated-background, transitions/tabs-sliding, react-bits/pill-nav, motion/shared-layout-animation]
  - key: dropdown-origin
    label: Origin-aware dropdowns & mega menu
    feel: Menus scale/fade from their trigger, and a mega menu's panel morphs between sections instead of closing and reopening.
    when: Any dropdown/menubar; marketing navs with product/resources menus.
    avoid: Slow (250ms+) menu opens — menus should feel instant.
    intent: [animate, polish]
    intensity: subtle
    moods: [refined, trustworthy, premium]
    picks: [transitions/menu-dropdown, aceternity/navbar-menu, originui/comp-578]
  - key: scroll-aware
    label: Scroll-aware navbar (shrink / hide / pill)
    feel: The full-width bar condenses into a floating pill on scroll, or hides on scroll-down and returns on scroll-up.
    when: Long marketing pages; the "modern landing page" nav.
    avoid: App UIs (navigation should be stable); hiding the nav on short pages.
    intent: [animate, add-state]
    intensity: medium
    moods: [refined, premium, futuristic]
    picks: [aceternity/resizable-navbar, aceternity/floating-navbar, oc/navbar, motion/scroll-hide-header]
  - key: mobile-menu
    label: Mobile menu with morphing icon & staggered items
    feel: Hamburger morphs into ✕, the panel slides in, links cascade in 30–40ms apart.
    when: Every responsive marketing site — the mobile menu is often the most-used nav.
    avoid: Full-screen takeovers for 4 links (a sheet is enough).
    intent: [animate, replace]
    intensity: medium
    moods: [refined, playful, bold]
    picks: [transitions/icon-swap, react-bits/staggered-menu, react-bits/card-nav, oc/navbar]
  - key: restyle-app-header
    label: Restyle — product header / app shell
    feel: Real app chrome — breadcrumb + project switcher, search, notifications, user menu; or a collapsible sidebar shell.
    when: The app nav is a marketing navbar in disguise, or there's no coherent shell yet.
    avoid: Building a custom sidebar when shadcn's covers it.
    intent: [restyle, replace]
    moods: [trustworthy, technical, minimal]
    picks: [oc/app-shell, originui/comp-583, originui/comp-589, shadcn/sidebar-07]
  - key: command-palette
    label: Add a ⌘K command palette
    feel: Power users jump anywhere from the keyboard; the nav becomes optional for them.
    when: Apps with more than ~10 destinations or actions; dev tools.
    avoid: Simple marketing sites.
    intent: [add-state]
    intensity: subtle
    moods: [technical, refined]
    picks: [originui/comp-333, originui/comp-25]
  - key: expandable-toolbar
    label: Expandable toolbar / notch
    feel: A compact floating bar that expands into search or a panel in place.
    when: Editors, canvases, media apps, portfolio navs.
    avoid: Primary navigation for content sites. Retint motion-primitives' hard-coded zinc.
    intent: [replace, animate]
    intensity: medium
    moods: [refined, playful, futuristic]
    picks: [motion-primitives/toolbar-expandable, motion-primitives/toolbar-dynamic, aceternity/notch]
  - key: dock
    label: macOS-style magnifying dock
    feel: Icons swell under the cursor — playful, personal, memorable.
    when: Portfolios, side projects, OS-like experiences.
    avoid: SaaS navigation and anything with text labels users need.
    intent: [replace]
    intensity: expressive
    moods: [playful, experimental]
    picks: [magicui/dock, motion-primitives/dock, aceternity/floating-dock]
---

**Recommend.** `hover-highlight` + `dropdown-origin` for marketing navs, `mobile-menu` always; `restyle-app-header` + `command-palette` for apps.

**What makes navigation feel good.** It's stable and predictable: same place on every page, current location
clearly marked, menus that open instantly (≤150ms) from their trigger and close on Esc/outside click. Motion in
navigation should orient (where am I, where did that come from) — never delay.

**Common mistakes.** Hover-only menus with no click/keyboard path. Mega menus that close when the pointer crosses
a gap. Hiding the navbar in app UIs. Docks and gooey indicators as primary SaaS nav. Mobile menus that don't lock
scroll or trap focus. Navbars that change height on scroll and shift the content below.

**Accessibility musts.** `<nav aria-label>` landmarks, `aria-current="page"` on the active link. Use Radix
NavigationMenu/DropdownMenu for menus (arrow keys, Esc, focus return). Mobile menu: button with `aria-expanded`
and `aria-controls`, focus trapped while open. Skip-to-content link. Under `prefers-reduced-motion` menus appear
without scale/slide, navbar shrinks without animating.

**Performance.** Scroll-aware navbars should use a passive listener or `useScroll` with thresholds, toggling a
class rather than re-rendering on every pixel. Keep `backdrop-filter` on the navbar modest (one blurred layer).
Dock magnification should be transform-only.
