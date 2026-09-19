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
     * The official logo wordmark.
     */
    wordmark: 'Earneazi',

    /**
     * The official logo assets are rendered directly by the Logo component.
     */
    vectorAsset: null as null | (() => JSX.Element),

    /**
     * Trailing dot is retired with adoption of the official logo artwork.
     */
    hasDot: false,

    /** Accessible name wherever the logo links home. */
    homeLabel: 'Earneazi',

    /**
     * Minimum rendered width of the primary lockup, in pixels.
     */
    minPrimaryWidth: 112,
  },

  /**
   * One-line statement of what the business does. Descriptive only — it
   * makes no claim that needs verifying.
   */
  tagline: 'Mutual funds, insurance and loans, planned around your goals.',
} as const;

export type Brand = typeof brand;
