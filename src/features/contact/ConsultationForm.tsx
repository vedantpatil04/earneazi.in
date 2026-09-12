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
  consultationDefaults,
  consultationSchema,
  consultationTopicGroups,
  consultationTopics,
  isKnownTopic,
  parseSipParam,
} from './consultationSchema';
import type { ConsultationValues } from './consultationSchema';

/**
 * The consultation flow — the compose-and-send option from §25.
 *
 *   details → client-side validation → structured message → the person's own
 *   WhatsApp, pre-filled → they read it → they press send
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
 * ── The three destinations, in order ────────────────────────────────────
 *
 *   WhatsApp confirmed  → opens wa.me with the draft. The primary path.
 *   email confirmed     → opens their mail client with the same text.
 *   neither yet         → shows the composed draft with a copy button.
 *
 * All three produce the identical message, because all three go through
 * `buildConversationMessage` in lib/contact/conversation.ts. The typed
 * details reach the draft in every case — that is the requirement, and it is
 * why the draft is also shown on screen rather than only handed to another
 * app: a deep link that fails to open on some Android browsers would
 * otherwise lose what the person wrote.
 *
 * ── Arriving with context ───────────────────────────────────────────────
 *
 * `?topic=insurance`, `?goal=buy-a-home` and `?sip=5000-12-10` pre-select the
 * subject, which is how every contextual CTA on the site reaches this form
 * while the WhatsApp number is still unconfirmed. The SIP parameter is
 * revalidated through the calculator's own engine before it is trusted — a
 * query string is user-editable, and figures in a message must be ones the
 * person actually chose.
 */
export function ConsultationForm() {
  const [searchParams] = useSearchParams();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [draft, setDraft] = useState<{ text: string; name: string } | null>(null);
  const [copied, setCopied] = useState(false);

  /* Read once per URL change. `goal` and `topic` are the same field to this
     form — both name a subject — so either populates it. */
  const incoming = useMemo(() => {
    const requested = searchParams.get('topic') ?? searchParams.get('goal');
    return {
      topic: isKnownTopic(requested) ? requested : consultationDefaults.topic,
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
    defaultValues: { ...consultationDefaults, topic: incoming.topic },
  });

  /* A CTA elsewhere on the site can change the query string while this form
     is already mounted, so the selection follows it. */
  useEffect(() => {
    setValue('topic', incoming.topic);
  }, [incoming.topic, setValue]);

  const onSubmit = (values: ConsultationValues) => {
    const details: ConsultationDetails = {
      name: values.name,
      phone: values.phone,
      email: values.email || undefined,
      topic: values.topic,
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
    reset({ ...consultationDefaults, topic: incoming.topic });
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
        className="rounded-band border border-divider bg-surface p-5 sm:p-6"
      >
        {/* Announced on appearance: the form it replaces is gone, so without
            this a screen reader user gets silence after submitting. */}
        <div role="status" aria-live="polite">
          <h3 className="text-display-xs text-ink-display">
            Ready to send, {draft.name.split(' ')[0]}.
          </h3>

          <p className="mt-3 max-w-prose text-body text-ink-secondary">
            {href
              ? 'WhatsApp should have opened with this message already written. Read it over, change anything you like, and press send — nothing reaches us until you do.'
              : 'Here’s your message, written out. Nothing has been sent: copy it across to us and we’ll pick it up from there.'}
          </p>
        </div>

        {/* The draft itself, so what was typed is never trapped inside a deep
            link that may not have opened. */}
        <pre className="mt-5 max-w-full overflow-x-auto whitespace-pre-wrap rounded-surface border border-divider bg-surface-sunken p-4 font-body text-body-sm text-ink">
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

        <Field label="Email" error={errors.email?.message} id="consultation-email" helper="Optional.">
          {(field) => (
            <Input {...field} {...register('email')} type="email" inputMode="email" autoComplete="email" />
          )}
        </Field>

        <Field label="What’s this about?" required error={errors.topic?.message} id="consultation-topic">
          {(field) => (
            <Select {...field} {...register('topic')}>
              {consultationTopicGroups.map((group) => (
                <optgroup key={group} label={group}>
                  {consultationTopics
                    .filter((topic) => topic.group === group)
                    .map((topic) => (
                      <option key={topic.value} value={topic.value}>
                        {topic.label}
                      </option>
                    ))}
                </optgroup>
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
        {(field) => <Textarea {...field} {...register('message')} rows={5} />}
      </Field>

      {/* Carried from a SIP entry point. Stated plainly rather than hidden,
          because it will appear in the message and the person should know
          that before they send it. */}
      {incoming.sip && (
        <p className="rounded-surface border border-divider bg-surface-sunken px-4 py-3 text-body-sm text-ink-secondary">
          We&rsquo;ll include the plan you were looking at in the calculator — the monthly amount, the period and the
          rate you assumed. No projected figure is included.
        </p>
      )}

      <div className="flex flex-col gap-3 border-t border-divider pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
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
