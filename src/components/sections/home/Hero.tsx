import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { RevealGroup } from '@/components/motion/Reveal';
import { staggerItemVariants } from '@/lib/motion/variants';
import { servicePillars } from '@/data/services';

/**
 * The page's single orchestrated moment: the statement arrives first, the
 * three services settle in behind it a beat later. Every other section waits
 * to be scrolled to.
 *
 * There is no photograph here. With the image gone the width had been left
 * to the headline alone, which meant close to half the hero was empty on a
 * desktop screen — the weakest thing on the page. The services now hold that
 * column, which is better than a picture was: it names what the firm does
 * and links to each one, in the place a first-time visitor is already
 * looking.
 *
 * The right column is offset by a full grid column rather than sitting flush
 * against the headline. The gutter is what keeps two blocks of text reading
 * as a composition instead of as two columns of a newspaper.
 */
export function Hero() {
  return (
    <Section as="div" spacing="lg" className="pt-12 md:pt-20" aria-label="Introduction">
      <Container size="wide">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
          <RevealGroup immediate stagger={0.11} className="lg:col-span-6">
            <motion.h1 variants={staggerItemVariants} className="max-w-[15ch] text-display font-display-wonk lg:max-w-none">
              One advisor for every money decision that matters.
            </motion.h1>

            <motion.p variants={staggerItemVariants} className="mt-7 max-w-measure text-lead text-ink-secondary">
              Mutual funds and PMS, insurance and loans, planned together rather than bought separately &mdash; around
              the goals you&rsquo;re actually working toward.
            </motion.p>

            <motion.div
              variants={staggerItemVariants}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <Button to="/financial-goals" size="lg">
                Start with your goals
                <Icon icon={ArrowRight} size={18} />
              </Button>
              <Button to="/contact" variant="outline" size="lg">
                Book a consultation
              </Button>
            </motion.div>
          </RevealGroup>

          {/* The three product lines, stated once and high up. Navigation
              rather than decoration: it tells a first-time visitor what the
              firm actually does before they scroll anywhere. */}
          <RevealGroup
            as="ul"
            immediate
            stagger={0.09}
            delay={0.34}
            className="border-t border-divider lg:col-span-5 lg:col-start-8"
          >
            {servicePillars.map((service) => (
              <motion.li key={service.id} variants={staggerItemVariants} className="border-b border-divider">
                <Link
                  to={service.href}
                  className="group block py-5 transition-colors motion-safe:duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  <span className="flex items-baseline justify-between gap-4">
                    <span className="inline-flex items-baseline gap-3">
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 flex-shrink-0 translate-y-[-0.25rem] rounded-full bg-brass transition-transform motion-safe:duration-200 ease-signature group-hover:scale-150"
                      />
                      <span className="font-display text-h3 text-ink-secondary transition-colors motion-safe:duration-200 group-hover:text-ink">
                        {service.title}
                      </span>
                    </span>
                    <Icon
                      icon={ArrowUpRight}
                      size={17}
                      className="flex-shrink-0 translate-y-1 text-ink-muted transition-transform motion-safe:duration-200 ease-signature group-hover:-translate-y-0 group-hover:translate-x-0.5 group-hover:text-brass"
                    />
                  </span>
                  <span className="mt-2 block pl-[1.125rem] text-small text-ink-muted transition-colors motion-safe:duration-200 group-hover:text-ink-secondary">
                    {service.tagline}
                  </span>
                </Link>
              </motion.li>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </Section>
  );
}
