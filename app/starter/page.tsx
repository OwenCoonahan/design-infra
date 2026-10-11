import Link from "next/link"
import { CopyCommand } from "@/components/site/copy-command"
import { getStarter } from "@/lib/starter"

export const metadata = { title: "Starter components" }

export default async function StarterPage() {
  const collection = await getStarter()
  const verification = collection.verification
  return <div className="mx-auto max-w-5xl px-6 py-12">
    <h1 className="text-3xl font-semibold tracking-tight">Twenty useful starting points</h1>
    <p className="mt-3 max-w-2xl text-muted-foreground">{collection.description} Open the demos, choose a part, then ask your agent to adapt it to your project.</p>
    <div className="mt-6 rounded-xl border bg-card p-5 text-sm">
      <p className="font-medium">{verification.status === "passed" ? "Installation, build and browser checks passed" : "Collection needs verification after changes"}</p>
      {verification.report ? <>
        <p className="mt-2 text-muted-foreground">Checked {verification.report.checkedAt.slice(0, 10)}. {verification.report.scope}</p>
        <details className="mt-3">
          <summary className="cursor-pointer">View checks and compatibility limits</summary>
          <p className="mt-2">Checks: {verification.report.checks.join("; ")}.</p>
          <p className="mt-2 text-muted-foreground">{verification.report.limitations.filter((text) => !text.startsWith("No friend/")).join(" ")}</p>
        </details>
      </> : <p className="mt-2 text-muted-foreground">Run the starter verification before relying on its check status.</p>}
      <Link href="/api/starter" className="mt-3 inline-block underline">Machine-readable collection and evidence</Link>
    </div>
    <div className="mt-8 grid gap-4 md:grid-cols-2">{collection.entries.map((entry) => <article key={entry.id} className="rounded-xl border p-5">
      <h2 className="font-semibold"><a href={entry.page} className="hover:underline">{entry.title}</a></h2>
      <p className="mt-2 text-sm text-muted-foreground">{entry.use}</p>
      <a href={entry.live ?? entry.page} target="_blank" rel="noreferrer" className="my-3 inline-block text-sm underline">Open live demo</a>
      <CopyCommand command={entry.install} />
      <Link href={`/feedback?component=${encodeURIComponent(entry.id)}`} className="mt-3 inline-block text-xs text-muted-foreground underline">Share how it worked</Link>
    </article>)}</div>
    <p className="mt-8 text-sm text-muted-foreground">New here? <Link href="/integrate" className="underline">Connect your project</Link> and try the <Link href="/pilot" className="underline">three pilot tasks</Link>. Existing project tokens come first; theme installation is optional.</p>
  </div>
}
