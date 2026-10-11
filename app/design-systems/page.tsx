import Link from "next/link"

import { CopyCommand } from "@/components/site/copy-command"
import { ThemeStage } from "@/components/site/theme-stage"
import { getDesignSystems } from "@/lib/data"

export const metadata = { title: "Design systems" }

export default async function DesignSystemsPage() {
  const systems = await getDesignSystems()
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Design systems</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Each is a <code className="font-mono text-sm">DESIGN.md</code> (Google Stitch format) compiled to a shadcn theme:
        colours for light/dark, radius, Google fonts, and a text scale. Installing one also drops DESIGN.md into the
        project root so every agent stays on-brand.
      </p>
      <div className="mt-10 grid gap-8">
        {systems.map((s) => (
          <section key={s.slug} className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
            <div className="flex flex-col gap-3">
              <Link href={`/design-systems/${s.slug}`} className="text-xl font-semibold hover:underline">
                {s.name}
              </Link>
              <p className="text-sm text-muted-foreground">{s.description}</p>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
                <dt className="text-muted-foreground">Headings</dt>
                <dd>{s.fonts.heading}</dd>
                <dt className="text-muted-foreground">Body</dt>
                <dd>{s.fonts.sans}</dd>
                <dt className="text-muted-foreground">Mono</dt>
                <dd>{s.fonts.mono}</dd>
                <dt className="text-muted-foreground">Radius</dt>
                <dd>{s.radius}</dd>
                <dt className="text-muted-foreground">Modes</dt>
                <dd>{s.modes.join(" + ")}</dd>
              </dl>
              <CopyCommand command={`pnpm dlx shadcn@latest add ${s.registryItem}`} />
            </div>
            <Link href={`/design-systems/${s.slug}`}>
              <ThemeStage theme={s.slug} modes={[s.modes[0]]}>
                <div className="flex flex-col gap-4 p-8">
                  <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">{s.slug}</p>
                  <p className="font-heading text-display text-foreground">Aa — {s.name}</p>
                  <p className="text-body-lg max-w-md text-muted-foreground">
                    The quick brown fox jumps over the lazy dog, then files a pull request.
                  </p>
                  <div className="flex gap-2">
                    <span className="rounded-[var(--radius)] bg-primary px-3 py-1.5 text-sm text-primary-foreground">Primary</span>
                    <span className="rounded-[var(--radius)] border px-3 py-1.5 text-sm">Secondary</span>
                  </div>
                </div>
              </ThemeStage>
            </Link>
          </section>
        ))}
      </div>
    </div>
  )
}
