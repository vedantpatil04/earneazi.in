import { useId } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { ThemePreference } from '@/types/theme';
import { useTheme } from '@/hooks/useTheme';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { springUi, withMotionSafety } from '@/lib/motion/tokens';
import { cn } from '@/lib/utils/cn';

/**
 * Theme controls — Phase 0 §12.
 *
 * Two surfaces for the same state, as the audit specifies:
 *
 *   ThemeToggle   a two-state control, for the nav bar where there is no
 *                 room for three. It is a real <button> with
 *                 `aria-pressed`, and its accessible name says what
 *                 pressing it will do — announcing the change through the
 *                 name rather than a live region, so a screen reader is not
 *                 interrupted by an unrelated announcement.
 *
 *   ThemeControl  the three-state System / Light / Dark control, for the
 *                 mobile sheet and the footer. 'System' has to be reachable
 *                 or a user who toggles once can never hand control back to
 *                 their device.
 *
 * Both are ≥44px, keyboard operable, and visible in both themes.
 *
 * ── Enhancement A ────────────────────────────────────────────────────────
 *
 * The toggle is drawn as a switch: a recessed track with the sun and moon
 * set into it, and a raised knob that slides over whichever one is active.
 * The position is the state, the glyph on the knob repeats it, and the
 * spring is the shared `spring-ui` token — so it moves like the navigation
 * pill beside it. The three-state control uses the same construction: a
 * recessed track with a raised pill that slides to the selection.
 */

interface ThemeToggleProps {
  className?: string;
  /** Recolours the control for use on the ink band. */
  tone?: 'default' | 'band';
}

export function ThemeToggle({ className, tone = 'default' }: ThemeToggleProps) {
  const { mode, toggleTheme } = useTheme();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isDark = mode === 'dark';
  const onBand = tone === 'band';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
      className={cn('group relative inline-flex h-11 w-[3.75rem] shrink-0 rounded-pill', className)}
    >
      {/* The track — 32px tall, centred in the 44px target. */}
      <span
        aria-hidden="true"
        className={cn(
          'inset-well absolute inset-x-0 top-1.5 h-8 rounded-pill border',
          'transition-[background-color,border-color] motion-safe:duration-instant ease-out',
          onBand
            ? 'border-on-band/25 bg-on-band/10 group-hover:border-on-band/40'
            : 'border-divider bg-surface-sunken group-hover:border-border'
        )}
      />

      {/* The two states, set into the track. The knob covers the active one. */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-x-0 top-1.5 flex h-8 items-center justify-between px-2.5',
          onBand ? 'text-on-band-muted' : 'text-ink-muted'
        )}
      >
        <Sun size={12} strokeWidth={2} />
        <Moon size={12} strokeWidth={2} />
      </span>

      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{ x: isDark ? 28 : 0 }}
        transition={withMotionSafety(prefersReducedMotion, springUi)}
        className={cn(
          'raised absolute left-1 top-2.5 flex h-6 w-6 items-center justify-center rounded-pill border',
          onBand ? 'border-transparent bg-on-band text-band' : 'border-divider bg-surface'
        )}
      >
        {isDark ? (
          <Moon size={13} strokeWidth={2} className={onBand ? undefined : 'text-brand-ink'} />
        ) : (
          <Sun size={13} strokeWidth={2} className={onBand ? undefined : 'text-ink'} />
        )}
      </motion.span>
    </button>
  );
}

const OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: 'system', label: 'System', icon: Monitor },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
];

interface ThemeControlProps {
  className?: string;
  tone?: 'default' | 'band';
  /** Visible label above the control. Pass `null` to rely on the group's accessible name alone. */
  label?: string | null;
}

/**
 * The three-state control. Implemented as a radio group rather than three
 * buttons, so arrow keys move between the options and the selected one is
 * announced as selected rather than as pressed.
 */
export function ThemeControl({ className, tone = 'default', label = 'Theme' }: ThemeControlProps) {
  const { preference, setPreference } = useTheme();
  const prefersReducedMotion = usePrefersReducedMotion();
  const onBand = tone === 'band';
  // The control appears in both the mobile sheet and the footer, so the
  // label id — and the sliding pill's layout id — have to be per-instance
  // or the two collide.
  const instanceId = useId();
  const labelId = `theme-control-${instanceId}`;

  return (
    <div className={className}>
      {label && (
        <p className={cn('mb-2 text-body-sm font-semibold', onBand ? 'text-on-band-muted' : 'text-ink-muted')} id={labelId}>
          {label}
        </p>
      )}
      <div
        role="radiogroup"
        aria-labelledby={label ? labelId : undefined}
        aria-label={label ? undefined : 'Theme'}
        className={cn(
          'inset-well inline-flex rounded-pill border p-1',
          onBand ? 'border-on-band/20 bg-on-band/5' : 'border-divider bg-surface-sunken'
        )}
      >
        {OPTIONS.map(({ value, label: optionLabel, icon: Glyph }) => {
          const selected = preference === value;
          const pillClass = cn('absolute inset-0 rounded-pill', onBand ? 'bg-on-band' : 'raised bg-surface');

          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={selected}
              /* Roving tabindex: only the selected option is in the tab
                 order, and arrow keys move within the group — the native
                 radio behaviour this pattern is standing in for. */
              tabIndex={selected ? 0 : -1}
              onClick={() => setPreference(value)}
              onKeyDown={(event) => {
                if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
                event.preventDefault();
                const index = OPTIONS.findIndex((option) => option.value === preference);
                const next = event.key === 'ArrowRight' ? index + 1 : index - 1;
                const target = OPTIONS[(next + OPTIONS.length) % OPTIONS.length];
                setPreference(target.value);
              }}
              className={cn(
                /* 44px: the touch-target floor. These were 40px, which fell short on
                   the phone footer where this control is the last thing on the page. */
                'relative inline-flex min-h-11 items-center gap-2 rounded-pill px-3.5 text-body-sm font-medium',
                'transition-colors motion-safe:duration-instant ease-out',
                selected
                  ? onBand
                    ? 'text-band'
                    : 'text-ink-display'
                  : onBand
                    ? 'text-on-band-muted hover:text-on-band'
                    : 'text-ink-muted hover:text-ink'
              )}
            >
              {selected &&
                (prefersReducedMotion ? (
                  <span aria-hidden="true" className={pillClass} />
                ) : (
                  <motion.span
                    aria-hidden="true"
                    layoutId={`theme-control-pill-${instanceId}`}
                    transition={springUi}
                    className={pillClass}
                  />
                ))}
              <Glyph size={16} strokeWidth={1.75} aria-hidden="true" className="relative" />
              <span className="relative">{optionLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
