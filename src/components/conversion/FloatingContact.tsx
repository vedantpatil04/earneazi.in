import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { generalConversation, resolveConversation } from '@/lib/contact/conversation';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { duration, easing } from '@/lib/motion/tokens';
import { cn } from '@/lib/utils/cn';
import { WhatsAppGlyph } from './WhatsAppGlyph';

/**
 * The persistent conversation affordance — §25's floating contact control.
 *
 * The old Earneazi site's WhatsApp button is, by the audit's own assessment,
 * its single best-performing idea, and the current build had dropped it. This
 * restores the function and redesigns the surface.
 *
 * ── What it is when there is no number yet ──────────────────────────────
 *
 * Still a real affordance. With a verified WhatsApp number it opens WhatsApp
 * with a general enquiry pre-filled; without one it goes to the consultation
 * form. Both are useful destinations, so the control is never a placeholder
 * and never has to be hidden for being unconfigured — and when the number is
 * confirmed the glyph, the label and the destination all change on their own,
 * because `resolveConversation` decides all three.
 *
 * ── Colour ──────────────────────────────────────────────────────────────
 *
 * §25: the container belongs to Earneazi's system, and WhatsApp's green stays
 * confined to the glyph. So the pill is the brand blue — lit and floating,
 * in the depth language every other primary action uses — and once a
 * verified number exists the WhatsApp mark sits in a white disc in its own
 * published green, which is what makes it recognisable at a glance. Until
 * then the control goes to the consultation form and shows a plain chat
 * glyph, because a WhatsApp mark on a link that does not open WhatsApp
 * would be a promise the link does not keep.
 *
 * ── Suppression ─────────────────────────────────────────────────────────
 *
 * A floating control that covers a primary action is worse than no floating
 * control. It hides when:
 *
 *   · the mobile navigation sheet is open — MobileNav stamps `data-nav-open`
 *     on <html>, which is the whole contract between the two;
 *   · the footer, or any surface marked `data-conversion-surface`, is on
 *     screen — the contact channels and the closing CTA band already offer
 *     this, and a duplicate floating over them is noise;
 *   · any surface marked `data-conversion-suppress` is on screen — the SIP
 *     calculator marks itself, because this control sits exactly where the
 *     output panel's right edge lands on a narrow screen (§25);
 *   · the reader is already on /contact, where the whole page is this.
 *
 * ── How the overlap is measured ─────────────────────────────────────────
 *
 * By reading rects on scroll, rAF-throttled — the same pattern
 * `useScrollSpy` uses, for the same reason: it is deterministic and it
 * re-queries the DOM on every read, so a section that mounts late (every
 * route here is code-split) is picked up without anything having to notice
 * that it arrived.
 *
 * The obvious instinct is an IntersectionObserver plus a MutationObserver to
 * catch late arrivals, and that is what this was first written as. It does
 * not work here: `AnimatedRupees` writes into `textContent` on every frame
 * of a slider drag, which is a childList mutation, so the rescan fired
 * continuously and cleared the suppressed state as fast as it was set. The
 * control stayed visible over the footer and over the calculator — exactly
 * the two places §25 names.
 */
const SUPPRESSING_SELECTOR = 'footer, [data-conversion-surface], [data-conversion-suppress]';

export function FloatingContact() {
  const { pathname } = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [obstructed, setObstructed] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const target = resolveConversation(generalConversation, 'Start a conversation');
  const isWhatsApp = target.channel === 'whatsapp';
  const label = isWhatsApp ? 'Chat on WhatsApp' : 'Talk to an advisor';
  const onContactRoute = pathname === '/contact';

  useEffect(() => {
    if (typeof window === 'undefined' || onContactRoute) return;
    let frame = 0;

    const read = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      /* The band the control actually occupies: its own height plus its
         inset, with room to spare. A surface only counts as in the way if
         it reaches into this, not merely because it is on screen. */
      const zoneTop = viewportHeight - 140;

      let blocked = false;
      const surfaces = document.querySelectorAll(SUPPRESSING_SELECTOR);
      for (const surface of surfaces) {
        const box = surface.getBoundingClientRect();
        if (box.bottom > zoneTop && box.top < viewportHeight) {
          blocked = true;
          break;
        }
      }

      setObstructed((current) => (current === blocked ? current : blocked));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(read);
    };

    read();
    /* Routes are code-split, so the sections to watch do not all exist on
       the frame this runs. One re-read once the page has settled catches
       them without polling; after that, scrolling does. */
    const settle = window.setTimeout(read, 400);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname, onContactRoute]);

  /* The mobile sheet's open state, read from the attribute it stamps on the
     document element. An attribute rather than shared state because the two
     components have no other reason to know about each other, and a context
     provider for one boolean is a heavier contract than the problem. */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    const read = () => setNavOpen(root.hasAttribute('data-nav-open'));
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ['data-nav-open'] });
    return () => observer.disconnect();
  }, []);

  if (onContactRoute) return null;

  const hidden = obstructed || navOpen;

  /*
    One class list, two elements. The destination decides whether this is a
    router navigation or an external link, and nothing else about the control
    changes with it.
  */
  const controlClass = cn(
    'group pointer-events-auto flex items-center overflow-hidden rounded-pill',
    /* 48×48 on mobile (exceeds 44px min touch target), 56×56 from sm up */
    'lit lit-float sheen h-12 w-12 sm:h-14 sm:min-w-14 border border-on-brand/15 bg-brand text-on-brand',
    'transition-[background-color,padding] duration-base ease-out hover:bg-brand-fill-hover',
    /* Desktop expands to a labelled pill on hover and on focus. Below `lg` it
       stays an icon: there is no hover on a thumb, and a pill wide enough to
       read would cover the content beside it. */
    'lg:hover:pe-6 lg:focus-visible:pe-6'
  );

  const controlBody = (
    <>
      <span className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center">
        {isWhatsApp ? (
          <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-pill bg-on-brand text-social-whatsapp shadow-xs">
            <WhatsAppGlyph size={19} />
          </span>
        ) : (
          <MessageCircle size={22} strokeWidth={1.75} aria-hidden="true" />
        )}
      </span>

      {/*
        Present in the DOM at every size but clipped to zero width until the
        pill expands, so the expansion is a width change on one element rather
        than content appearing into place. `aria-hidden` because the control
        already carries a fuller accessible name.
      */}
      <span
        aria-hidden="true"
        className={cn(
          'hidden whitespace-nowrap font-display text-body-sm font-semibold',
          'lg:block lg:max-w-0 lg:overflow-hidden lg:transition-[max-width] lg:duration-base lg:ease-out',
          'lg:group-hover:max-w-[12rem] lg:group-focus-visible:max-w-[12rem]'
        )}
      >
        {label}
      </span>
    </>
  );

  return (
    <motion.div
      /* Bottom-right, lifted clear of the home indicator on iOS: 16px plus
         the safe-area inset, per §25. */
      className="pointer-events-none fixed bottom-0 right-0 z-overlay p-3 sm:p-4"
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      initial={false}
      animate={hidden ? 'hidden' : 'visible'}
      variants={{
        visible: { opacity: 1, y: 0 },
        /* Travels 12px — the UI-feedback budget — and leaves downward, toward
           the edge it came from. */
        hidden: { opacity: 0, y: 12 },
      }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: duration.fast, ease: easing.out }}
      /* Removed from the accessibility tree while hidden. The control
         itself also leaves the tab order (see `tabIndex` below), so a
         keyboard user never lands on something they cannot see. `inert`
         would express both at once but is not a supported prop on React 18. */
      aria-hidden={hidden || undefined}
    >
      {target.external ? (
        <a
          href={target.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={target.ariaLabel}
          tabIndex={hidden ? -1 : undefined}
          className={controlClass}
        >
          {controlBody}
        </a>
      ) : (
        <Link to={target.href} aria-label={target.ariaLabel} tabIndex={hidden ? -1 : undefined} className={controlClass}>
          {controlBody}
        </Link>
      )}
    </motion.div>
  );
}
