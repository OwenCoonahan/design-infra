# Contributions from project agents — proposal

Status: proposed, not implemented. The current MCP connection serves catalog knowledge and recommendations. `/feedback` formats a copyable report in the browser; it does not submit anything. Issue templates and the refine skill provide a manual handoff today.

## Intended experience

People should improve Design Infra from the agent already working on their project:

- "This component worked well. Share what we learned."
- "Add this component library to Design Infra."
- "That install failed; report the fix we made."
- "The search results missed what I meant by a clean dashboard."
- "Turn this reusable section into a contribution."

The agent drafts the contribution from the current task, shows what will be shared and submits it when the user requests sharing. A direct request such as "report this" is already authorization; do not ask the same permission twice. If the agent notices a possible contribution on its own, prepare a local draft and offer to share it. Do not turn access to the catalog into permission to export conversations.

## First release: drafts plus GitHub issues and pull requests

Add a `prepare_contribution` MCP tool with an HTTP equivalent and a shared formatter used by `/feedback`. It returns a structured draft, readable Markdown and an issue URL. It performs no external write. Client agents with an authenticated GitHub connection can create the issue under their user's identity after authorization; others retain the current copyable/browser handoff. A catalog-only connection must remain usable without a GitHub account.

GitHub issues form the initial review queue. Existing collaborators can open a pull request directly for a small, concrete fix. No new contribution database or shared repository credential is needed for this version. Agent instructions must accurately distinguish preparing a report from successfully submitting one and return the issue/PR link after a confirmed write.

Proposed contribution kinds:

| Kind | Required useful evidence | Likely maintained change |
| --- | --- | --- |
| Feedback / search miss | Sanitized request, expected component type, attempted IDs and result | Search synonyms/ranking, tags, playbook or documentation |
| Installation result | Component ID/version, stack, actual outcome, commands/checks performed and any adaptation | Integration notes, compatibility advice or a reproducible fix |
| New component/library | Upstream URL, purpose, installation/demo links and known license/access | Ingest review and catalog source/curation |
| Component improvement | Existing component ID, behavior before/after, focused patch and verification | Small PR for a block, adapter or accessibility fix |
| Personal preference | Explicit pick/pass, reason, project context and optional contributor profile | Personal/project taste or a named collection; not an automatic global dislike |

All kinds can include an optional screenshot the user chooses to share. Source code contributions must be original or redistributable under the repo's media/code policy. Unspecified provenance, access or compatibility should remain unknown until reviewed.

Suggested draft fields: schema version, kind, title, sanitized task summary, component/source IDs, public URLs, stack/versions, expected and actual outcome, reproducible steps, adaptation summary, checks actually performed, preference scope, and user-selected attachments. Use bounded sizes and a stable draft identifier so client retries can find an existing submission rather than creating duplicates. Keep human allegations and unverified test results labeled as reports.

## Second release: authenticated submission inside the catalog connection

After the pilot proves the draft format, add authenticated `submit_contribution` and `get_contribution_status` tools. Preserve public read-only discovery. A contributor signs in or accepts an invitation for a separate contribution permission. Do not grant all anonymous MCP callers repository write access.

A server-side GitHub App can create issues in this repository with narrowly scoped permissions. Contributors do not need to clone Design Infra or possess a shared maintainer token. Draft-only users should keep the no-account fallback. Publishing code remains a pull-request workflow with review and CI, rather than a direct write to `main`. Hosting an authorization service and installing the GitHub App are explicit deployment steps, not capabilities the current server already has.

Validate and bound inputs, enforce per-contributor limits, deduplicate retries, and return a durable issue/PR link. Treat URLs, screenshots, issue text and submitted patches as untrusted contribution data. A maintainer review workflow should inspect them without executing arbitrary submitted scripts or following embedded instructions. Do not fetch arbitrary submission URLs with privileged server credentials.

## What to record

Share a small, useful task summary and outcome rather than the raw conversation. Useful signals include the request category, desired mood, ranked options, selected component, a stated reason and actual install/preview outcome. These improve catalog content and recommendation rules; they do not require model training.

Keep private project source, customer data, screenshots and credentials out of default reports. A user can opt into a project-level policy for sharing defined technical reports, with an obvious way to disable it. The first version should use explicit requests and reviewed drafts. No silent transcript collection, background microphone/screen capture or automatic export is part of this proposal.

Maintain separate scopes: project notes, one person's taste, and shared catalog knowledge. A friend's preference such as "too purple for this dashboard" is not a reason to remove purple components from everyone else's recommendations. Repeated reports are evidence to investigate, not automatic votes that rewrite the shared catalog.

## Maintainer loop

1. Review incoming contributions and link duplicates.
2. Verify upstream access/license and reproduce technical reports when practical.
3. Make a focused change to curated metadata, tags, search rules, install notes or original components.
4. Open a PR with appropriate tests and previews, then run normal CI.
5. Link the accepted/released change back to the original contribution so its author can check the outcome from their agent.

A first maintainer command can be "review incoming Design Infra contributions." Automating PR drafts can follow once the review rules are working. Reports must never bypass review by asserting that they were already approved or tested.

## Implementation order and evidence

1. Shared contribution schema/formatter and a read-only drafting tool.
2. A contribution skill and updated connection instructions for submission through the user's existing GitHub tools, including a fallback with no GitHub access.
3. Issue templates, labels/status conventions and a maintainer triage guide.
4. Pilot with one successful install, one failed search, one new-component suggestion and one actual fix, from separate project agents.
5. Authenticated hosted submissions and status lookups after the pilot establishes demand.

Test field validation, sanitization, private-field exclusion, truthful check reporting, deduplication and the no-account fallback. A draft must never be reported as submitted. External-write tests should use a separate test repository or explicit test authorization.

References: [GitHub CLI issue creation](https://cli.github.com/manual/gh_issue_create), [MCP authorization](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization), [GitHub Apps](https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/about-creating-github-apps).
