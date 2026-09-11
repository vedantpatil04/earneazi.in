import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Announces client-side navigation — Phase 0 §29.
 *
 * A full page load tells a screen reader the document changed. A client-side
 * route change does not: the URL updates, the DOM swaps, and nothing is
 * said. Without this, someone using a screen reader follows a link and is
 * left on what sounds like the same page.
 *
 * The message is the new document title, which `PageShell` has already set
 * for the route. It is published into a polite live region after a frame,
 * so the region is in the DOM and idle before its content changes —
 * changing text in a live region that has only just mounted is unreliably
 * announced.
 *
 * The first render is skipped: the initial page load announces itself.
 */
export function RouteAnnouncer() {
  const { pathname } = useLocation();
  const [message, setMessage] = useState('');
  const isFirstRoute = useRef(true);

  useEffect(() => {
    if (isFirstRoute.current) {
      isFirstRoute.current = false;
      return;
    }

    // Two frames: one for the new route to mount and set document.title,
    // one for the live region to pick the change up.
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setMessage(document.title));
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}
