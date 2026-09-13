import type { Variants } from 'framer-motion';
import { travel } from './tokens';

/**
 * Shared motion variants, built on the tokens in ./tokens.ts.
 *
 * Rules these obey (Phase 0 §18.2), so that a component using them cannot
 * accidentally break the motion system:
 *
 *   · Only `opacity`, `transform` and `clip-path` are animated. No layout
 *     property is animated in a scroll-linked context.
 *   · Travel never exceeds the budget in `travel` — 12px for feedback,
 *     24px for a content entrance, 40px for a section device.
 *   · Every variant resolves through `withMotionSafety` at the call site,
 *     and the base CSS renders the final visible state, so content is never
 *     dependent on an animation having fired.
 *   · There is no site-wide fade-up. A generic opacity+translateY entrance
 *     is permitted on at most one section of a page; the variants below are
 *     deliberately different shapes so sections do not all perform the same
 *     trick.
 */

export { transitions, springUi, duration, easing, travel, withMotionSafety, staggerInterval } from './tokens';

// ── Interaction-triggered ──────────────────────────────────────────────
// Menus, dialogs, disclosures, tab panels. Faster and more literal than the
// scroll reveals below: motion answering a tap should feel like a response,
// not like an introduction.

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1 },
};

export const slideDownVariants: Variants = {
  hidden: { opacity: 0, y: -travel.sm },
  visible: { opacity: 1, y: 0 },
};

/**
 * The mobile navigation sheet — Phase 0 §16. A vertical translate with a
 * clip reveal rather than a plain opacity fade, so the sheet reads as a
 * surface arriving rather than as content appearing out of nothing.
 */
export const sheetVariants: Variants = {
  hidden: { opacity: 0, y: -16, clipPath: 'inset(0 0 100% 0)' },
  visible: { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', pointerEvents: 'auto' },
  /* Pointer events go the moment the sheet starts to leave, so a full-screen
     layer that is fading out can never catch a tap meant for the page. */
  exit: { opacity: 0, y: -12, clipPath: 'inset(0 0 100% 0)', pointerEvents: 'none' },
};

/** Tab panel swap — a short lateral drift so the change reads as different content. */
export const panelSwapVariants: Variants = {
  hidden: { opacity: 0, x: travel.sm },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -travel.sm },
};

/** Rows inside the mobile navigation sheet, staggered by the sheet itself. */
export const navItemVariants: Variants = {
  hidden: { opacity: 0, y: travel.sm },
  visible: { opacity: 1, y: 0 },
};

/**
 * LEGACY — the side-drawer variant used before Phase 1. Kept so anything
 * still importing it compiles; the mobile sheet uses `sheetVariants`.
 */
export const panelVariants: Variants = sheetVariants;

// ── Scroll-triggered section reveals ───────────────────────────────────
// Used through components/motion/Reveal.tsx, which owns viewport tracking,
// once-only firing and reduced-motion resolution.

/** Restrained default — a small upward drift and fade. */
export const riseVariants: Variants = {
  hidden: { opacity: 0, y: travel.md },
  visible: { opacity: 1, y: 0 },
};

/** Opacity only. For content that should read as settled fact. */
export const settleVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/** Opens from a slightly inset crop and settles out of a gentle over-scale. */
export const clipRevealVariants: Variants = {
  hidden: { opacity: 0, scale: 1.03, clipPath: 'inset(6% 6% 6% 6% round 0.75rem)' },
  visible: { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 0.75rem)' },
};

/** Horizontal connector line — pair with `origin-left`. */
export const lineDrawVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1 },
};

/** Vertical connector line — pair with `origin-top`. */
export const lineDrawVerticalVariants: Variants = {
  hidden: { scaleY: 0 },
  visible: { scaleY: 1 },
};

/** Child item for a stagger container — see RevealGroup. */
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: travel.sm },
  visible: { opacity: 1, y: 0 },
};

/** Stagger child that grows from its baseline. */
export const growFromBaseVariants: Variants = {
  hidden: { opacity: 0, scaleY: 0 },
  visible: { opacity: 1, scaleY: 1 },
};
