/**
 * Type contracts for the SIP calculator (Phase 0 Blueprint, Section N).
 *
 * This file defines the feature's input/output shape only. The actual
 * calculateSip() implementation — pure function, annuity-due convention,
 * unit-tested, cross-checked against at least two independent reference
 * calculators — is Day 4 / Phase 3 work per the blueprint's sequence
 * (Section Q), not Phase 1.
 *
 * features/sip-calculator can be built against this contract now and wired
 * to the real implementation later without changing call sites.
 */
export interface SipCalculatorInput {
  /** Monthly investment amount in INR. */
  monthlyInvestment: number;
  /** Expected annual return, as a percentage (e.g. 12 for 12%). */
  annualReturnPct: number;
  /** Investment duration in whole years. */
  durationYears: number;
}

export interface SipCalculatorResult {
  /** Total amount invested over the duration (monthlyInvestment * months). */
  totalInvested: number;
  /** Projected future value at full precision — round only for display. */
  futureValue: number;
  /** futureValue - totalInvested, at full precision. */
  estimatedGains: number;
}

export interface SipYearlyBreakdownPoint {
  year: number;
  totalInvested: number;
  futureValue: number;
  estimatedGains: number;
}
