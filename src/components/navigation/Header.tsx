import { useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { headerCta, headerNav, primaryNav } from '@/data/nav';
import { contactWhatsApp } from '@/data/contact';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { useHasScrolled } from '@/hooks/useHasScrolled';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { springUi } from '@/lib/motion/tokens';
import { cn } from '@/lib/utils/cn';
import { MobileNav } from './MobileNav';
import { MenuTrigger } from './MenuTrigger';

/**
 * The site header — Phase 0 §15.
 *
 * Its job is to keep two things one tap away at every scroll position: who
 * to talk to, and where the goals are. Three zones on the shell container,
 * so the logo shares its left edge with every page's content:
 *
 *   left    the logo, linking home
 *   centre  primary navigation
 *   right   theme control, an optional direct contact channel, and the
 *           single call to action
 *
 * Scroll behaviour
 * ────────────────
 * Two states. `rest` is transparent with no border; `engaged`, after 24px,
 * is a solid theme surface with a hairline and `shadow-sm`. The transition
 * is on colour only.
 *
 * The header does NOT change height, which is a deliberate departure from
 * the 76px→60px in §15. §18.2.6 is the stronger rule — only `transform` and
 * `opacity` may animate in a scroll-linked context, and no `height` — and a
 * sticky element that shrinks moves every section below it, which is a
 * layout shift against the CLS budget in §30. The state change is carried
 * by the surface instead, which is what §15 actually asks for when it says
 * to replace the previous build's smeared gradient with a discrete change.
 *
 * It also does not hide on scroll-down: on a conversion-led site the call
 * to action is never allowed to be more than zero taps away (§15).
 */
export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const engaged = useHasScrolled(24);

  return (
    <header
      className={cn(
        'sticky top-0 z-header',
        'transition-[background-color,border-color,box-shadow] motion-safe:duration-fast ease-out',
        engaged
          ? 'border-b border-divider bg-bg/90 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-bg/75'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <Container size="shell">
        <div className="flex h-header items-center justify-between gap-4">
          <Logo lockup="primary" className="lg:-ml-px" />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {headerNav.map((item) => (
                <li key={item.path}>
                  <HeaderLink to={item.path} label={item.label} />
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />

            {/* A direct channel beside the CTA, so "book a consultation" is
                not the only way to reach anyone. It renders only when the
                owner has confirmed a monitored WhatsApp number in
                data/contact.ts — Phase 0 §25 requires exactly one number to
                be designated, and none has been, so nothing appears yet
                rather than a placeholder. */}
            {contactWhatsApp && (
              <a
                href={`https://wa.me/${contactWhatsApp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Message Earneazi on WhatsApp — opens WhatsApp"
                className={cn(
                  'hidden h-11 w-11 shrink-0 items-center justify-center rounded-action border border-divider',
                  'text-ink-secondary transition-[background-color,border-color,color] motion-safe:duration-instant ease-out',
                  'hover:border-border hover:bg-hovered hover:text-ink xl:inline-flex'
                )}
              >
                <MessageCircle size={19} strokeWidth={1.5} aria-hidden="true" />
              </a>
            )}

            <Button to={headerCta.path} variant="primary" size="sm" className="hidden sm:inline-flex">
              {headerCta.label}
            </Button>

            <MenuTrigger
              ref={menuButtonRef}
              open={mobileNavOpen}
              onClick={() => setMobileNavOpen((open) => !open)}
              className="lg:hidden"
            />
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
 * A primary navigation item.
 *
 * The active route carries a 2px brand underline that moves between items
 * as one shared element rather than each link fading its own in and out —
 * one object travelling reads as "you are here", where several fading reads
 * as decoration. Under reduced motion it jumps.
 *
 * `aria-current="page"` is what actually conveys the state; the underline
 * is the visual form of it, never the only form.
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
        'relative inline-flex h-11 items-center rounded-action px-3 text-body-sm font-medium',
        'transition-colors motion-safe:duration-instant ease-out',
        isActive ? 'text-ink' : 'text-ink-secondary hover:text-ink'
      )}
    >
      {label}
      {isActive &&
        (prefersReducedMotion ? (
          <span aria-hidden="true" className="absolute inset-x-3 bottom-1.5 h-0.5 rounded-pill bg-brand" />
        ) : (
          <motion.span
            aria-hidden="true"
            layoutId="header-nav-indicator"
            className="absolute inset-x-3 bottom-1.5 h-0.5 rounded-pill bg-brand"
            transition={springUi}
          />
        ))}
    </NavLink>
  );
}
