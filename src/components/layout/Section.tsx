import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Section — Phase 0 §13.
 *
 * Owns the vertical rhythm of the page so no section invents its own.
 * The `standard` scale is 64/72 → 88 → 120; the `chapter` scale, for an
 * inverted band, is 80 → 104 → 160.
 *
 * Backgrounds alternate rather than being separated by rules. `band` is the
 * one full-bleed high-contrast surface: it is dark in BOTH themes by design
 * (§27), which is what gives the site a consistent close, and it can carry
 * the `radius-band` top corners that make the page read as stacked layers
 * rather than as a list of blocks (§19.1).
 */

type SectionSpacing = 'sm' | 'md' | 'lg' | 'xl' | 'chapter' | 'none';
type SectionBackground = 'bg' | 'surface' | 'sunken' | 'band' | 'none' | 'surface-2';

interface SectionProps {
  as?: ElementType;
  id?: string;
  spacing?: SectionSpacing;
  background?: SectionBackground;
  /**
   * Rounds the top corners and lifts the section over the one above it, so
   * a band reads as a layer. Only inverted bands and the footer may do this
   * (§19.1); a section with a paper ground must not.
   */
  slab?: boolean;
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

const spacingStyles: Record<SectionSpacing, string> = {
  none: '',
  sm: 'py-12 md:py-16 lg:py-20',
  md: 'py-16 md:py-[5.5rem] lg:py-24',
  /* The standard section rhythm from §13. */
  lg: 'py-16 md:py-[5.5rem] lg:py-[7.5rem]',
  xl: 'py-20 md:py-24 lg:py-32',
  /* Chapter (inverted band) rhythm from §13. */
  chapter: 'py-20 md:py-[6.5rem] lg:py-40',
};

const backgroundStyles: Record<SectionBackground, string> = {
  none: '',
  bg: 'bg-bg',
  surface: 'bg-surface',
  sunken: 'bg-surface-sunken',
  /* LEGACY name for `sunken`. */
  'surface-2': 'bg-surface-sunken',
  band: 'bg-band text-on-band',
};

export function Section({
  as: Tag = 'section',
  id,
  spacing = 'lg',
  background = 'bg',
  slab = false,
  className,
  children,
  ...aria
}: SectionProps) {
  return (
    <Tag
      id={id}
      /* Tells the dimensional type inside which construction to draw: a band
         is ink in both themes, so a theme-keyed rule would draw the paper
         extrusion on it in light mode (see DIMENSIONAL TYPE in globals.css). */
      data-ground={background === 'band' ? 'ink' : undefined}
      className={cn(
        'relative',
        spacingStyles[spacing],
        backgroundStyles[background],
        /* The overlap is the section's own margin, not a negative offset on
           the one above, so it cannot leave a gap if the previous section
           changes. */
        slab && '-mt-6 rounded-t-band md:-mt-8',
        className
      )}
      {...aria}
    >
      {children}
    </Tag>
  );
}
