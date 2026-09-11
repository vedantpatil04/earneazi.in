import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Container — Phase 0 §14.
 *
 * Three widths, and no fourth:
 *
 *   shell     1440px — the navigation bar, the footer band, inverted bands.
 *             Every page's content shares this left edge.
 *   content   1200px — the default column for grids and multi-column
 *             layouts. The previous build ran ~1560px, which is too wide to
 *             hold a 68-character measure and is part of why sections read
 *             as unbalanced (§14, §2.4).
 *   prose      720px — legal text, FAQ answers, anything long-form.
 *
 * Gutters step by breakpoint (20 / 24 / 32 / 48) from the `--gutter` token
 * and include the safe-area inset, so content clears a notch in landscape.
 * The widths and the gutter are applied by the `.container-*` classes in
 * globals.css rather than by utilities here, because the gutter is one
 * token with four breakpoints behind it.
 */

export type ContainerSize =
  | 'shell'
  | 'content'
  | 'prose'
  | 'full'
  /** LEGACY names from the pre-Phase-1 build. */
  | 'narrow'
  | 'default'
  | 'wide';

interface ContainerProps {
  as?: ElementType;
  size?: ContainerSize;
  className?: string;
  children: ReactNode;
}

const sizeStyles: Record<ContainerSize, string> = {
  shell: 'container-shell',
  content: 'container-content',
  prose: 'container-prose',
  /* Full-bleed. Still gets the gutter, so edge-to-edge backgrounds do not
     mean edge-to-edge text. */
  full: 'w-full px-gutter',

  /* LEGACY → the three widths above. */
  narrow: 'container-prose',
  default: 'container-content',
  wide: 'container-shell',
};

export function Container({ as: Tag = 'div', size = 'content', className, children }: ContainerProps) {
  return <Tag className={cn(sizeStyles[size], className)}>{children}</Tag>;
}
