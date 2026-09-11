import { useMediaQuery } from './useMediaQuery';

/**
 * Single source of truth for reduced-motion checks (Section K / L). Any
 * Framer Motion transition in the app should be passed through
 * `withMotionSafety` (src/lib/motion/variants.ts) using this value, rather
 * than each component re-implementing its own matchMedia check.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
