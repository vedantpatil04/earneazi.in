import { PageShell } from '@/components/layout/PageShell';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';


// Phase 1 route. Full content for this page belongs to a later phase — the
// only change made here in Phase 2 was removing internal phase/placeholder
// wording from what a visitor actually sees.
export default function FinancialGoalsPage() {
  return (
    <PageShell title="What are you working toward?">
      <Section spacing="lg">
        <Container size="default">
          <h1 className="text-h1 font-display-wonk">What are you working toward?</h1>
          <p className="mt-5 max-w-prose text-lead text-ink-secondary">
            Growing wealth, protecting your family, buying a home, saving tax, planning retirement &mdash; every plan we build starts from one of these rather than from a product.
          </p>
          <Button to="/contact" size="lg" className="mt-8">
            Book a consultation
          </Button>
        </Container>
      </Section>
    </PageShell>
  );
}
