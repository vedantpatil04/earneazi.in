export type ThemeMode = 'light' | 'dark';
export type ThemePreference = ThemeMode | 'system';

export interface ThemeContextValue {
  /** The resolved theme actually applied to <html data-theme>. 'system' is always resolved to light/dark here. */
  mode: ThemeMode;
  /** What the user has chosen — 'system' until they explicitly pick light or dark. */
  preference: ThemePreference;
  /** Explicitly set light or dark, overriding system preference, and persist it. */
  setTheme: (mode: ThemeMode) => void;
  /** Flip between light and dark from the current resolved mode. Used by ThemeToggle. */
  toggleTheme: () => void;
}
