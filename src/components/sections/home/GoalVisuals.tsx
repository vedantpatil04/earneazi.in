import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { duration, easing } from '@/lib/motion/tokens';
import { MarkPlate, Prism, Slab, SphereNode } from './MarkPlate';

/**
 * One mark per financial goal — Phase 3, given depth in Enhancement A.
 *
 * A small drawn subject per goal, in that goal's own accent, sitting inside
 * the planning panel — the contextual treatment that replaced six identical
 * cards with a lucide glyph in a grey box.
 *
 * ── The rules they inherit ──────────────────────────────────────────────
 *
 * The same ones the service marks obey (see ServiceVisuals.tsx), because
 * they are the same material: no numbers, no axis, no scale, no currency,
 * no proportion rendered to the pixel, and nothing that could be read as a
 * projection, a recommendation or a result. A house, a shield and a cap are
 * subjects; a chart with values on it would be a claim.
 *
 * ── Construction ────────────────────────────────────────────────────────
 *
 * One viewBox and the shared plate from MarkPlate.tsx, which gives these
 * the same frame, lighting and pointer tilt as the service marks. Blocks and
 * columns are prisms, the shield and the sheet are slabs with thickness,
 * and the point each drawing is about is the brand's sphere. Colour comes
 * entirely from the tone channel, so each mark renders in its goal's accent
 * — and in that accent's independently tuned dark instance — without naming
 * a colour. The only animation is the stroke drawing itself once on entry,
 * disabled under reduced motion; the finished drawing is the base state.
 */

const VIEW = { w: 240, h: 150 };

interface MarkProps {
  className?: string;
}

/** The drawn stroke. Draws once on entry; the finished path is the base state. */
function Stroke({
  d,
  weight = 2.5,
  dashed = false,
  muted = false,
  delay = 0,
}: {
  d: string;
  weight?: number;
  dashed?: boolean;
  muted?: boolean;
  delay?: number;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  return (
    <motion.path
      d={d}
      stroke={muted ? 'rgb(var(--color-text-muted))' : 'rgb(var(--tone))'}
      strokeWidth={muted ? 1.5 : weight}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dashed ? '4 5' : undefined}
      opacity={muted ? 0.5 : 1}
      initial={prefersReducedMotion ? false : { pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, margin: '-48px 0px' }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: duration.story, delay, ease: easing.out }}
    />
  );
}

function Node({ cx, cy }: { cx: number; cy: number }) {
  return <circle cx={cx} cy={cy} r={4} fill="rgb(var(--color-surface))" stroke="rgb(var(--tone))" strokeWidth={2.25} />;
}

/* ── Grow wealth — money left alone for long enough to compound ─────────── */

const GROW_PATH = 'M 26 112 C 70 106, 100 84, 128 62 C 152 44, 178 32, 214 26';

export function GrowMark({ className }: MarkProps) {
  const markId = 'goal-grow';
  return (
    <MarkPlate label="Left alone, for years" markId={markId} view={VIEW} className={className}>
      <path d={GROW_PATH + ' L 214 124 L 26 124 Z'} fill={`url(#${markId}-area)`} />
      <Stroke d="M 18 124 L 222 124" muted dashed />
      {[
        [54, 104],
        [84, 92],
        [114, 76],
        [144, 58],
        [174, 44],
      ].map(([x, y], index) => (
        <Prism key={x} x={x - 5} y={y} width={10} base={124} depth={4} strength={0.18 + index * 0.06} />
      ))}
      <Stroke d={GROW_PATH} />
      <Node cx={26} cy={112} />
      <Node cx={128} cy={62} />
      <SphereNode cx={214} cy={26} r={7} markId={markId} />
    </MarkPlate>
  );
}

/* ── Protect family — cover sized around the people behind it ───────────── */

const SHIELD = 'M 120 20 L 196 46 L 196 88 C 196 112, 160 130, 120 138 C 80 130, 44 112, 44 88 L 44 46 Z';

export function ProtectMark({ className }: MarkProps) {
  const markId = 'goal-protect';
  return (
    <MarkPlate label="What sits behind the cover" markId={markId} view={VIEW} className={className}>
      <Slab d={SHIELD} strength={0.13} dx={4} dy={5} />
      <Stroke d={SHIELD} />
      {/* Three figures, the smaller one between the other two. No faces, no
          expressions: this is a household, not a stock photograph. */}
      <circle cx={92} cy={74} r={8} fill="rgb(var(--tone))" fillOpacity={0.85} />
      <circle cx={148} cy={74} r={8} fill="rgb(var(--tone))" fillOpacity={0.85} />
      <circle cx={120} cy={84} r={6} fill="rgb(var(--color-surface))" stroke="rgb(var(--tone))" strokeWidth={2.25} />
      <Stroke d="M 78 106 C 78 90, 106 90, 106 106" weight={2.25} delay={0.12} />
      <Stroke d="M 134 106 C 134 90, 162 90, 162 106" weight={2.25} delay={0.12} />
      <Stroke d="M 108 110 C 108 98, 132 98, 132 110" weight={2.25} delay={0.2} />
    </MarkPlate>
  );
}

/* ── Buy a home — the structure, and the approach to it ──────────────────── */

export function HomeMark({ className }: MarkProps) {
  const markId = 'goal-home';
  return (
    <MarkPlate label="The place, and the repayment" markId={markId} view={VIEW} className={className}>
      {/* The walls, with a shaded side receding up and to the right. */}
      <path d="M 158 72 L 172 62 L 172 116 L 158 126 Z" fill="rgb(var(--tone))" fillOpacity={0.16} />
      <path d="M 158 72 L 172 62 L 172 116 L 158 126 Z" fill="rgb(0 0 0)" fillOpacity={0.14} />
      <path d="M 82 72 L 82 126 L 158 126 L 158 72 Z" fill="rgb(var(--tone))" fillOpacity={0.16} />
      {/* The roof, with its far slope lit. */}
      <path d="M 120 32 L 134 22 L 190 64 L 176 74 Z" fill="rgb(var(--tone))" fillOpacity={0.22} />
      <path d="M 120 32 L 134 22 L 190 64 L 176 74 Z" fill="rgb(255 255 255)" fillOpacity={0.28} />
      <path d="M 64 74 L 120 32 L 176 74 Z" fill="rgb(var(--tone))" fillOpacity={0.22} />
      <Stroke d="M 18 126 L 222 126" muted dashed />
      <Stroke d="M 64 74 L 120 32 L 176 74" />
      <Stroke d="M 82 70 L 82 126 M 158 70 L 158 126" weight={2.25} delay={0.1} />
      {/* Door: where the repayment is actually lived with. */}
      <rect x={110} y={96} width={22} height={30} rx={3} fill="rgb(var(--tone))" fillOpacity={0.9} />
      <rect x={92} y={86} width={14} height={14} rx={2} fill="rgb(var(--color-surface))" stroke="rgb(var(--tone))" strokeWidth={2} />
      <rect x={136} y={86} width={14} height={14} rx={2} fill="rgb(var(--color-surface))" stroke="rgb(var(--tone))" strokeWidth={2} />
      {/* The years of repayment, drawn as the approach rather than as a figure. */}
      <Stroke d="M 26 126 C 48 126, 60 122, 76 118" muted delay={0.2} />
      <SphereNode cx={26} cy={126} r={6} markId={markId} />
    </MarkPlate>
  );
}

/* ── Save tax — the return, and the part of it a deduction takes out ─────── */

const SHEET = 'M 72 20 L 146 20 L 170 44 L 170 132 L 72 132 Z';

export function TaxMark({ className }: MarkProps) {
  const markId = 'goal-tax';
  return (
    <MarkPlate label="What a deduction takes out" markId={markId} view={VIEW} className={className}>
      <Slab d={SHEET} strength={0.12} dx={5} dy={5} />
      <Stroke d={SHEET} />
      {/* The folded corner — a sheet, not a card. */}
      <Stroke d="M 146 20 L 146 44 L 170 44" weight={2} delay={0.12} />
      {/* Rows on the sheet. The one in tone is the row a deduction removes;
          it is a row, not a proportion — nothing here is measured. */}
      {[62, 78, 110].map((y, index) => (
        <line
          key={y}
          x1={88}
          y1={y}
          x2={index === 2 ? 132 : 154}
          y2={y}
          stroke="rgb(var(--color-text-muted))"
          strokeWidth={3}
          strokeLinecap="round"
          opacity={0.4}
        />
      ))}
      <rect x={86} y={88} width={70} height={12} rx={4} fill="rgb(var(--tone))" fillOpacity={0.9} />
      <SphereNode cx={170} cy={94} r={7} markId={markId} />
      <Stroke d="M 186 94 L 210 94" weight={2.25} delay={0.24} />
    </MarkPlate>
  );
}

/* ── Fund education — a dated commitment, built up to ────────────────────── */

export function EducationMark({ className }: MarkProps) {
  const markId = 'goal-education';
  return (
    <MarkPlate label="A date you already know" markId={markId} view={VIEW} className={className}>
      {/* The steps built toward it. Rising blocks, no scale on any of them. */}
      {[
        [58, 112],
        [96, 100],
        [134, 88],
        [172, 76],
      ].map(([x, y], index) => (
        <Prism key={x} x={x - 16} y={y} width={30} base={130} depth={6} strength={0.14 + index * 0.06} />
      ))}
      <Stroke d="M 18 130 L 222 130" muted dashed />
      {/* The cap, sitting on the last step. */}
      <path d="M 172 26 L 218 44 L 172 62 L 126 44 Z" fill="rgb(var(--tone))" fillOpacity={0.24} />
      <Stroke d="M 172 26 L 218 44 L 172 62 L 126 44 Z" />
      <Stroke d="M 148 54 L 148 68 C 148 78, 196 78, 196 68 L 196 54" weight={2.25} delay={0.14} />
      <Stroke d="M 218 44 L 218 70" weight={2} delay={0.22} />
      <SphereNode cx={218} cy={74} r={6} markId={markId} />
    </MarkPlate>
  );
}

/* ── Plan retirement — the climb, and the long flat part after it ────────── */

const RETIRE_PATH = 'M 24 120 C 62 116, 92 92, 118 68 C 132 56, 146 50, 168 50 L 216 50';

export function RetirementMark({ className }: MarkProps) {
  const markId = 'goal-retire';
  return (
    <MarkPlate label="The climb, then the level part" markId={markId} view={VIEW} className={className}>
      <path d={RETIRE_PATH + ' L 216 128 L 24 128 Z'} fill={`url(#${markId}-area)`} />
      <Stroke d="M 18 128 L 222 128" muted dashed />
      {/* The horizon the flat part runs toward. */}
      <path d="M 168 50 A 26 26 0 0 1 216 50 Z" fill="rgb(var(--tone))" fillOpacity={0.18} />
      <Stroke d={RETIRE_PATH} />
      {/* Where earning stops and the level part begins. */}
      <Stroke d="M 168 40 L 168 128" muted dashed delay={0.3} />
      <Node cx={24} cy={120} />
      <SphereNode cx={168} cy={50} r={7} markId={markId} />
    </MarkPlate>
  );
}

/** The mark for a goal, by id. One lookup so callers do not branch. */
export const goalMarks: Record<string, (props: MarkProps) => JSX.Element> = {
  'grow-wealth': GrowMark,
  'protect-family': ProtectMark,
  'buy-a-home': HomeMark,
  'save-tax': TaxMark,
  'fund-education': EducationMark,
  'plan-retirement': RetirementMark,
};
