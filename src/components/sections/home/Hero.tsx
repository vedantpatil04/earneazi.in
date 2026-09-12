import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Target,
  ShieldCheck,
  Layers,
  MessageCircle,
  Home,
  GraduationCap,
  Armchair,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { contactWhatsApp } from '@/data/contact';
import {
  goalDeepLink,
  heroActions,
  heroAxis,
  heroEyebrow,
  heroFloatingDetail,
  heroHeadlineAccent,
  heroIllustrativeNote,
  heroMilestones,
  heroSubheadline,
  heroTrustIndicators,
} from '@/data/hero';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { duration, easing, travel } from '@/lib/motion/tokens';
import { cn } from '@/lib/utils/cn';
import { HeroVisual } from './HeroVisual';

/**
 * Large Immersive Financial-Advisory Hero Section
 *
 * Full-width cinematic composition pairing:
 * - Left narrative: Eyebrow, bold typography with Earneazi blue accent,
 *   supporting copy, primary & secondary CTAs, and compact trust proof points.
 * - Full-bleed photographic background: Aspirational family/future sunset visual
 *   with integrated financial journey trajectory and floating milestones.
 * - Responsive: On desktop, the wide ascending trajectory floats across the sky.
 *   On mobile/tablet, the exact same financial journey is rendered in a compact,
 *   touch-friendly trajectory stage integrated into the photographic scene.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const parallaxEnabled = isDesktop && !prefersReducedMotion;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, -travel.sm]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);
  const planY = useTransform(scrollYProgress, [0, 1], [0, -travel.md]);
  const areaOpacity = useTransform(scrollYProgress, [0, 0.6], [0.8, 1]);

  const t = (seconds: number, delay = 0) =>
    prefersReducedMotion ? { duration: 0 } : { duration: seconds, delay, ease: easing.out };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className="relative w-full overflow-hidden min-h-[640px] md:min-h-[720px] lg:min-h-[790px] flex items-center pt-6 pb-12 sm:pt-10 sm:pb-14 md:py-16 lg:py-20"
    >
      {/* ── 1. Immersive Full-Bleed Background Visual Stage ── */}
      <HeroVisual
        compact={!isDesktop}
        depth={parallaxEnabled ? { imageY, imageScale, planY, areaOpacity } : undefined}
      />

      {/* ── 2. Foreground Content Layer ── */}
      <Container size="shell" className="relative z-10 w-full">
        <div className="max-w-xl lg:max-w-[680px]">
          {/* Eyebrow badge: "YOUR FINANCIAL PARTNER" */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: travel.sm }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(duration.base, 0.05)}
            className="inline-flex items-center gap-2 rounded-pill px-3 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs font-bold tracking-wider uppercase mb-3.5 sm:mb-5 backdrop-blur-sm border shadow-sm bg-brand/10 text-brand-600 border-brand/20 dark:bg-brand/15 dark:text-brand-400 dark:border-brand/30"
          >
            <span className="h-2 w-2 rounded-pill bg-brand animate-pulse" />
            <span>{heroEyebrow}</span>
          </motion.div>

          {/* Headline: Responsive scale & deliberate line break for highlighted blue phrase */}
          <h1
            id="hero-heading"
            className="font-display font-extrabold text-[2.25rem] min-[390px]:text-[2.55rem] sm:text-[3.15rem] md:text-[3.65rem] lg:text-[4.15rem] leading-[1.06] tracking-tight text-slate-950 dark:text-white"
          >
            <span className="block">One advisor</span>
            <span className="block">for every money</span>
            <span className="block text-brand dark:text-[#4B99FA] max-w-[12ch] sm:max-w-none sm:whitespace-nowrap">
              {heroHeadlineAccent}
            </span>
          </h1>

          {/* Concise Financial-Advisory Subheadline */}
          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: travel.sm }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(duration.slow, 0.25)}
            className="mt-4 sm:mt-6 max-w-xl text-base sm:text-lg md:text-[19px] font-normal leading-relaxed text-slate-700 dark:text-slate-200"
          >
            {heroSubheadline}
          </motion.p>

          {/* Primary & Secondary CTAs (Touch-friendly & full-width on mobile) */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: travel.sm }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(duration.slow, 0.38)}
            className="mt-6 sm:mt-7 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
          >
            <Button
              to={heroActions.primary.to}
              size="lg"
              variant="primary"
              className="w-full sm:w-auto justify-center px-7 py-3.5 text-base font-semibold shadow-lg shadow-brand/25 text-white tracking-tight"
            >
              {heroActions.primary.label}
            </Button>

            {contactWhatsApp ? (
              <Button
                href={`https://wa.me/${contactWhatsApp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="lg"
                leadingIcon={<MessageCircle size={19} strokeWidth={1.5} aria-hidden="true" />}
                className="w-full sm:w-auto justify-center px-6 py-3.5 text-base font-semibold border-slate-300 text-slate-800 hover:bg-slate-100 dark:border-white/25 dark:text-white dark:hover:bg-white/10"
              >
                Message on WhatsApp
              </Button>
            ) : (
              <Button
                to={heroActions.secondary.to}
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto justify-center px-6 py-3.5 text-base font-semibold border-slate-300 text-slate-800 hover:bg-slate-100 dark:border-white/25 dark:text-white dark:hover:bg-white/10"
              >
                {heroActions.secondary.label}
              </Button>
            )}
          </motion.div>

          {/* Refined Trust Indicators (2-col grid on mobile, inline row on sm+) */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={t(duration.slow, 0.5)}
            className="mt-7 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-200/90 dark:border-white/15 grid grid-cols-2 min-[560px]:flex min-[560px]:flex-wrap items-center gap-y-3 gap-x-4 sm:gap-x-6"
          >
            {heroTrustIndicators.map((indicator, idx) => {
              const Icon =
                indicator.iconKey === 'target'
                  ? Target
                  : indicator.iconKey === 'shield'
                  ? ShieldCheck
                  : Layers;

              return (
                <div
                  key={indicator.label}
                  className={cn(
                    'flex items-center gap-2 sm:gap-2.5',
                    idx === 2 ? 'col-span-2 min-[560px]:col-span-1' : ''
                  )}
                >
                  <div className="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                    <Icon size={14} strokeWidth={2.25} aria-hidden="true" />
                  </div>
                  <span className="text-[12px] sm:text-[13.5px] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                    {indicator.label}
                  </span>
                  {idx < heroTrustIndicators.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="hidden min-[560px]:block h-3.5 w-px ml-3 bg-slate-300 dark:bg-white/20"
                    />
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* ── 3. Compact Financial Journey Visualization (Mobile & Tablet: < 1024px) ── */}
        {!isDesktop && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(duration.slow, 0.55)}
            className="mt-8 sm:mt-10 w-full max-w-xl"
          >
            <div
              className={cn(
                'relative w-full rounded-2xl p-4 sm:p-6 overflow-hidden border backdrop-blur-md shadow-xl transition-colors duration-fast',
                'bg-white/85 border-slate-200/90 text-slate-900',
                'dark:bg-[#061424]/85 dark:border-white/15 dark:text-white'
              )}
            >
              {/* Header row: Axis indicator & Floating Detail badge */}
              <div className="flex items-center justify-between gap-2 pb-3.5 mb-4 border-b border-slate-200/80 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-brand animate-ping" />
                  <span className="text-[11px] font-bold tracking-wider uppercase text-slate-700 dark:text-slate-300">
                    Financial Journey
                  </span>
                </div>

                <div className="flex items-center gap-1.5 rounded-pill px-2.5 py-1 bg-brand/10 text-brand dark:bg-brand/15 dark:text-brand-400 border border-brand/20">
                  <Sparkles size={12} aria-hidden="true" />
                  <span className="text-[10.5px] font-bold tracking-tight">
                    {heroFloatingDetail.title}
                  </span>
                </div>
              </div>

              {/* The Vertical Ascending Trajectory Spine */}
              <div className="relative pl-6 sm:pl-8">
                {/* Continuous Glowing Trajectory Line */}
                <div
                  aria-hidden="true"
                  className="absolute left-[13px] sm:left-[17px] top-3 bottom-5 w-[3px] rounded-full bg-gradient-to-b from-brand via-brand-500 to-[#4B99FA] shadow-[0_0_12px_rgba(var(--color-brand),0.4)]"
                />

                {/* Start Node: TODAY */}
                <div className="relative flex items-center gap-3 pb-5 sm:pb-6">
                  <div className="absolute -left-[20px] sm:-left-[24px] flex h-4 w-4 items-center justify-center rounded-full bg-white ring-4 ring-brand/30 dark:bg-[#061424]">
                    <span className="h-2 w-2 rounded-full bg-brand" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 bg-slate-200/90 text-slate-800 dark:bg-white/10 dark:text-slate-200 text-[10.5px] font-bold tracking-wider uppercase">
                    {heroAxis.start}
                  </div>
                </div>

                {/* Milestone Cards: Buy a home, Fund education, Plan retirement */}
                <div className="space-y-3.5 sm:space-y-4 pb-5">
                  {heroMilestones.map((m, index) => {
                    const Icon =
                      m.goalId === 'buy-a-home'
                        ? Home
                        : m.goalId === 'fund-education'
                        ? GraduationCap
                        : Armchair;

                    const title =
                      m.goalId === 'buy-a-home'
                        ? 'Buy a home'
                        : m.goalId === 'fund-education'
                        ? 'Fund education'
                        : 'Plan retirement';

                    return (
                      <div key={m.goalId} className="relative group">
                        {/* Glowing bead on trajectory line */}
                        <div className="absolute -left-[20px] sm:-left-[24px] top-3 flex h-4 w-4 items-center justify-center rounded-full bg-white ring-4 ring-brand/40 group-hover:scale-125 transition-transform dark:bg-[#061424]">
                          <span className="h-2 w-2 rounded-full bg-brand" />
                        </div>

                        {/* Editorial Annotation Card */}
                        <Link
                          to={goalDeepLink(m.goalId)}
                          className={cn(
                            'block rounded-xl p-3 sm:p-3.5 border backdrop-blur-sm transition-all duration-instant',
                            'bg-white/95 border-slate-200/90 hover:border-brand hover:shadow-md text-slate-900',
                            'dark:bg-[#081b30]/95 dark:border-white/15 dark:text-white dark:hover:border-brand-400'
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-slate-950 dark:text-white">
                              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand dark:bg-brand/20 dark:text-brand-400">
                                <Icon size={14} strokeWidth={2} aria-hidden="true" />
                              </div>
                              <span>{title}</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                              0{index + 1}
                            </span>
                          </div>
                          <p className="mt-1 text-[11.5px] sm:text-xs text-slate-600 dark:text-slate-300 leading-normal pl-8">
                            {m.line}
                          </p>
                        </Link>
                      </div>
                    );
                  })}
                </div>

                {/* Final Destination Node: A BRIGHTER TOMORROW */}
                <div className="relative flex items-center gap-3 pt-1">
                  <div className="absolute -left-[22px] sm:-left-[26px] flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white shadow-md shadow-brand/40">
                    <Sparkles size={11} aria-hidden="true" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-pill px-3.5 py-1.5 bg-brand text-white text-xs font-bold tracking-tight shadow-md shadow-brand/30">
                    <Sparkles size={12} aria-hidden="true" />
                    <span>{heroAxis.end}</span>
                  </div>
                </div>
              </div>

              {/* Bottom metadata inside mobile stage */}
              <div className="mt-5 pt-3 border-t border-slate-200/70 dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                <span className="font-semibold tracking-wider uppercase text-[10px]">
                  TODAY → GOALS → PROGRESS → FUTURE
                </span>
                <span>{heroIllustrativeNote}</span>
              </div>
            </div>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
