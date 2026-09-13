import type { LendingPartner } from '@/types/content';

/**
 * ─────────────────────────────────────────────────────────────────────────
 * LENDING AND INSURANCE PARTNERS — CLIENT CONFIGURATION (Enhancement B)
 * ─────────────────────────────────────────────────────────────────────────
 *
 * The previous site showed a row of bank logos under its loans. Showing a
 * lender's logo says "we have an arrangement with this institution", which is
 * a claim about the business — and the DSA row in data/credentials.ts, which
 * would name those institutions, has not been supplied. So this list ships
 * empty and the partner row renders nothing.
 *
 * TO GO LIVE, per partner:
 *   · name        the institution's name, exactly as it trades
 *   · logo        the institution's own approved logo file, placed in
 *                 src/assets/partners/ and imported here, with its intrinsic
 *                 width and height; `null` renders a clean text treatment
 *   · verified    true only once the arrangement is confirmed
 *
 * Never redraw, recolour, trace or screenshot a logo to fill this in, and
 * never add an institution to see the layout.
 */
export const lendingPartners: LendingPartner[] = [];

/** The only list the UI reads. */
export const verifiedLendingPartners: LendingPartner[] = lendingPartners.filter((partner) => partner.verified);
