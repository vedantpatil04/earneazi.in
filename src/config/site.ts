/**
 * ─────────────────────────────────────────────────────────────────────────
 * SITE CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────
 * Non-visual, owner- and host-dependent settings. Business *facts* — phone,
 * address, hours, credentials — do not live here; they live in
 * src/data/contact.ts behind a `verified` flag, so nothing unconfirmed can
 * reach the UI (Phase 0 §32).
 */

export const site = {
  /** Used to build the per-route document title. */
  name: 'Earneazi',

  /**
   * Document language. `en-IN` rather than `en` so screen readers use
   * Indian English pronunciation and number reading (Phase 0 §29).
   */
  locale: 'en-IN',

  /**
   * Locale used for currency and number formatting. Kept beside `locale`
   * so the two cannot drift; the SIP calculator's formatter reads it.
   */
  numberLocale: 'en-IN',

  /**
   * Base path the app is served from.
   *
   * Phase 0 §31 lists "domain root vs subdirectory" as unresolved with the
   * host, and it sets Vite's `base` plus every asset path. Reading it from
   * the build environment (VITE_BASE_PATH) keeps the routing configurable
   * without guessing: BrowserRouter takes its basename from the same value
   * at runtime via import.meta.env.BASE_URL.
   *
   * Default '/' — correct for a domain root, which is the expected case.
   */
  basePath: import.meta.env.BASE_URL || '/',

  /**
   * Routing strategy. BrowserRouter is the Phase 0 §31 recommendation and
   * requires the host to rewrite unknown paths to index.html.
   *
   * HashRouter is the documented fallback for a host that cannot be
   * configured to do that. It is NOT selected here: the GoDaddy plan type
   * is unconfirmed, and §31 is explicit that the choice must be a decision
   * rather than a convenience. Switching later changes every deep-link
   * format, so it is recorded as an open item rather than pre-empted.
   */
  router: 'browser' as const,
} as const;

export type Site = typeof site;
