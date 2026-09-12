import { describe, expect, it } from 'vitest';
import {
  SIP_DEFAULT_INPUT,
  SIP_INPUT_LIMITS,
  calculateSip,
  calculateSipYearlyBreakdown,
  clampSipValue,
  monthlyRateFromAnnualPct,
  validateSipInput,
} from './calculateSip';
import { formatRupees } from './format';

/**
 * The engine's contract, pinned.
 *
 * The expected figures below are not derived from this implementation —
 * they are published worked examples from independent SIP calculators that
 * use the same two conventions we do (annuity due, and a monthly rate of
 * annualRate ÷ 12). Cross-checking against sources that share the
 * conventions is the point: a calculator using end-of-month contributions,
 * or a geometric monthly rate, will legitimately disagree with all of these
 * without either side being wrong.
 */

/** Rounded the way the UI rounds, so the comparison is against what a person actually sees. */
const asDisplayed = (value: number) => Math.round(value);

describe('monthlyRateFromAnnualPct', () => {
  it('divides the nominal annual rate into twelve equal periods', () => {
    expect(monthlyRateFromAnnualPct(12)).toBeCloseTo(0.01, 12);
    expect(monthlyRateFromAnnualPct(0)).toBe(0);
    expect(monthlyRateFromAnnualPct(7.2)).toBeCloseTo(0.006, 12);
  });
});

describe('calculateSip — cross-checked against published reference figures', () => {
  it('matches ₹12,809 for ₹1,000/month at 12% over 1 year', () => {
    const result = calculateSip({ monthlyInvestment: 1000, annualReturnPct: 12, durationYears: 1 });
    expect(asDisplayed(result.futureValue)).toBe(12809);
    expect(result.totalInvested).toBe(12000);
    expect(asDisplayed(result.estimatedGains)).toBe(809);
  });

  it('matches ₹1,16,170 for ₹500/month at 12% over 10 years', () => {
    const result = calculateSip({ monthlyInvestment: 500, annualReturnPct: 12, durationYears: 10 });
    expect(asDisplayed(result.futureValue)).toBe(116170);
    expect(result.totalInvested).toBe(60000);
  });

  it('matches ₹11,61,695 for ₹5,000/month at 12% over 10 years', () => {
    const result = calculateSip({ monthlyInvestment: 5000, annualReturnPct: 12, durationYears: 10 });
    expect(asDisplayed(result.futureValue)).toBe(1161695);
    expect(result.totalInvested).toBe(600000);
    expect(asDisplayed(result.estimatedGains)).toBe(561695);
  });
});

describe('calculateSip — edge cases', () => {
  it('returns exactly the invested amount at a zero return rate', () => {
    const result = calculateSip({ monthlyInvestment: 5000, annualReturnPct: 0, durationYears: 10 });
    expect(result.futureValue).toBe(600000);
    expect(result.totalInvested).toBe(600000);
    expect(result.estimatedGains).toBe(0);
    expect(Number.isFinite(result.futureValue)).toBe(true);
  });

  it('handles the shortest allowed duration', () => {
    const result = calculateSip({ monthlyInvestment: 500, annualReturnPct: 12, durationYears: 1 });
    expect(result.installments).toBe(12);
    expect(asDisplayed(result.futureValue)).toBe(6405);
  });

  it('handles the longest allowed duration without overflowing', () => {
    const result = calculateSip({
      monthlyInvestment: SIP_INPUT_LIMITS.monthlyInvestment.max,
      annualReturnPct: SIP_INPUT_LIMITS.annualReturnPct.max,
      durationYears: SIP_INPUT_LIMITS.durationYears.max,
    });
    expect(Number.isFinite(result.futureValue)).toBe(true);
    expect(result.futureValue).toBeGreaterThan(result.totalInvested);
  });

  it('handles the smallest and largest allowed monthly investments', () => {
    const { min, max } = SIP_INPUT_LIMITS.monthlyInvestment;
    const small = calculateSip({ monthlyInvestment: min, annualReturnPct: 10, durationYears: 5 });
    const large = calculateSip({ monthlyInvestment: max, annualReturnPct: 10, durationYears: 5 });
    expect(small.futureValue).toBeGreaterThan(0);
    // The formula is linear in the contribution, so the ratio of the outputs
    // is exactly the ratio of the inputs.
    expect(large.futureValue / small.futureValue).toBeCloseTo(max / min, 6);
  });

  it('is deterministic across repeated calls', () => {
    const input = { monthlyInvestment: 12500, annualReturnPct: 11.5, durationYears: 17 };
    const runs = Array.from({ length: 5 }, () => calculateSip(input).futureValue);
    expect(new Set(runs).size).toBe(1);
  });

  it('never produces NaN or Infinity across the whole accepted range', () => {
    for (let rate = SIP_INPUT_LIMITS.annualReturnPct.min; rate <= SIP_INPUT_LIMITS.annualReturnPct.max; rate += 0.5) {
      for (let years = SIP_INPUT_LIMITS.durationYears.min; years <= SIP_INPUT_LIMITS.durationYears.max; years += 1) {
        const { futureValue, estimatedGains } = calculateSip({
          monthlyInvestment: 5000,
          annualReturnPct: rate,
          durationYears: years,
        });
        expect(Number.isFinite(futureValue)).toBe(true);
        expect(Number.isFinite(estimatedGains)).toBe(true);
      }
    }
  });
});

describe('validateSipInput', () => {
  it('accepts values inside the published limits', () => {
    const result = validateSipInput({ monthlyInvestment: 5000, annualReturnPct: 12, durationYears: 10 });
    expect(result.ok).toBe(true);
  });

  it('coerces numeric strings, which is what a text input actually gives us', () => {
    const result = validateSipInput({ monthlyInvestment: '5000', annualReturnPct: '12', durationYears: '10' });
    expect(result).toEqual({ ok: true, input: { monthlyInvestment: 5000, annualReturnPct: 12, durationYears: 10 } });
  });

  it.each([
    ['empty', '', 'monthlyInvestment'],
    ['non-numeric', 'abc', 'monthlyInvestment'],
    ['negative', -100, 'monthlyInvestment'],
    ['above maximum', 99999999, 'monthlyInvestment'],
  ] as const)('rejects a %s monthly investment', (_label, value, field) => {
    const result = validateSipInput({ monthlyInvestment: value, annualReturnPct: 12, durationYears: 10 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors[field]).toBeTruthy();
  });

  it('rejects a negative return rate but allows exactly zero', () => {
    expect(validateSipInput({ monthlyInvestment: 5000, annualReturnPct: -1, durationYears: 10 }).ok).toBe(false);
    expect(validateSipInput({ monthlyInvestment: 5000, annualReturnPct: 0, durationYears: 10 }).ok).toBe(true);
  });

  it('reports every invalid field at once rather than only the first', () => {
    const result = validateSipInput({ monthlyInvestment: -1, annualReturnPct: 999, durationYears: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors)).toHaveLength(3);
  });
});

describe('calculateSip — invalid input', () => {
  it('throws rather than returning NaN', () => {
    expect(() => calculateSip({ monthlyInvestment: Number.NaN, annualReturnPct: 12, durationYears: 10 })).toThrow(
      RangeError
    );
    expect(() =>
      calculateSip({ monthlyInvestment: Number.POSITIVE_INFINITY, annualReturnPct: 12, durationYears: 10 })
    ).toThrow(RangeError);
  });
});

describe('calculateSipYearlyBreakdown', () => {
  const input = { monthlyInvestment: 5000, annualReturnPct: 12, durationYears: 10 };

  it('produces one row per year', () => {
    expect(calculateSipYearlyBreakdown(input)).toHaveLength(10);
  });

  it('ends exactly where calculateSip ends — one engine, not two', () => {
    const rows = calculateSipYearlyBreakdown(input);
    const summary = calculateSip(input);
    const finalRow = rows[rows.length - 1];

    expect(finalRow.futureValue).toBe(summary.futureValue);
    expect(finalRow.totalInvested).toBe(summary.totalInvested);
    expect(finalRow.estimatedGains).toBe(summary.estimatedGains);
  });

  it('grows monotonically and keeps invested + growth equal to the projected value', () => {
    const rows = calculateSipYearlyBreakdown(input);

    rows.forEach((row, index) => {
      expect(row.totalInvested + row.estimatedGains).toBeCloseTo(row.futureValue, 6);
      if (index > 0) expect(row.futureValue).toBeGreaterThan(rows[index - 1].futureValue);
    });
  });

  it('shows no growth in any year at a zero return rate', () => {
    const rows = calculateSipYearlyBreakdown({ ...input, annualReturnPct: 0 });
    rows.forEach((row) => expect(row.estimatedGains).toBe(0));
  });
});

/**
 * Phase 4 additions: the bounds the UI is built on, the blur-clamp, and the
 * formatted output the verification checklist names by value.
 */
describe('SIP_INPUT_LIMITS — the bounds the controls are built from', () => {
  it('matches the locked Phase 0 §23.2 ranges', () => {
    expect(SIP_INPUT_LIMITS.monthlyInvestment).toEqual({ min: 500, max: 1000000, step: 500 });
    expect(SIP_INPUT_LIMITS.annualReturnPct.max).toBe(30);
    expect(SIP_INPUT_LIMITS.annualReturnPct.step).toBe(0.5);
    expect(SIP_INPUT_LIMITS.durationYears).toEqual({ min: 1, max: 40, step: 1 });
  });

  it('keeps zero reachable on the return slider, so the zero-rate branch is a real state', () => {
    expect(SIP_INPUT_LIMITS.annualReturnPct.min).toBe(0);
    expect(validateSipInput({ ...SIP_DEFAULT_INPUT, annualReturnPct: 0 }).ok).toBe(true);
  });

  it('opens on values that are themselves inside the limits', () => {
    expect(validateSipInput(SIP_DEFAULT_INPUT).ok).toBe(true);
  });
});

describe('clampSipValue', () => {
  it('pulls a value back to the nearest bound', () => {
    expect(clampSipValue('monthlyInvestment', 10)).toBe(500);
    expect(clampSipValue('monthlyInvestment', 99999999)).toBe(1000000);
    expect(clampSipValue('annualReturnPct', -4)).toBe(0);
    expect(clampSipValue('annualReturnPct', 120)).toBe(30);
    expect(clampSipValue('durationYears', 0)).toBe(1);
    expect(clampSipValue('durationYears', 99)).toBe(40);
  });

  it('leaves a value already inside the range alone', () => {
    expect(clampSipValue('monthlyInvestment', 7500)).toBe(7500);
    expect(clampSipValue('annualReturnPct', 11.7)).toBe(11.7);
  });

  it('falls back to the default rather than to a bound for something that is not a number', () => {
    // Landing on "₹500" after typing letters reads as a broken field; landing
    // back on the starting value reads as a corrected one.
    expect(clampSipValue('monthlyInvestment', Number.NaN)).toBe(SIP_DEFAULT_INPUT.monthlyInvestment);
    expect(clampSipValue('durationYears', Number.POSITIVE_INFINITY)).toBe(SIP_DEFAULT_INPUT.durationYears);
  });
});

describe('the figures the Phase 4 checklist names', () => {
  it('renders ₹11,61,695 and ₹6,00,000 for ₹5,000 a month at 12% over 10 years', () => {
    const result = calculateSip({ monthlyInvestment: 5000, annualReturnPct: 12, durationYears: 10 });
    expect(formatRupees(result.futureValue)).toBe('₹11,61,695');
    expect(formatRupees(result.totalInvested)).toBe('₹6,00,000');
    expect(formatRupees(result.estimatedGains)).toBe('₹5,61,695');
  });

  it('groups in the Indian 2-2-3 pattern rather than in thousands', () => {
    expect(formatRupees(1161695)).toBe('₹11,61,695');
    expect(formatRupees(10000000)).toBe('₹1,00,00,000');
  });

  it('states the invested amount exactly at a zero return rate', () => {
    const result = calculateSip({ monthlyInvestment: 5000, annualReturnPct: 0, durationYears: 10 });
    expect(formatRupees(result.futureValue)).toBe('₹6,00,000');
    expect(formatRupees(result.estimatedGains)).toBe('₹0');
  });
});

describe('validation messages speak in the field\u2019s own units', () => {
  it('states a rupee bound in rupees, not in raw digits', () => {
    const tooBig = validateSipInput({ monthlyInvestment: 99999999, annualReturnPct: 12, durationYears: 10 });
    expect(tooBig.ok).toBe(false);
    if (!tooBig.ok) expect(tooBig.errors.monthlyInvestment).toBe('Monthly investment must be ₹10,00,000 or less.');

    const tooSmall = validateSipInput({ monthlyInvestment: 12, annualReturnPct: 12, durationYears: 10 });
    expect(tooSmall.ok).toBe(false);
    if (!tooSmall.ok) expect(tooSmall.errors.monthlyInvestment).toBe('Monthly investment must be at least ₹500.');
  });

  it('states a percentage bound as a percentage and a tenure in years', () => {
    const result = validateSipInput({ monthlyInvestment: 5000, annualReturnPct: 99, durationYears: 99 });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.annualReturnPct).toBe('Assumed annual return must be 30% or less.');
      expect(result.errors.durationYears).toBe('Investment period must be 40 years or less.');
    }
  });

  it('keeps empty and zero as different states', () => {
    const empty = validateSipInput({ monthlyInvestment: '', annualReturnPct: 12, durationYears: 10 });
    const zero = validateSipInput({ monthlyInvestment: 0, annualReturnPct: 12, durationYears: 10 });
    expect(empty.ok).toBe(false);
    expect(zero.ok).toBe(false);
    if (!empty.ok && !zero.ok) {
      expect(empty.errors.monthlyInvestment).toBe('Monthly investment is required.');
      expect(zero.errors.monthlyInvestment).not.toBe(empty.errors.monthlyInvestment);
    }
  });
});
