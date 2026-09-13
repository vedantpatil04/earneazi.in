import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Link } from '@/components/ui/Link';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/motion/Reveal';
import { clipRevealVariants } from '@/lib/motion/variants';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useScrollStory, useStoryFrame } from '@/hooks/useScrollStory';
import type { ScrollStory } from '@/hooks/useScrollStory';
import { goalEntries, getServiceById } from '@/data/services';
import { goalDeepLink } from '@/data/hero';
import { ConversationCta } from '@/components/conversion/ConversationCta';
import { generalConversation, goalConversation } from '@/lib/contact/conversation';
import type { GoalEntry } from '@/types/content';
import { cn } from '@/lib/utils/cn';
import { goalMarks } from './GoalVisuals';
import { StoryHeadings, StoryTrack } from './StoryStage';
import type { StoryItem } from './StoryStage';

/**
 * Financial Goals — the planning interface. Phase 3.
 *
 * ═════════════════════════════════════════════════════════════════════════
 * WHAT THIS SECTION IS FOR
 * ═════════════════════════════════════════════════════════════════════════
 *
 * It is the site's differentiating idea — start from what you are trying to
 * do, not from a product. Each goal is a brief that states, in one place and
 * in this order, the chain a first conversation actually follows.
 *
 *     the goal      →  what it means, in a sentence
 *     context       →  the kind of decision it is, and how far out it sits
 *     where it starts  →  the first thing an advisor would establish
 *     the questions →  what we'd work through, numbered
 *     the services  →  which parts of a plan it touches, linked
 *     the action    →  one way to start
 *
 * Nothing in it states or implies a return, a rate, a timeline in years or a
 * result. `horizon` is deliberately qualitative for exactly that reason —
 * "Years, not months" is framing; "7–10 years" would be advice.
 *
 * ═════════════════════════════════════════════════════════════════════════
 * INTERACTION — one story, read by scrolling
 * ═════════════════════════════════════════════════════════════════════════
 *
 * The same scroll story as Services (hooks/useScrollStory.ts): one goal card
 * in one place, and scrolling moves from 01 through 06 — the next card rising
 * into the same place as the current one recedes, continuously with the
 * scroll. After 06 the section releases into the page.
 *
 *   ≥1024px   the approved two columns: the goal list on the left, pinned
 *             while the story plays, its highlight gliding between rows with
 *             the scroll; the card on the right.
 *
 *   <1024px   the numbered goals stacked vertically above the card, pinned
 *             while the story plays (StoryStage.tsx), the card beneath.
 *
 * The list rows and the headings are buttons: choosing one scrolls to that
 * goal, so the scroll position stays the only state there is.
 *
 * ── Deep linking ────────────────────────────────────────────────────────
 *
 * `?goal=<id>` — written, replacing rather than pushing, when a goal is
 * chosen — is read on arrival and scrolls to that goal, as is the hash form
 * the hero's milestones use (`#buy-a-home`).
 */

const storyItems: StoryItem[] = goalEntries.map((goal) => ({ id: goal.id, title: goal.title, icon: goal.icon }));

/** One list row plus the gap under it, in rem — the highlight's glide is a multiple of it. */
const LIST_PITCH_REM = 3.875;

export function FinancialGoals() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = usePrefersReducedMotion();
  const [searchParams, setSearchParams] = useSearchParams();
  const total = goalEntries.length;
  const story = useScrollStory({
    count: total,
    layout: isDesktop ? 'side' : 'stacked',
    reducedMotion: prefersReducedMotion,
  });
  const { select } = story;

  /* Read once, on arrival. */
  const [arrival] = useState<number | null>(() => {
    const requested =
      searchParams.get('goal') ??
      (typeof window !== 'undefined' ? decodeURIComponent(window.location.hash.slice(1)) : '');
    const index = goalEntries.findIndex((goal) => goal.id === requested);
    return index === -1 ? null : index;
  });

  /* Acted on after the route's own scroll restoration, which would
     otherwise send the page back to the top. */
  useEffect(() => {
    if (arrival === null) return;
    const timer = window.setTimeout(() => select(arrival), 400);
    return () => window.clearTimeout(timer);
  }, [arrival, select]);

  const choose = (index: number) => {
    select(index);
    /* Replace rather than push: choosing six goals should not cost the
       reader six presses of the back button. */
    setSearchParams(
      (current) => {
        const params = new URLSearchParams(current);
        params.set('goal', goalEntries[index].id);
        return params;
      },
      { replace: true }
    );
  };

  const panel = (index: number) => <GoalBrief goal={goalEntries[index]} index={index} total={total} />;

  return (
    <Section id="financial-goals" spacing="lg" background="bg" aria-labelledby="goals-heading">
      <Container size="content">
        <Reveal variants={clipRevealVariants} className="max-w-[36rem]">
          <Eyebrow>Financial goals</Eyebrow>
          <h2 id="goals-heading" className="mt-4 text-display-lg text-ink-display">
            Start from what you&rsquo;re trying to do.
          </h2>
          <p className="mt-4 max-w-measure text-body-lg text-ink-secondary">
            Pick a goal and you&rsquo;ll see the questions we&rsquo;d work through, and which parts of a plan it
            touches.
          </p>
        </Reveal>

        {isDesktop ? (
          <div className="mt-14 grid grid-cols-12 gap-x-10">
            <div className="col-span-4">
              <div className="sticky top-[calc(var(--header-height)_+_2rem)]">
                <GoalList story={story} onChoose={choose} />
                <p className="mt-6">
                  <Link to="/financial-goals" variant="standalone" trailingIcon={<ArrowRight size={15} aria-hidden="true" />}>
                    See all six goals in full
                  </Link>
                </p>
              </div>
            </div>
            <StoryTrack className="col-span-8" story={story} count={total} renderPanel={panel} />
          </div>
        ) : (
          <div className="mt-10">
            <StoryHeadings
              story={story}
              items={storyItems}
              label="Financial goals"
              noun="Goal"
              ground="bg"
              onChoose={choose}
            />
            <StoryTrack story={story} count={total} renderPanel={panel} />
            <p className="mt-6">
              <Link to="/financial-goals" variant="standalone" trailingIcon={<ArrowRight size={15} aria-hidden="true" />}>
                See all six goals in full
              </Link>
            </p>
          </div>
        )}

        {/* Retained from the previous build because it is still the most
            common answer people give: more than one of these applies. */}
        <div className="raised mt-10 flex flex-col gap-4 rounded-band border border-divider bg-surface p-6 sm:flex-row sm:items-center sm:justify-between lg:mt-14 lg:p-7">
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

/* ═══════════════════════════════════════════════════════════════════════
   DESKTOP — the goal list
   ═══════════════════════════════════════════════════════════════════════ */

function GoalList({ story, onChoose }: { story: ScrollStory; onChoose: (index: number) => void }) {
  const highlight = useRef<HTMLSpanElement>(null);
  const active = goalEntries[story.dominant];

  useStoryFrame(story, (frame) => {
    if (!highlight.current) return;
    highlight.current.style.transform = `translate3d(0, ${(frame.marker * LIST_PITCH_REM).toFixed(3)}rem, 0)`;
  });

  return (
    <div role="group" aria-label="Choose a goal" className="relative flex flex-col gap-1.5">
      {/* The selected surface and its marker: one object, gliding between
          rows with the scroll rather than switching from row to row. */}
      <span
        ref={highlight}
        aria-hidden="true"
        data-tone={active.id}
        className="raised pointer-events-none absolute inset-x-0 top-0 h-14 rounded-surface border border-tone/35 bg-tone-tint transition-[background-color,border-color] duration-slow ease-out"
      >
        <span className="absolute inset-y-3 left-0 w-[3px] rounded-pill bg-tone" />
      </span>

      {goalEntries.map((goal, index) => (
        <GoalRow
          key={goal.id}
          goal={goal}
          index={index}
          isActive={index === story.dominant}
          onSelect={() => onChoose(index)}
        />
      ))}

      <p aria-live="polite" className="sr-only">
        {`Goal ${story.dominant + 1} of ${goalEntries.length}: ${active.title}`}
      </p>
    </div>
  );
}

interface GoalRowProps {
  goal: GoalEntry;
  index: number;
  isActive: boolean;
  onSelect: () => void;
}

function GoalRow({ goal, index, isActive, onSelect }: GoalRowProps) {
  const Glyph = goal.icon;

  return (
    <button
      type="button"
      data-tone={goal.id}
      aria-current={isActive ? 'step' : undefined}
      onClick={onSelect}
      className={cn(
        'group relative flex h-14 items-center gap-3 rounded-surface px-4 text-left',
        'transition-colors duration-base ease-out',
        isActive ? 'text-ink-display' : 'text-ink-secondary hover:text-ink'
      )}
    >
      <span
        className={cn(
          'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-action transition-colors duration-base ease-out',
          isActive ? 'lit lit-tone bg-tone-fill text-on-tone' : 'inset-well bg-surface-sunken text-ink-muted group-hover:text-tone'
        )}
      >
        <Glyph size={18} strokeWidth={isActive ? 1.75 : 1.5} aria-hidden="true" />
      </span>

      <span className="min-w-0">
        <span className="block font-display text-title-sm font-semibold">{goal.title}</span>
        <span className={cn('block truncate text-legal transition-colors duration-base ease-out', isActive ? 'text-tone' : 'text-ink-muted')}>
          {goal.focus}
        </span>
      </span>

      <span
        aria-hidden="true"
        className={cn(
          'ms-auto shrink-0 font-display text-legal tabular transition-colors duration-base ease-out',
          isActive ? 'text-tone' : 'text-ink-muted'
        )}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   THE BRIEF — the approved goal card
   ═══════════════════════════════════════════════════════════════════════ */

function GoalBrief({ goal, index, total }: { goal: GoalEntry; index: number; total: number }) {
  const Mark = goalMarks[goal.id];
  const Glyph = goal.icon;

  return (
    <article data-tone={goal.id} className="raised relative overflow-hidden rounded-band border border-tone/30 bg-surface">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-tone-fill" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-pill bg-tone opacity-[0.13] blur-3xl"
      />

      <div className="relative p-6 sm:p-7 lg:p-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="lit lit-tone inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-surface bg-tone-fill text-on-tone">
              <Glyph size={22} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <span className="font-display text-legal font-semibold uppercase tracking-[0.12em] text-ink-muted">
                Goal {String(index + 1).padStart(2, '0')} <span aria-hidden="true">/</span>{' '}
                {String(total).padStart(2, '0')}
              </span>
              <h3 className="mt-1 text-display-sm text-ink-display">{goal.title}</h3>
            </div>
          </div>

          {/* The two pieces of context, stated as labelled facts rather than
              as decorative badges — both are framing, neither is a figure.
              `max-w-full` keeps the pair inside the card on a phone. */}
          <dl className="flex max-w-full shrink-0 flex-wrap gap-2">
            <div className="edge-top rounded-pill border border-tone/25 bg-tone-tint px-3 py-1.5">
              <dt className="font-display text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                Focus
              </dt>
              <dd className="text-legal font-semibold text-tone">{goal.focus}</dd>
            </div>
            <div className="inset-well rounded-pill border border-divider bg-surface-sunken px-3 py-1.5">
              <dt className="font-display text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                Horizon
              </dt>
              <dd className="text-legal font-semibold text-ink">{goal.horizon}</dd>
            </div>
          </dl>
        </header>

        <p className="mt-6 max-w-prose text-body-lg text-ink-secondary">{goal.description}</p>

        <div className="mt-7 grid gap-7 md:grid-cols-12 md:gap-8">
          <div className="min-w-0 md:col-span-7">
            <div className="inset-well rounded-surface border border-divider bg-surface-sunken p-4">
              <h4 className="font-display text-legal font-semibold uppercase tracking-[0.12em] text-ink-muted">
                Where this starts
              </h4>
              <p className="mt-2 text-body-sm text-ink">{goal.startsWith}</p>
            </div>

            <h4 className="mt-6 font-display text-legal font-semibold uppercase tracking-[0.12em] text-tone">
              What we&rsquo;d work through
            </h4>
            {/* An ordered list because it is one: these are the questions in
                the order a first conversation reaches them. */}
            <ol className="mt-3 flex flex-col gap-3">
              {goal.considerations.map((consideration, questionIndex) => (
                <li key={consideration} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="lit lit-tone mt-px inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-pill bg-tone-fill font-display text-legal font-semibold tabular text-on-tone"
                  >
                    {questionIndex + 1}
                  </span>
                  <span className="text-body-sm leading-snug text-ink-secondary">{consideration}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="md:col-span-5">
            {Mark && (
              <div className="h-44 lg:h-52">
                <Mark />
              </div>
            )}
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-5 border-t border-divider pt-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-legal text-ink-muted">Usually involves</span>
            {goal.relatedServiceIds.map((serviceId) => {
              const service = getServiceById(serviceId);
              if (!service) return null;
              /*
                A router Link rather than the ui/Link primitive: this is a
                chip with a surface and a border, and it needs the 44px touch
                target the phase brief requires, which the primitive's fixed
                standalone height would silently override.
              */
              return (
                <RouterLink
                  key={serviceId}
                  to={service.href}
                  className={cn(
                    'raised inline-flex min-h-11 items-center rounded-pill border border-divider bg-surface px-4',
                    'text-legal font-semibold text-ink',
                    'transition-[background-color,border-color,color] duration-fast ease-out',
                    'hover:border-tone hover:bg-tone-tint hover:text-tone'
                  )}
                >
                  {service.shortTitle}
                </RouterLink>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Carries which goal it came from into the pre-filled message
                (§25's contextual entry points), through the one shared
                builder rather than a second WhatsApp implementation. */}
            <ConversationCta context={goalConversation(goal.id)} size="md">
              Talk through this goal
            </ConversationCta>
            <Link to={goalDeepLink(goal.id)} variant="standalone" trailingIcon={<ArrowUpRight size={15} aria-hidden="true" />}>
              Read this goal in full
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
