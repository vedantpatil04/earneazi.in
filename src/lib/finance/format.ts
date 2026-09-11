/**
 * Display formatting for financial figures. Pure functions, no UI imports.
 *
 * Indian digit grouping (2,2,3 — ₹11,61,695 rather than ₹1,161,695) comes
 * from the `en-IN` locale rather than a hand-rolled regex, so it stays
 * correct for lakh and crore magnitudes without special-casing.
 */

const RUPEE_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const PLAIN_FORMATTER = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

/** Shown wherever a value can't be rendered — never "NaN", "Infinity" or "undefined". */
const NOT_AVAILABLE = '—';

function isRenderable(value: number): boolean {
  return Number.isFinite(value);
}

/** e.g. 1161695.4 → "₹11,61,695". Rounds at the last possible moment, never in the engine. */
export function formatRupees(value: number): string {
  if (!isRenderable(value)) return NOT_AVAILABLE;
  return RUPEE_FORMATTER.format(Math.round(value));
}

/** Digits only, same grouping, for places where the ₹ sign is already present (e.g. a prefixed input). */
export function formatIndianNumber(value: number): string {
  if (!isRenderable(value)) return NOT_AVAILABLE;
  return PLAIN_FORMATTER.format(Math.round(value));
}

/**
 * Short form for chart axes, where a full figure would collide with its
 * neighbour: ₹1.2L, ₹4.5Cr. Uses the Indian lakh/crore scale rather than
 * K/M/B, which is what the numbers on this page are read in.
 */
export function formatRupeesCompact(value: number): string {
  if (!isRenderable(value)) return NOT_AVAILABLE;

  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs >= 10000000) return `${sign}₹${trimTrailingZero(abs / 10000000)}Cr`;
  if (abs >= 100000) return `${sign}₹${trimTrailingZero(abs / 100000)}L`;
  if (abs >= 1000) return `${sign}₹${trimTrailingZero(abs / 1000)}K`;
  return `${sign}₹${Math.round(abs)}`;
}

function trimTrailingZero(value: number): string {
  return value.toFixed(1).replace(/\.0$/, '');
}

/** e.g. 12 → "12%", 12.5 → "12.5%". Keeps one decimal only when there is one. */
export function formatPercent(value: number): string {
  if (!isRenderable(value)) return NOT_AVAILABLE;
  return `${trimTrailingZero(value)}%`;
}

/** "10 years" / "1 year" — used in the accessible descriptions of the sliders. */
export function formatYears(value: number): string {
  if (!isRenderable(value)) return NOT_AVAILABLE;
  return `${value} ${value === 1 ? 'year' : 'years'}`;
}
