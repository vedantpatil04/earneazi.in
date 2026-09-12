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
 *   office    a short address; line breaks are fine, plus `mapsUrl`
 *   hours     e.g. 'Monday to Saturday, 10am – 7pm'
 *
 * The WhatsApp entry is the one §25 singles out: exactly one number must be
 * designated as the actively monitored line before it is used anywhere. The
 * old site used two different numbers in two different places, which is how
 * a monitored line stops being monitored. Until this one is confirmed, every
 * WhatsApp CTA on the site resolves to the contact route instead — see
 * lib/contact/conversation.ts, which is the only place that decision is made.
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
    /* A maps URL, once someone has confirmed both the address and which
       pin actually corresponds to it. Absent means the address renders as
       text: a link to the wrong building is worse than no link. */
    mapsUrl: null,
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
export const contactOffice = findVerified('office');
export const contactHours = findVerified('hours');

/** The maps destination for the office, or null when either half is unconfirmed. */
export const contactMapsUrl: string | null =
  verifiedContactChannels.find((channel) => channel.kind === 'office')?.mapsUrl ?? null;

/** True once the business can be reached by any confirmed channel at all. */
export const hasVerifiedContactChannel = verifiedContactChannels.length > 0;

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
    case 'office':
      /* Only when a maps URL was supplied. The address itself is not a
         destination, and guessing a search URL from a free-text address
         sends people to whatever the map decides it meant. */
      return channel.mapsUrl ?? null;
    default:
      return null;
  }
}
