import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Link } from '@/components/ui/Link';
import { Button } from '@/components/ui/Button';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { servicePillars } from '@/data/services';
import type { ServicePillar } from '@/types/content';
import { cn } from '@/lib/utils/cn';

/**
 * Editorial Financial Visuals (Lock 3)
 *
 * Distinctive, calm, editorial geometric illustrations tailored for each
 * service pillar. No fake tickers, projected returns, or live dashboard clutter.
 */

function MutualFundsVisual({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3.5 sm:p-4 rounded-xl bg-brand-subtle/50 dark:bg-white/[0.03] border border-brand/15 dark:border-white/10 overflow-hidden select-none">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-brand/10 dark:bg-brand/20 blur-2xl"
      />

      {/* Visual Header / Micro-label */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-widest text-brand dark:text-brand-400 font-semibold">
          Timeline Architecture
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-ink-muted dark:text-slate-400">
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full transition-colors duration-300',
              isActive ? 'bg-brand animate-pulse' : 'bg-ink-muted'
            )}
          />
          Goal-Aligned
        </span>
      </div>

      {/* Editorial SVG Compounding Curve Ribbon */}
      <div className="my-auto py-2">
        <svg viewBox="0 0 240 70" fill="none" className="w-full h-14 sm:h-16 overflow-visible" aria-hidden="true">
          {/* Faint reference grid lines */}
          <line x1="0" y1="65" x2="240" y2="65" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
          <line x1="0" y1="35" x2="240" y2="35" stroke="currentColor" strokeOpacity="0.07" strokeDasharray="3 3" />

          {/* Area under compounding curve */}
          <path
            d="M 10 60 Q 70 58, 120 44 T 230 12 L 230 65 L 10 65 Z"
            fill="url(#mf-gradient)"
            opacity={isActive ? 0.35 : 0.15}
            className="transition-opacity duration-300"
          />

          {/* Main compounding path */}
          <path
            d="M 10 60 Q 70 58, 120 44 T 230 12"
            stroke="currentColor"
            className={cn(
              'transition-all duration-500',
              isActive ? 'text-brand stroke-[2.5]' : 'text-ink-muted stroke-[1.5]'
            )}
            strokeLinecap="round"
          />

          {/* Milestone Node 1 */}
          <circle cx="10" cy="60" r="3" className="fill-surface stroke-brand stroke-2" />
          {/* Milestone Node 2 */}
          <circle cx="120" cy="44" r="3.5" className="fill-surface stroke-brand stroke-2" />
          {/* Milestone Node 3 (Active Goal) */}
          <circle
            cx="230"
            cy="12"
            r="4.5"
            className={cn(
              'transition-all duration-300',
              isActive ? 'fill-brand stroke-surface stroke-2 drop-shadow-[0_0_6px_rgba(22,104,220,0.8)]' : 'fill-ink-muted'
            )}
          />

          <defs>
            <linearGradient id="mf-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1668DC" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#1668DC" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Asset Allocation Strip */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-ink-muted dark:text-slate-400">
          <span>Disciplined Allocation Mix</span>
          <span className="font-mono text-brand dark:text-brand-400">Long-term</span>
        </div>
        <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-surface-sunken dark:bg-white/10">
          <div className="w-[55%] bg-brand transition-all duration-500" title="Equity Foundation" />
          <div className="w-[25%] bg-brand-light dark:bg-brand-400 transition-all duration-500" title="Debt Stability" />
          <div className="w-[20%] bg-slate-300 dark:bg-slate-600 transition-all duration-500" title="Hybrid / PMS" />
        </div>
      </div>
    </div>
  );
}

function InsuranceVisual({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3.5 sm:p-4 rounded-xl bg-brand-subtle/50 dark:bg-white/[0.03] border border-brand/15 dark:border-white/10 overflow-hidden select-none">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-brand/10 dark:bg-brand/20 blur-2xl"
      />

      {/* Visual Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-widest text-brand dark:text-brand-400 font-semibold">
          Protection Framework
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-ink-muted dark:text-slate-400">
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full transition-colors duration-300',
              isActive ? 'bg-brand animate-pulse' : 'bg-ink-muted'
            )}
          />
          Multi-Pillar
        </span>
      </div>

      {/* Concentric Protection Geometry SVG */}
      <div className="my-auto py-2 flex items-center justify-center">
        <svg viewBox="0 0 200 70" fill="none" className="w-full h-14 sm:h-16 overflow-visible" aria-hidden="true">
          {/* Protective Arcs */}
          <path
            d="M 20 62 C 20 25, 180 25, 180 62"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            className="text-ink-muted/60"
          />
          <path
            d="M 45 62 C 45 35, 155 35, 155 62"
            stroke="currentColor"
            strokeWidth={isActive ? '2' : '1.5'}
            className={cn('transition-colors duration-300', isActive ? 'text-brand/70' : 'text-ink-muted/40')}
          />
          <path
            d="M 70 62 C 70 45, 130 45, 130 62"
            stroke="currentColor"
            strokeWidth={isActive ? '2.5' : '1.5'}
            className={cn('transition-colors duration-300', isActive ? 'text-brand' : 'text-ink-muted')}
          />

          {/* Central Shield Marker */}
          <circle
            cx="100"
            cy="46"
            r="8"
            className={cn(
              'transition-all duration-300',
              isActive
                ? 'fill-brand/20 stroke-brand stroke-2 drop-shadow-[0_0_8px_rgba(22,104,220,0.6)]'
                : 'fill-surface stroke-ink-muted stroke-1.5'
            )}
          />
          <path
            d="M 97 46 L 99.5 48.5 L 103.5 44"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isActive ? 'text-brand dark:text-brand-400' : 'text-ink-muted'}
          />

          {/* Key coverage nodes */}
          <circle cx="30" cy="54" r="3" className="fill-surface stroke-brand stroke-1.5" />
          <circle cx="170" cy="54" r="3" className="fill-surface stroke-brand stroke-1.5" />
        </svg>
      </div>

      {/* Protection Coverage Labels */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-ink-muted dark:text-slate-400">
          <span>Life & Health Shield</span>
          <span className="font-mono text-brand dark:text-brand-400">Exclusions verified</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-center">
          <div className="py-1 px-1.5 rounded-md bg-surface-sunken dark:bg-white/5 border border-divider text-[10px] font-medium text-ink-secondary dark:text-slate-300">
            Life Cover
          </div>
          <div className="py-1 px-1.5 rounded-md bg-surface-sunken dark:bg-white/5 border border-divider text-[10px] font-medium text-ink-secondary dark:text-slate-300">
            Health Net
          </div>
          <div className="py-1 px-1.5 rounded-md bg-surface-sunken dark:bg-white/5 border border-divider text-[10px] font-medium text-ink-secondary dark:text-slate-300">
            Asset Shield
          </div>
        </div>
      </div>
    </div>
  );
}

function LoansVisual({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3.5 sm:p-4 rounded-xl bg-brand-subtle/50 dark:bg-white/[0.03] border border-brand/15 dark:border-white/10 overflow-hidden select-none">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-brand/10 dark:bg-brand/20 blur-2xl"
      />

      {/* Visual Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-widest text-brand dark:text-brand-400 font-semibold">
          Borrowing Balance
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-ink-muted dark:text-slate-400">
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full transition-colors duration-300',
              isActive ? 'bg-brand animate-pulse' : 'bg-ink-muted'
            )}
          />
          Cash-Flow Sound
        </span>
      </div>

      {/* Balanced Structural Architecture SVG */}
      <div className="my-auto py-2 flex items-center justify-center">
        <svg viewBox="0 0 220 70" fill="none" className="w-full h-14 sm:h-16 overflow-visible" aria-hidden="true">
          {/* Fulcrum and Base */}
          <path d="M 100 64 L 110 46 L 120 64 Z" className="fill-surface-sunken dark:fill-white/10 stroke-divider stroke-1" />

          {/* Balance Beam (horizontal harmony) */}
          <line
            x1="30"
            y1="46"
            x2="190"
            y2="46"
            stroke="currentColor"
            strokeWidth={isActive ? '2.5' : '1.5'}
            strokeLinecap="round"
            className={cn('transition-colors duration-300', isActive ? 'text-brand' : 'text-ink-muted')}
          />

          {/* Left Pan: Repayment EMI */}
          <path d="M 45 46 L 35 60 L 75 60 L 65 46" stroke="currentColor" strokeWidth="1.25" strokeOpacity="0.4" />
          <rect
            x="42"
            y="56"
            width="26"
            height="7"
            rx="2"
            className={cn(
              'transition-colors duration-300',
              isActive ? 'fill-brand text-white' : 'fill-surface-sunken stroke-divider'
            )}
          />

          {/* Right Pan: Living & Investment Room */}
          <path d="M 175 46 L 165 60 L 205 60 L 195 46" stroke="currentColor" strokeWidth="1.25" strokeOpacity="0.4" />
          <rect
            x="172"
            y="52"
            width="26"
            height="11"
            rx="2"
            className={cn(
              'transition-colors duration-300',
              isActive ? 'fill-brand-light dark:fill-brand-400' : 'fill-surface-sunken stroke-divider'
            )}
          />

          {/* Center Point */}
          <circle
            cx="110"
            cy="46"
            r="3.5"
            className={cn(
              'transition-all duration-300',
              isActive ? 'fill-brand stroke-surface stroke-1.5 drop-shadow-[0_0_6px_rgba(22,104,220,0.8)]' : 'fill-ink-muted'
            )}
          />
        </svg>
      </div>

      {/* Cash Flow Harmony Indicators */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-ink-muted dark:text-slate-400">
          <span>EMI vs. Living Room</span>
          <span className="font-mono text-brand dark:text-brand-400">Balanced EMI</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-ink-secondary dark:text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
          <span className="truncate">Sits safely alongside investments & living costs</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Domain badges for each service pillar
 */
const serviceDomains: Record<string, string> = {
  'mutual-funds-pms': 'Wealth & Active Portfolios',
  insurance: 'Risk & Family Protection',
  loans: 'Financing & Debt Planning',
};

/**
 * Stacked Service Card
 *
 * Implements the continuous spatial stacked-card storytelling animation on both
 * Desktop and Mobile (Lock 1).
 */
interface StackedServiceCardProps {
  service: ServicePillar;
  index: number;
  total: number;
  activeIndex: number;
  scrollYProgress: any;
  isDesktop: boolean;
  prefersReducedMotion: boolean;
  onSelect: (index: number) => void;
}

function StackedServiceCard({
  service,
  index,
  total,
  activeIndex,
  scrollYProgress,
  isDesktop,
  prefersReducedMotion,
  onSelect,
}: StackedServiceCardProps) {
  const isActive = activeIndex === index;
  const Icon = service.icon;

  // Normalized active float: maps [0, 0.85] across total services (0 to 2),
  // leaving [0.85, 1.0] as a stable dwell buffer for Service 03 before exit.
  const currentFloat = useTransform(scrollYProgress, (progress: number) => {
    const effective = Math.min(1, Math.max(0, progress) / 0.85);
    return effective * (total - 1);
  });

  // Continuous translateY in the spatial stage
  const y = useTransform(currentFloat, (curr: number) => {
    if (prefersReducedMotion) return 0;
    const delta = index - curr;

    if (delta >= 0) {
      // Upcoming cards queued underneath
      const step = isDesktop ? 26 : 18;
      return Math.min(isDesktop ? 52 : 36, delta * step);
    }

    // Previous cards gliding upward and away
    const upStep = isDesktop ? 88 : 60;
    return Math.max(isDesktop ? -130 : -90, delta * upStep);
  });

  // Scale: 1.0 at active center, subtly stepping down in stack
  const scale = useTransform(currentFloat, (curr: number) => {
    if (prefersReducedMotion) return 1;
    const delta = index - curr;

    if (delta >= 0) {
      return Math.max(0.90, 1 - delta * 0.05);
    }
    return Math.max(0.88, 1 + delta * 0.06);
  });

  // Opacity: 1.0 when active, ~0.45 when peeking, fading smoothly away on exit
  const opacity = useTransform(currentFloat, (curr: number) => {
    if (prefersReducedMotion) return activeIndex === index ? 1 : 0.08;
    const delta = index - curr;

    // Active card is always 100% solid and crisp
    if (Math.abs(delta) <= 0.4) return 1;

    // Upcoming cards queued underneath in the deck
    if (delta > 0) {
      if (delta <= 1.2) return Math.max(0.45, 1 - delta * 0.50);
      return 0.15;
    }

    // Receding cards glide up and fade out cleanly
    return Math.max(0, 1 + delta * 2.2);
  });

  // Dynamic z-index: Active card is always on top (30), upcoming queued below (20), receding recedes behind (10)
  const zIndex = useTransform(currentFloat, (curr: number) => {
    const delta = index - curr;
    if (Math.abs(delta) <= 0.4) return 30;
    if (delta > 0) {
      return Math.max(1, 20 - Math.round(delta * 5));
    }
    return Math.max(1, 10 + Math.round(delta * 5));
  });

  // Smooth disclosure opacity for detailed category tags & CTAs
  const detailOpacity = useTransform(currentFloat, (curr: number) => {
    const diff = Math.abs(index - curr);
    if (diff <= 0.4) return 1;
    if (diff >= 0.8) return 0;
    return (0.8 - diff) / 0.4;
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
        isDesktop ? 'h-[470px] lg:h-[490px]' : 'h-[390px] sm:h-[420px]',
        isActive
          ? 'border-2 border-brand-500 bg-white dark:bg-[#0a1e34] shadow-[0_20px_45px_-10px_rgba(10,27,46,0.12),0_0_25px_0_rgba(22,104,220,0.10)] dark:shadow-[0_20px_45px_-10px_rgba(22,104,220,0.35),0_0_30px_-5px_rgba(61,135,240,0.22)] cursor-default pointer-events-auto'
          : 'border border-neutral-200 bg-neutral-100 dark:border-white/10 dark:bg-[#071728] hover:border-brand/40 cursor-pointer pointer-events-auto'
      )}
    >
      <div>
        {/* Card Header Bar */}
        <div className="flex items-center justify-between gap-3 mb-2.5 sm:mb-3">
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
              <Icon size={15} strokeWidth={isActive ? 2 : 1.5} aria-hidden="true" />
            </span>

            <span
              className={cn(
                'text-[11px] sm:text-xs font-semibold tracking-wider uppercase truncate',
                isActive ? 'text-brand dark:text-brand-400' : 'text-ink-muted'
              )}
            >
              {serviceDomains[service.id] || 'Core Service'}
            </span>
          </div>

          <span className="text-xs font-mono text-ink-muted">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>

        {/* Service Title & Tagline */}
        <h3 className="font-display font-bold text-lg sm:text-2xl lg:text-3xl text-ink-display dark:text-white leading-tight">
          {service.title}
        </h3>
        <p className="mt-1 text-xs sm:text-body-sm font-medium text-brand dark:text-brand-400 leading-snug">
          {service.tagline}
        </p>

        {/* Narrative Summary */}
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-body text-ink-secondary dark:text-slate-300 leading-relaxed line-clamp-2 sm:line-clamp-none">
          {service.summary}
        </p>

        {/* Desktop Split Content & Visual Body */}
        <motion.div style={{ opacity: detailOpacity }} className="mt-3 sm:mt-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-stretch">
            {/* Left: Category Scope Pills & Bullet Highlights */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <h4 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-brand dark:text-brand-400 mb-1.5">
                  {service.categories.label}
                </h4>
                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                  {/* On desktop show all 8; on mobile show top 5 */}
                  {service.categories.items.slice(0, isDesktop ? 8 : 5).map((category) => (
                    <span
                      key={category}
                      className={cn(
                        'inline-flex items-center rounded-pill px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-medium border transition-colors',
                        isActive
                          ? 'border-brand/25 bg-brand-subtle/70 text-brand-ink dark:border-brand/40 dark:bg-brand/15 dark:text-brand-300'
                          : 'border-divider bg-surface text-ink-secondary dark:bg-white/5 dark:text-slate-400'
                      )}
                    >
                      {category}
                    </span>
                  ))}
                  {!isDesktop && service.categories.items.length > 5 && (
                    <span className="inline-flex items-center rounded-pill px-2 py-0.5 text-[10px] text-ink-muted">
                      +{service.categories.items.length - 5} more
                    </span>
                  )}
                </div>
              </div>

              {/* Highlights (Desktop view) */}
              {isDesktop && (
                <ul className="mt-3 flex flex-col gap-1.5">
                  {service.highlights.slice(0, 2).map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-2 text-xs text-ink-secondary dark:text-slate-200"
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
                      <span className="leading-snug">{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Right: Bespoke Editorial Visual Graphic (Desktop and Tablet) */}
            <div className="hidden md:flex md:col-span-5 h-[130px] lg:h-[145px]">
              {service.id === 'mutual-funds-pms' && <MutualFundsVisual isActive={isActive} />}
              {service.id === 'insurance' && <InsuranceVisual isActive={isActive} />}
              {service.id === 'loans' && <LoansVisual isActive={isActive} />}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Footer: Primary Action & Deep-Dive Link */}
      <motion.div
        style={{ opacity: detailOpacity }}
        className="mt-3 pt-3 border-t border-divider/60 dark:border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3"
      >
        <div className="flex items-center gap-3">
          <Link
            to={service.href}
            className="text-xs font-semibold text-brand hover:underline inline-flex items-center gap-1 transition-colors"
            tabIndex={isActive ? 0 : -1}
          >
            <span>More on {service.shortTitle.toLowerCase()}</span>
            <ArrowUpRight size={13} className="shrink-0" />
          </Link>
        </div>

        <Button
          to={service.nextStep.to}
          size="sm"
          trailingIcon={<ArrowRight size={14} />}
          className={cn(
            'shrink-0 w-full sm:w-auto h-8 sm:h-9 text-xs transition-all',
            !isActive && 'opacity-0 pointer-events-none'
          )}
          tabIndex={isActive ? 0 : -1}
        >
          {service.nextStep.label}
        </Button>
      </motion.div>
    </motion.div>
  );
}

/**
 * Main Services Showcase Section
 *
 * Implements the scroll-driven sticky storytelling experience titled:
 * "Three things we do, coordinated by one person."
 */
export function ServicesShowcase() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { hash } = useLocation();

  const trackRef = useRef<HTMLDivElement>(null);
  const railButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const chipContainerRef = useRef<HTMLDivElement>(null);

  // Deep-link check for arriving on /#services-insurance etc.
  const targetId = hash.replace(/^#services-/, '');
  const initialIndex = Math.max(
    0,
    servicePillars.findIndex((service) => service.id === targetId)
  );

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const totalServices = servicePillars.length;

  // Track scroll progression across the outer pinned track
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  // Sync activeIndex with continuous scroll progression
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const clamped = Math.max(0, Math.min(1, latest));
    // Maps [0, 0.85] across all 3 services with [0.85, 1.0] as stable end dwell
    const effective = Math.min(1, clamped / 0.85);
    const calculatedIndex = Math.min(
      totalServices - 1,
      Math.max(0, Math.round(effective * (totalServices - 1)))
    );
    if (calculatedIndex !== activeIndex) {
      setActiveIndex(calculatedIndex);
    }
  });

  // Direct smooth scroll to a specific service (Lock 5: Maps directly to the same scroll-progress model)
  const scrollToService = useCallback(
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

      // Maps targetIndex to the exact normalized target progress: (targetIndex / (total - 1)) * 0.85
      const normalizedTarget = (targetIndex / (totalServices - 1)) * 0.85;
      const targetScrollY = trackTop + normalizedTarget * totalScrollableDistance;

      window.scrollTo({
        top: targetScrollY,
        behavior: smooth && !prefersReducedMotion ? 'smooth' : 'auto',
      });

      setActiveIndex(targetIndex);
    },
    [totalServices, prefersReducedMotion]
  );

  // Initial deep link scroll if hash is present
  useEffect(() => {
    if (initialIndex > 0) {
      const timer = setTimeout(() => {
        scrollToService(initialIndex, false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [initialIndex, scrollToService]);

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

  // Keyboard navigation strictly scoped to the focused control (Lock 4)
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        if (activeIndex < totalServices - 1) {
          const next = activeIndex + 1;
          scrollToService(next);
          railButtonRefs.current[next]?.focus();
        }
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        if (activeIndex > 0) {
          const prev = activeIndex - 1;
          scrollToService(prev);
          railButtonRefs.current[prev]?.focus();
        }
        break;
      case 'Home':
        event.preventDefault();
        scrollToService(0);
        railButtonRefs.current[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        scrollToService(totalServices - 1);
        railButtonRefs.current[totalServices - 1]?.focus();
        break;
      default:
        break;
    }
  };

  return (
    <Section
      id="services"
      spacing="none"
      background="bg"
      className="relative overflow-visible"
      aria-labelledby="services-heading"
    >
      {/* Invisible anchor points for deep-links */}
      <div id="services-mutual-funds-pms" className="absolute top-0 -mt-24 pointer-events-none" />
      <div id="services-insurance" className="absolute top-1/3 -mt-24 pointer-events-none" />
      <div id="services-loans" className="absolute top-2/3 -mt-24 pointer-events-none" />

      {/* Ambient Radial Glow Behind the Pinned Stage */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[900px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(61,135,240,0.12),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(22,104,220,0.18),transparent_70%)] blur-3xl" />
      </div>

      {/* Adaptive Outer Scroll Track (Lock 2: Viewport-aware adaptive height) */}
      <div
        ref={trackRef}
        className="relative min-h-[220svh] sm:min-h-[250vh] lg:min-h-[280vh]"
      >
        {/* Pinned Sticky Stage */}
        <div
          className={cn(
            'sticky top-14 sm:top-16 lg:top-20 z-10',
            'h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)]',
            'flex flex-col justify-center overflow-hidden'
          )}
        >
          <Container size="shell" className="w-full h-full flex flex-col justify-center py-3 sm:py-4 lg:py-6">
            {/* Mobile / Tablet Compact Header */}
            <div className="lg:hidden flex flex-col gap-1.5 mb-2 sm:mb-3 w-full shrink-0">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand dark:text-brand-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
                  Three Core Services
                </span>
                <span className="text-xs font-mono font-bold text-ink-muted bg-surface-sunken px-2 py-0.5 rounded-pill border border-divider">
                  {String(activeIndex + 1).padStart(2, '0')} / 03
                </span>
              </div>

              <h2
                id="services-heading-mobile"
                className="text-title-lg sm:text-display-xs font-display text-ink-display leading-tight"
              >
                Three things we do, coordinated by one person.
              </h2>

              {/* Mobile Service Step Chips (Keyboard navigation scoped to tablist - Lock 4) */}
              <div
                ref={chipContainerRef}
                role="tablist"
                aria-label="Core services"
                onKeyDown={handleKeyDown}
                className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {servicePillars.map((service, index) => {
                  const isActive = activeIndex === index;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => scrollToService(index)}
                      className={cn(
                        'shrink-0 flex items-center gap-1.5 py-1 px-3 rounded-pill text-xs font-medium transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-brand',
                        isActive
                          ? 'bg-brand text-white border-brand shadow-sm font-semibold'
                          : 'bg-surface border-divider text-ink-secondary hover:text-ink dark:bg-surface-sunken'
                      )}
                    >
                      <span className="font-mono">{String(index + 1).padStart(2, '0')}</span>
                      <span>{service.shortTitle}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Stage Grid: Persistent Left Narrative + Stacked Card Stage Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center w-full flex-1 overflow-hidden">
              {/* Left Column: Persistent Editorial Narrative & Interactive Navigation Rail */}
              <div className="hidden lg:flex lg:col-span-5 flex-col justify-center pr-2 xl:pr-6">
                <div className="inline-flex items-center gap-2 rounded-pill border border-brand/20 bg-brand-subtle dark:bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-ink dark:text-brand-400 uppercase tracking-wider mb-4 w-fit">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
                  Three Core Services
                </div>

                <h2
                  id="services-heading"
                  className="text-display-sm lg:text-display-md font-display text-ink-display leading-tight tracking-tight"
                >
                  Three things we do, coordinated by one person.
                </h2>

                <p className="mt-3 max-w-prose text-body-base lg:text-body-lg text-ink-secondary">
                  Most people arrive needing one of these and leave having sorted out how all three fit together.
                </p>

                {/* Vertical Interactive Progress Rail (Keyboard navigation scoped to tablist - Lock 4) */}
                <nav
                  aria-label="Core services sequence"
                  role="tablist"
                  onKeyDown={handleKeyDown}
                  className="mt-8 relative flex flex-col gap-2.5"
                >
                  {/* Subtle Vertical Tracking Line */}
                  <div className="absolute left-[19px] top-3 bottom-3 w-px bg-divider -z-10" />

                  {servicePillars.map((service, index) => {
                    const isActive = activeIndex === index;
                    const Icon = service.icon;
                    return (
                      <button
                        key={service.id}
                        ref={(node) => {
                          railButtonRefs.current[index] = node;
                        }}
                        type="button"
                        role="tab"
                        id={`service-rail-tab-${service.id}`}
                        aria-selected={isActive}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => scrollToService(index)}
                        className={cn(
                          'group relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-action text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand',
                          isActive
                            ? 'bg-selected/90 border border-selected-border text-ink shadow-sm'
                            : 'bg-transparent border border-transparent text-ink-secondary hover:bg-hovered hover:text-ink'
                        )}
                      >
                        {/* Smooth shared active indicator line */}
                        {isActive && (
                          <motion.span
                            layoutId="active-service-rail"
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

                        <div className="flex flex-col">
                          <span
                            className={cn(
                              'font-display text-sm tracking-tight leading-snug',
                              isActive ? 'font-bold text-ink' : 'font-medium text-ink-secondary group-hover:text-ink'
                            )}
                          >
                            {service.title}
                          </span>
                          <span className="text-[11px] text-ink-muted">
                            {serviceDomains[service.id]}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </nav>

                {/* All Services Standalone Link */}
                <div className="mt-8 pt-2">
                  <Link
                    to="/services"
                    variant="standalone"
                    className="inline-flex items-center gap-1.5 font-semibold text-brand hover:underline text-body-sm"
                  >
                    <span>All services in detail</span>
                    <ArrowRight size={14} className="inline" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Controlled Spatial Stage Housing the Stacked Cards */}
              <div
                className={cn(
                  'lg:col-span-7 relative w-full flex items-center justify-center',
                  isDesktop ? 'h-[500px] lg:h-[520px]' : 'h-[410px] sm:h-[440px]'
                )}
              >
                {/* Fixed Stage Spatial Boundary */}
                <div
                  className={cn(
                    'relative w-full',
                    isDesktop ? 'max-w-[660px] h-[470px] lg:h-[490px]' : 'max-w-md h-[390px] sm:h-[420px]'
                  )}
                >
                  {servicePillars.map((service, index) => (
                    <StackedServiceCard
                      key={service.id}
                      service={service}
                      index={index}
                      total={totalServices}
                      activeIndex={activeIndex}
                      scrollYProgress={scrollYProgress}
                      isDesktop={isDesktop}
                      prefersReducedMotion={prefersReducedMotion}
                      onSelect={scrollToService}
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
