import { useState } from 'react';
import { formatRupees, formatRupeesCompact } from '@/lib/finance';
import type { SipYearlyBreakdownPoint } from '@/lib/finance';

interface SipYearlyBreakdownProps {
  breakdown: SipYearlyBreakdownPoint[];
}

const COLLAPSED_ROWS = 10;

/**
 * The same projection as the chart, as numbers you can actually read off.
 *
 * This is a real `<table>` with scoped headers and a caption, which is what
 * makes it navigable row-by-row in a screen reader — and it doubles as the
 * accessible alternative to the chart, so the data is never locked inside
 * the graphic.
 *
 * Long horizons are collapsed to the first ten years by default: a
 * forty-row wall pushes the disclaimer and the explanatory content off the
 * bottom of the page for no benefit.
 *
 * On a phone the figures switch to their lakh/crore short form so that all
 * four columns fit on screen at once. Full precision on a 390px viewport
 * would push the projected value — the column people came for — off the
 * right edge behind a horizontal scroll.
 */
export function SipYearlyBreakdown({ breakdown }: SipYearlyBreakdownProps) {
  const [expanded, setExpanded] = useState(false);
  const isCollapsible = breakdown.length > COLLAPSED_ROWS;
  const visibleRows = expanded || !isCollapsible ? breakdown : breakdown.slice(0, COLLAPSED_ROWS);

  return (
    <div>
      <div
        role="region"
        aria-label="Year-by-year projection, scrollable"
        tabIndex={0}
        className="overflow-x-auto rounded-lg border border-divider focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <table className="w-full min-w-[21rem] border-collapse text-left sm:min-w-[34rem]">
          <caption className="sr-only">
            Year-by-year projection showing the amount invested, estimated growth and projected value at the end of
            each year.
          </caption>
          <thead>
            <tr className="border-b border-divider bg-surface-2">
              <th scope="col" className="px-2.5 py-3 text-label font-semibold text-ink sm:px-4">
                Year
              </th>
              <th scope="col" className="px-2.5 py-3 text-right text-label font-semibold text-ink sm:px-4">
                Invested
              </th>
              <th scope="col" className="px-2.5 py-3 text-right text-label font-semibold text-ink sm:px-4">
                Est. growth
              </th>
              <th scope="col" className="px-2.5 py-3 text-right text-label font-semibold text-ink sm:px-4">
                Projected
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.year} className="border-b border-divider last:border-b-0">
                <th scope="row" className="px-2.5 py-3 font-mono text-small font-medium font-numeric text-ink sm:px-4">
                  {row.year}
                </th>
                <td className="px-2.5 py-3 text-right font-numeric text-small text-ink-secondary sm:px-4">
                  <Money value={row.totalInvested} />
                </td>
                <td className="px-2.5 py-3 text-right font-numeric text-small text-ink-secondary sm:px-4">
                  <Money value={row.estimatedGains} />
                </td>
                <td className="px-2.5 py-3 text-right font-numeric text-small font-semibold text-ink sm:px-4">
                  <Money value={row.futureValue} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isCollapsible && (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
          className="mt-4 inline-flex min-h-[2.75rem] items-center rounded-md border border-divider px-4 text-small font-medium text-ink transition-colors motion-safe:duration-200 hover:border-border hover:bg-surface-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          {expanded ? `Show first ${COLLAPSED_ROWS} years` : `Show all ${breakdown.length} years`}
        </button>
      )}
    </div>
  );
}

/** Short form on phones, exact figure from the `sm` breakpoint up. `hidden` is display:none, so only one of the two is ever announced. */
function Money({ value }: { value: number }) {
  return (
    <>
      <span className="sm:hidden">{formatRupeesCompact(value)}</span>
      <span className="hidden sm:inline">{formatRupees(value)}</span>
    </>
  );
}
