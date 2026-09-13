import type { Credential } from '@/types/content';

/**
 * ─────────────────────────────────────────────────────────────────────────
 * THE CREDENTIAL REGISTER — CLIENT CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Two surfaces read this register, under two different gates:
 *
 *   the ledger (§24)       full-width rows, each a verified fact WITH the
 *                          identifier that evidences it. A row without an
 *                          identifier is not shown, however true it is —
 *                          "there is no 'coming soon' state for a credential".
 *   the header line        "✓ AMFI Registered · DSA Licensed", compact and
 *                          secondary to the navigation. It states the status
 *                          only, so it needs the status to be verified and a
 *                          short label — not an identifier it never displays.
 *
 * ── What is verified ────────────────────────────────────────────────────
 *
 * AMFI registration and DSA status were confirmed by the business in the
 * Enhancement B brief, which asked for the header line and, in the same
 * breath, for no ARN or registration number to be invented. So both rows are
 * `verified: true` with `identifier: null`: the header line renders, and the
 * ledger stays hidden until the real ARN and the named institutions are
 * supplied. Place of business and operating year remain unconfirmed.
 *
 * ── What must never go in here ──────────────────────────────────────────
 *
 * The old site carried "SEBI Compliant", "500+ Happy Clients", "₹50Cr+ AUM
 * Managed", "20+ Bank Partners" and "12%+ Avg Returns". §3.4 rules the
 * first out permanently — it is not a meaningful status for a mutual fund
 * distributor and is misleading — and §24 forbids the rest outright: client
 * counts, AUM, average returns and satisfaction figures. A credential here is
 * a registration, an arrangement or a fact about the business that a
 * document can prove. It is never a number about outcomes.
 *
 * ── TO COMPLETE ─────────────────────────────────────────────────────────
 *
 * Fill `identifier` with the real ARN and the named lending institutions and
 * the ledger appears on its own. Do not invent a registration number to see
 * the layout — that is a fabricated regulatory claim on a financial-services
 * site, which is the single worst thing this codebase could ship.
 */
export const credentials: Credential[] = [
  {
    id: 'amfi-arn',
    label: 'AMFI-registered mutual fund distributor',
    shortLabel: 'AMFI Registered',
    /* The ARN is the strongest, safest thing this business can display —
       §3.4 notes it is worth more than any statistic on the old site. Not
       yet supplied, so the ledger row stays hidden. */
    identifierLabel: 'ARN',
    identifier: null,
    detail: 'Registered to distribute mutual fund schemes.',
    verified: true,
  },
  {
    id: 'dsa',
    label: 'Direct Selling Agent arrangements',
    shortLabel: 'DSA Licensed',
    identifierLabel: 'Institutions',
    identifier: null,
    detail: 'Loan sourcing arrangements with named lending institutions.',
    verified: true,
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

/** The ledger's list: verified AND evidenced. Everything else stays out of the ledger's DOM. */
export const verifiedCredentials: Credential[] = credentials.filter(
  (credential) => credential.verified && credential.identifier !== null
);

/**
 * The header's credential line — Enhancement A, gated for Enhancement B.
 *
 * Only the two registrations a visitor checks first, always in this order,
 * each only when its status is verified and it has a short label. A row
 * without a short label is left out rather than squeezed in under its full
 * claim. The identifier is not required here because the line never shows
 * one; it is required by the ledger, which does.
 */
export const HEADER_CREDENTIAL_IDS = ['amfi-arn', 'dsa'] as const;

export function headerCredentials(register: Credential[] = credentials): Credential[] {
  return HEADER_CREDENTIAL_IDS.flatMap((id) => {
    const credential = register.find((row) => row.id === id);
    if (!credential || !credential.verified) return [];
    if (!credential.shortLabel || credential.shortLabel.trim().length === 0) return [];
    return [credential];
  });
}
