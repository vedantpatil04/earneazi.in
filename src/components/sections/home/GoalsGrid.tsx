import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Link } from '@/components/ui/Link';
import { Button } from '@/components/ui/Button';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { goalEntries, getServiceById } from '@/data/services';
import type { GoalEntry } from '@/types/content';
import { cn } from '@/lib/utils/cn';

/**
 * Financial Goals — Scroll-Driven Stacked Card Interaction.
 *
 * Implements an authentic stacked card deck storytelling experience inside a
 * pinned, stable visual stage. Rather than scrolling a long document list of
 * cards, all 6 cards occupy a shared spatial stage:
 *
 * - ACTIVE: dominant, scale 1.0, opacity 1.0, elevated border & glow, full
 *   content and CTA revealed.
 * - NEXT: stacked slightly below and behind (translateY +28px, scale 0.95,
 *   opacity 0.50), peeking out like the next card in a physical deck.
 * - PREVIOUS: translates upward (-85px) and recedes smoothly as scroll advances.
 * - FALLBACK: direct click/tap on left progress rail or peeking cards scrolls
 *   directly to that goal.
 * - RELEASE: graceful completion of Goal 06 before releasing into normal flow.
 */

interface StackedGoalCardProps {
  goal: GoalEntry;
  index: number;
  total: number;
  activeIndex: number;
  scrollYProgress: any;
  isDesktop: boolean;
  prefersReducedMotion: boolean;
  onSelect: (index: number) => void;
}

function StackedGoalCard({
  goal,
  index,
  total,
  activeIndex,
  scrollYProgress,
  isDesktop,
  prefersReducedMotion,
  onSelect,
}: StackedGoalCardProps) {
  const isActive = activeIndex === index;
  const Glyph = goal.icon;

  // Normalized active float: maps [0, 0.88] to [0, 5], leaving [0.88, 1.0] as a stable exit buffer
  const currentFloat = useTransform(scrollYProgress, (progress: number) => {
    const effective = Math.min(1, Math.max(0, progress) / 0.88);
    return effective * (total - 1);
  });

  // Continuous translateY in the stage coordinate system
  const y = useTransform(currentFloat, (curr: number) => {
    if (prefersReducedMotion) return 0;
    const delta = index - curr;

    if (delta >= 0) {
      // Upcoming cards stacked underneath
      const step = isDesktop ? 28 : 20;
      return Math.min(isDesktop ? 60 : 42, delta * step);
    }

    // Previous cards gliding upward and away
    const upStep = isDesktop ? 85 : 58;
    return Math.max(isDesktop ? -140 : -95, delta * upStep);
  });

  // Scale: 1.0 at active center, subtly stepping down in the stack
  const scale = useTransform(currentFloat, (curr: number) => {
    if (prefersReducedMotion) return 1;
    const delta = index - curr;

    if (delta >= 0) {
      return Math.max(0.88, 1 - delta * 0.05);
    }
    return Math.max(0.86, 1 + delta * 0.07);
  });

  // Opacity: 1.0 when active, ~0.50 when peeking, fading as cards recede
  const opacity = useTransform(currentFloat, (curr: number) => {
    if (prefersReducedMotion) return activeIndex === index ? 1 : 0.05;
    const delta = index - curr;

    if (Math.abs(delta) <= 0.35) return 1;

    if (delta > 0) {
      // Upcoming in deck
      if (delta <= 1.2) return Math.max(0.40, 1 - delta * 0.55);
      if (delta <= 2.2) return Math.max(0.12, 0.40 - (delta - 1.2) * 0.28);
      return 0;
    }

    // Receding upward
    if (delta >= -1.2) return Math.max(0.20, 1 + delta * 0.70);
    if (delta >= -1.7) return Math.max(0, 0.20 + (delta + 1.2) * 0.40);
    return 0;
  });

  // Dynamic z-index so incoming cards sit below active, receding glide cleanly
  const zIndex = useTransform(currentFloat, (curr: number) => {
    const delta = index - curr;
    if (Math.abs(delta) <= 0.4) return 30;
    if (delta > 0) {
      return Math.max(1, 20 - Math.round(delta * 5));
    }
    return Math.max(1, 25 + Math.round(delta * 5));
  });

  // Smooth disclosure opacity for questions & CTA (only active card displays full detail)
  const detailOpacity = useTransform(currentFloat, (curr: number) => {
    const diff = Math.abs(index - curr);
    if (diff <= 0.3) return 1;
    if (diff >= 0.7) return 0;
    return (0.7 - diff) / 0.4;
  });

  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!isActive) {
      e.preventDefault();
      onSelect(index);
    }
  };

  return (
    <motion.div
      style={{
        y,
        scale,
        opacity,
        zIndex,
      }}
      onClick={handleCardClick}
      className={cn(
        'absolute inset-x-0 top-0 w-full rounded-2xl border transition-[border-color,box-shadow,background-color] duration-300',
        'p-5 sm:p-6 lg:p-7 select-none flex flex-col justify-between',
        isDesktop ? 'h-[440px] lg:h-[460px]' : 'h-[340px] sm:h-[360px]',
        isActive
          ? 'border-2 border-brand-500 bg-white dark:bg-gradient-to-b dark:from-[#0e2a4a] dark:to-[#081a2e] shadow-[0_20px_45px_-10px_rgba(10,27,46,0.12),0_0_25px_0_rgba(22,104,220,0.10)] dark:shadow-[0_20px_45px_-10px_rgba(22,104,220,0.35),0_0_30px_-5px_rgba(61,135,240,0.22)] cursor-default pointer-events-auto'
          : 'border border-neutral-200 bg-neutral-100/95 dark:border-white/10 dark:bg-[#071728]/95 hover:border-brand/40 cursor-pointer pointer-events-auto'
      )}
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-3 mb-2 sm:mb-3">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg text-xs font-mono font-bold transition-colors',
                isActive
                  ? 'bg-brand text-white shadow-sm'
                  : 'bg-surface text-ink-muted border border-divider dark:bg-surface-sunken'
              )}
            >
              {String(index + 1).padStart(2, '0')}
            </span>

            <span
              className={cn(
                'flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg transition-colors',
                isActive
                  ? 'bg-brand-subtle text-brand dark:bg-brand/20 dark:text-brand-400'
                  : 'bg-surface text-ink-muted border border-divider dark:bg-surface-sunken'
              )}
            >
              <Glyph size={15} strokeWidth={isActive ? 2 : 1.5} aria-hidden="true" />
            </span>

            <span
              className={cn(
                'text-[11px] sm:text-xs font-semibold tracking-wider uppercase',
                isActive ? 'text-brand dark:text-brand-400' : 'text-ink-muted'
              )}
            >
              Priority {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          <span className="text-xs font-mono text-ink-muted">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="font-display font-bold text-lg sm:text-2xl lg:text-3xl text-ink-display dark:text-white leading-tight">
          {goal.title}
        </h3>
        <p className="mt-1 sm:mt-2 text-xs sm:text-body text-ink-secondary dark:text-slate-300 leading-relaxed line-clamp-2 sm:line-clamp-none">
          {goal.description}
        </p>

        {/* Planning Questions (Fades in smoothly on the active card) */}
        <motion.div
          style={{ opacity: detailOpacity }}
          className="mt-3 sm:mt-5"
        >
          <h4 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-brand dark:text-brand-400">
            What we’d work through
          </h4>
          <ul className="mt-1.5 sm:mt-2.5 flex flex-col gap-1.5 sm:gap-2">
            {goal.considerations.map((consideration) => (
              <li
                key={consideration}
                className="flex items-start gap-2 text-xs sm:text-body-sm text-ink-secondary dark:text-slate-200"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full transition-colors',
                    isActive
                      ? 'bg-brand shadow-[0_0_8px_rgba(61,135,240,0.8)] dark:bg-brand-400'
                      : 'bg-ink-muted'
                  )}
                />
                <span className="leading-snug">{consideration}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Service Tags & CTA (Fades in smoothly on the active card) */}
      <motion.div
        style={{ opacity: detailOpacity }}
        className="mt-3 pt-3 border-t border-divider/60 dark:border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3"
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-ink-muted">Usually involves:</span>
          {goal.relatedServiceIds.map((serviceId) => {
            const service = getServiceById(serviceId);
            if (!service) return null;
            return (
              <RouterLink
                key={serviceId}
                to={service.href}
                onClick={(e) => {
                  if (!isActive) e.stopPropagation();
                }}
                tabIndex={isActive ? 0 : -1}
                className={cn(
                  'inline-flex min-h-6 sm:min-h-7 items-center rounded-pill border px-2.5 text-[11px] sm:text-xs font-medium transition-colors',
                  'border-divider bg-surface text-ink hover:border-brand/40 hover:bg-brand-subtle hover:text-brand-ink',
                  'dark:bg-white/5 dark:border-white/15 dark:text-white dark:hover:bg-brand/20 dark:hover:border-brand'
                )}
              >
                {service.shortTitle}
              </RouterLink>
            );
          })}
        </div>

        <Button
          to="/contact"
          size="sm"
          trailingIcon={<ArrowRight size={14} />}
          className={cn(
            'shrink-0 w-full sm:w-auto h-8 sm:h-9 text-xs transition-all',
            !isActive && 'opacity-0 pointer-events-none'
          )}
          tabIndex={isActive ? 0 : -1}
        >
          Talk through this goal
        </Button>
      </motion.div>
    </motion.div>
  );
}

export function GoalsGrid() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [searchParams, setSearchParams] = useSearchParams();

  const trackRef = useRef<HTMLDivElement>(null);
  const railButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const chipContainerRef = useRef<HTMLDivElement>(null);

  // Find requested goal from URL search params
  const requestedGoalId = searchParams.get('goal');
  const initialIndex = Math.max(
    0,
    goalEntries.findIndex((goal) => goal.id === requestedGoalId)
  );

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const totalGoals = goalEntries.length;

  // Track scroll progression across the outer pinned track
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  // Sync activeIndex with continuous scroll progression
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const clamped = Math.max(0, Math.min(1, latest));
    // Maps [0, 0.88] across all 6 goals with [0.88, 1.0] as stable end buffer
    const effective = Math.min(1, clamped / 0.88);
    const calculatedIndex = Math.min(
      totalGoals - 1,
      Math.max(0, Math.round(effective * (totalGoals - 1)))
    );
    if (calculatedIndex !== activeIndex) {
      setActiveIndex(calculatedIndex);
    }
  });

  // Keep mobile chips horizontally scrolled to active item
  useEffect(() => {
    if (isDesktop) return;
    const container = chipContainerRef.current;
    if (!container) return;
    const activeChip = container.children[activeIndex] as HTMLElement;
    if (activeChip) {
      container.scrollTo({
        left: Math.max(0, activeChip.offsetLeft - (container.clientWidth - activeChip.offsetWidth) / 2),
        behavior: 'smooth',
      });
    }
  }, [activeIndex, isDesktop]);

  // URL query sync with light debounce
  const updateUrlTimerRef = useRef<NodeJS.Timeout>();
  useEffect(() => {
    clearTimeout(updateUrlTimerRef.current);
    updateUrlTimerRef.current = setTimeout(() => {
      const currentParam = searchParams.get('goal');
      if (currentParam !== goalEntries[activeIndex].id) {
        const next = new URLSearchParams(searchParams);
        next.set('goal', goalEntries[activeIndex].id);
        setSearchParams(next, { replace: true });
      }
    }, 120);
    return () => clearTimeout(updateUrlTimerRef.current);
  }, [activeIndex, searchParams, setSearchParams]);

  // Direct smooth scroll to a specific goal
  const scrollToGoal = useCallback(
    (targetIndex: number, smooth: boolean = true) => {
      if (!trackRef.current) return;
      const track = trackRef.current;
      const rect = track.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const trackTop = rect.top + scrollTop;
      const trackHeight = track.offsetHeight;
      const windowHeight = window.innerHeight;
      const totalScrollableDistance = trackHeight - windowHeight;

      if (totalScrollableDistance <= 0) return;

      // Map goal index into target scroll position based on the 0.88 plateau
      const normalizedTarget = (targetIndex / (totalGoals - 1)) * 0.88;
      const targetScrollY = trackTop + normalizedTarget * totalScrollableDistance;

      window.scrollTo({
        top: targetScrollY,
        behavior: smooth && !prefersReducedMotion ? 'smooth' : 'auto',
      });

      setActiveIndex(targetIndex);
    },
    [totalGoals, prefersReducedMotion]
  );

  // Initial deep link scroll if goal parameter is present
  useEffect(() => {
    if (initialIndex > 0) {
      const timer = setTimeout(() => {
        scrollToGoal(initialIndex, false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [initialIndex, scrollToGoal]);

  // Keyboard accessibility
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        if (activeIndex < totalGoals - 1) {
          const next = activeIndex + 1;
          scrollToGoal(next);
          railButtonRefs.current[next]?.focus();
        }
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        if (activeIndex > 0) {
          const prev = activeIndex - 1;
          scrollToGoal(prev);
          railButtonRefs.current[prev]?.focus();
        }
        break;
      case 'Home':
        event.preventDefault();
        scrollToGoal(0);
        railButtonRefs.current[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        scrollToGoal(totalGoals - 1);
        railButtonRefs.current[totalGoals - 1]?.focus();
        break;
      default:
        break;
    }
  };

  return (
    <Section
      id="financial-goals"
      spacing="none"
      background="bg"
      className="relative overflow-visible"
      aria-labelledby="goals-heading"
    >
      {/* Ambient Radial Glow Behind the Pinned Stage */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[900px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(61,135,240,0.12),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(22,104,220,0.18),transparent_70%)] blur-3xl" />
      </div>

      {/* Outer Scroll Track: Provides deliberate travel distance without locking native scroll */}
      <div
        ref={trackRef}
        className="relative h-[240vh] sm:h-[270vh] lg:h-[300vh]"
      >
        {/* Pinned Sticky Stage */}
        <div
          className={cn(
            'sticky top-14 sm:top-16 lg:top-20 z-10',
            'h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)]',
            'flex flex-col justify-center overflow-hidden'
          )}
          onKeyDown={handleKeyDown}
        >
          <Container size="shell" className="w-full h-full flex flex-col justify-center py-3 sm:py-4 lg:py-6">
            {/* Mobile / Tablet Compact Header */}
            <div className="lg:hidden flex flex-col gap-1.5 mb-2 sm:mb-3 w-full shrink-0">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand dark:text-brand-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
                  Financial Goals
                </span>
                <span className="text-xs font-mono font-bold text-ink-muted bg-surface-sunken px-2 py-0.5 rounded-pill border border-divider">
                  {String(activeIndex + 1).padStart(2, '0')} / 06
                </span>
              </div>

              <h2
                id="goals-heading-mobile"
                className="text-title-lg sm:text-display-xs font-display text-ink-display leading-tight"
              >
                Start from what you’re trying to do.
              </h2>

              {/* Mobile Goal Step Pills */}
              <div
                ref={chipContainerRef}
                role="tablist"
                aria-label="Financial goals"
                className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {goalEntries.map((goal, index) => {
                  const isActive = activeIndex === index;
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => scrollToGoal(index)}
                      className={cn(
                        'shrink-0 flex items-center gap-1.5 py-1 px-3 rounded-pill text-xs font-medium transition-all duration-200 border',
                        isActive
                          ? 'bg-brand text-white border-brand shadow-sm font-semibold'
                          : 'bg-surface border-divider text-ink-secondary hover:text-ink dark:bg-surface-sunken'
                      )}
                    >
                      <span className="font-mono">{String(index + 1).padStart(2, '0')}</span>
                      <span>{goal.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Stage Grid: Persistent Narrative Left + Stacked Card Stage Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center w-full flex-1 overflow-hidden">
              {/* Left Column: Persistent Editorial Narrative & Interactive Progress Rail */}
              <div className="hidden lg:flex lg:col-span-5 flex-col justify-center pr-2 xl:pr-6">
                <div className="inline-flex items-center gap-2 rounded-pill border border-brand/20 bg-brand-subtle dark:bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-ink dark:text-brand-400 uppercase tracking-wider mb-4 w-fit">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
                  Financial Goals
                </div>

                <h2
                  id="goals-heading"
                  className="text-display-sm lg:text-display-md font-display text-ink-display leading-tight tracking-tight"
                >
                  Start from what you’re trying to do.
                </h2>

                <p className="mt-3 max-w-prose text-body-base lg:text-body-lg text-ink-secondary">
                  Pick a goal and you’ll see the questions we’d work through, and which parts of a plan it touches.
                </p>

                {/* Vertical Progress Rail */}
                <nav
                  aria-label="Financial goals sequence"
                  role="tablist"
                  className="mt-8 relative flex flex-col gap-2"
                >
                  {/* Subtle Vertical Tracking Line */}
                  <div className="absolute left-[19px] top-3 bottom-3 w-px bg-divider -z-10" />

                  {goalEntries.map((goal, index) => {
                    const isActive = activeIndex === index;
                    const Icon = goal.icon;
                    return (
                      <button
                        key={goal.id}
                        ref={(node) => {
                          railButtonRefs.current[index] = node;
                        }}
                        type="button"
                        role="tab"
                        id={`goal-rail-tab-${goal.id}`}
                        aria-selected={isActive}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => scrollToGoal(index)}
                        className={cn(
                          'group relative flex items-center gap-3.5 px-3 py-2 rounded-action text-left transition-all duration-200',
                          isActive
                            ? 'bg-selected/90 border border-selected-border text-ink shadow-sm'
                            : 'bg-transparent border border-transparent text-ink-secondary hover:bg-hovered hover:text-ink'
                        )}
                      >
                        {/* Smooth shared active indicator line */}
                        {isActive && (
                          <motion.span
                            layoutId="active-goal-rail"
                            className="absolute -left-1 inset-y-1.5 w-1 rounded-pill bg-brand shadow-[0_0_8px_rgba(61,135,240,0.8)]"
                            transition={
                              prefersReducedMotion
                                ? { duration: 0 }
                                : { type: 'spring', stiffness: 380, damping: 30 }
                            }
                          />
                        )}

                        <span
                          className={cn(
                            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-mono font-bold transition-colors',
                            isActive
                              ? 'bg-brand text-white shadow-sm'
                              : 'bg-surface-sunken text-ink-muted group-hover:text-ink border border-divider'
                          )}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <Icon
                          size={16}
                          className={cn(
                            isActive ? 'text-brand dark:text-brand-400' : 'text-ink-muted group-hover:text-ink',
                            'shrink-0'
                          )}
                        />

                        <span
                          className={cn(
                            'font-display text-sm tracking-tight',
                            isActive ? 'font-bold text-ink' : 'font-medium text-ink-secondary group-hover:text-ink'
                          )}
                        >
                          {goal.title}
                        </span>
                      </button>
                    );
                  })}
                </nav>

                <div className="mt-8 pt-2">
                  <p className="text-body-sm text-ink-muted">
                    Not sure which of these fits?{' '}
                    <Link
                      to="/financial-goals"
                      className="font-semibold text-brand hover:underline inline-flex items-center gap-1"
                    >
                      See all six goals in full
                      <ArrowRight size={13} className="inline" />
                    </Link>
                  </p>
                </div>
              </div>

              {/* Right Column: Controlled Sticky Visual Stage Housing the Stacked Cards */}
              <div
                className={cn(
                  'lg:col-span-7 relative w-full flex items-center justify-center',
                  isDesktop ? 'h-[490px] lg:h-[510px]' : 'h-[370px] sm:h-[390px]'
                )}
              >
                {/* Fixed Stage Dimension: All cards live within this spatial stage */}
                <div
                  className={cn(
                    'relative w-full',
                    isDesktop ? 'max-w-[560px] h-[450px] lg:h-[470px]' : 'max-w-md h-[340px] sm:h-[360px]'
                  )}
                >
                  {goalEntries.map((goal, index) => (
                    <StackedGoalCard
                      key={goal.id}
                      goal={goal}
                      index={index}
                      total={totalGoals}
                      activeIndex={activeIndex}
                      scrollYProgress={scrollYProgress}
                      isDesktop={isDesktop}
                      prefersReducedMotion={prefersReducedMotion}
                      onSelect={scrollToGoal}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </Section>
  );
}
