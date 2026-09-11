import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { goalEntries } from '@/data/services';

/** Where each marker sits along the curve, as a fraction of its total length. */
const MARKER_STOPS = [
  { goalId: 'buy-a-home', at: 0.3, align: 'left' },
  { goalId: 'fund-education', at: 0.6, align: 'left' },
  // The last marker sits close to the right edge, so its label hangs back
  // over the curve instead of running past it.
  { goalId: 'plan-retirement', at: 0.9, align: 'right' },
] as const;

const CURVE_PATH = 'M 14 318 C 110 306, 168 268, 236 222 S 378 128, 510 32';
const AREA_PATH = `${CURVE_PATH} L 510 340 L 14 340 Z`;

const DRAW_DELAY = 0.35;
const DRAW_DURATION = 1.15;

interface MarkerPoint {
  goalId: string;
  label: string;
  x: number;
  y: number;
  align: 'left' | 'right';
  delay: number;
}

/**
 * The homepage's signature visual, in place of the photography the owner
 * asked to remove.
 *
 * It is a growth curve, but it is not decoration: the three points on it are
 * real goals from the services data, in the order someone typically reaches
 * them, and the axis is labelled Today → Later. So it says "we plan around
 * goals across a lifetime", which is the business, rather than "line goes
 * up", which would be a claim.
 *
 * Deliberately carries no numbers, no value axis and no percentages. A curve
 * with figures on it would be an invented projection; a curve without them
 * is a diagram of an idea.
 *
 * Marker positions are read off the rendered path with getPointAtLength
 * rather than eyeballed as coordinates, so they sit exactly on the line at
 * any size and stay there if the path is ever redrawn.
 */
export function HeroGrowthCurve() {
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [markers, setMarkers] = useState<MarkerPoint[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  /**
   * Depth, applied to one element rather than sprinkled over the page.
   *
   * The three layers drift by different amounts as the pointer crosses the
   * visual — the graph paper barely moves, the curve moves more, the goal
   * markers most — which is what reads as depth rather than as a picture
   * sliding around. Travel is capped at a few pixels; anything larger stops
   * being parallax and starts being a distraction beside a headline.
   *
   * Gated on a fine pointer, so it never fires on touch (where there is no
   * hover to respond to and the handler would just cost battery), and off
   * entirely under reduced motion. Transform-only, so it composites without
   * a layout or paint pass.
   */
  const hasFinePointer = useMediaQuery('(pointer: fine)');
  const parallaxEnabled = hasFinePointer && !prefersReducedMotion;

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 110, damping: 20, mass: 0.4 });
  const springY = useSpring(pointerY, { stiffness: 110, damping: 20, mass: 0.4 });

  const gridX = useTransform(springX, (v) => v * 5);
  const gridY = useTransform(springY, (v) => v * 4);
  const curveX = useTransform(springX, (v) => v * 12);
  const curveY = useTransform(springY, (v) => v * 9);
  const markerX = useTransform(springX, (v) => v * 20);
  const markerY = useTransform(springY, (v) => v * 15);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!parallaxEnabled || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const total = path.getTotalLength();

    setMarkers(
      MARKER_STOPS.map((stop) => {
        const point = path.getPointAtLength(total * stop.at);
        const goal = goalEntries.find((entry) => entry.id === stop.goalId);

        return {
          goalId: stop.goalId,
          label: goal?.title ?? '',
          x: point.x,
          y: point.y,
          align: stop.align,
          // Each marker lands as the line reaches it, rather than all three
          // arriving together once the drawing has finished.
          delay: DRAW_DELAY + DRAW_DURATION * stop.at,
        };
      })
    );
  }, []);

  const ease = [0.22, 1, 0.36, 1] as const;
  const t = (duration: number, delay: number) =>
    prefersReducedMotion ? { duration: 0 } : { duration, delay, ease };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      className="relative"
    >
      <svg
        viewBox="0 0 510 350"
        className="w-full"
        role="img"
        aria-label="A rising line marking three goals in the order people usually reach them: buying a home, funding education, and planning retirement."
      >
        <defs>
          <linearGradient id="hero-curve-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(var(--color-accent-primary))" stopOpacity="0.16" />
            <stop offset="100%" stopColor="rgb(var(--color-accent-primary))" stopOpacity="0" />
          </linearGradient>
          {/* Fades the graph paper out toward the top and right so it reads as
              a surface the line sits on, not a box drawn around it. */}
          <linearGradient id="hero-grid-fade" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="hero-grid-mask">
            <rect width="510" height="350" fill="url(#hero-grid-fade)" />
          </mask>
        </defs>

        <motion.g
          mask="url(#hero-grid-mask)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={t(0.6, 0)}
          style={parallaxEnabled ? { x: gridX, y: gridY } : undefined}
          stroke="rgb(var(--color-divider))"
          strokeWidth="1"
        >
          {[68, 136, 204, 272, 340].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="510" y2={y} />
          ))}
          {[85, 170, 255, 340, 425].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="350" />
          ))}
        </motion.g>

        <motion.path
          d={AREA_PATH}
          fill="url(#hero-curve-fill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={t(0.8, DRAW_DELAY + DRAW_DURATION * 0.5)}
          style={parallaxEnabled ? { x: curveX, y: curveY } : undefined}
        />

        <motion.path
          ref={pathRef}
          d={CURVE_PATH}
          fill="none"
          stroke="rgb(var(--color-accent-primary))"
          strokeWidth="2.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={t(DRAW_DURATION, DRAW_DELAY)}
          style={parallaxEnabled ? { x: curveX, y: curveY } : undefined}
        />

        {markers.map((marker) => (
          <motion.g
            key={marker.goalId}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={t(0.4, marker.delay)}
            style={
              parallaxEnabled
                ? { transformOrigin: `${marker.x}px ${marker.y}px`, x: markerX, y: markerY }
                : { transformOrigin: `${marker.x}px ${marker.y}px` }
            }
          >
            <circle cx={marker.x} cy={marker.y} r="9" fill="rgb(var(--color-bg))" />
            <circle
              cx={marker.x}
              cy={marker.y}
              r="5"
              fill="rgb(var(--color-brass))"
              stroke="rgb(var(--color-bg))"
              strokeWidth="2"
            />
          </motion.g>
        ))}
      </svg>

      {/* Labels sit in HTML rather than as SVG <text>: they inherit the page's
          type styles, stay selectable, and scale with the user's font size
          instead of with the viewBox. */}
      {markers.map((marker) => (
        <span
          key={marker.goalId}
          className="pointer-events-none absolute"
          style={{
            left: `${(marker.x / 510) * 100}%`,
            top: `${(marker.y / 350) * 100}%`,
            transform: marker.align === 'right' ? 'translate(-100%, -100%)' : 'translate(0, -100%)',
          }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={t(0.4, marker.delay + 0.1)}
            className={
              marker.align === 'right'
                ? 'block whitespace-nowrap pb-3 pr-3 text-right text-small font-medium text-ink'
                : 'block whitespace-nowrap pb-3 pl-3 text-small font-medium text-ink'
            }
          >
            {marker.label}
          </motion.span>
        </span>
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={t(0.5, DRAW_DELAY)}
        className="mt-1 flex items-center justify-between border-t border-divider pt-3 font-mono text-marker uppercase tracking-wider text-ink-muted"
      >
        <span>Today</span>
        <span>Later</span>
      </motion.div>
    </div>
  );
}
