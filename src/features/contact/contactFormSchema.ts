import { z } from 'zod';
import { servicePillars } from '@/data/services';

/** Select options, derived from the service data so the form can't drift from what the firm actually offers. */
export const enquiryTopics = [
  ...servicePillars.map((service) => ({ value: service.id, label: service.title })),
  { value: 'not-sure', label: 'Not sure yet' },
] as const;

const topicValues = enquiryTopics.map((topic) => topic.value) as [string, ...string[]];

/**
 * Validation for the enquiry form.
 *
 * Messages are written for the person filling it in — what is wrong and
 * what to do — rather than restating the rule. Phone is optional because an
 * email address is enough to reply to, and demanding both is friction for
 * no gain.
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your name.')
    .max(80, 'That name is longer than we can accept.'),
  email: z.string().trim().min(1, 'Please enter an email address.').email('That doesn’t look like an email address.'),
  phone: z
    .string()
    .trim()
    .max(20, 'That phone number is longer than we can accept.')
    // Permissive on format: Indian numbers get written with and without the
    // country code, with spaces, dashes and brackets. Rejecting valid ways
    // of writing a real number is worse than accepting a slightly odd one.
    .regex(/^$|^[\d+][\d\s()-]{6,}$/, 'Please enter a phone number we can call, or leave this blank.')
    .optional()
    .or(z.literal('')),
  topic: z.enum(topicValues, { errorMap: () => ({ message: 'Please choose what this is about.' }) }),
  message: z
    .string()
    .trim()
    .min(10, 'A sentence or two about what you’re trying to do is enough.')
    .max(2000, 'Please keep this under 2000 characters.'),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

/** Turns a completed form into the plain-text body used for the email or the copy action. */
export function composeEnquiry(values: ContactFormValues): string {
  const topicLabel = enquiryTopics.find((topic) => topic.value === values.topic)?.label ?? values.topic;

  return [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    values.phone ? `Phone: ${values.phone}` : null,
    `About: ${topicLabel}`,
    '',
    values.message,
  ]
    .filter((line) => line !== null)
    .join('\n');
}
