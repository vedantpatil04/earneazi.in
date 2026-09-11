import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/motion/Reveal';
import { panelSwapVariants, settleVariants, transitions, withMotionSafety } from '@/lib/motion/variants';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { goalEntries, getServiceById } from '@/data/services';
import { cn } from '@/lib/utils/cn';

/**
 * The goals section is the page's main interactive moment, and it earns
 * that by doing something a static grid can't: it answers "what would
 * working on this actually involve?" for whichever goal you pick, and
 * shows which of the three services that goal touches.
 *
 * Built as a real tab list rather than a set of cards with a hover state,
 * so it works from the keyboard exactly as a tab list is expected to:
 * arrow keys move between goals, Home and End jump to the ends, and the
 * panel is labelled by its tab.
 *
 * Nothing in the panel states an outcome. The considerations are the
 * questions an advisor would ask, which is honest content that needs no
 * verified figures behind it.
 */
export function GoalsGrid() {
  const [activeId, setActiveId] = useState(goalEntries[0].id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const prefersReducedMotion = usePrefersReducedMotion();

  const activeGoal = goalEntries.find((goal) => goal.id === activeId) ?? goalEntries[0];
  const activeIndex = goalEntries.findIndex((goal) => goal.id === activeId);

  const focusTab = (index: number) => {
    const next = goalEntries[(index + goalEntries.length) % goalEntries.length];
    setActiveId(next.id);
    tabRefs.current[next.id]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        focusTab(activeIndex + 1);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        focusTab(activeIndex - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusTab(0);
        break;
      case 'End':
        event.preventDefault();
        focusTab(goalEntries.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <Section spacing="lg" background="surface" aria-labelledby="goals-heading">
      <Container size="wide">
        <SectionHeading
          id="goals-heading"
          title="Start from what you’re trying to do."
          lead="Pick a goal and you’ll see the questions we’d work through, and which parts of the plan it touches."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:mt-16 lg:grid-cols-12 lg:gap-10">
          <div
            role="tablist"
            aria-label="Financial goals"
            aria-orientation="vertical"
            className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1"
          >
            {goalEntries.map((goal) => {
              const isActive = goal.id === activeId;

              return (
                <button
                  key={goal.id}
                  ref={(node) => {
                    tabRefs.current[goal.id] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`goal-tab-${goal.id}`}
                  aria-selected={isActive}
                  aria-controls="goal-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveId(goal.id)}
                  onKeyDown={handleKeyDown}
                  className={cn(
                    'group relative flex min-h-[3.5rem] w-full items-center gap-3 rounded-md border px-4 py-3 text-left',
                    'transition-[background-color,border-color,color] motion-safe:duration-200 ease-signature',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                    isActive
                      ? 'border-accent/45 bg-accent/[0.07] text-ink'
                      : 'border-divider bg-transparent text-ink-secondary hover:border-border hover:bg-surface-2/60 hover:text-ink'
                  )}
                >
                  <span
                    className={cn(
                      'inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm transition-colors motion-safe:duration-200',
                      isActive ? 'bg-accent text-on-accent' : 'bg-surface-2 text-ink-muted group-hover:text-accent'
                    )}
                  >
                    <Icon icon={goal.icon} size={18} />
                  </span>
                  <span className="font-display text-body-lg">{goal.title}</span>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-8">
            {/* A minimum height on wide screens keeps the section from
                resizing as you move between goals — the content underneath
                should not jump around while you're comparing them. */}
            <div
              role="tabpanel"
              id="goal-panel"
              aria-labelledby={`goal-tab-${activeGoal.id}`}
              tabIndex={0}
              className="h-full rounded-lg border border-divider bg-bg p-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:p-8 lg:min-h-[24rem]"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeGoal.id}
                  variants={panelSwapVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={withMotionSafety(prefersReducedMotion, transitions.fast)}
                  className="flex h-full flex-col"
                >
                  <h3 className="text-h3 font-display-sharp">{activeGoal.title}</h3>
                  <p className="mt-3 max-w-prose text-body-lg text-ink-secondary">{activeGoal.description}</p>

                  <p className="mt-8 text-label font-semibold text-ink">What we&rsquo;d work through</p>
                  <ul className="mt-3 flex flex-col gap-2.5">
                    {activeGoal.considerations.map((consideration) => (
                      <li key={consideration} className="flex items-start gap-3 text-body text-ink-secondary">
                        <span
                          aria-hidden="true"
                          className="mt-[0.6rem] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brass"
                        />
                        {consideration}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex flex-col gap-5 pt-8">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <span className="text-small text-ink-muted">Usually involves</span>
                      {activeGoal.relatedServiceIds.map((serviceId) => {
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
                      className="group inline-flex items-center gap-2 self-start text-body font-medium text-accent transition-colors motion-safe:duration-200 hover:text-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                      Talk through this goal
                      <Icon
                        icon={ArrowRight}
                        size={18}
                        className="transition-transform motion-safe:duration-200 ease-signature group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <Reveal variants={settleVariants} className="mt-8">
          <p className="text-small text-ink-muted">
            Not sure which of these fits?{' '}
            <Link
              to="/financial-goals"
              className="text-ink underline decoration-brass decoration-1 underline-offset-4 transition-colors motion-safe:duration-200 hover:text-brass focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              See all the goals we plan around
            </Link>
            .
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
