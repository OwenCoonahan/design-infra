import { configureText } from "./config"

const start = configureText("Use https://github.com/OwenCoonahan/design-infra in this project. Follow https://design-infra.vercel.app/integrate/raw to connect the catalog; preserve our stack and brand.")

export const AGENT_PROMPTS = {
  recommend: `${start} Recommend 3 compatible component options with live links; wait for my pick. Report verification and any restart needed.`,
  implement: `${start} Choose and implement one compatible improvement using catalog components and real references. Verify the result; report component IDs, sources, changes and any restart needed.`,
}

export const SETUP_PROMPT = AGENT_PROMPTS.recommend

/** A standalone project request uses the same configurable connection instructions. */
export function projectRequestPrompt(request: string) {
  return `${start} ${request}`
}
