import { Check, ImageIcon } from "lucide-react"

/** Original UI illustration: an example attachment, never an upload control. */
export function RequestScreenshot() {
  return (
    <figure data-request-screenshot className="w-full max-w-xs rounded-xl border bg-background p-3">
      <div className="mb-3 flex items-center justify-between gap-2 text-xs">
        <span className="text-muted-foreground">Example attachment</span>
        <span className="inline-flex items-center gap-1.5"><Check className="size-3" aria-hidden="true" /> Screenshot added</span>
      </div>
      <svg viewBox="0 0 400 240" role="img" aria-label="Illustrative screenshot of a project dashboard with a section marked for a change" className="w-full rounded-md border bg-[#f4f3ef]">
        <rect width="400" height="26" fill="#e8e7e2" />
        {[12, 23, 34].map((x) => <circle key={x} cx={x} cy="13" r="2.5" fill="#b1b0a8" />)}
        <rect x="58" y="8" width="280" height="10" rx="3" fill="#f4f3ef" />
        <rect y="26" width="72" height="214" fill="#eeede8" />
        <rect x="14" y="43" width="44" height="6" rx="2" fill="#44443f" />
        {[68, 89, 110, 131].map((y) => <rect key={y} x="14" y={y} width="39" height="5" rx="2" fill="#c5c4bb" />)}
        <text x="92" y="54" fill="#33342e" fontSize="14" fontFamily="sans-serif" fontWeight="600">Your project</text>
        <rect x="92" y="64" width="112" height="4" rx="2" fill="#c5c4bb" />
        {[92, 191, 290].map((x, index) => <g key={x}>
          <rect x={x} y="84" width="85" height="44" rx="5" fill="#fff" stroke="#deddd5" />
          <rect x={x + 10} y="94" width="34" height="4" rx="2" fill="#c5c4bb" />
          <text x={x + 10} y="116" fill="#44443f" fontSize="14" fontFamily="sans-serif">{["124", "86%", "32"][index]}</text>
        </g>)}
        <rect x="92" y="143" width="283" height="76" rx="5" fill="#fff" stroke="#bbb9ae" strokeDasharray="4 3" />
        <path d="M105 199L136 184L167 190L198 162L229 174L260 159L291 178L322 164L361 169" fill="none" stroke="#c6c4b8" strokeWidth="2" />
        <rect x="157" y="169" width="154" height="25" rx="5" fill="#33342e" />
        <text x="234" y="185" textAnchor="middle" fill="#fff" fontSize="10" fontFamily="sans-serif">“Change this section”</text>
      </svg>
      <figcaption className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"><ImageIcon className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" /> Attach your own screenshot to the request in your agent.</figcaption>
    </figure>
  )
}
