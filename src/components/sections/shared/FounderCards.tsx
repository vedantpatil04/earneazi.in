import { motion } from 'framer-motion';
import { teamMembers, hasVerifiedDetail, hasVerifiedPhoto } from '@/data/team';
import type { TeamMember } from '@/types/content';
import { RevealGroup } from '@/components/motion/Reveal';
import { settleVariants } from '@/lib/motion/variants';
import { cn } from '@/lib/utils/cn';

/**
 * The founders, as cards — shared by the homepage section and the About page
 * so the two cannot drift into two different treatments of the same people.
 *
 * ── What it renders, and what it refuses to ─────────────────────────────
 *
 * Name and role are confirmed, so they always show. Photograph, tenure,
 * responsibility, focus tags and bio are each [VERIFY] and each render only
 * when present — see data/team.ts. Nothing here fills a gap with a plausible
 * value: a stock portrait standing in for a named real person is a false
 * representation of an actual employee, and an invented "12 years in the
 * industry" is the same failure in text.
 *
 * ── The mark ────────────────────────────────────────────────────────────
 *
 * §24 opens on a defect: both founders rendered the monogram "AS", because
 * "Abhishek Sharma" and "Anil Souza" reduce to the same initials. The fix is
 * in the data — an authored monogram per person — and the design here makes
 * it a deliberate mark rather than an avatar fallback: a tall plate in the
 * founder's own accent from the Phase 3 tone channel, with the letters set
 * in the display face at the same radius and weight as every other surface
 * on the page. Two founders, two marks, two colours.
 *
 * When real photography arrives the plate becomes the photograph and
 * everything else stays exactly where it is.
 *
 * ── Motion ──────────────────────────────────────────────────────────────
 *
 * §24: "Founder cards do not animate on hover; they get a border/surface
 * state on focus-within." So there is no lift and no hover transform — the
 * only interaction state is the border, and it responds to focus as well as
 * to the pointer, which is what makes it reachable from a keyboard.
 */
export function FounderCards({ className }: { className?: string }) {
  return (
    <RevealGroup
      as="ul"
      stagger={0.1}
      className={cn('grid grid-cols-1 gap-5 sm:grid-cols-2', className)}
    >
      {teamMembers.map((member) => (
        <motion.li key={member.id} variants={settleVariants}>
          <FounderCard member={member} />
        </motion.li>
      ))}
    </RevealGroup>
  );
}

function FounderCard({ member }: { member: TeamMember }) {
  const showPhoto = hasVerifiedPhoto(member);
  const showDetail = hasVerifiedDetail(member);

  return (
    <article
      data-tone={member.toneId}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-band border border-divider bg-surface',
        /* Border and surface only — no transform. The state answers focus as
           well as hover, so it exists for a keyboard too. */
        'transition-[border-color,background-color] duration-base ease-out',
        'hover:border-tone/40 focus-within:border-tone/60 focus-within:bg-tone-tint/40'
      )}
    >
      <div className="flex items-start gap-5 p-5 sm:p-6">
        {showPhoto ? (
          <img
            src={member.photoUrl ?? undefined}
            alt={`${member.name}, ${member.role} at Earneazi`}
            width={96}
            height={96}
            loading="lazy"
            decoding="async"
            className="h-20 w-20 shrink-0 rounded-surface object-cover sm:h-24 sm:w-24"
          />
        ) : (
          <span
            aria-hidden="true"
            className={cn(
              'inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-surface sm:h-24 sm:w-24',
              'border border-tone/25 bg-tone-tint',
              'font-display text-display-xs font-semibold tracking-[0.02em] text-tone'
            )}
          >
            {member.monogram}
          </span>
        )}

        <div className="min-w-0 pt-1">
          <h3 className="text-display-xs text-ink-display">{member.name}</h3>
          <p className="mt-1 text-body-sm font-semibold text-tone">{member.role}</p>

          {member.tenureVerified && member.tenure && (
            <p className="mt-2 text-body-sm text-ink-secondary">{member.tenure}</p>
          )}
        </div>
      </div>

      {showDetail && (
        <div className="border-t border-divider p-5 sm:p-6">
          {member.responsibility && (
            <>
              <h4 className="font-display text-legal font-semibold uppercase tracking-[0.12em] text-ink-muted">
                Accountable for
              </h4>
              <p className="mt-2 text-body-sm text-ink">{member.responsibility}</p>
            </>
          )}

          {member.bioVerified && member.bio.trim().length > 0 && (
            <p className={cn('max-w-prose text-body-sm text-ink-secondary', member.responsibility && 'mt-4')}>
              {member.bio}
            </p>
          )}

          {member.focus.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {member.focus.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center rounded-pill border border-tone/25 bg-tone-tint px-2.5 py-1 text-legal font-medium text-ink"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}

          {member.credentialId && (
            <p className="mt-4 font-display text-legal tabular text-ink-muted">{member.credentialId}</p>
          )}
        </div>
      )}
    </article>
  );
}
