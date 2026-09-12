import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Clearance for the sticky header, read from the same `--header-offset`
 * token the CSS `scroll-margin-top` uses, so the two cannot drift apart.
 * Falls back to the desktop value if the variable is unreadable.
 */
function headerOffset(): number {
  if (typeof window === 'undefined') return 88;
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-offset').trim();
  const rem = Number.parseFloat(raw);
  if (Number.isNaN(rem)) return 88;
  const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  return raw.endsWith('rem') ? rem * rootFontSize : rem;
}

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

    /*
      Two separate problems, and the first one masks the second.

      The target may belong to a route that is still loading — every route is
      code-split — so the element does not exist on the frame the URL
      changes, and we have to wait for it.

      But arriving on the first frame the element exists is not enough
      either. At that point the rest of the page is still laying out: images
      resolve, fonts swap, and sections below the fold gain height. Scrolling
      once, then, lands the reader hundreds of pixels short of where the
      heading ends up — which is exactly what the hero's goal milestones did
      before this loop existed.

      So: find the element, scroll to it, then keep re-measuring until its
      position stops moving, and stop early the moment the reader takes over.
    */
    const TOLERANCE = 2;
    const MAX_FRAMES = 90; // ~1.5s at 60fps, then give up rather than fight.
    let frames = 0;
    let frame = 0;
    let settled = 0;
    let aimed = false;
    let userScrolled = false;
    let lastDocumentTop: number | null = null;

    const onUserScroll = () => {
      userScrolled = true;
    };
    // `wheel` and `touchstart` rather than `scroll`, because our own
    // `scrollTo` fires `scroll` and would cancel the loop immediately.
    window.addEventListener('wheel', onUserScroll, { passive: true, once: true });
    window.addEventListener('touchstart', onUserScroll, { passive: true, once: true });
    window.addEventListener('keydown', onUserScroll, { once: true });

    const focusTarget = (target: HTMLElement) => {
      // Focus without stealing it visually: the element gets a temporary
      // tabindex so it can receive focus, which is removed again on blur.
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
        target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
      }
      target.focus({ preventScroll: true });
    };

    const tick = () => {
      frames += 1;
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));

      if (target && !userScrolled) {
        /*
          The signal to re-aim is the TARGET moving, not the scroll being
          short of it. Measuring the gap to the target instead would re-aim
          on every frame of the first smooth scroll — which cancels that
          scroll and restarts it, forever.

          `documentTop` is the target's absolute position in the document, so
          it only changes when the layout above it actually shifts.
        */
        const documentTop = target.getBoundingClientRect().top + window.scrollY;

        if (lastDocumentTop === null || Math.abs(documentTop - lastDocumentTop) > TOLERANCE) {
          /*
            First sight, or the page grew above the target. Aim again — the
            opening pass animates, later corrections jump, because a second
            animation chasing a moving target reads as a glitch.

            `'instant'` rather than `'auto'`: `auto` defers to the CSS
            `scroll-behavior`, which is `smooth` document-wide.
          */
          window.scrollTo({ top: documentTop - headerOffset(), behavior: aimed ? 'instant' : behavior });
          aimed = true;
          lastDocumentTop = documentTop;
          settled = 0;
        } else {
          settled += 1;
          // Steady for several frames running — the layout has stopped moving.
          if (settled >= 5) {
            focusTarget(target);
            return;
          }
        }
      }

      if (!userScrolled && frames < MAX_FRAMES) {
        frame = window.requestAnimationFrame(tick);
      } else if (target) {
        focusTarget(target);
      }
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('wheel', onUserScroll);
      window.removeEventListener('touchstart', onUserScroll);
      window.removeEventListener('keydown', onUserScroll);
    };
  }, [pathname, hash, prefersReducedMotion]);

  return null;
}
