import { MOTION_LANGUAGE_NAMES, type MotionLanguage } from "@/lib/catalog/motion"
import { Category, Mood, MotionIntensity, MotionTrigger } from "@/lib/catalog/schema"
import { type Intent, proposeOptions } from "@/lib/propose"

/** GET /api/options?component=signup+button&request=animate+it+subtly&moods=refined&motion=quiet&theme=linear-dark */
export async function GET(req: Request) {
  const p = new URL(req.url).searchParams
  const component = p.get("component")
  if (!component) return Response.json({ error: "component is required" }, { status: 400 })
  const intent = p.get("intent")
  if (intent && !["animate", "restyle", "replace", "add-state", "polish"].includes(intent)) return Response.json({ error: "invalid intent" }, { status: 400 })
  if (component.length > 200 || (p.get("request")?.length ?? 0) > 8000) return Response.json({ error: "request too long" }, { status: 400 })
  const intensity = MotionIntensity.safeParse(p.get("intensity"))
  const trigger = MotionTrigger.safeParse(p.get("trigger"))
  const category = Category.safeParse(p.get("category"))
  const motion = p.get("motion")
  return Response.json(
    await proposeOptions({
      component,
      category: category.success ? category.data : undefined,
      request: p.get("request") ?? undefined,
      intent: (intent as Intent | null) ?? undefined,
      intensity: intensity.success ? intensity.data : undefined,
      trigger: trigger.success ? trigger.data : undefined,
      moods: (p.get("moods") ?? "").split(",").flatMap((m) => (Mood.safeParse(m).success ? [m as Mood] : [])),
      motionLanguage: MOTION_LANGUAGE_NAMES.includes(motion as MotionLanguage) ? (motion as MotionLanguage) : undefined,
      theme: p.get("theme") ?? undefined,
    })
  )
}
