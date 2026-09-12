import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatRupees, formatRupeesCompact } from '@/lib/finance';
import type { SipYearlyBreakdownPoint } from '@/lib/finance';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useChartColors } from './useChartColors';

interface SipGrowthChartProps {
  breakdown: SipYearlyBreakdownPoint[];
  /** Read out to screen readers in place of the graphic. */
  summary: string;
  /** Shorter axes and margins below `sm`, where a desktop chart is unreadable. */
  compact?: boolean;
}

interface TooltipEntry {
  dataKey?: string | number;
  value?: number | string;
}

/**
 * Projected value over time, split into what was contributed and what the
 * assumed return adds on top.
 *
 * ── Why a stacked area ──────────────────────────────────────────────────
 *
 * Because the two series genuinely sum to the third: contributions plus
 * estimated growth *is* the projected value. Stacking encodes a real
 * relationship rather than filling space, and the widening gap between the
 * two bands is the single thing the chart is for — it is what compounding
 * looks like. It reads the same year-wise rows as the table below, from the
 * same engine, so the picture and the numbers cannot disagree.
 *
 * ── Colour is never the only signal ─────────────────────────────────────
 *
 * §10.3: chart series must be distinguishable without colour. The growth
 * band carries a diagonal hatch, the contributed band is solid, their
 * strokes differ in dash, and the legend repeats both as shapes. Turned
 * greyscale, the chart still reads.
 *
 * The two colours come from `--color-chart-1` and `--color-chart-2`, which
 * are defined independently per theme — the dark instances are not lightened
 * copies of the light ones. They are resolved to concrete `rgb()` strings by
 * `useChartColors`, because Recharts writes colours into SVG `fill`/`stroke`
 * attributes where a `var(--token)` reference is not reliably supported.
 *
 * ── Motion ──────────────────────────────────────────────────────────────
 *
 * The series animate their shape over `dur-base` when the inputs change, and
 * not at all under reduced motion (§23.4). The chart is `aria-hidden` and
 * has a text summary plus a full data table beside it, so nothing here is
 * information that exists only once the animation has finished.
 *
 * Default-exported as well as named, because the panel that wraps this
 * lazy-loads it — Recharts is roughly as large as the rest of the
 * application and must not enter any bundle that does not draw a chart.
 */
export function SipGrowthChart({ breakdown, summary, compact = false }: SipGrowthChartProps) {
  const colors = useChartColors();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <figure className="m-0">
      <p className="sr-only">{summary}</p>

      <div aria-hidden="true" className={compact ? 'h-52 w-full' : 'h-64 w-full sm:h-80 lg:h-96'}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={breakdown} margin={{ top: 8, right: 8, bottom: 4, left: compact ? 0 : 4 }}>
            <defs>
              {/* The hatch that keeps the growth band identifiable without
                  colour. Drawn in the series colour over a transparent
                  ground, so it inherits the theme with everything else. */}
              <pattern id="sip-growth-hatch" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                <rect width="7" height="7" fill={colors.growth} fillOpacity={0.16} />
                <line x1="0" y1="0" x2="0" y2="7" stroke={colors.growth} strokeWidth="3" strokeOpacity={0.42} />
              </pattern>
            </defs>

            <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={{ stroke: colors.grid }}
              tick={{ fill: colors.axis, fontSize: 12 }}
              tickMargin={8}
              /* At a 40-year horizon every year would print a label and they
                 collide into a grey smear. Recharts drops the ones that will
                 not fit while always keeping the first and last. */
              interval="preserveStartEnd"
              minTickGap={compact ? 32 : 24}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={compact ? 44 : 60}
              tick={{ fill: colors.axis, fontSize: 12 }}
              tickFormatter={(value: number) => formatRupeesCompact(value)}
            />

            <Tooltip
              cursor={{ stroke: colors.axis, strokeDasharray: '3 3' }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;

                const find = (key: string) => (payload as TooltipEntry[]).find((entry) => entry.dataKey === key)?.value;
                const invested = Number(find('totalInvested') ?? 0);
                const growth = Number(find('estimatedGains') ?? 0);

                return (
                  <div className="rounded-surface border border-border bg-surface p-3 shadow-md">
                    <p className="font-display text-legal font-semibold uppercase tracking-[0.1em] text-ink-muted">
                      Year {label}
                    </p>
                    <dl className="mt-2 flex flex-col gap-1 text-body-sm">
                      <div className="flex items-baseline justify-between gap-6">
                        <dt className="text-ink-secondary">Invested</dt>
                        <dd className="font-medium tabular text-ink">{formatRupees(invested)}</dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-6">
                        <dt className="text-ink-secondary">Est. gains</dt>
                        <dd className="font-medium tabular text-ink">{formatRupees(growth)}</dd>
                      </div>
                      <div className="mt-1 flex items-baseline justify-between gap-6 border-t border-divider pt-1.5">
                        <dt className="text-ink-secondary">Projected value</dt>
                        <dd className="font-semibold tabular text-ink">{formatRupees(invested + growth)}</dd>
                      </div>
                    </dl>
                  </div>
                );
              }}
            />

            <Area
              type="monotone"
              dataKey="totalInvested"
              stackId="projection"
              stroke={colors.invested}
              strokeWidth={2}
              fill={colors.invested}
              fillOpacity={0.26}
              isAnimationActive={!prefersReducedMotion}
              animationDuration={240}
            />
            <Area
              type="monotone"
              dataKey="estimatedGains"
              stackId="projection"
              stroke={colors.growth}
              strokeWidth={2}
              strokeDasharray="6 3"
              fill="url(#sip-growth-hatch)"
              fillOpacity={1}
              isAnimationActive={!prefersReducedMotion}
              animationDuration={240}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <figcaption className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-divider pt-4 text-body-sm">
        <span className="inline-flex items-center gap-2 text-ink-secondary">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[2px] bg-chart-1" />
          Amount invested
        </span>
        <span className="inline-flex items-center gap-2 text-ink-secondary">
          <span aria-hidden="true" className="h-2.5 w-2.5 rotate-45 bg-chart-2" />
          Estimated gains
        </span>
      </figcaption>
    </figure>
  );
}

export default SipGrowthChart;
