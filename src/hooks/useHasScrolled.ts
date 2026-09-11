import { useEffect, useState } from 'react';

/**
 * True once the page has scrolled past `threshold` pixels. Used by the
 * header to swap between its resting and condensed states.
 *
 * Reads are throttled to one per animation frame — a bare scroll listener
 * that calls setState on every event is the usual cause of janky sticky
 * headers on mobile Safari, where scroll events fire far more often than
 * frames are painted.
 */
export function useHasScrolled(threshold = 8): boolean {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let frame = 0;

    const read = () => {
      frame = 0;
      setHasScrolled(window.scrollY > threshold);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return hasScrolled;
}
