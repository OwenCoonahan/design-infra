import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

export type FaqItem = { question: string; answer: React.ReactNode }

/**
 * FAQ section: heading + contact line on the left, shadcn accordion on the right
 * (`layout="stacked"` centres everything in one column).
 */
export function Faq({
  heading = "Frequently asked questions",
  subheading,
  items,
  layout = "split",
  defaultOpen,
  className,
}: {
  heading?: React.ReactNode
  subheading?: React.ReactNode
  items: FaqItem[]
  layout?: "split" | "stacked"
  /** Index of the item open on first render. */
  defaultOpen?: number
  className?: string
}) {
  const split = layout === "split"
  return (
    <section
      className={cn(
        "mx-auto w-full px-6 py-20",
        split ? "grid max-w-6xl gap-10 md:grid-cols-[1fr_1.6fr] md:gap-16" : "max-w-3xl",
        className
      )}
    >
      <header className={cn(!split && "mb-10 text-center")}>
        <h2 className="font-heading text-3xl font-headline tracking-tight text-balance text-foreground sm:text-4xl">
          {heading}
        </h2>
        {subheading ? <p className="mt-3 text-pretty text-muted-foreground">{subheading}</p> : null}
      </header>
      <Accordion
        type="single"
        collapsible
        defaultValue={defaultOpen === undefined ? undefined : `item-${defaultOpen}`}
        className="w-full border-t"
      >
        {items.map((item, i) => (
          <AccordionItem key={item.question} value={`item-${i}`} className="border-b">
            <AccordionTrigger className="py-5 text-base hover:no-underline">{item.question}</AccordionTrigger>
            <AccordionContent className="pb-5 text-pretty text-muted-foreground">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
