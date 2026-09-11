import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * IconTile — Phase 0 §17.
 *
 * A fixed box holding one icon, used wherever a service, goal or list item
 * needs a mark. Fixed at 44×44 on mobile and 48×48 from `md` up (§13 rule 6)
 * so tiles line up down a column without per-icon nudging, and so a tile
 * that happens to be interactive already clears the 44px touch target.
 *
 * Icons come from one family only — lucide-react, 1.5px stroke on a 24px
 * grid. There is no emoji icon system; the old site used one and it
 * rendered differently on every platform (§3.3, §34).
 */

type IconTileFill = 'neutral' | 'brand' | 'solid' | 'band';
type IconTileSize = 'md' | 'lg';

interface IconTileProps {
  icon: LucideIcon;
  fill?: IconTileFill;
  size?: IconTileSize;
  className?: string;
  /**
   * Tiles are decorative by default — they sit beside a visible label, so
   * announcing them twice is noise. Pass a label only when the tile is the
   * only thing naming its row.
   */
  label?: string;
}

const fillStyles: Record<IconTileFill, string> = {
  neutral: 'bg-surface-sunken text-ink-secondary border border-divider',
  brand: 'bg-brand-subtle text-brand-ink border border-brand/25',
  /* The selected state. Surface change and border change together, never
     border alone (§11). */
  solid: 'bg-brand text-on-brand border border-transparent',
  band: 'bg-band-surface text-on-band border border-on-band/15',
};

const sizeStyles: Record<IconTileSize, string> = {
  md: 'h-11 w-11 md:h-12 md:w-12',
  lg: 'h-12 w-12 md:h-14 md:w-14',
};

const glyphSize: Record<IconTileSize, number> = { md: 20, lg: 24 };

export function IconTile({ icon: Glyph, fill = 'neutral', size = 'md', className, label }: IconTileProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-surface',
        'transition-[background-color,border-color,color] motion-safe:duration-fast ease-out',
        sizeStyles[size],
        fillStyles[fill],
        className
      )}
    >
      <Glyph
        size={glyphSize[size]}
        strokeWidth={1.5}
        {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      />
    </span>
  );
}
