import type { Config } from 'tailwindcss';

// Design tokens live as CSS variables in src/styles/globals.css (light values
// in :root, dark overrides in [data-theme='dark']). Every colour below reads
// from a variable via rgb(var(--x) / <alpha-value>), which is what lets
// Tailwind's opacity modifiers (e.g. bg-brass/10) work correctly against a
// runtime-swappable theme. Never hard-code a hex value in a component —
// add a token here (and in globals.css) instead.
export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--color-surface-2) / <alpha-value>)',
        divider: 'rgb(var(--color-divider) / <alpha-value>)',

        ink: 'rgb(var(--color-text-primary) / <alpha-value>)',
        'ink-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        'ink-muted': 'rgb(var(--color-text-muted) / <alpha-value>)',

        accent: {
          DEFAULT: 'rgb(var(--color-accent-primary) / <alpha-value>)',
          hover: 'rgb(var(--color-accent-primary-hover) / <alpha-value>)',
        },
        'on-accent': 'rgb(var(--color-on-accent-primary) / <alpha-value>)',

        brass: {
          DEFAULT: 'rgb(var(--color-brass) / <alpha-value>)',
          hover: 'rgb(var(--color-brass-hover) / <alpha-value>)',
        },
        'on-brass': 'rgb(var(--color-on-brass) / <alpha-value>)',

        band: 'rgb(var(--color-band) / <alpha-value>)',
        'on-band': 'rgb(var(--color-on-band) / <alpha-value>)',

        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
        focus: 'rgb(var(--color-focus) / <alpha-value>)',

        chart: {
          1: 'rgb(var(--color-chart-1) / <alpha-value>)',
          2: 'rgb(var(--color-chart-2) / <alpha-value>)',
          3: 'rgb(var(--color-chart-3) / <alpha-value>)',
          4: 'rgb(var(--color-chart-4) / <alpha-value>)',
          5: 'rgb(var(--color-chart-5) / <alpha-value>)',
        },
      },
      borderColor: {
        DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
      },
      fontFamily: {
        // Fraunces carries the personality; Inter does the reading; JetBrains
        // Mono is reserved for numerals and technical captions (step numbers,
        // the SIP illustration caption) — not used as decorative labelling.
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        // One scale, used everywhere. Display sizes are fluid so they hold
        // their proportions from a 320px phone to a 1920px desktop without a
        // breakpoint-by-breakpoint override in each component.
        display: ['clamp(2.625rem, 1.95rem + 3vw, 5rem)', { lineHeight: '1.02', letterSpacing: '-0.022em' }],
        h1: ['clamp(2.125rem, 1.75rem + 1.7vw, 3.25rem)', { lineHeight: '1.08', letterSpacing: '-0.016em' }],
        h2: ['clamp(1.75rem, 1.45rem + 1.35vw, 2.625rem)', { lineHeight: '1.12', letterSpacing: '-0.014em' }],
        h3: ['clamp(1.25rem, 1.15rem + 0.45vw, 1.5rem)', { lineHeight: '1.25', letterSpacing: '-0.006em' }],
        lead: ['clamp(1.0625rem, 1.0rem + 0.3vw, 1.25rem)', { lineHeight: '1.55' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        body: ['1rem', { lineHeight: '1.6' }],
        small: ['0.875rem', { lineHeight: '1.55' }],
        label: ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.01em' }],
        marker: ['0.75rem', { lineHeight: '1', letterSpacing: '0.04em' }],
        'financial-lg': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        financial: ['1.25rem', { lineHeight: '1.3' }],
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.625rem',
        lg: '1rem',
        xl: '1.5rem',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      maxWidth: {
        prose: '68ch',
        measure: '54ch',
      },
      transitionTimingFunction: {
        signature: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        250: '250ms',
        400: '400ms',
      },
    },
  },
  plugins: [],
} satisfies Config;
