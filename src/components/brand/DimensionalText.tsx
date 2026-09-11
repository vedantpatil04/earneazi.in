import { useId } from 'react';
import type { CSSProperties } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/utils/cn';

/**
 * Dimensional type — the global infrastructure only (Phase 0 §9).
 *
 * The audit's answer to "explore 3D typography" is: use it exactly once, and
 * use it on the brand rather than on the content. This component is that
 * capability, built and constrained here so it exists in one place and
 * cannot spread. It is deliberately NOT applied anywhere yet — its intended
 * home is the oversized footer wordmark, which belongs to Phase 6.
 *
 * How it is built
 * ───────────────
 * The text is one real, selectable, screen-reader-visible node. Depth comes
 * from `aria-hidden` duplicates stacked behind it along a fixed light
 * vector. There is no WebGL, no second font load, and no image.
 *
 * Two constructions, chosen by the GROUND rather than by the theme
 * ───────────────────────────────────────────────────────────────
 * On paper, depth is a stack of neutrals stepping down-right beneath the
 * face. On ink that construction disappears — a dark extrusion on a dark
 * ground is invisible — so §9 specifies a different build: a thin optical
 * edge-light on the top-left plus one cool shadow below, and no stack.
 *
 * Which applies depends on what the text is sitting on, not on which theme
 * is active: the footer band is ink in BOTH themes (§27), so keying this to
 * `[data-theme]` would render the wrong construction there in light mode.
 * `ground` defaults to the theme's own page background and is passed
 * explicitly wherever the element sits on a band.
 *
 * Other constraints this enforces rather than documents
 * ─────────────────────────────────────────────────────
 *   · Depth scales with viewport through `--depth-steps`: flat below 768px,
 *     3 layers at 768–1023px, 5 from 1024px up.
 *   · The face inherits its colour from the caller, so the contrast pair is
 *     a token decision like every other one on the site, and passes AA
 *     independently of the extrusion behind it.
 *   · Under reduced motion the full depth renders immediately, with no
 *     resolve animation.
 *
 * Never use this for running text, numerals, legal copy, form labels, or
 * anything a screen reader must read as data. It is for a wordmark.
 */

interface DimensionalTextProps {
  children: string;
  /** Rendered element. The text stays one node whatever this is. */
  as?: 'span' | 'h1' | 'h2' | 'p' | 'div';
  /**
   * What the text sits on. Defaults to the current theme's page ground;
   * pass `ink` explicitly on a band, which is ink in both themes.
   */
  ground?: 'paper' | 'ink';
  className?: string;
  /**
   * Depth ceiling. The rendered depth is the lesser of this and what the
   * viewport allows, so a caller can ask for less but never for more.
   */
  maxLayers?: 3 | 5;
}

/** Maximum the layer stack can ever be, matching `--depth-steps` at ≥1024px. */
const LAYER_CEILING = 5;

export function DimensionalText({
  children,
  as: Tag = 'span',
  ground,
  className,
  maxLayers = LAYER_CEILING,
}: DimensionalTextProps) {
  const { mode } = useTheme();
  const prefersReducedMotion = usePrefersReducedMotion();
  const id = useId();

  const resolvedGround = ground ?? (mode === 'dark' ? 'ink' : 'paper');

  // Layers render unconditionally and are revealed by CSS. Deciding the
  // count in JavaScript would tie the visual to a resize listener and to
  // hydration timing; `--depth-steps` already carries the breakpoint rule,
  // so each layer hides itself when its index exceeds the current step.
  const layers = Array.from({ length: Math.min(maxLayers, LAYER_CEILING) }, (_, index) => index + 1);

  return (
    <Tag
      className={cn('relative isolate inline-block', className)}
      data-ground={resolvedGround}
      data-dimensional={prefersReducedMotion ? 'static' : 'resolve'}
    >
      {layers.map((layer) => (
        <span
          key={`${id}-${layer}`}
          aria-hidden="true"
          className="dimensional-layer pointer-events-none absolute inset-0 select-none"
          style={{ '--layer': layer } as CSSProperties}
        >
          {children}
        </span>
      ))}

      {/* The one real text node. Everything above is decoration behind it. */}
      <span className="dimensional-face relative">{children}</span>
    </Tag>
  );
}
