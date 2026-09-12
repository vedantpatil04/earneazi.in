import { Link } from 'react-router-dom';
import { TrendingUp, ShieldCheck, Landmark, Target, Calculator, Headphones } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { IconTile } from '@/components/ui/IconTile';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/utils/cn';

interface StripItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

const stripItems: StripItem[] = [
  { id: 'mutual-funds', title: 'Mutual Funds & PMS', description: 'Wealth & active portfolios', href: '/services#mutual-funds-pms', icon: TrendingUp },
  { id: 'insurance', title: 'Insurance', description: 'Life & health cover', href: '/services#insurance', icon: ShieldCheck },
  { id: 'loans', title: 'Loans', description: 'Home & personal', href: '/services#loans', icon: Landmark },
  { id: 'financial-goals', title: 'Financial Goals', description: 'Milestone roadmaps', href: '/financial-goals', icon: Target },
  { id: 'sip-calculator', title: 'SIP Calculator', description: 'Run the numbers', href: '/sip-calculator', icon: Calculator },
  { id: 'talk-to-advisor', title: 'Talk to an advisor', description: 'One-to-one guidance', href: '/contact', icon: Headphones },
];

/**
 * The service rail — an index of everything the site can do, sitting
 * directly under the hero as the bridge into the page proper.
 *
 * It used to sit *above* the hero, which made the first thing below the
 * navigation a second navigation, and pushed the one cinematic moment on
 * the page below the fold. Moving it under the hero gives it an actual job:
 * the hero says what the firm is, the rail says what is here, the page then
 * argues it.
 *
 * ── Three things fixed in the rewrite ───────────────────────────────────
 *
 * 1. The duplicate set is now hidden from assistive technology and removed
 *    from the tab order. A marquee needs its content twice to loop without
 *    a seam, but the previous version rendered two *real* lists, so a
 *    screen reader announced twelve links to six destinations and a
 *    keyboard user tabbed through every one of them twice.
 *
 * 2. Movement stops for `prefers-reduced-motion`. The global safety net in
 *    globals.css collapses animation *duration* to ~0, which for an
 *    infinite marquee does not stop it — it makes it flicker between its
 *    start and end frames. Reduced motion now gets a static, swipeable rail
 *    with scroll snapping instead, which is the same content without the
 *    thing that was opted out of.
 *
 * 3. It pauses on focus as well as on hover, so a keyboard user can reach a
 *    link without it sliding out from under the focus ring.
 */
export function ServicesStrip() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      data-marquee-root
      className="relative z-20 select-none border-y border-divider bg-surface-sunken"
      role="region"
      aria-label="What Earneazi offers"
    >
      {/* The edges dissolve rather than cut, so items enter and leave the
          rail instead of appearing at a hard boundary. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-surface-sunken to-transparent sm:w-20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-surface-sunken to-transparent sm:w-20"
      />

      <div
        className={cn(
          'flex overflow-hidden py-3',
          /* Without the animation there is nothing moving the content past
             the viewport, so the rail becomes a swipeable one. */
          prefersReducedMotion && 'snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
        )}
      >
        <ul
          className={cn(
            'flex shrink-0 items-center',
            !prefersReducedMotion && 'animate-marquee'
          )}
        >
          {stripItems.map((item) => (
            <StripEntry key={item.id} item={item} />
          ))}
        </ul>

        {/* The seam filler. Identical content, invisible to assistive
            technology and unreachable by keyboard. */}
        {!prefersReducedMotion && (
          <ul aria-hidden="true" className="flex shrink-0 items-center animate-marquee">
            {stripItems.map((item) => (
              <StripEntry key={`${item.id}-clone`} item={item} clone />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StripEntry({ item, clone = false }: { item: StripItem; clone?: boolean }) {
  return (
    <li className="flex shrink-0 snap-start items-center">
      <Link
        to={item.href}
        tabIndex={clone ? -1 : undefined}
        className={cn(
          'group flex items-center gap-3 rounded-action px-4 py-1.5 sm:px-6',
          'transition-colors duration-instant ease-out hover:bg-hovered'
        )}
      >
        <IconTile icon={item.icon} size="sm" fill="brand" className="group-hover:bg-brand group-hover:text-on-brand" />

        <span className="flex flex-col whitespace-nowrap text-left">
          <span className="text-body-sm font-semibold text-ink transition-colors duration-instant group-hover:text-brand-ink">
            {item.title}
          </span>
          <span className="text-legal leading-tight text-ink-muted">{item.description}</span>
        </span>
      </Link>

      <span aria-hidden="true" className="h-5 w-px bg-divider" />
    </li>
  );
}
