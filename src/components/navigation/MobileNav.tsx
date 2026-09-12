import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { RefObject } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Calculator } from 'lucide-react';
import type { NavItem } from '@/types/nav';
import { headerCta } from '@/data/nav';
import { contactChannelHref, verifiedContactChannels } from '@/data/contact';
import { LogoMark } from '@/components/brand/Logo';
import { ThemeControl } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { MenuTrigger } from './MenuTrigger';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { useInert } from '@/hooks/useInert';
import { navItemVariants, sheetVariants } from '@/lib/motion/variants';
import { duration, easing, staggerInterval, withMotionSafety } from '@/lib/motion/tokens';
import { cn } from '@/lib/utils/cn';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  /** Focus returns here when the panel closes. */
  triggerRef: RefObject<HTMLButtonElement>;
}

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** The route that gets its own highlighted row (Phase 0 §16). */
const HIGHLIGHT_PATH = '/sip-calculator';

/**
 * Mobile navigation — Phase 0 §16.
 *
 * A full-screen sheet rather than a side drawer, entering with a vertical
 * translate and a clip reveal instead of a plain opacity fade, so it reads
 * as a surface arriving rather than as content appearing from nothing.
 *
 * Content order is the audit's, and it is an argument rather than a list:
 * where you can go, then the one tool worth trying, then how to reach a
 * person, then the controls.
 *
 * The behaviour that has to be right for this to feel native rather than
 * like a div over the page:
 *   · focus moves into the sheet on open and returns to the trigger on
 *     close, Tab is trapped, and Escape closes;
 *   · the rest of the document is `inert`, so a screen reader's virtual
 *     cursor cannot walk into the page behind it;
 *   · the page behind does not scroll, and its position is restored;
 *   · `env(safe-area-inset-*)` is respected top and bottom, so the last row
 *     is not under the home indicator;
 *   · rows stagger at 30ms and travel 12px, and under reduced motion they
 *     do neither.
 *
 * Rendered through a portal on `document.body` so `inert` can be applied to
 * the whole app root — the sheet has to sit outside the tree it freezes.
 */
export function MobileNav({ open, onClose, items, triggerRef }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLockBodyScroll(open);
  useInert('#root', open);

  /*
    Publish the sheet's open state on the document element.

    §25 requires the floating contact control to be suppressed while this
    is open. `useInert('#root')` above already stops it being reachable —
    the control lives inside #root — but inert does not hide anything, so a
    blue pill would still float over the sheet.

    An attribute rather than shared state or a context: the two components
    have no other reason to know about each other, and a provider for one
    boolean is a heavier contract than the problem. This is the whole API
    between them, and FloatingContact watches it with a MutationObserver.
  */
  useEffect(() => {
    const root = document.documentElement;
    if (open) root.setAttribute('data-nav-open', '');
    else root.removeAttribute('data-nav-open');
    return () => root.removeAttribute('data-nav-open');
  }, [open]);

  /*
    Focus returns to the trigger only after the sheet has closed. It cannot
    be done inside the close handler: the trigger lives inside #root, which
    is `inert` while the sheet is open, and an inert element cannot take
    focus. Restoring on the open→closed transition runs after the inert
    attribute has been removed.
  */
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !open) triggerRef.current?.focus();
    wasOpen.current = open;
  }, [open, triggerRef]);

  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (element) => element.offsetParent !== null || element === document.activeElement
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, triggerRef]);


  const destinations = items.filter((item) => item.path !== HIGHLIGHT_PATH);
  const highlight = items.find((item) => item.path === HIGHLIGHT_PATH);

  /* Only channels the owner has confirmed. Nothing is invented, and an
     unconfirmed channel renders nothing rather than a placeholder. */
  const directChannels = verifiedContactChannels.filter((channel) =>
    ['phone', 'whatsapp', 'email'].includes(channel.kind)
  );
  const contextChannels = verifiedContactChannels.filter((channel) => ['office', 'hours'].includes(channel.kind));

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          id="mobile-nav-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={sheetVariants}
          transition={withMotionSafety(
            prefersReducedMotion,
            /* §16: 280ms, ease-out. Under reduced motion the sheet appears
               with opacity only and no longer than 120ms — which is what
               `withMotionSafety` collapsing to zero duration delivers. */
            { duration: 0.28, ease: easing.out }
          )}
          className={cn(
            'fixed inset-0 z-overlay flex flex-col overflow-y-auto overscroll-contain',
            'bg-surface shadow-lg lg:hidden'
          )}
          style={{
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          <div className="flex h-header shrink-0 items-center justify-between gap-4 px-gutter">
            <LogoMark lockup="primary" className="text-ink" />
            <MenuTrigger ref={closeButtonRef} open onClick={onClose} />
          </div>

          <motion.nav
            aria-label="Mobile"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: staggerInterval(prefersReducedMotion, 0.03),
                  delayChildren: prefersReducedMotion ? 0 : duration.instant,
                },
              },
            }}
            className="flex flex-1 flex-col px-gutter pb-10 pt-2"
          >
            <ul className="flex flex-col">
              {destinations.map((item) => (
                <motion.li key={item.path} variants={navItemVariants}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex min-h-14 flex-col justify-center border-b border-divider py-2.5 pl-3 pr-2',
                        'transition-colors motion-safe:duration-instant ease-out',
                        isActive ? 'border-l-2 border-l-brand bg-selected/50 text-ink' : 'text-ink hover:bg-hovered'
                      )
                    }
                  >
                    <span className="font-display text-title-lg">{item.label}</span>
                    {item.description && <span className="mt-0.5 text-body-sm text-ink-muted">{item.description}</span>}
                  </NavLink>
                </motion.li>
              ))}
            </ul>

            {/* The one tool a visitor can use before speaking to anyone, so
                it is a distinct row rather than the fifth item in a list. */}
            {highlight && (
              <motion.div variants={navItemVariants} className="mt-6">
                <NavLink
                  to={highlight.path}
                  onClick={onClose}
                  className="flex min-h-14 items-center gap-3 rounded-surface border border-brand/25 bg-brand-subtle px-4 py-3 text-ink transition-colors motion-safe:duration-instant ease-out hover:border-brand/40"
                >
                  <Calculator size={22} strokeWidth={1.5} aria-hidden="true" className="shrink-0 text-brand-ink" />
                  <span className="min-w-0">
                    <span className="block font-display text-title-sm">{highlight.label}</span>
                    {highlight.description && (
                      <span className="block text-body-sm text-ink-muted">{highlight.description}</span>
                    )}
                  </span>
                </NavLink>
              </motion.div>
            )}

            <motion.div variants={navItemVariants} className="mt-6">
              <Button to={headerCta.path} onClick={onClose} size="lg" className="w-full">
                {headerCta.label}
              </Button>
            </motion.div>

            {/* Direct channels — real `tel:` / `mailto:` / WhatsApp links,
                not routes. Appears only once the owner confirms a channel
                in data/contact.ts (Phase 0 §25). */}
            {directChannels.length > 0 && (
              <motion.ul variants={navItemVariants} className="mt-6 flex flex-col gap-2">
                {directChannels.map((channel) => {
                  const href = contactChannelHref(channel);
                  if (!href) return null;
                  const external = channel.kind === 'whatsapp';
                  return (
                    <li key={channel.id}>
                      <a
                        href={href}
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        onClick={onClose}
                        className="flex min-h-12 items-center justify-between gap-3 rounded-action border border-divider px-4 text-body text-ink transition-colors motion-safe:duration-instant ease-out hover:bg-hovered"
                      >
                        <span className="font-medium">{channel.label}</span>
                        <span className="text-ink-muted">{channel.value}</span>
                      </a>
                    </li>
                  );
                })}
              </motion.ul>
            )}

            <motion.div variants={navItemVariants} className="mt-8">
              <ThemeControl />
            </motion.div>

            {contextChannels.length > 0 && (
              <motion.dl variants={navItemVariants} className="mt-8 flex flex-col gap-2 text-body-sm text-ink-muted">
                {contextChannels.map((channel) => (
                  <div key={channel.id}>
                    <dt className="sr-only">{channel.label}</dt>
                    <dd className="whitespace-pre-line">{channel.value}</dd>
                  </div>
                ))}
              </motion.dl>
            )}
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
