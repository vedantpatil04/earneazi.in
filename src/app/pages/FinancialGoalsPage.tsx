import { ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { IconTile } from '@/components/ui/IconTile';
import { CtaBand } from '@/components/sections/shared/CtaBand';
import { ConversationCta } from '@/components/conversion/ConversationCta';
import { goalConversation } from '@/lib/contact/conversation';
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
 *
 * ── Enhancement A ────────────────────────────────────────────────────────
 *
 * Each goal wears the accent it wears on the homepage — "Protect family"
 * the teal of Insurance, "Buy a home" the violet of Loans — through the tone
 * channel, so the colour of a goal means the same thing on both pages. The
 * way in is a grid of raised tiles with each goal's lit glyph; each section
 * carries the same lit tile, its questions set against the brand's sphere in
 * the goal's accent, and the services it touches as raised chips. The
 * content is unchanged.
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
              <li key={goal.id} data-tone={goal.id}>
                <a
                  href={`#${goal.id}`}
                  className="raised group flex min-h-[4rem] items-center gap-3.5 rounded-surface border border-divider bg-surface px-4 py-3 transition-colors duration-instant ease-out hover:border-tone/50"
                >
                  <IconTile icon={goal.icon} fill="tone-solid" size="sm" />
                  <span className="min-w-0 flex-1 font-display text-title-sm text-ink-display">{goal.title}</span>
                  <ArrowDown
                    size={16}
                    aria-hidden="true"
                    className="shrink-0 text-tone transition-transform duration-instant ease-out motion-safe:group-hover:translate-y-0.5"
                  />
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
        data-tone={goal.id}
        aria-labelledby={headingId}
        className="scroll-mt-24 border-b border-divider py-12 md:scroll-mt-28 md:py-16"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4">
              <IconTile icon={goal.icon} fill="tone-solid" size="md" active />
              <h2 id={headingId} className="text-display-md text-ink-display">
                {goal.title}
              </h2>
            </div>
            <p className="mt-5 max-w-measure text-body-lg text-ink-secondary">{goal.description}</p>
          </div>

          <div className="lg:col-span-7">
            <p className="font-display text-legal font-semibold uppercase tracking-[0.12em] text-tone">
              What we&rsquo;d work through
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {goal.considerations.map((consideration) => (
                <li key={consideration} className="flex items-start gap-3 text-body text-ink-secondary">
                  <span aria-hidden="true" className="sphere sphere-tone mt-[0.5em] h-2 w-2 shrink-0 rounded-pill" />
                  {consideration}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-body-sm text-ink-muted">Usually involves</span>
              {goal.relatedServiceIds.map((serviceId) => {
                const service = getServiceById(serviceId);
                if (!service) return null;

                return (
                  <Link
                    key={serviceId}
                    to={service.href}
                    className="raised inline-flex min-h-11 items-center rounded-pill border border-divider bg-surface px-4 text-body-sm font-semibold text-ink transition-colors duration-instant ease-out hover:border-tone hover:text-tone"
                  >
                    {service.shortTitle}
                  </Link>
                );
              })}
            </div>

            {/* The same control, and the same goal-named WhatsApp draft, as
                the goal brief on the homepage — this used to go to the contact
                page without saying which goal it came from. */}
            <div className="mt-7">
              <ConversationCta context={goalConversation(goal.id)} variant="secondary" size="md" showChannelIcon>
                Talk through this goal
              </ConversationCta>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
