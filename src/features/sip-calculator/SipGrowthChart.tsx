import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatRupees, formatRupeesCompact } from '@/lib/finance';
import type { SipYearlyBreakdownPoint } from '@/lib/finance';
import { useChartColors } from './useChartColors';

interface SipGrowthChartProps {
  breakdown: SipYearlyBreakdownPoint[];
  /** Read out to screen readers in place of the graphic. */
  summary: string;
}

interface TooltipEntry {
  dataKey?: string | number;
  value?: number | string;
}

/**
 * Projected value over time, split into what was contributed and what the
 * assumed return adds on top.
 *
 * A stacked area is the right shape here because the two series genuinely
 * sum to the third: contributions plus estimated growth *is* the projected
 * value, so stacking encodes a real relationship rather than just filling
 * space. It reads the same year-wise data the table below shows, from the
 * same engine.
 *
 * The graphic itself is hidden from assistive technology and replaced by
 * the summary sentence and the full data table — a screen reader user gets
 * the actual numbers rather than a description of a picture of them.
 */
export function SipGrowthChart({ breakdown, summary }: SipGrowthChartProps) {
  const colors = useChartColors();

  return (
    <figure className="mt-0">
      <p className="sr-only">{summary}</p>

      <div aria-hidden="true" className="h-64 w-full sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={breakdown} margin={{ top: 8, right: 8, bottom: 4, left: 4 }}>
            <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={{ stroke: colors.grid }}
              tick={{ fill: colors.axis, fontSize: 12 }}
              tickMargin={8}
              /* At a 40-year horizon every year would print a label and they
                 collide into a grey smear. Recharts drops the ones that
                 won't fit while always keeping the first and last. */
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={56}
              tick={{ fill: colors.axis, fontSize: 12 }}
              tickFormatter={(value: number) => formatRupeesCompact(value)}
            />
            <Tooltip
              cursor={{ stroke: colors.axis, strokeDasharray: '3 3' }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;

                const find = (key: string) =>
                  (payload as TooltipEntry[]).find((entry) => entry.dataKey === key)?.value;
                const invested = Number(find('totalInvested') ?? 0);
                const growth = Number(find('estimatedGains') ?? 0);

                return (
                  <div className="rounded-md border border-border bg-surface p-3 shadow-md">
                    <p className="font-mono text-marker text-ink-muted">Year {label}</p>
                    <dl className="mt-2 flex flex-col gap-1 text-small">
                      <div className="flex items-baseline justify-between gap-6">
                        <dt className="text-ink-secondary">Invested</dt>
                        <dd className="font-numeric font-medium text-ink">{formatRupees(invested)}</dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-6">
                        <dt className="text-ink-secondary">Est. growth</dt>
                        <dd className="font-numeric font-medium text-ink">{formatRupees(growth)}</dd>
                      </div>
                      <div className="mt-1 flex items-baseline justify-between gap-6 border-t border-divider pt-1.5">
                        <dt className="text-ink-secondary">Projected value</dt>
                        <dd className="font-numeric font-semibold text-ink">{formatRupees(invested + growth)}</dd>
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
              fillOpacity={0.22}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="estimatedGains"
              stackId="projection"
              stroke={colors.growth}
              strokeWidth={2}
              fill={colors.growth}
              fillOpacity={0.22}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <figcaption className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-divider pt-4 text-small">
        {/* Each key carries a shape as well as a colour, so the two series
            stay distinguishable without relying on colour alone. */}
        <span className="inline-flex items-center gap-2 text-ink-secondary">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-chart-1" />
          Amount invested
        </span>
        <span className="inline-flex items-center gap-2 text-ink-secondary">
          <span aria-hidden="true" className="h-2.5 w-2.5 rotate-45 bg-chart-2" />
          Estimated growth
        </span>
      </figcaption>
    </figure>
  );
}
