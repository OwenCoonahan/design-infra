import { notFound } from "next/navigation"

import { OC_DEMOS } from "@/components/demos/oc-demos"
import { CopyCommand } from "@/components/site/copy-command"
import { Markdown } from "@/components/site/markdown"
import { ThemeStage } from "@/components/site/theme-stage"
import { getDesignSystem, getDesignSystems } from "@/lib/data"

export async function generateStaticParams() {
  return (await getDesignSystems()).map((s) => ({ slug: s.slug }))
}

export async function generateMetadata(props: PageProps<"/design-systems/[slug]">) {
  const { slug } = await props.params
  const ds = await getDesignSystem(slug)
  return { title: ds?.meta.name ?? slug }
}

const PREVIEW_BLOCKS = ["theme-preview", "hero-spotlight", "feature-bento", "pricing-simple", "stat-cards", "chat-thread"]

export default async function DesignSystemPage(props: PageProps<"/design-systems/[slug]">) {
  const { slug } = await props.params
  const ds = await getDesignSystem(slug)
  if (!ds) notFound()
  const { meta, body } = ds
  const swatches = Object.entries(meta.light).filter(([k]) => !k.startsWith("sidebar") && !k.startsWith("chart"))

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs text-muted-foreground">design-systems/{slug}/DESIGN.md</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{meta.name}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{meta.description}</p>
        </div>
        <CopyCommand className="md:w-[26rem]" command={`pnpm dlx shadcn@latest add ${meta.registryItem}`} />
      </div>

      <h2 className="mt-12 mb-4 text-lg font-semibold">Live preview</h2>
      <ThemeStage theme={slug} modes={meta.modes}>
        <div className="divide-y divide-border">
          {PREVIEW_BLOCKS.map((name) => (
            <div key={name}>{OC_DEMOS[name]()}</div>
          ))}
        </div>
      </ThemeStage>

      <div className="mt-12 grid gap-10 lg:grid-cols-[18rem_1fr]">
        <aside className="flex flex-col gap-6 lg:sticky lg:top-20 lg:self-start">
          <div>
            <h3 className="mb-3 text-sm font-semibold">Tokens</h3>
            <ul className="grid gap-1.5">
              {swatches.map(([name, value]) => (
                <li key={name} className="flex items-center gap-2 text-xs">
                  <span className="size-4 shrink-0 rounded border" style={{ background: value }} />
                  <span className="flex-1 font-mono">{name}</span>
                  <span className="font-mono text-muted-foreground">{value}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold">Fonts</h3>
            <p className="text-xs text-muted-foreground">
              {meta.fonts.heading} / {meta.fonts.sans} / {meta.fonts.mono}
            </p>
          </div>
        </aside>
        <Markdown>{body}</Markdown>
      </div>
    </div>
  )
}
