import { useState } from 'react';
import type { MotionValue } from 'framer-motion';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { goalDeepLink, heroAxis, heroMilestones } from '@/data/hero';
import { goalEntries } from '@/data/services';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { duration, easing } from '@/lib/motion/tokens';
import { cn } from '@/lib/utils/cn';

/**
 * The goal trajectory — Phase 0 §20.
 *
 * Drawn into the hero photograph rather than beside it: the line rises
 * through the same sky the people in the picture are looking into, so the
 * two read as one scene. That is the whole argument for the composition —
 * the photograph is people considering what is ahead, and this is the same
 * idea stated as a diagram.
 *
 * It is a diagram of an idea, not a chart of a number. Three goals in the
 * order people usually reach them, on an axis that runs Today → Later. No
 * value axis, no rupee figure, no percentage, because a line carrying
 * figures would be an invented projection.
 *
 * Bespoke inline SVG, so the hero's LCP never waits on a charting library
 * (§30).
 *
 * ── How it avoids the photograph ─────────────────────────────────────────
 * The curve is placed so that across the horizontal band the group occupies
 * it stays well above their heads, and the milestone pills sit above the
 * curve in open sky. The pills never intersect each other either: the curve
 * climbs fast enough that each pill's vertical band is clear of the next,
 * so even where two overlap horizontally on a narrow desktop they read as a
 * staircase rather than a pile.
 *
 * ── Accessibility architecture ───────────────────────────────────────────
 * A `role="img"` element hides its own subtree from assistive technology, so
 * interactive markers cannot live inside one. The SVG is one described
 * picture; the milestones are real HTML links laid over it, each with its
 * own accessible name, and the dots on the line are pointer-only mirrors of
 * those links, kept out of the tab order so no goal is announced twice.
 *
 * `activeId` is what keeps a dot and its pill in step, and it is the only
 * piece of state in the hero.
 */

type Point = readonly [number, number];
/** start, control 1, control 2, end. */
type Segment = readonly [Point, Point, Point, Point];

interface Geometry {
  readonly width: number;
  readonly height: number;
  readonly segments: readonly Segment[];
  /** Baseline the area fill closes on to. */
  readonly areaBase: number;
}

/*
  Panel units, matched to the canvas's own 2:1 ratio so a position expressed
  as a percentage of this box lands in the same place on the photograph.

  The group of people occupies roughly x 384–1088 and everything below
  y 392. The curve is shaped to stay above that band with room to spare —
  changing these numbers means re-checking it against the photograph.
*/
const WIDE: Geometry = {
  width: 1600,
  height: 800,
  segments: [
    [
      [600, 320],
      [760, 306],
      [900, 280],
      [1060, 238],
    ],
    [
      [1060, 238],
      [1210, 198],
      [1340, 156],
      [1496, 116],
    ],
  ],
  areaBase: 470,
};

/*
  On a phone the canvas crops to the middle of the frame, which is mostly
  people, so the line moves down into the foreground where there is a strong
  scrim to draw on, and the labels become a chip row rather than pills on the
  path.
*/
const COMPACT: Geometry = {
  width: 700,
  height: 400,
  segments: [
    [
      [30, 330],
      [150, 324],
      [250, 308],
      [360, 282],
    ],
    [
      [360, 282],
      [470, 256],
      [560, 226],
      [670, 190],
    ],
  ],
  areaBase: 380,
};

/* ── Motion timings ───────────────────────────────────────────────────────
   Built from the Phase 1 motion tokens and choreographed as one sequence:
   the line draws, then each milestone lands as the line reaches it. */
const DRAW_DELAY = 0.52;
const DRAW_DURATION = duration.story;

function cubicAt([p0, p1, p2, p3]: Segment, t: number): Point {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
}

/**
 * Samples a curve into a polyline with a cumulative length table, so a point
 * can be found at any fraction along it.
 *
 * This replaces `path.getPointAtLength()`, and not only to avoid a layout
 * read: measuring the DOM means the markers cannot exist until after the
 * path has rendered, which puts them in a second commit — and an element
 * mounting in a second commit misses the entrance animation every other
 * element is playing. Deriving the points from the same numbers that draw
 * the curve puts the whole composition in one render.
 */
function buildCurve(geometry: Geometry) {
  const SAMPLES = 240;
  const points: Point[] = [];

  geometry.segments.forEach((segment, index) => {
    // Skip each segment's first point except the first, so the knot shared
    // by two segments is not sampled twice.
    for (let i = index === 0 ? 0 : 1; i <= SAMPLES; i += 1) {
      points.push(cubicAt(segment, i / SAMPLES));
    }
  });

  const cumulative: number[] = [0];
  for (let i = 1; i < points.length; i += 1) {
    cumulative.push(cumulative[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
  }
  const total = cumulative[cumulative.length - 1];

  const pointAt = (fraction: number): Point => {
    const target = total * Math.min(Math.max(fraction, 0), 1);
    let low = 0;
    let high = cumulative.length - 1;
    while (low < high) {
      const mid = (low + high) >> 1;
      if (cumulative[mid] < target) low = mid + 1;
      else high = mid;
    }
    return points[low];
  };

  const [start] = geometry.segments[0];
  const end = geometry.segments[geometry.segments.length - 1][3];

  const d = geometry.segments
    .map(([, c1, c2, tip], index) =>
      index === 0
        ? `M ${start[0]} ${start[1]} C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${tip[0]} ${tip[1]}`
        : `C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${tip[0]} ${tip[1]}`
    )
    .join(' ');

  const areaD = `${d} L ${end[0]} ${geometry.areaBase} L ${start[0]} ${geometry.areaBase} Z`;

  return { d, areaD, pointAt, start, end };
}

const CURVES = { wide: buildCurve(WIDE), compact: buildCurve(COMPACT) };

interface Marker {
  goalId: string;
  title: string;
  line: string;
  icon: (typeof goalEntries)[number]['icon'];
  /** Position on the line, as a percentage of the canvas. */
  left: number;
  top: number;
  /** Raw panel units, for the SVG's own drawing. */
  x: number;
  y: number;
  /** Seconds after mount at which this milestone lands on the line. */
  delay: number;
}

function buildMarkers(curve: ReturnType<typeof buildCurve>, geometry: Geometry): Marker[] {
  return heroMilestones.map((milestone) => {
    const [x, y] = curve.pointAt(milestone.at);
    const goal = goalEntries.find((entry) => entry.id === milestone.goalId);

    return {
      goalId: milestone.goalId,
      title: goal?.title ?? milestone.goalId,
      line: milestone.line,
      icon: goal?.icon ?? goalEntries[0].icon,
      left: (x / geometry.width) * 100,
      top: (y / geometry.height) * 100,
      x,
      y,
      delay: DRAW_DELAY + DRAW_DURATION * milestone.at,
    };
  });
}

const MARKERS = {
  wide: buildMarkers(CURVES.wide, WIDE),
  compact: buildMarkers(CURVES.compact, COMPACT),
};

interface HeroTrajectoryProps {
  /** Below 1024px: a shorter line low in the frame, with labels as a chip row. */
  compact: boolean;
  /**
   * Scroll-linked depth, owned by the Hero so the whole composition shares
   * one scroll subscription. Omitted wherever scroll-linked motion is off.
   */
  depth?: { planY: MotionValue<number>; areaOpacity: MotionValue<number> };
}

export function HeroTrajectory({ compact, depth }: HeroTrajectoryProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);

  const isWide = !compact;
  const geometry = isWide ? WIDE : COMPACT;
  const curve = isWide ? CURVES.wide : CURVES.compact;
  const markers = isWide ? MARKERS.wide : MARKERS.compact;

  /** Resolves a transition to nothing when the reader has asked for no motion. */
  const t = (seconds: number, delay = 0) =>
    prefersReducedMotion ? { duration: 0 } : { duration: seconds, delay, ease: easing.out };

  const pct = (units: number, axis: 'x' | 'y') =>
    (units / (axis === 'x' ? geometry.width : geometry.height)) * 100;

  return (
    <motion.div
      /*
        Wide: an overlay across the whole canvas, so the line runs through
        the sky the people in the photograph are looking into.

        Compact: a band of its own at the foot of the hero. Stretched over
        the full canvas at phone width the line would cut straight through
        the copy and the buttons — there is no diagonal across a tall narrow
        frame that misses them.
      */
      /*
        One position class, not two: `absolute` and `relative` set the same
        property, and Tailwind emits `.relative` after `.absolute`, so listing
        both silently made the desktop overlay a normal in-flow block.
      */
      className={isWide ? 'absolute inset-0' : 'relative h-48 w-full'}
      style={depth ? { y: depth.planY } : undefined}
    >
      <svg
        viewBox={`0 0 ${geometry.width} ${geometry.height}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label={`An illustration of a rising line marking three goals in the order people usually reach them: ${markers
          .map((marker) => marker.title)
          .join(', ')}. It runs from ${heroAxis.start} to ${heroAxis.end} and carries no values — it shows the order goals arrive in, not returns.`}
      >
        <defs>
          {/* The one gradient permitted on this site, because it encodes
              magnitude rather than decorating a surface (§10.3). */}
          <linearGradient id="hero-trajectory-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(var(--color-hero-line))" stopOpacity="0.28" />
            <stop offset="100%" stopColor="rgb(var(--color-hero-line))" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Entrance opacity and scroll-linked opacity live on separate
            elements — one animates, the other is driven by a motion value,
            and they would otherwise fight over the same property. */}
        <motion.g
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={t(duration.slow, DRAW_DELAY + DRAW_DURATION * 0.4)}
        >
          <motion.path
            d={curve.areaD}
            fill="url(#hero-trajectory-fill)"
            style={depth ? { opacity: depth.areaOpacity } : undefined}
          />
        </motion.g>

        <motion.path
          d={curve.d}
          fill="none"
          stroke="rgb(var(--color-hero-line))"
          strokeWidth="2.5"
          strokeLinecap="round"
          /* The box is stretched to the canvas, so without this the stroke
             stretches with it and reads thinner at one end than the other. */
          vectorEffect="non-scaling-stroke"
          initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={t(DRAW_DURATION, DRAW_DELAY)}
        />

        {/* A short stem from each marker up to its pill, so the pairing is
            unambiguous without the pill having to touch the line. */}
        {isWide &&
          markers.map((marker) => (
            <motion.line
              key={`stem-${marker.goalId}`}
              x1={marker.x}
              y1={marker.y - 9}
              x2={marker.x}
              y2={marker.y - 20}
              stroke="rgb(var(--color-hero-line))"
              strokeOpacity="0.55"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={t(duration.base, marker.delay + 0.06)}
            />
          ))}
      </svg>

      {/* The dots. Clickable, because a reader will try — but the pill
          carries the accessible control, so these stay out of the tab order
          and out of the accessibility tree. */}
      {markers.map((marker) => (
        <motion.div
          key={`dot-${marker.goalId}`}
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={t(duration.base, marker.delay)}
          className="absolute"
          style={{ left: `${marker.left}%`, top: `${marker.top}%` }}
        >
          <Link
            to={goalDeepLink(marker.goalId)}
            aria-hidden="true"
            tabIndex={-1}
            onMouseEnter={() => setActiveId(marker.goalId)}
            onMouseLeave={() => setActiveId(null)}
            className="absolute -left-[22px] -top-[22px] block h-11 w-11 rounded-pill"
          >
            <span
              className={cn(
                'absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-pill',
                'bg-hero-line ring-[3px] ring-hero-ring',
                'transition-transform motion-safe:duration-instant ease-out',
                activeId === marker.goalId && 'motion-safe:scale-[1.45]'
              )}
            />
          </Link>
        </motion.div>
      ))}

      {/* ── Milestone pills (wide) ──────────────────────────────────────
          Each sits in open sky above its own point on the line, carrying the
          goal's own icon from the services data rather than a second icon
          set invented for the hero. */}
      {isWide &&
        markers.map((marker) => {
          const Glyph = marker.icon;
          return (
            <motion.div
              key={`pill-${marker.goalId}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={t(duration.base, marker.delay + 0.08)}
              className="absolute"
              style={{ left: `${marker.left}%`, top: `${pct(marker.y - 22, 'y')}%` }}
            >
              {/*
                The offset lives on a plain element, not on the animated one:
                Framer writes the entrance into an inline `transform`, which
                would overwrite a Tailwind translate on the same node and
                leave every pill hanging to the right of its marker.
              */}
              <div className="-translate-x-1/2 -translate-y-full">
                <Link
                  to={goalDeepLink(marker.goalId)}
                  aria-label={`${marker.title} — ${marker.line} Opens the ${marker.title} goal.`}
                  onMouseEnter={() => setActiveId(marker.goalId)}
                  onMouseLeave={() => setActiveId(null)}
                  onFocus={() => setActiveId(marker.goalId)}
                  onBlur={() => setActiveId(null)}
                  className={cn(
                    'group flex min-h-11 items-center gap-2 whitespace-nowrap rounded-pill border px-3.5',
                    'hero-chip text-body-sm font-semibold',
                    'transition-[background-color,border-color,box-shadow] motion-safe:duration-instant ease-out',
                    activeId === marker.goalId && 'hero-chip--active'
                  )}
                >
                  <Glyph size={18} strokeWidth={1.75} aria-hidden="true" className="shrink-0 text-hero-line" />
                  {marker.title}
                </Link>
              </div>
            </motion.div>
          );
        })}

      {/* Qualitative axis, anchored to the line's own ends. Sentence case —
          §8.4 rules out all-caps labels — and no values, because this is not
          a value axis. */}
      {/*
        The offsets live on plain elements rather than on the animated ones:
        Framer writes the entrance into an inline `transform`, which would
        overwrite a Tailwind translate on the same node and leave both labels
        hanging off the end of the line they belong to.
      */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={t(duration.base, DRAW_DELAY)}
        className="absolute"
        style={{ left: `${pct(curve.start[0], 'x')}%`, top: `${pct(curve.start[1], 'y')}%` }}
      >
        <span className="hero-axis block -translate-x-1/2 translate-y-3 text-body-sm">{heroAxis.start}</span>
      </motion.div>
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={t(duration.base, DRAW_DELAY + DRAW_DURATION * 0.8)}
        className="absolute"
        style={{ left: `${pct(curve.end[0], 'x')}%`, top: `${pct(curve.end[1], 'y')}%` }}
      >
        <span className="hero-axis block -translate-x-full translate-y-3 text-body-sm">{heroAxis.end}</span>
      </motion.div>

      {/* ── Milestone chips (compact) ───────────────────────────────────
          A scroll-snapping row along the foot of the canvas rather than
          pills on the path: at phone width three pills cannot sit on a line
          without overlapping, and a row keeps every target at 44px. */}
      {!isWide && (
        <motion.ul
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={t(duration.base, DRAW_DELAY + DRAW_DURATION * 0.5)}
          className={cn(
            'absolute inset-x-0 bottom-0 flex snap-x snap-mandatory gap-2 overflow-x-auto',
            'px-gutter pb-6 pt-2',
            '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
          )}
        >
          {markers.map((marker) => {
            const Glyph = marker.icon;
            return (
              <li key={marker.goalId} className="snap-start">
                <Link
                  to={goalDeepLink(marker.goalId)}
                  aria-label={`${marker.title} — ${marker.line} Opens the ${marker.title} goal.`}
                  onTouchStart={() => setActiveId(marker.goalId)}
                  onFocus={() => setActiveId(marker.goalId)}
                  onBlur={() => setActiveId(null)}
                  className={cn(
                    'flex min-h-11 items-center gap-2 whitespace-nowrap rounded-pill border px-3.5',
                    'hero-chip text-body-sm font-semibold',
                    'transition-[background-color,border-color] motion-safe:duration-instant ease-out',
                    activeId === marker.goalId && 'hero-chip--active'
                  )}
                >
                  <Glyph size={18} strokeWidth={1.75} aria-hidden="true" className="shrink-0 text-hero-line" />
                  {marker.title}
                </Link>
              </li>
            );
          })}
        </motion.ul>
      )}
    </motion.div>
  );
}
