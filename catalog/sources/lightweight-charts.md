---
slug: "lightweight-charts"
name: "TradingView Lightweight Charts"
url: "https://tradingview.github.io/lightweight-charts/docs"
summary: "Canvas time-series and financial charts with line, area, baseline and OHLC styling."
type: "npm"
access: "free"
license: "Apache-2.0; preserve the upstream license and notices. See source-specific terms below."
stack: ["JavaScript", "canvas"]
install: "pnpm add lightweight-charts"
vendorable: true
---

# TradingView Lightweight Charts

Canvas time-series and financial charts with line, area, baseline and OHLC styling.

## Use it for

Use the free Lightweight Charts package, not TradingView Advanced Charts or a market-data service. Client-side only. Preserve the Apache license/NOTICE and required visible TradingView attribution/link described in the official guide. API v5 uses addSeries with series definitions; older addLineSeries tutorials differ. Provide your own licensed data and clean up charts/subscriptions.

Moods: technical, refined. Compare its chart form and treatment with the project’s existing components before adding another library.

## Install selected packages

```bash
pnpm add lightweight-charts
```

Choose versions compatible with the current project; do not change its framework, theme or UI system automatically. The command installs the packages, not a finished component or screen. Read the linked API/example and adapt it to actual data and design tokens.

## Starting options

- [Financial line chart](https://tradingview.github.io/lightweight-charts/docs/series-types#line) — A Canvas time series with configurable line styling.
- [Financial area chart](https://tradingview.github.io/lightweight-charts/docs/series-types#area) — A filled Canvas time-series surface.
- [Candlestick chart](https://tradingview.github.io/lightweight-charts/docs/series-types#candlestick) — Open/high/low/close observations with body and wick styles.
- [Baseline chart](https://tradingview.github.io/lightweight-charts/docs/series-types#baseline) — Different fills above and below a meaningful baseline.
- [Time-series volume bars](https://tradingview.github.io/lightweight-charts/docs/series-types#histogram) — The upstream HistogramSeries draws time-indexed bars, not a statistical distribution histogram.

## Machine access and provenance

- [Public documentation](https://tradingview.github.io/lightweight-charts/docs).
- [Repository and license](https://github.com/tradingview/lightweight-charts).
- [Published package metadata](https://registry.npmjs.org/lightweight-charts/latest).
- Refresh with `pnpm sync lightweight-charts` or `pnpm sync charts`, then `pnpm catalog`. Source inputs: `catalog/chart-libraries.json`. No vendor source is copied into this repo.

## Gotchas

Use the free Lightweight Charts package, not TradingView Advanced Charts or a market-data service. Client-side only. Preserve the Apache license/NOTICE and required visible TradingView attribution/link described in the official guide. API v5 uses addSeries with series definitions; older addLineSeries tutorials differ. Provide your own licensed data and clean up charts/subscriptions.

Required package metadata, audited 2026-10-19:

| Package | Version | Published peers |
| --- | --- | --- |
| `lightweight-charts` | `5.2.1` | None declared; runtime compatibility still needs checking. |

These are published peer ranges, not proof that a given combination builds in a consumer. Preserve units, missing-data behavior, readable labels and a keyboard/nonvisual alternative. Cancel simulations, animation loops, observers and subscriptions on unmount. Renderer tags describe library capabilities; individual examples can use a subset or require additional adapters.

## Verification and previews

Package names, free license metadata and public reference URLs were checked on 2026-10-19. This is not fresh-project runtime, browser, accessibility or performance verification of the upstream libraries. Local preview adapters are not added by this ingestion. External examples remain on their source sites; docs are not automatically embedded and no package is installed into the catalog app or consumer setup.
