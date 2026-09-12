import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { RevealGroup } from '@/components/motion/Reveal';
import { settleVariants } from '@/lib/motion/variants';
import { testimonials } from '@/data/testimonials';

/**
 * Testimonials — present as a capability, absent as content.
 *
 * ── Why this renders nothing ────────────────────────────────────────────
 *
 * data/testimonials.ts is empty, and §24 requires written consent per person
 * before a quote appears at all. The old site carried named testimonials with
 * rupee amounts and return figures against them; §3.4 rules those out
 * permanently, and re-using them would need fresh consent *and* every figure
 * stripped.
 *
 * So this component exists, is wired up, and returns `null`. That is the
 * whole intent: the section is supported so that approved content can be
 * dropped in without a design decision being made under time pressure — and
 * it is empty so that nothing invented fills the layout in the meantime. A
 * plausible-sounding quote from a plausible-sounding person in a plausible
 * nearby city is the easiest fabrication on a site like this to write and the
 * hardest to notice.
 *
 * ── What it will render ─────────────────────────────────────────────────
 *
 * Name, city, quote. There is no field for an amount, a return or a holding
 * period, so a testimonial cannot acquire one later without a type change
 * that a reviewer would see.
 *
 * ── TO GO LIVE ──────────────────────────────────────────────────────────
 *
 * Add entries to data/testimonials.ts with `consentVerified: true`, once
 * written consent is on file for each named person and every figure has been
 * removed from the quote.
 */
export function Testimonials() {
  const approved = testimonials.filter((testimonial) => testimonial.consentVerified);
  if (approved.length === 0) return null;

  return (
    <Section spacing="lg" background="sunken" aria-labelledby="testimonials-heading">
      <Container size="content">
        <Eyebrow>In their words</Eyebrow>
        <h2 id="testimonials-heading" className="mt-4 max-w-[22ch] text-display-lg text-ink-display">
          What working with us has been like.
        </h2>

        <RevealGroup
          as="ul"
          stagger={0.08}
          className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:mt-14 lg:grid-cols-3"
        >
          {approved.map((testimonial) => (
            <motion.li
              key={testimonial.id}
              variants={settleVariants}
              className="flex h-full flex-col rounded-band border border-divider bg-surface p-6"
            >
              <Quote size={20} strokeWidth={1.75} aria-hidden="true" className="shrink-0 text-brand-ink" />

              <blockquote className="mt-4 flex-1">
                <p className="text-body text-ink">{testimonial.quote}</p>
              </blockquote>

              <div className="mt-5 border-t border-divider pt-4">
                <cite className="block not-italic text-body-sm font-semibold text-ink-display">{testimonial.name}</cite>
                <span className="mt-0.5 block text-legal text-ink-muted">{testimonial.city}</span>
              </div>
            </motion.li>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
