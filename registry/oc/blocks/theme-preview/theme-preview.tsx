import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

const SWATCHES = [
  ["background", "bg-background"],
  ["card", "bg-card"],
  ["muted", "bg-muted"],
  ["accent", "bg-accent"],
  ["secondary", "bg-secondary"],
  ["primary", "bg-primary"],
  ["destructive", "bg-destructive"],
  ["border", "bg-border"],
] as const

/**
 * A compact kitchen-sink of the installed theme: colours, type scale, radius and the
 * core shadcn primitives. Drop it on a scratch page after `npx shadcn add @oc/theme-*`
 * to eyeball the result.
 */
export function ThemePreview({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-6 bg-background p-6 text-foreground md:grid-cols-[1.2fr_1fr]", className)}>
      <div className="flex flex-col gap-6">
        <div>
          <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">Type scale</p>
          <h1 className="mt-2 font-heading text-5xl leading-none font-headline tracking-tight">Display heading</h1>
          <h2 className="mt-3 font-heading text-2xl font-headline tracking-tight">Section headline</h2>
          <p className="mt-2 max-w-prose text-pretty text-muted-foreground">
            Body copy sits on the canvas with enough contrast to read for minutes, not seconds. Links look{" "}
            <a className="font-medium text-foreground underline decoration-primary decoration-2 underline-offset-4" href="#">
              like this
            </a>
            , and <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">inline code</code> like this.
          </p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {SWATCHES.map(([name, cls]) => (
            <div key={name} className="flex flex-col gap-1">
              <div className={cn("h-10 rounded-md border", cls)} />
              <span className="font-mono text-[10px] text-muted-foreground">{name}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Delete</Button>
          <Badge>New</Badge>
          <Badge variant="secondary">Beta</Badge>
          <Badge variant="outline">v2.1</Badge>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>Deploy your new project in one click.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="tp-name">Name</Label>
            <Input id="tp-name" placeholder="acme-web" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tp-email">Email</Label>
            <Input id="tp-email" type="email" placeholder="you@acme.com" aria-invalid />
            <p className="text-xs text-destructive">That email is already taken.</p>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label htmlFor="tp-switch">Preview deployments</Label>
            <Switch id="tp-switch" defaultChecked />
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="ghost">Cancel</Button>
          <Button>Deploy</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
