# Build from a reference, or replace a section

Use this workflow in the project where the UI is being built. The user can paste a website link, a component demo, or a screenshot into their current agent. Design-infra helps the agent find and use real components after it inspects the reference.

## A link or picture: “make ours like this”

1. **Look at the reference.** Open the URL with the agent's browser, inspect the relevant desktop/mobile views, and observe interactions where useful. For an attached image, inspect the image directly. Extract the section order, layout, density, type hierarchy, spacing, surfaces, and visual details. Separate observed behavior from guesses: a still picture doesn't establish hover states or animation timing. If the agent cannot view the reference, explain what's missing and ask for accessible input; a URL string alone is insufficient.
2. **Read the target project.** Locate the component or page being changed, read DESIGN.md and its code, and retain its content and behavior requirements. Preserve the current brand unless the user asks to adopt the reference's look. A request to recreate a whole page can authorize building; a request for options calls for a shortlist first.
3. **Map the reference to reusable parts.** Use `match_reference` with the observations and named patterns, or the HTTP request below. This tool matches supplied descriptions; it does not fetch the URL or inspect an image. Use `search_components` for additional alternatives and `get_component` for integration notes. Keep the reference's section order when recreating a page; don't replace it with a generic page recipe.
4. **Explain the fit.** For each relevant section, show the closest reusable component, a useful alternative, gallery/live links, and a compare link. State what matches, what needs adaptation, and what remains a custom detail. The closest catalog result is a starting point, not a promise of an exact visual match. If the user wants choices, offer 3–5 different approaches, recommend one, and wait for their pick. If they already asked the agent to choose and build, proceed and explain the choices.
5. **Assemble and verify.** Install the selected compatible components, adapt layout and styling to the observed reference and project tokens, and keep the project's copy, assets, props, data bindings, and accessibility. Use original implementation for unmatched details; don't pull proprietary source from a reference. Check the result against the reference and in the actual project at desktop/mobile widths. Verify important states, keyboard behavior, and reduced motion. Show before/after screenshots when available and identify remaining differences.

The agent's own browser/image capabilities supply the visual analysis. The catalog supplies reusable parts. You don't need to ingest the reference into the shared library or clone this repo to use it in a project. Save it to design-infra separately when the user wants to grow the shared catalog.

## An existing section: “switch this out; I don't like the look”

Locate the section from the screenshot, visible text, annotation, or file. Read its code and identify its job: features, pricing, hero, testimonials, navigation, etc. Keep requirements such as toggle behavior, links, responsiveness, and dynamic content.

Call `propose_options` with the actual component type, `intent: "replace"` or `"restyle"`, the user's wording, project moods, and motion language. HTTP fallback:

```text
GET https://www.owencoonahan.xyz/design-infra/api/options?component=feature%20section&category=features&intent=replace&request=I%20don%27t%20like%20the%20look
```

Show 3–5 alternatives that differ in approach: for a features section, a **bento grid**, a **simple feature list**, and **scroll-linked feature panels** are useful choices. Five minor variations of the same effect are less useful. Keep each example grounded in an actual catalog item and live demo. Explain the tradeoff and recommend one for this project's content and brand.

| Direction | Why use it here | Look before choosing |
| --- | --- | --- |
| Bento grid · `oc/feature-bento` | Scannable overview of several capabilities | [Gallery](https://www.owencoonahan.xyz/design-infra/components/oc/feature-bento) · [Live](https://www.owencoonahan.xyz/design-infra/preview/oc/feature-bento) |
| Feature list · `oc/feature-list` | Clear text hierarchy and compact layout | [Gallery](https://www.owencoonahan.xyz/design-infra/components/oc/feature-list) · [Live](https://www.owencoonahan.xyz/design-infra/preview/oc/feature-list) |
| Feature panels · `oc/feature-levels` | More room for product imagery and a guided narrative | [Gallery](https://www.owencoonahan.xyz/design-infra/components/oc/feature-levels) · [Live](https://www.owencoonahan.xyz/design-infra/preview/oc/feature-levels) |

[Compare these examples](https://www.owencoonahan.xyz/design-infra/compare?ids=oc/feature-bento,oc/feature-list,oc/feature-levels). These are examples; choose candidates for the user's actual section rather than always offering this set.

When the target is clear, show the options immediately. “I don't like this” need not trigger an extra questionnaire. Ask a focused question only if you cannot identify the section or an essential requirement. If the user wants to see finalists in their own UI, render a temporary comparison with their content, then apply the chosen option and remove unused variants. Otherwise apply their pick directly.

Record the choice and reason in the project's design notes for continuity. Share feedback with the shared catalog only when requested; one person's rejection should not become every friend's preference.

## Agent tool request for an observed reference

MCP: `match_reference`. HTTP: `POST https://www.owencoonahan.xyz/design-infra/api/reference` with `Content-Type: application/json`:

```json
{
  "source": "https://example.com",
  "description": "Observed a clean landing page with a compact navbar, split hero, and spacious feature cards.",
  "patterns": [
    { "name": "navbar", "category": "navigation", "requiredFeatures": ["mobile menu"] },
    { "name": "split hero", "category": "hero", "description": "Copy on the left, product image on the right" },
    { "name": "feature section", "category": "features", "description": "Bento grid with mixed card sizes", "requiredFeatures": ["three product capabilities"] }
  ],
  "moods": ["minimal", "refined"],
  "options_per_pattern": 3
}
```

Provide real observations instead of forwarding an uninspected URL. Omit `source` for screenshots. The result preserves the pattern order, includes live/gallery/install information and per-pattern comparisons, and marks sections with no matches as catalog gaps. `requiredFeatures` is a review checklist for the agent; matching does not prove behavior support. Optional `motion_language` and `theme` apply the project's motion budget and preview theme.
