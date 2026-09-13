import { describe, expect, it } from 'vitest';
import { fundFacts, fundListings } from './funds';
import type { FundListing } from '@/types/content';

/* Fixture values exist only here, to exercise the gates. None of them ship. */
const base: FundListing = {
  id: 'fixture',
  name: 'Fixture Fund',
  category: 'Large Cap',
  riskLevel: null,
  minSipAmount: null,
  oneYearReturnPct: null,
  threeYearReturnPct: null,
  performanceVerified: false,
  performanceAsOf: null,
};

describe('fund shortlist', () => {
  it('shows no risk level, minimum SIP or performance for any shipped fund', () => {
    fundListings.forEach((fund) => {
      expect(fundFacts(fund)).toEqual([]);
      expect(fund.performanceVerified).toBe(false);
    });
  });

  it('never shows a return that is unverified or undated', () => {
    expect(fundFacts({ ...base, oneYearReturnPct: 14 })).toEqual([]);
    expect(fundFacts({ ...base, oneYearReturnPct: 14, performanceVerified: true })).toEqual([]);
    expect(fundFacts({ ...base, oneYearReturnPct: 14, performanceAsOf: '31 Aug 2026' })).toEqual([]);
  });

  it('labels a verified return with its as-of date', () => {
    const facts = fundFacts({ ...base, oneYearReturnPct: 14, performanceVerified: true, performanceAsOf: '31 Aug 2026' });
    expect(facts).toEqual([{ label: '1-year return, as of 31 Aug 2026', value: '14%' }]);
  });

  it('shows risk and minimum SIP once confirmed', () => {
    expect(fundFacts({ ...base, riskLevel: 'Very high', minSipAmount: 500 })).toEqual([
      { label: 'Risk', value: 'Very high' },
      { label: 'Minimum SIP', value: '₹500' },
    ]);
  });
});
