import type { Config } from 'tailwindcss';

/*
  Tailwind is the delivery mechanism for the token system, not a second copy
  of it. Every value below reads a CSS variable defined in
  src/styles/tokens.css — light values on :root, dark overrides on
  [data-theme='dark']. Colours go through rgb(var(--x) / <alpha-value>),
  which is what lets opacity modifiers (bg-brand/10) work against a theme
  swapped at runtime.

  Never hard-code a hex, a pixel radius, a duration or a shadow in a
  component. Add the token to tokens.css and expose it here.

  Names marked LEGACY are aliases kept so sections written before Phase 1
  keep compiling and stay visually coherent under the new system. They are
  removed as each section is rebuilt in the phase that owns it.
*/
const color = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`;

export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* ── Grounds and surfaces ─────────────────────────────────────── */
        bg: color('bg'),
        surface: {
          DEFAULT: color('surface'),
          raised: color('surface-raised'),
          sunken: color('surface-sunken'),
        },
        /* LEGACY — the previous two-surface naming. */
        'surface-2': color('surface-sunken'),

        /* ── Lines ────────────────────────────────────────────────────── */
        divider: color('divider'),
        'border-strong': color('border-strong'),

        /* ── Text ─────────────────────────────────────────────────────── */
        ink: {
          DEFAULT: color('text-primary'),
          display: color('text-display'),
          secondary: color('text-secondary'),
          muted: color('text-muted'),
          disabled: color('text-disabled'),
        },
        'ink-secondary': color('text-secondary'),
        'ink-muted': color('text-muted'),

        /* ── Brand ────────────────────────────────────────────────────── */
        brand: {
          DEFAULT: color('brand'),
          hover: color('brand-hover'),
          pressed: color('brand-pressed'),
          subtle: color('brand-subtle'),
          ink: color('brand-on-surface'),
        },
        'on-brand': color('on-brand'),

        /* LEGACY — `accent` was the primary action colour before Phase 1. */
        accent: {
          DEFAULT: color('brand'),
          hover: color('brand-hover'),
        },
        'on-accent': color('on-brand'),

        /*
          LEGACY — `brass` was the warm gold accent. Phase 0 §6.3 and §10.1
          retire gold entirely, so the alias now resolves to the brand
          colour, which is the role it was actually filling (markers,
          selected states, small rules). Sections still using it pick up the
          new system without being redesigned ahead of their phase.
        */
        brass: {
          DEFAULT: color('brand-on-surface'),
          hover: color('brand-hover'),
        },
        'on-brass': color('on-brand'),

        /* ── Subject tone channel (Phase 3) ───────────────────────────
           Not a colour: the accent of whatever subject the nearest
           data-tone ancestor declares. See the SUBJECT TONE CHANNEL block
           in globals.css and the accent tokens in tokens.css. One panel
           component renders nine differently-coloured subjects through it,
           in both themes, without naming a single one. */
        tone: {
          /* Text and icons. Clears 4.5:1 on bg, surface and sunken. */
          DEFAULT: 'rgb(var(--tone) / <alpha-value>)',
          /* Solid fill. White label clears 4.5:1 on it in both themes. */
          fill: 'rgb(var(--tone-fill) / <alpha-value>)',
          /* Tinted surface. Body text still reads on it in both themes. */
          tint: 'rgb(var(--tone-tint) / <alpha-value>)',
        },
        'on-tone': color('on-brand'),

        /* ── Interaction states ───────────────────────────────────────── */
        selected: {
          DEFAULT: color('selected-surface'),
          border: color('selected-border'),
        },
        hovered: color('hover-surface'),
        pressed: color('pressed-surface'),
        disabled: {
          DEFAULT: color('disabled-surface'),
          border: color('disabled-border'),
        },

        /* ── Ink band (chapter / footer surface, dark in both themes) ─── */
        band: {
          DEFAULT: color('band'),
          surface: color('band-surface'),
          brand: color('band-brand'),
        },
        'on-band': {
          DEFAULT: color('on-band'),
          muted: color('on-band-muted'),
        },

        /* ── Validation and data ──────────────────────────────────────── */
        success: color('success'),
        warning: color('warning'),
        error: color('error'),
        focus: color('focus-ring'),
        'focus-inner': color('focus-ring-inner'),

        /* ── The three redesign devices (see tokens.css) ──────────────── */
        /* A field behind a pinned stage, never a glow on a component. */
        ambient: color('ambient'),
        /* Translucent panel base — pair with `backdrop-blur`. */
        veil: color('veil'),
        /* The hairline threading the page, and its active instance. */
        spine: {
          DEFAULT: color('spine'),
          active: color('spine-active'),
        },

        chart: {
          1: color('chart-1'),
          2: color('chart-2'),
          3: color('chart-3'),
          4: color('chart-4'),
          5: color('chart-5'),
          grid: color('chart-grid'),
          axis: color('chart-axis'),
        },
      },

      borderColor: {
        DEFAULT: color('border'),
        border: color('border'),
      },

      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        /*
          LEGACY — the monospace numeral face is retired (Phase 0 §8.3).
          Sequential markers keep their class and now render in the display
          face, which is where §8.3 places them.
        */
        mono: ['var(--font-display)'],
      },

      /*
        TYPE SCALE — Phase 0 §8.4, locked structure.
        Fluid via clamp() so there is no jump between breakpoints, and the
        scale is the only place a font size is decided.
      */
      fontSize: {
        'display-xl': [
          'clamp(2.5rem, 1.62rem + 4.4vw, 4.75rem)',
          { lineHeight: '1.05', letterSpacing: '-0.025em', fontWeight: '650' },
        ],
        'display-lg': [
          'clamp(2rem, 1.61rem + 1.95vw, 3.25rem)',
          { lineHeight: '1.08', letterSpacing: '-0.02em', fontWeight: '650' },
        ],
        'display-md': [
          'clamp(1.625rem, 1.43rem + 0.98vw, 2.25rem)',
          { lineHeight: '1.12', letterSpacing: '-0.015em', fontWeight: '650' },
        ],
        /*
          `sm` and `xs` complete the display ramp. They were referenced by
          the pinned sections before they existed, which meant those
          headings silently fell back to the browser's default h2/h3 — the
          scale has to carry every step a section actually asks for.
          `xs` is the smallest size still set as display rather than as a
          title: it is what a heading inside a card uses.
        */
        'display-sm': [
          'clamp(1.4375rem, 1.31rem + 0.63vw, 1.875rem)',
          { lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: '650' },
        ],
        'display-xs': [
          'clamp(1.25rem, 1.17rem + 0.39vw, 1.5rem)',
          { lineHeight: '1.2', letterSpacing: '-0.012em', fontWeight: '650' },
        ],
        /*
          The hero headline, and the only step above `display-xl`. It is
          sized against the viewport rather than the container so it holds
          its three-line break from 360px to 1920px — see the
          `.hero-headline` rule, which remains the container-query version
          used inside the narrative column.
        */
        'display-hero': [
          /*
            Tuned against the measure rather than picked: the headline has
            to set in three lines from 1024px up, and the narrative column
            is ~34rem there. A steeper ramp gave 64px at 1024, which bought
            a fourth line and left "decision" stranded on its own.
          */
          'clamp(2.375rem, 1.04rem + 3.85vw, 4.5rem)',
          { lineHeight: '1.04', letterSpacing: '-0.028em', fontWeight: '700' },
        ],
        'title-lg': [
          'clamp(1.25rem, 1.17rem + 0.39vw, 1.5rem)',
          { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' },
        ],
        'title-sm': ['clamp(1.0625rem, 1.04rem + 0.12vw, 1.125rem)', { lineHeight: '1.35', fontWeight: '600' }],
        'body-lg': ['clamp(1.0625rem, 1.02rem + 0.2vw, 1.1875rem)', { lineHeight: '1.55' }],
        body: ['clamp(1rem, 0.98rem + 0.1vw, 1.0625rem)', { lineHeight: '1.55' }],
        /* LEGACY alias — `body-base` was written in the pinned sections
           before the scale was checked. Resolves to `body`. */
        'body-base': ['clamp(1rem, 0.98rem + 0.1vw, 1.0625rem)', { lineHeight: '1.55' }],
        'body-sm': ['clamp(0.875rem, 0.86rem + 0.1vw, 0.9375rem)', { lineHeight: '1.5' }],
        /* Never below 12px, and it must pass AA — see §23.5. */
        legal: ['clamp(0.75rem, 0.74rem + 0.1vw, 0.8125rem)', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        /* Financial output. Always paired with the `tabular` utility. */
        'data-lg': [
          'clamp(1.75rem, 1.4rem + 1.75vw, 2.75rem)',
          { lineHeight: '1.05', letterSpacing: '-0.015em', fontWeight: '650' },
        ],
        'data-md': ['clamp(1.25rem, 1.17rem + 0.39vw, 1.5rem)', { lineHeight: '1.2', fontWeight: '600' }],

        /* LEGACY aliases mapped onto the scale above. */
        display: [
          'clamp(2.5rem, 1.62rem + 4.4vw, 4.75rem)',
          { lineHeight: '1.05', letterSpacing: '-0.025em', fontWeight: '650' },
        ],
        h1: [
          'clamp(2rem, 1.61rem + 1.95vw, 3.25rem)',
          { lineHeight: '1.08', letterSpacing: '-0.02em', fontWeight: '650' },
        ],
        h2: [
          'clamp(1.625rem, 1.43rem + 0.98vw, 2.25rem)',
          { lineHeight: '1.12', letterSpacing: '-0.015em', fontWeight: '650' },
        ],
        h3: [
          'clamp(1.25rem, 1.17rem + 0.39vw, 1.5rem)',
          { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' },
        ],
        lead: ['clamp(1.0625rem, 1.02rem + 0.2vw, 1.1875rem)', { lineHeight: '1.55' }],
        small: ['clamp(0.875rem, 0.86rem + 0.1vw, 0.9375rem)', { lineHeight: '1.5' }],
        label: ['0.875rem', { lineHeight: '1.35', fontWeight: '600' }],
        marker: ['0.8125rem', { lineHeight: '1', letterSpacing: '0.01em', fontWeight: '600' }],
        'financial-display': [
          'clamp(1.75rem, 1.4rem + 1.75vw, 2.75rem)',
          { lineHeight: '1.05', letterSpacing: '-0.015em', fontWeight: '650' },
        ],
        'financial-lg': ['clamp(1.75rem, 1.4rem + 1.75vw, 2.75rem)', { lineHeight: '1.05', fontWeight: '650' }],
        financial: ['clamp(1.25rem, 1.17rem + 0.39vw, 1.5rem)', { lineHeight: '1.2', fontWeight: '600' }],
      },

      fontWeight: {
        display: 'var(--weight-display)' as unknown as string,
        title: 'var(--weight-title)' as unknown as string,
      },

      /* Base unit 4px — Tailwind's default scale already matches, these are
         the named steps from §13 that fall outside it. */
      spacing: {
        /* 52px — the `lg` action height from §17, which Tailwind's default
           scale skips between 48px and 56px. */
        13: '3.25rem',
        /* 56px — mobile navigation row height (§16). */
        14: '3.5rem',
        gutter: 'var(--gutter)',
        header: 'var(--header-height)',
        'safe-b': 'env(safe-area-inset-bottom)',
      },

      borderRadius: {
        action: 'var(--radius-action)',
        surface: 'var(--radius-surface)',
        band: 'var(--radius-band)',
        pill: 'var(--radius-pill)',
        /* LEGACY — the single-radius scale the previous build used. */
        sm: 'var(--radius-action)',
        md: 'var(--radius-action)',
        lg: 'var(--radius-surface)',
        xl: 'var(--radius-band)',
      },

      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        /* Reserved for the pinned stage's active card. Nothing else. */
        '2xl': 'var(--shadow-2xl)',
      },

      /*
        Container widths are applied by the `.container-*` classes, not by
        these utilities — these are the *text measure* caps from §8.4, which
        are a different job. Capping a paragraph in `ch` rather than `rem`
        keeps the line length right as the fluid type scale changes size.
      */
      maxWidth: {
        /* Body copy: 68 characters. */
        prose: '68ch',
        /* Section intros: 56 characters. */
        measure: '56ch',
        /* A long-form column inside a shell container — FAQ answers, the
           legal block. Wider than a single paragraph measure because it
           holds a stack of blocks rather than one run of text. */
        reading: '54rem',
        /* Available where a block needs to match a container edge exactly. */
        shell: 'var(--container-shell)',
        content: 'var(--container-content)',
      },

      transitionDuration: {
        micro: 'var(--dur-micro)',
        instant: 'var(--dur-instant)',
        fast: 'var(--dur-fast)',
        base: 'var(--dur-base)',
        slow: 'var(--dur-slow)',
        story: 'var(--dur-story)',
        /* LEGACY numeric durations used by pre-Phase-1 sections. */
        250: 'var(--dur-base)',
        400: 'var(--dur-slow)',
      },

      transitionTimingFunction: {
        out: 'var(--ease-out)',
        in: 'var(--ease-in)',
        move: 'var(--ease-move)',
        /* LEGACY */
        signature: 'var(--ease-out)',
      },

      translate: {
        sm: 'var(--travel-sm)',
        md: 'var(--travel-md)',
        lg: 'var(--travel-lg)',
      },

      zIndex: {
        header: '40',
        overlay: '50',
        skip: '60',
      },
    },
  },
  plugins: [],
} satisfies Config;
