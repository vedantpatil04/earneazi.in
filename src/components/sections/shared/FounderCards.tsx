import { motion } from 'framer-motion';
import { teamMembers, hasVerifiedDetail, hasVerifiedPhoto } from '@/data/team';
import type { TeamMember } from '@/types/content';
import { RevealGroup } from '@/components/motion/Reveal';
import { DimensionalText } from '@/components/brand/DimensionalText';
import { settleVariants } from '@/lib/motion/variants';
import { cn } from '@/lib/utils/cn';

/**
 * The people, as cards — shared by the homepage section and the About page
 * so the two cannot drift into two different treatments of the same people.
 *
 * ── Founders and team — Enhancement B ───────────────────────────────────
 *
 * The founders come first, two to a row. The team (today, Aditya Math,
 * Social Media Manager) follows under its own small label, in the same card
 * at a smaller scale — the same system, one step down, so a team member is
 * never presented as a founder and the founders keep their prominence.
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
 * Without a photograph, each person has an authored monogram (data/team.ts)
 * on a lit plate in their own accent from the Phase 3 tone channel, with the
 * letters pressed into it by the dimensional type's `fill` face. When real
 * photography arrives the plate becomes the photograph and everything else
 * stays exactly where it is.
 *
 * ── Motion ──────────────────────────────────────────────────────────────
 *
 * §24: "Founder cards do not animate on hover; they get a border/surface
 * state on focus-within." So there is no lift and no hover transform — the
 * only interaction state is the border, and it responds to focus as well as
 * to the pointer, which is what makes it reachable from a keyboard.
 */
export function FounderCards({ className }: { className?: string }) {
  const founders = teamMembers.filter((member) => member.group === 'founder');
  const team = teamMembers.filter((member) => member.group === 'team');

  return (
    <div className={className}>
      <RevealGroup as="ul" stagger={0.1} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {founders.map((member) => (
          <motion.li key={member.id} variants={settleVariants}>
            <PersonCard member={member} />
          </motion.li>
        ))}
      </RevealGroup>

      {team.length > 0 && (
        <div className="mt-8">
          <p className="flex items-center gap-2 font-display text-legal font-semibold uppercase tracking-[0.12em] text-ink-muted">
            <span aria-hidden="true" className="sphere h-2 w-2 rounded-pill" />
            The team
          </p>
          <RevealGroup as="ul" stagger={0.1} className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <motion.li key={member.id} variants={settleVariants}>
                <PersonCard member={member} compact />
              </motion.li>
            ))}
          </RevealGroup>
        </div>
      )}
    </div>
  );
}

function PersonCard({ member, compact = false }: { member: TeamMember; compact?: boolean }) {
  const showPhoto = hasVerifiedPhoto(member);
  const showDetail = hasVerifiedDetail(member);
  const markSize = compact ? 'h-14 w-14 sm:h-16 sm:w-16' : 'h-20 w-20 sm:h-24 sm:w-24';

  return (
    <article
      data-tone={member.toneId}
      className={cn(
        'raised group relative flex h-full flex-col overflow-hidden rounded-band border border-divider bg-surface',
        /* Border and surface only — no transform. The state answers focus as
           well as hover, so it exists for a keyboard too. */
        'transition-[border-color,background-color] duration-base ease-out',
        'hover:border-tone/40 focus-within:border-tone/60 focus-within:bg-tone-tint/40'
      )}
    >
      <div className={cn('flex items-start', compact ? 'gap-4 p-4 sm:p-5' : 'gap-5 p-5 sm:p-6')}>
        {showPhoto ? (
          <img
            src={member.photoUrl ?? undefined}
            alt={`${member.name}, ${member.role} at Earneazi`}
            width={96}
            height={96}
            loading="lazy"
            decoding="async"
            className={cn('shrink-0 rounded-surface object-cover', markSize)}
          />
        ) : (
          <span
            aria-hidden="true"
            className={cn(
              'lit lit-tone relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-surface',
              'bg-tone-fill font-display font-bold tracking-[0.02em] text-on-tone',
              compact ? 'text-display-xs' : 'text-display-sm',
              markSize
            )}
          >
            <span className="texture-dots pointer-events-none absolute inset-0 opacity-60" />
            <DimensionalText tone="fill" className="relative">
              {member.monogram}
            </DimensionalText>
          </span>
        )}

        <div className="min-w-0 pt-1">
          <h3 className={compact ? 'text-title-lg text-ink-display' : 'text-display-xs text-ink-display'}>{member.name}</h3>
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
