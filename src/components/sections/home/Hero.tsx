import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Target, ShieldCheck, Layers, ArrowRight, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { DimensionalText } from '@/components/brand/DimensionalText';
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
 *             scrim; the journey ascends through the soft right side of the
 *             photograph, positioned over the whole frame rather than inside
 *             a column so the curve is free to run edge to edge.
 *   <1024px   the photograph as a band across the top with the narrative
 *             rising onto its fade, then the same journey as a vertical
 *             spine in a panel beneath it. Not a stripped-down hero: the same
 *             photograph, the same claim, the same three milestones, drawn
 *             along the axis the viewport actually has.
 *
 * ── Depth — Enhancement A ───────────────────────────────────────────────
 *
 * The hero carries the page's one dimensional headline: the closing phrase,
 * "decision that matters.", set in the brand blue over a stepped brand
 * extrusion (DimensionalText). It resolves after the headline has risen, so
 * the depth arrives as the last beat of the entrance rather than competing
 * with it, and the rest of the headline stays flat ink so the phrase is the
 * only thing that stands forward. Everything else over the photograph is
 * glass or lit — the floating note, the proof row's marks — in the same
 * depth language as the rest of the site.
 *
 * ── Motion ──────────────────────────────────────────────────────────────
 *
 * One entrance, staged: eyebrow, then the headline, then the supporting
 * copy, then the actions, then the proof row — each starting before the
 * last has finished, so it reads as one movement settling rather than as
 * five elements taking turns. The journey draws itself against the same
 * clock.
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
      /* Below 1024px the photograph is a band across the top of the hero
         (see HeroVisual) and the narrative starts halfway down it, so the
         picture is seen first and the eyebrow lands on its fade. The band is
         a little over a third of the small viewport height — `svh`, the
         height with the browser's bars showing — so on a phone the headline
         and the first action share the opening screen with the picture
         rather than waiting under it. From 1024px the padding is the
         approved desktop value. */
      className="relative flex min-h-[36rem] w-full items-center overflow-hidden pb-14 pt-[calc(var(--hero-band)*0.5)] [--hero-band:clamp(14rem,38svh,24rem)] md:min-h-[41rem] md:pb-16 lg:min-h-[44rem] lg:py-20"
    >
      <HeroVisual
        depth={parallax ? { imageY, imageScale } : undefined}
        reveal={!isDesktop && !prefersReducedMotion}
      />

      {/* The journey is a sibling of the content column, not a child of it,
          so the curve can run past the container's right edge. */}
      {isDesktop && (
        <HeroJourney variant="path" depth={parallax ? { y: journeyY } : undefined} className="inset-y-12 left-0 right-0" />
      )}

      {/* ── Floating note ── */}
      {isDesktop && (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={enter(0.42)}
          className="pointer-events-auto absolute right-10 top-7 z-20 hidden lg:flex xl:right-16"
        >
          <div
            className={cn(
              'glass flex items-center gap-3 rounded-surface border border-divider/70 px-4 py-2.5 text-ink-display',
              'transition-[border-color] duration-instant ease-out hover:border-brand/40'
            )}
          >
            <div className="lit flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-brand text-on-brand">
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
            className="mt-4 text-[clamp(1.85rem,7vw,2.35rem)] font-bold leading-[1.08] tracking-[-0.03em] text-ink-display sm:text-[2.75rem] md:text-[3.15rem] lg:text-[3.25rem] xl:text-[3.55rem]"
          >
            <span className="block">One advisor</span>
            <span className="block">for every money</span>
            <DimensionalText
              tone="brand"
              delay={560}
              className="inline max-w-full text-brand-ink lg:inline-block lg:whitespace-nowrap"
            >
              {heroHeadlineAccent}
            </DimensionalText>
          </motion.h1>

          <motion.p
            initial={rise}
            animate={{ opacity: 1, y: 0 }}
            transition={enter(0.34)}
            className="mt-5 max-w-[28rem] text-body-lg leading-relaxed text-ink-secondary lg:max-w-[31rem] xl:max-w-[33rem]"
          >
            {heroSubheadline}
          </motion.p>

          <motion.div
            initial={rise}
            animate={{ opacity: 1, y: 0 }}
            transition={enter(0.44)}
            /* The floating WhatsApp button steps aside while this row is under it. */
            data-conversion-suppress=""
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
              The hero's conversation entry point, through the shared control
              that decides the destination once for every entry point on the
              site and keeps one label either way.
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
            /* Clean responsive row: flex-wrap on sm/md without hanging dividers; dividers show only on non-wrapping xl. */
            className="mt-8 flex w-full flex-col gap-y-3 border-t border-divider pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 xl:flex-nowrap xl:gap-x-4"
          >
            {heroTrustIndicators.map((indicator, idx) => {
              const Glyph = trustIcons[indicator.iconKey] ?? Target;
              return (
                <li key={indicator.label} className="flex items-center gap-2 xl:shrink-0">
                  {idx > 0 && (
                    <span className="mr-1.5 hidden h-3 w-px bg-divider xl:inline-block" aria-hidden="true" />
                  )}
                  <span className="lit flex h-6 w-6 shrink-0 items-center justify-center rounded-pill bg-brand text-on-brand">
                    <Glyph size={13} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <span className="whitespace-nowrap text-body-sm font-medium text-ink">{indicator.label}</span>
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
            className="mt-10 w-full max-w-[34rem]"
          >
            <HeroJourney variant="spine" />
          </motion.div>
        )}
      </Container>
    </section>
  );
}
