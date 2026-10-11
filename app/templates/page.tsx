import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { CopyCommand } from "@/components/site/copy-command"
import { TemplateThumbnail } from "@/components/site/template-preview"
import { Badge } from "@/components/ui/badge"
import { getDesignSystems, getTemplates } from "@/lib/data"

export const metadata = { title: "Templates" }

/** Which system each thumbnail is shown in — just to show range. */
const THUMB_SYSTEM: Record<string, string> = {
  "template-landing": "editorial",
  "template-saas-dashboard": "linear-dark",
  "template-ai-chat": "soft-glass",
}

export default async function TemplatesPage() {
  const [templates, systems] = await Promise.all([getTemplates(), getDesignSystems()])
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Starter templates</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Whole pages composed from <code className="font-mono text-sm">@design-infra</code> blocks. Install a design system theme,
        then a template — the page file lands at its route and every block it uses is pulled in as a dependency. The
        theme decides how it looks; the template decides what&apos;s on the page.
      </p>
      <CopyCommand
        className="mt-6 max-w-2xl"
        command="pnpm dlx shadcn@latest add @design-infra/theme-editorial @design-infra/template-landing"
      />

      <div className="mt-12 flex flex-col gap-10">
        {templates.map((t) => {
          const thumbSystem = systems.find((s) => s.slug === THUMB_SYSTEM[t.name]) ?? systems[0]
          return (
            <section
              key={t.name}
              className="flex flex-col gap-6 border-t pt-10 lg:flex-row lg:items-start lg:justify-between"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <div>
                  <Link href={`/templates/${t.name}`} className="text-xl font-semibold hover:underline">
                    {t.title}
                  </Link>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    @design-infra/{t.name} → {t.files[0]?.target}
                  </p>
                </div>
                <p className="max-w-2xl text-sm text-muted-foreground">{t.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {t.registryDependencies
                    .filter((d) => d.startsWith("@design-infra/"))
                    .map((d) => (
                      <Link key={d} href={`/components/oc/${d.slice(4)}`}>
                        <Badge variant="outline" className="font-mono hover:bg-muted">
                          {d}
                        </Badge>
                      </Link>
                    ))}
                </div>
                <CopyCommand className="max-w-xl" command={`pnpm dlx shadcn@latest add @design-infra/${t.name}`} />
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Preview in</span>
                  {systems.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/templates/${t.name}?system=${s.slug}`}
                      className="rounded-md border px-2 py-1 text-xs transition-colors hover:bg-muted"
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href={`/templates/${t.name}?system=${thumbSystem.slug}`} className="group hidden shrink-0 md:block">
                <TemplateThumbnail
                  name={t.name}
                  theme={thumbSystem.slug}
                  mode={thumbSystem.modes[0]}
                  className="transition-colors group-hover:border-ring"
                />
                <span className="mt-2 flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground">
                  {thumbSystem.name} <ArrowRight className="size-3" />
                </span>
              </Link>
            </section>
          )
        })}
      </div>
    </div>
  )
}
