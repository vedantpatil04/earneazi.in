import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Eyebrow — the small label that names a section above its heading.
 *
 * It existed in four places with four different constructions (different
 * padding, different border alpha, a `dark:` branch each, and a pulsing dot
 * on some but not others). This is the one version.
 *
 * The dot is not decorative: on the pinned sections it is the spine
 * surfacing — the same brand hairline that threads the page, caught at the
 * point where this section attaches to it. It does not pulse. A dot that
 * pulses forever is movement carrying no information, which §31 of the
 * brief rules out; it reads as a live-status indicator the page cannot
 * honour.
 *
 * `tone`:
 *   default   on paper or ink, inside the normal flow.
 *   band      inside the inverted band, which is dark in both themes.
 *   onImage   over photography — gains a veil and a blur so it holds its
 *             contrast against whatever is behind it.
 */

type EyebrowTone = 'default' | 'band' | 'onImage';

interface EyebrowProps {
  children: ReactNode;
  /** Show the leading spine dot. On by default; off where the eyebrow sits inside a card. */
  dot?: boolean;
  tone?: EyebrowTone;
  className?: string;
  id?: string;
}

const toneStyles: Record<EyebrowTone, string> = {
  default: 'border-brand/20 bg-brand-subtle text-brand-ink',
  band: 'border-on-band/20 bg-on-band/10 text-band-brand',
  onImage: 'border-brand/30 bg-veil/[var(--veil-alpha)] text-brand-ink backdrop-blur-md shadow-xs',
};

const dotStyles: Record<EyebrowTone, string> = {
  default: 'bg-brand',
  band: 'bg-band-brand',
  onImage: 'bg-brand',
};

export function Eyebrow({ children, dot = true, tone = 'default', className, id }: EyebrowProps) {
  return (
    <span
      id={id}
      className={cn(
        'inline-flex w-fit items-center gap-2 rounded-pill border px-3 py-1',
        /* Small, set in the display face, tracked wide. A label at this size
           needs the tracking to stay legible in caps. */
        'font-display text-legal font-semibold uppercase tracking-[0.12em]',
        toneStyles[tone],
        className
      )}
    >
      {dot && <span aria-hidden="true" className={cn('h-1.5 w-1.5 shrink-0 rounded-pill', dotStyles[tone])} />}
      {children}
    </span>
  );
}
