import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { brand } from '@/config/brand';
import { cn } from '@/lib/utils/cn';

/**
 * The Earneazi logo system — Phase 0 §7.
 *
 * One component renders every appearance of the logo on the site. There is
 * no per-page recreation and no ad-hoc scaling: a caller picks a lockup,
 * and the lockup decides size, weight, tracking and dot proportion.
 *
 *   primary    nav and footer. Wordmark plus dot.
 *   compact    narrow bars and constrained surfaces, where the primary
 *              lockup would fall below its 112px minimum width.
 *   oversized  the footer brand band. Optically tracked, and the only
 *              lockup the dimensional treatment in §9 may ever be applied
 *              to — which is Phase 6 work, not this phase.
 *
 * Theme handling: the wordmark is `currentColor`, so it inherits whatever
 * text colour its context sets and both themes are served by one asset with
 * no flash on switch. The dot is the one part with its own colour token.
 *
 * Interaction: the dot is the handle. On hover and focus it is the only
 * thing that moves — the wordmark itself never animates, because a moving
 * logotype reads as a widget rather than as an identity.
 *
 * PROVISIONAL: the approved vector has not been supplied, so this renders a
 * typographic lockup in the site's display face. When `brand.logo`
 * `.vectorAsset` is set, that component renders instead and every call site
 * picks it up untouched.
 */

type LogoLockup = 'primary' | 'compact' | 'oversized';

interface LogoMarkProps {
  lockup?: LogoLockup;
  className?: string;
}

const lockupStyles: Record<LogoLockup, string> = {
  primary: 'text-[1.375rem] md:text-[1.5rem] tracking-[-0.03em]',
  compact: 'text-[1.1875rem] tracking-[-0.03em]',
  /* Minimum 96px cap height at desktop, per §7. Optically tracked tighter,
     because tracking that reads as normal at 24px reads as loose at 120px. */
  oversized: 'text-[clamp(3.5rem,10vw,8rem)] tracking-[-0.045em]',
};

const dotStyles: Record<LogoLockup, string> = {
  primary: 'h-[0.3125rem] w-[0.3125rem] md:h-1.5 md:w-1.5',
  compact: 'h-1 w-1',
  oversized: 'h-[0.22em] w-[0.22em]',
};

/**
 * The mark itself, with no link or landmark behaviour. Use `Logo` for the
 * navigable version; this exists for the places the mark is decorative
 * (inside the mobile sheet header, or a future footer band).
 */
export function LogoMark({ lockup = 'primary', className }: LogoMarkProps) {
  const Vector = brand.logo.vectorAsset;

  if (Vector) {
    return (
      <span className={cn('inline-flex items-center', className)}>
        <Vector />
      </span>
    );
  }

  return (
    <span
      className={cn(
        'group/logo inline-flex items-baseline font-display leading-none text-current',
        'font-bold',
        lockupStyles[lockup],
        className
      )}
    >
      <span>{brand.logo.wordmark}</span>
      {brand.logo.hasDot && (
        <span
          aria-hidden="true"
          className={cn(
            'ml-[0.09em] shrink-0 rounded-pill bg-brand-ink',
            'transition-transform duration-instant ease-out',
            'motion-safe:group-hover/logo:scale-125 motion-safe:group-focus-visible/logo:scale-125',
            dotStyles[lockup]
          )}
        />
      )}
    </span>
  );
}

interface LogoProps {
  lockup?: LogoLockup;
  className?: string;
  /** Override the accessible name — used where the surrounding context already says "home". */
  label?: string;
}

/**
 * The navigable logo. Always links to `/`.
 *
 * On the home route the link is marked `aria-current="page"` and stays
 * focusable, so a keyboard user is told where it goes rather than finding a
 * link that appears to do nothing.
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
        'group/logo inline-flex items-baseline rounded-action text-ink',
        'transition-colors duration-instant ease-out hover:text-brand-ink',
        className
      )}
    >
      <LogoMarkInner lockup={lockup} />
    </Link>
  );
}

/**
 * Split out so the hover/focus state of the *link* drives the dot, rather
 * than the mark needing its own group. Keeps `LogoMark` usable standalone.
 */
function LogoMarkInner({ lockup }: { lockup: LogoLockup }): ReactNode {
  const Vector = brand.logo.vectorAsset;

  if (Vector) return <Vector />;

  return (
    <span className={cn('inline-flex items-baseline font-display font-bold leading-none', lockupStyles[lockup])}>
      <span>{brand.logo.wordmark}</span>
      {brand.logo.hasDot && (
        <span
          aria-hidden="true"
          className={cn(
            'ml-[0.09em] shrink-0 rounded-pill bg-brand-ink',
            'transition-transform duration-instant ease-out',
            'motion-safe:group-hover/logo:scale-125 motion-safe:group-focus-visible/logo:scale-125',
            dotStyles[lockup]
          )}
        />
      )}
    </span>
  );
}
