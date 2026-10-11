import { TEMPLATE_DEMOS } from "@/components/demos/template-demos"
import { AppFrame } from "@/components/site/app-frame"
import { ThemeStage } from "@/components/site/theme-stage"
import { cn } from "@/lib/utils"

/** Renders an @design-infra template under a design system (+ mode), framed like a browser viewport. */
export function TemplatePreview({
  name,
  theme,
  mode,
  className,
}: {
  name: string
  theme: string
  mode: "light" | "dark"
  className?: string
}) {
  const demo = TEMPLATE_DEMOS[name]
  if (!demo) return null
  const { Page } = demo
  return (
    <ThemeStage key={`${theme}-${mode}`} theme={theme} modes={[mode]} className={className}>
      {demo.frame === "app" ? (
        <AppFrame height={demo.height}>
          <Page />
        </AppFrame>
      ) : (
        <Page />
      )}
    </ThemeStage>
  )
}

/** Non-interactive, scaled-down live render (1280px viewport → `width`). */
export function TemplateThumbnail({
  name,
  theme,
  mode,
  width = 480,
  height = 300,
  className,
}: {
  name: string
  theme: string
  mode: "light" | "dark"
  width?: number
  height?: number
  className?: string
}) {
  const scale = width / 1280
  return (
    <div
      aria-hidden
      inert
      className={cn("pointer-events-none relative shrink-0 overflow-hidden rounded-xl border select-none", className)}
      style={{ width, height }}
    >
      <div className="absolute top-0 left-0 w-[1280px] origin-top-left" style={{ transform: `scale(${scale})` }}>
        <TemplatePreview name={name} theme={theme} mode={mode} className="rounded-none border-0" />
      </div>
    </div>
  )
}
