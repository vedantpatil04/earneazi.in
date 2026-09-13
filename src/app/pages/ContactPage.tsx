import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Link } from '@/components/ui/Link';
import { Reveal } from '@/components/motion/Reveal';
import { clipRevealVariants, riseVariants } from '@/lib/motion/variants';
import { WhatsAppGlyph } from '@/components/conversion/WhatsAppGlyph';
import { ConsultationForm } from '@/features/contact/ConsultationForm';
import { contactChannelHref, verifiedContactChannels } from '@/data/contact';
import { buildConversationMessage, generalConversation, whatsAppHref } from '@/lib/contact/conversation';
import type { ContactChannel } from '@/types/content';
import { cn } from '@/lib/utils/cn';

/**
 * The conversion surface.
 *
 * ── The form is the page ────────────────────────────────────────────────
 *
 * §25 sets out three permissible options for a frontend-only V1 and
 * recommends the second: compose-and-send. That is what this is. The form
 * builds a structured message from what the person typed and hands it to
 * their own WhatsApp (or mail client) to send. Nothing posts anywhere,
 * nothing is stored, and no success state is shown for something that did
 * not happen.
 *
 * ── The channel column is verified-only ─────────────────────────────────
 *
 * It renders exactly what the client has confirmed in data/contact.ts and
 * nothing else. A phone number or an address that might not be current is
 * worse on a financial-services site than no number at all — someone acts on
 * it. Until details are filled in, the column carries what actually happens
 * next instead, so the layout holds either way rather than collapsing into a
 * gap.
 *
 * ── No closing CTA band ─────────────────────────────────────────────────
 *
 * This page *is* the call to action, and a "book a consultation" button under
 * a consultation form is noise. The floating contact control also removes
 * itself on this route for the same reason.
 *
 * `data-conversion-surface` marks the channel block so the floating control
 * stays out of its way if the route ever changes.
 */
const CHANNEL_ICONS: Record<ContactChannel['kind'], LucideIcon> = {
  phone: Phone,
  whatsapp: Mail, // replaced below by the brand glyph; never rendered
  email: Mail,
  office: MapPin,
  hours: Clock,
};

const NEXT_STEPS = [
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
];

export default function ContactPage() {
  const hasChannels = verifiedContactChannels.length > 0;

  return (
    <PageShell title="Get in touch">
      <PageHeader
        size="content"
        title="Tell us what you’re working toward."
        lead="Where you are now, what you’d like to sort out. A sentence or two is enough to start with — the detail can come later."
      />

      <Section spacing="md" aria-labelledby="consultation-heading">
        <Container size="content">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal variants={clipRevealVariants} className="lg:col-span-7">
              <h2 id="consultation-heading" className="text-display-md text-ink-display">
                Book a consultation
              </h2>
              <p className="mt-3 max-w-measure text-body text-ink-secondary">
                Fill this in and we&rsquo;ll write the message for you. You read it, change anything you like, and
                send it yourself — so you can see exactly what leaves.
              </p>

              {/* The form sits on its own raised surface (Enhancement A), so
                  the page's one task reads as an object you work on. */}
              <div className="raised mt-8 rounded-band border border-divider bg-surface p-5 sm:p-7">
                <ConsultationForm />
              </div>
            </Reveal>

            <div className="lg:col-span-5" data-conversion-surface>
              {hasChannels && (
                <Reveal variants={riseVariants} delay={0.06}>
                  <section aria-labelledby="channels-heading" className="mb-8">
                    <h2 id="channels-heading" className="text-display-xs text-ink-display">
                      Or reach us directly
                    </h2>

                    <ul className="mt-5 flex flex-col border-t border-divider">
                      {verifiedContactChannels.map((channel) => (
                        <ChannelRow key={channel.id} channel={channel} />
                      ))}
                    </ul>
                  </section>
                </Reveal>
              )}

              <Reveal variants={riseVariants} delay={0.1}>
                <section
                  aria-labelledby="next-heading"
                  className="raised rounded-band border border-divider bg-surface p-5 sm:p-6"
                >
                  <h2 id="next-heading" className="text-display-xs text-ink-display">
                    What happens next
                  </h2>
                  <ol className="mt-5 flex flex-col gap-5">
                    {NEXT_STEPS.map((step, index) => (
                      <li key={step.title} className="flex gap-4">
                        <span
                          aria-hidden="true"
                          className="lit mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-pill bg-brand font-display text-legal font-semibold tabular text-on-brand"
                        >
                          {index + 1}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-body-sm font-semibold text-ink">{step.title}</span>
                          <span className="mt-1 block text-body-sm text-ink-secondary">{step.body}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </section>

                <p className="mt-6 text-body-sm text-ink-muted">
                  Want the short answers first?{' '}
                  <Link to="/faq" variant="inline">
                    Read the FAQ
                  </Link>
                  .
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}

/**
 * One confirmed channel. Actionable where it can be — `tel:`, `mailto:`, a
 * maps URL, a WhatsApp deep link — and plain text where it cannot, which is
 * what the working-hours row is.
 */
function ChannelRow({ channel }: { channel: ContactChannel }) {
  const isWhatsApp = channel.kind === 'whatsapp';
  /* WhatsApp goes through the shared resolver (Enhancement C), so this row
     opens with the same general draft as every other WhatsApp action on the
     site rather than an empty chat. */
  const href = isWhatsApp
    ? whatsAppHref(buildConversationMessage(generalConversation))
    : contactChannelHref(channel);
  /* WhatsApp and a maps URL both leave the site; `tel:` and `mailto:` hand
     off to another app on the same device and keep the current context. */
  const opensNewTab = isWhatsApp || channel.kind === 'office';

  const body = (
    <>
      <span className="inset-well inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-action bg-surface-sunken text-brand-ink">
        {isWhatsApp ? (
          <WhatsAppGlyph size={18} />
        ) : (
          (() => {
            const Glyph = CHANNEL_ICONS[channel.kind];
            return <Glyph size={18} strokeWidth={1.75} aria-hidden="true" />;
          })()
        )}
      </span>
      <span className="min-w-0">
        <span className="block font-display text-legal font-semibold uppercase tracking-[0.12em] text-ink-muted">
          {channel.label}
        </span>
        <span className="mt-1 block whitespace-pre-line text-body font-medium text-ink">{channel.value}</span>
        {channel.note && <span className="mt-1 block text-body-sm text-ink-secondary">{channel.note}</span>}
      </span>
    </>
  );

  return (
    <li className="border-b border-divider">
      {href ? (
        <a
          href={href}
          {...(opensNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className={cn(
            /* 44px minimum on the whole row, and the row is the target. */
            'flex min-h-14 items-start gap-4 py-4',
            'transition-colors duration-instant ease-out hover:text-brand-ink'
          )}
        >
          {body}
          {opensNewTab && <span className="sr-only"> (opens in a new tab)</span>}
        </a>
      ) : (
        <div className="flex min-h-14 items-start gap-4 py-4">{body}</div>
      )}
    </li>
  );
}
