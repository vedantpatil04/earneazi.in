import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { duration, easing } from '@/lib/motion/tokens';
import { MarkPlate, Prism, Slab, SphereNode } from './MarkPlate';

/**
 * One editorial mark per service line — Phase 3, given depth in
 * Enhancement A.
 *
 * ── What these are ──────────────────────────────────────────────────────
 *
 * Diagrams of an *idea*, in the way a good annual report draws a concept
 * rather than charting it. Each says the single thing its service is about:
 *
 *   timeline    mutual funds — money placed against dates that are
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
 * allocation. A split rendered to the pixel reads as advice about an
 * allocation, and the site's content rules (data/services.ts) keep figures
 * out of this material precisely because they are volatile, unverified, or
 * both. Nothing here may ever be given a number.
 *
 * ── Colour ──────────────────────────────────────────────────────────────
 *
 * Every stroke, fill and gradient resolves from the tone channel (see the
 * SUBJECT TONE CHANNEL block in globals.css), so the same component renders
 * blue for funds, teal for insurance and violet for loans, in both themes,
 * without naming a colour.
 *
 * ── Depth — Enhancement A ───────────────────────────────────────────────
 *
 * These are the "selected service visuals" the brief asks to make
 * dimensional, and they are the only drawings on the page built as objects:
 * the timeline's columns are prisms with a lit top and a shaded side, the
 * layers of cover are slabs with thickness, the loan's fulcrum is a lit and
 * a shaded face, and the point each mark is about is the brand's sphere.
 * The plate itself leans toward a fine pointer (MarkPlate). Lighting is by
 * overlay, so the light comes from the same place in both themes.
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

/** A point on a mark. The point a mark is about becomes the sphere when active. */
function Node({
  cx,
  cy,
  active,
  lead = false,
  markId,
}: {
  cx: number;
  cy: number;
  active: boolean;
  lead?: boolean;
  markId: string;
}) {
  if (lead && active) return <SphereNode cx={cx} cy={cy} r={7} markId={markId} />;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={lead ? 6 : 4}
      className="transition-[fill,stroke] duration-base ease-out"
      fill="rgb(var(--color-surface))"
      stroke={active ? 'rgb(var(--tone))' : 'rgb(var(--color-text-muted))'}
      strokeWidth={2.25}
    />
  );
}

/* ── Mutual funds — the timeline ───────────────────────────────────────── */

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
  const markId = 'mark-timeline';

  return (
    <MarkPlate label="One timeline" markId={markId} view={VIEW} active={active} className={className}>
      <path d={TIMELINE_PATH + ' L 276 144 L 26 144 Z'} fill={`url(#${markId}-area)`} />

      {/* The ground the goals sit on. Not an axis: it carries no scale. */}
      <Draw d="M 18 144 L 284 144" active={active} dashed />

      {TIMELINE_COLUMNS.map(([x, y], index) => (
        <Prism
          key={x}
          x={x - 6}
          y={y}
          width={12}
          base={144}
          depth={5}
          strength={active ? 0.22 + index * 0.06 : 0.1 + index * 0.025}
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

      <Node cx={26} cy={132} active={active} markId={markId} />
      <Node cx={170} cy={74} active={active} markId={markId} />
      <Node cx={276} cy={24} active={active} lead markId={markId} />
    </MarkPlate>
  );
}

/* ── Insurance — the perimeter ─────────────────────────────────────────── */

/** Three arcs around one point. Each is a layer of cover; the point is what
    the layers are around. Nothing states how much any layer is worth. */
const PERIMETER_LAYERS = [
  { d: 'M 30 146 C 30 34, 270 34, 270 146', fill: 0.07 },
  { d: 'M 70 146 C 70 58, 230 58, 230 146', fill: 0.11 },
  { d: 'M 110 146 C 110 84, 190 84, 190 146', fill: 0.17 },
];

export function PerimeterMark({ active, className }: VisualProps) {
  const markId = 'mark-perimeter';

  return (
    <MarkPlate label="Layers of cover" markId={markId} view={VIEW} active={active} className={className}>
      {/* Each layer of cover is a slab with thickness, stacked outer to inner. */}
      {PERIMETER_LAYERS.map((layer) => (
        <Slab key={layer.d} d={layer.d + ' Z'} strength={active ? layer.fill : layer.fill * 0.45} dx={0} dy={5} />
      ))}

      <Draw d={PERIMETER_LAYERS[0].d} active={active} dashed />
      <Draw d={PERIMETER_LAYERS[1].d} active={active} delay={0.08} />
      <Draw d={PERIMETER_LAYERS[2].d} active={active} primary delay={0.16} />
      <Draw d="M 18 146 L 282 146" active={active} />

      {/* What the layers are around. */}
      <Node cx={150} cy={124} active={active} lead markId={markId} />
    </MarkPlate>
  );
}

/* ── Loans — the balance ───────────────────────────────────────────────── */

export function BalanceMark({ active, className }: VisualProps) {
  const markId = 'mark-balance';
  const faceStrength = active ? 0.3 : 0.14;

  /*
    The beam sits level. That is the whole statement: a repayment has to
    leave room for everything else, so neither side wins. Deliberately not a
    bar divided into parts — a divided bar reads as a proportion, and a
    proportion here would be a claim about affordability.
  */
  return (
    <MarkPlate label="What it leaves room for" markId={markId} view={VIEW} active={active} className={className}>
      {/* Fulcrum: a lit face and a shaded face. */}
      <path d="M 132 138 L 150 86 L 150 138 Z" fill="rgb(var(--tone))" fillOpacity={faceStrength} />
      <path d="M 132 138 L 150 86 L 150 138 Z" fill="rgb(255 255 255)" fillOpacity={0.22} />
      <path d="M 150 86 L 168 138 L 150 138 Z" fill="rgb(var(--tone))" fillOpacity={faceStrength} />
      <path d="M 150 86 L 168 138 L 150 138 Z" fill="rgb(0 0 0)" fillOpacity={0.14} />

      <Draw d="M 18 146 L 282 146" active={active} dashed />

      {/* The beam as a plank with a top edge, with the drawn line along it. */}
      <Prism x={46} y={86} width={208} base={91} depth={4} strength={active ? 0.32 : 0.14} />
      <Draw d="M 46 86 L 254 86" active={active} primary />
      <Draw d="M 46 91 L 46 106" active={active} delay={0.1} />
      <Draw d="M 254 91 L 254 106" active={active} delay={0.1} />

      {/* The repayment: a solid block. */}
      <Prism x={22} y={106} width={48} base={124} depth={5} strength={active ? 1 : 0.42} />

      {/* Everything else: the same block drawn as an outline, because it is
          what the repayment has to leave room for rather than a second cost. */}
      <g
        fill="none"
        stroke={active ? 'rgb(var(--tone))' : 'rgb(var(--color-text-muted))'}
        strokeWidth={2.25}
        strokeLinejoin="round"
        opacity={active ? 1 : 0.55}
        className="transition-[stroke] duration-base ease-out"
      >
        <rect x={230} y={106} width={48} height={18} rx={3} />
        <path d="M 233 106 L 238 101 L 283 101 L 283 119 L 278 124" />
      </g>

      <Node cx={150} cy={86} active={active} lead markId={markId} />
    </MarkPlate>
  );
}

/** The mark for a service, by id. One lookup so callers do not branch. */
export const serviceMarks: Record<string, (props: VisualProps) => JSX.Element> = {
  'mutual-funds': TimelineMark,
  insurance: PerimeterMark,
  loans: BalanceMark,
};
