import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/motion/Reveal';
import { riseVariants, transitions, withMotionSafety } from '@/lib/motion/variants';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { servicePillars } from '@/data/services';
import { cn } from '@/lib/utils/cn';

/**
 * Three services, presented as a disclosure list rather than three
 * side-by-side cards.
 *
 * The reasoning is about the reader, not the layout: someone who doesn't
 * work in finance needs to see the three options at a glance first, then
 * open the one that sounds like them. Three columns of detail asks them to
 * read everything to find out which part applies.
 *
 * These are parallel offerings, not a sequence, so there are no 01/02/03
 * markers here — the numbers on this page belong to "How it works", which
 * genuinely is a sequence. The disclosure state is what marks which one is
 * open, and it moves in response to a click rather than on scroll.
 */
export function ServicesShowcase() {
  const [openId, setOpenId] = useState<string | null>(servicePillars[0].id);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <Section spacing="lg" aria-labelledby="services-heading">
      <Container size="wide">
        <SectionHeading
          id="services-heading"
          title="Three things we do, coordinated by one person."
          lead="Most people arrive needing one of these and leave having sorted out how all three fit together."
          action={
            <Link
              to="/services"
              className="group inline-flex items-center gap-1.5 text-body font-medium text-accent transition-colors motion-safe:duration-200 hover:text-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              All services
              <Icon
                icon={ArrowUpRight}
                size={17}
                className="transition-transform motion-safe:duration-200 ease-signature group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          }
        />

        <Reveal variants={riseVariants} className="mt-12 lg:mt-16">
          <ul className="border-t border-divider">
            {servicePillars.map((service) => {
              const isOpen = service.id === openId;
              const panelId = `service-panel-${service.id}`;
              const buttonId = `service-trigger-${service.id}`;

              return (
                <li key={service.id} className="border-b border-divider">
                  <h3>
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenId(isOpen ? null : service.id)}
                      className={cn(
                        'group flex w-full items-center gap-4 py-6 text-left transition-colors motion-safe:duration-200',
                        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                        'md:gap-6 md:py-8'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md border transition-colors motion-safe:duration-200 md:h-14 md:w-14',
                          isOpen
                            ? 'border-brass/45 bg-brass/10 text-brass'
                            : 'border-divider bg-surface-2 text-ink-muted group-hover:border-border group-hover:text-accent'
                        )}
                      >
                        <Icon icon={service.icon} size={24} />
                      </span>

                      <span
                        className={cn(
                          'flex-1 font-display text-h3 transition-colors motion-safe:duration-200',
                          isOpen ? 'text-ink' : 'text-ink-secondary group-hover:text-ink'
                        )}
                      >
                        {service.title}
                      </span>

                      <span
                        aria-hidden="true"
                        className={cn(
                          'inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border transition-colors motion-safe:duration-200',
                          isOpen ? 'border-brass/45 text-brass' : 'border-divider text-ink-muted group-hover:border-border group-hover:text-ink'
                        )}
                      >
                        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                      </span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key={panelId}
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={withMotionSafety(prefersReducedMotion, transitions.base)}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 gap-8 pb-8 md:grid-cols-12 md:gap-10 md:pb-10 md:pl-20">
                          <p className="max-w-prose text-body-lg text-ink-secondary md:col-span-6">
                            {service.summary}
                          </p>

                          <div className="md:col-span-6">
                            <ul className="flex flex-col gap-3">
                              {service.highlights.map((highlight) => (
                                <li key={highlight} className="flex items-start gap-3 text-body text-ink-secondary">
                                  <span
                                    aria-hidden="true"
                                    className="mt-[0.6rem] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brass"
                                  />
                                  {highlight}
                                </li>
                              ))}
                            </ul>

                            <Link
                              to={service.href}
                              className="group mt-6 inline-flex items-center gap-1.5 text-body font-medium text-accent transition-colors motion-safe:duration-200 hover:text-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                            >
                              More on {service.shortTitle.toLowerCase()}
                              <Icon
                                icon={ArrowUpRight}
                                size={17}
                                className="transition-transform motion-safe:duration-200 ease-signature group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                              />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
