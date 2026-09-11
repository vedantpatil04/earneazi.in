import { Link } from 'react-router-dom';
import { Mail, MapPin, MessageCircle, Phone, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/motion/Reveal';
import { riseVariants } from '@/lib/motion/variants';
import { ContactForm } from '@/features/contact/ContactForm';
import { contactChannelHref, verifiedContactChannels } from '@/data/contact';
import type { ContactChannel } from '@/types/content';

const CHANNEL_ICONS: Record<ContactChannel['kind'], LucideIcon> = {
  phone: Phone,
  whatsapp: MessageCircle,
  email: Mail,
  office: MapPin,
  hours: Clock,
};

/**
 * The enquiry form is the page, with the direct channels alongside it for
 * people who would rather just call.
 *
 * The channel list renders only what the client has confirmed in
 * src/data/contact.ts — a phone number or address that might not be real is
 * worse on a financial-services site than no number at all. Until details
 * are filled in, the column carries what actually happens next instead, so
 * the layout holds either way rather than collapsing into a gap.
 *
 * No closing CTA band here: this page *is* the call to action, and a
 * "book a consultation" button under a consultation form is noise.
 */
export default function ContactPage() {
  const hasChannels = verifiedContactChannels.length > 0;

  return (
    <PageShell title="Get in touch">
      <PageHeader
        title="Tell us what you’re working toward."
        lead="Where you are now, what you’d like to sort out. A sentence or two is enough to start with — the detail can come later."
      />

      <Section spacing="md" aria-labelledby="enquiry-heading">
        <Container size="wide">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal variants={riseVariants} className="lg:col-span-7">
              <h2 id="enquiry-heading" className="text-h3 text-ink">
                Send us an enquiry
              </h2>
              <div className="mt-8">
                <ContactForm />
              </div>
            </Reveal>

            <Reveal variants={riseVariants} delay={0.08} className="lg:col-span-5">
              {hasChannels && (
                <section aria-labelledby="channels-heading" className="mb-12">
                  <h2 id="channels-heading" className="text-h3 text-ink">
                    Or reach us directly
                  </h2>

                  <ul className="mt-6 flex flex-col border-t border-divider">
                    {verifiedContactChannels.map((channel) => {
                      const href = contactChannelHref(channel);
                      const body = (
                        <>
                          <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-surface-2 text-brass">
                            <Icon icon={CHANNEL_ICONS[channel.kind]} size={18} />
                          </span>
                          <span>
                            <span className="block text-label font-semibold text-ink">{channel.label}</span>
                            <span className="mt-1 block whitespace-pre-line text-body text-ink-secondary">
                              {channel.value}
                            </span>
                            {channel.note && <span className="mt-1 block text-small text-ink-muted">{channel.note}</span>}
                          </span>
                        </>
                      );

                      return (
                        <li key={channel.id} className="border-b border-divider">
                          {href ? (
                            <a
                              href={href}
                              {...(channel.kind === 'whatsapp'
                                ? { target: '_blank', rel: 'noreferrer noopener' }
                                : {})}
                              className="flex items-start gap-4 py-5 transition-colors motion-safe:duration-200 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                            >
                              {body}
                            </a>
                          ) : (
                            <div className="flex items-start gap-4 py-5">{body}</div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              <section aria-labelledby="next-heading" className="rounded-lg border border-divider bg-surface p-6 sm:p-8">
                <h2 id="next-heading" className="text-h3 text-ink">
                  What happens next
                </h2>
                <ol className="mt-6 flex flex-col gap-6">
                  {[
                    {
                      title: 'A person reads it',
                      body: 'Not a queue and not an autoresponder. Whoever picks it up will have read what you wrote before they reply.',
                    },
                    {
                      title: 'We come back with questions',
                      body: 'Usually a few, because the useful advice depends on details a form can’t ask for.',
                    },
                    {
                      title: 'Then a conversation',
                      body: 'Where you are, where you’d like to get to, and what it would take. Nothing is bought or signed at this stage.',
                    },
                  ].map((step, index) => (
                    <li key={step.title} className="flex gap-4">
                      <span className="font-mono text-marker font-medium font-numeric text-brass" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span>
                        <span className="block text-body font-medium text-ink">{step.title}</span>
                        <span className="mt-1.5 block text-small text-ink-secondary">{step.body}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </section>

              <p className="mt-8 text-small text-ink-muted">
                Want the short answers first?{' '}
                <Link
                  to="/faq"
                  className="text-ink underline decoration-brass decoration-1 underline-offset-4 transition-colors motion-safe:duration-200 hover:text-brass focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  Read the FAQ
                </Link>
                .
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
