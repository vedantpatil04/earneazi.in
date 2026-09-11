import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/** Clearance for the sticky header, so an anchored heading doesn't land underneath it. */
const HEADER_OFFSET = 96;

/**
 * Restores scroll position on navigation, which React Router deliberately
 * does not do for you.
 *
 * Two cases, and they need opposite behaviour:
 *   plain route change  → go to the top. Without this, following a footer
 *                         link from halfway down one page drops you halfway
 *                         down the next one.
 *   route with a hash   → go to that element, offset clear of the sticky
 *                         header, and move focus there so a keyboard user
 *                         continues from the heading they asked for rather
 *                         than from the top of the document.
 *
 * `/services#insurance` is linked from the homepage and the footer, so the
 * hash case is a real flow rather than a nicety.
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    // The target may belong to a route that is still loading (the SIP
    // calculator is code-split), so retry across a few frames rather than
    // giving up on the first miss.
    let attempts = 0;
    let frame = 0;

    const tryScroll = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));

      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        window.scrollTo({ top, behavior });

        // Focus without stealing it visually: the element gets a temporary
        // tabindex so it can receive focus, which is removed again on blur.
        if (!target.hasAttribute('tabindex')) {
          target.setAttribute('tabindex', '-1');
          target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
        }
        target.focus({ preventScroll: true });
        return;
      }

      attempts += 1;
      if (attempts < 20) frame = window.requestAnimationFrame(tryScroll);
    };

    frame = window.requestAnimationFrame(tryScroll);
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash, prefersReducedMotion]);

  return null;
}
