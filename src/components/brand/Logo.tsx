import { Link, useLocation } from 'react-router-dom';
import { brand } from '@/config/brand';
import { cn } from '@/lib/utils/cn';
import earneaziLogo from '@/assets/brand/earneazi-logo.png';
import earneaziLogoWebp from '@/assets/brand/earneazi-logo.webp';
import earneaziMark from '@/assets/brand/earneazi-mark.png';

/**
 * The Earneazi official logo system.
 *
 * One component renders every appearance of the logo on the site.
 * Uses the official horizontal lockup:
 *   [ EARNEAZI wordmark ] [ official blue logo mark ]
 *
 * Lockups:
 *   primary    nav & mobile header — responsive, compact, vertically balanced
 *   compact    constrained surfaces
 *   monogram   the standalone official blue logo mark
 *   footer     footer brand anchor
 *   oversized  display-scale lockup
 */

export type LogoLockup = 'primary' | 'compact' | 'monogram' | 'footer' | 'oversized';

const lockupHeights: Record<LogoLockup, string> = {
  primary: 'h-[22px] min-[390px]:h-[24px] sm:h-[26px] lg:h-[26px]',
  compact: 'h-[20px] sm:h-[22px]',
  monogram: 'h-7 sm:h-8 w-auto',
  footer: 'h-[20px] sm:h-[22px] md:h-[24px]',
  oversized: 'h-[40px] sm:h-[48px] md:h-[56px]',
};

export interface LogoMarkProps {
  lockup?: LogoLockup;
  className?: string;
  alt?: string;
  ariaHidden?: boolean;
}

/**
 * The official logo artwork mark with no link behavior.
 * Used for decorative brand placements, mobile sheet headers, etc.
 */
export function LogoMark({
  lockup = 'primary',
  className,
  alt = 'Earneazi',
  ariaHidden,
}: LogoMarkProps) {
  if (lockup === 'monogram') {
    return (
      <span className={cn('inline-flex items-center shrink-0', className)}>
        <img
          src={earneaziMark}
          alt={ariaHidden ? '' : alt}
          aria-hidden={ariaHidden ? 'true' : undefined}
          width={446}
          height={418}
          decoding="async"
          className="h-8 w-auto aspect-[446/418] object-contain select-none"
        />
      </span>
    );
  }

  return (
    <span className={cn('inline-flex items-center shrink-0', className)}>
      <picture className="inline-flex items-center">
        <source srcSet={earneaziLogoWebp} type="image/webp" />
        <img
          src={earneaziLogo}
          alt={ariaHidden ? '' : alt}
          aria-hidden={ariaHidden ? 'true' : undefined}
          width={727}
          height={84}
          decoding="async"
          className={cn(
            'w-auto object-contain select-none max-w-full',
            lockupHeights[lockup] ?? lockupHeights.primary,
            className
          )}
        />
      </picture>
    </span>
  );
}

export interface LogoProps {
  lockup?: LogoLockup;
  className?: string;
  /** Override the accessible name — defaults to "Earneazi". */
  label?: string;
}

/**
 * The navigable official Earneazi logo. Always links to `/`.
 *
 * Provides clean accessible labeling ("Earneazi") without duplicate announcements,
 * and maintains appropriate touch target sizing and theme transparency.
 */
export function Logo({ lockup = 'primary', className, label }: LogoProps) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <Link
      to="/"
      aria-label={label ?? brand.logo.homeLabel}
      aria-current={isHome ? 'page' : undefined}
      className={cn(
        'group/logo inline-flex min-h-11 items-center rounded-action shrink-0',
        'transition-opacity duration-instant ease-out hover:opacity-85 active:scale-[0.99]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
        className
      )}
    >
      <LogoMark lockup={lockup} ariaHidden={true} alt="" />
    </Link>
  );
}
