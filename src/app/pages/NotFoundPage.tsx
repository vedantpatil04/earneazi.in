import { PageShell } from '@/components/layout/PageShell';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <PageShell title="Page not found">
      <Section spacing="lg">
        <Container size="narrow" className="text-center">
          <span aria-hidden="true" className="sphere mx-auto block h-4 w-4 rounded-pill" />
          <h1 className="mt-6 text-display-lg text-ink-display">Page not found</h1>
          <p className="mx-auto mt-5 max-w-measure text-body-lg text-ink-secondary">
            That link doesn&rsquo;t lead anywhere. It may have moved, or the address may have a typo in it.
          </p>
          <Button to="/" size="lg" className="mt-8">
            Back to home
          </Button>
        </Container>
      </Section>
    </PageShell>
  );
}
