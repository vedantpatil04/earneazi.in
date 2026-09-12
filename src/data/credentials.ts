import type { Credential } from '@/types/content';

/**
 * ─────────────────────────────────────────────────────────────────────────
 * THE CREDENTIAL LEDGER — CLIENT CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────
 *
 * §24 replaces the old site's badge strip with a ledger: full-width rows,
 * each one a single verified fact with the identifier that evidences it.
 * The rule that matters is the one at the end of that paragraph — "each row
 * is either verified and shown, or absent. There is no 'coming soon' state
 * for a credential."
 *
 * So every row below ships `verified: false` and nothing renders. The
 * section disappears entirely rather than showing four greyed-out badges,
 * because a pending credential displayed as pending still reads, at a
 * glance, as a credential.
 *
 * ── What must never go in here ──────────────────────────────────────────
 *
 * The old site carried "SEBI Compliant", "500+ Happy Clients", "₹50Cr+ AUM
 * Managed", "20+ Bank Partners" and "12%+ Avg Returns". §3.4 rules the
 * first out permanently — it is not a meaningful status for a mutual fund
 * distributor and is misleading — and §24 forbids the rest on this section
 * outright: client counts, AUM, average returns and satisfaction figures.
 * A credential here is a registration, an arrangement or a fact about the
 * business that a document can prove. It is never a number about outcomes.
 *
 * ── TO GO LIVE ──────────────────────────────────────────────────────────
 *
 * Fill `identifier` with the real value, set `verified: true`, and delete
 * any row the business does not actually hold. The ledger appears on its
 * own. Do not invent a registration number to see the layout — that is a
 * fabricated regulatory claim on a financial-services site, which is the
 * single worst thing this codebase could ship.
 */
export const credentials: Credential[] = [
  {
    id: 'amfi-arn',
    label: 'AMFI-registered mutual fund distributor',
    /* The ARN is the strongest, safest thing this business can display —
       §3.4 notes it is worth more than any statistic on the old site. */
    identifierLabel: 'ARN',
    identifier: null,
    detail: 'Registered to distribute mutual fund schemes.',
    verified: false,
  },
  {
    id: 'dsa',
    label: 'Direct Selling Agent arrangements',
    identifierLabel: 'Institutions',
    identifier: null,
    detail: 'Loan sourcing arrangements with named lending institutions.',
    verified: false,
  },
  {
    id: 'place-of-business',
    label: 'Registered place of business',
    identifierLabel: 'Address',
    identifier: null,
    detail: 'A real office you can visit, by appointment.',
    verified: false,
  },
  {
    id: 'operating-since',
    label: 'Operating since',
    identifierLabel: 'Year',
    identifier: null,
    detail: 'The year the business was established.',
    verified: false,
  },
];

/** The only list the UI is allowed to read. Everything else stays out of the DOM. */
export const verifiedCredentials: Credential[] = credentials.filter(
  (credential) => credential.verified && credential.identifier !== null
);
