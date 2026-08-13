# Grupo LemosPassos — Design System

## Company & product context
Grupo LemosPassos is a Brazilian food-service and facilities outsourcing ("terceirização") group founded in 1961. Per the brand deck, the group operates across several business units under one master brand:

- **LemosPassos Restaurantes** — restaurantes corporativos, restaurantes populares, restaurantes comerciais, cantinas escolares
- **LemosPassos Alimentação Escolar** — merenda escolar
- **LemosPassos Alimentação Hospitalar** — food service for hospitals
- **LemosPassos Administração Prisional** — prison food service
- **LemosPassos Services** — conservação, limpeza e paisagismo (cleaning/landscaping)
- **LemosPassos Hotelaria e Alojamentos** — hospitality/lodging

### Brand platform (from the 2016/2023 rebrand deck)
- **Purpose:** a 55+ year old company that always thinks ahead — wants to be recognized as a tireless, dedicated partner to its clients.
- **Positioning:** the best outsourcing solution — a committed partner delivering tailor-made service with security, for every client.
- **Values:** On Demand · Sob Medida · Tradicional · Solidez · Compromisso · Qualidade · Dedicação · Parceria · Agilidade · Movimento.
- **Brand concept:** modern with an innovative approach — conveys seriousness, movement and confidence at once.

### Sources
- `uploads/Apresentação Nova Marca LemosPassos.pdf` (also copied to `uploads/apresentacao-nova-marca.pdf` for tooling) — 29-page brand relaunch deck: objective, brand platform, values, brand architecture, typography (Quicksand), colors, applications.
- `uploads/LOGO_GRUPO_LEMOSPASSOS_DIVERSAS_VERSOES_2023_LOGO_DESDE_1961.png` — primary logo lockup.
- `uploads/ELEMENTOS_LOGO_LP_SEPARADOS-0{1,2,3,4,5,7,8,9}.png` — separated logo build elements (organic blobs + linework), copied into `assets/logo/`.

No codebase or Figma file was provided — this system is built from the brand deck and logo artwork alone. If a product codebase or Figma library exists, attach it so components and UI kits can be grounded in real screens.

## Content fundamentals
- **Language:** Portuguese (Brazil). Copy in the deck is declarative and short — headline statements, then a supporting paragraph.
- **Voice:** confident, institutional, but warm — talks about "parceria" (partnership) and "dedicação" (dedication) rather than hard-sell claims. Third person about the company ("A LemosPassos quer..."), not "we/you" conversational address.
- **Casing:** section labels and value words are set in full caps for emphasis (e.g. "OBJETIVO", "VALORES", "SOLIDEZ"), while body paragraphs are sentence case. The logo wordmark itself is intentionally all-lowercase ("grupo / lemos / passos"), a deliberate contrast to the caps used in section headers.
- **Numbers as proof points:** the deck leans on real tenure/scale claims — "55 anos de atividade", "entre as 9 primeiras do País", "desde 1961" — never invented stats.
- **No emoji.** Tone is corporate/institutional, not social.
- **Example lines (verbatim from source):**
  - "Uma marca que traduza ao mesmo tempo a tradição e a confiança num grupo cheio de história."
  - "A LemosPassos quer, fundamentada em sua história de responsabilidade e compromisso, ser sempre reconhecida como uma parceira incansável e dedicada aos seus clientes."

## Visual foundations
- **Color:** a navy family (`--lp-navy-950/900/800/700`) as the dominant, most-institutional color, paired with a teal/blue family (`--teal-800→--teal-300`) that reads as fresher and more energetic. Sampled directly from logo artwork (not invented): navy `#1b2d4e` / `#0c1b3a`, teals `#083b55`, `#0f5275`, `#3687ab`. Neutrals are cool-toned grays. No warm accent color appears in the source — flag before introducing one.
- **Type:** Quicksand (Bold / Regular / Light) is the deck's specified typeface — a rounded, geometric sans that matches the soft, organic logo shapes. It is available on Google Fonts, so no substitution was needed; loaded via `@import` in `tokens/typography.css`.
- **Logo & brand shape motif:** the primary mark is a navy circular badge containing overlapping organic "blob"/leaf shapes in navy and teal, with the lowercase wordmark centered and "desde 1961" beneath. The separated elements (`assets/logo/elemento-blob-*.png`) are soft, rounded, asymmetric blobs — never sharp geometric shapes — evoking water, leaves, motion. A second motif, thin overlapping ellipse "linework" (`assets/logo/elemento-linework-movement-*.png`) in navy/teal/light-blue, is used to represent agility and movement per the deck's brand construction page.
- **Backgrounds:** no photography, gradients, or patterns appear in the source materials — the deck's aesthetic is flat color fields (navy or white) with the organic blob shapes as the only decorative background element. Use navy or white as full-bleed section backgrounds; use the blob PNGs as soft corner/edge decoration, never tiled as a repeating pattern.
- **Corner radii / shapes:** because the brand mark itself is fully organic (blobs, circles), UI corner radii should lean soft and generous rather than sharp — this system uses `--radius-md` (14px) as the default control radius and `--radius-lg`/`--radius-xl` for cards and hero surfaces, with `--radius-full` for pills/badges/avatars.
- **Cards:** white surface, 1px `--border-subtle` or no border, `--shadow-sm`/`--shadow-md` (soft, cool-toned navy shadows, never black), `--radius-lg`.
- **Borders:** subtle, cool gray (`--border-subtle`/`--border-default`); no colored left-border accent cards — avoid that treatment entirely.
- **Shadows:** soft, diffused, navy-tinted (never pure black) — `--shadow-sm` for resting cards, `--shadow-md` for raised/hover, `--shadow-lg` for modals/popovers.
- **Hover states:** primary surfaces darken slightly (navy → deeper navy); secondary/teal surfaces lighten slightly; links shift from teal-700 to navy-800.
- **Press/active states:** slight scale-down (0.98) plus the hover color, no color inversion.
- **Focus states:** a 2px teal (`--focus-ring`) outline with 2px offset — never remove focus rings.
- **Transparency/blur:** none observed in source; avoid glassmorphism/blur effects — this brand is flat and confident, not translucent.
- **Animation:** the source deck itself is static/print, so motion isn't defined by it; this system defaults to short, standard-easing transitions (120–320ms, `--ease-standard`) for hover/press/focus — no bounce, no elaborate choreography, consistent with the brand's "seriedade" (seriousness) value.
- **Imagery:** none supplied. No stock photography included — do not invent any. When a product needs imagery, use neutral placeholders and flag the gap.

## Iconography
No icon font, SVG icon set, or icon usage appears anywhere in the supplied brand deck or logo files. The brand's only graphic vocabulary is the organic blob shapes and the movement linework described above — there is no evidence of a bespoke or third-party icon system.
**Substitution:** for any UI work needing icons, this system links **Lucide** from CDN (`unpkg.com/lucide-static` or `lucide` web font), chosen for its simple, medium-stroke-weight linework that won't visually compete with the rounded Quicksand type and organic logo shapes. This is a flagged substitution, not a brand-sourced asset — replace with real brand icons if/when the company defines them.
No emoji or unicode-glyph icons appear in the source; none are used in this system either.

## Intentional additions
Because no codebase or Figma component library was supplied, this system authors a standard foundational component set (Button, Badge/Tag, Card, Input, Select, Checkbox/Radio, Alert/Callout, Nav bar) sized to a corporate/institutional B2B site and internal tools — sized and styled from the brand deck's colors, type and shape language, not copied from any existing product screen.

## Index
- `styles.css` — root stylesheet entry (imports only)
- `tokens/` — `colors.css`, `typography.css`, `spacing.css` (radius/shadow/motion/layout), `base.css` (resets)
- `assets/logo/` — primary badge lockup + separated blob/linework elements
- `guidelines/` — foundation specimen cards (`@dsCard`-tagged) for the Design System tab: colors, type, spacing, shape/motif, iconography
- `components/core/` — Button, Badge, Card, Input, Select, Checkbox, Radio, Alert, Navbar (`.jsx` + `.d.ts` + `.prompt.md` + one `@dsCard` HTML per directory)
- `ui_kits/brand-showcase/` — a brand-forward institutional landing page recreation showing the components composed together
- `SKILL.md` — portable skill definition for use in Claude Code

## Caveats
- No codebase or Figma link was attached, so components/UI kit are original-but-brand-faithful, not recreations of an existing product.
- Icons are a CDN substitution (Lucide), not brand-original assets.
- Only two brand colors (navy + teal) are confirmed from source; secondary/tertiary tints and all semantic colors (success/warning/danger) are this system's own extrapolation and should be reviewed.
