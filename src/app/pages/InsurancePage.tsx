import { motion } from 'framer-motion';
import { PageShell } from '@/components/layout/PageShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { IconTile } from '@/components/ui/IconTile';
import { ConversationCta } from '@/components/conversion/ConversationCta';
import { CtaBand } from '@/components/sections/shared/CtaBand';
import { RevealGroup } from '@/components/motion/Reveal';
import { staggerItemVariants } from '@/lib/motion/variants';
import { serviceConversation } from '@/lib/contact/conversation';
import { getServiceById } from '@/data/services';
import type { ServiceProduct } from '@/types/content';

/**
 * The dedicated Insurance experience (`/insurance`).
 *
 * `/services` still gives Insurance its full editorial section — who it's
 * for, why it matters, the tab explorer over the same eight products — as
 * one of the three core services. This page exists alongside it rather than
 * instead of it: it is the deep, single-subject page that the homepage
 * overview, the ribbon, the footer and the "Protect family" goal all point
 * to when someone wants the fuller picture, laid out as a category grid
 * rather than an explorer.
 *
 * The eight cards and their copy are `getServiceById('insurance').products`
 * — the same data `/services` reads — so there is exactly one place that
 * describes what Earneazi arranges, and nothing here restates a number,
 * discount or return figure that data file doesn't already claim.
 *
 * No eyebrow above the heading: `PageHeader` deliberately has no slot for
 * one (see its own comment — a retired templated tell), so the "complete
 * protection" framing lives in the lead sentence instead of a decorative
 * label. Everything else — the tone-tinted icon tiles, the card shell, the
 * WhatsApp conversation flow — is reused as-is from elsewhere on the site.
 */
export default function InsurancePage() {
  const insurance = getServiceById('insurance');
  const categories = insurance?.products ?? [];

  return (
    <PageShell
      title="Insurance"
      description="Health, life, motor, home, travel and business insurance — compared across insurers and explained in plain language."
    >
      <PageHeader
        title="Insurance for every stage of life"
        lead="Complete protection, arranged one policy at a time: health, life, motor, home, travel and business cover, sized to protect what you can’t afford to lose and explained in plain language rather than policy fine print."
      />

      <Section spacing="lg" background="surface">
        <Container size="content">
          <RevealGroup
            as="ul"
            stagger={0.06}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
          >
            {categories.map((product) => (
              <InsuranceCategoryCard key={product.id} product={product} />
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <CtaBand
        id="insurance-cta"
        title="Ready to get covered?"
        body="Tell us which of these applies to you and we’ll help you compare options across insurers and choose cover that fits your situation."
        primary={{ label: 'Get Insurance Quote', context: serviceConversation('insurance') }}
        secondary={{ label: 'See all services', to: '/services' }}
      />
    </PageShell>
  );
}

function InsuranceCategoryCard({ product }: { product: ServiceProduct }) {
  return (
    <motion.li
      variants={staggerItemVariants}
      data-tone={product.id}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-divider bg-surface transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-tone/40 hover:shadow-md"
    >
      <div className="flex h-24 items-center justify-center bg-tone-tint sm:h-28">
        <IconTile icon={product.icon} fill="tone-solid" size="lg" active />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-display-xs text-ink-display">{product.name}</h3>
        <p className="mt-2 flex-1 text-body-sm leading-relaxed text-ink-secondary">{product.summary}</p>

        <div className="mt-4 border-t border-divider/50 pt-4">
          <ConversationCta
            context={serviceConversation('insurance', product.id)}
            variant="secondary"
            size="sm"
            showChannelIcon
            className="w-full justify-center"
          >
            Ask about this
          </ConversationCta>
        </div>
      </div>
    </motion.li>
  );
}
