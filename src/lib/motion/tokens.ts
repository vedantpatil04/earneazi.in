import type { Transition } from 'framer-motion';

/**
 * Motion tokens — Phase 0 §18.1.
 *
 * The TypeScript mirror of the `--dur-*` / `--ease-*` custom properties in
 * src/styles/tokens.css. CSS transitions read the variables; Framer Motion
 * reads this file. Change both together — they are one system expressed
 * twice because the two runtimes cannot share a value.
 *
 * Nothing in the app should write its own duration or cubic-bezier. If a
 * new motion need does not fit a token here, the token is what changes.
 */

/** Seconds, because that is what Framer Motion takes. */
export const duration = {
  /** 120ms — state feedback: hover, focus, press. */
  instant: 0.12,
  /** 180ms — small transitions and theme surface changes. */
  fast: 0.18,
  /** 240ms — panels, accordions, tab and route panel swaps. */
  base: 0.24,
  /** 400ms — sheets and section-level elements. */
  slow: 0.4,
  /** 700ms — the one signature moment a section is allowed. */
  story: 0.7,
} as const;

export const easing = {
  /** Entrances. */
  out: [0.22, 1, 0.36, 1],
  /** Exits. */
  in: [0.4, 0, 1, 1],
  /** Position changes between two known states. */
  move: [0.65, 0, 0.35, 1],
} as const;

/**
 * Travel budget, in pixels — Phase 0 §18.1. Nothing on this site moves
 * further than `lg`, and most things move `sm`.
 */
export const travel = {
  /** 12px — UI feedback. */
  sm: 12,
  /** 24px — content entrances. */
  md: 24,
  /** 40px — a section-level device. */
  lg: 40,
} as const;

export const transitions = {
  instant: { duration: duration.instant, ease: easing.out },
  fast: { duration: duration.fast, ease: easing.out },
  base: { duration: duration.base, ease: easing.out },
  slow: { duration: duration.slow, ease: easing.out },
  story: { duration: duration.story, ease: easing.out },
  /** Position changes — the nav indicator, a moving selection marker. */
  move: { duration: duration.base, ease: easing.move },
  exit: { duration: duration.fast, ease: easing.in },
  /**
   * LEGACY — the 900ms "cinematic" transition used before Phase 1. It
   * exceeded the 700ms ceiling §18.1 sets for the one signature moment a
   * section is allowed, so it now resolves to `story`. Sections still
   * asking for it are brought inside the motion budget without being
   * redesigned ahead of the phase that owns them.
   */
  cinematic: { duration: duration.story, ease: easing.out },
} satisfies Record<string, Transition>;

/** Shared-element and layout transitions (Phase 0 §18.1 `spring-ui`). */
export const springUi: Transition = { type: 'spring', stiffness: 260, damping: 30 };

export type TransitionToken = keyof typeof transitions;

/**
 * The single gate every animation passes through. Under
 * `prefers-reduced-motion: reduce` a transition collapses to nothing, so
 * the element lands on its final state in one frame rather than easing
 * there — see Phase 0 §18.2.7.
 */
export function withMotionSafety(prefersReducedMotion: boolean, transition: Transition): Transition {
  return prefersReducedMotion ? { duration: 0 } : transition;
}

/**
 * Stagger interval for a sequence, in seconds. Returns 0 under reduced
 * motion so a list appears at once instead of arriving in order.
 */
export function staggerInterval(prefersReducedMotion: boolean, seconds = 0.03): number {
  return prefersReducedMotion ? 0 : seconds;
}
