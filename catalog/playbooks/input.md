---
component: input
title: Inputs, search, prompts & form fields
categories: [input, form]
aliases: [input, text field, field, form field, form, search, search bar, search box, prompt, prompt input, chat input, composer, textarea, select, combobox, dropdown select, checkbox, toggle, switch, otp, password, file upload, dropzone]
directions:
  - key: field-feedback
    label: Focus, validation & error feedback
    feel: Crisp focus ring, inline error that appears with a tiny shake, helper text that never jumps the layout.
    when: Every form. The most important upgrade for any field.
    avoid: Shaking on every keystroke (validate on blur/submit), red borders without a message.
    intent: [add-state, animate, polish]
    intensity: subtle
    moods: [trustworthy, refined, minimal]
    picks: [transitions/error-state-shake, originui/comp-06, originui/comp-03, motion/characters-remaining]
  - key: restyle-fields
    label: Restyle — better field anatomy
    feel: Same shadcn input, better parts — inset/overlapping labels, character counters, password strength, tags.
    when: Fields look default or need structure (counts, inline buttons, masks, tags, combobox search).
    avoid: Floating-label tricks that hide the label once typed (keep it visible).
    intent: [restyle]
    moods: [minimal, trustworthy, refined]
    picks: [originui/comp-33, originui/comp-51, originui/comp-56, originui/comp-229]
  - key: search-field
    label: Search with kbd hint, clear & loading
    feel: ⌘K hint, an × that dissolves the query smoothly, a quiet loading line while results fetch.
    when: App header search, filter inputs, docs search.
    avoid: Search with no visible submit or results feedback.
    intent: [add-state, animate, restyle]
    intensity: subtle
    moods: [technical, refined, minimal]
    picks: [originui/comp-25, transitions/input-clear-dissolve, originui/comp-26, cult-ui/halo-search]
  - key: toggles
    label: Tactile switches & checkboxes
    feel: Thumb travels with a small overshoot, checkmark draws itself — booleans feel decisive.
    when: Settings rows, feature flags, to-dos, consent checkboxes.
    avoid: Bouncy toggles in finance/enterprise forms (keep the overshoot tiny).
    intent: [animate, polish]
    intensity: subtle
    moods: [refined, warm, playful]
    picks: [transitions/toggle, transitions/checkbox-check, cult-ui/halo-switch]
  - key: ai-prompt
    label: AI prompt composer
    feel: Auto-growing textarea with attachments, model picker, send/stop — or a hero input with cycling placeholders that vanishes on submit.
    when: Chat/agent products; hero "ask anything" inputs on AI landing pages.
    avoid: Plain forms (it's overkill); Beautiful UI's foundation.css (redefines --accent).
    intent: [replace, add-state]
    intensity: medium
    moods: [futuristic, calm, refined]
    picks: [oc/prompt-composer, aceternity/placeholders-and-vanish-input, react-bits/prompt-bar, beautifui/prompt-bar]
  - key: glow-focus
    label: Animated glow / beam on focus
    feel: A soft halo or travelling beam lights the field on focus — the input becomes the hero.
    when: One hero input (search, prompt, waitlist email) on soft-glass/futuristic pages.
    avoid: Every field in a form; retint the rainbow defaults to the theme.
    intent: [animate, restyle]
    intensity: medium
    moods: [futuristic, playful, premium]
    picks: [cult-ui/halo-input, cult-ui/border-beam-input, librariesdev/border-beam]
  - key: specialised
    label: Specialised inputs (OTP, upload, expanding search)
    feel: Purpose-built controls — one-time-code slots that handle paste/autofill, a dropzone with states, a search that expands from an icon.
    when: Auth flows, uploads, compact toolbars.
    avoid: Rebuilding these from scratch — they have tricky edge cases.
    intent: [replace]
    intensity: medium
    moods: [refined, playful, technical]
    picks: [react-bits/code-slots, kibo-ui/dropzone, aceternity/gooey-input, originui/comp-44]
---

**Recommend.** `field-feedback` first — errors and focus matter more than any effect. Then `restyle-fields`; `glow-focus` only for one hero input.

**What makes an input feel good.** Visible labels, generous hit area, an obvious focus state, and feedback at the
right moment: format hints before typing, validation on blur, errors that say how to fix it, success that
doesn't shout. The field shouldn't move — reserve space for helper/error text.

**Common mistakes.** Placeholder-as-label. Validating while the user is still typing. Error colour without text.
Animated glows on every field in a form. Custom selects that break native keyboard/typeahead. Prompt boxes that
submit on Enter in multi-line contexts without Shift+Enter. Disabled submit buttons with no reason given.

**Accessibility musts.** `<label for>` on every field; helper and error text linked via `aria-describedby`,
`aria-invalid="true"` on errors, and an `aria-live="polite"` region (or focus move on submit) so errors are
announced. Use Radix/shadcn primitives for select, combobox, checkbox, switch. OTP: one real input owning focus
and `autocomplete="one-time-code"`. Never remove the focus ring. Under `prefers-reduced-motion` no shake, glow
loops or placeholder cycling — swap to colour/text changes.

**Performance.** Keep keystroke handlers cheap (debounce search ~150–250ms). Animated border beams and shader
glows run continuously — only while focused. Rich editors (`kibo-ui/editor`) and prompt composers with shader deps
should be lazy-loaded.
