import type { ReactNode } from 'react';
import { usePointerTilt } from '@/hooks/usePointerTilt';
import { cn } from '@/lib/utils/cn';

/**
 * The shared frame and the dimensional parts of every drawn mark —
 * Enhancement A.
 *
 * The service marks (ServiceVisuals.tsx) and the goal marks
 * (GoalVisuals.tsx) each carried their own copy of the same plate. They now
 * share one, and with it one construction for depth, so eleven drawings
 * across two sections read as a single family of objects:
 *
 *   MarkPlate   the frame: a tinted plate with a lit top edge, the subject's
 *               own light behind it, a dot weave, the caption, and a gentle
 *               tilt toward a fine pointer (usePointerTilt).
 *   Prism       a column or block with a front face, a lit top and a
 *               shaded side.
 *   Slab        a flat shape given thickness by a shaded copy beneath it.
 *   SphereNode  a milestone drawn as the brand's lit sphere.
 *
 * ── Lighting that survives the theme swap ───────────────────────────────
 *
 * Every face is filled in the tone at the same strength, then lit or shaded
 * with a white or black overlay. Stepping the tone's own opacity instead
 * would invert on ink — a stronger tone over a dark plate is *lighter* — so
 * the side of a column would glow in dark mode. Overlays keep the light
 * coming from above-left in both themes.
 *
 * Nothing here draws a figure, an axis or a scale; the rules in the header
 * of ServiceVisuals.tsx apply to every part.
 */

interface MarkPlateProps {
  label: string;
  /** Prefix for the SVG ids this plate defines. Unique per mark. */
  markId: string;
  view: { w: number; h: number };
  /** Accent strength. A goal's mark is always the one being read. */
  active?: boolean;
  className?: string;
  children: ReactNode;
}

export function MarkPlate({ label, markId, view, active = true, className, children }: MarkPlateProps) {
  const tiltRef = usePointerTilt<HTMLElement>(5);

  return (
    <figure
      ref={tiltRef}
      className={cn(
        'tilt tilt-glare relative flex h-full w-full flex-col justify-between overflow-hidden rounded-surface border p-4',
        active ? 'edge-top border-tone/30 bg-tone-tint' : 'inset-well border-divider bg-surface-sunken',
        className
      )}
    >
      {/* The subject's own light, behind everything — depth as light in a
          room rather than a glow on each element. It strengthens on the
          active panel, which is part of how that state reads. */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-pill bg-tone blur-3xl',
          'transition-opacity duration-slow ease-out',
          active ? 'opacity-20' : 'opacity-[0.07]'
        )}
      />

      <figcaption className="relative flex items-center gap-2 font-display text-legal font-semibold uppercase tracking-[0.12em] text-ink-muted">
        <span
          aria-hidden="true"
          className={cn('h-2 w-2 shrink-0 rounded-pill', active ? 'sphere sphere-tone' : 'bg-ink-muted/40')}
        />
        {label}
      </figcaption>

      <svg
        viewBox={`0 0 ${view.w} ${view.h}`}
        fill="none"
        aria-hidden="true"
        className="relative mt-3 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Area fill under a rising line. Encodes magnitude, which is the
              one thing §10.3 permits a gradient to do. */}
          <linearGradient id={`${markId}-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(var(--tone))" stopOpacity={active ? 0.32 : 0.14} />
            <stop offset="100%" stopColor="rgb(var(--tone))" stopOpacity="0" />
          </linearGradient>
          {/* The weave, so the plate is a surface rather than an empty box. */}
          <pattern id={`${markId}-grid`} width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="1.4" cy="1.4" r="1.1" fill="rgb(var(--tone))" opacity="0.16" />
          </pattern>
          {/* The sphere's highlight and its shade, laid over a tone disc. */}
          <radialGradient id={`${markId}-sphere-light`} cx="0.36" cy="0.32" r="0.62">
            <stop offset="0%" stopColor="rgb(255 255 255)" stopOpacity="0.95" />
            <stop offset="22%" stopColor="rgb(255 255 255)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="rgb(255 255 255)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${markId}-sphere-shade`} cx="0.62" cy="0.72" r="0.7">
            <stop offset="40%" stopColor="rgb(0 0 0)" stopOpacity="0" />
            <stop offset="100%" stopColor="rgb(0 0 0)" stopOpacity="0.32" />
          </radialGradient>
        </defs>
        <rect width={view.w} height={view.h} fill={`url(#${markId}-grid)`} />
        {children}
      </svg>
    </figure>
  );
}

interface PrismProps {
  /** Left edge of the front face. */
  x: number;
  /** Top edge of the front face. */
  y: number;
  width: number;
  /** Where the front face meets the ground. */
  base: number;
  /** Tone strength of every face before lighting. */
  strength: number;
  /** How far the top and side recede, up and to the right. */
  depth?: number;
}

/** A column or block with a front face, a lit top and a shaded side. */
export function Prism({ x, y, width, base, strength, depth = 5 }: PrismProps) {
  const top = `M ${x} ${y} L ${x + depth} ${y - depth} L ${x + width + depth} ${y - depth} L ${x + width} ${y} Z`;
  const side = `M ${x + width} ${y} L ${x + width + depth} ${y - depth} L ${x + width + depth} ${base - depth} L ${x + width} ${base} Z`;

  return (
    <g className="transition-[fill-opacity] duration-base ease-out">
      <path d={side} fill="rgb(var(--tone))" fillOpacity={strength} />
      <path d={side} fill="rgb(0 0 0)" fillOpacity={0.18} />
      <rect x={x} y={y} width={width} height={Math.max(0, base - y)} fill="rgb(var(--tone))" fillOpacity={strength} />
      <path d={top} fill="rgb(var(--tone))" fillOpacity={strength} />
      <path d={top} fill="rgb(255 255 255)" fillOpacity={0.32} />
    </g>
  );
}

interface SlabProps {
  d: string;
  strength: number;
  /** Offset of the shaded copy beneath the face. */
  dx?: number;
  dy?: number;
}

/** A flat shape given thickness: a shaded copy sits a few units down-right. */
export function Slab({ d, strength, dx = 4, dy = 5 }: SlabProps) {
  return (
    <g>
      <path d={d} transform={`translate(${dx} ${dy})`} fill="rgb(var(--tone))" fillOpacity={strength} />
      <path d={d} transform={`translate(${dx} ${dy})`} fill="rgb(0 0 0)" fillOpacity={0.14} />
      <path d={d} fill="rgb(var(--tone))" fillOpacity={strength} />
    </g>
  );
}

/** A milestone drawn as the brand's lit sphere, in the subject's accent. */
export function SphereNode({ cx, cy, r = 6, markId }: { cx: number; cy: number; r?: number; markId: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy + 1.5} r={r} fill="rgb(0 0 0)" fillOpacity={0.12} />
      <circle cx={cx} cy={cy} r={r} fill="rgb(var(--tone-fill))" />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${markId}-sphere-shade)`} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${markId}-sphere-light)`} />
    </g>
  );
}
