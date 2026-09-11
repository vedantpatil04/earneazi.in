import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { Reveal } from '@/components/motion/Reveal';
import { riseVariants } from '@/lib/motion/variants';

/**
 * SectionHeader — Phase 0 §17.
 *
 * Heading, optional introduction, optional supporting action. Used by every
 * section so the vertical rhythm and measure stay identical down the page
 * and no section quietly invents its own spacing.
 *
 * Two things it deliberately does not do:
 *
 *   · No eyebrow rule. The previous build put a hairline above every single
 *     heading; §17 removes it as a global device and §34 names it as one of
 *     the templated tells being removed. A section that genuinely belongs
 *     to a sequence passes an `index` instead, and only a real sequence
 *     should.
 *   · No page-specific layout. Sections that need a pinned column or a
 *     split composition build that around this, not inside it.
 *
 * Alignment (§13 rule 5): the action aligns to the first baseline of the
 * heading, not to the centre of the block — `md:items-baseline` rather than
 * the `items-end` the previous build used, which floated the link against
 * the intro's second line.
 */

interface SectionHeaderProps {
  /** Ties the parent section's `aria-labelledby` to this heading. */
  id: string;
  title: ReactNode;
  /** One short paragraph. Capped at a 56-character measure per §8.4. */
  intro?: ReactNode;
  /** A single supporting link or button, opposite the heading on wide screens. */
  action?: ReactNode;
  /** Heading level. Sections are `h2` under the page `h1`; nested blocks step down. */
  as?: 'h1' | 'h2' | 'h3';
  /** Recolours for the ink band. */
  tone?: 'default' | 'band';
  align?: 'start' | 'center';
  /** Size of the heading. `lg` opens a section; `md` opens a sub-section. */
  size?: 'lg' | 'md';
  /**
   * Index marker, e.g. `1` for the first step. Renders only where the
   * section is a genuine ordered sequence (§8.3) — never as decoration.
   */
  index?: number;
  className?: string;
}

export function SectionHeader({
  id,
  title,
  intro,
  action,
  as: Heading = 'h2',
  tone = 'default',
  align = 'start',
  size = 'lg',
  index,
  className,
}: SectionHeaderProps) {
  const centered = align === 'center';

  return (
    <Reveal
      variants={riseVariants}
      className={cn(
        'flex flex-col gap-5 md:flex-row md:items-baseline md:justify-between md:gap-10',
        centered && 'md:flex-col md:items-center',
        className
      )}
    >
      <div className={cn('min-w-0', centered && 'text-center')}>
        {typeof index === 'number' && (
          <span
            className={cn(
              'mb-3 block font-display text-body-sm font-semibold tabular',
              tone === 'band' ? 'text-on-band-muted' : 'text-ink-muted'
            )}
          >
            {String(index).padStart(2, '0')}
          </span>
        )}

        <Heading
          id={id}
          className={cn(
            size === 'lg' ? 'text-display-lg' : 'text-display-md',
            'max-w-[22ch]',
            centered && 'mx-auto',
            tone === 'band' ? 'text-on-band' : 'text-ink-display'
          )}
        >
          {title}
        </Heading>

        {intro && (
          <p
            className={cn(
              'mt-4 max-w-measure text-body-lg',
              centered && 'mx-auto',
              tone === 'band' ? 'text-on-band-muted' : 'text-ink-secondary'
            )}
          >
            {intro}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}
