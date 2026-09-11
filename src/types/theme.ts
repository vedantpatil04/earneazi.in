export type ThemeMode = 'light' | 'dark';
export type ThemePreference = ThemeMode | 'system';

export interface ThemeContextValue {
  /** The resolved theme actually applied to <html data-theme>. 'system' is always resolved to light/dark here. */
  mode: ThemeMode;
  /** What the user has chosen — 'system' until they explicitly pick light or dark. */
  preference: ThemePreference;
  /**
   * Set the preference. Accepts 'system', which hands control back to the OS
   * and clears the stored override — the three-state control needs this, and
   * without it a user who toggles once can never get back to following their
   * device.
   */
  setPreference: (preference: ThemePreference) => void;
  /** Flip between light and dark from the current resolved mode. Used by the two-state nav toggle. */
  toggleTheme: () => void;
  /** LEGACY alias for `setPreference`, kept for call sites written before Phase 1. */
  setTheme: (mode: ThemeMode) => void;
}
