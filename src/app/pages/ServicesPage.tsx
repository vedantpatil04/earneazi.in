import { PageShell } from '@/components/layout/PageShell';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';


// Phase 1 route. Full content for this page belongs to a later phase — the
// only change made here in Phase 2 was removing internal phase/placeholder
// wording from what a visitor actually sees.
export default function ServicesPage() {
  return (
    <PageShell title="Our services">
      <Section spacing="lg">
        <Container size="default">
          <h1 className="text-h1 font-display-wonk">Our services</h1>
          <p className="mt-5 max-w-prose text-lead text-ink-secondary">
            Mutual funds &amp; PMS, insurance and loans &mdash; the three things we help with, and the reason they work better planned together than bought separately.
          </p>
          <Button to="/contact" size="lg" className="mt-8">
            Book a consultation
          </Button>
        </Container>
      </Section>
    </PageShell>
  );
}
