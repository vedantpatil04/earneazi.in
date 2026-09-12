import { Link as RouterLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Link } from '@/components/ui/Link';
import { useStackedCards } from '@/hooks/useStackedCards';
import { goalEntries, getServiceById } from '@/data/services';
import type { GoalEntry } from '@/types/content';
import { cn } from '@/lib/utils/cn';

/**
 * Financial Goals — the same interaction as the services stack, at six.
 *
 * Both told sections now run the model measured from the reference
 * recording (see useStackedCards): cards in normal flow, each `position:
 * sticky` one strip lower than the last, covering each other as the
 * document scrolls. No scale, no crossfade, no scroll-linked transform.
 *
 * Deliberately built as one column rather than the narrative-plus-stage
 * split this section used to have. The stack of labels *is* the rail: by
 * the time you reach the sixth goal, the five you have passed are sitting
 * above it with their names and numbers visible, so the section states its
 * own contents and your position in them without a second control that
 * would only repeat the same information less well.
 *
 * Six is more cards than the reference stacks, so the strip is shorter here
 * than in the services section — 2.75rem against 3.25rem — which keeps five
 * accumulated labels plus a full card inside the viewport at every size the
 * page supports.
 *
 * Content notes kept from the previous build, because they are still true:
 * the six goals are not a ranking and are never presented as one, and
 * nothing in the section states or implies a return, a rate or a result.
 */

/** Height of a covered card's remaining label strip. Must match the strip row. */
const STRIP = '2.75rem';
/** Where the first card pins. */
const STACK_TOP = 'calc(var(--header-height) + 1rem)';

export function GoalsGrid() {
  const total = goalEntries.length;
  const { register, activeIndex, offsetFor, goTo, onKeyDown } = useStackedCards({
    count: total,
    top: STACK_TOP,
    strip: STRIP,
  });

  return (
    <Section id="financial-goals" spacing="lg" background="bg" className="relative pb-0" aria-labelledby="goals-heading">
      <Container size="content">
        <div className="max-w-[34rem]">
          <Eyebrow>Financial goals</Eyebrow>
          <h2 id="goals-heading" className="mt-4 text-display-lg text-ink-display">
            Start from what you’re trying to do.
          </h2>
          <p className="mt-4 max-w-measure text-body-lg text-ink-secondary">
            Pick a goal and you’ll see the questions we’d work through, and which parts of a plan it touches.
          </p>
          <p className="mt-5">
            <Link to="/financial-goals" variant="standalone" trailingIcon={<ArrowRight size={15} aria-hidden="true" />}>
              See all six goals in full
            </Link>
          </p>
        </div>

        <ol className="mt-10 lg:mt-14" onKeyDown={onKeyDown}>
          {goalEntries.map((goal, index) => (
            <li
              key={goal.id}
              ref={register(index)}
              className="sticky"
              style={{ top: offsetFor(index), zIndex: index + 1 }}
            >
              <GoalCard
                goal={goal}
                index={index}
                total={total}
                isActive={activeIndex === index}
                onSelect={() => goTo(index)}
              />
            </li>
          ))}

          {/* Runway — matched by the negative margin on the section that
              follows, which rides up over the stack. See ServicesShowcase. */}
          <li aria-hidden="true" className="h-[78vh]" />
        </ol>
      </Container>
    </Section>
  );
}

interface GoalCardProps {
  goal: GoalEntry;
  index: number;
  total: number;
  isActive: boolean;
  onSelect: () => void;
}

function GoalCard({ goal, index, total, isActive, onSelect }: GoalCardProps) {
  const Glyph = goal.icon;

  return (
    <article
      aria-labelledby={`goal-${goal.id}-title`}
      className={cn(
        /* Opaque: the card above is hidden because this one is painted over
           it, not because it was faded out. */
        'overflow-hidden rounded-band border border-divider bg-surface shadow-lg',
        'transition-[border-color] duration-base ease-out',
        isActive && 'border-brand'
      )}
    >
      <button
        type="button"
        data-stack-label
        onClick={onSelect}
        aria-current={isActive ? 'true' : undefined}
        className={cn(
          'flex h-11 w-full items-center gap-3 px-5 text-left sm:px-6 lg:px-7',
          'transition-colors duration-base ease-out',
          isActive ? 'bg-brand text-on-brand' : 'bg-surface-sunken text-ink hover:bg-hovered'
        )}
      >
        <span className={cn('font-display text-body-sm font-semibold tabular', !isActive && 'text-ink-muted')}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <Glyph size={16} strokeWidth={isActive ? 1.75 : 1.5} aria-hidden="true" className="shrink-0" />
        <span className="truncate font-display text-title-sm font-semibold">{goal.title}</span>
        <span
          className={cn(
            'ms-auto shrink-0 font-display text-legal tabular',
            isActive ? 'text-on-brand/75' : 'text-ink-muted'
          )}
        >
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </button>

      <div className="p-5 sm:p-6 lg:p-7">
        <h3 id={`goal-${goal.id}-title`} className="sr-only">
          {goal.title}
        </h3>

        <p className="max-w-prose text-body text-ink-secondary">{goal.description}</p>

        <h4 className="mt-6 font-display text-legal font-semibold uppercase tracking-[0.12em] text-brand-ink">
          What we’d work through
        </h4>
        <ul className="mt-3 grid gap-2.5 sm:grid-cols-3 sm:gap-5">
          {goal.considerations.map((consideration) => (
            <li key={consideration} className="flex items-start gap-2.5 text-body-sm text-ink-secondary">
              <span aria-hidden="true" className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-pill bg-brand" />
              <span className="leading-snug">{consideration}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-3 border-t border-divider pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-legal text-ink-muted">Usually involves:</span>
            {goal.relatedServiceIds.map((serviceId) => {
              const service = getServiceById(serviceId);
              if (!service) return null;
              return (
                <RouterLink
                  key={serviceId}
                  to={service.href}
                  className={cn(
                    'inline-flex min-h-7 items-center rounded-pill border border-divider bg-surface-sunken px-2.5',
                    'text-legal font-medium text-ink transition-colors duration-instant ease-out',
                    'hover:border-brand hover:bg-brand-subtle hover:text-brand-ink'
                  )}
                >
                  {service.shortTitle}
                </RouterLink>
              );
            })}
          </div>

          <Button to="/contact" size="sm" trailingIcon={<ArrowRight size={14} aria-hidden="true" />} className="shrink-0">
            Talk through this goal
          </Button>
        </div>
      </div>
    </article>
  );
}
