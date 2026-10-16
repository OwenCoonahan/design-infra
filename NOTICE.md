# Content and attribution

The MIT licence in LICENSE covers original design-infra code, blocks and documentation. It does not relicense third-party components, photographs, fonts, trademarks, websites or prompts described by the catalog.

`components/ui/` contains adapted shadcn/ui primitives. Preserve [shadcn/ui's MIT notice](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md) when redistributing them; the full notice is in `third-party/shadcn-LICENSE.txt`. Installed npm dependencies retain their own licences and notices. Fonts are loaded through Next's font support, rather than supplied as freely relicensable assets; check each font's licence before redistribution.

The catalog records metadata and links to independently owned libraries. An install command or a registry dependency pointing to a vendor does not grant access or redistribution rights. Check the source's current licence and your own entitlement before installing. Aceternity, OriginKit, transitions.dev and React Bits are catalog references; their source is not vendored into this registry. The original hero spotlight uses CSS authored here, without the former vendor implementation.

Paid Aceternity previews, transitions.dev previews, OriginKit images and captured inspiration-site screenshots are not distributed by the current media policy. Their source links remain. Other catalog image/video URLs refer to upstream material and remain under their owners' terms. The gallery's example photographs are externally hosted Unsplash material; they are not included in this repository or covered by its MIT licence. Replace demo imagery with assets you have rights to use when adapting a block.

Metadata notes and reference analyses are original commentary; any third-party names and short descriptive excerpts identify their sources. Prompts hosted by reference galleries remain with their authors; a link to one is not a licence to copy it.

Do not contribute paid source, subscription keys, copied templates, or assets without a redistribution licence. Add attribution and the applicable notice for any new permissively licensed code. Private group membership does not change a vendor's licence.

Hosted Loading and homepage demos reuse MIT components from [SmoothUI](https://github.com/educlopez/smoothui), [Kibo UI](https://github.com/shadcnblocks/kibo), and [Magic UI](https://github.com/magicuidesign/magicui). Their source and original licences are isolated in `components/demos/vendor/<source>/`; `catalog/preview-demos.json` records source URLs and source-file hashes. SmoothUI's Dither Chart, Progressive Blur and Dot Morph Button retain their upstream implementation; Dot Morph Button imports the adjacent upstream SmoothButton, whose dependency hash is also recorded. Kibo's workspace-only Spinner import points to the official MIT shadcn Spinner in the adjacent `vendor/shadcn/` folder. These are demo adapters, not new registry components: installing uses the original vendor's command. Thinking Orbs is the installed MIT `thinking-orbs` package; its npm licence remains with the package.

Anatomy figure screenshots are from the MIT `anatomy-figures` package by Ryan (Copyright (c) 2026 Ryan). The original notice is retained in `third-party/anatomy-LICENSE.txt`; the separate MIT skill is referenced rather than copied. Source: https://github.com/wheresryan22/anatomy-figures.
