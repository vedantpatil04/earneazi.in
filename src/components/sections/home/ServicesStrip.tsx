import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShieldCheck,
  Landmark,
  Target,
  Calculator,
  Headphones,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: typeof TrendingUp;
}

const servicesList: ServiceItem[] = [
  {
    id: 'mutual-funds',
    title: 'Mutual Funds & PMS',
    description: 'Wealth & active portfolios',
    href: '/services#mutual-funds-pms',
    icon: TrendingUp,
  },
  {
    id: 'insurance',
    title: 'Insurance',
    description: 'Life & health coverage',
    href: '/services#insurance',
    icon: ShieldCheck,
  },
  {
    id: 'loans',
    title: 'Loans',
    description: 'Home & personal solutions',
    href: '/services#loans',
    icon: Landmark,
  },
  {
    id: 'financial-goals',
    title: 'Financial Goals',
    description: 'Milestone roadmaps',
    href: '/financial-goals',
    icon: Target,
  },
  {
    id: 'sip-calculator',
    title: 'SIP Calculator',
    description: 'Wealth compounding tool',
    href: '/sip-calculator',
    icon: Calculator,
  },
  {
    id: 'talk-to-advisor',
    title: 'Talk to an Advisor',
    description: 'Certified 1-on-1 guidance',
    href: '/contact',
    icon: Headphones,
  },
];

/**
 * Secondary Financial Services Rail
 *
 * Sits directly below the navbar. Features continuous infinite movement
 * that pauses on hover, with seamless loop transition and refined edge fades.
 * Mobile refined: compact height, touch-friendly, no overflow.
 */
export function ServicesStrip() {
  return (
    <div
      className={cn(
        'relative z-20 border-b overflow-hidden select-none transition-colors duration-fast',
        /* Light mode */
        'bg-[#F1F5F9] border-slate-200 text-slate-800',
        /* Dark mode */
        'dark:bg-[#081729] dark:border-[#162D47] dark:text-slate-200'
      )}
      role="region"
      aria-label="Core Financial Services"
    >
      {/* Edge gradient scrims for smooth gradual fade in/out */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-10 sm:w-16 md:w-28 bg-gradient-to-r from-[#F1F5F9] via-[#F1F5F9]/80 to-transparent dark:from-[#081729] dark:via-[#081729]/80"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-10 sm:w-16 md:w-28 bg-gradient-to-l from-[#F1F5F9] via-[#F1F5F9]/80 to-transparent dark:from-[#081729] dark:via-[#081729]/80"
      />

      <div className="flex w-full overflow-hidden py-2.5 sm:py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="animate-marquee flex items-center shrink-0">
          {/* Duplicate list twice for seamless infinite looping */}
          {[...servicesList, ...servicesList].map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={`${service.id}-${index}`} className="flex items-center">
                <Link
                  to={service.href}
                  className={cn(
                    'group flex items-center gap-2.5 sm:gap-3.5 px-4 sm:px-6 py-1 rounded-action transition-all duration-instant',
                    'hover:bg-slate-200/70 active:bg-slate-300/60 dark:hover:bg-white/5 dark:active:bg-white/10'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-[8px] transition-colors duration-instant',
                      'bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white',
                      'dark:bg-brand/15 dark:text-brand-400'
                    )}
                  >
                    <Icon size={15} strokeWidth={2} aria-hidden="true" />
                  </div>

                  <div className="flex flex-col text-left whitespace-nowrap">
                    <span className="text-[12.5px] sm:text-[13.5px] font-semibold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors dark:text-white dark:group-hover:text-brand-400">
                      {service.title}
                    </span>
                    <span className="text-[11px] sm:text-[11.5px] leading-tight text-slate-500 dark:text-slate-400 mt-0.5">
                      {service.description}
                    </span>
                  </div>
                </Link>

                {/* Vertical clean separator */}
                <div
                  aria-hidden="true"
                  className="h-4 sm:h-5 w-px mx-1.5 sm:mx-2 bg-slate-300/80 dark:bg-white/15"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
