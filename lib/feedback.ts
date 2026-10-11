export type Feedback = { request: string; component: string; link: string; stack: string; outcome: string; details: string }

export function formatFeedback(value: Feedback) {
  return ["# Design-infra feedback", "", ...[
    ["Request", value.request], ["Component", value.component], ["Search / comparison", value.link],
    ["Project stack / agent", value.stack], ["Outcome", value.outcome], ["What worked or got stuck", value.details],
  ].map(([label, content]) => `**${label}:** ${content.trim() || "Not supplied"}`)].join("\n\n")
}
