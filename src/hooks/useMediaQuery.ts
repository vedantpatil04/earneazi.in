import { useEffect, useState } from 'react';

/**
 * Subscribes to a CSS media query and returns whether it currently matches.
 * Falls back to `false` outside a browser environment.
 */
export function useMediaQuery(query: string): boolean {
  const getSnapshot = () =>
    typeof window !== 'undefined' && 'matchMedia' in window ? window.matchMedia(query).matches : false;

  const [matches, setMatches] = useState(getSnapshot);

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;

    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

    setMatches(mediaQueryList.matches);
    mediaQueryList.addEventListener('change', listener);
    return () => mediaQueryList.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
