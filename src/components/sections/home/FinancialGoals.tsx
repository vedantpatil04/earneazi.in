import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Link } from '@/components/ui/Link';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/motion/Reveal';
import { clipRevealVariants } from '@/lib/motion/variants';
import { duration, easing } from '@/lib/motion/tokens';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { goalEntries, getServiceById } from '@/data/services';
import { goalDeepLink } from '@/data/hero';
import { ConversationCta } from '@/components/conversion/ConversationCta';
import { generalConversation, goalConversation } from '@/lib/contact/conversation';
import type { GoalEntry } from '@/types/content';
import { cn } from '@/lib/utils/cn';
import { goalMarks } from './GoalVisuals';

/**
 * Financial Goals — the planning interface. Phase 3.
 *
 * ═════════════════════════════════════════════════════════════════════════
 * WHAT THIS SECTION IS FOR
 * ═════════════════════════════════════════════════════════════════════════
 *
 * It is the site's differentiating idea — start from what you are trying to
 * do, not from a product — and it was being told as six identical linked
 * cards, which is a menu rather than a piece of advice. It is now a brief:
 * pick a goal and the panel states, in one place and in this order, the
 * chain a first conversation actually follows.
 *
 *     the goal      →  what it means, in a sentence
 *     context       →  the kind of decision it is, and how far out it sits
 *     where it starts  →  the first thing an advisor would establish
 *     the questions →  what we'd work through, numbered
 *     the services  →  which parts of a plan it touches, linked
 *     the action    →  one way to start
 *
 * Nothing in it states or implies a return, a rate, a timeline in years or a
 * result. The content type (types/content.ts) has no field one could be
 * dropped into, and `horizon` is deliberately qualitative for exactly that
 * reason — "Years, not months" is framing; "7–10 years" would be advice.
 *
 * ═════════════════════════════════════════════════════════════════════════
 * INTERACTION
 * ═════════════════════════════════════════════════════════════════════════
 *
 * One ARIA tab pattern, two compositions (Phase 0 §22):
 *
 *   ≥1024px   vertical tablist in the left four columns, panel in the
 *             remaining eight. Six goals fit as a list without scrolling,
 *             so the whole set is visible while you read any one of them.
 *
 *   <1024px   the list becomes a horizontal chip rail with scroll-snap and
 *             edge fades, panel underneath. Six full-width stacked rows
 *             would push the panel — the part that carries the content —
 *             below the fold on every phone, so it is not that.
 *
 * Either way: roving tabindex, arrow keys in both axes, Home/End, the shared
 * focus ring, and selection without any scrolling at all. Under reduced
 * motion the panel swaps instantly and the marker jumps.
 *
 * ── Deep linking ────────────────────────────────────────────────────────
 *
 * `?goal=<id>` on whatever route this section sits on, read on mount and
 * written (replacing, never pushing) on selection. That reuses the routing
 * the site already has rather than adding any: it is a search parameter, so
 * `ScrollManager` — which reacts to `pathname` and `hash` — does not treat a
 * goal change as a navigation and does not scroll or move focus. The hash
 * form the hero's milestone markers already use (`goalDeepLink`) is accepted
 * too, so a link into this section works whichever of the two it carries.
 */

export function FinancialGoals() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [searchParams, setSearchParams] = useSearchParams();
  const railRef = useRef<HTMLDivElement>(null);

  const total = goalEntries.length;

  /*
    Resolved once, synchronously, so a shared link paints the right goal on
    the first frame instead of flicking from the first goal to the intended
    one. `?goal=` wins over the hash because it is the form this section
    writes; the hash is accepted because the hero already links that way.
  */
  const [activeIndex, setActiveIndex] = useState(() => {
    const requested =
      searchParams.get('goal') ??
      (typeof window !== 'undefined' ? decodeURIComponent(window.location.hash.slice(1)) : '');
    const index = goalEntries.findIndex((goal) => goal.id === requested);
    return index === -1 ? 0 : index;
  });

  const select = useCallback(
    (next: number, { focus = false }: { focus?: boolean } = {}) => {
      setActiveIndex(next);

      /* Replace rather than push: clicking through six goals should not cost
         the reader six presses of the back button. */
      setSearchParams(
        (current) => {
          const params = new URLSearchParams(current);
          params.set('goal', goalEntries[next].id);
          return params;
        },
        { replace: true }
      );

      const tab = document.getElementById('goal-tab-' + goalEntries[next].id);
      if (focus) tab?.focus();
      if (!focus) return;
      tab?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        inline: 'nearest',
        block: 'nearest',
      });
    },
    [prefersReducedMotion, setSearchParams]
  );

  /* A chip chosen by pointer still has to be brought into view on the rail,
     but only on the rail — on the desktop list there is nothing to scroll,
     and calling scrollIntoView there would move the page. */
  useEffect(() => {
    if (isDesktop) return;
    const rail = railRef.current;
    const tab = document.getElementById('goal-tab-' + goalEntries[activeIndex].id);
    if (!rail || !tab) return;
    const railBox = rail.getBoundingClientRect();
    const tabBox = tab.getBoundingClientRect();
    if (tabBox.left >= railBox.left && tabBox.right <= railBox.right) return;
    rail.scrollTo({
      left: rail.scrollLeft + (tabBox.left - railBox.left) - 16,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [activeIndex, isDesktop, prefersReducedMotion]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    /* Both axes are accepted in both compositions. The list is vertical and
       the rail is horizontal, but a reader who reaches for the other pair
       should not find nothing there. */
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        select((activeIndex + 1) % total, { focus: true });
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        select((activeIndex - 1 + total) % total, { focus: true });
        break;
      case 'Home':
        event.preventDefault();
        select(0, { focus: true });
        break;
      case 'End':
        event.preventDefault();
        select(total - 1, { focus: true });
        break;
      default:
        break;
    }
  };

  const active = goalEntries[activeIndex];

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

        <div className="mt-10 grid grid-cols-1 gap-6 lg:mt-14 lg:grid-cols-12 lg:gap-x-10">
          {/* ── The selector ─────────────────────────────────────────────
              One tablist, two shapes. The class list is the only difference
              between them — the semantics, the roving tabindex and the key
              handling are identical, so there is one behaviour to test. */}
          <div className="lg:col-span-4">
            <div className="relative">
              <div
                ref={railRef}
                role="tablist"
                aria-label="Financial goals"
                aria-orientation={isDesktop ? 'vertical' : 'horizontal'}
                onKeyDown={onKeyDown}
                className={cn(
                  isDesktop
                    ? 'flex flex-col gap-1.5'
                    : 'rail-x -mx-gutter gap-2 px-gutter pb-1'
                )}
              >
                {goalEntries.map((goal, index) => (
                  <GoalTab
                    key={goal.id}
                    goal={goal}
                    index={index}
                    isActive={index === activeIndex}
                    isDesktop={isDesktop}
                    onSelect={() => select(index)}
                  />
                ))}
              </div>

              {!isDesktop && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-bg to-transparent"
                />
              )}
            </div>

            {isDesktop && (
              <p className="mt-6">
                <Link to="/financial-goals" variant="standalone" trailingIcon={<ArrowRight size={15} aria-hidden="true" />}>
                  See all six goals in full
                </Link>
              </p>
            )}
          </div>

          {/* ── The brief ────────────────────────────────────────────────
              `min-h` rather than an animated height: the six panels differ by
              a few dozen pixels at most, and animating a panel of this size
              means animating a transform on its whole subtree, which
              distorts the type mid-swap. A stable box and a cross-fade is
              the honest version of what §22 asks for. */}
          <div className="lg:col-span-8">
            <div
              id={'goal-tabpanel-' + active.id}
              role="tabpanel"
              aria-labelledby={'goal-tab-' + active.id}
              tabIndex={0}
              className="lg:min-h-[34rem] focus-visible:outline-none"
            >
              {/*
                Keyed remount rather than AnimatePresence.

                Two reasons, one of them a defect.  holds the
                incoming panel until the outgoing one has finished exiting,
                which under React's StrictMode double-invocation deadlocks
                outright — the exiting child never signals that it is safe to
                remove, so the panel stops changing altogether. It is also
                the wrong shape for a tab: a tap should be answered now, not
                after a 240ms exit that carries no information.

                Changing the key remounts the brief, so React swaps the
                content immediately and Framer runs only the entrance. The
                final state is the base render, so the panel is complete and
                readable whether or not the animation runs.
              */}
              <motion.div
                key={active.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: duration.base, ease: easing.out }}
              >
                <GoalBrief goal={active} index={activeIndex} total={total} />
              </motion.div>
            </div>

            {!isDesktop && (
              <p className="mt-6">
                <Link to="/financial-goals" variant="standalone" trailingIcon={<ArrowRight size={15} aria-hidden="true" />}>
                  See all six goals in full
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Retained from the previous build because it is still the most
            common answer people give: more than one of these applies. */}
        <div className="mt-10 flex flex-col gap-4 rounded-band border border-divider bg-surface p-6 sm:flex-row sm:items-center sm:justify-between lg:mt-14 lg:p-7">
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
   THE TAB
   ═══════════════════════════════════════════════════════════════════════ */

interface GoalTabProps {
  goal: GoalEntry;
  index: number;
  isActive: boolean;
  isDesktop: boolean;
  onSelect: () => void;
}

function GoalTab({ goal, index, isActive, isDesktop, onSelect }: GoalTabProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const Glyph = goal.icon;

  return (
    <button
      id={'goal-tab-' + goal.id}
      type="button"
      role="tab"
      data-tone={goal.id}
      aria-selected={isActive}
      aria-controls={'goal-tabpanel-' + goal.id}
      tabIndex={isActive ? 0 : -1}
      onClick={onSelect}
      className={cn(
        'group relative flex items-center gap-3 text-left',
        /* Selection is never signalled by border colour alone: the surface,
           the border and a marker all change together (§11). */
        'transition-[background-color,border-color,color] duration-fast ease-out',
        isDesktop
          ? cn(
              'min-h-[3.5rem] rounded-surface border px-4 py-2',
              isActive
                ? 'border-tone/35 bg-tone-tint text-ink-display'
                : 'border-transparent text-ink-secondary hover:bg-hovered hover:text-ink'
            )
          : cn(
              /* 44px minimum, and the chip is the whole target. */
              'min-h-11 shrink-0 rounded-pill border px-4',
              isActive
                ? 'border-transparent bg-tone-fill text-on-tone'
                : 'border-divider bg-surface text-ink-secondary'
            )
      )}
    >
      {isDesktop && isActive && (
        prefersReducedMotion ? (
          <span aria-hidden="true" className="absolute inset-y-3 left-0 w-[3px] rounded-pill bg-tone" />
        ) : (
          /* The marker moves between goals as one object — the shared-element
             device §18.3 allows for exactly this control. */
          <motion.span
            aria-hidden="true"
            layoutId="goal-marker"
            className="absolute inset-y-3 left-0 w-[3px] rounded-pill bg-tone"
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          />
        )
      )}

      <span
        className={cn(
          'inline-flex shrink-0 items-center justify-center transition-colors duration-fast ease-out',
          isDesktop
            ? cn(
                'h-9 w-9 rounded-action',
                isActive ? 'bg-tone-fill text-on-tone' : 'bg-surface-sunken text-ink-muted group-hover:text-tone'
              )
            : ''
        )}
      >
        <Glyph size={isDesktop ? 18 : 16} strokeWidth={isActive ? 1.75 : 1.5} aria-hidden="true" />
      </span>

      <span className="min-w-0">
        <span
          className={cn(
            'block font-display font-semibold',
            isDesktop ? 'text-title-sm' : 'whitespace-nowrap text-body-sm'
          )}
        >
          {goal.title}
        </span>
        {isDesktop && (
          <span
            className={cn(
              'block truncate text-legal',
              isActive ? 'text-tone' : 'text-ink-muted'
            )}
          >
            {goal.focus}
          </span>
        )}
      </span>

      {isDesktop && (
        <span
          aria-hidden="true"
          className={cn(
            'ms-auto shrink-0 font-display text-legal tabular',
            isActive ? 'text-tone' : 'text-ink-muted'
          )}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   THE BRIEF
   ═══════════════════════════════════════════════════════════════════════ */

function GoalBrief({ goal, index, total }: { goal: GoalEntry; index: number; total: number }) {
  const Mark = goalMarks[goal.id];
  const Glyph = goal.icon;

  return (
    <article data-tone={goal.id} className="relative overflow-hidden rounded-band border border-tone/30 bg-surface">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-tone-fill" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-pill bg-tone opacity-[0.13] blur-3xl"
      />

      <div className="relative p-6 sm:p-7 lg:p-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-surface bg-tone-fill text-on-tone">
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
              as decorative badges — both are framing, neither is a figure. */}
          <dl className="flex shrink-0 flex-wrap gap-2">
            <div className="rounded-pill border border-tone/25 bg-tone-tint px-3 py-1.5">
              <dt className="font-display text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                Focus
              </dt>
              <dd className="text-legal font-semibold text-tone">{goal.focus}</dd>
            </div>
            <div className="rounded-pill border border-divider bg-surface-sunken px-3 py-1.5">
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
            <div className="rounded-surface border border-divider bg-surface-sunken p-4">
              <h4 className="font-display text-legal font-semibold uppercase tracking-[0.12em] text-ink-muted">
                Where this starts
              </h4>
              <p className="mt-2 text-body-sm text-ink">{goal.startsWith}</p>
            </div>

            <h4 className="mt-6 font-display text-legal font-semibold uppercase tracking-[0.12em] text-tone">
              What we&rsquo;d work through
            </h4>
            {/* An ordered list because it is one: these are the questions in
                the order a first conversation reaches them. The discs carry
                the number visually; the list element carries it semantically,
                so the count is not dependent on the styling. */}
            <ol className="mt-3 flex flex-col gap-3">
              {goal.considerations.map((consideration, questionIndex) => (
                <li key={consideration} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-px inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-pill bg-tone-tint font-display text-legal font-semibold tabular text-tone"
                  >
                    {questionIndex + 1}
                  </span>
                  <span className="text-body-sm leading-snug text-ink-secondary">{consideration}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="md:col-span-5">{Mark && <div className="h-44 lg:h-52"><Mark /></div>}</div>
        </div>

        <div className="mt-7 flex flex-col gap-5 border-t border-divider pt-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-legal text-ink-muted">Usually involves</span>
            {goal.relatedServiceIds.map((serviceId) => {
              const service = getServiceById(serviceId);
              if (!service) return null;
              /*
                A router Link rather than the ui/Link primitive.

                This is a chip, not a standalone link: it is a control with a
                surface and a border, and it needs the 44px touch target the
                phase brief requires. The primitive fixes standalone links at
                28px — right for a word-shaped link, and it wins on stylesheet
                order, so passing a taller min-height through className
                silently does nothing. Owning the classes here is honest about
                that rather than fighting it.
              */
              return (
                <RouterLink
                  key={serviceId}
                  to={service.href}
                  className={cn(
                    'inline-flex min-h-11 items-center rounded-pill border border-divider bg-surface-sunken px-4',
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
            <Link
              to={goalDeepLink(goal.id)}
              variant="standalone"
              trailingIcon={<ArrowUpRight size={15} aria-hidden="true" />}
            >
              Read this goal in full
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
