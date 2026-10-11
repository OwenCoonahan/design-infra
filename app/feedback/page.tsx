import { FeedbackForm } from "@/components/site/feedback-form"

export const metadata = { title: "Share feedback" }

export default async function FeedbackPage(props: PageProps<"/feedback">) {
  const query = await props.searchParams
  return <div className="mx-auto max-w-2xl px-6 py-12">
    <h1 className="text-3xl font-semibold tracking-tight">Help improve the catalog</h1>
    <p className="mt-3 text-muted-foreground">Make a report you can copy and share with your friends or the maintainer. No GitHub account needed. This form stays in your browser and sends nothing automatically. Include the request and outcome; leave out private code and credentials.</p>
    <FeedbackForm component={typeof query.component === "string" ? query.component.slice(0, 200) : ""} link={typeof query.link === "string" ? query.link.slice(0, 2000) : ""} />
  </div>
}
