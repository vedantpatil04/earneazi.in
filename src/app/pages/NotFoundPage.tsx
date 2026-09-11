import { PageShell } from '@/components/layout/PageShell';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <PageShell title="Page not found">
      <Section spacing="lg">
        <Container size="narrow" className="text-center">
          <h1 className="text-h1 font-display-sharp">Page not found</h1>
          <p className="mt-5 text-lead text-ink-secondary">
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
