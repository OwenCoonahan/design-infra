---
component: stat
title: Stats, numbers & KPIs
categories: [stats]
aliases: [stat, stats, statistic, number, numbers, kpi, metric, metrics, counter, count up, odometer, big number, price, score, ticker]
directions:
  - key: count-up-on-view
    label: Count up once when in view
    feel: Big numbers tick up from zero the first time they're seen, then stay put. Proof that lands.
    when: Marketing stat rows ("99.99% uptime", "2.4B requests"). Once per number per page view.
    avoid: Dashboards (real data shouldn't perform) and numbers that update live.
    intent: [animate]
    intensity: subtle
    moods: [refined, trustworthy, technical]
    picks: [magicui/number-ticker, react-bits/count-up, motion-primitives/animated-number]
  - key: rolling-change
    label: Rolling digits on change
    feel: When a value changes, only the digits that changed roll or pop — the eye catches the delta, not the whole number.
    when: Live KPIs, prices with a plan toggle, counters, cart totals, timers.
    avoid: Values that change many times per second (throttle or skip animation).
    intent: [animate, add-state]
    intensity: subtle
    moods: [refined, technical, minimal]
    picks: [transitions/number-pop-in, motion-primitives/sliding-number, cult-ui/rolling-number]
  - key: restyle-kpi
    label: Restyle as real KPI tiles / proof row
    feel: Label, big tabular value, delta chip with direction-aware colour, sparkline — or a calm hairline proof row.
    when: The numbers look like plain text; dashboards need context (trend, comparison) more than motion.
    avoid: Delta colours that assume up = good (churn, latency) — use the invert option.
    intent: [restyle, replace]
    moods: [trustworthy, refined, minimal, technical]
    picks: [oc/stat-cards, oc/stats-row]
  - key: gauge
    label: Gauge / ring for proportions
    feel: A ring or radial bar fills to the value with the number in the centre — progress at a glance.
    when: Quotas, completion, scores, usage vs limit.
    avoid: Unbounded values (a gauge implies a max).
    intent: [replace, add-state]
    intensity: subtle
    moods: [trustworthy, refined, playful]
    picks: [shadcn/chart-radial-text, magicui/animated-circular-progress-bar, shadcn/chart-pie-donut-text]
  - key: slot-reel
    label: Slot-machine reels
    feel: Each digit spins on its own reel and lands with a little fanfare.
    when: Points, rewards, follower counts, gamified moments, launch counters.
    avoid: Serious finance/health UIs and frequently-updating values.
    intent: [animate]
    intensity: medium
    moods: [playful, bold]
    picks: [transitions/spinning-counter, react-bits/counter]
  - key: market-ticker
    label: Finance ticker
    feel: Symbol, price and coloured change in a compact composable row.
    when: Fintech, crypto, market data strips.
    avoid: Non-market numbers (it reads as stock data).
    intent: [replace]
    moods: [trustworthy, technical]
    picks: [kibo-ui/ticker]
  - key: split-flap
    label: Split-flap board
    feel: Mechanical departure-board characters clack into place — nostalgic, loud, unmissable.
    when: Launch countdowns, retro/brutalist brands, one headline number.
    avoid: Anything users need to read quickly or repeatedly.
    intent: [animate, replace]
    intensity: expressive
    moods: [retro, bold, experimental]
    picks: [react-bits/split-flap-text, aceternity/text-flipping-board]
---

**Recommend.** `count-up-on-view` for marketing numbers, `rolling-change` for live product numbers, `restyle-kpi` when numbers lack context.

**What makes a number feel good.** Tabular figures (`tabular-nums`) so digits don't jitter, a unit and label that
say what it means, context (delta, period, comparison), and animation that draws attention to *change* rather
than performing on every render. Marketing numbers count once; product numbers only move when the data moves.

**Common mistakes.** Count-ups that replay on every scroll. Animating from 0 on a dashboard refresh (implies the
value dropped). Proportional fonts making the layout wobble while digits roll. `text-black dark:text-white`
defaults (Magic UI number-ticker) instead of `text-foreground`. Green-means-up for metrics where up is bad.

**Accessibility musts.** Screen readers should get the final value, not every intermediate frame — render the
final number in an `aria-label` or visually-hidden span and `aria-hidden` the animating digits. Live-updating
KPIs: `aria-live="polite"` at most, throttled. Never colour-only deltas (add ▲/▼ or +/−). Under
`prefers-reduced-motion` show the final value immediately.

**Performance.** Use transform-based digit reels or `requestAnimationFrame` counters, not `setInterval` re-renders
of a whole card. Trigger count-ups with IntersectionObserver (`in-view`) once. Format with `Intl.NumberFormat`.
