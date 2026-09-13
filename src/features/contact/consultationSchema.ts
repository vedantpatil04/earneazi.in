import { z } from 'zod';
import { servicePillars, goalEntries } from '@/data/services';
import { SIP_INPUT_LIMITS, validateSipInput } from '@/lib/finance';
import type { SipCalculatorInput } from '@/lib/finance';

/**
 * The consultation form's contract.
 *
 * Enhancement B keeps the form to what a first conversation needs: a name, a
 * number to reach the person on, the service and the goal they have in mind
 * (either can be "not sure"), and a line or two about what they are trying to
 * do. Nothing sensitive — no income, no account details, no documents, and no
 * email address, since the conversation continues on WhatsApp or by phone.
 *
 * Options are derived from the service and goal data rather than listed
 * again here, so the form cannot offer something the firm does not do.
 */
export const NOT_SURE = 'not-sure';

export const consultationServiceOptions = [
  { value: NOT_SURE, label: 'Not sure yet' },
  ...servicePillars.map((service) => ({ value: service.id, label: service.title })),
] as const;

export const consultationGoalOptions = [
  { value: NOT_SURE, label: 'Not sure yet' },
  ...goalEntries.map((goal) => ({ value: goal.id, label: goal.title })),
] as const;

const serviceValues = consultationServiceOptions.map((option) => option.value) as [string, ...string[]];
const goalValues = consultationGoalOptions.map((option) => option.value) as [string, ...string[]];

/**
 * Validation, written for the person filling the form in.
 *
 * Messages say what is wrong and what to do rather than restating the rule.
 * Phone is required: the flow this feeds is a WhatsApp draft, and a
 * conversation that cannot be continued by phone is a conversation with a
 * stranger's account.
 */
export const consultationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your name.')
    .max(80, 'That name is longer than we can accept.'),
  phone: z
    .string()
    .trim()
    .min(1, 'Please enter a number we can reach you on.')
    .max(20, 'That phone number is longer than we can accept.')
    /* Permissive on format: Indian numbers get written with and without the
       country code, with spaces, dashes and brackets. Rejecting a valid way
       of writing a real number is worse than accepting a slightly odd one. */
    .regex(/^[\d+][\d\s()-]{6,}$/, 'Please enter a phone number we can reach you on.'),
  service: z.enum(serviceValues, { errorMap: () => ({ message: 'Please choose a service, or “Not sure yet”.' }) }),
  goal: z.enum(goalValues, { errorMap: () => ({ message: 'Please choose a goal, or “Not sure yet”.' }) }),
  message: z
    .string()
    .trim()
    .min(10, 'A sentence or two about what you’re trying to do is enough.')
    .max(2000, 'Please keep this under 2000 characters.'),
});

export type ConsultationValues = z.infer<typeof consultationSchema>;

export const consultationDefaults: ConsultationValues = {
  name: '',
  phone: '',
  service: NOT_SURE,
  goal: NOT_SURE,
  message: '',
};

/** True when the value names a service we actually publish. */
export function isKnownService(value: string | null): value is string {
  return value !== null && value !== NOT_SURE && serviceValues.includes(value);
}

/** True when the value names a goal we actually publish. */
export function isKnownGoal(value: string | null): value is string {
  return value !== null && value !== NOT_SURE && goalValues.includes(value);
}

/**
 * Reads the SIP context out of a `?sip=amount-rate-years` parameter.
 *
 * Returns null for anything that is not three numbers inside the calculator's
 * own published bounds. A query string is user-editable, so this is untrusted
 * input: it is validated through the same `validateSipInput` the calculator
 * uses, and a value outside the bounds is dropped rather than clamped —
 * silently correcting someone's URL into a different plan would put figures
 * in the message that they never chose.
 */
export function parseSipParam(raw: string | null): SipCalculatorInput | null {
  if (!raw) return null;

  const parts = raw.split('-');
  if (parts.length !== 3) return null;

  const [monthlyInvestment, annualReturnPct, durationYears] = parts.map(Number);
  const result = validateSipInput({ monthlyInvestment, annualReturnPct, durationYears });
  if (!result.ok) return null;

  /* Belt and braces: the step values are not part of Zod's range check, and a
     tenure of 10.5 years would produce a breakdown the calculator cannot. */
  if (!Number.isInteger(result.input.durationYears)) return null;
  if (result.input.durationYears > SIP_INPUT_LIMITS.durationYears.max) return null;

  return result.input;
}
