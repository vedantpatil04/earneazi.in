import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Link } from '@/components/ui/Link';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { serviceMarks } from './ServiceVisuals';

interface ServiceCard {
  id: 'mutual-funds' | 'insurance' | 'loans';
  category: string;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
}

const serviceCards: ServiceCard[] = [
  {
    id: 'mutual-funds',
    category: 'Investing',
    title: 'Mutual Funds',
    description: 'Portfolios built around your timeline, not trending funds.',
    href: '/services#mutual-funds',
    actionLabel: 'Explore investing',
  },
  {
    id: 'insurance',
    category: 'Protection',
    title: 'Insurance',
    description: 'Coverage sized to protect what you cannot afford to lose.',
    href: '/insurance',
    actionLabel: 'Explore insurance',
  },
  {
    id: 'loans',
    category: 'Financing',
    title: 'Personal & Business Loans',
    description: 'Structured borrowing that leaves room for everything else.',
    href: '/services#loans',
    actionLabel: 'Explore loans',
  },
];

export function ServicesShowcase() {
  return (
    <Section
      id="services"
      spacing="lg"
      background="sunken"
      slab
      className="relative z-10"
      aria-labelledby="services-heading"
    >
      <Container size="content">
        {/* Section Header */}
        <div className="max-w-2xl">
          <Eyebrow>Three core services</Eyebrow>
          <h2 id="services-heading" className="mt-3 text-display-lg text-ink-display">
            Three things we do, coordinated by one person.
          </h2>
          <p className="mt-3 text-body-lg text-ink-secondary">
            Everything you need to grow, protect, and finance your future.
          </p>
        </div>

        {/* Static 3-Card Grid: Desktop 3-col, Tablet 2-col, Mobile 1-col */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {serviceCards.map((card) => {
            const Mark = serviceMarks[card.id];

            return (
              <article
                key={card.id}
                data-tone={card.id}
                aria-labelledby={`service-card-${card.id}-title`}
                className="group relative flex flex-col rounded-2xl border border-divider bg-surface p-5 sm:p-6 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-tone/40 hover:shadow-md"
              >
                {/* 1. Dominant visual area */}
                <div className="relative h-44 sm:h-48 w-full overflow-hidden rounded-xl bg-tone-tint/25 border border-divider/40">
                  <div className="h-full w-full transition-transform duration-200 ease-out group-hover:scale-[1.02]">
                    {Mark && <Mark active className="h-full w-full" />}
                  </div>
                </div>

                {/* 2. Small uppercase category label */}
                <span className="mt-5 font-display text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-tone">
                  {card.category}
                </span>

                {/* 3. Short headline */}
                <h3
                  id={`service-card-${card.id}-title`}
                  className="mt-1.5 font-display text-display-xs text-ink-display leading-snug group-hover:text-tone transition-colors duration-200"
                >
                  {card.title}
                </h3>

                {/* 4. One short supporting sentence */}
                <p className="mt-2 text-body-sm text-ink-secondary leading-relaxed flex-1">
                  {card.description}
                </p>

                {/* 5. Small action / link */}
                <div className="mt-5 pt-4 border-t border-divider/50">
                  <Link
                    to={card.href}
                    variant="standalone"
                    trailingIcon={
                      <ArrowRight
                        size={14}
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    }
                    className="after:absolute after:inset-0 text-body-sm font-semibold text-tone hover:text-tone"
                  >
                    {card.actionLabel}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Section Footer: All services link */}
        <div className="mt-8 sm:mt-10">
          <Link
            to="/services"
            variant="standalone"
            trailingIcon={<ArrowRight size={15} aria-hidden="true" />}
          >
            All services in detail
          </Link>
        </div>
      </Container>
    </Section>
  );
}
