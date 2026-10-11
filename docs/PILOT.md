# Try design-infra with friends

Use an existing project in Claude Code or Codex. Allow about 30 minutes. This is a pilot: record where it succeeds and where the agent needs help. Hosted setup, previews and feedback need no GitHub access.

## Invite someone

Send them https://design-infra.vercel.app/integrate and ask them to paste its setup prompt into their project's agent. The setup should preserve the stack, brand, existing component configuration and other MCP servers. The agent should report endpoint checks and any restart/trust requirement, then call search_components in the active session or use HTTP successfully.

## Three tasks

1. **Find and install:** ask “Show three clean pricing sections that fit this project.” Open the live examples and comparison. Pick one and ask the agent to integrate it. Confirm the real project builds and the section works on mobile, with keyboard navigation and existing content.
2. **Replace:** point to one existing section and say “I don't like this layout. Give me three genuinely different approaches while keeping these features.” Check that the agent offers actual replacements, explains tradeoffs and preserves behavior when applying the pick.
3. **Reference:** paste a site link or screenshot and ask for a similar hero or page. The agent should inspect the reference, identify reusable parts, show matches and explain gaps. It must not claim an exact match if the catalog lacks one.

After each task, copy a report from https://design-infra.vercel.app/feedback. Include the request, component IDs, comparison URL, stack/agent, elapsed time, what was installed or adapted and the outcome. Send it through your existing group chat. Include failed attempts; leave out credentials and private source.

## What counts as a successful pilot

Two or three friends can connect without maintainer intervention, find relevant options, see functioning live demos, install a selected part into a real project, and explain how to send feedback. Record mobile and keyboard checks, build failures, confusing results and any manually repaired setup. Automated repository checks do not substitute for these trials.

The starter page states which automated checks passed and when. It covers a Next.js/React/Tailwind fixture and gallery demos; each real project still needs verification. Separate taste profiles, shared accounts and subscription seats are not required for this pilot.

## Before a public release

Run CI and a full-history secret scan; review NOTICE.md and the current public-media policy. Git history still contains previously removed screenshots and the former vendor spotlight implementation. Do not make that history public without addressing its redistribution rights or preparing a clean release history. Preserve the private development history for collaborators. Recheck the unpatched development CLI dependency advisory recorded in SECURITY.md. Changing repository visibility remains a maintainer decision after these checks and the friend trials.
