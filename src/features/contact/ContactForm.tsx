import { useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Check, Copy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Icon } from '@/components/ui/Icon';
import { zodResolver } from '@/lib/forms/zodResolver';
import { contactEmail } from '@/data/contact';
import { composeEnquiry, contactFormSchema, enquiryTopics } from './contactFormSchema';
import type { ContactFormValues } from './contactFormSchema';

/**
 * The enquiry form.
 *
 * There is no backend in V1, and this does not pretend otherwise. Submitting
 * hands the message to something the person controls:
 *
 *   email configured   → opens their mail client with the enquiry pre-filled,
 *                        addressed to Earneazi. They press send, so they can
 *                        see exactly what leaves and it genuinely arrives.
 *   not configured yet → shows the composed message with a copy button.
 *
 * What it never does is show a "message sent" tick for something that went
 * nowhere. On a financial-services site, an enquiry someone believes was
 * received and silently wasn't is a real cost to a real person.
 *
 * Configure the address in src/data/contact.ts to switch on the first path.
 */
export function ContactForm() {
  const formId = useId();
  const [submitted, setSubmitted] = useState<ContactFormValues | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    // Validate once a field has been left, then live — so nothing is
    // flagged before there was a chance to type it, but a correction is
    // acknowledged immediately.
    mode: 'onTouched',
    defaultValues: { name: '', email: '', phone: '', topic: 'not-sure', message: '' },
  });

  const onSubmit = (values: ContactFormValues) => {
    setSubmitted(values);
    setCopied(false);

    if (contactEmail) {
      const subject = encodeURIComponent(`Enquiry from ${values.name}`);
      const body = encodeURIComponent(composeEnquiry(values));
      window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    }
  };

  const handleCopy = async () => {
    if (!submitted) return;
    try {
      await navigator.clipboard.writeText(composeEnquiry(submitted));
      setCopied(true);
    } catch {
      // Clipboard access can be refused; the message is on screen and
      // selectable either way, so there is nothing to recover from.
      setCopied(false);
    }
  };

  const startAgain = () => {
    setSubmitted(null);
    setCopied(false);
    reset();
  };

  if (submitted) {
    return (
      <div className="rounded-lg border border-divider bg-surface p-6 sm:p-8">
        <div
          // Announced on appearance: the form it replaces is gone, so
          // without this a screen reader user gets silence after submitting.
          role="status"
          aria-live="polite"
          className="flex flex-col"
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent/12 text-accent">
            <Icon icon={Check} size={22} />
          </span>

          <h3 className="mt-5 text-h3 text-ink">Thanks, {submitted.name.split(' ')[0]}.</h3>

          {contactEmail ? (
            <p className="mt-3 max-w-prose text-body text-ink-secondary">
              Your email app should have opened with this message ready to send &mdash; press send and it&rsquo;ll
              reach us. If nothing opened, you can copy the message below and email it to {contactEmail}.
            </p>
          ) : (
            <p className="mt-3 max-w-prose text-body text-ink-secondary">
              Here&rsquo;s your message, ready to send. Copy it across to us and we&rsquo;ll pick it up from there.
            </p>
          )}

          <pre className="mt-6 max-w-full overflow-x-auto whitespace-pre-wrap rounded-md border border-divider bg-bg p-4 font-body text-small text-ink-secondary">
            {composeEnquiry(submitted)}
          </pre>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="button" onClick={handleCopy} variant={contactEmail ? 'outline' : 'primary'}>
            <Icon icon={copied ? Check : Copy} size={17} />
            {copied ? 'Copied' : 'Copy message'}
          </Button>
          <Button type="button" onClick={startAgain} variant="ghost">
            <Icon icon={RotateCcw} size={17} />
            Write another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${formId}-name`} required>
            Your name
          </Label>
          <Input
            id={`${formId}-name`}
            autoComplete="name"
            className="mt-2"
            errorMessage={errors.name?.message}
            {...register('name')}
          />
        </div>

        <div>
          <Label htmlFor={`${formId}-email`} required>
            Email
          </Label>
          <Input
            id={`${formId}-email`}
            type="email"
            inputMode="email"
            autoComplete="email"
            className="mt-2"
            errorMessage={errors.email?.message}
            {...register('email')}
          />
        </div>

        <div>
          <Label htmlFor={`${formId}-phone`}>Phone (optional)</Label>
          <Input
            id={`${formId}-phone`}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className="mt-2"
            errorMessage={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        <div>
          <Label htmlFor={`${formId}-topic`} required>
            What&rsquo;s this about?
          </Label>
          <Select
            id={`${formId}-topic`}
            className="mt-2"
            errorMessage={errors.topic?.message}
            {...register('topic')}
          >
            {enquiryTopics.map((topic) => (
              <option key={topic.value} value={topic.value}>
                {topic.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor={`${formId}-message`} required>
          What are you trying to do?
        </Label>
        <Textarea
          id={`${formId}-message`}
          rows={5}
          className="mt-2"
          placeholder="A sentence or two is plenty — where you are now, and what you'd like to sort out."
          errorMessage={errors.message?.message}
          {...register('message')}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          Send your enquiry
        </Button>
        <p className="text-small text-ink-muted">Fields marked with an asterisk are required.</p>
      </div>
    </form>
  );
}
