import { useRef } from 'react';
import type { ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { transitions, withMotionSafety } from '@/lib/motion/variants';

interface RevealProps {
  /** Optional — Reveal also wraps purely decorative elements (a connector line) that have no content of their own. */
  children?: ReactNode;
  variants: Variants;
  className?: string;
  /** Extra delay (seconds) before this element's transition starts — for hand-staggering a few siblings outside a RevealGroup. */
  delay?: number;
  /** Which shared transition speed (lib/motion/variants) to resolve the variants with. */
  speed?: keyof typeof transitions;
  /** Start animating as soon as the element mounts rather than waiting for it to scroll into view. The hero uses this; nothing else should. */
  immediate?: boolean;
}

/**
 * Scroll-triggered entrance wrapper. Fires once the first time an element
 * enters the viewport and never replays on scroll-back, and always resolves
 * its transition through `usePrefersReducedMotion`.
 *
 * The visual shape comes entirely from the `variants` passed in — reuse
 * this wrapper everywhere and vary the variants per section, rather than
 * giving every section the same fade-up.
 */
export function Reveal({ children, variants, className, delay = 0, speed = 'slow', immediate = false }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-72px 0px' });
  const prefersReducedMotion = usePrefersReducedMotion();
  // With motion reduced there is nothing to reveal, so the element starts
  // visible and never depends on the observer firing at all. Resolving it
  // to a zero-duration animation instead would still leave a frame where
  // the content is at opacity 0 — fine in practice, but not something to
  // rely on when someone has explicitly asked for no motion.
  const shouldAnimate = prefersReducedMotion || immediate || inView;

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? 'visible' : 'hidden'}
      animate={shouldAnimate ? 'visible' : 'hidden'}
      variants={variants}
      transition={{
        ...withMotionSafety(prefersReducedMotion, transitions[speed]),
        delay: prefersReducedMotion ? 0 : delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
  /** Seconds between each child's entrance. Children should be `motion.*` elements using a stagger variant — they inherit "hidden"/"visible" from this container rather than tracking their own viewport entry. */
  stagger?: number;
  /** Seconds before the first child starts. */
  delay?: number;
  immediate?: boolean;
  /** Rendered element. `ul`/`ol` where the children are list items, so the stagger doesn't cost the list its semantics. */
  as?: 'div' | 'ul' | 'ol' | 'dl';
}

/**
 * Parent for a group of items that should reveal as one staggered sequence
 * rather than each tracking its own viewport entry. Pair with
 * `staggerItemVariants` (or another child variant) on the children.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  immediate = false,
  as = 'div',
}: RevealGroupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-72px 0px' });
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = prefersReducedMotion || immediate || inView;

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : stagger,
        delayChildren: prefersReducedMotion ? 0 : delay,
      },
    },
  };

  // Rendered tag varies, but the props we pass are just className + ref, which
  // every host element accepts. Narrowing to motion.div's type keeps the ref
  // typed without a per-tag branch; the runtime element is still `as`.
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      ref={ref}
      initial={prefersReducedMotion ? 'visible' : 'hidden'}
      animate={shouldAnimate ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
