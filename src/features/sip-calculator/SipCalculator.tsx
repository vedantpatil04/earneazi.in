import { useMemo, useState } from 'react';
import {
  SIP_INPUT_LIMITS,
  calculateSip,
  calculateSipYearlyBreakdown,
  formatPercent,
  formatIndianNumber,
  formatRupees,
  formatRupeesCompact,
  formatYears,
  validateSipInput,
} from '@/lib/finance';
import type { SipCalculatorInput, SipFieldName } from '@/lib/finance';
import { SipInputControl } from './SipInputControl';
import { SipResults } from './SipResults';
import { SipGrowthChart } from './SipGrowthChart';
import { SipYearlyBreakdown } from './SipYearlyBreakdown';

const DEFAULT_INPUT: SipCalculatorInput = {
  monthlyInvestment: 5000,
  annualReturnPct: 12,
  durationYears: 10,
};

type RawInput = Record<SipFieldName, string>;

/**
 * The amount is grouped from the very first paint rather than only after
 * the field has been focused and left — an unformatted "5000" sitting next
 * to a formatted "₹11,61,695" reads as a bug.
 */
const DEFAULT_RAW: RawInput = {
  monthlyInvestment: formatIndianNumber(DEFAULT_INPUT.monthlyInvestment),
  annualReturnPct: String(DEFAULT_INPUT.annualReturnPct),
  durationYears: String(DEFAULT_INPUT.durationYears),
};

/**
 * Owns the calculator's state and nothing else. There is no arithmetic in
 * this file — every figure below comes from `calculateSip` /
 * `calculateSipYearlyBreakdown` in lib/finance, which is also what the
 * chart and the table read. One engine, three views of it.
 *
 * Two pieces of state rather than one, on purpose:
 *   `raw`       what is literally in the text fields, so a half-typed or
 *               temporarily invalid value isn't rewritten under the cursor
 *   `committed` the last set of values the engine accepted
 *
 * Results stay on the last good numbers while an invalid field is being
 * corrected, instead of blanking out or flashing an error where a figure
 * used to be.
 */
export function SipCalculator() {
  const [raw, setRaw] = useState<RawInput>(DEFAULT_RAW);
  const [committed, setCommitted] = useState<SipCalculatorInput>(DEFAULT_INPUT);

  const validation = useMemo(() => validateSipInput(raw), [raw]);
  const errors = validation.ok ? {} : validation.errors;

  const handleChange = (field: SipFieldName) => (nextValue: string) => {
    const nextRaw = { ...raw, [field]: nextValue };
    setRaw(nextRaw);

    const nextValidation = validateSipInput(nextRaw);
    if (nextValidation.ok) setCommitted(nextValidation.input);
  };

  const result = useMemo(() => calculateSip(committed), [committed]);
  const breakdown = useMemo(() => calculateSipYearlyBreakdown(committed), [committed]);

  const chartSummary =
    `Projected growth over ${formatYears(committed.durationYears)}. ` +
    `Starting from ${formatRupees(breakdown[0]?.futureValue ?? 0)} after year one, ` +
    `the projection reaches ${formatRupees(result.futureValue)} by year ${committed.durationYears}, ` +
    `made up of ${formatRupees(result.totalInvested)} invested and ${formatRupees(result.estimatedGains)} ` +
    `of estimated growth. The same figures are listed year by year in the table below.`;

  return (
    <div className="flex flex-col gap-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <h2 className="text-h3 text-ink">Your plan</h2>
          <div className="mt-8 flex flex-col gap-10">
            <SipInputControl
              label="Monthly investment"
              prefix="₹"
              value={raw.monthlyInvestment}
              numericValue={committed.monthlyInvestment}
              limits={SIP_INPUT_LIMITS.monthlyInvestment}
              onChange={handleChange('monthlyInvestment')}
              valueText={`${formatRupees(committed.monthlyInvestment)} per month`}
              minLabel={formatRupeesCompact(SIP_INPUT_LIMITS.monthlyInvestment.min)}
              maxLabel={formatRupeesCompact(SIP_INPUT_LIMITS.monthlyInvestment.max)}
              errorMessage={errors.monthlyInvestment}
              hint="The amount you'd invest on the same date each month."
              formatOnBlur={formatIndianNumber}
            />

            <SipInputControl
              label="Expected return rate"
              suffix="% p.a."
              value={raw.annualReturnPct}
              numericValue={committed.annualReturnPct}
              limits={SIP_INPUT_LIMITS.annualReturnPct}
              onChange={handleChange('annualReturnPct')}
              valueText={`${formatPercent(committed.annualReturnPct)} a year`}
              minLabel={formatPercent(SIP_INPUT_LIMITS.annualReturnPct.min)}
              maxLabel={formatPercent(SIP_INPUT_LIMITS.annualReturnPct.max)}
              errorMessage={errors.annualReturnPct}
              hint="An assumption you're choosing, not a rate anyone is offering you."
            />

            <SipInputControl
              label="Investment period"
              suffix="years"
              value={raw.durationYears}
              numericValue={committed.durationYears}
              limits={SIP_INPUT_LIMITS.durationYears}
              onChange={handleChange('durationYears')}
              valueText={formatYears(committed.durationYears)}
              minLabel={formatYears(SIP_INPUT_LIMITS.durationYears.min)}
              maxLabel={formatYears(SIP_INPUT_LIMITS.durationYears.max)}
              errorMessage={errors.durationYears}
              hint="How long the money stays invested."
            />
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-lg border border-divider bg-bg p-6 sm:p-8">
            <SipResults result={result} input={committed} isStale={!validation.ok} />
            <div className="mt-10 border-t border-divider pt-8">
              <SipGrowthChart breakdown={breakdown} summary={chartSummary} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-h3 text-ink">Year by year</h2>
        <p className="mt-3 max-w-prose text-body text-ink-secondary">
          The same projection, written out. Each row shows where the plan stands at the end of that year.
        </p>
        <div className="mt-6">
          <SipYearlyBreakdown breakdown={breakdown} />
        </div>
      </div>
    </div>
  );
}
