import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Icon } from '@/components/ui/Icon';
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
 * Names and roles are confirmed. Photography and bios are not, and neither
 * is invented here: a stock portrait standing in for a named real person
 * would be a false representation of an actual employee, which is a harder
 * line than "temporary imagery is fine".
 *
 * So the monogram is the design, not a gap waiting to be filled — set in
 * Fraunces on a brass-tinted plate, it reads as a deliberate mark rather
 * than a missing avatar. When real photography arrives, set `photoUrl` and
 * `photoVerified` in src/data/team.ts and swap the plate for an
 * EditorialImage; nothing else here needs to change.
 */
export function FounderSection() {
  return (
    <Section spacing="lg" background="surface" aria-labelledby="founders-heading">
      <Container size="wide">
        <SectionHeading
          id="founders-heading"
          title="The people behind Earneazi."
          lead="Financial advice is a relationship before it’s a product, so it helps to know who’s on the other side of it."
          action={
            <Link
              to="/about"
              className="group inline-flex items-center gap-1.5 text-body font-medium text-accent transition-colors motion-safe:duration-200 hover:text-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              About Earneazi
              <Icon
                icon={ArrowUpRight}
                size={17}
                className="transition-transform motion-safe:duration-200 ease-signature group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          }
        />

        <RevealGroup
          as="ul"
          stagger={0.12}
          className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-divider bg-divider sm:grid-cols-2 lg:mt-16"
        >
          {teamMembers.map((member) => (
            <motion.li key={member.id} variants={settleVariants} className="flex items-center gap-6 bg-bg p-8 sm:p-10">
              <span
                aria-hidden="true"
                className="inline-flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-md border border-brass/30 bg-brass/[0.08] font-display text-[1.75rem] font-medium text-brass"
              >
                {initials(member.name)}
              </span>
              <div>
                <p className="font-display text-h3 text-ink">{member.name}</p>
                <p className="mt-1 text-body text-ink-secondary">{member.role}</p>
              </div>
            </motion.li>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
