import { PageShell } from '@/components/layout/PageShell';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';


// Phase 1 route. Full content for this page belongs to a later phase — the
// only change made here in Phase 2 was removing internal phase/placeholder
// wording from what a visitor actually sees.
export default function FaqPage() {
  return (
    <PageShell title="Frequently asked questions">
      <Section spacing="lg">
        <Container size="narrow">
          <h1 className="text-h1 font-display-wonk">Frequently asked questions</h1>
          <p className="mt-5 max-w-prose text-lead text-ink-secondary">
            The questions people ask us most often about mutual funds, insurance and loans &mdash; answered in plain language.
          </p>
          <Button to="/contact" size="lg" className="mt-8">
            Book a consultation
          </Button>
        </Container>
      </Section>
    </PageShell>
  );
}
