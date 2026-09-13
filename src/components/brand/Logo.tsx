import { Link, useLocation } from 'react-router-dom';
import { brand } from '@/config/brand';
import { cn } from '@/lib/utils/cn';

/**
 * The Earneazi logo system — Phase 0 §7.
 *
 * One component renders every appearance of the logo on the site. A caller
 * picks a lockup; the lockup decides size, weight, tracking and dot
 * proportion. There is no per-page recreation and no ad-hoc scaling.
 *
 *   primary    nav. Wordmark plus dot.
 *   compact    narrow bars and constrained surfaces, where the primary
 *              lockup would fall below its 112px minimum width.
 *   monogram   the square mark, for surfaces too tight for any wordmark —
 *              the mobile sheet header, a future avatar or app icon.
 *   footer     the footer's brand anchor. One step up from the nav lockup,
 *              so the mark reads as the page's sign-off rather than as a
 *              second navigation bar, and deliberately nowhere near a poster:
 *              the footer's content is the footer, not the wordmark.
 *   oversized  a display-scale lockup, reserved for a future brand band.
 *              Optically tracked, and the only lockup the dimensional
 *              treatment in §9 may be applied to.
 *
 * ── The typographic treatment ────────────────────────────────────────────
 *
 * Still provisional, and still one line from being replaced — but no longer
 * *arbitrary*. The lockup is now set the way the wordmark on Earneazi's own
 * live site is set: uppercase, heavy, and tracked open rather than tight.
 * That is a deliberate correction. Title case at a tight negative tracking
 * reads as a word someone typed into a heading; caps at a positive tracking
 * reads as a mark, which is what §7 is asking for and what the rest of the
 * page now has to sit underneath.
 *
 * Contrast: the wordmark is `currentColor`, so it inherits whatever text
 * colour its context sets and both themes are served by one asset with no
 * flash on switch. It is deliberately *not* a gradient — a gradient
 * wordmark cannot be given a contrast ratio, and the identity is the one
 * element on the page that must never be the thing that fails. The dot is
 * the single brand-coloured part.
 *
 * Interaction: the dot is the handle. On hover and focus it is the only
 * thing that moves — the wordmark itself never animates, because a moving
 * logotype reads as a widget rather than as an identity.
 *
 * PROVISIONAL: the approved vector has not been supplied. When
 * `brand.logo.vectorAsset` is set, that component renders instead and every
 * call site picks it up untouched.
 */

type LogoLockup = 'primary' | 'compact' | 'monogram' | 'footer' | 'oversized';

const lockupStyles: Record<LogoLockup, string> = {
  primary: 'text-[1.0625rem] md:text-[1.1875rem] tracking-[0.1em] font-extrabold',
  compact: 'text-[0.9375rem] tracking-[0.09em] font-extrabold',
  monogram: 'text-[0.9375rem] tracking-[0.02em] font-extrabold',
  /* 26px on a phone, 30px from a tablet up — a clear step above the nav's
     19px, and fixed rather than viewport-scaled so the mark keeps the same
     weight against the footer grid at every width. Tracking eases slightly
     from the nav lockup's 0.1em, which starts to read as spaced-out above
     24px. */
  footer: 'text-[1.625rem] md:text-[1.875rem] tracking-[0.085em] font-extrabold',
  /* Minimum 96px cap height at desktop, per §7. Tracked tighter than the
     small lockups, because tracking that reads as open at 17px reads as
     falling apart at 120px. */
  oversized: 'text-[clamp(2.75rem,8vw,6rem)] tracking-[0.045em] font-extrabold',
};

const dotStyles: Record<LogoLockup, string> = {
  primary: 'h-[0.3em] w-[0.3em]',
  compact: 'h-[0.3em] w-[0.3em]',
  monogram: 'hidden',
  footer: 'h-[0.26em] w-[0.26em]',
  oversized: 'h-[0.17em] w-[0.17em]',
};

/**
 * The wordmark itself. Split out so both the linked and unlinked versions
 * render exactly the same markup — they were previously two copies that had
 * already begun to drift.
 *
 * The dot responds to hover and focus on the *nearest* `group/logo`, which
 * is the link when there is one and the mark itself when there isn't, so
 * the whole control drives it rather than the dot needing its own hover.
 */
function Wordmark({ lockup }: { lockup: LogoLockup }) {
  if (lockup === 'monogram') {
    return (
      <span
        className={cn(
          'inline-flex h-9 w-9 items-center justify-center rounded-action',
          'bg-brand text-on-brand font-display uppercase leading-none',
          'transition-transform duration-instant ease-out',
          'motion-safe:group-hover/logo:scale-[1.04] motion-safe:group-focus-visible/logo:scale-[1.04]',
          lockupStyles.monogram
        )}
      >
        {brand.logo.wordmark.charAt(0)}
      </span>
    );
  }

  return (
    <span className={cn('inline-flex items-baseline font-display uppercase leading-none', lockupStyles[lockup])}>
      {/* The trailing tracking on the last letter would otherwise push the
          dot away from the wordmark it belongs to. */}
      <span className="-me-[0.1em]">{brand.logo.wordmark}</span>
      {brand.logo.hasDot && (
        <span
          aria-hidden="true"
          className={cn(
            'ms-[0.22em] shrink-0 rounded-pill bg-brand',
            'transition-transform duration-instant ease-out',
            'motion-safe:group-hover/logo:scale-[1.35] motion-safe:group-focus-visible/logo:scale-[1.35]',
            dotStyles[lockup]
          )}
        />
      )}
    </span>
  );
}

interface LogoMarkProps {
  lockup?: LogoLockup;
  className?: string;
}

/**
 * The mark with no link or landmark behaviour, for the places it is
 * decorative — inside the mobile sheet header, or a brand band.
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
    <span className={cn('group/logo inline-flex items-baseline text-current', className)}>
      <Wordmark lockup={lockup} />
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
  const Vector = brand.logo.vectorAsset;

  return (
    <Link
      to="/"
      aria-label={label ?? brand.logo.homeLabel}
      aria-current={isHome ? 'page' : undefined}
      className={cn(
        /* The wordmark's own box is only its cap height — about 17px — which
           is nowhere near a touch target. The link pads out to 44px and
           centres the mark inside it, so the thing people actually tap is
           the size it looks. */
        'group/logo inline-flex min-h-11 items-center rounded-action text-ink-display',
        'transition-colors duration-instant ease-out hover:text-brand-ink',
        className
      )}
    >
      {Vector ? <Vector /> : <Wordmark lockup={lockup} />}
    </Link>
  );
}
