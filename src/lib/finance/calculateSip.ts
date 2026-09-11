import type {
  SipCalculatorInput,
  SipCalculatorResult,
  SipFieldName,
  SipInputLimits,
  SipValidationResult,
  SipYearlyBreakdownPoint,
} from './types';

/**
 * ─────────────────────────────────────────────────────────────────────────
 * SIP CALCULATION ENGINE
 * ─────────────────────────────────────────────────────────────────────────
 * Pure functions only. No React, no DOM, no chart code, no formatting, no
 * network. Everything here is deterministic and unit-tested in
 * ./calculateSip.test.ts.
 *
 * ── Conventions, stated explicitly ──────────────────────────────────────
 *
 * 1. CONTRIBUTION TIMING — annuity due.
 *    Each instalment is treated as invested at the BEGINNING of its month,
 *    so every contribution earns one extra month of growth compared with an
 *    ordinary annuity. This is the trailing (1 + i) term:
 *
 *        FV = P × [ ((1 + i)^n − 1) / i ] × (1 + i)
 *
 *    Most published Indian SIP calculators use this same convention.
 *
 * 2. MONTHLY RATE — nominal annual rate divided into twelve equal periods.
 *
 *        i = annualReturnPct / 12 / 100
 *
 *    This is the convention fixed by the project specification, and it is
 *    what `monthlyRateFromAnnualPct` implements. Note that it is NOT the
 *    only convention in use: several large fund houses instead derive the
 *    monthly rate geometrically, as (1 + annualRate)^(1/12) − 1, which for
 *    12% p.a. gives roughly 0.9489% per month rather than 1.0000% and
 *    therefore a visibly smaller corpus over long horizons.
 *
 *    The two are not interchangeable and the difference compounds, so the
 *    choice is isolated in the single function below. Switching conventions
 *    is a one-line change there and nowhere else — deliberately, so it can
 *    never drift apart from the breakdown or the chart.
 *
 * 3. PRECISION — no intermediate rounding. Every value returned is at full
 *    floating-point precision; rounding happens only at display time in
 *    ./format.ts.
 */

/**
 * Accepted input ranges. The UI reads these directly for its slider bounds
 * and its numeric `min`/`max`, so the control can never offer a value the
 * engine would reject.
 */
export const SIP_INPUT_LIMITS: SipInputLimits = {
  monthlyInvestment: { min: 500, max: 500000, step: 500 },
  annualReturnPct: { min: 0, max: 30, step: 0.1 },
  durationYears: { min: 1, max: 40, step: 1 },
};

const FIELD_LABELS: Record<SipFieldName, string> = {
  monthlyInvestment: 'Monthly investment',
  annualReturnPct: 'Expected return rate',
  durationYears: 'Investment period',
};

const MONTHS_PER_YEAR = 12;

/**
 * Converts an annual return percentage into the monthly rate used by the
 * future-value formula. See convention 2 in the header — this is the single
 * place that decision lives.
 */
export function monthlyRateFromAnnualPct(annualReturnPct: number): number {
  return annualReturnPct / MONTHS_PER_YEAR / 100;
}

/**
 * Future value of an annuity due: `n` payments of `P`, each made at the
 * start of its period, compounding at rate `i` per period.
 *
 * The `i === 0` branch is not an optimisation — the general form divides by
 * `i` and would return NaN at a zero return rate, which is a perfectly
 * legitimate thing for someone to type into the calculator.
 */
function futureValueOfAnnuityDue(payment: number, ratePerPeriod: number, periods: number): number {
  if (periods <= 0) return 0;
  if (ratePerPeriod === 0) return payment * periods;

  const growthFactor = Math.pow(1 + ratePerPeriod, periods);
  return payment * ((growthFactor - 1) / ratePerPeriod) * (1 + ratePerPeriod);
}

function isRealNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Checks a set of raw values against SIP_INPUT_LIMITS and returns either a
 * usable input or a per-field map of messages written for the person
 * filling the form, not for a developer.
 *
 * Accepts `unknown` on purpose: the values arriving from a text input are
 * strings that may be empty, partially typed, or not numeric at all, and
 * that is the case this has to handle rather than assume away.
 */
export function validateSipInput(raw: {
  monthlyInvestment: unknown;
  annualReturnPct: unknown;
  durationYears: unknown;
}): SipValidationResult {
  const errors: Partial<Record<SipFieldName, string>> = {};
  const values: Partial<SipCalculatorInput> = {};

  (Object.keys(FIELD_LABELS) as SipFieldName[]).forEach((field) => {
    const value = raw[field];
    const limits = SIP_INPUT_LIMITS[field];
    const label = FIELD_LABELS[field];

    if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
      errors[field] = `${label} is required.`;
      return;
    }

    // Strip the grouping separators and currency mark the field may
    // legitimately contain — "₹5,000" is what the input shows once it has
    // been formatted on blur, and it has to survive a round trip.
    const numeric =
      typeof value === 'string' ? Number(value.replace(/[₹,\s]/g, '')) : value;

    if (!isRealNumber(numeric)) {
      errors[field] = `${label} must be a number.`;
      return;
    }

    if (numeric < limits.min) {
      errors[field] = `${label} must be at least ${limits.min}.`;
      return;
    }

    if (numeric > limits.max) {
      errors[field] = `${label} must be ${limits.max} or less.`;
      return;
    }

    values[field] = numeric;
  });

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, input: values as SipCalculatorInput };
}

/**
 * The projected outcome of a SIP. Throws rather than returning NaN if given
 * something outside the accepted ranges — a calculator that quietly renders
 * "₹NaN" is worse than one that fails loudly during development, and the UI
 * validates before it ever gets here.
 */
export function calculateSip(input: SipCalculatorInput): SipCalculatorResult {
  const validation = validateSipInput(input);
  if (!validation.ok) {
    throw new RangeError(`Invalid SIP input: ${Object.values(validation.errors).join(' ')}`);
  }

  const { monthlyInvestment, annualReturnPct, durationYears } = validation.input;

  const monthlyRate = monthlyRateFromAnnualPct(annualReturnPct);
  const installments = Math.round(durationYears * MONTHS_PER_YEAR);

  const totalInvested = monthlyInvestment * installments;
  const futureValue = futureValueOfAnnuityDue(monthlyInvestment, monthlyRate, installments);

  return {
    totalInvested,
    futureValue,
    estimatedGains: futureValue - totalInvested,
    monthlyRate,
    installments,
  };
}

/**
 * Year-by-year projection, produced by running the same annuity-due formula
 * at shorter horizons. There is deliberately no second implementation of
 * the maths here: year `y` is simply the same calculation with `y × 12`
 * instalments, so the final row always equals `calculateSip` exactly.
 */
export function calculateSipYearlyBreakdown(input: SipCalculatorInput): SipYearlyBreakdownPoint[] {
  const validation = validateSipInput(input);
  if (!validation.ok) {
    throw new RangeError(`Invalid SIP input: ${Object.values(validation.errors).join(' ')}`);
  }

  const { monthlyInvestment, annualReturnPct, durationYears } = validation.input;
  const monthlyRate = monthlyRateFromAnnualPct(annualReturnPct);
  const wholeYears = Math.floor(durationYears);

  const rows: SipYearlyBreakdownPoint[] = [];

  for (let year = 1; year <= wholeYears; year += 1) {
    const installments = year * MONTHS_PER_YEAR;
    const totalInvested = monthlyInvestment * installments;
    const futureValue = futureValueOfAnnuityDue(monthlyInvestment, monthlyRate, installments);

    rows.push({
      year,
      totalInvested,
      futureValue,
      estimatedGains: futureValue - totalInvested,
    });
  }

  return rows;
}
