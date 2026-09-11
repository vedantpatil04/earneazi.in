# Earneazi — Frontend V1

React + TypeScript + Vite + Tailwind rebuild of Earneazi (mutual funds &
PMS, insurance, loans). Frontend-only for V1. Source of truth for all
requirements: `Earneazi_Phase0_Blueprint.md` (held outside this repo).

**Status: Phase 2 (homepage) complete.** Phase 1 (foundation & design
system) is unchanged underneath it. Home is now the real, content-complete
page described below; Services/About/Contact/FAQ/Financial Goals/SIP
Calculator remain Phase 1 placeholders — see "What's deliberately not
here."

## Running this

```bash
npm install
npm run dev        # start the dev server
npm run typecheck  # tsc -b --noEmit
npm run build       # production build
```

> This project was generated in a sandboxed environment with no network
> access, so `npm install` has not been run and dependency versions in
> `package.json` have not been resolved/verified against the npm registry.
> Every source file was hand-written and passed a syntax check and an
> import-resolution check, but a real `npm install` + `npm run build` +
> visual QA pass in both themes/breakpoints (Section 19 of the Phase 1
> instructions) still needs to happen before this is considered verified.

## Architecture

```
src/
  app/                 Route-level layout + HomePage (Phase 2, content-complete) + one placeholder per remaining sitemap page
  components/
    ui/                Base primitives: Button, Card, Input, Label, Textarea, Select, Slider, ThemeToggle, Badge, Divider, Icon
    layout/            Container, Section, Stack, Grid, PageShell
    navigation/        Header, MobileNav, Footer
    motion/            Reveal / RevealGroup — scroll-triggered entrance wrapper (Phase 2)
    sections/home/     One file per homepage section (Hero, GoalsGrid, ServicesShowcase, WhyEarneazi, HowItWorks, SipTeaser, FounderSection, FinalCta)
  data/                Typed content (services, goals, journey, trust, media, faq, team, testimonials, funds, nav) — media.ts is Phase 2, journey.ts/trust.ts are Phase 2
  features/
    sip-calculator/    Reserved — Phase 3
  hooks/               useMediaQuery, usePrefersReducedMotion, useTheme
  lib/
    theme/             ThemeProvider (light/dark state, persistence, system sync)
    motion/            Shared Framer Motion tokens/variants (interaction-triggered + Phase 2's scroll-narrative reveals)
    finance/           Reserved — Phase 3 (types only right now)
    utils/             cn() classname helper
  styles/globals.css   Design tokens (CSS variables) + base layer
  types/               Shared TypeScript contracts
```

**Data flow rule:** components never hard-code copy or hex colors. Copy
comes from `data/*.ts` (typed against `types/content.ts`), color comes from
Tailwind utility classes that resolve to the CSS variables in
`globals.css`. Swapping `data/services.ts` for real content, or swapping a
token value in `globals.css`, should never require touching a component.

### Theming

Both themes are token-driven via CSS variables (`:root` = light,
`[data-theme='dark']` = overrides), each independently chosen — dark mode
is not an inverted light mode. Tailwind's color utilities
(`bg-surface`, `text-ink`, etc.) automatically follow whichever theme is
active; there's no need for `dark:` prefixes on color utilities anywhere
in this codebase. Tokens are stored as `R G B` channels (not hex) so
Tailwind's opacity modifiers (`bg-success/10`) work correctly — see the
comment block at the top of `tailwind.config.ts`.

The inline script in `index.html`'s `<head>` sets `data-theme` before first
paint (avoids a flash of the wrong theme); `ThemeProvider` keeps it in sync
afterwards and persists the user's explicit choice to `localStorage`.

All text/background token pairs were checked against WCAG AA (≥4.5:1 for
body text, ≥3:1 for the interactive `border` token) using each theme's
actual hex values before being written into `globals.css`:

| Pair (light theme)              | Ratio |
|----------------------------------|------:|
| primary text / bg                | 15.5:1 |
| secondary text / bg               | 8.4:1 |
| muted text / bg                   | 4.7:1 |
| accent (green) / bg                | 5.7:1 |
| accent-secondary (gold) / bg        | 4.9:1 |
| interactive border / bg or surface | ≥3.25:1 |

| Pair (dark theme)                | Ratio |
|-----------------------------------|------:|
| primary text / bg                 | 16.5:1 |
| secondary text / bg                | 11.2:1 |
| muted text / bg                    | 6.7:1 |
| accent (green) / bg                 | 8.7:1 |
| accent-secondary (gold) / bg         | 8.5:1 |
| interactive border / bg or surface  | ≥3.4:1 |

Button text-on-accent-fill was checked separately per theme, since a
bright accent on a dark background needs dark text, not white:
light-theme buttons use white text on both accents; dark-theme buttons use
dark (`--color-on-accent-*`) text on both bright accents.

### Design direction (Section H)

- **Color:** deep emerald (`accent`, growth/trust) + muted brass gold
  (`accent-secondary`, warmth/premium) on a warm, slightly sage-tinted
  off-white (light) / deep green-black (dark) — chosen specifically to
  avoid the cream+terracotta and near-black+neon defaults, and the
  generic SaaS blue.
- **Type:** Fraunces (display, warm soft-serif) + Plus Jakarta Sans
  (body, humanist sans with good tabular figures for financial numbers).
- **Cards:** default to a hairline border, not a shadow — elevation is
  reserved (`Card elevation="raised"`) for content that genuinely needs to
  lift off the page, not applied uniformly.
- **Motion:** interaction-triggered tokens (menus, panels) from Phase 1,
  plus a Phase 2 set for the homepage's scroll-triggered section entrances
  (`lib/motion/variants.ts`, used through `components/motion/Reveal.tsx`).
  Deliberately varied per section (rise / clip-reveal / stagger / line-draw)
  rather than one fade-up reused everywhere — see the comment block at the
  top of that variants file.

### Dependencies

Confirmed stack only, plus one addition: **lucide-react**, for the icon
set the blueprint explicitly calls for in place of emoji-as-icons
(Section H). No other dependency was added — a `cn()` classname helper is
hand-rolled in `lib/utils/cn.ts` instead of adding `clsx`.

## Phase 2 — homepage (this update)

Replaced the Phase 1 placeholder Home with the real page: Hero → financial
goals entry → services → why Earneazi → how it works → SIP teaser →
founders → closing CTA (Phase 2 Blueprint, Section 5). Notes on specific
choices, beyond what's commented in the source:

- **Imagery:** exactly one photograph on the page (the hero), sourced from
  Unsplash and free to use under the Unsplash License — see
  `src/data/media.ts` for the credit and the swap point once real Earneazi
  photography is available. Every other visual is the existing icon system
  (`lucide-react`) plus typography — not a stock photo per section.
- **Copy:** service/goal descriptions were rewritten for tone, and the
  journey/trust/founder content is new. All of it stays inside what
  Sections 8/9/11/12 of the blueprint allow without a Section D sign-off —
  no invented stats, returns, testimonials, credentials, or bios. Where a
  section's content depends on a still-unverified Section D item (headline
  stats, founder bios/photos, testimonials), it's left out rather than
  drafted as a placeholder that might read as real.
- **Footer:** the two lines that were previously visible dev-notes
  ("placeholder pending verification (Section D)", "Regulatory disclaimer
  placeholder — final wording pending compliance review") are replaced — a
  plain link to the Contact page, and the standard mutual-fund market-risk
  disclosure line (industry boilerplate, not an Earneazi-specific
  compliance claim) in place of the second. Footer renders on every route,
  so this was in scope even though the rest of Phase 2 is Home-only
  (Section 22's "no internal phase language visible to users" is a
  site-wide acceptance criterion, not a Home-only one).
- **Shared primitives touched:** `Section` gained one new
  `background="accent"` option (for the closing CTA band only — not meant
  for routine section alternation), and `Reveal`'s `children` prop became
  optional (for a purely decorative connector line with no content of its
  own). Both changes are additive; nothing existing changed shape.
- **Accessibility fix worth flagging:** `--color-focus` equals
  `--color-accent-primary` in both themes, which is correct everywhere
  except the closing CTA band, whose *background* is that same accent
  color — a focus ring in the same color as what it sits on would be
  invisible. `FinalCta.tsx` scopes a local override to
  `--color-on-accent-primary` (already contrast-checked against both
  accent fills, see the table above) rather than changing the token
  globally.
- **No new dependencies.** Everything above uses the stack already
  confirmed for V1 — React Router `Link`, Framer Motion, `lucide-react`,
  Tailwind tokens.

Verification note: same sandboxed, no-network environment as Phase 1 (see
above), so nothing here has run in a real browser yet. This round's checks
went further than Phase 1's — every new/changed file was run through
esbuild as a pure syntax check, and a script cross-checked every `@/...`
import in the project against the actual exports of its target file. Both
passed clean. That's still not a substitute for `npm install && npm run
build` plus a real visual pass in both themes and at mobile/tablet/desktop
widths — do that before treating this as verified.

## What's deliberately not here (Phase 1/2 boundary)

- Full Services/About/Contact/FAQ/Financial Goals content — each still
  renders a short placeholder; Home is the only content-complete route so
  far (Phase 2 Blueprint, Section 3: "this phase is ONLY about ... the
  homepage").
- The SIP calculator's actual math and interactive UI (Phase 3 / Day 4).
  The homepage's SIP teaser is a static, non-numeric illustration only —
  see the comment in `SipTeaser.tsx`.
- Any backend, database, auth, or AI integration (out of scope for all of V1).
- Real photography for the founder section, verified bios, testimonials,
  and fund return figures — see the comments in `src/data/*.ts` for
  exactly what's pending and why (Phase 0 Blueprint, Section D).
