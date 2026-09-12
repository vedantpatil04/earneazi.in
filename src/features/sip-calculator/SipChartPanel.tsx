import { Suspense, lazy } from 'react';
import type { SipYearlyBreakdownPoint } from '@/lib/finance';

/**
 * The chart, loaded only once something is going to draw one.
 *
 * §30 and §23.4 both require Recharts to be lazy: it is roughly as large as
 * the rest of the application, and the only thing on the site that uses it
 * is this chart. The route is already code-split, but that is not enough on
 * its own — the homepage now carries a working SIP panel, and without this
 * boundary importing the calculator's state anywhere near it would drag the
 * charting library into the entry bundle.
 *
 * So the import lives behind `React.lazy` rather than at module scope, which
 * puts Recharts in a chunk of its own that is fetched when this component
 * first renders and never before.
 *
 * ── The fallback holds the space ────────────────────────────────────────
 *
 * It reserves exactly the height the chart will occupy rather than showing a
 * spinner, because a chart appearing into zero height shoves the disclaimer
 * and the table down the page as it arrives, which is a layout shift charged
 * against the CLS budget in §30. It is `aria-hidden` and silent: the chart's
 * accessible content is the summary sentence and the data table, both of
 * which are already in the DOM and neither of which is waiting on this.
 */
const SipGrowthChart = lazy(() => import('./SipGrowthChart'));

interface SipChartPanelProps {
  breakdown: SipYearlyBreakdownPoint[];
  summary: string;
  compact?: boolean;
}

export function SipChartPanel({ breakdown, summary, compact = false }: SipChartPanelProps) {
  return (
    <Suspense
      fallback={
        <div aria-hidden="true">
          <div
            className={
              compact
                ? 'h-52 w-full rounded-surface bg-surface-sunken'
                : 'h-64 w-full rounded-surface bg-surface-sunken sm:h-80 lg:h-96'
            }
          />
          {/* The legend row, reserved too — the chart's caption is part of
              the height the arriving chunk will occupy. */}
          <div className="mt-4 border-t border-divider pt-4">
            <div className="h-5" />
          </div>
        </div>
      }
    >
      <SipGrowthChart breakdown={breakdown} summary={summary} compact={compact} />
    </Suspense>
  );
}
