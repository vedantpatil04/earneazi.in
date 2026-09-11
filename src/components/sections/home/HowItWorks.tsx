import { motion } from 'framer-motion';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Icon } from '@/components/ui/Icon';
import { Reveal, RevealGroup } from '@/components/motion/Reveal';
import { lineDrawVariants, lineDrawVerticalVariants, staggerItemVariants } from '@/lib/motion/variants';
import { journeySteps } from '@/data/journey';

/**
 * The one section on the page that carries numbers, because it is the one
 * section whose content is genuinely a sequence. The step numbers are set
 * in JetBrains Mono — that face is reserved for figures and technical
 * captions here, not used as generic labelling.
 *
 * The connector rule draws itself once as the section arrives, which is
 * the motion doing something useful: it says "these are in order" before
 * you've read a word. It runs horizontally on wide screens and vertically
 * on narrow ones, following the layout rather than being hidden on mobile.
 */
export function HowItWorks() {
  return (
    <Section spacing="lg" aria-labelledby="how-it-works-heading">
      <Container size="wide">
        <SectionHeading
          id="how-it-works-heading"
          title="How it works"
          lead="From the first conversation to a plan you keep coming back to."
        />

        <div className="relative mt-12 lg:mt-20">
          {/* Desktop: one horizontal rule threaded behind the step markers. */}
          <Reveal
            variants={lineDrawVariants}
            speed="cinematic"
            delay={0.15}
            className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px origin-left bg-divider lg:block"
          />
          {/* Mobile/tablet: the same idea, turned on its side. */}
          <Reveal
            variants={lineDrawVerticalVariants}
            speed="cinematic"
            delay={0.15}
            className="pointer-events-none absolute bottom-10 left-7 top-7 w-px origin-top bg-divider lg:hidden"
          />

          <RevealGroup
            as="ol"
            stagger={0.13}
            className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
          >
            {journeySteps.map((step, index) => (
              <motion.li key={step.id} variants={staggerItemVariants} className="flex gap-5 lg:flex-col lg:gap-6">
                <span className="relative z-10 inline-flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-divider bg-bg text-accent shadow-sm">
                  <Icon icon={step.icon} size={22} />
                </span>

                <div className="pt-1 lg:pt-0">
                  <span className="font-mono text-marker font-medium text-brass font-numeric">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-2 text-h3 text-ink">{step.title}</h3>
                  <p className="mt-2.5 max-w-measure text-body text-ink-secondary lg:text-small">{step.description}</p>
                </div>
              </motion.li>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </Section>
  );
}
