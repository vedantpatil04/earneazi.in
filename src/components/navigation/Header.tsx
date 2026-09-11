import { useRef, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { headerCta, headerNav, primaryNav } from '@/data/nav';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { useHasScrolled } from '@/hooks/useHasScrolled';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { transitions, withMotionSafety } from '@/lib/motion/variants';
import { cn } from '@/lib/utils/cn';
import { MobileNav } from './MobileNav';

/**
 * The header keeps a constant height and only changes its *surface* on
 * scroll — from transparent over the hero to a bordered, blurred bar once
 * the page moves. Animating the height instead would reflow every section
 * below it on every scroll, which is the usual cause of a sticky header
 * feeling unstable on a phone.
 */
export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const hasScrolled = useHasScrolled(8);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-[background-color,border-color,box-shadow] motion-safe:duration-300 ease-signature',
        hasScrolled
          ? 'border-b border-divider bg-bg/85 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-bg/70'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <Container size="wide">
        <div className="flex h-16 items-center justify-between gap-4 md:h-20">
          <Link
            to="/"
            className="group inline-flex items-baseline gap-0.5 rounded-sm font-display text-[1.375rem] font-medium tracking-tight text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus md:text-[1.5rem]"
          >
            Earneazi
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-brass transition-transform motion-safe:duration-300 ease-signature group-hover:scale-125"
            />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {headerNav.map((item) => (
                <li key={item.path}>
                  <HeaderLink to={item.path} label={item.label} />
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />

            <Button to={headerCta.path} variant="primary" size="sm" className="hidden sm:inline-flex">
              {headerCta.label}
            </Button>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav-panel"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-divider text-ink transition-colors motion-safe:duration-200 hover:border-border hover:bg-surface-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus lg:hidden"
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </Container>

      <MobileNav
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        items={primaryNav}
        triggerRef={menuButtonRef}
      />
    </header>
  );
}

/**
 * The active route is marked with a brass rule that slides between items on
 * navigation, rather than each link fading its own underline in and out —
 * one object moving reads as "you are here", where several fading reads as
 * decoration. Falls back to a static rule when motion is reduced.
 */
function HeaderLink({ to, label }: { to: string; label: string }) {
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={cn(
        'relative inline-flex h-10 items-center rounded-sm px-3 text-small font-medium transition-colors motion-safe:duration-200',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        isActive ? 'text-ink' : 'text-ink-secondary hover:text-ink'
      )}
    >
      {label}
      {isActive &&
        (prefersReducedMotion ? (
          <span aria-hidden="true" className="absolute inset-x-3 bottom-1 h-px bg-brass" />
        ) : (
          <motion.span
            aria-hidden="true"
            layoutId="header-nav-indicator"
            className="absolute inset-x-3 bottom-1 h-px bg-brass"
            transition={withMotionSafety(prefersReducedMotion, transitions.base)}
          />
        ))}
    </NavLink>
  );
}
