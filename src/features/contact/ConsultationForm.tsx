import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Copy, Mail, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { WhatsAppGlyph } from '@/components/conversion/WhatsAppGlyph';
import { zodResolver } from '@/lib/forms/zodResolver';
import { contactEmail } from '@/data/contact';
import {
  buildConversationMessage,
  consultationConversation,
  whatsAppAvailable,
  whatsAppHref,
} from '@/lib/contact/conversation';
import type { ConsultationDetails } from '@/lib/contact/conversation';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { duration, easing } from '@/lib/motion/tokens';
import {
  NOT_SURE,
  consultationDefaults,
  consultationGoalOptions,
  consultationSchema,
  consultationServiceOptions,
  isKnownGoal,
  isKnownService,
  parseSipParam,
} from './consultationSchema';
import type { ConsultationValues } from './consultationSchema';

/**
 * The consultation flow — the compose-and-send option from §25.
 *
 *   Book a consultation → details → client-side validation → structured
 *   message → WhatsApp opens with the draft pre-filled → the person reads it
 *   → they press send
 *
 * ── What it never does ──────────────────────────────────────────────────
 *
 * There is no backend in V1 and this does not pretend otherwise. It never
 * shows a "message sent" tick for something that went nowhere: on a
 * financial-services site, an enquiry someone believes was received and
 * silently wasn't is a real cost to a real person. Nothing is posted,
 * nothing is stored, and nothing leaves the browser until the person sends
 * it themselves from an app they control.
 *
 * ── The fields — Enhancement B ──────────────────────────────────────────
 *
 * Name, phone, the service and the goal in mind (each can be "not sure"),
 * and a message. The service and goal are separate choices because a first
 * conversation is usually about one of each — "a home loan, for buying a
 * home". Everything entered appears in the draft, through the one shared
 * builder in lib/contact/conversation.ts.
 *
 * ── Destinations, in order ──────────────────────────────────────────────
 *
 *   WhatsApp confirmed  → opens wa.me with the draft. The primary path, and
 *                         the live one: +91 87921 51022.
 *   email confirmed     → offered as a second way to send the same text.
 *   neither             → shows the composed draft with a copy button.
 *
 * The draft is always shown on screen too, with its own "Open in WhatsApp"
 * button, so a browser that blocks the new tab — or a phone without WhatsApp
 * — never costs the person what they typed.
 *
 * ── Arriving with context ───────────────────────────────────────────────
 *
 * `?service=insurance` (or the older `?topic=`), `?goal=buy-a-home` and
 * `?sip=5000-12-10` pre-select the form. The SIP parameter is revalidated
 * through the calculator's own engine before it is trusted — a query string
 * is user-editable, and figures in a message must be ones the person chose.
 */
export function ConsultationForm() {
  const [searchParams] = useSearchParams();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [draft, setDraft] = useState<{ text: string; name: string } | null>(null);
  const [copied, setCopied] = useState(false);

  /* Read once per URL change. */
  const incoming = useMemo(() => {
    const requestedService = searchParams.get('service') ?? searchParams.get('topic');
    const requestedGoal = searchParams.get('goal');
    return {
      service: isKnownService(requestedService) ? requestedService : NOT_SURE,
      goal: isKnownGoal(requestedGoal) ? requestedGoal : NOT_SURE,
      sip: parseSipParam(searchParams.get('sip')),
    };
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ConsultationValues>({
    resolver: zodResolver(consultationSchema),
    /* Validate once a field has been left, then live — so nothing is flagged
       before there was a chance to type it, and a correction is acknowledged
       straight away. */
    mode: 'onTouched',
    defaultValues: { ...consultationDefaults, service: incoming.service, goal: incoming.goal },
  });

  /* A CTA elsewhere on the site can change the query string while this form
     is already mounted, so the selections follow it. */
  useEffect(() => {
    setValue('service', incoming.service);
    setValue('goal', incoming.goal);
  }, [incoming.service, incoming.goal, setValue]);

  const onSubmit = (values: ConsultationValues) => {
    const details: ConsultationDetails = {
      name: values.name,
      phone: values.phone,
      serviceId: values.service === NOT_SURE ? undefined : values.service,
      goalId: values.goal === NOT_SURE ? undefined : values.goal,
      message: values.message,
      sip: incoming.sip ?? undefined,
    };

    const text = buildConversationMessage(consultationConversation(details));
    setDraft({ text, name: values.name });
    setCopied(false);

    const href = whatsAppHref(text);
    if (href) {
      /* A new tab, not a redirect: the draft stays on screen behind it, so a
         blocked pop-up or a desktop without WhatsApp installed does not cost
         the person what they wrote. */
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopy = async () => {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft.text);
      setCopied(true);
    } catch {
      /* Clipboard access can be refused. The draft is on screen and
         selectable either way, so there is nothing to recover from. */
      setCopied(false);
    }
  };

  const startAgain = () => {
    setDraft(null);
    setCopied(false);
    reset({ ...consultationDefaults, service: incoming.service, goal: incoming.goal });
  };

  if (draft) {
    const href = whatsAppHref(draft.text);
    const mailHref = contactEmail
      ? `mailto:${contactEmail}?subject=${encodeURIComponent(`Consultation request from ${draft.name}`)}&body=${encodeURIComponent(draft.text)}`
      : null;

    return (
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: duration.base, ease: easing.out }}
        className="relative"
      >
        {/* Announced on appearance: the form it replaces is gone, so without
            this a screen reader user gets silence after submitting. */}
        <div role="status" aria-live="polite">
          <h3 className="text-display-xs text-ink-display">Ready to send, {draft.name.split(' ')[0]}.</h3>

          <p className="mt-3 max-w-prose text-body text-ink-secondary">
            {href
              ? 'WhatsApp should have opened with this message already written. Read it over, change anything you like, and press send — nothing reaches us until you do. If it didn’t open, use the button below.'
              : 'Here’s your message, written out. Nothing has been sent: copy it across to us and we’ll pick it up from there.'}
          </p>
        </div>

        {/* The draft itself, so what was typed is never trapped inside a deep
            link that may not have opened. */}
        <pre className="inset-well mt-5 max-w-full overflow-x-auto whitespace-pre-wrap rounded-surface border border-divider bg-surface-sunken p-4 font-body text-body-sm text-ink">
          {draft.text}
        </pre>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {href && (
            <Button
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open this message in WhatsApp — opens WhatsApp"
              leadingIcon={<WhatsAppGlyph size={17} />}
              trailingIcon={<ArrowUpRight size={16} aria-hidden="true" />}
            >
              Open in WhatsApp
            </Button>
          )}

          {mailHref && (
            <Button
              href={mailHref}
              variant={href ? 'secondary' : 'primary'}
              leadingIcon={<Mail size={17} strokeWidth={1.75} aria-hidden="true" />}
            >
              Send as email
            </Button>
          )}

          <Button
            type="button"
            onClick={handleCopy}
            variant={href || mailHref ? 'secondary' : 'primary'}
            leadingIcon={
              copied ? (
                <Check size={17} strokeWidth={2} aria-hidden="true" />
              ) : (
                <Copy size={17} strokeWidth={1.75} aria-hidden="true" />
              )
            }
          >
            {copied ? 'Copied' : 'Copy message'}
          </Button>

          <Button
            type="button"
            onClick={startAgain}
            variant="ghost"
            leadingIcon={<RotateCcw size={17} strokeWidth={1.75} aria-hidden="true" />}
          >
            Start again
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Your name" required error={errors.name?.message} id="consultation-name">
          {(field) => <Input {...field} {...register('name')} autoComplete="name" />}
        </Field>

        <Field
          label="Phone"
          required
          error={errors.phone?.message}
          id="consultation-phone"
          helper="So we can call you back."
        >
          {(field) => <Input {...field} {...register('phone')} type="tel" inputMode="tel" autoComplete="tel" />}
        </Field>

        <Field label="Service" error={errors.service?.message} id="consultation-service">
          {(field) => (
            <Select {...field} {...register('service')}>
              {consultationServiceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          )}
        </Field>

        <Field label="Financial goal" error={errors.goal?.message} id="consultation-goal">
          {(field) => (
            <Select {...field} {...register('goal')}>
              {consultationGoalOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>

      <Field
        label="What are you trying to do?"
        required
        error={errors.message?.message}
        id="consultation-message"
        helper="A sentence or two is plenty — where you are now, and what you'd like to sort out."
      >
        {(field) => <Textarea {...field} {...register('message')} rows={4} />}
      </Field>

      {/* Carried from a SIP entry point. Stated plainly rather than hidden,
          because it will appear in the message and the person should know
          that before they send it. */}
      {incoming.sip && (
        <p className="inset-well rounded-surface border border-divider bg-surface-sunken px-4 py-3 text-body-sm text-ink-secondary">
          We&rsquo;ll include the plan you were looking at in the calculator — the monthly amount, the period and the
          rate you assumed. No projected figure is included.
        </p>
      )}

      <div className="flex flex-col gap-3 border-t border-divider pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
          leadingIcon={whatsAppAvailable ? <WhatsAppGlyph size={18} /> : undefined}
        >
          {whatsAppAvailable ? 'Review in WhatsApp' : 'Write my message'}
        </Button>
        <p className="text-body-sm text-ink-muted">
          Fields marked <span aria-hidden="true">*</span>
          <span className="sr-only">with an asterisk</span> are required. Nothing is sent until you press send
          yourself.
        </p>
      </div>
    </form>
  );
}
