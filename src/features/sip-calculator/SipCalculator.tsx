import {
  SIP_INPUT_LIMITS,
  formatPercent,
  formatRupees,
  formatRupeesCompact,
  formatYears,
} from '@/lib/finance';
import type { SipFieldName } from '@/lib/finance';
import { SipInputControl } from './SipInputControl';
import { SipResults } from './SipResults';
import { SipDisclaimer } from './SipDisclaimer';
import { SipChartPanel } from './SipChartPanel';
import { SipYearlyBreakdown } from './SipYearlyBreakdown';
import { AnimatedRupees } from './AnimatedRupees';
import { useSipCalculator } from './useSipCalculator';

/**
 * The full calculator — the standalone `/sip-calculator` experience.
 *
 * ── Composition, and why there are two of them ──────────────────────────
 *
 * §23.3 puts the output panel adjacent to the controls at ≥1024px and
 * beneath them below it, and makes the panel sticky within the section so
 * the figures stay visible while the sliders are being used. That works on a
 * pointer, where the two columns fit side by side.
 *
 * It does not work on a phone, and shrinking it is not a design. A stacked
 * layout puts the result below three controls, so the moment you drag a
 * slider the number you are dragging it for leaves the screen. So the small
 * composition is a different one: a slim sticky bar carrying the projected
 * value rides under the header for the length of the calculator, and the
 * full panel sits below the controls as before. The number is on screen the
 * whole time the thumb is moving, and it costs 52px rather than a viewport.
 *
 * Both are the same three controls, the same panel and the same engine —
 * what changes is where the answer lives while you are working.
 *
 * ── Order on the page ───────────────────────────────────────────────────
 *
 * Controls, result, disclaimer, chart, table. The disclaimer is immediately
 * below the result panel because §23.5 requires it there, and because a
 * figure read without its limits is a figure read wrongly.
 *
 * ── No arithmetic in this file ──────────────────────────────────────────
 *
 * Every figure comes from `useSipCalculator`, which owns state and defers
 * all of it to `lib/finance`. The homepage panel runs the same hook, so the
 * two surfaces cannot disagree about a bound, a validation message or a
 * rupee.
 */
export function SipCalculator() {
  const sip = useSipCalculator();
  const { committed, errors, isValid, result, breakdown } = sip;

  const chartSummary =
    `Projected growth over ${formatYears(committed.durationYears)}. ` +
    `Starting from ${formatRupees(breakdown[0]?.futureValue ?? 0)} after year one, ` +
    `the projection reaches ${formatRupees(result.futureValue)} by year ${committed.durationYears}, ` +
    `made up of ${formatRupees(result.totalInvested)} invested and ${formatRupees(result.estimatedGains)} ` +
    `of estimated gains. The same figures are listed year by year in the table below.`;

  const field = (name: SipFieldName) => ({
    value: sip.raw[name],
    numericValue: committed[name],
    limits: SIP_INPUT_LIMITS[name],
    errorMessage: errors[name],
    onChange: (next: string) => sip.setField(name, next),
    onSlide: (next: number) => sip.setNumericField(name, next),
    onCommit: () => sip.commitField(name),
  });

  return (
    /*
      `data-conversion-suppress` hides the floating contact control while any
      of this is on screen. §25 calls this out specifically: on a narrow
      viewport the control lands exactly on the right edge of the output
      panel, over the figures and the CTA it would be competing with.
    */
    <div data-conversion-suppress className="flex flex-col gap-10 lg:gap-14">
      {/*
        The small-screen answer strip. Rendered only below `lg`, where the
        panel is not adjacent to the controls. It is `aria-hidden` because
        the results panel below already carries these figures and their live
        region — this is a second view of the same number, not a second
        number.
      */}
      <div
        aria-hidden="true"
        className="sticky top-[var(--header-height)] z-10 -mx-gutter flex items-center justify-between gap-4 border-b border-divider bg-bg/95 px-gutter py-2.5 backdrop-blur-sm lg:hidden"
      >
        <span className="font-display text-legal font-semibold uppercase tracking-[0.12em] text-ink-muted">
          Projected value
        </span>
        <AnimatedRupees value={result.futureValue} className="text-data-md text-ink-display" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12">
        {/* ── Controls ───────────────────────────────────────────────── */}
        <section aria-labelledby="sip-inputs-heading" className="lg:col-span-5">
          <h2 id="sip-inputs-heading" className="text-display-xs text-ink-display">
            Your plan
          </h2>

          <div className="mt-6 flex flex-col gap-7 lg:gap-8">
            <SipInputControl
              {...field('monthlyInvestment')}
              label="Monthly investment"
              prefix="₹"
              valueText={`${formatRupees(committed.monthlyInvestment)} per month`}
              minLabel={formatRupeesCompact(SIP_INPUT_LIMITS.monthlyInvestment.min)}
              maxLabel={formatRupeesCompact(SIP_INPUT_LIMITS.monthlyInvestment.max)}
              hint="The amount you'd invest on the same date each month."
            />

            <SipInputControl
              {...field('annualReturnPct')}
              label="Assumed annual return"
              suffix="% p.a."
              valueText={`${formatPercent(committed.annualReturnPct)} a year`}
              minLabel={formatPercent(SIP_INPUT_LIMITS.annualReturnPct.min)}
              maxLabel={formatPercent(SIP_INPUT_LIMITS.annualReturnPct.max)}
              hint="An assumption you're choosing, not a rate anyone is offering you."
            />

            <SipInputControl
              {...field('durationYears')}
              label="Investment period"
              suffix="years"
              valueText={formatYears(committed.durationYears)}
              minLabel={formatYears(SIP_INPUT_LIMITS.durationYears.min)}
              maxLabel={formatYears(SIP_INPUT_LIMITS.durationYears.max)}
              hint="How long the money stays invested."
            />
          </div>
        </section>

        {/* ── Result ─────────────────────────────────────────────────── */}
        <section aria-labelledby="sip-result-heading" className="lg:col-span-7">
          <h2 id="sip-result-heading" className="sr-only">
            Your projection
          </h2>

          {/*
            Sticky within the section on desktop (§23.3), so the figures stay
            on screen while the sliders are being worked. `top` clears the
            header the same way every other pinned element on the site does.
          */}
          <div className="lg:sticky lg:top-[calc(var(--header-height)_+_1.5rem)]">
            <div className="rounded-band border border-divider bg-surface p-5 shadow-sm sm:p-6 lg:p-7">
              <SipResults result={result} input={committed} isValid={isValid} />
            </div>

            {/* §23.5 — immediately below the result panel, not in the footer
                and not in a section further down the page. */}
            <SipDisclaimer className="mt-4" />
          </div>
        </section>
      </div>

      {/* ── Chart ────────────────────────────────────────────────────── */}
      <section aria-labelledby="sip-chart-heading">
        <h2 id="sip-chart-heading" className="text-display-xs text-ink-display">
          How it builds up
        </h2>
        <p className="mt-2 max-w-measure text-body text-ink-secondary">
          The gap between the two bands is the part that isn&rsquo;t your own money. It widens slowly and then quickly
          — that shape is the whole argument for starting early.
        </p>
        <div className="mt-6 rounded-band border border-divider bg-surface p-4 sm:p-6">
          <SipChartPanel breakdown={breakdown} summary={chartSummary} />
        </div>
      </section>

      {/* ── Table ────────────────────────────────────────────────────── */}
      <section aria-labelledby="sip-table-heading">
        <h2 id="sip-table-heading" className="text-display-xs text-ink-display">
          Year by year
        </h2>
        <p className="mt-2 max-w-measure text-body text-ink-secondary">
          The same projection, written out — and the accessible equivalent of the chart above, so the figures are
          never locked inside the graphic.
        </p>
        <div className="mt-6">
          <SipYearlyBreakdown breakdown={breakdown} />
        </div>
      </section>
    </div>
  );
}
