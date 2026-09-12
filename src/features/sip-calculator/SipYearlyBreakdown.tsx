import { useState } from 'react';
import { formatRupees, formatRupeesCompact } from '@/lib/finance';
import type { SipYearlyBreakdownPoint } from '@/lib/finance';

interface SipYearlyBreakdownProps {
  breakdown: SipYearlyBreakdownPoint[];
}

const COLLAPSED_ROWS = 10;

/**
 * The same projection as the chart, as numbers you can read off.
 *
 * This is a real `<table>` with scoped headers and a caption, which is what
 * makes it navigable row by row in a screen reader — and it doubles as the
 * accessible alternative to the chart, so the data is never locked inside
 * the graphic. Both read the same rows from the same engine.
 *
 * Long horizons collapse to the first ten years by default: a forty-row wall
 * pushes everything after it off the bottom of the page for no benefit, and
 * the shape of the projection is already legible in the first decade.
 *
 * On a phone the figures switch to their lakh/crore short form so all four
 * columns fit at once. Full precision on a 360px viewport would push the
 * projected value — the column people came for — off the right edge behind a
 * horizontal scroll.
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
        className="overflow-x-auto rounded-surface border border-divider"
      >
        <table className="w-full min-w-[20rem] border-collapse text-left sm:min-w-[34rem]">
          <caption className="sr-only">
            Year-by-year projection showing the amount invested, estimated gains and projected value at the end of
            each year.
          </caption>
          <thead>
            <tr className="border-b border-divider bg-surface-sunken">
              <th scope="col" className="px-3 py-3 text-body-sm font-semibold text-ink sm:px-4">
                Year
              </th>
              <th scope="col" className="px-3 py-3 text-right text-body-sm font-semibold text-ink sm:px-4">
                Invested
              </th>
              <th scope="col" className="px-3 py-3 text-right text-body-sm font-semibold text-ink sm:px-4">
                Est. gains
              </th>
              <th scope="col" className="px-3 py-3 text-right text-body-sm font-semibold text-ink sm:px-4">
                Projected
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.year} className="border-b border-divider last:border-b-0">
                <th
                  scope="row"
                  className="px-3 py-3 font-display text-body-sm font-semibold tabular text-ink sm:px-4"
                >
                  {row.year}
                </th>
                <td className="px-3 py-3 text-right text-body-sm tabular text-ink-secondary sm:px-4">
                  <Money value={row.totalInvested} />
                </td>
                <td className="px-3 py-3 text-right text-body-sm tabular text-ink-secondary sm:px-4">
                  <Money value={row.estimatedGains} />
                </td>
                <td className="px-3 py-3 text-right text-body-sm font-semibold tabular text-ink sm:px-4">
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
          className="mt-4 inline-flex min-h-11 items-center rounded-action border border-border px-4 text-body-sm font-semibold text-ink transition-colors duration-instant ease-out hover:bg-hovered"
        >
          {expanded ? `Show first ${COLLAPSED_ROWS} years` : `Show all ${breakdown.length} years`}
        </button>
      )}
    </div>
  );
}

/** Short form on phones, exact figure from `sm` up. `hidden` is display:none, so only one of the two is ever announced. */
function Money({ value }: { value: number }) {
  return (
    <>
      <span className="sm:hidden">{formatRupeesCompact(value)}</span>
      <span className="hidden sm:inline">{formatRupees(value)}</span>
    </>
  );
}
