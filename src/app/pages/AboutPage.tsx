import { PageShell } from '@/components/layout/PageShell';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';


// Phase 1 route. Full content for this page belongs to a later phase — the
// only change made here in Phase 2 was removing internal phase/placeholder
// wording from what a visitor actually sees.
export default function AboutPage() {
  return (
    <PageShell title="About Earneazi">
      <Section spacing="lg">
        <Container size="default">
          <h1 className="text-h1 font-display-wonk">About Earneazi</h1>
          <p className="mt-5 max-w-prose text-lead text-ink-secondary">
            One advisor across mutual funds &amp; PMS, insurance and loans, so the pieces of your plan are chosen together rather than sold to you one at a time.
          </p>
          <Button to="/contact" size="lg" className="mt-8">
            Book a consultation
          </Button>
        </Container>
      </Section>
    </PageShell>
  );
}
