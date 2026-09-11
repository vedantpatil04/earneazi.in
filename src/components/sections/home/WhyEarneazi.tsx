import { motion } from 'framer-motion';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Icon } from '@/components/ui/Icon';
import { RevealGroup } from '@/components/motion/Reveal';
import { settleVariants } from '@/lib/motion/variants';
import { trustPoints } from '@/data/trust';

/**
 * The quietest section on the page, deliberately: opacity-only reveals, no
 * cards, no hover flourishes. This content is meant to read as settled fact
 * about how the firm works, and giving it the same animated treatment as
 * everything else would undercut that.
 *
 * It is also the section most likely to attract invented statistics — a
 * client count, an AUM figure, years in business. None of those are
 * verified, so none of them are here, and the TrustPoint type has no field
 * one could be dropped into.
 */
export function WhyEarneazi() {
  return (
    <Section spacing="lg" background="surface-2" aria-labelledby="why-heading">
      <Container size="wide">
        <SectionHeading
          id="why-heading"
          title="What working with us actually looks like."
          lead="No jargon, no product of the month, and no handing you to a different desk every time something changes."
        />

        <RevealGroup
          as="dl"
          stagger={0.09}
          className="mt-12 grid grid-cols-1 gap-x-12 border-t border-divider sm:grid-cols-2 lg:mt-16"
        >
          {trustPoints.map((point) => (
            <motion.div
              key={point.id}
              variants={settleVariants}
              className="flex gap-5 border-b border-divider py-8"
            >
              <span className="mt-1 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-surface text-brass">
                <Icon icon={point.icon} size={19} />
              </span>
              <div>
                <dt className="font-display text-h3 text-ink">{point.title}</dt>
                <dd className="mt-2.5 max-w-measure text-body text-ink-secondary">{point.description}</dd>
              </div>
            </motion.div>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
