import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { duration, easing } from '@/lib/motion/tokens';
import { cn } from '@/lib/utils/cn';

/**
 * One editorial mark per service line — Phase 3.
 *
 * ── What these are ──────────────────────────────────────────────────────
 *
 * Diagrams of an *idea*, in the way a good annual report draws a concept
 * rather than charting it. Each says the single thing its service is about:
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
 * No percentages, no axis, no scale, no currency, no status readouts, no
 * live-looking chrome, and nothing that could be read as a split or an
 * allocation. An earlier version of this file carried a "Disciplined
 * Allocation Mix" bar divided 55 / 25 / 20 — a split rendered to the pixel
 * reads as advice about an allocation, and the site's content rules
 * (data/services.ts) keep figures out of this material precisely because
 * they are volatile, unverified, or both. Nothing here may ever be given a
 * number.
 *
 * ── What Phase 3 changed ────────────────────────────────────────────────
 *
 * The marks were correct and colourless: three grey line drawings that made
 * the services section read as one long monochrome block. They now carry
 * their subject's accent through the tone channel (see the SUBJECT TONE
 * CHANNEL block in globals.css) — every stroke, fill and gradient below
 * resolves from --tone, so the same component renders blue for funds, teal
 * for insurance and violet for loans, in both themes, without naming a
 * colour.
 *
 * Depth is layered rather than applied: a soft tone field behind the plate,
 * a dot grid over it, then the mark. The gradients are inside the artwork —
 * §10.3 bans gradient as a *surface* fill and permits it where it encodes
 * magnitude, which is exactly what the area under a rising line does.
 *
 * Construction is shared: one viewBox, one stroke weight, one node radius
 * and one two-state colour rule (`active` raises the mark from muted to
 * tone and thickens its primary stroke), so the set reads as one family.
 */

const VIEW = { w: 300, h: 170 };

interface VisualProps {
  /** True when this service is the one being read. Accents rise; nothing moves. */
  active: boolean;
  className?: string;
}

/** Shared frame: the field, the texture, the caption and the sizing. */
function Plate({
  label,
  active,
  className,
  markId,
  children,
}: VisualProps & { label: string; markId: string; children: ReactNode }) {
  return (
    <figure
      className={cn(
        'relative flex h-full w-full flex-col justify-between overflow-hidden rounded-surface border p-4',
        'transition-[border-color,background-color] duration-base ease-out',
        active ? 'border-tone/30 bg-tone-tint' : 'border-divider bg-surface-sunken',
        className
      )}
    >
      {/*
        The field. One soft radial of the subject's own colour, behind
        everything — depth as light in a room rather than as a glow on each
        element (tokens.css, AMBIENCE). It strengthens on the active panel,
        which is part of how the active state reads without anything moving.
      */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-pill bg-tone blur-3xl',
          'transition-opacity duration-slow ease-out',
          active ? 'opacity-20' : 'opacity-[0.07]'
        )}
      />

      <figcaption className="relative font-display text-legal font-semibold uppercase tracking-[0.12em] text-ink-muted">
        {label}
      </figcaption>

      <svg
        viewBox={'0 0 ' + VIEW.w + ' ' + VIEW.h}
        fill="none"
        aria-hidden="true"
        className="relative mt-3 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Area fill under a rising line. Encodes magnitude, which is the
              one thing §10.3 permits a gradient to do. */}
          <linearGradient id={markId + '-area'} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(var(--tone))" stopOpacity={active ? 0.3 : 0.14} />
            <stop offset="100%" stopColor="rgb(var(--tone))" stopOpacity="0" />
          </linearGradient>
          {/* The texture. A dot grid at low alpha, so the plate is a surface
              with a weave rather than an empty rectangle. */}
          <pattern id={markId + '-grid'} width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="1.4" cy="1.4" r="1.1" fill="rgb(var(--tone))" opacity="0.16" />
          </pattern>
        </defs>
        <rect width={VIEW.w} height={VIEW.h} fill={'url(#' + markId + '-grid)'} />
        {children}
      </svg>
    </figure>
  );
}

/** The drawn stroke, shared so all three marks animate identically. */
function Draw({
  d,
  active,
  primary = false,
  dashed = false,
  delay = 0,
}: {
  d: string;
  active: boolean;
  primary?: boolean;
  dashed?: boolean;
  delay?: number;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  return (
    <motion.path
      d={d}
      stroke={primary ? 'rgb(var(--tone))' : 'rgb(var(--color-text-muted))'}
      strokeWidth={primary && active ? 2.75 : 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dashed ? '4 5' : undefined}
      opacity={primary ? 1 : 0.5}
      className="transition-[stroke-width] duration-base ease-out"
      initial={prefersReducedMotion ? false : { pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, margin: '-64px 0px' }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: duration.story, delay, ease: easing.out }}
    />
  );
}

/** A point on a mark. Filled when the service is the one being read. */
function Node({ cx, cy, active, lead = false }: { cx: number; cy: number; active: boolean; lead?: boolean }) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={lead ? 6 : 4}
      className="transition-[fill,stroke] duration-base ease-out"
      fill={active && lead ? 'rgb(var(--tone))' : 'rgb(var(--color-surface))'}
      stroke={active ? 'rgb(var(--tone))' : 'rgb(var(--color-text-muted))'}
      strokeWidth={2.25}
    />
  );
}

/* ── Mutual funds & PMS — the timeline ─────────────────────────────────── */

const TIMELINE_PATH = 'M 26 132 C 84 126, 130 100, 170 74 C 208 50, 248 32, 276 24';

/** Columns standing under the line — placed money, at intervals. */
const TIMELINE_COLUMNS: Array<[number, number]> = [
  [64, 122],
  [102, 112],
  [140, 96],
  [178, 78],
  [216, 60],
];

export function TimelineMark({ active, className }: VisualProps) {
  return (
    <Plate label="One timeline" active={active} className={className} markId="mark-timeline">
      <path d={TIMELINE_PATH + ' L 276 144 L 26 144 Z'} fill="url(#mark-timeline-area)" />

      {/* The ground the goals sit on. Not an axis: it carries no scale. */}
      <Draw d="M 18 144 L 284 144" active={active} dashed />

      {TIMELINE_COLUMNS.map(([x, y], index) => (
        <rect
          key={x}
          x={x - 6}
          y={y}
          width={12}
          height={144 - y}
          rx={3}
          className="transition-[fill-opacity] duration-base ease-out"
          fill="rgb(var(--tone))"
          fillOpacity={active ? 0.2 + index * 0.05 : 0.1 + index * 0.02}
        />
      ))}

      <Draw d={TIMELINE_PATH} active={active} primary />

      {/* Three ticks — near, middle, far. Order, not duration. */}
      {[26, 170, 276].map((x) => (
        <line
          key={x}
          x1={x}
          y1={140}
          x2={x}
          y2={150}
          stroke="rgb(var(--color-text-muted))"
          strokeWidth={1.5}
          opacity={0.5}
        />
      ))}

      <Node cx={26} cy={132} active={active} />
      <Node cx={170} cy={74} active={active} />
      <Node cx={276} cy={24} active={active} lead />
    </Plate>
  );
}

/* ── Insurance — the perimeter ─────────────────────────────────────────── */

/** Three arcs around one point. Each is a layer of cover; the point is what
    the layers are around. Nothing states how much any layer is worth. */
const PERIMETER_LAYERS = [
  { d: 'M 30 146 C 30 34, 270 34, 270 146', fill: 0.06 },
  { d: 'M 70 146 C 70 58, 230 58, 230 146', fill: 0.1 },
  { d: 'M 110 146 C 110 84, 190 84, 190 146', fill: 0.16 },
];

export function PerimeterMark({ active, className }: VisualProps) {
  return (
    <Plate label="Layers of cover" active={active} className={className} markId="mark-perimeter">
      {PERIMETER_LAYERS.map((layer) => (
        <path
          key={layer.d}
          d={layer.d + ' Z'}
          className="transition-[fill-opacity] duration-base ease-out"
          fill="rgb(var(--tone))"
          fillOpacity={active ? layer.fill : layer.fill * 0.45}
        />
      ))}

      <Draw d={PERIMETER_LAYERS[0].d} active={active} dashed />
      <Draw d={PERIMETER_LAYERS[1].d} active={active} delay={0.08} />
      <Draw d={PERIMETER_LAYERS[2].d} active={active} primary delay={0.16} />
      <Draw d="M 18 146 L 282 146" active={active} />

      {/* What the layers are around. */}
      <Node cx={150} cy={124} active={active} lead />
    </Plate>
  );
}

/* ── Loans — the balance ───────────────────────────────────────────────── */

export function BalanceMark({ active, className }: VisualProps) {
  /*
    The beam sits level. That is the whole statement: a repayment has to
    leave room for everything else, so neither side wins. Deliberately not a
    bar divided into parts — a divided bar reads as a proportion, and a
    proportion here would be a claim about affordability.
  */
  return (
    <Plate label="What it leaves room for" active={active} className={className} markId="mark-balance">
      {/* Fulcrum. */}
      <path
        d="M 132 138 L 150 86 L 168 138 Z"
        className="transition-[fill-opacity] duration-base ease-out"
        fill="rgb(var(--tone))"
        fillOpacity={active ? 0.22 : 0.1}
      />

      <Draw d="M 18 146 L 282 146" active={active} dashed />
      <Draw d="M 46 86 L 254 86" active={active} primary />
      <Draw d="M 46 86 L 46 106" active={active} delay={0.1} />
      <Draw d="M 254 86 L 254 106" active={active} delay={0.1} />

      {/* The repayment: a solid weight. */}
      <rect
        x={22}
        y={106}
        width={48}
        height={18}
        rx={4}
        className="transition-[fill-opacity] duration-base ease-out"
        fill="rgb(var(--tone))"
        fillOpacity={active ? 1 : 0.42}
      />
      {/* Everything else: the same size, drawn as an outline, because it is
          what the repayment has to leave room for rather than a second cost. */}
      <rect
        x={230}
        y={106}
        width={48}
        height={18}
        rx={4}
        fill="none"
        className="transition-[stroke] duration-base ease-out"
        stroke={active ? 'rgb(var(--tone))' : 'rgb(var(--color-text-muted))'}
        strokeWidth={2.25}
        opacity={active ? 1 : 0.55}
      />

      <Node cx={150} cy={86} active={active} lead />
    </Plate>
  );
}

/** The mark for a service, by id. One lookup so callers do not branch. */
export const serviceMarks: Record<string, (props: VisualProps) => JSX.Element> = {
  'mutual-funds-pms': TimelineMark,
  insurance: PerimeterMark,
  loans: BalanceMark,
};
