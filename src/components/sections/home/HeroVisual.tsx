import { useState } from 'react';
import type { MotionValue } from 'framer-motion';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Home,
  GraduationCap,
  Armchair,
  Sparkles,
} from 'lucide-react';
import {
  goalDeepLink,
  heroAxis,
  heroFloatingDetail,
  heroIllustrativeNote,
  heroMilestones,
} from '@/data/hero';
import { heroImage, toSrcSet } from '@/data/media';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { duration, easing } from '@/lib/motion/tokens';
import { cn } from '@/lib/utils/cn';

interface MilestoneItem {
  goalId: string;
  title: string;
  line: string;
  icon: typeof Home;
  x: number;
  y: number;
  leftPct: number;
  topPct: number;
  delay: number;
}

const MILESTONE_CONFIG: Record<string, { title: string; icon: typeof Home }> = {
  'buy-a-home': { title: 'Buy a home', icon: Home },
  'fund-education': { title: 'Fund education', icon: GraduationCap },
  'plan-retirement': { title: 'Plan retirement', icon: Armchair },
};

export interface HeroVisualProps {
  compact: boolean;
  depth?: {
    imageY: MotionValue<number>;
    imageScale: MotionValue<number>;
    planY: MotionValue<number>;
    areaOpacity: MotionValue<number>;
  };
}

/**
 * Large Immersive Hero Visual Stage
 *
 * Requirements:
 * - Large full-width photographic background
 * - Aspirational family / sunset landscape clearly visible in both light & dark modes
 * - Controlled editorial readability gradient (responsive for desktop and mobile)
 * - Desktop: Wide ascending financial journey trajectory across the open sky
 * - Inwardly positioned "A brighter tomorrow" destination & floating detail card
 * - Full Dark Mode & Light Mode parity
 */
export function HeroVisual({ compact, depth }: HeroVisualProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);

  const t = (seconds: number, delay = 0) =>
    prefersReducedMotion ? { duration: 0 } : { duration: seconds, delay, ease: easing.out };

  // Responsive coordinates for wide canvas (1200 x 700)
  const WIDE_VIEW = { width: 1200, height: 700 };
  
  // Smooth ascending curve placed in the open sky/horizon, completely clear of the left narrative
  // and landing inward at x: 1115 (well inside the 1200 boundary).
  const trajectoryPath =
    'M 680 520 C 730 470, 765 430, 800 410 C 855 370, 895 325, 935 285 C 980 235, 1015 195, 1050 170 C 1075 145, 1095 120, 1115 105';
  const areaFillPath = `${trajectoryPath} L 1115 660 L 680 660 Z`;

  // Milestone points positioned along the curve
  const desktopMilestones: MilestoneItem[] = [
    {
      goalId: heroMilestones[0].goalId,
      title: MILESTONE_CONFIG[heroMilestones[0].goalId]?.title ?? 'Buy a home',
      line: heroMilestones[0].line,
      icon: MILESTONE_CONFIG[heroMilestones[0].goalId]?.icon ?? Home,
      x: 800,
      y: 410,
      leftPct: (800 / WIDE_VIEW.width) * 100,
      topPct: (410 / WIDE_VIEW.height) * 100,
      delay: 0.55,
    },
    {
      goalId: heroMilestones[1].goalId,
      title: MILESTONE_CONFIG[heroMilestones[1].goalId]?.title ?? 'Fund education',
      line: heroMilestones[1].line,
      icon: MILESTONE_CONFIG[heroMilestones[1].goalId]?.icon ?? GraduationCap,
      x: 935,
      y: 285,
      leftPct: (935 / WIDE_VIEW.width) * 100,
      topPct: (285 / WIDE_VIEW.height) * 100,
      delay: 0.72,
    },
    {
      goalId: heroMilestones[2].goalId,
      title: MILESTONE_CONFIG[heroMilestones[2].goalId]?.title ?? 'Plan retirement',
      line: heroMilestones[2].line,
      icon: MILESTONE_CONFIG[heroMilestones[2].goalId]?.icon ?? Armchair,
      x: 1050,
      y: 170,
      leftPct: (1050 / WIDE_VIEW.width) * 100,
      topPct: (170 / WIDE_VIEW.height) * 100,
      delay: 0.88,
    },
  ];

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none select-none">
      {/* ── 1. Full-Bleed Aspirational Photograph ───────────────────────── */}
      <motion.div
        className="absolute inset-0 h-full w-full"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={t(duration.slow, 0.15)}
      >
        <motion.picture
          className="block h-full w-full"
          initial={prefersReducedMotion ? false : { scale: 1.04 }}
          animate={{ scale: 1 }}
          transition={t(duration.story, 0.15)}
          style={depth ? { y: depth.imageY, scale: depth.imageScale } : undefined}
        >
          <source type="image/webp" srcSet={toSrcSet(heroImage.webp)} sizes="100vw" />
          <img
            src={heroImage.src ?? undefined}
            srcSet={toSrcSet(heroImage.jpeg)}
            sizes="100vw"
            width={heroImage.width}
            height={heroImage.height}
            alt="Family looking toward their future from a scenic hilltop at sunset"
            decoding="async"
            fetchPriority="high"
            className="h-full w-full object-cover object-[58%_45%] md:object-[68%_45%] lg:object-[72%_45%]"
          />
        </motion.picture>
      </motion.div>

      {/* ── 2. Cinematic Editorial Gradient Scrim Layers ────────────────── */}
      {/* On desktop: left-to-right gradient ensuring high text contrast while letting the sunset photo shine.
          On mobile/tablet: gentle vertical gradient ensuring high text contrast while preserving the photo depth. */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-0 pointer-events-none transition-opacity duration-fast',
          /* Mobile / Tablet vertical gradient: strong top readability with clear photo visibility below */
          'bg-gradient-to-b from-[#F6F7F9]/96 via-[#F6F7F9]/86 via-45% to-[#F6F7F9]/40',
          'dark:from-[#061424]/96 dark:via-[#061424]/86 dark:via-45% dark:to-[#061424]/45',
          /* Desktop horizontal gradient: solid on narrative, then opens to sunset photo */
          'lg:bg-gradient-to-r lg:from-[#F6F7F9] lg:via-[#F6F7F9]/96 lg:via-42% lg:to-[#F6F7F9]/20 lg:to-64% lg:to-transparent lg:to-75%',
          'dark:lg:from-[#061424] dark:lg:via-[#061424]/96 dark:lg:via-42% dark:lg:to-[#061424]/25 dark:lg:to-64% dark:lg:to-transparent dark:lg:to-75%'
        )}
      />

      {/* Gentle vertical bottom vignette to transition smoothly into the next section */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#F6F7F9]/80 dark:from-[#061424]/80 to-transparent pointer-events-none"
      />

      {/* ── 3. Desktop Floating Detail Card (Desktop only, positioned inward) ── */}
      {!compact && (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(duration.slow, 0.45)}
          className="pointer-events-auto hidden lg:flex absolute top-8 right-10 lg:top-9 lg:right-16 xl:right-20 z-20"
        >
          <div
            className={cn(
              'flex items-center gap-3 rounded-surface px-4 py-2.5 backdrop-blur-md shadow-xl border transition-all duration-instant',
              'bg-white/92 border-slate-200/90 text-slate-900',
              'dark:bg-[#061424]/85 dark:border-white/15 dark:text-white',
              'hover:scale-[1.02] hover:border-brand/50'
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-brand/15 text-brand">
              <Sparkles size={16} strokeWidth={2} aria-hidden="true" />
            </div>
            <div>
              <span className="block text-xs font-bold tracking-tight text-slate-900 dark:text-white">
                {heroFloatingDetail.title}
              </span>
              <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-300">
                {heroFloatingDetail.subtitle}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── 4. Desktop Financial Journey Trajectory (Desktop: 1024px+) ─────────── */}
      {!compact && (
        <div className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block">
          <svg
            viewBox={`0 0 ${WIDE_VIEW.width} ${WIDE_VIEW.height}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
            role="img"
            aria-label="Illustrative financial journey curve from Today through Buy a home, Fund education, Plan retirement to A brighter tomorrow"
          >
            <defs>
              <linearGradient id="hero-journey-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(var(--color-brand))" stopOpacity="0.22" />
                <stop offset="70%" stopColor="rgb(var(--color-brand))" stopOpacity="0.04" />
                <stop offset="100%" stopColor="rgb(var(--color-brand))" stopOpacity="0" />
              </linearGradient>

              <filter id="hero-glow-bloom" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Area under the path */}
            <motion.path
              d={areaFillPath}
              fill="url(#hero-journey-fill)"
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={t(duration.slow, 0.45)}
            />

            {/* Glowing trajectory backdrop stroke */}
            <motion.path
              d={trajectoryPath}
              fill="none"
              stroke="rgb(var(--color-brand))"
              strokeWidth="5"
              strokeOpacity="0.4"
              strokeLinecap="round"
              filter="url(#hero-glow-bloom)"
              initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={t(duration.story, 0.4)}
            />

            {/* Crisp primary curve line */}
            <motion.path
              d={trajectoryPath}
              fill="none"
              stroke="rgb(var(--color-brand))"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={t(duration.story, 0.4)}
            />

            {/* Leader lines from curve to milestone annotations */}
            {desktopMilestones.map((m) => {
              const isActive = activeId === m.goalId;
              return (
                <motion.line
                  key={`stem-${m.goalId}`}
                  x1={m.x}
                  y1={m.y + 8}
                  x2={m.x}
                  y2={m.y + 40}
                  stroke={isActive ? 'rgb(var(--color-brand))' : 'rgba(100, 116, 139, 0.5)'}
                  strokeWidth={isActive ? '2' : '1.25'}
                  strokeDasharray={isActive ? 'none' : '3 3'}
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={t(duration.base, m.delay + 0.08)}
                />
              );
            })}
          </svg>

          {/* Start node: TODAY */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={t(duration.base, 0.4)}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            style={{ left: `${(680 / WIDE_VIEW.width) * 100}%`, top: `${(520 / WIDE_VIEW.height) * 100}%` }}
          >
            <div className="flex items-center gap-2 rounded-pill px-3 py-1 bg-white/95 border border-slate-300/90 text-slate-800 shadow-md dark:bg-[#061424]/90 dark:border-brand/50 dark:text-white">
              <span className="h-2 w-2 rounded-pill bg-brand animate-ping" />
              <span className="text-[11px] font-bold tracking-wider uppercase">
                {heroAxis.start}
              </span>
            </div>
          </motion.div>

          {/* Interactive milestone markers and editorial annotation cards */}
          {desktopMilestones.map((milestone) => {
            const isActive = activeId === milestone.goalId;
            const Icon = milestone.icon;

            return (
              <div key={milestone.goalId} className="pointer-events-auto">
                {/* Glowing bead on curve */}
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={t(duration.base, milestone.delay)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{ left: `${milestone.leftPct}%`, top: `${milestone.topPct}%` }}
                >
                  <Link
                    to={goalDeepLink(milestone.goalId)}
                    aria-label={`Milestone: ${milestone.title}`}
                    tabIndex={-1}
                    aria-hidden="true"
                    onMouseEnter={() => setActiveId(milestone.goalId)}
                    onMouseLeave={() => setActiveId(null)}
                    className="relative flex items-center justify-center h-5 w-5"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute -inset-1 rounded-pill transition-all duration-instant',
                        isActive
                          ? 'bg-brand/50 scale-150 ring-4 ring-brand/60'
                          : 'bg-brand/25 ring-1 ring-brand/40'
                      )}
                    />
                    <span className="relative h-3 w-3 rounded-pill bg-white ring-2 ring-brand" />
                  </Link>
                </motion.div>

                {/* Editorial Milestone Annotation Card */}
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={t(duration.base, milestone.delay + 0.1)}
                  className="absolute -translate-x-1/2 z-20"
                  style={{
                    left: `${milestone.leftPct}%`,
                    top: `${((milestone.y + 42) / WIDE_VIEW.height) * 100}%`,
                  }}
                >
                  <Link
                    to={goalDeepLink(milestone.goalId)}
                    aria-label={`${milestone.title} — ${milestone.line}`}
                    onMouseEnter={() => setActiveId(milestone.goalId)}
                    onMouseLeave={() => setActiveId(null)}
                    onFocus={() => setActiveId(milestone.goalId)}
                    onBlur={() => setActiveId(null)}
                    className={cn(
                      'group block w-[155px] rounded-action p-2.5 backdrop-blur-md shadow-lg border transition-all duration-instant',
                      'bg-white/95 text-slate-900 border-slate-200/90',
                      'dark:bg-[#061424]/90 dark:text-white dark:border-white/20',
                      isActive
                        ? 'scale-105 border-brand ring-2 ring-brand/40 shadow-brand/25 shadow-2xl'
                        : 'hover:border-slate-400 dark:hover:border-white/40'
                    )}
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-900 dark:text-white">
                      <Icon size={14} className="text-brand shrink-0" aria-hidden="true" />
                      <span className="truncate">{milestone.title}</span>
                    </div>
                    <span className="block pt-1 text-[11px] leading-tight text-slate-500 group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-white">
                      {milestone.line}
                    </span>
                  </Link>
                </motion.div>
              </div>
            );
          })}

          {/* Final destination node: A brighter tomorrow */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={t(duration.base, 0.95)}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-20"
            style={{ left: `${(1115 / WIDE_VIEW.width) * 100}%`, top: `${(105 / WIDE_VIEW.height) * 100}%` }}
          >
            <div className="flex items-center gap-1.5 rounded-pill px-3.5 py-1.5 bg-brand text-white shadow-lg shadow-brand/25 border border-white/25">
              <Sparkles size={13} aria-hidden="true" />
              <span className="text-xs font-bold tracking-tight">
                {heroAxis.end}
              </span>
            </div>
          </motion.div>

          {/* Qualitative progression indicator & disclaimer at bottom */}
          <div className="absolute inset-x-0 bottom-6 sm:bottom-7 px-8 flex items-center justify-between text-[11.5px] font-medium text-slate-600 dark:text-slate-400 pointer-events-none">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-pill bg-brand" />
              <span className="tracking-wider uppercase text-[11px]">TODAY → GOALS → PROGRESS → FUTURE</span>
            </span>
            <span className="hidden sm:inline">
              {heroIllustrativeNote}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
