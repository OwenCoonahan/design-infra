import TemplateAiChat from "@/registry/oc/templates/template-ai-chat/page"
import TemplateLanding from "@/registry/oc/templates/template-landing/page"
import TemplateSaasDashboard from "@/registry/oc/templates/template-saas-dashboard/page"

/**
 * Live renders of @oc templates for /templates/[name], keyed by registry item name.
 * `frame: "app"` templates use the sidebar shell and render inside <AppFrame>;
 * `height` pins the frame (needed for h-svh layouts such as chat).
 */
export const TEMPLATE_DEMOS: Record<string, { Page: React.ComponentType; frame: "page" | "app"; height?: string }> = {
  "template-landing": { Page: TemplateLanding, frame: "page" },
  "template-saas-dashboard": { Page: TemplateSaasDashboard, frame: "app" },
  "template-ai-chat": { Page: TemplateAiChat, frame: "app", height: "56rem" },
}
