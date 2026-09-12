import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Target, ShieldCheck, Layers, ArrowRight, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ConversationCta } from '@/components/conversion/ConversationCta';
import { generalConversation } from '@/lib/contact/conversation';
import {
  heroActions,
  heroEyebrow,
  heroFloatingDetail,
  heroHeadlineAccent,
  heroSubheadline,
  heroTrustIndicators,
} from '@/data/hero';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { duration, easing, travel } from '@/lib/motion/tokens';
import { cn } from '@/lib/utils/cn';
import { HeroVisual } from './HeroVisual';
import { HeroJourney } from './HeroJourney';

const trustIcons: Record<string, LucideIcon> = { target: Target, shield: ShieldCheck, layers: Layers };

/**
 * The hero.
 *
 * A photograph, a claim, and a journey — composed so that on a wide screen
 * the three occupy different parts of one frame rather than stacking.
 *
 * ── Composition ─────────────────────────────────────────────────────────
 *
 *   ≥1024px   narrative in the left five columns, sitting on the reading
 *             scrim; the journey ascends through the open sky on the right,
 *             positioned over the whole frame rather than inside a column
 *             so the curve is free to run edge to edge.
 *   <1024px   narrative first, then the same journey as a vertical spine in
 *             a panel beneath it. Not a stripped-down hero: the same
 *             photograph, the same claim, the same three milestones, drawn
 *             along the axis the viewport actually has.
 *
 * ── Motion ──────────────────────────────────────────────────────────────
 *
 * One entrance, staged: eyebrow, then the headline's two halves, then the
 * supporting copy, then the actions, then the proof row — each starting
 * before the last has finished, so it reads as one movement settling rather
 * than as five elements taking turns. The journey draws itself against the
 * same clock.
 *
 * Scroll-linked, the photograph drifts up a little and the journey drifts up
 * more. That difference is the whole parallax effect; it is deliberately
 * small, and it is desktop-only — on touch, scroll-linked transforms
 * compete with the browser's own address-bar animation and read as lag
 * rather than as depth.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const parallax = isDesktop && !prefersReducedMotion;

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -travel.sm]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const journeyY = useTransform(scrollYProgress, [0, 1], [0, -travel.lg]);

  /** One transition builder, so every element in the entrance shares a clock. */
  const enter = (delay: number, seconds: number = duration.slow) =>
    prefersReducedMotion ? { duration: 0 } : { duration: seconds, delay, ease: easing.out };

  const rise = prefersReducedMotion ? false : { opacity: 0, y: travel.md };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className="relative flex min-h-[36rem] w-full items-center overflow-hidden py-14 md:min-h-[41rem] md:py-16 lg:min-h-[44rem] lg:py-20"
    >
      <HeroVisual depth={parallax ? { imageY, imageScale } : undefined} />

      {/* The journey is a sibling of the content column, not a child of it,
          so the curve can run past the container's right edge. */}
      {isDesktop && (
        <HeroJourney variant="path" depth={parallax ? { y: journeyY } : undefined} className="inset-y-12 left-0 right-0" />
      )}

      {/* ── Floating Hero Card ── */}
      {isDesktop && (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={enter(0.42)}
          className="pointer-events-auto absolute right-10 top-7 z-20 hidden lg:flex xl:right-16"
        >
          <div
            className={cn(
              'flex items-center gap-3 rounded-surface px-4 py-2.5 shadow-md border backdrop-blur-md transition-all duration-instant',
              'bg-veil/[var(--veil-alpha)] border-divider text-ink-display',
              'hover:border-brand/40'
            )}
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-pill bg-brand-subtle text-brand-ink">
              <Sparkles size={15} strokeWidth={2} aria-hidden="true" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold tracking-tight text-ink-display">
                {heroFloatingDetail.title}
              </span>
              <span className="block text-[11px] font-medium text-ink-secondary">
                {heroFloatingDetail.subtitle}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      <Container size="shell" className="relative z-10 w-full">
        <div className="max-w-[32rem] lg:max-w-[34rem] xl:max-w-[37rem]">
          <motion.div initial={rise} animate={{ opacity: 1, y: 0 }} transition={enter(0.05, duration.base)}>
            <Eyebrow tone="onImage">{heroEyebrow}</Eyebrow>
          </motion.div>

          {/*
            Editorial desktop hierarchy:
            One advisor
            for every money
            decision that matters.
          */}
          <motion.h1
            id="hero-heading"
            initial={rise}
            animate={{ opacity: 1, y: 0 }}
            transition={enter(0.14)}
            className="mt-4 text-[2.15rem] min-[390px]:text-[2.35rem] sm:text-[2.75rem] md:text-[3.15rem] lg:text-[3.25rem] xl:text-[3.55rem] font-bold tracking-tight leading-[1.08] text-ink-display"
          >
            <span className="block">One advisor</span>
            <span className="block">for every money</span>
            <span className="text-brand-ink inline lg:inline-block max-w-full lg:whitespace-nowrap">
              {heroHeadlineAccent}
            </span>
          </motion.h1>

          <motion.p
            initial={rise}
            animate={{ opacity: 1, y: 0 }}
            transition={enter(0.34)}
            className="mt-5 max-w-[28rem] lg:max-w-[31rem] xl:max-w-[33rem] text-body-lg text-ink-secondary leading-relaxed"
          >
            {heroSubheadline}
          </motion.p>

          <motion.div
            initial={rise}
            animate={{ opacity: 1, y: 0 }}
            transition={enter(0.44)}
            className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button
              to={heroActions.primary.to}
              size="lg"
              trailingIcon={<ArrowRight size={18} strokeWidth={2} aria-hidden="true" />}
              className="w-full sm:w-auto"
            >
              {/* The label carries its own arrow in the content file; the
                  Button supplies the one that moves, so it is not shown
                  twice. */}
              {heroActions.primary.label.replace(/\s*→\s*$/, '')}
            </Button>

            {/*
              The hero's conversation entry point. It used to branch on the
              WhatsApp number itself and label itself differently in each
              case; the shared control now makes that decision once, for
              every entry point on the site, and keeps one label either way.
            */}
            <ConversationCta
              context={generalConversation}
              variant="secondary"
              size="lg"
              showChannelIcon
              className="w-full sm:w-auto"
            >
              {heroActions.secondary.label}
            </ConversationCta>
          </motion.div>

          <motion.ul
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={enter(0.58)}
            className="mt-8 flex w-full flex-col gap-y-2.5 border-t border-divider pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3.5 lg:flex-nowrap lg:gap-x-3.5 xl:gap-x-4"
          >
            {heroTrustIndicators.map((indicator, idx) => {
              const Glyph = trustIcons[indicator.iconKey] ?? Target;
              return (
                <li key={indicator.label} className="flex items-center gap-2 lg:shrink-0">
                  {idx > 0 && (
                    <span className="hidden sm:inline-block h-3 w-px bg-divider mr-1.5" aria-hidden="true" />
                  )}
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-pill bg-brand-subtle text-brand-ink">
                    <Glyph size={12} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <span className="text-body-sm font-medium text-ink whitespace-nowrap">{indicator.label}</span>
                </li>
              );
            })}
          </motion.ul>
        </div>

        {!isDesktop && (
          <motion.div
            initial={rise}
            animate={{ opacity: 1, y: 0 }}
            transition={enter(0.66)}
            className={cn('mt-10 w-full max-w-[34rem]')}
          >
            <HeroJourney variant="spine" />
          </motion.div>
        )}
      </Container>
    </section>
  );
}
