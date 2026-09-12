import { formatPercent, formatRupees, formatYears } from '@/lib/finance';
import type { SipCalculatorInput } from '@/lib/finance';
import { getServiceById, goalEntries } from '@/data/services';
import { contactWhatsApp } from '@/data/contact';

/**
 * ─────────────────────────────────────────────────────────────────────────
 * THE CONVERSION SYSTEM — one message builder, every entry point
 * ─────────────────────────────────────────────────────────────────────────
 *
 * §25 asks for exactly one helper behind every contextual message on the
 * site, so the wording stays consistent and a new entry point cannot invent
 * its own voice. This is that helper. Nothing else in the app composes a
 * WhatsApp message, builds a `wa.me` URL, or decides where a "talk to us"
 * action goes.
 *
 * Before this existed there were three separate implementations — the
 * header's icon button, the hero's secondary action, and the SIP
 * calculator's CTA — each assembling its own `wa.me` link, plus a fourth
 * hard-coded one with an unverified number sitting in dead code. That is the
 * "second WhatsApp implementation" the phase brief rules out, four times
 * over.
 *
 * ── The number ──────────────────────────────────────────────────────────
 *
 * There is still no WhatsApp number in this codebase. §25 requires exactly
 * one verified, actively monitored line to be designated before one is used,
 * and data/contact.ts ships every channel unverified. So:
 *
 *   verified number present  → wa.me with the message pre-filled
 *   not present              → the contact route, carrying the same context
 *                              in its query string so the consultation form
 *                              opens already knowing what this is about
 *
 * The fallback is not a degraded state. The same context reaches the same
 * form either way; only the transport changes. That is what lets the number
 * be switched on later without touching a single call site.
 *
 * ── What goes in a message ──────────────────────────────────────────────
 *
 * Enough to start the conversation, and nothing more. Names of services and
 * goals, the three SIP inputs (§23.3 approves those explicitly), and
 * whatever the person typed themselves. Never a computed projection: a
 * maturity figure this site produced from an assumption the user picked
 * would arrive in a chat log looking like something Earneazi had quoted.
 */

export interface ConsultationDetails {
  name: string;
  phone: string;
  email?: string;
  /** A service id, a goal id, or 'not-sure'. */
  topic: string;
  message: string;
  /** Carried through from a SIP entry point, when the person arrived from one. */
  sip?: SipCalculatorInput;
}

export type ConversationContext =
  | { kind: 'general' }
  | { kind: 'service'; serviceId: string }
  | { kind: 'goal'; goalId: string }
  | { kind: 'sip-plan'; input: SipCalculatorInput }
  | { kind: 'consultation'; details: ConsultationDetails };

export const generalConversation: ConversationContext = { kind: 'general' };

export function serviceConversation(serviceId: string): ConversationContext {
  return { kind: 'service', serviceId };
}

export function goalConversation(goalId: string): ConversationContext {
  return { kind: 'goal', goalId };
}

export function sipConversation(input: SipCalculatorInput): ConversationContext {
  return { kind: 'sip-plan', input };
}

export function consultationConversation(details: ConsultationDetails): ConversationContext {
  return { kind: 'consultation', details };
}

/* ── Naming things, without inventing any ───────────────────────────────── */

function serviceName(serviceId: string): string | null {
  return getServiceById(serviceId)?.title ?? null;
}

function goalName(goalId: string): string | null {
  return goalEntries.find((goal) => goal.id === goalId)?.title ?? null;
}

/** "₹5,000 a month over 10 years, assuming 12% a year" — the three inputs, never the result. */
function describeSip(input: SipCalculatorInput): string {
  return (
    `${formatRupees(input.monthlyInvestment)} a month over ${formatYears(input.durationYears)}, ` +
    `assuming ${formatPercent(input.annualReturnPct)} a year`
  );
}

/** What the person picked in the form's topic field, in words. */
function topicName(topic: string): string | null {
  if (topic === 'not-sure') return null;
  return serviceName(topic) ?? goalName(topic);
}

/* ── The builder ────────────────────────────────────────────────────────── */

const OPENING = 'Hi Earneazi';

/**
 * The message a given entry point pre-fills. Plain, self-identifying, and
 * written the way a person would actually open a chat.
 */
export function buildConversationMessage(context: ConversationContext): string {
  switch (context.kind) {
    case 'general':
      return `${OPENING} — I found you through your website and I would like to talk through my financial planning. Could we set up a conversation?`;

    case 'service': {
      const name = serviceName(context.serviceId);
      return name
        ? `${OPENING} — I was reading about ${name} on your website and I would like to understand whether it fits my situation. Could we talk it through?`
        : buildConversationMessage(generalConversation);
    }

    case 'goal': {
      const name = goalName(context.goalId);
      return name
        ? `${OPENING} — I am working toward "${name}" and I saw it on your website. Could we talk through what that would involve for me?`
        : buildConversationMessage(generalConversation);
    }

    case 'sip-plan':
      return (
        `${OPENING} — I was using the SIP calculator on your website. ` +
        `I was looking at ${describeSip(context.input)}. ` +
        'Could we talk through whether that makes sense for me?'
      );

    case 'consultation': {
      const { name, phone, email, topic, message, sip } = context.details;
      const subject = topicName(topic);

      /*
        A labelled block rather than a paragraph. Whoever reads this is
        reading it on a phone, probably between other things, and needs to
        find the callback number without parsing a sentence.
      */
      return [
        `${OPENING} — I would like to book a consultation.`,
        '',
        `Name: ${name}`,
        `Phone: ${phone}`,
        email ? `Email: ${email}` : null,
        subject ? `About: ${subject}` : 'About: Not sure yet',
        sip ? `From the SIP calculator: ${describeSip(sip)}` : null,
        '',
        message,
      ]
        .filter((line): line is string => line !== null)
        .join('\n');
    }

    default: {
      /* Exhaustiveness: adding a context without a message fails the build
         rather than silently falling back to the generic one. */
      const unreachable: never = context;
      return unreachable;
    }
  }
}

/* ── Where the action goes ──────────────────────────────────────────────── */

/**
 * The contact route, carrying the context in its query string so the
 * consultation form opens already knowing what this is about.
 *
 * Search parameters rather than a hash: `ScrollManager` reacts to `pathname`
 * and `hash`, so a query string does not make it scroll or move focus, and
 * the parameters survive being shared, bookmarked and reloaded.
 */
export function contactRouteFor(context: ConversationContext): string {
  switch (context.kind) {
    case 'service':
      return `/contact?topic=${encodeURIComponent(context.serviceId)}`;
    case 'goal':
      return `/contact?goal=${encodeURIComponent(context.goalId)}`;
    case 'sip-plan': {
      const { monthlyInvestment, annualReturnPct, durationYears } = context.input;
      return `/contact?topic=mutual-funds-pms&sip=${monthlyInvestment}-${annualReturnPct}-${durationYears}`;
    }
    default:
      return '/contact';
  }
}

/** `null` until a verified WhatsApp number exists. Never falls back to a guess. */
export function whatsAppHref(message: string): string | null {
  if (!contactWhatsApp) return null;
  const digits = contactWhatsApp.replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export const whatsAppAvailable = Boolean(contactWhatsApp && contactWhatsApp.replace(/\D/g, ''));

export interface ConversationTarget {
  href: string;
  /** True for WhatsApp, which leaves the app and needs target/rel. */
  external: boolean;
  channel: 'whatsapp' | 'route';
  /** Spoken destination — a label like "Talk through this goal" does not say where it goes. */
  ariaLabel: string;
  /** The composed message, exposed so a caller can preview or copy it. */
  message: string;
}

/**
 * Resolves an entry point to a destination. Every CTA on the site that means
 * "talk to us" goes through this, so none of them can disagree about where
 * that is.
 */
export function resolveConversation(context: ConversationContext, label: string): ConversationTarget {
  const message = buildConversationMessage(context);
  const href = whatsAppHref(message);

  if (href) {
    return {
      href,
      external: true,
      channel: 'whatsapp',
      ariaLabel: `${label} on WhatsApp — opens WhatsApp`,
      message,
    };
  }

  return {
    href: contactRouteFor(context),
    external: false,
    channel: 'route',
    ariaLabel: `${label} — opens the contact page`,
    message,
  };
}
