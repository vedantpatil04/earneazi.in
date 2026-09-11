import type { ContactChannel } from '@/types/content';

/**
 * ─────────────────────────────────────────────────────────────────────────
 * CONTACT DETAILS — CLIENT CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────
 * Every channel below ships unverified, because none of these details have
 * been confirmed. Nothing renders for a channel with `verified: false`, so
 * the site never shows a phone number or address that might not be real —
 * on a financial-services site that is a worse failure than showing nothing.
 *
 * TO GO LIVE: fill in `value` for each channel the business actually uses,
 * set `verified: true` on those, and delete the rest. The contact page picks
 * them up automatically — the channel list appears, and the enquiry form
 * switches from "copy your message" to opening a pre-filled email. No
 * component changes are needed.
 *
 * Formats expected:
 *   phone     display form, e.g. '+91 98765 43210'
 *   whatsapp  digits only including country code, e.g. '919876543210'
 *   email     a plain address
 *   office    a short address; line breaks are fine
 *   hours     e.g. 'Monday to Saturday, 10am – 7pm'
 */
export const contactChannels: ContactChannel[] = [
  {
    id: 'phone',
    kind: 'phone',
    label: 'Phone',
    value: null,
    note: 'For anything you would rather just talk through.',
    verified: false,
  },
  {
    id: 'whatsapp',
    kind: 'whatsapp',
    label: 'WhatsApp',
    value: null,
    note: 'Send a question and pick the conversation up later.',
    verified: false,
  },
  {
    id: 'email',
    kind: 'email',
    label: 'Email',
    value: null,
    note: 'Best for documents and anything with detail attached.',
    verified: false,
  },
  {
    id: 'office',
    kind: 'office',
    label: 'Office',
    value: null,
    note: 'Visits by appointment.',
    verified: false,
  },
  {
    id: 'hours',
    kind: 'hours',
    label: 'Working hours',
    value: null,
    verified: false,
  },
];

/** Only channels the client has confirmed. Everything in the UI reads from this, never from the raw array. */
export const verifiedContactChannels: ContactChannel[] = contactChannels.filter(
  (channel) => channel.verified && channel.value !== null
);

function findVerified(kind: ContactChannel['kind']): string | null {
  return verifiedContactChannels.find((channel) => channel.kind === kind)?.value ?? null;
}

export const contactEmail = findVerified('email');
export const contactPhone = findVerified('phone');
export const contactWhatsApp = findVerified('whatsapp');

/** Builds the `href` for a channel, or null where the channel isn't actionable (office, hours). */
export function contactChannelHref(channel: ContactChannel): string | null {
  if (!channel.value) return null;

  switch (channel.kind) {
    case 'phone':
      return `tel:${channel.value.replace(/[^\d+]/g, '')}`;
    case 'whatsapp':
      return `https://wa.me/${channel.value.replace(/\D/g, '')}`;
    case 'email':
      return `mailto:${channel.value}`;
    default:
      return null;
  }
}
