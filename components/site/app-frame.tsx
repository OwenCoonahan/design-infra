import { cn } from "@/lib/utils"

/**
 * Gallery-only wrapper that lets a full-viewport shadcn sidebar layout (@design-infra/app-shell)
 * render inside a bounded preview: the sidebar container is pinned to the frame instead
 * of the viewport, and `min-h-svh`/`h-svh` on the wrapper are swapped for frame-relative
 * heights. Consumers never need this — in a real app the shell *is* the viewport.
 *
 * - `height` set   → fixed-height frame; the content area scrolls (chat layouts).
 * - `height` unset → frame grows with the page; sidebar spans the full height.
 */
export function AppFrame({
  height,
  className,
  children,
}: {
  height?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      style={height ? { height } : undefined}
      className={cn(
        "relative w-full overflow-hidden transform-[translateZ(0)]",
        "[&_[data-slot=sidebar-container]]:absolute [&_[data-slot=sidebar-container]]:h-full",
        height
          ? "[&_[data-slot=sidebar-inset]]:min-h-0 [&_[data-slot=sidebar-inset]]:overflow-y-auto [&_[data-slot=sidebar-wrapper]]:h-full [&_[data-slot=sidebar-wrapper]]:min-h-0"
          : "[&_[data-slot=sidebar-wrapper]]:h-auto [&_[data-slot=sidebar-wrapper]]:min-h-[48rem]",
        className
      )}
    >
      {children}
    </div>
  )
}
