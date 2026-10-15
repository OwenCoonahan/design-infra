# Design-infra website

The gallery uses its existing Geist typography, dark neutral surfaces and direct navigation. Preserve the component search, comparisons and copy-to-agent workflows when changing presentation. Theme previews retain each selected design system's tokens independently of the gallery chrome.

## Homepage header

The user likes the existing setup and requests a more expressive header, using the cursor-influenced motion at https://motion.dev/ as a reference. Keep the two-column content and connection panel. Put one original interactive illustration above the left-hand headline; keep the headline and actions stable.

The homepage's warm accent is scoped to `.home-motion-hero` as `--site-motion-accent`. It does not alter registry theme tokens. The reusable `oc/kinetic-field` defaults to the consumer's primary and foreground tokens.

## Homepage explanation

Explain the purpose plainly: a library of UI components and design references that people can browse or use through Claude Code and Codex. Follow the introduction with four large numbered steps: copy the prompt, describe the work, find suitable parts, then build and refine. Use prominent section titles for the workflow, example requests and visual directions. Keep each step actionable with a link to its next destination; avoid duplicating the workflow in a separate agent-focused list.

The usage section rotates through concrete requests every two seconds while visible. Keep the question prominent and selectable, with previous/next, pause/play and direct example selection. Mouse hover and arrow clicks keep rotation running; keyboard focus, offscreen and hidden-tab states stop the timer. Copying pauses rotation. Explicit play resumes even while its button has focus. Reduced motion starts static and can explicitly enable rotation. Copying includes the catalog connection instructions and the current request; provide selectable text if clipboard access fails. Automatic rotation should not announce every change to screen readers. Show an original miniature UI screenshot labeled as an example attachment, with “Screenshot added” and a reminder to attach the user’s own image. The main copy panel offers one neutral starting prompt to connect the catalog; recommendation and implementation choices belong to subsequent tasks.

Keep the copied starting prompt to two short sentences: integrate the repository, follow its setup guide, and show how to use it. Detailed setup rules live in the linked guide. Show example requests separately beneath the copy button; after connection the agent also provides a few examples in the same chat.

The guide leads with four spacious numbered sections: connect, show the target with a screenshot, find suitable parts, then build/check/refine. Keep supporting reference material below in labeled expandable sections. Render both the website and raw guide from docs/GUIDE.md.

## Motion

Use the shared `lively` spring preset for pointer response and shape changes. `oc/kinetic-field` offers Orbit, Wave and Sphere forms, pointer tilt/displacement and pause/play. Reduced-motion and coarse-pointer visitors start with a static view and can explicitly play. Preference changes reset the override. Visibility and intersection controls stop the drawing loop while hidden or offscreen. The server-rendered SVG remains a fallback for disabled JavaScript or unavailable Canvas.

Motion demonstrates the catalog's usefulness without moving the heading, navigation or copy button. The implementation uses free Motion APIs and original geometry; no Motion+ source or reference-site artwork is included.
