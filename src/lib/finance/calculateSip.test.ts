import { describe, expect, it } from 'vitest';
import {
  SIP_INPUT_LIMITS,
  calculateSip,
  calculateSipYearlyBreakdown,
  monthlyRateFromAnnualPct,
  validateSipInput,
} from './calculateSip';

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
    const result = calculateSip({ monthlyInvestment: 500000, annualReturnPct: 30, durationYears: 40 });
    expect(Number.isFinite(result.futureValue)).toBe(true);
    expect(result.futureValue).toBeGreaterThan(result.totalInvested);
  });

  it('handles the smallest and largest allowed monthly investments', () => {
    const small = calculateSip({ monthlyInvestment: 500, annualReturnPct: 10, durationYears: 5 });
    const large = calculateSip({ monthlyInvestment: 500000, annualReturnPct: 10, durationYears: 5 });
    expect(small.futureValue).toBeGreaterThan(0);
    // The formula is linear in the contribution, so 1000x the input is 1000x the output.
    expect(large.futureValue / small.futureValue).toBeCloseTo(1000, 6);
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
