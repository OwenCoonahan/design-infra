# Design-infra website

The gallery uses its existing Geist typography, dark neutral surfaces and direct navigation. Preserve the component search, comparisons and copy-to-agent workflows when changing presentation. Theme previews retain each selected design system's tokens independently of the gallery chrome.

Primary navigation is Catalog, Guide and Connect. Saved references live under More at the existing /inspiration routes; retain their analyses and planner integration. Only show a preview frame when an approved screenshot exists.

## Homepage header

The user likes the existing setup and requests a more expressive header, using the cursor-influenced motion at https://motion.dev/ as a reference. Use two clear columns: title, purpose and a compact copyable starting prompt on the left; one large cursor-influenced motion playground on the right. The headline leads the content, and the motion does not displace it. Keep the headline and copy control stable. Stack the introduction and prompt before the playground on smaller screens.

The homepage's warm accent is scoped to `.home-motion-hero` as `--site-motion-accent`. It does not alter registry theme tokens. The reusable `oc/kinetic-field` defaults to the consumer's primary and foreground tokens.

Use its square layout for the large homepage playground. The default wide layout stays suited to compact gallery frames. Each layout projects the particles into its own viewport so the larger presentation does not stretch a smaller drawing.

## Homepage explanation

Explain the purpose plainly: a library of UI components and design references that people can browse or use through Claude Code and Codex. Follow the introduction with four large numbered steps: copy the prompt, describe the work, find suitable parts, then build and refine. Use prominent section titles for the workflow, example requests and visual directions. Keep each step actionable with a link to its next destination; avoid duplicating the workflow in a separate agent-focused list.

The usage section rotates through concrete requests every two seconds while visible. Keep the question prominent and selectable, with previous/next, pause/play and direct example selection. Mouse hover and arrow clicks keep rotation running; keyboard focus, offscreen and hidden-tab states stop the timer. Copying pauses rotation. Explicit play resumes even while its button has focus. Reduced motion starts static and can explicitly enable rotation. Copying includes the catalog connection instructions and the current request; provide selectable text if clipboard access fails. Automatic rotation should not announce every change to screen readers. Show an original miniature UI screenshot labeled as an example attachment, with “Screenshot added” and a reminder to attach the user’s own image. The main copy panel offers one neutral starting prompt to connect the catalog; recommendation and implementation choices belong to subsequent tasks.

Keep the copied starting prompt to one short sentence: integrate the repository into this project and show how to use it. Detailed setup rules live in the linked guide. Put example requests in the dedicated rotating section below the hero; after connection the agent also provides a few examples in the same chat.

Rotating questions use the shared quiet motion: fade and slide the current request out, then bring the next one in. Reserve space for the longest question, label and gallery link at each viewport so the card, screenshot and controls stay still. Switch the counter and gallery link with the displayed question; copying pins that question and cancels a pending change. Reduced motion and offscreen/hidden states switch directly without a transition.

The guide leads with four spacious numbered sections: connect, show the target with a screenshot, find suitable parts, then build/check/refine. Keep supporting reference material below in labeled expandable sections. Render both the website and raw guide from docs/GUIDE.md.

## Motion

Use the shared `lively` spring preset for pointer response and shape changes. `oc/kinetic-field` offers Orbit, Wave and Sphere forms, pointer tilt/displacement and pause/play. Reduced-motion and coarse-pointer visitors start with a static view and can explicitly play. Preference changes reset the override. Visibility and intersection controls stop the drawing loop while hidden or offscreen. The server-rendered SVG remains a fallback for disabled JavaScript or unavailable Canvas.

Motion demonstrates the catalog's usefulness without moving the heading, navigation or copy button. The implementation uses free Motion APIs and original geometry; no Motion+ source or reference-site artwork is included.

## Sound

The playground has optional quiet ambient tones with a subtle shimmer. Generate the original composition in the browser, with a slowly breathing chord, gentle stereo spread and a soft reverberant tail. Cursor movement can slightly change its brightness; avoid sharp notes or sudden volume changes.

Start muted on every visit. Create the audio context only after the user enables sound. Provide a labeled mute toggle and volume slider, fade changes, suspend audio while the playground is offscreen or the tab is hidden, and close the context when navigating away. Sound is independent of motion playback and can accompany the static reduced-motion view. Retain useful controls and clear feedback if audio is unsupported or cannot start. No audio files, subscription services, microphone access or external sound requests are needed.
