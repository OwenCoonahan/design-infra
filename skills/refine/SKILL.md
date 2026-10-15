---
name: refine
description: Component-level design iteration. Use when the user points at ONE piece of UI (screenshot, element, Agentation annotation, file/line, or name) and says things like "I want this to animate", "I don't like this", "make this cleaner/nicer", "add a loading/success state", "what are my replace this section, switch this out, options for this carousel/button/loader/headline?", "make it feel like company". Proposes a short menu of options WITH LINKS so the user can look and choose, then applies the pick. Never silently "fixes".
---

Read the plugin root `design-infra.config.json` for the deployment URL, repository and installation namespace. Examples below use the default deployment; substitute these settings in a fork. Stable `oc/` catalog IDs are unchanged.

# refine — discuss options for one component, then apply the pick

The user wants to *choose*, not be surprised. Your job: understand the component and intent, show 3–5
genuinely different directions with clickable previews, recommend one, wait for the pick, apply it cleanly.
If the user already authorized you to choose and implement, proceed within that scope and explain your choice.

## 1. Pin down the component and intent

- **Which component:** from the screenshot (match visible text/structure to code with grep), the Agentation
  annotation (it gives selector + source file), or the path/name they gave. Read the file. Note what it is
  (button, carousel, loader, card, headline, list, nav, input, stat, modal, toast, background, section…).
- **Project context:** read `./DESIGN.md` → `moods:`, `motion:` (still | quiet | lively | cinematic), theme slug, and
  any `## Motion` choices already made (stay consistent with them).
- **Intent:** animate · restyle · replace · add-state · polish. If the target is clear, a bare "I don't like this" is enough to show useful alternatives. Ask a focused question only if the section or an essential requirement is unclear. A request to switch out a section should offer different layouts/component approaches, not just animation effects.
- A URL or screenshot of *another* product ("make ours like this") → **reference-ui**; inspect it and map the observed patterns to catalog matches. Shared instructions: https://www.owencoonahan.xyz/design-infra/reference/raw.

## 2. Get options

MCP `propose_options` (component, category when identified, request verbatim, intent, moods, motion_language, theme) — or
`https://www.owencoonahan.xyz/design-infra/api/options?component=…&request=…&moods=…&motion=…&theme=…`.
It returns playbook **directions** (each: feel, when, avoid, intensity, picks with `page`/`live`/`docs` links),
`more` (extra catalog matches), `compare` (side-by-side live page), and `skippedBecausethe userPassed`.

Need something else? `search_components` with `query`, `category`, moods (and trigger/intensity/integration filters).

## 3. Present — links first, nothing installed yet

Format (keep it tight):

> **<Component> — <intent>** · see them side by side: <compare link>
>
> | | Direction | Feel | Cost / tradeoff | Look at it |
> |---|---|---|---|---|
> | A | Press-down + hover lift | refined, barely there | CSS only | [page](…) · [live](…) |
> | B | … | … | … | … |
>
> **My pick: A** — <one sentence tied to their DESIGN.md moods/motion and what this component does>.
> Want me to try A, or see two of them in your app first?

Wants ideas, or none of the options fit? Offer the `references` from `propose_options` (or MCP `find_references`) — "see how
others do it: <1–2 gallery links>" — then map what they like back to catalog picks.

For section replacements, consider distinct structures such as a bento grid, a compact feature list, and scroll-linked panels. Preserve the current section's job and content/behavior requirements. Link actual catalog examples and explain what each approach changes.

Rules: 3–5 directions that differ in *approach* (recipe on your markup vs. wrapper vs. drop-in replacement; subtle vs.
medium), not five near-identical libraries. Flag `key`/`metered` access. Never offer `paid`. Respect the motion
language (a `still` project gets state feedback, not scroll choreography). Mention skipped-because-you-passed items in one line.

## 4. Optional: try in their app (design lab)

When options are close or the user wants to see them with *their* content: install `@design-infra/design-lab`
(`npx shadcn@latest add @design-infra/design-lab`) — it adds `app/design-lab/page.tsx` + `components/design-lab.tsx`.
Install the 2–4 candidates, render their component in each variant inside `<DesignLab>`/`<LabOption>`, run the dev
server, give them the URL (`/design-lab`). After they choose: remove the losers, the lab page and unused deps.

## 5. Apply the pick

- Install (`npx shadcn@latest add …`) or apply the recipe/wrapper to THEIR component — keep their props, copy, a11y.
- **Hand-rolling** (recipes, `motion/*` examples, or gaps): use free `motion/react` with the project's language —
  `@design-infra/motion-presets` (`motionPreset().variants.fadeUp`, `.transition.fast`, `.press`) for Motion code, and the theme's CSS
  tokens for CSS (`duration-(--motion-fast) ease-motion-out`). Never invent new durations/easings. Never use Motion+ APIs
  (Ticker, Cursor, AnimateNumber, Typewriter, splitText…) unless the project has a Motion+ licence.
- Convert hard-coded colours to theme tokens; respect `prefers-reduced-motion`; match their DESIGN.md motion durations/easing.
- Show a before/after (screenshot if you can run the app) and the diff summary.
- Record consistency: append the choice to the project's `DESIGN.md` `## Motion` (or Components) section, e.g.
  "Buttons: press 0.98 + 120ms ease-out (transitions/learn-more-hover)".

## 6. Keep project continuity

Record the choice and reason in the project's design notes. Share picks/passes with the catalog only when
requested; prepare an issue or feedback message without sending it automatically. One friend's rejection
is not a universal dislike. Inside design-infra, explicit curation requests can update favorites/dislikes.
