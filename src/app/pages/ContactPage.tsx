import { PageShell } from '@/components/layout/PageShell';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';


// Phase 1 route. Full content for this page belongs to a later phase — the
// only change made here in Phase 2 was removing internal phase/placeholder
// wording from what a visitor actually sees.
export default function ContactPage() {
  return (
    <PageShell title="Get in touch">
      <Section spacing="lg">
        <Container size="narrow">
          <h1 className="text-h1 font-display-wonk">Get in touch</h1>
          <p className="mt-5 max-w-prose text-lead text-ink-secondary">
            Tell us what you&rsquo;re working toward &mdash; where you are now, what you&rsquo;d like to sort out &mdash; and we&rsquo;ll take it from there.
          </p>
        </Container>
      </Section>
    </PageShell>
  );
}
