import Link from "next/link"
import { notFound } from "next/navigation"

import { CopyCommand } from "@/components/site/copy-command"
import { TemplatePreview } from "@/components/site/template-preview"
import { Badge } from "@/components/ui/badge"
import { getDesignSystems, getTemplate, getTemplates } from "@/lib/data"
import { cn } from "@/lib/utils"

export async function generateStaticParams() {
  return (await getTemplates()).map((t) => ({ name: t.name }))
}

export async function generateMetadata(props: PageProps<"/templates/[name]">) {
  const { name } = await props.params
  return { title: (await getTemplate(name))?.title ?? name }
}

export default async function TemplatePage(props: PageProps<"/templates/[name]">) {
  const { name } = await props.params
  const sp = await props.searchParams
  const [t, systems] = await Promise.all([getTemplate(name), getDesignSystems()])
  if (!t) notFound()

  const system = systems.find((s) => s.slug === sp.system) ?? systems.find((s) => s.slug === "editorial") ?? systems[0]
  const mode = system.modes.includes(sp.mode as "light" | "dark") ? (sp.mode as "light" | "dark") : system.modes[0]
  const href = (slug: string, m?: string) => `/templates/${name}?system=${slug}${m ? `&mode=${m}` : ""}`

  return (
    <div className="mx-auto max-w-[96rem] px-6 py-12">
      <Link href="/templates" className="text-xs text-muted-foreground hover:text-foreground">
        ← Templates
      </Link>
      <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold tracking-tight">{t.title}</h1>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            @design-infra/{t.name} → {t.files[0]?.target}
          </p>
          <p className="mt-3 max-w-3xl text-muted-foreground">{t.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
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
        </div>
        <div className="flex w-full flex-col gap-2 lg:w-[34rem]">
          <CopyCommand command={`pnpm dlx shadcn@latest add ${system.registryItem} @design-infra/${t.name}`} />
        </div>
      </div>

      <div className="sticky top-14 z-40 -mx-6 mt-8 flex flex-wrap items-center gap-2 border-y bg-background/90 px-6 py-3 backdrop-blur">
        <span className="mr-1 text-xs text-muted-foreground">Design system</span>
        <nav aria-label="Design system" className="flex flex-wrap gap-1">
          {systems.map((s) => (
            <Link
              key={s.slug}
              href={href(s.slug)}
              aria-current={s.slug === system.slug ? "page" : undefined}
              className={cn(
                "rounded-md border px-2.5 py-1 text-xs transition-colors hover:bg-muted",
                s.slug === system.slug && "border-foreground bg-foreground text-background hover:bg-foreground"
              )}
            >
              {s.name}
            </Link>
          ))}
        </nav>
        {system.modes.length > 1 ? (
          <nav aria-label="Mode" className="ml-auto flex gap-1">
            {system.modes.map((m) => (
              <Link
                key={m}
                href={href(system.slug, m)}
                aria-current={m === mode ? "page" : undefined}
                className={cn(
                  "rounded-md border px-2.5 py-1 text-xs capitalize transition-colors hover:bg-muted",
                  m === mode && "border-foreground bg-foreground text-background hover:bg-foreground"
                )}
              >
                {m}
              </Link>
            ))}
          </nav>
        ) : (
          <span className="ml-auto text-xs text-muted-foreground">{system.modes[0]} only</span>
        )}
      </div>

      <TemplatePreview name={t.name} theme={system.slug} mode={mode} className="mt-6" />
    </div>
  )
}
