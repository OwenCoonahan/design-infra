# Audited and skipped

Links Owen shared that were researched and deliberately **not** added — so the next agent can answer instantly
instead of re-auditing. Re-open one only if the reason below has changed (e.g. a licence, free tier or API appears).

| site | audited | what it is | why skipped | revisit if |
|---|---|---|---|---|
| graphicalui.com | 2026-10-06 | $49 Base UI theme builder that exports a theme + GUI.md + agent skills | Paid, no public catalog/registry, Base UI (not our Radix/shadcn stack); its idea is what design-infra already does | it ships a free public registry |
| scrolltide.co | 2026-10-06 | Paid prompt/template shop (113 templates, 4 free) | Paid; terms forbid building a template/prompt catalog from it; heavily promoted (affiliate) | — |
| vibeprompts.dev | 2026-10-06 | 286 short Tailwind section prompts | Generic, not theme-aware, no licence; redundant with `@oc` blocks + `plan_ui` | — |
| styles.refero.design | 2026-10-06 | 1,342 extracted product style pages | robots.txt disallows ClaudeBot/GPTBot; not Google-DESIGN.md spec; custom fonts | it offers an API/licence for agents |
| shadcnblocks.com | 2026-10-06 | 4,351 shadcn blocks | ~89% paid; terms forbid mirroring/redistributing even free blocks and bulk crawling | — (install free blocks by hand if wanted) |
| uiverse.io | 2026-10-06 | Community HTML/CSS snippets | Cloudflare-walled; GitHub mirror stale (2024); plain HTML with hard-coded colours, not React/theme-aware | — |
| kinetics.colorion.co | 2026-10-06 | 153 motion effects gallery | No licence (all rights reserved); toy-level code; no installable output | it adds a licence + registry |
| threejs.org, shadertoy, threejs-journey | 2026-10-06 | 3D/shader library, editor, course | Not design sources (thebookofshaders.com is linked from the Motion source as learning) | — |
| claude code, cursor, v0, lovable | 2026-10-06 | AI coding tools / builders | Tools, not design sources | — |
| github.com/jakubkrehel/make-interfaces-feel-better | 2026-10-28 | Jakub Krehel's earlier single polish skill | Superseded by `jakubkrehel/skills` (toolchain `jakub-skills`, `catalog/sources/jakub-krehel.md`), which splits the same rules into focused skills | the skills repo is archived |
| interfaces.dev (archive + premium skills) | 2026-10-28 | Jakub Krehel's design-engineering magazine | Archive and skills are subscription-gated; robots.txt disallows `/magazine` and `/issues-md/` except three free issues. Those free issues may be linked; nothing is mirrored or summarised at length | free access or an agent licence is offered |

Already in the catalog from the same batch: component.gallery, 21st.dev, shadcn/ui, Aceternity, Magic UI, Motion
Primitives, SmoothUI, MicroKit, Liquid Glass, anime.js, Kage, Kitbitz, and 14 inspiration galleries (`catalog/REFERENCES.md`).

Prompt Motion was reconsidered on 2026-10-11 and added to references.json as a link-only gallery. Prompts/videos are not mirrored, and crawler restrictions remain in force.
