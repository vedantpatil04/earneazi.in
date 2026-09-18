import { useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { headerCta, headerNav } from '@/data/nav';
import { generalConversation, resolveConversation } from '@/lib/contact/conversation';
import { WhatsAppGlyph } from '@/components/conversion/WhatsAppGlyph';
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
import { HeaderCredential } from './HeaderCredential';

/**
 * The site header.
 *
 * Every colour here is a role token, so a change in tokens.css reaches the
 * header like everything else.
 *
 * Three states, and no more:
 *
 *   rest       over the top of the page. A veil and a blur, no border, no
 *              shadow — the header reads as part of the hero rather than as
 *              a bar sitting on top of it.
 *   engaged    once the page has moved. A hairline and the header shadow
 *              arrive. This is the only thing that changes; the bar does not
 *              shrink, because a header that resizes under the reader makes
 *              every fixed anchor on the page a moving target.
 *   progress   a brand hairline along the bottom edge tracking how far
 *              through the document the reader is.
 *
 * ── Enhancement A ────────────────────────────────────────────────────────
 *
 * The primary navigation sits in a recessed track, and the current route is
 * a raised pill that slides between items as one object (a shared
 * `layoutId` on the `spring-ui` token). The state is carried by the pill,
 * the weight and `aria-current` together, so it never rests on colour.
 * The theme control is a switch in the same recessed/raised construction,
 * and the call to action is the lit primary button — so the bar is three
 * depths: the veil, what sits in it, and the one thing that is lit.
 *
 * The credential line ("✓ AMFI Registered · DSA Licensed") renders only
 * from verified registrations with their identifiers (data/credentials.ts),
 * only from 1360px where it fits beside the navigation without crowding
 * it, and links to the ledger that evidences it. With the register as
 * shipped, it renders nothing.
 */
export function Header() {
  /* Resolved once per render: where a "talk to us" action goes, decided in
     one place for the whole site (lib/contact/conversation.ts). */
  const navConversation = resolveConversation(generalConversation, 'Message Earneazi');

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
        'bg-veil/[var(--veil-alpha)] backdrop-blur-xl backdrop-saturate-150',
        'transition-[background-color,border-color,box-shadow] duration-base ease-out',
        engaged ? 'border-divider shadow-header' : 'border-transparent'
      )}
    >
      <Container size="shell">
        <div className="flex h-header items-center justify-between gap-3 lg:gap-4">
          {/* ── Left brand zone ── */}
          <div className="flex items-center justify-start shrink-0">
            <Logo lockup="primary" />
          </div>

          {/* ── Center navigation zone ── */}
          <nav aria-label="Primary" className="hidden lg:flex items-center justify-center flex-1 mx-2 min-w-0">
            <ul className="inset-well flex items-center gap-0.5 rounded-pill border border-divider/80 bg-surface-sunken/70 p-1">
              {headerNav.map((item) => (
                <li key={item.path}>
                  <HeaderLink to={item.path} label={item.label} reducedMotion={prefersReducedMotion} />
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Right action zone ── */}
          <div className="flex items-center justify-end gap-2 sm:gap-2.5 shrink-0">
            <HeaderCredential className="hidden min-[1360px]:inline-flex" />

            <ThemeToggle />

            {/*
              The navbar's conversation entry point (§25). It asks the shared
              resolver where this goes and renders only when that destination
              is WhatsApp — a second icon pointing at /contact would duplicate
              the button beside it.
            */}
            {navConversation.channel === 'whatsapp' && (
              <Button
                href={navConversation.href}
                target="_blank"
                rel="noopener noreferrer"
                variant="icon"
                aria-label={navConversation.ariaLabel}
                className="hidden rounded-pill text-social-whatsapp xl:inline-flex"
              >
                <WhatsAppGlyph size={18} />
              </Button>
            )}

            {/* 44px tall below 1024px, where this bar is used on a touch
                screen; the desktop bar keeps the 36px `sm` density. */}
            <Button
              to={headerCta.path}
              variant="primary"
              size="sm"
              trailingIcon={<ArrowRight size={15} strokeWidth={2} aria-hidden="true" />}
              className="hidden rounded-pill max-lg:h-11 sm:inline-flex"
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
        items={headerNav}
        triggerRef={menuButtonRef}
      />
    </header>
  );
}

/**
 * A primary navigation link.
 *
 * The active state is carried by three things at once — the raised pill,
 * the weight, and `aria-current` — so it does not depend on colour alone.
 * The pill is a shared `layoutId`, so moving between routes slides one
 * object rather than cross-fading two, which is what makes the bar read as
 * a single control. Under reduced motion it simply appears on the new item.
 */
function HeaderLink({ to, label, reducedMotion }: { to: string; label: string; reducedMotion: boolean }) {
  const location = useLocation();
  const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
  const pillClass = 'raised absolute inset-0 rounded-pill bg-surface';

  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={cn(
        'relative inline-flex h-9 items-center rounded-pill px-3.5 text-body-sm',
        'transition-colors duration-instant ease-out',
        isActive ? 'font-semibold text-ink-display' : 'font-medium text-ink-secondary hover:bg-surface/60 hover:text-ink'
      )}
    >
      {isActive &&
        (reducedMotion ? (
          <span aria-hidden="true" className={pillClass} />
        ) : (
          <motion.span aria-hidden="true" layoutId="header-nav-indicator" className={pillClass} transition={springUi} />
        ))}
      <span className="relative">{label}</span>
    </NavLink>
  );
}
