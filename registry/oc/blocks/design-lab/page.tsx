import { ArrowRight } from "lucide-react"

import { DesignLab, LabOption } from "@/components/design-lab"
import { Button } from "@/components/ui/button"

/**
 * Temporary — installed by an agent to show you options; deleted once you pick.
 * Agents: replace these example options with variants of the user's real component
 * (import it, render it with their copy), keep one idea per option, and say what differs in `notes`.
 */
export default function DesignLabPage() {
  return (
    <DesignLab
      title="Request access button"
      description="Three takes on the primary CTA in the hero. Hover and click each one."
    >
      <LabOption id="A" label="Current" notes="What ships today — solid fill, no motion.">
        <Button size="lg">Request access</Button>
      </LabOption>
      <LabOption id="B" label="Arrow nudge" notes="Arrow slides 4px on hover; 150ms ease-out. Subtle." chosen>
        <Button size="lg" className="group">
          Request access
          <ArrowRight className="transition-transform duration-150 ease-out group-hover:translate-x-1" />
        </Button>
      </LabOption>
      <LabOption id="C" label="Outline + press" notes="Quieter outline style that scales to 97% while pressed. Feels tactile.">
        <Button size="lg" variant="outline" className="transition-transform active:scale-[0.97]">
          Request access
        </Button>
      </LabOption>
    </DesignLab>
  )
}
