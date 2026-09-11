/**
 * Type contracts for the SIP calculator.
 *
 * The calculation itself lives in ./calculateSip.ts — pure, deterministic,
 * unit-tested, annuity-due convention. This file is the shared vocabulary
 * between that engine and the feature UI in features/sip-calculator, so
 * neither side needs to import the other's internals.
 */
export interface SipCalculatorInput {
  /** Monthly investment amount in INR. */
  monthlyInvestment: number;
  /** Expected annual return, as a percentage (e.g. 12 for 12%). */
  annualReturnPct: number;
  /** Investment duration in whole years. */
  durationYears: number;
}

export type SipFieldName = keyof SipCalculatorInput;

/** Accepted range for one input. The UI derives both its slider bounds and its numeric min/max from these. */
export interface SipFieldLimits {
  min: number;
  max: number;
  /** Slider granularity. The numeric field accepts any value in range, not just multiples of this. */
  step: number;
}

export type SipInputLimits = Record<SipFieldName, SipFieldLimits>;

/** Discriminated union so a caller cannot read `.input` without first proving the values were valid. */
export type SipValidationResult =
  | { ok: true; input: SipCalculatorInput }
  | { ok: false; errors: Partial<Record<SipFieldName, string>> };

export interface SipCalculatorResult {
  /** Total amount invested over the duration (monthlyInvestment × instalments). */
  totalInvested: number;
  /** Projected future value at full precision — round only for display. */
  futureValue: number;
  /** futureValue − totalInvested, at full precision. */
  estimatedGains: number;
  /** The monthly rate actually used, exposed so the UI can state the assumption rather than restate the formula. */
  monthlyRate: number;
  /** Number of monthly instalments (durationYears × 12). */
  installments: number;
}

export interface SipYearlyBreakdownPoint {
  year: number;
  totalInvested: number;
  futureValue: number;
  estimatedGains: number;
}
