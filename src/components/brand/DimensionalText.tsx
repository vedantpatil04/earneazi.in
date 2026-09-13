import { createElement, useRef } from 'react';
import type { CSSProperties } from 'react';
import { useInView } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/utils/cn';

/**
 * Dimensional type — Phase 0 §9, built out in Enhancement A.
 *
 * The brand's typographic depth, in exactly the places that carry the brand:
 * the footer wordmark, the hero's closing phrase, the closing band's
 * headline, and the founders' monograms. Never running text, numerals,
 * legal copy, form labels, or anything a screen reader must read as data.
 *
 * How it is built
 * ───────────────
 * One real, selectable text node. The depth is a stepped extrusion drawn as
 * `text-shadow` (the DIMENSIONAL TYPE block in globals.css) — no duplicate
 * spans behind the text, so nothing is announced twice, the text wraps like
 * any other text, and there is no second layout to keep in register. The
 * previous version stacked `aria-hidden` copies, which could not wrap and
 * doubled the DOM for every glyph.
 *
 * Three faces
 * ───────────
 *   brand   the face in brand blue over deeper blues — the hero phrase.
 *   ink     an ink face over a brand-blue echo — the wordmark, the band.
 *   fill    a white face on a coloured fill — a monogram plate.
 *
 * The construction follows the ground: in the dark theme, or inside a
 * `data-ground="ink"` band (ink in both themes), the stack becomes brand
 * blues with a light top-left edge, because a dark extrusion on a dark
 * ground disappears. The face colour always comes from the caller, so the
 * contrast pair is a token decision measured like every other.
 *
 * Motion
 * ──────
 * Flat until the text is on screen, then the depth resolves once over
 * `dur-story`. If scripts never run it simply stays flat and legible. Under
 * reduced motion it renders at full depth immediately, with no animation.
 */

type Face = 'brand' | 'ink' | 'fill';

interface DimensionalTextProps {
  /** One string — the one real text node. */
  children: string;
  /** Rendered element. */
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'div';
  tone?: Face;
  /** Grow the depth in when it first appears. Off renders full depth at once. */
  resolve?: boolean;
  /** Milliseconds before the depth starts to resolve — to land after an entrance. */
  delay?: number;
  className?: string;
  id?: string;
}

export function DimensionalText({
  children,
  as = 'span',
  tone = 'ink',
  resolve = true,
  delay = 0,
  className,
  id,
}: DimensionalTextProps) {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const inView = useInView(ref, { once: true, margin: '0px 0px -8% 0px' });

  const state = !resolve || prefersReducedMotion ? 'static' : inView ? 'resolve' : 'pending';

  return createElement(
    as,
    {
      ref,
      id,
      className: cn('text-extrude', className),
      'data-extrude': tone,
      'data-state': state,
      style: state === 'resolve' && delay > 0 ? ({ '--extrude-delay': `${delay}ms` } as CSSProperties) : undefined,
    },
    children
  );
}
