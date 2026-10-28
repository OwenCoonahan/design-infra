---
slug: jakub-krehel
name: Jakub Krehel — interface skills
url: https://github.com/jakubkrehel/skills
summary: Jakub Krehel's agent skills for interface polish — exact values for radius, shadows, motion, type, colour, layout and accessibility, plus review and iteration skills. Complements design-infra (we choose what; these tighten how).
type: skill
access: free
license: MIT — Copyright (c) 2026 Jakub Krehel
stack: [Claude Code, Codex, any agent supporting SKILL.md, CSS, Tailwind, Motion]
install: npx skills add jakubkrehel/skills --skill better-ui better-typography better-colors better-accessibility better-layout -a claude-code codex -y
vendorable: true
---

# Jakub Krehel — interface skills

Jakub Krehel is a design engineer (https://jakub.kr, founding design engineer at Interfere). His public skills repo
(~8.9k stars, MIT) turns the details from his writing into rules an agent can apply with exact values.

**Use it for:** the polish pass after a component is chosen. design-infra decides *what* to build (catalog picks,
playbooks, design systems); these skills tighten *how* it renders: press scale `0.96`, enter/exit timings, concentric
radii, shadow rings instead of decorative borders, text wrapping, tabular numbers, OKLCH palettes, focus and
reduced-motion behaviour. Toolchain id `jakub-skills` (tier 2) installs the five core skills.

## Skills in the repo

| skill | what it does | installed by default |
| --- | --- | --- |
| `better-ui` | Surfaces, icons and motion with exact values: concentric radius, optical alignment, layered shadows, icon cross-fades, press scale, enter/exit, transition properties | yes |
| `better-typography` | Type scale, spacing, font features, `text-wrap`, truncation, punctuation, tabular numbers | yes |
| `better-colors` | Palettes, semantic token names, format conversion, contrast measurement | yes |
| `better-accessibility` | Keyboard/focus, ARIA, names, forms, announcements, motion and zoom against WCAG 2.2 | yes |
| `better-layout` | Grouping, alignment, reading order, responsive structure, room for translation and RTL | yes |
| `interface-review` | Reviews a branch / PR / uncommitted change for interface regressions across all of the above | optional |
| `better-interface` | One ranked report for a whole screen or flow | optional |
| `explain-interface` | Explains how a site, effect or animation was built from a URL or screenshot | optional |
| `variant` | Builds several variants of a component and helps pick one | optional |
| `state-machine` | Renders every state of a component on a throwaway page with a switcher | optional |
| `break` | Stress-tests a component under every reachable scenario on a temporary page | optional |
| `build-design` | Builds UI from a Figma file or design image with the project's tokens | optional |
| `better-writing` | Interface copy: labels, errors, empty states, confirmations | optional |
| `teardown` | Technical illustrations of objects and how things work | optional |

Separate repo: [`jakubkrehel/oklch-skill`](https://github.com/jakubkrehel/oklch-skill) (MIT) for working with OKLCH colours;
[oklch.fyi](https://oklch.fyi) is the free companion guide/picker.

```bash
# add an optional skill later
DISABLE_TELEMETRY=1 npx -y skills@latest add jakubkrehel/skills --skill interface-review -a claude-code codex -y
DISABLE_TELEMETRY=1 npx -y skills@latest add jakubkrehel/oklch-skill -a claude-code codex -y
```

## How it fits design-infra

- Choose components with `propose_options` / `plan_ui` first; run `better-ui` (or `interface-review` on the diff) after.
- Where a skill value conflicts with the project's DESIGN.md (e.g. a no-shadow brutalist system), the design system
  wins. `better-ui` itself treats a consistent project convention as a preference, not a finding.
- Motion values are compatible with design-infra's `quiet` / `lively` languages (`design-systems/MOTION.md`).
- Spinners from the same author: `loading-dev` (catalog source, `catalog/sources/loading-dev.md`).

## Further reading (link-only)

Articles on jakub.kr; every page has a markdown version at `<url>.md`. Read them; don't mirror their demos or text.

- [Details that make interfaces feel better](https://jakub.kr/writing/details-that-make-interfaces-feel-better)
- [Using shadows instead of borders](https://jakub.kr/work/shadows)
- [How I use shared layout animations](https://jakub.kr/work/shared-layout-animations)
- [Using gestures in Motion](https://jakub.kr/work/motion-gestures)
- [Understanding gradients](https://jakub.kr/work/gradients)
- [What are OKLCH colors?](https://jakub.kr/components/oklch-colors)

## Not ingested

- **interfaces.dev** (his design-engineering magazine): the archive and premium skills are subscription-gated and
  robots-disallowed (`/magazine`, `/issues-md/`). The three issues robots.txt allows may be linked; nothing is copied.
  See `catalog/SKIPPED.md`.
- `jakubkrehel/make-interfaces-feel-better` is superseded by this repo.

## Gotchas

- Skills run with full agent permissions. Review them once after install (the installer says the same).
- The installer writes `.agents/skills/<name>` (Codex) and symlinks `.claude/skills/<name>` (Claude Code), plus
  `skills-lock.json`. Commit or ignore them per project policy.
