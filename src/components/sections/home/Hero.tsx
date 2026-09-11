import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { EditorialImage } from '@/components/ui/EditorialImage';
import { Reveal, RevealGroup } from '@/components/motion/Reveal';
import { clipRevealVariants, staggerItemVariants } from '@/lib/motion/variants';
import { heroImage } from '@/data/media';
import { servicePillars } from '@/data/services';

/**
 * The page's single orchestrated moment. Headline, supporting line, calls
 * to action and the service row arrive in sequence on load; the photograph
 * opens out of an inset crop a beat behind them.
 *
 * Every other section waits to be scrolled to. Keeping the unprompted
 * motion in one place is what stops the page reading as a run of identical
 * entrance animations.
 */
export function Hero() {
  return (
    <Section as="div" spacing="lg" className="pt-10 md:pt-16" aria-label="Introduction">
      <Container size="wide">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <RevealGroup immediate stagger={0.11} className="lg:col-span-7">
            <motion.h1 variants={staggerItemVariants} className="text-display font-display-wonk">
              One advisor for every money decision that matters.
            </motion.h1>

            <motion.p variants={staggerItemVariants} className="mt-6 max-w-measure text-lead text-ink-secondary">
              Mutual funds and PMS, insurance and loans, planned together rather than bought separately &mdash; around
              the goals you&rsquo;re actually working toward.
            </motion.p>

            <motion.div
              variants={staggerItemVariants}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <Button to="/financial-goals" size="lg">
                Start with your goals
                <Icon icon={ArrowRight} size={18} />
              </Button>
              <Button to="/contact" variant="outline" size="lg">
                Book a consultation
              </Button>
            </motion.div>

            {/* The three product lines, stated once, high up. Navigation
                rather than decoration: it tells a first-time visitor what
                the firm actually does before they scroll. */}
            <motion.div variants={staggerItemVariants} className="mt-12">
              <span aria-hidden="true" className="block h-px w-full rule-fade" />
              <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                {servicePillars.map((service) => (
                  <li key={service.id}>
                    <Link
                      to={service.href}
                      className="group inline-flex items-center gap-2 text-small text-ink-secondary transition-colors motion-safe:duration-200 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                      <span
                        aria-hidden="true"
                        className="h-1 w-1 rounded-full bg-brass transition-transform motion-safe:duration-200 ease-signature group-hover:scale-150"
                      />
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </RevealGroup>

          <div className="lg:col-span-5">
            <Reveal variants={clipRevealVariants} immediate delay={0.28} speed="cinematic">
              <div className="relative">
                {/* Offset brass plate — a printed page sitting under a
                    photograph, which is the visual idea of the whole page:
                    paper first, screen second.

                    No negative z-index here: this span and the image below
                    it are both positioned, so paint order follows DOM order.
                    A `-z-10` would drop the plate behind the Section's own
                    background (the Section isn't a stacking context) and it
                    would never be seen. */}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-5 -right-5 h-full w-full rounded-lg border border-brass/40 bg-brass/[0.12] sm:-bottom-6 sm:-right-6"
                />
                <EditorialImage
                  asset={heroImage}
                  loading="eager"
                  aspectClassName="aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/5]"
                  objectPositionClassName="object-[50%_35%]"
                  className="shadow-lg"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
