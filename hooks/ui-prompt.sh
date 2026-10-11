#!/usr/bin/env bash
# design-infra UserPromptSubmit hook: when a prompt looks like UI work, remind the agent (once per session)
# to pull from design-infra before building from scratch. Stdout is added to the prompt context.
set -uo pipefail
input="$(cat)"

prompt="$(printf '%s' "$input" | tr '[:upper:]' '[:lower:]')"
if ! printf '%s' "$prompt" | grep -qE '(landing|homepage|web ?app|website|frontend|front-end|(^|[^a-z])ui([^a-z]|$)|(^|[^a-z])ux([^a-z]|$)|component|hero|navbar|nav bar|pricing|dashboard|sidebar|modal|dialog|layout|redesign|restyle|styling|theme|design system|animation|animate|don.t like|cleaner|loading state|carousel|button|loader|spinner|onboarding|sign ?up page|login page|chat (ui|interface)|section|screen|page)'; then
  exit 0
fi

session="$(printf '%s' "$input" | grep -oE '"session_id"[[:space:]]*:[[:space:]]*"[^"]+"' | sed -E 's/.*"([^"]+)"$/\1/' || true)"
marker_dir="${TMPDIR:-/tmp}/design-infra-hook"
mkdir -p "$marker_dir" 2>/dev/null || true
marker="$marker_dir/${session:-nosession}"
[ -n "$session" ] && [ -f "$marker" ] && exit 0
[ -n "$session" ] && : >"$marker"

echo "[design-infra] This looks like UI work. Use design-infra before writing components: changing ONE existing component (animate it, restyle it, add a state, 'I don't like this') → refine skill / propose_options; pasted link or screenshot → inspect the reference / match_reference; replace a section → propose_options with replace intent; new page or app → build-ui / plan_ui; new piece → find-component / search_components. Show the user options with links (gallery page, live demo, compare link) and let them pick before installing unless they already authorized a choice; only hand-build genuine gaps."
