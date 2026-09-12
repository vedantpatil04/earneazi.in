import { useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { MessageCircle, ArrowRight } from 'lucide-react';
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
 * The site header.
 *
 * Rewritten onto the token layer. It previously carried its own palette —
 * `bg-white/95`, `text-slate-900`, `dark:bg-[#061424]`, `border-slate-200`
 * — which meant the one element present on every screen was the one element
 * not participating in the theme system. Every colour here is now a role
 * token, so a change in tokens.css reaches the header like everything else.
 *
 * Three states, and no more:
 *
 *   rest       over the top of the page. A veil and a blur, no border, no
 *              shadow — the header reads as part of the hero rather than as
 *              a bar sitting on top of it.
 *   engaged    once the page has moved. The veil thickens, a hairline and
 *              the smallest shadow arrive. This is the only thing that
 *              changes; the bar does not shrink, because a header that
 *              resizes under the reader makes every fixed anchor on the
 *              page a moving target.
 *   progress   a brand hairline along the bottom edge tracking how far
 *              through the document the reader is.
 *
 * The progress line is the page's spine surfacing in the chrome. It is not
 * decoration: on a page whose two longest sections are pinned — where the
 * scrollbar is the only cue that anything is advancing, and the composition
 * is deliberately holding still — it is the one honest indicator of
 * position. It is hidden under reduced motion, where a permanently
 * animating element is exactly what has been opted out of.
 */
export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const engaged = useHasScrolled(16);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll();
  /* Springing the raw value keeps the line from stuttering on a trackpad's
     high-frequency scroll events without costing a React render per frame. */
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 30, restDelta: 0.001 });

  return (
    <header
      className={cn(
        'sticky top-0 z-header border-b',
        'bg-veil/[var(--veil-alpha)] backdrop-blur-xl',
        'transition-[background-color,border-color,box-shadow] duration-base ease-out',
        engaged ? 'border-divider shadow-sm' : 'border-transparent'
      )}
    >
      <Container size="shell">
        <div className="flex h-header items-center justify-between gap-4 lg:grid lg:grid-cols-[auto_1fr_auto]">
          <div className="flex items-center justify-start">
            <Logo lockup="primary" />
          </div>

          <nav aria-label="Primary" className="hidden items-center justify-center lg:flex">
            <ul className="flex items-center gap-0.5 xl:gap-1.5">
              {headerNav.map((item) => (
                <li key={item.path}>
                  <HeaderLink to={item.path} label={item.label} />
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-2 sm:gap-2.5">
            <ThemeToggle />

            {contactWhatsApp && (
              <Button
                href={`https://wa.me/${contactWhatsApp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="icon"
                aria-label="Message Earneazi on WhatsApp — opens WhatsApp"
                className="hidden xl:inline-flex"
              >
                <MessageCircle size={18} strokeWidth={1.5} aria-hidden="true" />
              </Button>
            )}

            <Button
              to={headerCta.path}
              variant="primary"
              size="sm"
              trailingIcon={<ArrowRight size={15} strokeWidth={2} aria-hidden="true" />}
              className="hidden sm:inline-flex"
            >
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

      {!prefersReducedMotion && (
        <motion.div
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="absolute inset-x-0 bottom-[-1px] h-px origin-left bg-spine-active"
        />
      )}

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
 * A primary navigation link.
 *
 * The active state is carried by two things at once — weight and a brand
 * rule — so it does not depend on colour alone. The rule is a shared
 * `layoutId`, so moving between routes slides one marker rather than
 * cross-fading two, which is what makes the bar read as a single control.
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
        'relative inline-flex h-10 items-center rounded-action px-3.5 text-body-sm',
        'transition-colors duration-instant ease-out',
        isActive ? 'font-semibold text-ink-display' : 'font-medium text-ink-secondary hover:bg-hovered hover:text-ink'
      )}
    >
      {label}
      {isActive &&
        (prefersReducedMotion ? (
          <span aria-hidden="true" className="absolute inset-x-3.5 bottom-1 h-0.5 rounded-pill bg-brand" />
        ) : (
          <motion.span
            aria-hidden="true"
            layoutId="header-nav-indicator"
            className="absolute inset-x-3.5 bottom-1 h-0.5 rounded-pill bg-brand"
            transition={springUi}
          />
        ))}
    </NavLink>
  );
}
