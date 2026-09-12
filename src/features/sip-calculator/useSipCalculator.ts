import { useCallback, useMemo, useState } from 'react';
import {
  SIP_DEFAULT_INPUT,
  calculateSip,
  calculateSipYearlyBreakdown,
  clampSipValue,
  formatIndianNumber,
  validateSipInput,
} from '@/lib/finance';
import type {
  SipCalculatorInput,
  SipCalculatorResult,
  SipFieldName,
  SipYearlyBreakdownPoint,
} from '@/lib/finance';

/**
 * The calculator's state, owned in one place and shared by every surface
 * that renders one.
 *
 * ── Why this is a hook and not two components ───────────────────────────
 *
 * There are two SIP experiences on this site — the standalone page and the
 * compact panel on the homepage — and Phase 4 requires them to run the same
 * calculation. Sharing `lib/finance` would already guarantee the arithmetic
 * matches; sharing this hook also guarantees the *behaviour* matches: the
 * same bounds, the same validation, the same blur-clamping, the same
 * last-good-value fallback. There is no second state machine to keep in
 * step, and no way for one surface to accept a value the other rejects.
 *
 * ── Two pieces of state, deliberately ───────────────────────────────────
 *
 *   `raw`        exactly what is in the text fields, so a half-typed or
 *                temporarily invalid value is never rewritten under the
 *                cursor
 *   `committed`  the last set of values the engine accepted
 *
 * Results stay on the last good numbers while a field is being corrected,
 * rather than blanking out or flashing an error where a figure used to be.
 * Empty is a distinct state from zero (§23.2): an empty field is "required",
 * a zero is "below the minimum", and they say different things.
 *
 * ── No arithmetic here ──────────────────────────────────────────────────
 *
 * Every figure comes from `calculateSip` / `calculateSipYearlyBreakdown`.
 * This file decides *when* to recompute, never *what* the answer is.
 * Recompute is synchronous and on every keystroke or slider tick — there is
 * no debounce, because the work is a handful of `Math.pow` calls and a
 * loop bounded at forty rows, and a delay would be felt.
 */

export type SipRawInput = Record<SipFieldName, string>;

export interface SipCalculatorState {
  /** What is literally in the text fields. */
  raw: SipRawInput;
  /** The last values the engine accepted. Drives every figure on screen. */
  committed: SipCalculatorInput;
  errors: Partial<Record<SipFieldName, string>>;
  /** False while a field holds something the engine rejected. */
  isValid: boolean;
  result: SipCalculatorResult;
  breakdown: SipYearlyBreakdownPoint[];
  /** A keystroke or a slider tick. Never clamps. */
  setField: (field: SipFieldName, nextValue: string) => void;
  /** A slider tick, which always produces a number already inside the bounds. */
  setNumericField: (field: SipFieldName, nextValue: number) => void;
  /** Blur. Clamps into range and normalises the text (§23.2). */
  commitField: (field: SipFieldName) => void;
  /** Back to the opening values, for the compact panel's reset affordance. */
  reset: () => void;
}

/** The amount is grouped from the first paint — an unformatted "5000" beside a formatted "₹11,61,695" reads as a bug. */
function rawFrom(input: SipCalculatorInput): SipRawInput {
  return {
    monthlyInvestment: formatIndianNumber(input.monthlyInvestment),
    annualReturnPct: String(input.annualReturnPct),
    durationYears: String(input.durationYears),
  };
}

/** Strips the grouping separators and currency mark a formatted field legitimately contains. */
function toNumber(value: string): number {
  return Number(value.replace(/[₹,\s]/g, ''));
}

export function useSipCalculator(initial: SipCalculatorInput = SIP_DEFAULT_INPUT): SipCalculatorState {
  const [raw, setRaw] = useState<SipRawInput>(() => rawFrom(initial));
  const [committed, setCommitted] = useState<SipCalculatorInput>(initial);

  const validation = useMemo(() => validateSipInput(raw), [raw]);
  const errors = validation.ok ? {} : validation.errors;

  const setField = useCallback((field: SipFieldName, nextValue: string) => {
    setRaw((current) => {
      const next = { ...current, [field]: nextValue };
      const check = validateSipInput(next);
      // Only a valid set advances the committed values, which is what keeps
      // the results on the last good figures while a field is mid-correction.
      if (check.ok) setCommitted(check.input);
      return next;
    });
  }, []);

  const setNumericField = useCallback(
    (field: SipFieldName, nextValue: number) => {
      setField(field, field === 'monthlyInvestment' ? formatIndianNumber(nextValue) : String(nextValue));
    },
    [setField]
  );

  const commitField = useCallback(
    (field: SipFieldName) => {
      setRaw((current) => {
        const clamped = clampSipValue(field, toNumber(current[field]));
        const next = {
          ...current,
          [field]: field === 'monthlyInvestment' ? formatIndianNumber(clamped) : String(clamped),
        };
        const check = validateSipInput(next);
        if (check.ok) setCommitted(check.input);
        return next;
      });
    },
    []
  );

  const reset = useCallback(() => {
    setRaw(rawFrom(initial));
    setCommitted(initial);
  }, [initial]);

  /*
    `committed` is always a set the engine already accepted, so neither call
    below can throw. Memoised on the input object rather than on each field,
    because the object only changes when a value actually did.
  */
  const result = useMemo(() => calculateSip(committed), [committed]);
  const breakdown = useMemo(() => calculateSipYearlyBreakdown(committed), [committed]);

  return {
    raw,
    committed,
    errors,
    isValid: validation.ok,
    result,
    breakdown,
    setField,
    setNumericField,
    commitField,
    reset,
  };
}
