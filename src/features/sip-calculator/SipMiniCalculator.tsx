import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  SIP_INPUT_LIMITS,
  formatPercent,
  formatRupees,
  formatRupeesCompact,
  formatYears,
} from '@/lib/finance';
import type { SipFieldName } from '@/lib/finance';
import { SipInputControl } from './SipInputControl';
import { SipDisclaimer } from './SipDisclaimer';
import { AnimatedRupees } from './AnimatedRupees';
import { useSipCalculator } from './useSipCalculator';

/**
 * The homepage SIP panel — the lighter of the two experiences.
 *
 * ── Same engine, same behaviour ─────────────────────────────────────────
 *
 * It runs `useSipCalculator`, which is the same hook the standalone page
 * runs, which defers every figure to `lib/finance`. Phase 4 requires the two
 * surfaces to share the calculation; sharing the hook means they also share
 * the bounds, the validation messages, the blur-clamping and the
 * last-good-value behaviour. There is no second implementation to drift.
 *
 * ── What "lighter" actually removes ─────────────────────────────────────
 *
 * Not the honesty, and not the arithmetic. What goes is the depth: no chart,
 * no year-by-year table, no per-field explanatory sentence, compact control
 * density, and a one-line disclaimer instead of the four-point one. What
 * stays is a real, live projection you can move with your thumb, the same
 * assumption line, and a route to the full tool.
 *
 * All three inputs are adjustable rather than two. A panel that fixes the
 * return rate at its default would be presenting the one number on this page
 * that is a claim as though it were a constant (§23.1); if it is on screen,
 * it has to be arguable.
 *
 * ── No chart here, deliberately ─────────────────────────────────────────
 *
 * Recharts is roughly as large as the rest of the application. This panel is
 * on the entry route, so it imports nothing that would pull the charting
 * library into the first download — the chart lives behind `SipChartPanel`'s
 * lazy boundary and only the standalone page renders it.
 */
export function SipMiniCalculator() {
  const sip = useSipCalculator();
  const { committed, errors, isValid, result } = sip;

  const field = (name: SipFieldName) => ({
    value: sip.raw[name],
    numericValue: committed[name],
    limits: SIP_INPUT_LIMITS[name],
    errorMessage: errors[name],
    onChange: (next: string) => sip.setField(name, next),
    onSlide: (next: number) => sip.setNumericField(name, next),
    onCommit: () => sip.commitField(name),
    density: 'compact' as const,
  });

  return (
    <div className="rounded-band border border-divider bg-surface p-5 shadow-md sm:p-6">
      <p className="font-display text-legal font-semibold uppercase tracking-[0.12em] text-ink-muted">
        Try it with your own numbers
      </p>

      <div className="mt-5 flex flex-col gap-5">
        <SipInputControl
          {...field('monthlyInvestment')}
          label="Monthly investment"
          prefix="₹"
          valueText={`${formatRupees(committed.monthlyInvestment)} per month`}
          minLabel={formatRupeesCompact(SIP_INPUT_LIMITS.monthlyInvestment.min)}
          maxLabel={formatRupeesCompact(SIP_INPUT_LIMITS.monthlyInvestment.max)}
        />

        <SipInputControl
          {...field('durationYears')}
          label="Investment period"
          suffix="years"
          valueText={formatYears(committed.durationYears)}
          minLabel={formatYears(SIP_INPUT_LIMITS.durationYears.min)}
          maxLabel={formatYears(SIP_INPUT_LIMITS.durationYears.max)}
        />

        <SipInputControl
          {...field('annualReturnPct')}
          label="Assumed annual return"
          suffix="% p.a."
          valueText={`${formatPercent(committed.annualReturnPct)} a year`}
          minLabel={formatPercent(SIP_INPUT_LIMITS.annualReturnPct.min)}
          maxLabel={formatPercent(SIP_INPUT_LIMITS.annualReturnPct.max)}
        />
      </div>

      <div className="mt-6 border-t border-divider pt-5">
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {`Projected value ${formatRupees(result.futureValue)} after ${formatYears(committed.durationYears)}: ` +
            `${formatRupees(result.totalInvested)} invested and ${formatRupees(result.estimatedGains)} estimated gains.`}
        </p>

        <p className="font-display text-legal font-semibold uppercase tracking-[0.12em] text-ink-muted">
          Projected value after {formatYears(committed.durationYears)}
        </p>
        <p className="mt-1.5 flex flex-wrap items-baseline gap-x-3">
          <AnimatedRupees value={result.futureValue} className="text-data-lg text-ink-display" />
          <span aria-hidden="true" className="font-display text-body-sm font-medium tabular text-ink-muted">
            ≈ {formatRupeesCompact(result.futureValue)}
          </span>
        </p>

        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
          <div>
            <dt className="flex items-center gap-2 text-legal text-ink-secondary">
              <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-[2px] bg-chart-1" />
              Invested
            </dt>
            <dd className="mt-0.5">
              <AnimatedRupees value={result.totalInvested} className="text-data-md text-ink" />
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-2 text-legal text-ink-secondary">
              <span aria-hidden="true" className="h-2 w-2 shrink-0 rotate-45 bg-chart-2" />
              Estimated gains
            </dt>
            <dd className="mt-0.5">
              <AnimatedRupees value={result.estimatedGains} className="text-data-md text-ink" />
            </dd>
          </div>
        </dl>

        {!isValid && (
          <p className="mt-3 text-legal font-medium text-ink-muted">
            Showing the last valid figures. Fix the highlighted field to update them.
          </p>
        )}

        {/* The short disclaimer sits directly under the figure here too — the
            requirement in §23.5 is about proximity to the result, and this is
            a result. */}
        <SipDisclaimer variant="short" className="mt-4" />

        <Button
          to="/sip-calculator"
          size="md"
          className="mt-5"
          trailingIcon={<ArrowRight size={16} aria-hidden="true" />}
          block
        >
          Open the full calculator
        </Button>
      </div>
    </div>
  );
}
