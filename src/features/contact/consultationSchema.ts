import { z } from 'zod';
import { servicePillars, goalEntries } from '@/data/services';
import { SIP_INPUT_LIMITS, validateSipInput } from '@/lib/finance';
import type { SipCalculatorInput } from '@/lib/finance';

/**
 * The consultation form's contract.
 *
 * Options are derived from the service and goal data rather than listed
 * again here, so the form cannot offer something the firm does not do, and a
 * goal added in Phase 3 appears in this list without anyone remembering to
 * add it.
 */
export const consultationTopics = [
  { value: 'not-sure', label: 'Not sure yet — let’s work it out', group: 'General' },
  ...servicePillars.map((service) => ({ value: service.id, label: service.title, group: 'Services' })),
  ...goalEntries.map((goal) => ({ value: goal.id, label: goal.title, group: 'Goals' })),
] as const;

const topicValues = consultationTopics.map((topic) => topic.value) as [string, ...string[]];

/** The option groups, in render order, so the `<select>` can use `<optgroup>`. */
export const consultationTopicGroups = ['General', 'Services', 'Goals'] as const;

/**
 * Validation, written for the person filling the form in.
 *
 * Messages say what is wrong and what to do rather than restating the rule.
 * The one judgement call worth recording: phone is **required** here where
 * the old enquiry form made it optional. The flow this feeds is a WhatsApp
 * draft, and a WhatsApp conversation that cannot be continued by phone is a
 * conversation with a stranger's account. Email is optional instead, which
 * inverts the previous form — deliberately.
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
  email: z
    .string()
    .trim()
    .max(120, 'That email address is longer than we can accept.')
    .email('That doesn’t look like an email address.')
    .optional()
    .or(z.literal('')),
  topic: z.enum(topicValues, { errorMap: () => ({ message: 'Please choose what this is about.' }) }),
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
  email: '',
  topic: 'not-sure',
  message: '',
};

/** True when the value names a service or a goal we actually publish. */
export function isKnownTopic(value: string | null): value is string {
  return value !== null && topicValues.includes(value);
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
