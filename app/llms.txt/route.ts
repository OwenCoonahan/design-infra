import { REPOSITORY_URL, SITE_URL } from "@/lib/config"

export function GET() {
  return new Response(`# design-infra

> A shared component catalog, registry and design-reference toolkit. Use compatible existing components to improve the user's UI while preserving their stack and brand.

## Start here
- [Agent setup and first-reply instructions](${SITE_URL}/integrate/raw): inspect the project, connect MCP or HTTP, then recommend live options or choose and implement within the user's authorization.
- [Reference and replacement workflow](${SITE_URL}/reference/raw): inspect links/images using your own tools, then match observed patterns or propose section replacements.
- [Usage guide](${SITE_URL}/guide): everyday examples and feedback.
- [Source repository](${REPOSITORY_URL}): local catalog data, source notes and skills.

## Tools
- [MCP](${SITE_URL}/mcp): Streamable HTTP; search_components, propose_options, plan_ui, match_reference, find_references and get_component.
- [Search](${SITE_URL}/api/search?q=clean%20pricing): HTTP component search.
- [Plan](${SITE_URL}/api/plan?brief=clean%20data%20website): page structure, research destinations and component picks. Inspect actual examples before composing.
- [Component options](${SITE_URL}/api/options?component=features&intent=replace): distinct replacement directions.
- [Tested starters](${SITE_URL}/api/starter): a small optional shelf, with verification scope.

Recommend first: return three compatible options with catalog IDs, live/gallery links, access requirements, a comparison and a reasoned recommendation; wait for the user's pick.
Choose and build: research, select, implement one requested improvement, verify the result and report component/source links and actual checks. Report catalog gaps and connection limitations honestly. Paid references need the user's own access; accessible alternatives are available.
`, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
