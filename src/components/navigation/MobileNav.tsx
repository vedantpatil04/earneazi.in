import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import type { NavItem } from '@/types/nav';
import { headerCta } from '@/data/nav';
import { Icon } from '@/components/ui/Icon';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { navItemVariants, panelVariants, transitions, withMotionSafety } from '@/lib/motion/variants';
import { cn } from '@/lib/utils/cn';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  /** Focus returns here when the panel closes. */
  triggerRef: RefObject<HTMLButtonElement>;
}

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled])';

/**
 * Full-height navigation panel for small screens. Rows arrive in sequence
 * rather than all at once, which gives the eye an order to read them in,
 * and every row is at least 56px tall so it stays comfortably tappable.
 *
 * Behaviour that has to be right for this to feel native: focus moves into
 * the panel on open and returns to the trigger on close, Tab is trapped
 * inside it, Escape closes it, and the page behind it does not scroll.
 */
export function MobileNav({ open, onClose, items, triggerRef }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        triggerRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
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

  const handleClose = () => {
    onClose();
    triggerRef.current?.focus();
  };

  return (
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
          exit="hidden"
          variants={panelVariants}
          transition={withMotionSafety(prefersReducedMotion, transitions.base)}
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-bg lg:hidden"
        >
          <div className="flex h-16 flex-shrink-0 items-center justify-between px-4 sm:px-6">
            <span className="inline-flex items-baseline gap-0.5 font-display text-[1.375rem] font-medium text-ink">
              Earneazi
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brass" />
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              aria-label="Close menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-divider text-ink transition-colors motion-safe:duration-200 hover:bg-surface-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>

          <motion.nav
            aria-label="Mobile"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.045, delayChildren: prefersReducedMotion ? 0 : 0.08 } },
            }}
            className="flex-1 px-4 pb-6 pt-2 sm:px-6"
          >
            <ul className="flex flex-col">
              {items.map((item) => (
                <motion.li key={item.path} variants={navItemVariants}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex min-h-[3.5rem] flex-col justify-center border-b border-divider py-3 pl-3 pr-2 transition-colors motion-safe:duration-200',
                        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                        isActive ? 'border-l-2 border-l-brass bg-surface-2/60 text-ink' : 'text-ink hover:bg-surface-2/50'
                      )
                    }
                  >
                    <span className="font-display text-h3">{item.label}</span>
                    {item.description && <span className="mt-0.5 text-small text-ink-muted">{item.description}</span>}
                  </NavLink>
                </motion.li>
              ))}
            </ul>

            <motion.div variants={navItemVariants} className="mt-8">
              <NavLink
                to={headerCta.path}
                onClick={onClose}
                className="flex min-h-[3.25rem] items-center justify-between gap-3 rounded-md bg-accent px-5 text-body-lg font-medium text-on-accent transition-colors motion-safe:duration-200 hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                {headerCta.label}
                <Icon icon={ArrowRight} size={18} />
              </NavLink>
            </motion.div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
