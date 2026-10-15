import { configureText } from "./config"

const start = configureText("Use https://github.com/OwenCoonahan/design-infra in this project. Follow https://design-infra.vercel.app/integrate/raw to connect the catalog; preserve our stack and brand.")

export const SETUP_PROMPT = `${start} Inspect the project and connect design-infra for future UI work. Search its components and real references before building from scratch. Verify the connection and report any restart needed. Then ask what I want to build or change; I can attach a screenshot or link. Do not change the UI until I give you a task.`

/** A standalone project request uses the same configurable connection instructions. */
export function projectRequestPrompt(request: string) {
  return `${start} ${request}`
}
