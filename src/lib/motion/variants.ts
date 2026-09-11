import type { Transition, Variants } from 'framer-motion';

/**
 * Shared motion tokens. Add new motion needs here rather than inventing
 * one-off durations and eases per component — that consistency is what
 * keeps the "restrained and deliberate" bar as later phases add pages.
 *
 * These are *base* transitions. Always resolve them through
 * `withMotionSafety(prefersReducedMotion, transition)` before handing them
 * to a `motion.*` component, so prefers-reduced-motion is respected
 * wherever motion is used — see usePrefersReducedMotion.
 *
 * Everything below animates `opacity`, `transform` or `clip-path` only.
 * No layout properties (width/height/top/left) are animated on scroll,
 * which is what keeps these cheap on mobile and in Safari; the one
 * height animation on the page is the services disclosure, which is
 * user-triggered and animates a single element at a time.
 */
export const transitions = {
  fast: { duration: 0.15, ease: [0.22, 1, 0.36, 1] } satisfies Transition,
  base: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } satisfies Transition,
  slow: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } satisfies Transition,
  /** For the hero photograph — long enough to read as a reveal rather than a pop. */
  cinematic: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } satisfies Transition,
};

export function withMotionSafety(prefersReducedMotion: boolean, transition: Transition): Transition {
  return prefersReducedMotion ? { duration: 0 } : transition;
}

// --- Interaction-triggered ------------------------------------------------
// Menus, dialogs, disclosures, tab panels. Deliberately kept separate from
// the scroll reveals below: motion that answers a click should be faster and
// more literal than motion that introduces a section.

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1 },
};

export const slideDownVariants: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0 },
};

export const panelVariants: Variants = {
  hidden: { opacity: 0, x: '100%' },
  visible: { opacity: 1, x: 0 },
};

/** Tab panel swap — a short lateral drift so the change reads as "different content", not "same content flickered". */
export const panelSwapVariants: Variants = {
  hidden: { opacity: 0, x: 12 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
};

/** Rows inside the mobile navigation panel, staggered by the panel itself. */
export const navItemVariants: Variants = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0 },
};

// --- Scroll-triggered section reveals ------------------------------------
// Used through components/motion/Reveal.tsx, which handles viewport
// tracking, once-only firing and reduced-motion resolution. Deliberately a
// different shape per call site rather than one fade-up on every section:
// the page should not feel like it is performing the same trick eight times.

/** Restrained default — a small upward drift and fade. The quiet reveal. */
export const riseVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

/** Opacity only. For content that should read as settled fact rather than as animated in. */
export const settleVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/** The hero photograph: opens from a slightly inset crop and settles out of a gentle over-scale. */
export const clipRevealVariants: Variants = {
  hidden: { opacity: 0, scale: 1.04, clipPath: 'inset(8% 8% 8% 8% round 1rem)' },
  visible: { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 1rem)' },
};

/** Horizontal connector line — pair with `origin-left`, since Framer Motion respects CSS transform-origin. */
export const lineDrawVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1 },
};

/** Vertical connector line — pair with `origin-top`. */
export const lineDrawVerticalVariants: Variants = {
  hidden: { scaleY: 0 },
  visible: { scaleY: 1 },
};

/** Child item for a stagger container (see RevealGroup) — variants propagate from the parent automatically. */
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

/** Stagger child that grows from its baseline — used for the SIP illustration's columns. */
export const growFromBaseVariants: Variants = {
  hidden: { opacity: 0, scaleY: 0 },
  visible: { opacity: 1, scaleY: 1 },
};
