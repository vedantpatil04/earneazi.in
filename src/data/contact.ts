import type { ContactChannel, SocialProfile } from '@/types/content';

/**
 * ─────────────────────────────────────────────────────────────────────────
 * CONTACT DETAILS — CLIENT CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────
 * A channel renders only once it has been confirmed. Nothing renders for a
 * channel with `verified: false`, so
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
 *   whatsapp  display form with the country code, e.g. '+91 98765 43210' —
 *             every link built from it strips it to digits
 *   email     a plain address
 *   office    a short address; line breaks are fine, plus `mapsUrl`
 *   hours     e.g. 'Monday to Saturday, 10am – 7pm'
 *
 * The WhatsApp entry is the one §25 singles out: exactly one number is the
 * actively monitored line. The Enhancement B brief confirmed it as
 * +91 87921 51022, so every WhatsApp action on the site — the floating
 * button, the contextual CTAs, the consultation form and the footer — opens
 * WhatsApp with a pre-filled draft. lib/contact/conversation.ts is the only
 * place that decision is made. The old site's second number is not used
 * anywhere, and phone, email, office and hours stay unconfirmed and render
 * nothing.
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
    /* Confirmed in the Enhancement B brief as the monitored line. */
    value: '+91 87921 51022',
    note: 'Send a question and pick the conversation up later.',
    verified: true,
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

/**
 * Social profiles — Phase 6.
 *
 * The footer's social row must include Instagram, and must not guess where
 * it points. So the profile is recorded here with no handle and no URL, and
 * the footer renders it as visibly unavailable until both are supplied and
 * `verified` is set. The URL must be the business's real instagram.com
 * profile — data/footer.ts rejects anything else, verified or not.
 *
 * TO GO LIVE: set `handle` (without the @), `url`
 * (e.g. 'https://www.instagram.com/<handle>/') and `verified: true`.
 */
export const socialProfiles: SocialProfile[] = [
  { id: 'instagram', network: 'instagram', label: 'Instagram', handle: 'earn_eazi', url: 'https://www.instagram.com/earn_eazi/', verified: true },
];

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
