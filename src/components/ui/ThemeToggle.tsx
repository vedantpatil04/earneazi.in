import { useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { ThemePreference } from '@/types/theme';
import { useTheme } from '@/hooks/useTheme';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { transitions, withMotionSafety } from '@/lib/motion/tokens';
import { cn } from '@/lib/utils/cn';

/**
 * Theme controls — Phase 0 §12.
 *
 * Two surfaces for the same state, as the audit specifies:
 *
 *   ThemeToggle   a two-state icon button, for the nav bar where there is
 *                 no room for three. It is a real <button> with
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

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
      className={cn(
        'relative inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-action border',
        'transition-[background-color,border-color,color] motion-safe:duration-instant ease-out',
        tone === 'band'
          ? 'border-on-band/25 text-on-band hover:bg-on-band/10'
          : 'border-divider text-ink-secondary hover:border-border hover:bg-hovered hover:text-ink',
        className
      )}
    >
      {/* The icon cross-fades on switch. The rest of the page changes at
          once, which can otherwise read as a glitch rather than as a
          deliberate switch — this is the acknowledgement that the tap
          landed. */}
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={isDark ? 'dark' : 'light'}
          initial={{ opacity: 0, rotate: -30, scale: 0.85 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 30, scale: 0.85 }}
          transition={withMotionSafety(prefersReducedMotion, transitions.fast)}
          className="inline-flex"
        >
          {isDark ? <Sun size={19} strokeWidth={1.5} aria-hidden="true" /> : <Moon size={19} strokeWidth={1.5} aria-hidden="true" />}
        </motion.span>
      </AnimatePresence>
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
  const onBand = tone === 'band';
  // The control appears in both the mobile sheet and the footer, so the
  // label id has to be per-instance or the two collide.
  const labelId = `theme-control-${useId()}`;

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
          'inline-flex rounded-action border p-1',
          onBand ? 'border-on-band/20 bg-on-band/5' : 'border-divider bg-surface-sunken'
        )}
      >
        {OPTIONS.map(({ value, label: optionLabel, icon: Glyph }) => {
          const selected = preference === value;
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
                'inline-flex min-h-[2.5rem] items-center gap-2 rounded-[calc(var(--radius-action)-2px)] px-3 text-body-sm font-medium',
                'transition-[background-color,color] motion-safe:duration-instant ease-out',
                selected
                  ? onBand
                    ? 'bg-on-band text-band'
                    : 'bg-surface text-ink shadow-sm'
                  : onBand
                    ? 'text-on-band-muted hover:text-on-band'
                    : 'text-ink-muted hover:text-ink'
              )}
            >
              <Glyph size={16} strokeWidth={1.5} aria-hidden="true" />
              {optionLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
