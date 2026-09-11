import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ThemeContextValue, ThemeMode, ThemePreference } from '@/types/theme';

const STORAGE_KEY = 'earneazi-theme-preference';

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemMode(): ThemeMode {
  if (typeof window === 'undefined' || !('matchMedia' in window)) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : 'system';
}

/**
 * Owns theme state for the app. Pairs with the inline script in index.html,
 * which sets `data-theme` on <html> before first paint so there's no flash
 * of the wrong theme (Phase 0 Blueprint, Section I) — this provider keeps
 * that attribute correct afterwards as the user toggles or their OS
 * preference changes.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>(readStoredPreference);
  const [systemMode, setSystemMode] = useState<ThemeMode>(getSystemMode);

  const mode: ThemeMode = preference === 'system' ? systemMode : preference;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  // Track OS-level changes, but only act on them while the user hasn't
  // explicitly overridden the theme.
  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (event: MediaQueryListEvent) => setSystemMode(event.matches ? 'dark' : 'light');
    mediaQueryList.addEventListener('change', listener);
    return () => mediaQueryList.removeEventListener('change', listener);
  }, []);

  const setTheme = (nextMode: ThemeMode) => {
    setPreference(nextMode);
    window.localStorage.setItem(STORAGE_KEY, nextMode);
  };

  const toggleTheme = () => setTheme(mode === 'dark' ? 'light' : 'dark');

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, preference, setTheme, toggleTheme }),
    [mode, preference]
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
