# Agent status / "thinking" indicator

## When to use
Any time an AI agent is working for more than ~400ms. Replace generic spinners — users trust
agents more when they can see *what kind* of work is happening.

## Anatomy & states
- **Indicator** (orb / shimmer) that changes with the activity: thinking, searching, reasoning,
  writing, waiting for approval, idle.
- **Verb label** ("Searching…") + optional **detail** (query, file, step 2/5).
- **Expandable trace** for long runs (reasoning steps, tool calls).
- Terminal states: done (check morph), error (shake + message), cancelled.

## Accessibility musts
- `role="status"` + `aria-live="polite"` on the label; don't announce every token.
- Respect `prefers-reduced-motion` (stop shimmer, keep the text).
- Never rely on animation alone to convey state — always show the verb.

## Best implementations
- `oc/agent-status` — orb + shimmering verb, theme-aware, 2 sizes.
- `librariesdev/thinking-orbs` — the orb itself (9 states).
- `beautifui/thinking-state` — expandable reasoning/search/code trace.
- `transitions/thinking-states`, `transitions/shimmer-text`, `transitions/success-check` — motion recipes.
- `aceternity/multi-step-loader` — full-screen multi-step progress.
