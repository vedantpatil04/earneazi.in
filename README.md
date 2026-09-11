# Earneazi — Frontend V1

React + TypeScript + Vite + Tailwind + React Router + Framer Motion +
Recharts + React Hook Form + Zod. Frontend only: no backend, no database,
no API server, no authentication, no AI.

**Source of truth:** `EARNEAZI-PHASE-0-SPEC.md` (held outside this repo).
Section references throughout the code — `§14`, `§18.2`, `§29` — point at
it. When this README and that document disagree, that document wins.

## Roadmap (locked)

| Phase | Scope | Status |
|---|---|---|
| 0 | Audit & design system lock | Complete (specification) |
| **1** | **Global shell & brand system** | **Complete — this update** |
| 2 | Hero + signature motion | Not started |
| 3 | Services + financial goals | Not started |
| 4 | SIP calculator | Not started |
| 5 | Trust & conversion | Not started |
| 6 | FAQ + advanced footer | Not started |
| 7 | Production hardening | Not started |

Sections built before Phase 1 still render on every route. They now
inherit the Phase 1 token system, but their layouts, interactions and
content belong to the phases above and have deliberately not been
redesigned.

## Running this

```bash
npm install
npm run dev        # dev server
npm run typecheck  # tsc -b --noEmit
npm run test       # vitest (SIP calculation unit tests)
npm run build      # production build
```

Deploying into a subdirectory rather than a domain root:

```bash
VITE_BASE_PATH=/subdir/ npm run build
```

The router reads the same value at runtime, so no code changes.

## Architecture

```
src/
  config/              Owner-dependent values: brand.ts (logo, wordmark, tagline), site.ts (locale, base path, router)
  app/                 AppLayout (the shell) + one file per route
  components/
    brand/             Logo system (Logo, LogoMark) and DimensionalText
    ui/                Primitives: Button, Link, IconTile, Field, SectionHeader, ThemeToggle/ThemeControl, form controls
    layout/            Container, Section, Grid/GridItem, Stack, PageShell, PageHeader
    navigation/        Header, MenuTrigger, MobileNav, Footer, ScrollManager, RouteAnnouncer
    motion/            Reveal / RevealGroup, PageTransition
    sections/home/     One file per homepage section — Phases 2–5 own these
  data/                Typed content. Business facts carry a `verified` flag; nothing unverified renders
  features/            sip-calculator (Phase 4 owns the UI), contact (Phase 5 owns the flow)
  hooks/               useMediaQuery, usePrefersReducedMotion, useTheme, useHasScrolled, useLockBodyScroll, useInert
  lib/
    theme/             ThemeProvider — preference state, persistence, no-flash, theme-color
    motion/            tokens.ts (durations/easings/travel) + variants.ts
    finance/           SIP calculation, formatting, unit tests
    utils/             cn() classname helper
  styles/
    tokens.css         THE token file. Colour, spacing, radius, shadow, motion, containers
    fonts.css          Self-hosted typeface declaration
    globals.css        Base layer, containers, focus system, reduced-motion net
  types/               Shared TypeScript contracts
```

**Two rules that hold the system together.** Components never carry a hex,
a pixel radius, a duration or an easing curve — those live in
`styles/tokens.css` and reach components as Tailwind utilities. Components
never carry copy — that lives in `data/*.ts`, typed against
`types/content.ts`. Changing a token or a data file should never require
opening a component.

## The design system

### Colour

`styles/tokens.css` is layered: primitive ramps, then semantic role tokens
(`--color-text-secondary`), then structure. Only the role tokens are ever
consumed. Light and dark are written independently — dark is not an
inversion: its surfaces rise toward light, shadow elevation is replaced by
surface lightening plus a light edge, and the brand lightens so text and
icons clear 4.5:1 on ink.

Every foreground/background pair in the system is recorded with its
measured contrast ratio beside the token (§10.3). Every pair passes: body
text ≥4.5:1, interactive borders and focus indicators ≥3:1. A pair that
failed was changed, not shipped with a note.

The cream ground and the gold accent are retired (§6.3, §10.1). The
`brass` Tailwind name survives as a documented alias pointing at the brand
colour, so sections built before Phase 1 pick up the new system without
being redesigned ahead of their phase.

### Typography

One self-hosted variable family: **Archivo Variable** (weight axis, SIL
Open Font License 1.1), latin + latin-ext, ~68 KB. Verified to carry
`tnum` (tabular figures) and U+20B9 `₹`.

The high-contrast serif is retired (§8.1) so the headline voice agrees with
the Earneazi wordmark, which is a bold sans. There is no font CDN (§8.2):
the previous build loaded three families from `fonts.googleapis.com`, which
is a third-party connection on the critical path and an external dependency
a static host does not need.

The display and body roles are separate tokens (`--font-display`,
`--font-body`) even though one family currently serves both, so an approved
pairing is a one-line change. See the header comment in
`styles/fonts.css` for how to swap it.

Scale: `display-xl/lg/md`, `title-lg/sm`, `body-lg/body/body-sm`, `legal`,
`data-lg/data-md` — all fluid via `clamp()` (§8.4). Financial values pair a
`data-*` size with the `tabular` utility.

### Layout

Three container widths and no fourth (§14): `shell` 1440, `content` 1200,
`prose` 720. Gutters step 20 / 24 / 32 / 48 and include the safe-area
inset. `Grid columns="canonical"` gives the 4 / 8 / 12 frame, and
`GridItem` declares a span — which is what makes "the section header and
the grid beneath it share a start and end column" checkable rather than a
matter of eyeballing padding.

### Motion

Tokens in `lib/motion/tokens.ts`, mirroring the `--dur-*` / `--ease-*`
custom properties: instant 120, fast 180, base 240, slow 400, story 700.
Travel budget: 12px for feedback, 24px for a content entrance, 40px for a
section device — nothing on this site moves further.

`prefers-reduced-motion` is handled at the point each animation is written,
through `usePrefersReducedMotion` + `withMotionSafety`, with a global CSS
safety net behind it. Content is never gated behind an animation: if
scripts fail, nothing sets an initial opacity, so everything renders.

## Accessibility

Target WCAG 2.2 AA, treated as Phase 1 work rather than deferred:

- `lang="en-IN"`; one `h1` per route; one each of `header`/`nav`/`main`/`footer`.
- A skip link as the first focusable element, visible on focus.
- One focus indicator for the whole site: a 2px brand ring at 2px offset
  plus a 1px contrasting inner ring, with a forced-colors fallback.
  `outline: none` without a replacement is a build-breaking error.
- Per-route `document.title`, announced on client-side navigation by
  `RouteAnnouncer`.
- The mobile sheet is a real dialog: focus moves in and returns to the
  trigger, Tab is trapped, Escape closes, the document is `inert`, and the
  page behind does not scroll.
- `scroll-margin-top` on every anchor target, from the same token the
  header height uses.
- Touch targets ≥44×44 (`Button` `md`/`lg`, icon buttons, nav rows).
- Form controls are ≥48px tall with ≥16px text, which is what stops iOS
  Safari zooming on focus.

## Content governance

Business facts live behind a `verified` flag in `data/contact.ts`. A
channel with `verified: false` renders nothing — not a placeholder. On a
financial-services site an unverified phone number is a worse failure than
no phone number.

Nothing in this build states a client count, an AUM figure, a return, a
rate, a registration, a testimonial or a credential. §3.4 of the
specification is the authoritative register of what may not be reintroduced
without documentary proof.

## Deployment

`BrowserRouter` with a configurable basename. The host must rewrite unknown
paths to `index.html`; `vercel.json` does this for the preview deployment.

The GoDaddy plan type, the domain root vs subdirectory question, the
canonical host and the deployment method are all still unconfirmed (§31),
so no `.htaccess` is committed. Writing one now would be asserting host
behaviour nobody has verified. **No deployment to the real GoDaddy host has
been verified.**
