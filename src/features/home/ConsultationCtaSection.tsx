import { Phone, MessageSquare, Calendar, ShieldCheck, MapPin } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { contactDetails } from '@/data/home';

export function ConsultationCtaSection() {
  return (
    <Section spacing="lg" background="surface" className="border-t border-border">
      <Container size="wide">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-2 p-8 sm:p-12 lg:p-16">
          {/* Subtle decorative glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl"
          />

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-label font-medium text-accent">
              <ShieldCheck size={14} aria-hidden="true" />
              <span>Complimentary · Confidential · Zero Obligation</span>
            </div>

            <h2 className="mt-4 font-display text-h2 sm:text-display font-medium text-ink">
              Ready for a financial plan built around your life?
            </h2>

            <p className="mt-4 text-body-lg text-ink-secondary leading-relaxed max-w-2xl">
              Schedule a 30-minute consultation with our senior advisors. We will review your current
              investments, insurance coverage, and loan options with complete transparency.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button size="lg" variant="primary" to="/contact" className="shadow-sm">
                <Calendar size={18} aria-hidden="true" />
                <span>Book Free Consultation</span>
              </Button>

              <Button
                size="lg"
                variant="outline"
                href={contactDetails.whatsappUrl}
                className="border-border hover:bg-surface"
              >
                <MessageSquare size={18} className="text-accent" aria-hidden="true" />
                <span>Chat on WhatsApp</span>
              </Button>

              <a
                href={`tel:${contactDetails.phonePrimary.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 px-3 py-2 text-body font-medium text-ink hover:text-accent transition-colors"
              >
                <Phone size={16} aria-hidden="true" />
                <span>{contactDetails.phonePrimary}</span>
              </a>
            </div>

            {/* Office & Timing Details */}
            <div className="mt-10 pt-8 border-t border-border/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-small text-ink-secondary">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-accent mt-0.5 shrink-0" aria-hidden="true" />
                <span>{contactDetails.address}</span>
              </div>
              <div className="flex items-start gap-2.5 sm:justify-end">
                <span>Working Hours: {contactDetails.workingHours}</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
