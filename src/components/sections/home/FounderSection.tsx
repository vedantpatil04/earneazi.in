import { ArrowUpRight } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Link } from '@/components/ui/Link';
import { ConversationCta } from '@/components/conversion/ConversationCta';
import { FounderCards } from '@/components/sections/shared/FounderCards';
import { generalConversation } from '@/lib/contact/conversation';

/**
 * The people.
 *
 * Names and roles are confirmed. Photography, tenure, responsibility and bios
 * are not, and none of them are invented here — the cards render each field
 * only when it exists (see components/sections/shared/FounderCards.tsx and
 * data/team.ts), which is why this section is legible today and complete the
 * moment the client supplies the rest.
 *
 * ── What Phase 5 changed ────────────────────────────────────────────────
 *
 * The previous version rendered both founders with the monogram "AS", because
 * it derived initials from the full name and "Abhishek Sharma" and "Anil
 * Souza" collide. That is the defect §24 opens on, and the fix is in the data
 * rather than in a formula.
 *
 * It also ends somewhere now. A section about the two people you would be
 * dealing with that offers no way to reach either of them was the clearest
 * gap in the conversion path, so it closes on the shared conversation CTA —
 * the same control, with the same wording and destination, as every other
 * "talk to us" action on the site.
 */
export function FounderSection() {
  return (
    <Section spacing="lg" background="surface" aria-labelledby="founders-heading">
      <Container size="content">
        <Eyebrow>The people</Eyebrow>

        <SectionHeader
          id="founders-heading"
          className="mt-4"
          title="The people behind Earneazi."
          intro="Financial advice is a relationship before it’s a product, so it helps to know who’s on the other side of it."
          action={
            <Link to="/about" variant="standalone" trailingIcon={<ArrowUpRight size={16} aria-hidden="true" />}>
              About Earneazi
            </Link>
          }
        />

        <FounderCards className="mt-10 lg:mt-14" />

        <div className="mt-8 flex flex-col gap-4 rounded-band border border-divider bg-surface-sunken p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="max-w-measure text-body text-ink-secondary">
            Whichever of them picks it up, you&rsquo;ll be talking to someone who has read what you wrote.
          </p>
          <ConversationCta context={generalConversation} variant="secondary" size="md" className="shrink-0">
            Start a conversation
          </ConversationCta>
        </div>
      </Container>
    </Section>
  );
}
