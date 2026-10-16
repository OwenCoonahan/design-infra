import { configureText } from "./config"

const start = configureText("Use https://github.com/OwenCoonahan/design-infra in this project. Follow https://design-infra.vercel.app/integrate/raw to connect the catalog; preserve our stack and brand.")

export const SETUP_PROMPT = configureText("Integrate https://github.com/OwenCoonahan/design-infra into this project and show me how to use it.")

/** A standalone project request uses the same configurable connection instructions. */
export function projectRequestPrompt(request: string) {
  return `${start} ${request}`
}
