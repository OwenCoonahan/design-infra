# Design-infra website

The gallery uses its existing Geist typography, dark neutral surfaces and direct navigation. Preserve the component search, comparisons and copy-to-agent workflows when changing presentation. Theme previews retain each selected design system's tokens independently of the gallery chrome.

## Homepage header

The user likes the existing setup and requests a more expressive header, using the cursor-influenced motion at https://motion.dev/ as a reference. Keep the two-column content and connection panel. Put one original interactive illustration above the left-hand headline; keep the headline and actions stable.

The homepage's warm accent is scoped to `.home-motion-hero` as `--site-motion-accent`. It does not alter registry theme tokens. The reusable `oc/kinetic-field` defaults to the consumer's primary and foreground tokens.

## Motion

Use the shared `lively` spring preset for pointer response and shape changes. `oc/kinetic-field` offers Orbit, Wave and Sphere forms, pointer tilt/displacement and pause/play. Reduced-motion and coarse-pointer visitors start with a static view and can explicitly play. Preference changes reset the override. Visibility and intersection controls stop the drawing loop while hidden or offscreen. The server-rendered SVG remains a fallback for disabled JavaScript or unavailable Canvas.

Motion demonstrates the catalog's usefulness without moving the heading, navigation or copy button. The implementation uses free Motion APIs and original geometry; no Motion+ source or reference-site artwork is included.
