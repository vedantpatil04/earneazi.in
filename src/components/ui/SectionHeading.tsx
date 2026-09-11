import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { Reveal } from '@/components/motion/Reveal';
import { riseVariants } from '@/lib/motion/variants';

interface SectionHeadingProps {
  /** Matches the `aria-labelledby` on the parent Section, tying the landmark to its heading. */
  id: string;
  title: string;
  lead?: string;
  /** Optional trailing element (a link or button) that sits opposite the heading on wide screens. */
  action?: ReactNode;
  className?: string;
  /** `band` recolours for the dark consultation band; `center` is used once, on that same band. */
  tone?: 'default' | 'band';
  align?: 'start' | 'center';
}

/**
 * The one heading treatment used by every section, so vertical rhythm and
 * measure stay identical down the page and no section quietly invents its
 * own spacing. A brass rule sits above the heading — it marks where a
 * section starts, which is real structural information rather than
 * decoration.
 */
export function SectionHeading({
  id,
  title,
  lead,
  action,
  className,
  tone = 'default',
  align = 'start',
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <Reveal
      variants={riseVariants}
      className={cn(
        'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
        centered && 'md:flex-col md:items-center',
        className
      )}
    >
      <div className={cn('max-w-prose', centered && 'text-center')}>
        <span
          aria-hidden="true"
          className={cn('block h-px w-16 rounded-full', centered && 'mx-auto', tone === 'band' ? 'bg-on-band/40' : 'rule-fade')}
        />
        <h2
          id={id}
          className={cn('mt-6 text-h2 font-display-sharp', tone === 'band' ? 'text-on-band' : 'text-ink')}
        >
          {title}
        </h2>
        {lead && (
          <p className={cn('mt-4 text-lead', tone === 'band' ? 'text-on-band/80' : 'text-ink-secondary')}>{lead}</p>
        )}
      </div>

      {action && <div className="flex-shrink-0">{action}</div>}
    </Reveal>
  );
}
