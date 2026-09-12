import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Link } from '@/components/ui/Link';
import { RevealGroup } from '@/components/motion/Reveal';
import { settleVariants } from '@/lib/motion/variants';
import { teamMembers } from '@/data/team';

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/**
 * The people.
 *
 * Names and roles are confirmed. Photography and bios are not, and neither
 * is invented here: a stock portrait standing in for a named real person
 * would be a false representation of an actual employee, which is a harder
 * line than "temporary imagery is fine".
 *
 * So the monogram is the design, not a gap waiting to be filled. Set in the
 * display face on a brand-tinted plate, at the same radius and weight as
 * every other surface on the page, it reads as a deliberate mark rather
 * than as a missing avatar. When real photography arrives, set `photoUrl`
 * and `photoVerified` in src/data/team.ts and swap the plate for an
 * EditorialImage; nothing else here changes.
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

        {/* A one-pixel grid gap over a divider ground draws the rules
            between cells without each cell carrying its own border. */}
        <RevealGroup
          as="ul"
          stagger={0.12}
          className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-band border border-divider bg-divider sm:grid-cols-2 lg:mt-16"
        >
          {teamMembers.map((member) => (
            <motion.li key={member.id} variants={settleVariants} className="flex items-center gap-6 bg-bg p-8 sm:p-10">
              <span
                aria-hidden="true"
                className="inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-surface border border-brand/25 bg-brand-subtle font-display text-display-xs font-semibold text-brand-ink"
              >
                {initials(member.name)}
              </span>
              <div className="min-w-0">
                <p className="text-display-xs text-ink-display">{member.name}</p>
                <p className="mt-1 text-body text-ink-secondary">{member.role}</p>
              </div>
            </motion.li>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
