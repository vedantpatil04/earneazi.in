/**
 * ─────────────────────────────────────────────────────────────────────────
 * BRAND CONFIGURATION — OWNER-DEPENDENT
 * ─────────────────────────────────────────────────────────────────────────
 * Everything the owner controls about how Earneazi presents itself, in one
 * file. No component hard-codes a brand value; they all read from here or
 * from the token layer (src/styles/tokens.css).
 *
 * NOTHING IN THIS FILE IS OFFICIAL YET.
 *
 * Phase 0 §7 requires the approved Earneazi logo as a vector, plus the exact
 * brand blue sampled from that file, before either can be called official.
 * Neither has been supplied. What ships instead is a clearly provisional
 * typographic lockup, isolated here so replacement is a single change:
 *
 *   · to adopt the official logo → set `logo.vectorAsset` to the imported
 *     SVG component and Logo renders it instead of the lockup. Nothing else
 *     changes.
 *   · to adopt the official blue → edit the --brand-* ramp in tokens.css.
 *
 * The wordmark is NOT redrawn as fake vector artwork here. It is set in the
 * site's display face, which is honest about being provisional and avoids
 * committing the owner to a logo nobody approved.
 */

export const brand = {
  /** Legal / display name of the business. */
  name: 'Earneazi',

  logo: {
    /**
     * The wordmark, as text. Set in the display face by the Logo component.
     * PROVISIONAL — pending the approved vector (Phase 0 §7).
     */
    wordmark: 'Earneazi',

    /**
     * Drop the official logo in here once it exists: an imported React SVG
     * component using `currentColor` for the wordmark so one asset serves
     * both themes with no flash on switch (Phase 0 §7).
     *
     * While this is null, Logo renders the provisional lockup.
     */
    vectorAsset: null as null | (() => JSX.Element),

    /**
     * The trailing dot is a genuine asset from the current build and is
     * retained (Phase 0 §6.3). It is the logo's only interactive element:
     * on hover and focus the dot moves, the wordmark never does.
     */
    hasDot: true,

    /** Accessible name wherever the logo links home. */
    homeLabel: 'Earneazi — home',

    /**
     * Minimum rendered width of the primary lockup, in pixels (§7). Below
     * this, use the `compact` lockup instead of scaling the primary one.
     */
    minPrimaryWidth: 112,
  },

  /**
   * One-line statement of what the business does. Descriptive only — it
   * makes no claim that needs verifying.
   */
  tagline: 'Mutual funds and PMS, insurance and loans, planned around your goals.',
} as const;

export type Brand = typeof brand;
