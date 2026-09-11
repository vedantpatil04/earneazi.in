import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ThemeContextValue, ThemeMode, ThemePreference } from '@/types/theme';

/**
 * Theme state — Phase 0 §12.
 *
 * Three behaviours this owns, all of which the audit calls out explicitly:
 *
 *   1. System preference is the default, a user choice overrides it, and
 *      the override persists. 'system' is a real, selectable state, not
 *      just the absence of a choice — otherwise a user who toggles once can
 *      never hand control back to their device.
 *
 *   2. No flash on first paint. The inline script in index.html sets
 *      `data-theme` before React exists; this provider takes over
 *      afterwards and keeps it correct.
 *
 *   3. No rainbow sweep on switch. Every surface on the page has a colour
 *      transition, so flipping the theme would otherwise show each element
 *      easing at its own rate across the viewport. For one frame during the
 *      switch, `data-theme-switching` on <html> suppresses all transitions
 *      (see globals.css), and the new theme lands at once.
 *
 * It also keeps `<meta name="theme-color">` in step, so the browser chrome
 * on iOS and Android matches the page rather than the stale `#0F1713` the
 * previous build shipped.
 */

export const THEME_STORAGE_KEY = 'earneazi-theme-preference';

/** Must match the `--color-bg` value for each theme in tokens.css. */
const THEME_COLOR: Record<ThemeMode, string> = {
  light: '#F6F7F9',
  dark: '#0A1B2E',
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemMode(): ThemeMode {
  if (typeof window === 'undefined' || !('matchMedia' in window)) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  } catch {
    // Private mode, or storage disabled. Following the system is the right
    // fallback — it is the default anyway.
    return 'system';
  }
}

function applyThemeColor(mode: ThemeMode) {
  if (typeof document === 'undefined') return;
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }
  meta.content = THEME_COLOR[mode];
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(readStoredPreference);
  const [systemMode, setSystemMode] = useState<ThemeMode>(getSystemMode);
  const isFirstRun = useRef(true);

  const mode: ThemeMode = preference === 'system' ? systemMode : preference;

  useEffect(() => {
    const root = document.documentElement;

    // The very first application matches what the inline script already
    // painted, so there is nothing to suppress. Suppressing on later
    // changes is what stops the sweep.
    if (isFirstRun.current) {
      isFirstRun.current = false;
      root.setAttribute('data-theme', mode);
      applyThemeColor(mode);
      return;
    }

    root.setAttribute('data-theme-switching', '');
    root.setAttribute('data-theme', mode);
    applyThemeColor(mode);

    // Two frames: one for the browser to apply the new colours with
    // transitions off, the next to allow transitions again.
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => root.removeAttribute('data-theme-switching'));
    });

    return () => window.cancelAnimationFrame(frame);
  }, [mode]);

  // Track OS-level changes. Always listened to — the value is needed the
  // moment the user switches back to 'system'.
  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (event: MediaQueryListEvent) => setSystemMode(event.matches ? 'dark' : 'light');
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    try {
      if (next === 'system') {
        window.localStorage.removeItem(THEME_STORAGE_KEY);
      } else {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      }
    } catch {
      // Storage unavailable — the choice still applies for this session.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setPreference(mode === 'dark' ? 'light' : 'dark');
  }, [mode, setPreference]);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, preference, setPreference, toggleTheme, setTheme: setPreference }),
    [mode, preference, setPreference, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider.');
  }
  return context;
}
