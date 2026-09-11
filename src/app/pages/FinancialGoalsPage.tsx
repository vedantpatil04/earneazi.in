import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Icon } from '@/components/ui/Icon';
import { CtaBand } from '@/components/sections/shared/CtaBand';
import { Reveal } from '@/components/motion/Reveal';
import { riseVariants } from '@/lib/motion/variants';
import { goalEntries, getServiceById } from '@/data/services';
import type { GoalEntry } from '@/types/content';

/**
 * Guided discovery, not a planning engine.
 *
 * Every goal is on the page — the grid at the top is a way in rather than a
 * filter, so nothing is hidden behind a click and the whole page is
 * searchable and linkable. Picking one jumps to its section.
 *
 * Each section answers the same three things in the same order: what the
 * goal actually means, the questions we'd work through, and which services
 * it touches. Nothing here states an outcome — the considerations are
 * framing questions, which is honest content that needs no verified figures
 * behind it.
 */
export default function FinancialGoalsPage() {
  return (
    <PageShell title="Financial goals">
      <PageHeader
        title="Start from what you’re trying to do."
        lead="Not from a product. Pick whichever of these sounds most like your situation — most people find two or three apply at once."
      >
        <nav aria-label="Goals on this page">
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {goalEntries.map((goal) => (
              <li key={goal.id}>
                <a
                  href={`#${goal.id}`}
                  className="group flex min-h-[4rem] items-center gap-3 rounded-md border border-divider px-4 py-3 transition-colors motion-safe:duration-200 hover:border-accent/45 hover:bg-accent/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm bg-surface-2 text-ink-muted transition-colors motion-safe:duration-200 group-hover:bg-accent group-hover:text-on-accent">
                    <Icon icon={goal.icon} size={18} />
                  </span>
                  <span className="font-display text-body-lg text-ink">{goal.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <Section spacing="md">
        <Container size="wide">
          <div className="border-t border-divider">
            {goalEntries.map((goal) => (
              <GoalSection key={goal.id} goal={goal} />
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand
        id="goals-cta"
        title="None of these quite fit?"
        body="Plenty of plans don't start from a tidy category. Tell us what's actually on your mind and we'll work out where it belongs."
        primary={{ label: 'Book a consultation', to: '/contact' }}
        secondary={{ label: 'See the services behind these', to: '/services' }}
      />
    </PageShell>
  );
}

function GoalSection({ goal }: { goal: GoalEntry }) {
  const headingId = `${goal.id}-heading`;

  return (
    <Reveal variants={riseVariants}>
      <section
        id={goal.id}
        aria-labelledby={headingId}
        className="scroll-mt-24 border-b border-divider py-12 md:scroll-mt-28 md:py-16"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md border border-accent/30 bg-accent/[0.07] text-accent">
                <Icon icon={goal.icon} size={22} />
              </span>
              <h2 id={headingId} className="text-h2 font-display-sharp">
                {goal.title}
              </h2>
            </div>
            <p className="mt-5 max-w-measure text-lead text-ink-secondary">{goal.description}</p>
          </div>

          <div className="lg:col-span-7">
            <p className="font-body text-label font-semibold text-ink">What we&rsquo;d work through</p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {goal.considerations.map((consideration) => (
                <li key={consideration} className="flex items-start gap-3 text-body text-ink-secondary">
                  <span aria-hidden="true" className="mt-[0.6rem] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brass" />
                  {consideration}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-small text-ink-muted">Usually involves</span>
              {goal.relatedServiceIds.map((serviceId) => {
                const service = getServiceById(serviceId);
                if (!service) return null;

                return (
                  <Link
                    key={serviceId}
                    to={service.href}
                    className="inline-flex items-center rounded-full border border-divider px-3 py-1 text-small text-ink transition-colors motion-safe:duration-200 hover:border-brass hover:text-brass focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                  >
                    {service.shortTitle}
                  </Link>
                );
              })}
            </div>

            <Link
              to="/contact"
              className="group mt-6 inline-flex items-center gap-2 text-body font-medium text-accent transition-colors motion-safe:duration-200 hover:text-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              Talk through this goal
              <Icon
                icon={ArrowRight}
                size={18}
                className="transition-transform motion-safe:duration-200 ease-signature group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
