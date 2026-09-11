import { motion } from 'framer-motion';
import { Compass, ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import { processSteps } from '@/data/home';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { withMotionSafety, transitions } from '@/lib/motion/variants';

export function HowItWorksSection() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <Section spacing="lg" background="bg">
      <Container size="wide">
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-label font-semibold uppercase tracking-wider text-accent">
            <Compass size={14} aria-hidden="true" />
            <span>The Advisory Journey</span>
          </div>
          <h2 className="mt-3 font-display text-h2 text-ink">
            Four simple steps from uncertainty to total clarity.
          </h2>
          <p className="mt-4 text-body text-ink-secondary leading-relaxed">
            We remove the paperwork hurdles, conflicting jargon, and aggressive sales pitches.
            Here is what working with Earneazi looks like.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={withMotionSafety(prefersReducedMotion, {
                ...transitions.base,
                delay: idx * 0.08,
              })}
            >
              <Card
                elevation="flat"
                className="relative flex h-full flex-col justify-between border border-border bg-surface p-6 transition-all hover:border-accent"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-h2 font-bold text-accent/30">
                      {step.number}
                    </span>
                    {idx < processSteps.length - 1 && (
                      <ArrowRight size={16} className="hidden lg:block text-ink-muted/40" aria-hidden="true" />
                    )}
                  </div>

                  <h3 className="mt-4 font-display text-body font-semibold text-ink">
                    {step.title}
                  </h3>

                  <p className="mt-2.5 text-small text-ink-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-divider">
                  <span className="inline-block rounded-full bg-surface-2 px-2.5 py-1 text-label font-medium text-accent">
                    {step.highlight}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
