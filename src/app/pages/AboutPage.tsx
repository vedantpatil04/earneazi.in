import { motion } from 'framer-motion';
import { PageShell } from '@/components/layout/PageShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { IconTile } from '@/components/ui/IconTile';
import { CtaBand } from '@/components/sections/shared/CtaBand';
import { FounderCards } from '@/components/sections/shared/FounderCards';
import { CredentialLedger } from '@/components/sections/shared/CredentialLedger';
import { RevealGroup } from '@/components/motion/Reveal';
import { settleVariants } from '@/lib/motion/variants';
import { aboutPrinciples, aboutSummary } from '@/data/about';
import { journeySteps } from '@/data/journey';

/**
 * The About page states an approach and names the people behind it. It
 * claims nothing that hasn't been confirmed.
 *
 * That absence is deliberate and worth naming: there are no years in
 * business, no client count, no assets under management, no awards, no
 * registrations and no certifications anywhere on this page, because none of
 * them have been verified. This is the page most likely to attract an
 * invented statistic, so the content types behind it have nowhere to put one.
 *
 * Founder names and roles are confirmed. Photography, tenure, responsibility
 * and bios are not, and none are invented: the shared `FounderCards`
 * component renders each field only when it exists. A stock portrait
 * standing in for a named real person would be a false representation of an
 * actual employee — a harder line than "temporary imagery is fine".
 *
 * The credential ledger below the founders is the same discipline: it
 * renders nothing at all until a credential has an identifier behind it
 * (§24), rather than showing pending badges that still read as credentials.
 */
export default function AboutPage() {
  return (
    <PageShell title="About Earneazi">
      <PageHeader title="Financial advice is a relationship before it’s a product." lead={aboutSummary} />

      <Section spacing="lg" background="surface-2" aria-labelledby="approach-heading">
        <Container size="wide">
          <SectionHeading
            id="approach-heading"
            title="How we work."
            lead="Four things that shape every recommendation we make."
          />

          <RevealGroup
            as="dl"
            stagger={0.09}
            className="mt-12 grid grid-cols-1 gap-x-12 border-t border-divider sm:grid-cols-2 lg:mt-16"
          >
            {aboutPrinciples.map((principle) => (
              <motion.div key={principle.id} variants={settleVariants} className="flex gap-5 border-b border-divider py-8">
                <IconTile icon={principle.icon} fill="brand" size="md" className="mt-0.5" />
                <div className="min-w-0">
                  <dt className="text-display-xs text-ink-display">{principle.title}</dt>
                  <dd className="mt-2.5 max-w-measure text-body text-ink-secondary">{principle.description}</dd>
                </div>
              </motion.div>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section spacing="lg" aria-labelledby="what-happens-heading">
        <Container size="wide">
          <SectionHeading
            id="what-happens-heading"
            title="What working with us involves."
            lead="From a first conversation to a plan you keep coming back to."
          />

          {/* The same four steps appear on the homepage as a wide numbered
              row. Repeating that layout here would make two pages look like
              the same page; the sequence reads as a list when you have
              already chosen to read about the firm, so it is set as one. */}
          <RevealGroup as="ol" stagger={0.1} className="mt-12 max-w-reading border-t border-divider">
            {journeySteps.map((step, index) => (
              <motion.li
                key={step.id}
                variants={settleVariants}
                className="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-divider py-7 sm:grid-cols-[4rem_1fr] sm:gap-x-6"
              >
                <span
                  className="inline-flex h-7 items-center gap-2 font-display text-body-lg font-semibold tabular text-brand-ink"
                  aria-hidden="true"
                >
                  <span className="sphere h-2 w-2 rounded-pill" />
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>
                  <h3 className="text-display-xs text-ink-display">{step.title}</h3>
                  <p className="mt-2 max-w-measure text-body text-ink-secondary">{step.description}</p>
                </span>
              </motion.li>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section spacing="lg" background="surface" aria-labelledby="team-heading">
        <Container size="wide">
          <SectionHeading
            id="team-heading"
            title="The people behind Earneazi."
            lead="Earneazi was founded to make financial planning easier to understand for people who don’t work in finance."
          />

          {/* The same cards as the homepage section, from one component, so
              the two cannot drift into two treatments of the same people —
              and so the duplicated-monogram defect §24 names has one place
              to be wrong rather than two. */}
          <FounderCards className="mt-10 lg:mt-14" />
        </Container>
      </Section>

      <CredentialLedger />

      <CtaBand
        id="about-cta"
        title="The rest is easier said in person."
        body="Tell us where you are now and what you'd like to sort out, and we'll take it from there."
        primary={{ label: 'Book a consultation', to: '/contact' }}
        secondary={{ label: 'See what we do', to: '/services' }}
      />
    </PageShell>
  );
}
