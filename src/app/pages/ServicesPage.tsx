import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, Check } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Link } from '@/components/ui/Link';
import { ConversationCta } from '@/components/conversion/ConversationCta';
import { serviceConversation } from '@/lib/contact/conversation';
import { IconTile } from '@/components/ui/IconTile';
import { CtaBand } from '@/components/sections/shared/CtaBand';
import { Reveal, RevealGroup } from '@/components/motion/Reveal';
import { riseVariants, settleVariants } from '@/lib/motion/variants';
import { servicePillars } from '@/data/services';
import { ServiceProducts } from '@/components/sections/shared/ServiceProducts';
import { FundShortlist } from '@/components/sections/shared/FundShortlist';
import { PartnerEcosystem } from '@/components/sections/shared/PartnerEcosystem';
import type { ServicePillar } from '@/types/content';

/**
 * Three services, each given a full editorial section rather than a card in
 * a row of three.
 *
 * The homepage presents these as a pinned premise, where the job is to let
 * someone scan all three and settle on the one that sounds like them. Here
 * the job is different — they have already decided to read about services —
 * so each one gets room to answer the four questions people actually arrive
 * with: what it is, who it's for, why it matters, and what to do next.
 *
 * Sections carry the service id as an anchor — `/services#mutual-funds` and
 * `/services#loans` are linked from the homepage, the ribbon and the footer.
 * Insurance is the exception: its own entry point is the dedicated `/insurance`
 * page, so this section is reached by scrolling or by the jump nav below, and
 * links out to the fuller page in turn. ScrollManager handles the offset for
 * the sticky header; `scroll-mt` covers the native anchor path.
 *
 * ── Enhancement A ────────────────────────────────────────────────────────
 *
 * The page now speaks the same visual language as the homepage section: each
 * service wears its own accent through the tone channel (blue, teal,
 * violet), the jump links are raised tiles with the service's lit glyph,
 * and the four answers sit on one raised panel rather than as loose rules.
 *
 * ── Enhancement B ────────────────────────────────────────────────────────
 *
 * Each service now ends with its products — three for mutual funds,
 * eight each for insurance and loans — in an explorer that explains what each
 * one is, who it suits and how Earneazi helps, with a WhatsApp conversation
 * that names the product. Mutual funds add the fund shortlist (names and
 * categories, confirmed facts only); loans reserve the partner row, which
 * renders only verified institutions and is empty today.
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
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {servicePillars.map((service) => (
              <li key={service.id} data-tone={service.id}>
                <a
                  href={`#${service.id}`}
                  className="raised group flex min-h-[4.5rem] items-center gap-3.5 rounded-surface border border-divider bg-surface px-4 py-3 transition-colors duration-instant ease-out hover:border-tone/50"
                >
                  <IconTile icon={service.icon} fill="tone-solid" size="md" />
                  <span className="min-w-0 flex-1 font-display text-title-sm text-ink-display">{service.title}</span>
                  <ArrowDown
                    size={16}
                    aria-hidden="true"
                    className="shrink-0 text-tone transition-transform duration-instant ease-out motion-safe:group-hover:translate-y-0.5"
                  />
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
  const labelClass = 'font-display text-legal font-semibold uppercase tracking-[0.12em] text-tone';

  return (
    <Section
      id={service.id}
      spacing="lg"
      background={background}
      className="scroll-mt-24 md:scroll-mt-28"
      aria-labelledby={headingId}
    >
      <Container size="wide">
        <div data-tone={service.id} className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal variants={riseVariants} className="lg:col-span-5">
            <IconTile icon={service.icon} fill="tone-solid" size="lg" active />

            <h2 id={headingId} className="mt-6 text-display-md text-ink-display">
              {service.title}
            </h2>

            <p className="mt-5 max-w-measure text-body-lg text-ink-secondary">{service.summary}</p>

            {/* A next step that is a conversation goes through the shared
                conversation control, so the WhatsApp draft names the service —
                the same rule the homepage service panels follow. */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              {service.nextStep.to === '/contact' ? (
                <ConversationCta context={serviceConversation(service.id)} size="lg" showChannelIcon>
                  {service.nextStep.label}
                </ConversationCta>
              ) : (
                <Button to={service.nextStep.to} size="lg" trailingIcon={<ArrowRight size={17} aria-hidden="true" />}>
                  {service.nextStep.label}
                </Button>
              )}
              {service.id === 'insurance' && (
                <Link to="/insurance" variant="standalone" trailingIcon={<ArrowRight size={15} aria-hidden="true" />}>
                  See all 8 types of cover
                </Link>
              )}
            </div>
          </Reveal>

          <RevealGroup
            as="dl"
            stagger={0.09}
            className="raised overflow-hidden rounded-band border border-divider bg-surface lg:col-span-7"
          >
            <span aria-hidden="true" className="block h-1 bg-tone-fill" />

            <motion.div variants={settleVariants} className="border-b border-divider p-6 sm:p-7">
              <dt className={labelClass}>Who it&rsquo;s for</dt>
              <dd className="mt-2.5 max-w-prose text-body text-ink-secondary">{service.whoItsFor}</dd>
            </motion.div>

            <motion.div variants={settleVariants} className="border-b border-divider p-6 sm:p-7">
              <dt className={labelClass}>Why it matters</dt>
              <dd className="mt-2.5 max-w-prose text-body text-ink-secondary">{service.whyItMatters}</dd>
            </motion.div>

            <motion.div variants={settleVariants} className="p-6 sm:p-7">
              <dt className={labelClass}>What it covers</dt>
              <dd className="mt-3">
                <ul className="flex flex-col gap-3">
                  {service.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3 text-body text-ink-secondary">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-pill bg-tone-tint text-tone"
                      >
                        <Check size={12} strokeWidth={2.5} />
                      </span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </dd>
            </motion.div>
          </RevealGroup>
        </div>

        <ServiceProducts service={service} />
        {service.id === 'mutual-funds' && <FundShortlist />}
        {service.id === 'loans' && <PartnerEcosystem />}
      </Container>
    </Section>
  );
}
