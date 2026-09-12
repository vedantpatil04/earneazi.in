import { motion } from 'framer-motion';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { RevealGroup } from '@/components/motion/Reveal';
import { verifiedCredentials } from '@/data/credentials';
import type { Credential } from '@/types/content';

/**
 * The credential ledger — §24.
 *
 * ── It renders nothing today, and that is the feature ───────────────────
 *
 * §24 is unambiguous: "each row is either verified and shown, or absent.
 * There is no 'coming soon' state for a credential." Every row in
 * data/credentials.ts ships unverified, so this returns `null` and the
 * section does not exist in the DOM.
 *
 * That is deliberately different from rendering four greyed-out rows with
 * "pending" against them. A pending credential displayed as pending still
 * reads, at a glance, as a credential — which is exactly the impression the
 * old site's badge strip created and the audit ruled out. The honest version
 * of "we cannot evidence this yet" is silence.
 *
 * The moment the client supplies an ARN, this appears with no code change.
 *
 * ── Why a ledger and not badges ─────────────────────────────────────────
 *
 * Because a ledger reads as accounting and a badge reads as advertising. The
 * layout is §14's `L3 Ledger`: full-width rows with hard left/right polarity,
 * the claim on the left and the identifier that evidences it on the right, on
 * the ink band. The identifier is the whole point — a row without one is not
 * shown, however true it is.
 *
 * ── Motion ──────────────────────────────────────────────────────────────
 *
 * One orchestrated moment: the rows wipe in on a 40ms stagger as a single
 * gesture (§24), which is the reference's stat-band device restyled. Not one
 * animation per row deciding for itself when to start.
 */
export function CredentialLedger() {
  if (verifiedCredentials.length === 0) return null;

  return (
    <Section
      spacing="chapter"
      background="band"
      slab
      aria-labelledby="credentials-heading"
      className="relative z-10"
    >
      <Container size="shell">
        <Eyebrow tone="band">What we can evidence</Eyebrow>

        <h2 id="credentials-heading" className="mt-4 max-w-[20ch] text-display-lg text-on-band">
          Registrations, not badges.
        </h2>
        <p className="mt-4 max-w-measure text-body-lg text-on-band-muted">
          Each line below is a fact with a number behind it. Anything we can&rsquo;t evidence isn&rsquo;t here.
        </p>

        <RevealGroup as="dl" stagger={0.04} className="mt-12 border-t border-on-band/20 lg:mt-16">
          {verifiedCredentials.map((credential) => (
            <LedgerRow key={credential.id} credential={credential} />
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}

/** One row: the claim hard left, the evidence hard right, at the same weight. */
function LedgerRow({ credential }: { credential: Credential }) {
  return (
    <motion.div
      variants={{
        /* A wipe rather than a fade-up: the row arrives as a band being
           revealed, which is what makes the set read as one gesture. */
        hidden: { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
        visible: { opacity: 1, clipPath: 'inset(0 0% 0 0)' },
      }}
      className="grid grid-cols-1 gap-x-8 gap-y-2 border-b border-on-band/20 py-7 md:grid-cols-12 md:items-baseline"
    >
      <dt className="md:col-span-7">
        <span className="block text-title-lg font-semibold text-on-band">{credential.label}</span>
        <span className="mt-1.5 block max-w-measure text-body-sm text-on-band-muted">{credential.detail}</span>
      </dt>
      <dd className="md:col-span-5 md:text-right">
        <span className="block font-display text-legal font-semibold uppercase tracking-[0.12em] text-on-band-muted">
          {credential.identifierLabel}
        </span>
        <span className="mt-1 block font-display text-title-lg font-semibold tabular text-band-brand">
          {credential.identifier}
        </span>
      </dd>
    </motion.div>
  );
}
