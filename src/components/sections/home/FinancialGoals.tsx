import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Link } from '@/components/ui/Link';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { goalEntries } from '@/data/services';
import { goalDeepLink } from '@/data/hero';
import { ConversationCta } from '@/components/conversion/ConversationCta';
import { generalConversation } from '@/lib/contact/conversation';
import { goalMarks } from './GoalVisuals';

/**
 * Financial goals — the six goals as a static card grid.
 *
 * Visually aligned with the "Three core services" section directly below it
 * (ServicesShowcase.tsx), which is the reference for this section: the same
 * header block, the same card anatomy (visual area → category label → title
 * → one sentence → bordered footer link), the same padding, radius, border,
 * hover and grid gaps. The card class strings below are the Services card's
 * own, copied rather than shared only because ServicesShowcase is not part
 * of this change — keep the two in step, or extract one card component the
 * next time both sections are open.
 *
 * Differences from Services, and why:
 *   - The visual is the goal's own mark from GoalVisuals, in its own tone.
 *   - The category label is the goal's `focus` field (existing content).
 *   - `auto-rows-fr`: six cards run to two rows (three on tablet, six on
 *     mobile), and every row takes the height of the tallest card, so all
 *     six cards share one size rather than only the cards within a row.
 *   - Each card carries the goal's id, so `/#<goal-id>` still lands on it.
 *
 * Each card links to the goal's full brief on /financial-goals, where the
 * considerations and the per-goal conversation live.
 */
export function FinancialGoals() {
  return (
    <Section id="financial-goals" spacing="lg" background="bg" aria-labelledby="goals-heading">
      <Container size="content">
        {/* Section Header — same block as Services */}
        <div className="max-w-2xl">
          <Eyebrow>Financial goals</Eyebrow>
          <h2 id="goals-heading" className="mt-3 text-display-lg text-ink-display">
            Start from what you&rsquo;re trying to do.
          </h2>
          <p className="mt-3 text-body-lg text-ink-secondary">
            Pick a goal and you&rsquo;ll see the questions we&rsquo;d work through, and which parts of a plan it
            touches.
          </p>
        </div>

        {/* Static 6-card grid: Desktop 3-col, Tablet 2-col, Mobile 1-col */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-6 lg:gap-8">
          {goalEntries.map((goal) => {
            const Mark = goalMarks[goal.id];

            return (
              <article
                key={goal.id}
                id={goal.id}
                data-tone={goal.id}
                aria-labelledby={`goal-card-${goal.id}-title`}
                className="group relative flex flex-col rounded-2xl border border-divider bg-surface p-5 sm:p-6 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-tone/40 hover:shadow-md"
              >
                {/* 1. Visual area */}
                <div className="relative h-44 sm:h-48 w-full overflow-hidden rounded-xl bg-tone-tint/25 border border-divider/40">
                  <div className="h-full w-full transition-transform duration-200 ease-out group-hover:scale-[1.02]">
                    {Mark && <Mark className="h-full w-full" />}
                  </div>
                </div>

                {/* 2. Small uppercase category label */}
                <span className="mt-5 font-display text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-tone">
                  {goal.focus}
                </span>

                {/* 3. Goal title */}
                <h3
                  id={`goal-card-${goal.id}-title`}
                  className="mt-1.5 font-display text-display-xs text-ink-display leading-snug group-hover:text-tone transition-colors duration-200"
                >
                  {goal.title}
                </h3>

                {/* 4. One short supporting sentence */}
                <p className="mt-2 text-body-sm text-ink-secondary leading-relaxed flex-1">{goal.description}</p>

                {/* 5. Small action / link */}
                <div className="mt-5 pt-4 border-t border-divider/50">
                  <Link
                    to={goalDeepLink(goal.id)}
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
                    Read this goal in full
                    <span className="sr-only">: {goal.title}</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Section Footer: all goals link — same placement as Services */}
        <div className="mt-8 sm:mt-10">
          <Link to="/financial-goals" variant="standalone" trailingIcon={<ArrowRight size={15} aria-hidden="true" />}>
            See all six goals in full
          </Link>
        </div>

        {/* Retained from the previous build: most common answer people give */}
        <div className="raised mt-10 flex flex-col gap-4 rounded-band border border-divider bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 lg:mt-14 lg:p-7">
          <div className="min-w-0">
            <h3 className="text-display-xs text-ink-display">Not sure which of these fits?</h3>
            <p className="mt-2 max-w-measure text-body-sm text-ink-secondary">
              Most people are working on two or three of them at once, and the answer for one changes the answer
              for the others. That is the conversation worth having first.
            </p>
          </div>
          <ConversationCta context={generalConversation} variant="secondary" size="md" className="shrink-0">
            Talk it through
          </ConversationCta>
        </div>
      </Container>
    </Section>
  );
}
