import { useState } from "react";
import type { MotionValue } from "framer-motion";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Flag } from "lucide-react";
import {
  goalDeepLink,
  heroAxis,
  heroIllustrativeNote,
  heroMilestones,
} from "@/data/hero";
import { goalEntries } from "@/data/services";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { duration, easing } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils/cn";

/**
 * The financial journey — TODAY → GOALS → PROGRESS → FUTURE.
 *
 * One component, two geometries. The idea is identical in both; only the
 * axis it is drawn along changes, because a rising curve needs horizontal
 * room a phone does not have and a vertical spine wastes the open sky a
 * desktop does.
 *
 *   path    ≥1024px. A curve ascending through the open right of the
 *           photograph, with the three milestones sitting on it.
 *   spine   <1024px. The same three milestones down a vertical rule, in a
 *           panel that sits under the narrative.
 *
 * ── Where the content comes from ────────────────────────────────────────
 *
 * The milestones are `heroMilestones` in data/hero.ts, and their titles and
 * icons are looked up from `goalEntries` in data/services.ts rather than
 * restated here. Both were previously hardcoded — twice, in two files, with
 * their own icon maps — which meant renaming a goal silently left the hero
 * saying the old name.
 *
 * ── What it is careful not to claim ─────────────────────────────────────
 *
 * There is no axis scale, no figure, no currency and no unit anywhere in
 * it. The curve rises because goals arrive in an order, not because
 * anything compounds at a rate, and `heroIllustrativeNote` says so in
 * visible text rather than in a tooltip. Nothing here should ever be given
 * a number.
 */

/*
  The curve is a chain of cubics whose *joins* are the milestone positions,
  so a milestone is on the line by construction rather than by a coordinate
  that has to be re-eyeballed whenever the curve is tuned. Coordinates are
  in the 1200×700 viewBox below.
  Recomposed toward the center-right so the headline owns the left and the
  trajectory gracefully ascends through the open right sky.
*/
const VIEW_W = 1200;
const VIEW = { w: VIEW_W, h: 700 };

const START = { x: 700, y: 570 };
const NODES = [
  { x: 825, y: 450 },
  { x: 940, y: 325 },
  { x: 1040, y: 200 },
] as const;
/* Positioned with comfortable clearance from the right viewport boundary. */
const END = { x: 1120, y: 110 };

const CURVE =
  `M ${START.x} ${START.y} ` +
  `C 740 530, 785 490, ${NODES[0].x} ${NODES[0].y} ` +
  `C 865 410, 900 365, ${NODES[1].x} ${NODES[1].y} ` +
  `C 975 285, 1010 240, ${NODES[2].x} ${NODES[2].y} ` +
  `C 1065 168, 1095 138, ${END.x} ${END.y}`;

const AREA = `${CURVE} L ${VIEW_W} 700 L ${START.x} 700 Z`;

const pct = (value: number, axis: "w" | "h") =>
  `${(value / VIEW[axis]) * 100}%`;

/** Title and icon for a milestone, from the goal it points at. */
function resolveMilestone(goalId: string) {
  const goal = goalEntries.find((entry) => entry.id === goalId);
  return { title: goal?.title ?? goalId, icon: goal?.icon ?? Flag };
}

interface HeroJourneyProps {
  variant: "path" | "spine";
  /** Scroll-linked drift. The journey moves slightly more than the photograph, which is what reads as depth. */
  depth?: { y: MotionValue<number> };
  className?: string;
}

export function HeroJourney({ variant, depth, className }: HeroJourneyProps) {
  return variant === "path" ? (
    <JourneyPath depth={depth} className={className} />
  ) : (
    <JourneySpine className={className} />
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   DESKTOP — the ascending curve
   ───────────────────────────────────────────────────────────────────────── */

function JourneyPath({
  depth,
  className,
}: {
  depth?: { y: MotionValue<number> };
  className?: string;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [openId, setOpenId] = useState<string | null>(null);

  /*
    The whole figure arrives as one gesture: the curve draws itself, then
    each node lands on it in order. `draw` is the curve's duration; the
    nodes start as it passes them, which is why their delays are fractions
    of it rather than a flat stagger.
  */
  const draw = duration.story * 1.6;
  const settle = (index: number) => 0.25 + draw * (0.42 + index * 0.2);

  return (
    <motion.div
      aria-hidden={false}
      style={depth ? { y: depth.y } : undefined}
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      <div className="absolute inset-0">
        <svg
          viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="hero-journey-area" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="rgb(var(--color-brand))"
                stopOpacity="0.08"
              />
              <stop
                offset="60%"
                stopColor="rgb(var(--color-brand))"
                stopOpacity="0.02"
              />
              <stop
                offset="100%"
                stopColor="rgb(var(--color-brand))"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {/* Minimal, airy ambient glow underneath the curve — never a solid dashboard polygon */}
          <motion.path
            d={AREA}
            fill="url(#hero-journey-area)"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: draw, delay: 0.3, ease: easing.out }
            }
          />

          {/* Thin, elegant trajectory line */}
          <motion.path
            d={CURVE}
            fill="none"
            stroke="rgb(var(--color-brand))"
            strokeWidth={1.5}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={prefersReducedMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: draw, delay: 0.25, ease: easing.out }
            }
          />
        </svg>

        {/* TODAY — where the curve leaves the ground in the center-right */}
        <AxisLabel
          x={START.x}
          y={START.y}
          delay={prefersReducedMotion ? 0 : 0.3}
          align="start"
        >
          {heroAxis.start}
        </AxisLabel>

        {/* The milestones, on the curve by construction. */}
        {heroMilestones.map((milestone, index) => {
          const node = NODES[index];
          if (!node) return null;
          const { title, icon: Glyph } = resolveMilestone(milestone.goalId);
          const open = openId === milestone.goalId;
          /*
            Near the right edge there is no room for a label running outward,
            so the last node hangs its label inboard instead. The bead stays
            on the curve either way — only the side the annotation opens on
            changes.
          */
          const flip = node.x / VIEW_W > 0.82;

          return (
            <div
              key={milestone.goalId}
              style={{ left: pct(node.x, "w"), top: pct(node.y, "h") }}
              className={cn(
                "pointer-events-auto absolute -translate-y-1/2",
                flip ? "-translate-x-[calc(100%-0.5rem)]" : "-translate-x-2",
              )}
            >
              <motion.div
                initial={
                  prefersReducedMotion ? false : { opacity: 0, scale: 0.6 }
                }
                animate={{ opacity: 1, scale: 1 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : {
                      duration: duration.base,
                      delay: settle(index),
                      ease: easing.out,
                    }
                }
              >
                <Link
                  to={goalDeepLink(milestone.goalId)}
                  onMouseEnter={() => setOpenId(milestone.goalId)}
                  onMouseLeave={() =>
                    setOpenId((current) =>
                      current === milestone.goalId ? null : current,
                    )
                  }
                  onFocus={() => setOpenId(milestone.goalId)}
                  onBlur={() =>
                    setOpenId((current) =>
                      current === milestone.goalId ? null : current,
                    )
                  }
                  className={cn(
                    "group/node flex items-center gap-2 rounded-pill",
                    flip && "flex-row-reverse",
                  )}
                >
                  {/* Subtle, refined node bead */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "relative flex h-3 w-3 shrink-0 items-center justify-center rounded-pill",
                      "bg-bg ring-1.5 ring-brand ring-offset-1 ring-offset-transparent",
                      "transition-transform duration-instant ease-out",
                      "motion-safe:group-hover/node:scale-125 motion-safe:group-focus-visible/node:scale-125",
                    )}
                  >
                    <span className="h-1.5 w-1.5 rounded-pill bg-brand" />
                  </span>

                  {/* Refined, lightweight milestone annotation card */}
                  <span
                    className={cn(
                      "flex flex-col rounded-surface border border-divider/70 px-2.5 py-1.5 text-left",
                      "bg-veil/[var(--veil-alpha)] shadow-xs backdrop-blur-md",
                      "transition-[border-color,transform] duration-instant ease-out",
                      "motion-safe:group-hover/node:-translate-y-px group-hover/node:border-brand",
                      "group-focus-visible/node:border-brand",
                    )}
                  >
                    <span className="flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-ink-display">
                      <Glyph
                        size={12}
                        strokeWidth={1.75}
                        aria-hidden="true"
                        className="text-brand-ink"
                      />
                      {title}
                    </span>
                    <span
                      className={cn(
                        "overflow-hidden text-[11px] leading-tight text-ink-secondary",
                        "transition-[max-height,opacity] duration-base ease-out",
                        open ? "max-h-8 opacity-100 mt-0.5" : "max-h-0 opacity-0",
                      )}
                    >
                      {milestone.line}
                    </span>
                  </span>
                </Link>
              </motion.div>
            </div>
          );
        })}

        {/* The destination endpoint. */}
        <div
          style={{ top: pct(END.y + 10, "h") }}
          className="absolute right-6 lg:right-10 xl:right-14 -translate-y-1/2"
        >
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                  duration: duration.slow,
                  delay: settle(2) + 0.2,
                  ease: easing.out,
                }
            }
          >
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill bg-brand px-3 py-1.5 text-xs font-medium text-on-brand shadow-sm">
              <Flag size={12} strokeWidth={2} aria-hidden="true" />
              {heroAxis.end}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Bottom metadata */}
      <div className="pointer-events-none absolute bottom-3 right-6 lg:right-10 hidden sm:flex items-center text-legal text-ink-muted">
        <p className="max-w-[40ch] rounded-action bg-veil/[var(--veil-alpha)] px-2.5 py-1 text-right text-[11px] text-ink-muted backdrop-blur-sm">
          {heroIllustrativeNote}
        </p>
      </div>
    </motion.div>
  );
}

function AxisLabel({
  x,
  y,
  delay,
  align,
  children,
}: {
  x: number;
  y: number;
  delay: number;
  align: "start" | "end";
  children: React.ReactNode;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  return (
    <div
      style={{ left: pct(x, "w"), top: pct(y, "h") }}
      className={cn(
        "absolute -translate-y-1/2",
        align === "start" ? "-translate-x-1/2" : "-translate-x-full",
      )}
    >
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: duration.slow, delay, ease: easing.out }
        }
      >
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill border border-divider/70 bg-veil/[var(--veil-alpha)] px-2.5 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-secondary backdrop-blur-md">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-pill bg-brand"
          />
          {children}
        </span>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MOBILE & TABLET — the same journey, turned on its side
   ───────────────────────────────────────────────────────────────────────── */

function JourneySpine({ className }: { className?: string }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      className={cn(
        "rounded-band border border-divider bg-veil/[var(--veil-alpha)] p-5 shadow-md backdrop-blur-xl sm:p-6",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-divider pb-3">
        <span className="font-display text-legal font-semibold uppercase tracking-[0.12em] text-ink-secondary">
          {heroAxis.start}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-pill bg-brand px-3 py-1 text-legal font-semibold text-on-brand">
          <Flag size={11} strokeWidth={2} aria-hidden="true" />
          {heroAxis.end}
        </span>
      </div>

      <ol className="relative mt-5 space-y-4 ps-7">
        {/* The spine. Drawn from the top so it reads as a direction rather
            than as a divider. */}
        <motion.span
          aria-hidden="true"
          initial={prefersReducedMotion ? false : { scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: duration.story, delay: 0.2, ease: easing.out }
          }
          className="absolute bottom-2 left-[7px] top-2 w-0.5 origin-top rounded-pill bg-gradient-to-b from-brand/40 via-brand to-brand"
        />

        {heroMilestones.map((milestone, index) => {
          const { title, icon: Glyph } = resolveMilestone(milestone.goalId);

          return (
            <motion.li
              key={milestone.goalId}
              initial={prefersReducedMotion ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : {
                    duration: duration.slow,
                    delay: 0.35 + index * 0.12,
                    ease: easing.out,
                  }
              }
              className="relative"
            >
              <span
                aria-hidden="true"
                className="absolute -start-7 top-3.5 flex h-4 w-4 items-center justify-center rounded-pill bg-bg ring-2 ring-brand"
              >
                <span className="h-1.5 w-1.5 rounded-pill bg-brand" />
              </span>

              <Link
                to={goalDeepLink(milestone.goalId)}
                className={cn(
                  "group/row flex items-start gap-3 rounded-surface border border-divider bg-surface p-3",
                  "transition-[border-color,background-color] duration-instant ease-out",
                  "hover:border-brand hover:bg-hovered",
                )}
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-action bg-brand-subtle text-brand-ink">
                  <Glyph size={15} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-body-sm font-semibold text-ink-display">
                    {title}
                  </span>
                  <span className="mt-0.5 block text-legal leading-snug text-ink-secondary">
                    {milestone.line}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="ms-auto shrink-0 self-center font-display text-legal tabular text-ink-muted"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </Link>
            </motion.li>
          );
        })}
      </ol>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 border-t border-divider pt-3 text-legal text-ink-muted">
        <span className="font-display text-[10.5px] font-semibold tracking-wider uppercase text-ink-secondary">
          TODAY → GOALS → PROGRESS → FUTURE
        </span>
        <p>{heroIllustrativeNote}</p>
      </div>
    </div>
  );
}
