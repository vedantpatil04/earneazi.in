import { motion } from 'framer-motion';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal, RevealGroup } from '@/components/motion/Reveal';
import { lineDrawVariants, lineDrawVerticalVariants, staggerItemVariants } from '@/lib/motion/variants';
import { journeySteps } from '@/data/journey';

/**
 * How it works — the one section on the page that carries step numbers,
 * because it is the one section whose content is genuinely a sequence.
 *
 * The connector rule draws itself once as the section arrives, which is the
 * motion doing something useful: it says "these are in order" before you
 * have read a word. It runs horizontally on wide screens and vertically on
 * narrow ones, following the layout rather than being hidden on mobile.
 *
 * It is also the page's spine laid flat — the same thread the header, the
 * hero's curve and both pinned rails use, here doing the one job the device
 * was borrowed from in the first place.
 *
 * What changed: the step markers were set in `font-mono text-marker
 * text-brass font-numeric` — three legacy aliases stacked on a retired gold
 * accent. They are now the display face with tabular figures and the brand
 * token, which is what all three of those aliases already resolved to.
 */
export function HowItWorks() {
  return (
    <Section spacing="lg" aria-labelledby="how-it-works-heading">
      <Container size="content">
        <Eyebrow>The process</Eyebrow>

        <SectionHeader
          id="how-it-works-heading"
          className="mt-4"
          title="How it works"
          intro="From the first conversation to a plan you keep coming back to."
        />

        <div className="relative mt-12 lg:mt-20">
          {/* Desktop: one horizontal rule threaded behind the step markers. */}
          <Reveal
            variants={lineDrawVariants}
            speed="story"
            delay={0.15}
            className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px origin-left bg-spine lg:block"
          />
          {/* Narrow screens: the same idea, turned on its side. */}
          <Reveal
            variants={lineDrawVerticalVariants}
            speed="story"
            delay={0.15}
            className="pointer-events-none absolute bottom-10 left-7 top-7 w-px origin-top bg-spine lg:hidden"
          />

          <RevealGroup
            as="ol"
            stagger={0.13}
            className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
          >
            {journeySteps.map((step, index) => {
              const Glyph = step.icon;
              return (
                <motion.li key={step.id} variants={staggerItemVariants} className="flex gap-5 lg:flex-col lg:gap-6">
                  {/* Sits on the rule, so it needs the page's own ground
                      rather than a transparent background. */}
                  <span className="relative z-10 inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-pill border border-divider bg-bg text-brand-ink shadow-xs">
                    <Glyph size={22} strokeWidth={1.5} aria-hidden="true" />
                  </span>

                  <div className="min-w-0 pt-1 lg:pt-0">
                    <span className="font-display text-body-sm font-semibold tabular text-brand-ink">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-2 text-display-xs text-ink-display">{step.title}</h3>
                    <p className="mt-2.5 max-w-measure text-body-sm text-ink-secondary">{step.description}</p>
                  </div>
                </motion.li>
              );
            })}
          </RevealGroup>
        </div>
      </Container>
    </Section>
  );
}
