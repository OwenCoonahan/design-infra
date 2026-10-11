---
name: polish
description: Proactive polish pass over an existing page or screen — find the handful of spots where a proven component, animation or state from design-infra would clearly improve it (static stats, abrupt modals, missing loading/empty states, plain spinners, flat buttons, unanimated tabs) and propose them as a batch of option sheets with links. Use for "review this page", "polish pass", "what would make this feel better?", "tighten up the UI".
---

Read the plugin root `design-infra.config.json` for the deployment URL, repository and installation namespace. Examples below use the default deployment; substitute these settings in a fork. Stable `oc/` catalog IDs are unchanged.

# polish — find the 3–7 upgrades worth making, propose with links

Not a redesign. A senior designer's punch list for the page as it is.

1. **Read context:** the page/components, `./DESIGN.md` (`moods`, `motion`, Do's/Don'ts). Run the app and screenshot if
   possible (desktop + mobile).
2. **Scan for upgrade spots** (prioritise by user impact):
   - missing **states**: loading (spinner → skeleton), empty, error, success feedback on submit
   - **abrupt changes**: modals/menus/tabs/toasts without enter/exit transitions; layout jumps
   - **static numbers** that change (stats, prices, counters) → number transitions
   - **interactive elements without feedback**: buttons without press/hover, cards without hover affordance
   - **first-impression moments**: hero headline, primary CTA, product screenshot framing
   - **consistency breaks**: components that ignore theme tokens or animate differently from the rest
   - **too much**: competing effects, more than one heavy effect per viewport, motion that ignores reduced-motion
3. **For each spot**, call `propose_options` (component + intent + project moods/motion) and keep the top 2–3 directions.
4. **Present one compact list**, highest impact first:
   > 1. **Pricing numbers** — static on toggle → *number pop* ([page](…) · [live](…)) or *rolling digits* ([…]) · my pick: pop
   > 2. **Signup button** — no submit feedback → *spinner → check morph* (…)
   > …
   > Compare all picks: <compare link>. Reply with the numbers/letters you want ("1a, 2, skip 3").
5. Apply only what they choose (see the **refine** skill §5–6), consistent with DESIGN.md motion; record choices there.
