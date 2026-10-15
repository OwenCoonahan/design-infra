# How to use design-infra

Connect once. Add a screenshot. Build with real components.

## 1. Connect your agent

Open your project in **Claude Code or Codex**. Copy the starting prompt from the [homepage](https://www.owencoonahan.xyz/design-infra/#use-with-agent) and paste it into that conversation. Your agent connects the catalog, checks your project’s stack and style, and shows a few things you can ask in the same chat.

No clone, plugin or paid account is needed. If a restart is required, the agent will tell you.

## 2. Show what you want to change

**Attach a screenshot** in your agent, point out the section, and add a short request: **“Find a loading component to put here”** or **“Make this navbar sharper.”** A website link or component file path works too.

Copying a request does not attach an image. Add your own screenshot alongside it. For a new page, describe its purpose, audience and the feeling you want.

## 3. Find the right parts

Ask **“Show me three options”** for live examples and a comparison. Or say **“Choose one and implement it”** to let the agent decide. It searches compatible catalog components and real design references, preserving your brand.

You can also [browse the catalog](https://www.owencoonahan.xyz/design-infra/components), shortlist examples, and use **Copy for agent** to bring them into your conversation. Free components come first; paid entries are opt-in.

## 4. Build, check, refine

Your agent installs and adapts the chosen parts. Ask it to verify the result on desktop and mobile, including keyboard behavior and reduced motion where relevant.

Review the actual page. Send another screenshot with what to keep or change. If something fails, [copy a feedback report](https://www.owencoonahan.xyz/design-infra/feedback) so the next person has an easier time.

## Paste a reference or replace a section

In the agent you're already using for your project:

- Paste a website/component link or a picture and say **“Build this using design-infra where it fits”** or **“Make our hero like this.”** The agent inspects the reference, maps its layout and visual details to existing components, explains any gaps, and adapts the selected parts. Its own browser/image tools supply the analysis.
- Point to your section and say **“I don't like this. Show me different approaches.”** The agent reads the section's code and requirements, then offers 3–5 real alternatives with live links and a comparison. For features, that might mean a bento grid, a feature list, or scroll-linked panels. It recommends one and waits for your pick.

[See the reference/replacement workflow and live examples](https://www.owencoonahan.xyz/design-infra/reference). Once connected, these requests work in your project; you don't need to move the conversation into design-infra.

## Choose structure separately from style

A project's purpose decides its structure. Its visual references decide how those parts look and feel.

| Project | Useful structure |
| --- | --- |
| Marketing | Introduction, product explanation, evidence and next action |
| Data exploration | Dataset context, filters/date range, metrics, charts, records and detail views |
| Dashboard | App navigation, operational summary, work lists and settings |
| Editorial / institutional | Narrative, evidence, programs, stories and related material |
| Documentation | Search, content tree, readable articles, code examples and reference tables |
| Commerce | Product discovery, filters, product details, purchase flow and reviews |

The planner supports `data`, `editorial`, `docs` and `commerce` alongside existing page types. An explicit type overrides automatic detection. Data plans include guidance for units, source/freshness, missing data and accessible visualizations. These outlines are starting points: omit irrelevant sections and add the product's real workflows.

"Clean" can mean strong typography, purposeful imagery, restrained chrome and clear hierarchy; it does not require a sparse monochrome layout. [Vela Energy](https://www.owencoonahan.xyz/design-infra/inspiration/vela-energy) and [Breakthrough Energy](https://www.owencoonahan.xyz/design-infra/inspiration/breakthrough-energy) are saved examples. Adapt their visual principles to the project's structure instead of copying their marketing sequences.

Existing theme presets remain available for explicit selection. The planner does not recommend one automatically. Preserve the project's brand; for a new direction, build from inspected references and reusable components, then document the working rules in DESIGN.md.

To delegate selection: **"Build a clean data-focused page using design-infra. Choose suitable components and implement them. Preserve our branding and data behavior; verify filters, empty/loading/error states and mobile layout."** The agent can proceed when you authorize it to choose and build.

## Use design galleries as references

Use real screens and flows to establish a direction, then search the component catalog for implementation pieces. Agents now receive purpose-specific `research.sources` in every `plan_ui` page and research relevant examples before composing, even when you do not name a gallery. If you ask them to choose and build, they research internally and report sources afterward. A reference image is not installable source code.

- **Mobbin**: app screens, interface states and multi-step flows; also website sections. The user values it as a reference alongside other design galleries. Name it in a request to prioritize it, such as **"Use Mobbin web-dashboard examples to inform this data page, then choose and implement suitable design-infra components."**
- **Landbook and Minimal Gallery**: website composition and section examples.
- **Navbar Gallery, Footer Design and Pricing Pages**: focused examples for individual sections.
- **The Component Gallery**: component anatomy and links to documented design systems.

Mobbin's official MCP can search screens, flows and sections using your supported Pro, Team or Enterprise account and OAuth sign-in. It is separate from the public design-infra MCP and is not connected automatically. To configure its URL alongside design-infra, add `--with-mobbin` to `--connect --client claude-code` or `--connect --client codex`. Authenticate separately in Claude Code through `/mcp`, or from the trusted Codex project with `codex mcp login mobbin`. See [the optional connection instructions](https://www.owencoonahan.xyz/design-infra/integrate) and [Mobbin’s current setup instructions](https://mobbin.com/mcp.md). If it is unavailable, use accessible live references or screenshots you provide; do not imply that a gallery link grants account access.

Compare relevant products, identify what fits the current project's tasks and brand, then map those observations to reusable components. Save source links and reasoning. Keep captured gallery images private; share analysis and original implementations rather than mirroring the galleries. Generic reference requests remain free-first; explicit source requests lead while retaining their access requirements.

## Improve it as you use it

Try one real project at a time. Keep a short note when search misses, a live link fails, installation needs a fix, or a component works particularly well. Use the **Component feedback** issue template on GitHub if you have repository access, or send the note to the maintainer:

```text
Project / stack:
What I searched or asked for:
Search or compare URL:
Component ID and install command:
What I expected / what happened:
What worked, or what needs improving:
```

Keep vendor keys and private project details out of feedback. Report successful installations too: they help us decide which components to verify and recommend. Maintainers should turn repeated misses into ranking/tagging fixes and regression tests, and reusable integration advice into curated notes. Use your reasons for choosing or passing to improve the library; don't infer a friend's taste from somebody else's choices.

---

## The mental model (read this once)

There are two places, and you talk to an agent in each:

```
 ┌──────────────────────────────┐            ┌──────────────────────────────────┐
 │  design-infra (THIS repo)    │            │  your project (e.g. prospector)  │
 │  the library                 │            │  where you actually work         │
 │                              │  plugin    │                                  │
 │  catalog · design systems    │──skills───▶│  agent knows design-infra exists │
 │  playbooks · templates       │──MCP──────▶│  agent asks it for options       │
 │  taste (favorites/dislikes)  │──registry─▶│  agent installs components       │
 │  toolchain + bootstrap       │──bootstrap▶│  tools/MCPs/skills/keys wired    │
 │                              │◀──taste────│  your picks & passes flow back   │
 └──────────────────────────────┘  (issues)  └──────────────────────────────────┘
        you feed it links                       you ask for changes
```

- **In the project workspace** you never need to explain design-infra. The project instructions and catalog connection tell the agent where to
  look; you just say what you want ("animate this", "this feels off", "add a pricing section").
- **In the design-infra workspace** you feed the library: paste links, say what you like, capture sites.
- **The agent's job** follows your request: ask for options to get live links and a comparison, or say **"choose and implement"** to delegate selection. It should explain its choice and verification afterward.

---

## Connect a project (recommended first setup)

Open [Connect your project](https://www.owencoonahan.xyz/design-infra/integrate), copy the setup prompt, and paste it into an agent **inside your project**. You can also give the agent this repository URL; the README points it to the same instructions. The hosted setup page works without cloning the repository or configuring GitHub access.

The agent inspects your stack and existing look, connects the catalog through its supported MCP configuration (or HTTP), and adds a small project instruction to search before writing new UI. It preserves existing configuration. Then give it a task: ask for options, or authorize it to choose and build. If MCP needs a restart, it reports that and uses HTTP in the meantime.

For a Claude Code plugin installation, collaborators with repository access can optionally use:

```text
/plugin marketplace add OwenCoonahan/design-infra
/plugin install design-infra@oc-design
```

The plugin provides skills, hooks, and MCP. Restart the client if required, then confirm the tools are callable. Other agents can use the hosted MCP or HTTP directly; plugin installation is optional.

## Optional: broader toolchain

The [toolchain page](https://www.owencoonahan.xyz/design-infra/toolchain) describes additional libraries, animation tools, and agent skills. The bootstrap installs a broader collection, including shadcn setup and motion presets. Inspect its plan before using it on an existing project:

```bash
curl -fsSL https://www.owencoonahan.xyz/design-infra/bootstrap.mjs -o /tmp/di.mjs
node /tmp/di.mjs --dry-run
```

Use `--only` / `--skip` to limit tools. Install a theme only when you want a new design system; retain existing project tokens otherwise. The setup prompt is the lighter starting point for friends. Secrets for keyed tools belong in `~/.config/design-infra/secrets.env` or the client's local secret store, never in a repo. Paid tools require authorized vendor access.

---

## Try it with friends

Start at [Connect](https://www.owencoonahan.xyz/design-infra/integrate), then use the [starter collection](https://www.owencoonahan.xyz/design-infra/starter). Claude Code and Codex have project-scoped MCP examples. Try finding a component, replacing a section, and building from a reference; [pilot tasks](https://www.owencoonahan.xyz/design-infra/pilot) give you a repeatable walkthrough. Copy a [feedback report](https://www.owencoonahan.xyz/design-infra/feedback) after each attempt—no GitHub account required. A config file alone does not prove tools are active.

## The daily loop

Every request follows the same rhythm: **point → say what you want → pick or delegate → build → review.** Ask for options when you want to choose, or say “choose and implement” when you want the agent to decide.

### 1. Point at the thing

Any of these works — use whatever's fastest:
- **Screenshot** pasted into the chat ("this card").
- **Agentation** (installed by the bootstrap): run the dev server, click the element on the page, type your note.
  The agent receives the exact file and component. Then say *"check my Agentation feedback."*
- **Name or path:** "the pricing section", "`components/hero.tsx`".

### 2. Say what you want — the phrases that work

| You want… | Say | What the agent does |
|---|---|---|
| motion on one component | *"I want this to animate — subtle."* | `refine` → 3–5 animation directions with links |
| it to look better | *"I don't like this card. What are my options?"* | asks what's off (look / motion / behaviour) if unclear, then options |
| a missing state | *"Add a loading state to the submit button."* | options: spinner → check, shimmer label, skeleton… |
| a new section | *"Add a testimonials section."* | `find-component` → shortlist with links |
| a page from scratch | *"Build a pricing page. It should feel trustworthy and calm."* | `build-ui` → plan with picks per section, then builds |
| a general once-over | *"Polish this page."* | `polish` → numbered punch list of upgrades, each with options |
| a different vibe | *"Make the landing page feel more like Linear."* | uses saved inspiration (or reads the site), maps it to components |
| a vibe you can't name | *"Show me what 'calm' vs 'premium' would look like here."* | `browse_moods` → design systems + components per feeling |
| ideas, not components yet | *"Show me how others do pricing pages / footers / animated landings."* | `find_references` → the 1–2 best galleries with exact links |

Adjectives steer everything: **calm, minimal, refined, technical, editorial, warm, playful, premium, futuristic,
experimental, bold, retro, organic, trustworthy** — and intensity words (*subtle, noticeable, dramatic*).

### 3. Look before you choose

You'll get something like:

> **Request access button — animate** · compare: https://www.owencoonahan.xyz/design-infra/compare?ids=…
> | | Direction | Feel | Cost | Look |
> |---|---|---|---|---|
> | A | Press-down + hover lift | refined | CSS only | page · live |
> | B | Loading → success | trustworthy | small | page · live |
> | C | Toggle micro-celebration | playful | small | page · live |
> **My pick: A** — your DESIGN.md says quiet motion.

- Open the **compare** link: options side by side, moving (live demos / videos), switchable between design systems.
- Click **Pick / Pass** (add a reason: "too flashy") → **Copy feedback** → paste it back into the chat.
- Or just reply: *"B, but faster"*, *"none — more expressive"*, *"show A and B on our actual button"*.
- *"Show them on our button"* → the agent installs a temporary **design lab** page (`/design-lab`) rendering your
  real component in each variant. You pick; it removes the lab.

### 4. It applies your pick — and remembers

- Installs/applies to **your** component, keeps your copy and props, uses your theme's tokens, respects reduced motion.
- Records the choice in your `DESIGN.md` (`## Motion` / Components) so the next component matches.
- Your picks and passes stay in the browser or project until you share them. Ask the agent to prepare feedback, then send it to the maintainer or file an issue if you have repository access. Shared catalog favorites are recommendations; separate personal taste profiles are a future addition.

### Getting ideas (when none of the options fit)

Say *"none of these — show me how others do it"* or *"I need ideas for the navbar."* The agent answers with the best 1–2
**inspiration galleries** for that exact pattern, with direct links — e.g. navbar.gallery's mega-menu page, Landbook's
cropped pricing sections, landing.love's scroll **videos** for an animated landing, hoverstat.es for hover effects,
minimal.gallery for a quieter look. Free galleries come first; Mobbin (app flows) is flagged as paid. Open one, point at
what you like (*"this one, the way the menu slides"*), and the agent maps it back to installable components. Full routing
table: `catalog/REFERENCES.md`.

---

## Browsing the library yourself

When you'd rather look than ask: **https://www.owencoonahan.xyz/design-infra**

| page | use it to |
|---|---|
| `/components` | search + filter by mood, motion (hover / scroll / on load…), intensity, how it's applied (replace / wrap / recipe), library; hover cards to see them move |
| `/compare?ids=…` | side-by-side live comparison; Pick / Pass; copy feedback for your agent |
| `/design-systems` | the four looks, live, in light/dark |
| `/templates` | whole starter pages under any design system |
| `/inspiration` | sites you've saved, analysed |
| `/toolchain` | what gets installed in a project and why, ranked |

**Shortlist flow:** tick cards → *Shortlist* bar → **Compare** → **Copy for agent** → paste into your project's chat
with *"apply these to the hero"*. The copied text includes the install commands and the compare link.

---

## Feeding the library (in the design-infra workspace)

This is how good design compounds. Open the **design-infra** workspace and paste things as you find them:

| You paste | Say | Result |
|---|---|---|
| a component library | *"Add this."* | catalogued, tagged (mood, motion), synced weekly |
| one component/block | *"I love this."* | ♥ favourite; if it's paid, a free `@oc` version gets built |
| a website | *"I like the feel of this site — the way the sections reveal."* | captured (screenshots, fonts, colours), analysed, mapped to components |
| a brand / style guide | *"Make this a design system."* | new `DESIGN.md` → installable theme |
| something you dislike | *"I hate glowing borders."* | added to dislikes → filtered out everywhere |

Also here: *"process taste issues"* — ingests the picks/passes your project agents filed as GitHub issues.

---

## Worked example — Prospector Labs

**Once, in the prospector workspace:**
> "Set up design infra for this repo. Keep our current look. It should feel trustworthy, technical and refined."

→ catalog connected; project instructions added; existing styles recorded in `DESIGN.md`. The agent reports whether its client needs a restart.

**A week of edits:**
- *"The stats under the hero (5.4M projects, 90+ sources) feel static."* → options: count-up on view, rolling digits,
  KPI tiles → you pick count-up → applied with the quiet timing.
- *(Agentation click on the pricing toggle)* *"This toggle is abrupt."* → options: sliding indicator (layoutId),
  segmented spring (bolder, flagged as beyond "quiet") → pick sliding.
- *"Add a section showing the four products: Interconnection, FEOC, Atlas, API."* → shortlist: feature-levels ♥
  (scroll-spy with product screenshots), bento, list → compare → feature-levels.
- *"Polish the homepage."* → punch list: skeletons for the Atlas map embed, exit animation on the demo modal, logo
  strip for EIA/DOE/FERC → you reply "1, 3, skip 2".

**Meanwhile, in the design-infra workspace:** you paste a fintech site you like → captured, tagged trustworthy/refined
→ next time anyone asks prospector's agent for "more credible", it shows up as a reference.

---

## When something's off

| symptom | fix |
|---|---|
| agent writes UI from scratch / doesn't mention options | *"Use design-infra — propose options with links first."* |
| no `design-infra` tools in the session | restart Claude Code; `/mcp`; re-run `/plugin install design-infra@oc-design` |
| bootstrap says a tool was skipped | it lists the key and where to get it → add to `~/.config/design-infra/secrets.env`, re-run |
| options all look wrong for the brand | check `DESIGN.md` moods/motion — that's what steers ranking |
| "Tailwind v3 detected" | keep the catalog connection; check compatibility before choosing a v4 component or planning a migration |
| a component looks off in your theme | *"Convert its colours to our theme tokens"* (non-theme-aware sources hard-code colours) |
| want to add more tools | inspect `node /tmp/di.mjs --dry-run`; review existing component changes before applying |

---

## Cheat sheet

```
SET UP        "Set up design infra for this repo. Keep our current look."
ONE THING     [point] "I want this to animate — subtle."   /   "I don't like this. Options?"
STATES        "Add loading / empty / error / success states to this."
NEW SECTION   "Add a <testimonials / pricing / FAQ> section."
NEW PAGE      "Build a <page>. It should feel <calm, premium…>."
ONCE-OVER     "Polish this page."
VIBE          "Make it feel more like <company>."   /   "Show me calm vs premium."
IDEAS         "None of these — show me how others do <pattern>."  (galleries with exact links)
CHOOSING      open the compare link → Pick/Pass → Copy feedback → paste
SEE IT LIVE   "Show A and B on our actual component." (design lab)
FEED (here)   paste link + "I love this" / "I hate this" / "add this library" / "capture this site"
```

## Browse components visually

Start with [Loading](https://www.owencoonahan.xyz/design-infra/components?category=loader), [Buttons](https://www.owencoonahan.xyz/design-infra/components?category=button) or [Pricing](https://www.owencoonahan.xyz/design-infra/components?category=pricing). The type shortcuts work for sections as well as small components. Category pages start in Live view; the whole catalog starts in Grid view. Add `view=grid` or `view=live` to share that choice. Search, mood, motion, source and access filters stay in the URL.

Live view plays at most three visible hosted demos or motion clips together. Examples stop when offscreen or when you leave the browser tab. Use Play/Pause on one example, Interact to try its controls, or Pause all. With reduced motion enabled, examples start as thumbnails; Play opts into opening an example, while each component still honors its own reduced-motion support. Component links and shortlist controls sit outside the interactive preview.

The counts distinguish all matching results from playable coverage in Live view and visual coverage in Grid view. Live view shows only hosted demos and motion clips; screenshots are available in Grid view. Examples without playable previews appear below the live gallery with source links. Visual examples appear first in recommendation order; entries without permitted visual media live under “More examples on source sites.” Paid components remain opt-in and a demo does not grant a vendor licence. Loading has eight hosted adapters; other categories use the hosted demos, clips and thumbnails already available. Whole-page galleries are a later addition.

Shortlist the examples you like, open Compare, and copy the selected IDs and install instructions to your agent. Agent recommendations include category gallery links alongside detail pages, source links and the comparison. Ask the agent to choose and build when you want implementation without another selection step.

For technical illustrations in docs or explanatory sections, search `anatomy` or browse `/components?source=anatomy&category=illustration&view=grid`. Existing MIT figures install through `anatomy-figures`; their actual interactive examples are on the source site. The optional Anatomy skill is toolchain tier 3 for Claude Code and Codex, and is used when no existing mechanism fits.
