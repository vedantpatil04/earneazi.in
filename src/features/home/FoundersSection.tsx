import { Users, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { teamMembers } from '@/data/team';

const founderMeta: Record<string, { experience: string; competencies: string[]; initials: string }> = {
  'founder-ceo': {
    experience: '10 Years Industry Experience',
    competencies: ['Mutual Funds & SIPs', 'PMS Advisory', 'Retirement Planning', 'AMFI Distribution'],
    initials: 'AS',
  },
  'co-founder-coo': {
    experience: '6 Years Industry Experience',
    competencies: ['DSA Banking Operations', 'Home & Business Loans', 'Client Relationships', 'Risk Protection'],
    initials: 'AN',
  },
};

export function FoundersSection() {
  return (
    <Section spacing="lg" background="bg">
      <Container size="wide">
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-label font-semibold uppercase tracking-wider text-accent">
            <Users size={14} aria-hidden="true" />
            <span>Senior Leadership</span>
          </div>
          <h2 className="mt-3 font-display text-h2 text-ink">
            Direct access to seasoned advisors. No call centers.
          </h2>
          <p className="mt-4 text-body text-ink-secondary leading-relaxed">
            With 16 combined years of expertise across mutual fund distribution, banking, and
            institutional lending in Karnataka, our founders personally oversee every client roadmap.
          </p>
        </div>

        {/* Founders Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {teamMembers.map((member) => {
            const meta = founderMeta[member.id] || {
              experience: 'Verified Professional',
              competencies: ['Financial Planning'],
              initials: member.name.split(' ').map((n) => n[0]).join(''),
            };

            return (
              <Card
                key={member.id}
                elevation="flat"
                className="flex flex-col justify-between border border-border bg-surface p-6 sm:p-8 transition-colors hover:border-accent"
              >
                <div>
                  <div className="flex items-start gap-5">
                    {/* Photo or Typographic Monogram Avatar */}
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="h-20 w-20 rounded-2xl object-cover border border-border shadow-sm"
                      />
                    ) : (
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-accent/20 bg-gradient-to-br from-surface-2 to-surface shadow-sm">
                        <span className="font-display text-h2 font-semibold text-accent">
                          {meta.initials}
                        </span>
                      </div>
                    )}

                    <div>
                      <Badge variant="accent" className="mb-2">
                        {meta.experience}
                      </Badge>
                      <h3 className="font-display text-h3 text-ink">{member.name}</h3>
                      <div className="text-small font-medium text-accent-secondary">
                        {member.role}
                      </div>
                    </div>
                  </div>

                  <p className="mt-6 text-body text-ink-secondary leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-divider">
                  <span className="text-label uppercase tracking-wider text-ink-muted block mb-3">
                    Core Focus Areas
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {meta.competencies.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-border bg-surface-2/60 px-2.5 py-1 text-label font-medium text-ink"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Commitment Banner */}
        <div className="mt-12 rounded-xl border border-border bg-surface p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <CheckCircle2 size={20} aria-hidden="true" />
            </div>
            <div>
              <div className="text-small font-semibold text-ink">Personal Accountability</div>
              <div className="text-small text-ink-secondary">
                We believe financial advice requires human empathy, accountability, and ongoing relationship.
              </div>
            </div>
          </div>
          <div className="text-small text-ink-muted shrink-0">
            Belagavi Office · Statewide Consultations
          </div>
        </div>
      </Container>
    </Section>
  );
}
