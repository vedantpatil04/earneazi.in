import { motion } from 'framer-motion';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Reveal, RevealGroup } from '@/components/motion/Reveal';
import { growFromBaseVariants, riseVariants, transitions, withMotionSafety } from '@/lib/motion/variants';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/** Twelve equal columns — one per month of a year of equal contributions. Equal on purpose: that regularity is the whole idea of a SIP. */
const CONTRIBUTION_COLUMNS = 12;

/**
 * A teaser, not a calculator.
 *
 * There is no arithmetic in this file and no figures anywhere in it. The
 * illustration shows the *shape* of a SIP — twelve identical monthly
 * contributions, with a rising line above them standing for the passage of
 * time — with no axis, no scale, no currency and no numbers to misread as
 * a projection. The caption says so in as many words.
 *
 * The real calculation belongs to the financial-tools phase and will run
 * through a single shared engine in lib/finance. Nothing here duplicates,
 * approximates or pre-empts it.
 */
export function SipTeaser() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <Section spacing="lg" aria-labelledby="sip-teaser-heading">
      <Container size="wide">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              id="sip-teaser-heading"
              title="Investing a little, every month."
              lead="A SIP is the same amount, invested on the same date, month after month. It’s the least dramatic way to build a portfolio, and it’s how most plans actually get built."
            />

            <Reveal variants={riseVariants} delay={0.1} className="mt-8">
              <Button to="/sip-calculator" size="lg">
                Open the SIP calculator
              </Button>
            </Reveal>
          </div>

          <Reveal variants={riseVariants} delay={0.12} className="lg:col-span-7">
            <figure className="rounded-lg border border-divider bg-surface p-6 shadow-md sm:p-8">
              <div className="relative h-40 sm:h-52">
                <RevealGroup stagger={0.05} delay={0.1} className="absolute inset-0 flex items-end gap-1.5 sm:gap-2">
                  {Array.from({ length: CONTRIBUTION_COLUMNS }, (_, index) => (
                    <motion.span
                      key={index}
                      aria-hidden="true"
                      variants={growFromBaseVariants}
                      className="h-1/2 flex-1 origin-bottom rounded-sm bg-accent/85"
                    />
                  ))}
                </RevealGroup>

                {/* The rising line stands for time passing, nothing more.
                    `vectorEffect` keeps it an even 2px after the viewBox is
                    stretched to the container. */}
                <svg
                  viewBox="0 0 600 200"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full text-brass"
                >
                  <motion.path
                    d="M6,178 C150,158 300,112 450,62 L594,26"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, margin: '-72px 0px' }}
                    transition={{
                      ...withMotionSafety(prefersReducedMotion, transitions.cinematic),
                      delay: prefersReducedMotion ? 0 : 0.5,
                    }}
                  />
                </svg>
              </div>

              <figcaption className="mt-6 border-t border-divider pt-4">
                <span className="font-mono text-marker text-ink-muted">Illustration only &mdash; no figures</span>
                <p className="mt-2 max-w-prose text-small text-ink-secondary">
                  Equal columns for equal monthly contributions. This is a picture of the idea, not a forecast: what a
                  SIP is actually worth later depends on the fund, the amount and the market. The calculator does the
                  arithmetic.
                </p>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
