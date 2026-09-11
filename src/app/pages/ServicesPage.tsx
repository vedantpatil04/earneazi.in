import { motion } from 'framer-motion';
import { PageShell } from '@/components/layout/PageShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { CtaBand } from '@/components/sections/shared/CtaBand';
import { Reveal, RevealGroup } from '@/components/motion/Reveal';
import { riseVariants, settleVariants } from '@/lib/motion/variants';
import { servicePillars } from '@/data/services';
import type { ServicePillar } from '@/types/content';

/**
 * Three services, each given a full editorial section rather than a card in
 * a row of three.
 *
 * The homepage presents these as a disclosure list, where the job is to let
 * someone scan all three and open the one that sounds like them. Here the
 * job is different — they have already decided to read about services — so
 * each one gets room to answer the four questions people actually arrive
 * with: what it is, who it's for, why it matters, and what to do next.
 *
 * Sections carry the service id as an anchor, because `/services#insurance`
 * is linked from the homepage hero and the footer. ScrollManager handles the
 * offset for the sticky header; `scroll-mt` covers the native anchor path.
 */
export default function ServicesPage() {
  return (
    <PageShell title="Our services">
      <PageHeader
        title="Three services, planned as one."
        lead="Most people arrive needing one of these. What they usually leave with is a view of how all three fit together."
      >
        {/* Jump links rather than a tab strip: the content below is all
            rendered, so these move you to it instead of hiding two thirds
            of the page behind a control. */}
        <nav aria-label="Services on this page">
          <ul className="grid grid-cols-1 border-t border-divider sm:grid-cols-3">
            {servicePillars.map((service) => (
              <li key={service.id} className="border-b border-divider sm:border-b-0 sm:border-r sm:last:border-r-0">
                <a
                  href={`#${service.id}`}
                  className="group flex min-h-[4.5rem] items-center gap-3 py-5 pr-4 transition-colors motion-safe:duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:px-6 sm:first:pl-0"
                >
                  <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-divider bg-surface-2 text-ink-muted transition-colors motion-safe:duration-200 group-hover:border-border group-hover:text-accent">
                    <Icon icon={service.icon} size={19} />
                  </span>
                  <span className="font-display text-body-lg text-ink-secondary transition-colors motion-safe:duration-200 group-hover:text-ink">
                    {service.title}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      {servicePillars.map((service, index) => (
        <ServiceSection key={service.id} service={service} background={index % 2 === 0 ? 'surface' : 'bg'} />
      ))}

      <CtaBand
        id="services-cta"
        title="Not sure which of these you need?"
        body="That's a normal place to start. Tell us what you're working toward and we'll tell you which parts of this actually apply to you."
        primary={{ label: 'Book a consultation', to: '/contact' }}
        secondary={{ label: 'Start from your goals instead', to: '/financial-goals' }}
      />
    </PageShell>
  );
}

function ServiceSection({ service, background }: { service: ServicePillar; background: 'bg' | 'surface' }) {
  const headingId = `${service.id}-heading`;

  return (
    <Section
      id={service.id}
      spacing="lg"
      background={background}
      className="scroll-mt-24 md:scroll-mt-28"
      aria-labelledby={headingId}
    >
      <Container size="wide">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal variants={riseVariants} className="lg:col-span-5">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-md border border-brass/35 bg-brass/[0.08] text-brass">
              <Icon icon={service.icon} size={26} />
            </span>

            <h2 id={headingId} className="mt-6 text-h2 font-display-sharp">
              {service.title}
            </h2>

            <p className="mt-5 max-w-measure text-lead text-ink-secondary">{service.summary}</p>

            <Button to={service.nextStep.to} size="lg" className="mt-8">
              {service.nextStep.label}
            </Button>
          </Reveal>

          <RevealGroup as="dl" stagger={0.09} className="border-t border-divider lg:col-span-7">
            <motion.div variants={settleVariants} className="border-b border-divider py-7">
              <dt className="font-body text-label font-semibold text-ink">Who it&rsquo;s for</dt>
              <dd className="mt-2.5 max-w-prose text-body text-ink-secondary">{service.whoItsFor}</dd>
            </motion.div>

            <motion.div variants={settleVariants} className="border-b border-divider py-7">
              <dt className="font-body text-label font-semibold text-ink">Why it matters</dt>
              <dd className="mt-2.5 max-w-prose text-body text-ink-secondary">{service.whyItMatters}</dd>
            </motion.div>

            <motion.div variants={settleVariants} className="py-7">
              <dt className="font-body text-label font-semibold text-ink">What it covers</dt>
              <dd className="mt-3">
                <ul className="flex flex-col gap-2.5">
                  {service.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3 text-body text-ink-secondary">
                      <span aria-hidden="true" className="mt-[0.6rem] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brass" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </dd>
            </motion.div>
          </RevealGroup>
        </div>
      </Container>
    </Section>
  );
}
