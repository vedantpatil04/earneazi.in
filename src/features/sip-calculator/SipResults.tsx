import { formatPercent, formatRupees, formatYears } from '@/lib/finance';
import type { SipCalculatorInput, SipCalculatorResult } from '@/lib/finance';

interface SipResultsProps {
  result: SipCalculatorResult;
  input: SipCalculatorInput;
  /** True while the form holds a value the engine rejected — the figures shown are the last valid ones. */
  isStale: boolean;
}

/**
 * The projected total is the answer to the question, so it gets the
 * largest type on the page; the two figures it decomposes into sit beneath
 * it at equal weight, because "how much of this is my own money" is the
 * second thing anyone asks.
 *
 * The whole block is a polite live region: dragging a slider changes these
 * numbers with no other visible confirmation, so a screen reader user needs
 * them announced rather than having to hunt for what moved.
 */
export function SipResults({ result, input, isStale }: SipResultsProps) {
  return (
    <div aria-live="polite" aria-atomic="true" className="flex flex-col">
      <p className="text-small text-ink-secondary">
        Projected value after {formatYears(input.durationYears)}
      </p>
      <p className="mt-2 font-display text-financial-display font-numeric font-medium text-ink">
        {formatRupees(result.futureValue)}
      </p>

      <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-divider bg-divider sm:grid-cols-2">
        <div className="bg-surface p-5">
          <dt className="flex items-center gap-2 text-small text-ink-secondary">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-chart-1" />
            Amount invested
          </dt>
          <dd className="mt-2 font-numeric text-financial font-semibold text-ink">
            {formatRupees(result.totalInvested)}
          </dd>
          <p className="mt-1 text-small text-ink-muted">
            {formatRupees(input.monthlyInvestment)} × {result.installments} months
          </p>
        </div>

        <div className="bg-surface p-5">
          <dt className="flex items-center gap-2 text-small text-ink-secondary">
            <span aria-hidden="true" className="h-2.5 w-2.5 rotate-45 bg-chart-2" />
            Estimated growth
          </dt>
          <dd className="mt-2 font-numeric text-financial font-semibold text-ink">
            {formatRupees(result.estimatedGains)}
          </dd>
          <p className="mt-1 text-small text-ink-muted">
            at an assumed {formatPercent(input.annualReturnPct)} a year
          </p>
        </div>
      </dl>

      {isStale && (
        <p className="mt-4 text-small text-ink-muted">
          Showing the last valid figures. Fix the highlighted field to update them.
        </p>
      )}
    </div>
  );
}
