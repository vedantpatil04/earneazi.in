import { motion } from 'framer-motion';
import { PageShell } from '@/components/layout/PageShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Icon } from '@/components/ui/Icon';
import { CtaBand } from '@/components/sections/shared/CtaBand';
import { RevealGroup } from '@/components/motion/Reveal';
import { settleVariants } from '@/lib/motion/variants';
import { aboutPrinciples, aboutSummary } from '@/data/about';
import { teamMembers } from '@/data/team';
import { journeySteps } from '@/data/journey';

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

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
 * Founder names and roles are confirmed. Photography and bios are not, and
 * a stock portrait standing in for a named real person would be a false
 * representation of an actual employee — a harder line than "temporary
 * imagery is fine". The monogram is the design, not a gap: set `photoUrl`
 * and `photoVerified` in src/data/team.ts when real photography arrives.
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
                <span className="mt-1 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-surface text-brass">
                  <Icon icon={principle.icon} size={19} />
                </span>
                <div>
                  <dt className="font-display text-h3 text-ink">{principle.title}</dt>
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
                <span className="font-mono text-body-lg font-medium font-numeric text-brass" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>
                  <h3 className="text-h3 text-ink">{step.title}</h3>
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

          <RevealGroup
            as="ul"
            stagger={0.12}
            className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-divider bg-divider sm:grid-cols-2 lg:mt-16"
          >
            {teamMembers.map((member) => (
              <motion.li key={member.id} variants={settleVariants} className="flex items-center gap-6 bg-bg p-8 sm:p-10">
                <span
                  aria-hidden="true"
                  className="inline-flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-md border border-brass/30 bg-brass/[0.08] font-display text-[1.75rem] font-medium text-brass"
                >
                  {initials(member.name)}
                </span>
                <div>
                  <p className="font-display text-h3 text-ink">{member.name}</p>
                  <p className="mt-1 text-body text-ink-secondary">{member.role}</p>
                </div>
              </motion.li>
            ))}
          </RevealGroup>
        </Container>
      </Section>

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
