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
 * Premium Financial-Advisory Header / Navbar
 *
 * Requirements:
 * - Dark/deep navy background in dark mode, crisp clean surface in light mode
 * - Clean minimal Earneazi logo on the left
 * - Main navigation centered: Services, Financial Goals, SIP Calculator, About, FAQ
 * - Theme toggle on the right
 * - Prominent "Book a consultation" CTA on the right
 * - Refined horizontal spacing, subtle border, smooth hover states
 */
export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const engaged = useHasScrolled(16);

  return (
    <header
      className={cn(
        'sticky top-0 z-header transition-all duration-fast ease-out',
        /* Light mode: crisp clean surface with high contrast */
        'bg-white/95 text-slate-900 border-b border-slate-200/90 shadow-sm backdrop-blur-md',
        /* Dark mode: deep navy background */
        'dark:bg-[#061424]/95 dark:text-white dark:border-[#14263b]',
        engaged && 'shadow-md'
      )}
    >
      <Container size="shell">
        <div className="flex h-header items-center justify-between gap-4 lg:grid lg:grid-cols-[auto_1fr_auto]">
          {/* Left: Earneazi Logo */}
          <div className="flex items-center justify-start">
            <Logo
              lockup="primary"
              className="lg:-ml-px text-slate-900 dark:text-white"
            />
          </div>

          {/* Center: Main navigation links */}
          <nav
            aria-label="Primary"
            className="hidden lg:flex items-center justify-center"
          >
            <ul className="flex items-center gap-1.5 xl:gap-2.5">
              {headerNav.map((item) => (
                <li key={item.path}>
                  <HeaderLink to={item.path} label={item.label} />
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: Theme toggle & CTA actions */}
          <div className="flex items-center justify-end gap-2.5 sm:gap-3.5">
            <ThemeToggle />

            {contactWhatsApp && (
              <a
                href={`https://wa.me/${contactWhatsApp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Message Earneazi on WhatsApp — opens WhatsApp"
                className={cn(
                  'hidden h-10 w-10 shrink-0 items-center justify-center rounded-action border',
                  'border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors duration-instant ease-out',
                  'dark:border-white/15 dark:text-slate-300 dark:hover:border-white/30 dark:hover:bg-white/10 dark:hover:text-white xl:inline-flex'
                )}
              >
                <MessageCircle size={18} strokeWidth={1.75} aria-hidden="true" />
              </a>
            )}

            <Button
              to={headerCta.path}
              variant="primary"
              size="sm"
              className="hidden sm:inline-flex shadow-sm px-5 py-2 text-sm font-semibold tracking-tight"
            >
              {headerCta.label}
            </Button>

            <MenuTrigger
              ref={menuButtonRef}
              open={mobileNavOpen}
              onClick={() => setMobileNavOpen((open) => !open)}
              className="lg:hidden text-slate-800 dark:text-white"
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
 * Navigation link with active state indicator and smooth micro-interactions
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
        'relative inline-flex h-10 items-center rounded-action px-3.5 text-[14px] font-medium transition-colors duration-instant ease-out',
        /* Light mode */
        'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80',
        isActive && 'text-slate-950 font-semibold',
        /* Dark mode */
        'dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5',
        isActive && 'dark:text-white dark:font-semibold'
      )}
    >
      {label}
      {isActive &&
        (prefersReducedMotion ? (
          <span
            aria-hidden="true"
            className="absolute inset-x-3.5 bottom-1 h-[2.5px] rounded-pill bg-brand"
          />
        ) : (
          <motion.span
            aria-hidden="true"
            layoutId="header-nav-indicator"
            className="absolute inset-x-3.5 bottom-1 h-[2.5px] rounded-pill bg-brand"
            transition={springUi}
          />
        ))}
    </NavLink>
  );
}
