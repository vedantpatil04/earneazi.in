import { ConversationCta } from '@/components/conversion/ConversationCta';
import { formatPercent, formatRupees, formatRupeesCompact, formatYears } from '@/lib/finance';
import type { SipCalculatorInput, SipCalculatorResult } from '@/lib/finance';
import { sipConversation } from '@/lib/contact/conversation';
import { cn } from '@/lib/utils/cn';
import { AnimatedRupees } from './AnimatedRupees';

interface SipResultsProps {
  result: SipCalculatorResult;
  input: SipCalculatorInput;
  /** False while a field holds a value the engine rejected — the figures shown are the last valid ones. */
  isValid: boolean;
}

/**
 * The answer to the question the page asks, and therefore the largest thing
 * on it.
 *
 * The projected total gets `data-lg`; the two figures it decomposes into sit
 * beneath at equal weight, because "how much of this is my own money" is the
 * second thing anyone asks and it deserves to be answered without a click.
 *
 * ── The split bar ───────────────────────────────────────────────────────
 *
 * The one piece of geometry here, and it earns its place: it is the same two
 * numbers as a proportion, which is the fact people actually take away
 * ("more than half of this is growth"). It is drawn from the result, not
 * decoration, and the growth segment carries a hatch as well as a colour so
 * the two parts stay separable without relying on hue.
 *
 * ── Announcements ───────────────────────────────────────────────────────
 *
 * The visible figures are not a live region. They tween (see AnimatedRupees)
 * and there are five of them, so making the panel live and atomic would have
 * a screen reader re-read the whole block on every frame of a slider drag.
 * Instead there is one short sentence in a polite live region carrying the
 * settled values, and the visible numbers each keep an accurate
 * screen-reader copy for anyone reading the page rather than listening to it
 * change.
 */
export function SipResults({ result, input, isValid }: SipResultsProps) {

  /* Guarded because a zero return rate is a legitimate input, and at a zero
     projected value the ratio would be 0/0. */
  const investedShare = result.futureValue > 0 ? (result.totalInvested / result.futureValue) * 100 : 100;

  return (
    <div className="flex flex-col">
      {/* The settled figures, for assistive technology only. */}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {`Projected value ${formatRupees(result.futureValue)} after ${formatYears(input.durationYears)}: ` +
          `${formatRupees(result.totalInvested)} invested and ${formatRupees(result.estimatedGains)} estimated growth, ` +
          `assuming ${formatPercent(input.annualReturnPct)} a year.`}
      </p>

      <p className="font-display text-legal font-semibold uppercase tracking-[0.12em] text-ink-muted">
        Projected value after {formatYears(input.durationYears)}
      </p>

      <p className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <AnimatedRupees value={result.futureValue} className="text-data-lg text-ink-display" />
        {/* The compact reading accompanies the exact figure and never
            replaces it (§23.1) — it is what people repeat out loud. */}
        <span aria-hidden="true" className="font-display text-body-sm font-medium tabular text-ink-muted">
          ≈ {formatRupeesCompact(result.futureValue)}
        </span>
      </p>

      <div
        aria-hidden="true"
        className="inset-well mt-6 flex h-2.5 w-full overflow-hidden rounded-pill border border-divider bg-surface-sunken"
      >
        <span className="h-full bg-chart-1" style={{ width: `${investedShare}%` }} />
        {/* Hatched, so the segments are told apart by texture as well as by
            colour. The stripe is drawn in the growth series' own colour over
            a lightened instance of it, which keeps it legible on both
            themes without a second token. */}
        <span
          className="h-full flex-1 bg-chart-2"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, rgb(var(--color-surface) / 0.55) 0 3px, transparent 3px 7px)',
          }}
        />
      </div>

      <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Figure
          label="Amount invested"
          value={result.totalInvested}
          note={`${formatRupees(input.monthlyInvestment)} × ${result.installments} months`}
          marker="square"
        />
        <Figure
          label="Estimated gains"
          value={result.estimatedGains}
          note={`at an assumed ${formatPercent(input.annualReturnPct)} a year`}
          marker="diamond"
        />
      </dl>

      {/*
        The assumption line (§23.3). It sits with the number rather than in
        the explanatory section further down, because a figure read without
        its assumption is a figure read wrongly.
      */}
      <p className="mt-6 border-t border-divider pt-5 text-body-sm text-ink-secondary">
        Assumes {formatPercent(input.annualReturnPct)} a year, divided evenly across twelve months, with each
        instalment invested at the start of its month. That rate is an assumption you chose, not one anyone is
        offering.
      </p>

      {!isValid && (
        <p className="mt-3 text-body-sm font-medium text-ink-muted">
          Showing the last valid figures. Fix the highlighted field to update them.
        </p>
      )}

      {/*
        Phase 4 resolved this destination in its own module, which was the
        seam left for Phase 5 to consume. It now goes through the one shared
        control every other conversation CTA on the site uses — same wording
        rules, same accessible name, same fallback — and the three inputs
        still travel with it while the projected figure still does not.
      */}
      <div className="mt-6">
        <ConversationCta context={sipConversation(input)} size="lg" showChannelIcon block>
          Talk through this plan
        </ConversationCta>
      </div>
    </div>
  );
}

function Figure({
  label,
  value,
  note,
  marker,
}: {
  label: string;
  value: number;
  note: string;
  marker: 'square' | 'diamond';
}) {
  return (
    <div className="inset-well rounded-surface border border-divider bg-surface-sunken p-4">
      <dt className="flex items-center gap-2 text-body-sm text-ink-secondary">
        {/* Shape as well as colour, matching the chart legend and the split
            bar, so the three readings of the same two series agree. */}
        <span
          aria-hidden="true"
          className={cn(
            'h-2.5 w-2.5 shrink-0',
            marker === 'square' ? 'rounded-[2px] bg-chart-1' : 'rotate-45 bg-chart-2'
          )}
        />
        {label}
      </dt>
      <dd className="mt-1.5">
        <AnimatedRupees value={value} className="text-data-md text-ink-display" />
      </dd>
      <p className="mt-1 text-legal text-ink-muted">{note}</p>
    </div>
  );
}
