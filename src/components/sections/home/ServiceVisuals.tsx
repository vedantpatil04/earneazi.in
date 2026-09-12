import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { duration, easing } from '@/lib/motion/tokens';
import { cn } from '@/lib/utils/cn';

/**
 * One restrained mark per service line.
 *
 * ── What these are ──────────────────────────────────────────────────────
 *
 * Editorial diagrams of an *idea*, in the way a good annual report draws a
 * concept rather than charting it. Each one says the single thing its
 * service is about:
 *
 *   timeline    mutual funds & PMS — money placed against dates that are
 *               years apart, not a product picked this month.
 *   perimeter   insurance — layers of cover sized around what is behind
 *               them.
 *   balance     loans — a repayment that has to leave room for everything
 *               else.
 *
 * ── What they are not, deliberately ─────────────────────────────────────
 *
 * The previous versions had drifted into being small dashboards, and one of
 * them was stating figures the business has not signed off: a "Disciplined
 * Allocation Mix" bar split 55 / 25 / 20, plus status chips reading
 * "Exclusions verified" and "Balanced EMI". A split rendered to the pixel
 * reads as advice about an allocation, not as decoration — and the site's
 * own content rules (data/services.ts) keep rates, limits and figures out
 * of this material precisely because they are volatile or unverified.
 *
 * So: no percentages, no axis, no scale, no currency, no status readouts,
 * no live-looking chrome. Nothing here should ever be given a number.
 *
 * ── Construction ────────────────────────────────────────────────────────
 *
 * All three share a viewBox, a stroke weight, a node radius and one
 * two-state colour rule (`active` raises the mark from muted to brand and
 * thickens its primary stroke), so the set reads as one family rather than
 * as three illustrations that happen to sit near each other. Colours are
 * token references, so they follow the theme like everything else.
 */

const VIEW = { w: 240, h: 120 };

interface VisualProps {
  active: boolean;
  className?: string;
}

/** Shared frame: the label, the plate, and the sizing every mark sits in. */
function Plate({ label, active, className, children }: VisualProps & { label: string; children: React.ReactNode }) {
  return (
    <figure
      className={cn(
        'relative flex h-full w-full flex-col justify-between overflow-hidden rounded-surface border p-3.5',
        'transition-[border-color,background-color] duration-base ease-out',
        active ? 'border-brand/30 bg-brand-subtle/60' : 'border-divider bg-surface-sunken',
        className
      )}
    >
      <figcaption className="font-display text-legal font-semibold uppercase tracking-[0.12em] text-ink-muted">
        {label}
      </figcaption>
      <svg
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        fill="none"
        aria-hidden="true"
        className="mt-2 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {children}
      </svg>
    </figure>
  );
}

/** The drawn stroke, shared so all three marks animate identically. */
function Draw({ d, active, primary = false, dashed = false }: { d: string; active: boolean; primary?: boolean; dashed?: boolean }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  return (
    <motion.path
      d={d}
      stroke={primary ? 'rgb(var(--color-brand))' : 'rgb(var(--color-text-muted))'}
      strokeWidth={primary && active ? 2.5 : 1.5}
      strokeLinecap="round"
      strokeDasharray={dashed ? '4 4' : undefined}
      opacity={primary ? 1 : 0.55}
      className="transition-[stroke-width] duration-base ease-out"
      initial={prefersReducedMotion ? false : { pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, margin: '-64px 0px' }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: duration.story, ease: easing.out }}
    />
  );
}

/** A point on a mark. Filled when the service is the one being read. */
function Node({ cx, cy, active, lead = false }: { cx: number; cy: number; active: boolean; lead?: boolean }) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={lead ? 5 : 3.5}
      className="transition-[fill,stroke] duration-base ease-out"
      fill={active && lead ? 'rgb(var(--color-brand))' : 'rgb(var(--color-surface))'}
      stroke={active ? 'rgb(var(--color-brand))' : 'rgb(var(--color-text-muted))'}
      strokeWidth={2}
    />
  );
}

/* ── Mutual funds & PMS — the timeline ─────────────────────────────────── */

export function TimelineMark({ active, className }: VisualProps) {
  return (
    <Plate label="One timeline" active={active} className={className}>
      {/* The ground the goals sit on. Not an axis: it carries no scale. */}
      <Draw d="M 14 104 L 226 104" active={active} dashed />
      <Draw d="M 20 96 C 74 92, 112 74, 146 56 C 178 40, 202 26, 222 18" active={active} primary />
      <Node cx={20} cy={96} active={active} />
      <Node cx={146} cy={56} active={active} />
      <Node cx={222} cy={18} active={active} lead />
      {/* Three ticks — near, middle, far. Order, not duration. */}
      {[20, 146, 222].map((x) => (
        <line key={x} x1={x} y1={100} x2={x} y2={108} stroke="rgb(var(--color-text-muted))" strokeWidth={1.5} opacity={0.55} />
      ))}
    </Plate>
  );
}

/* ── Insurance — the perimeter ─────────────────────────────────────────── */

export function PerimeterMark({ active, className }: VisualProps) {
  return (
    <Plate label="Layers of cover" active={active} className={className}>
      <Draw d="M 22 104 C 22 26, 218 26, 218 104" active={active} dashed />
      <Draw d="M 56 104 C 56 46, 184 46, 184 104" active={active} />
      <Draw d="M 90 104 C 90 66, 150 66, 150 104" active={active} primary />
      {/* What the layers are around. */}
      <Node cx={120} cy={88} active={active} lead />
      <Draw d="M 14 104 L 226 104" active={active} />
    </Plate>
  );
}

/* ── Loans — the balance ───────────────────────────────────────────────── */

export function BalanceMark({ active, className }: VisualProps) {
  return (
    <Plate label="What it leaves room for" active={active} className={className}>
      {/* Fulcrum. */}
      <path d="M 108 100 L 120 66 L 132 100 Z" fill="rgb(var(--color-text-muted))" opacity={0.28} />
      <Draw d="M 14 104 L 226 104" active={active} dashed />
      {/* The beam sits level: the point is that it balances, not that one
          side wins. */}
      <Draw d="M 38 66 L 202 66" active={active} primary />
      <Draw d="M 38 66 L 38 82" active={active} />
      <Draw d="M 202 66 L 202 82" active={active} />
      <rect
        x={18}
        y={82}
        width={40}
        height={14}
        rx={3}
        className="transition-[fill] duration-base ease-out"
        fill={active ? 'rgb(var(--color-brand))' : 'rgb(var(--color-text-muted))'}
        opacity={active ? 1 : 0.4}
      />
      <rect
        x={182}
        y={82}
        width={40}
        height={14}
        rx={3}
        fill="none"
        stroke={active ? 'rgb(var(--color-brand))' : 'rgb(var(--color-text-muted))'}
        strokeWidth={2}
        opacity={active ? 1 : 0.5}
      />
      <Node cx={120} cy={66} active={active} lead />
    </Plate>
  );
}

/** The mark for a service, by id. One lookup so callers do not branch. */
export const serviceMarks: Record<string, (props: VisualProps) => JSX.Element> = {
  'mutual-funds-pms': TimelineMark,
  insurance: PerimeterMark,
  loans: BalanceMark,
};
