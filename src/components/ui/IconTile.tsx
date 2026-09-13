import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * IconTile — the one glyph container on the site.
 *
 * Every mark on the page goes through this: a service card's icon, a goal
 * rail's icon, a trust row's icon, a strip item's icon. Before this it was
 * being rebuilt inline per section with six different sizes, four stroke
 * weights and three radii, which is why the icons never read as one family
 * (brief §7).
 *
 * The rules it enforces, so no caller has to remember them:
 *
 *   · One family — lucide-react on a 24px grid, and nothing else.
 *   · One stroke per state — 1.5 at rest, 1.75 when active. A heavier
 *     stroke is how an active icon is distinguished, so the distinction
 *     survives without colour.
 *   · One radius family — `radius-action` below 44px (an icon at that size
 *     is part of a control), `radius-surface` at 44px and above (it is a
 *     surface in its own right).
 *   · Fixed boxes — tiles line up down a column with no per-icon nudging.
 *
 * ── Depth — Enhancement A ────────────────────────────────────────────────
 *
 * Each fill takes its place in the depth language, so a tile's state is a
 * physical one as well as a colour: a resting tile is recessed into the
 * page (`neutral`), a tinted tile carries the edge light (`brand`, `tone`),
 * and a selected or leading tile is a lit solid (`solid`, `tone-solid`).
 * Opening a disclosure row therefore reads as the icon coming up out of the
 * surface and lighting, not just turning blue.
 *
 * `tone` and `tone-solid` read the subject tone channel, so a tile inside a
 * `data-tone` ancestor wears that subject's accent in both themes.
 *
 * `md` and `lg` clear the 44px touch target on their own. `xs` and `sm` are
 * decorative density only: never make one of them the sole hit area.
 */

type IconTileFill = 'neutral' | 'brand' | 'solid' | 'tone' | 'tone-solid' | 'band' | 'ghost';
type IconTileSize = 'xs' | 'sm' | 'md' | 'lg';

interface IconTileProps {
  icon: LucideIcon;
  fill?: IconTileFill;
  size?: IconTileSize;
  /**
   * Raises the stroke weight and lets the fill's active instance show. Kept
   * separate from `fill` so a caller can express "this is the selected one"
   * without also having to decide which fill expresses that.
   */
  active?: boolean;
  className?: string;
  /**
   * Tiles are decorative by default — they sit beside a visible label, so
   * announcing them twice is noise. Pass a label only when the tile is the
   * only thing naming its row.
   */
  label?: string;
}

const fillStyles: Record<IconTileFill, string> = {
  /* Recessed: the tile sits into the page until something selects it. */
  neutral: 'inset-well bg-surface-sunken text-ink-secondary border border-divider',
  brand: 'edge-top bg-brand-subtle text-brand-ink border border-brand/20',
  /* The selected state. Surface change and border change together, never
     border alone (Phase 0 §11) — and now lit, so it reads as raised. */
  solid: 'lit bg-brand text-on-brand border border-brand-pressed/30',
  tone: 'edge-top bg-tone-tint text-tone border border-tone/20',
  'tone-solid': 'lit lit-tone bg-tone-fill text-on-tone border border-transparent',
  band: 'bg-band-surface text-on-band border border-on-band/15',
  /* No box at all — the glyph alone, for dense rows where a container per
     item would out-weigh the text beside it. */
  ghost: 'bg-transparent text-ink-muted border border-transparent',
};

const sizeStyles: Record<IconTileSize, string> = {
  xs: 'h-6 w-6 rounded-action',
  sm: 'h-8 w-8 rounded-action',
  md: 'h-11 w-11 md:h-12 md:w-12 rounded-surface',
  lg: 'h-12 w-12 md:h-14 md:w-14 rounded-surface',
};

const glyphSize: Record<IconTileSize, number> = { xs: 13, sm: 16, md: 20, lg: 24 };

export function IconTile({
  icon: Glyph,
  fill = 'neutral',
  size = 'md',
  active = false,
  className,
  label,
}: IconTileProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center',
        'transition-[background-color,border-color,color,box-shadow] motion-safe:duration-fast ease-out',
        sizeStyles[size],
        fillStyles[fill],
        /* `ghost` carries its active state in the glyph's colour, because it
           has no surface to change. */
        active && fill === 'ghost' && 'text-brand-ink',
        className
      )}
    >
      <Glyph
        size={glyphSize[size]}
        strokeWidth={active ? 1.75 : 1.5}
        {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      />
    </span>
  );
}
