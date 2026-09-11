import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { transitions, withMotionSafety } from '@/lib/motion/variants';
import { cn } from '@/lib/utils/cn';

interface ThemeToggleProps {
  className?: string;
  /** `band` recolours the control for use on the deep forest band. */
  tone?: 'default' | 'band';
}

/**
 * The icon cross-fades and turns slightly on switch — feedback that
 * confirms the tap landed, which matters because the rest of the change
 * happens instantly across the whole page and can otherwise read as a
 * glitch rather than a deliberate switch.
 */
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
        'relative inline-flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border',
        'transition-colors motion-safe:duration-200 ease-signature',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        tone === 'band'
          ? 'border-on-band/25 text-on-band hover:bg-on-band/10'
          : 'border-divider text-ink-secondary hover:border-border hover:text-ink',
        className
      )}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={isDark ? 'dark' : 'light'}
          initial={{ opacity: 0, rotate: -35, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 35, scale: 0.8 }}
          transition={withMotionSafety(prefersReducedMotion, transitions.fast)}
          className="inline-flex"
        >
          {isDark ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
