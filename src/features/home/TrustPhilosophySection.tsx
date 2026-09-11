import { motion } from 'framer-motion';
import { Scale, Sparkles, Users, CheckCircle, ShieldCheck, Building } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import { trustPrinciples, bankingPartners, trustHighlights } from '@/data/home';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { withMotionSafety, transitions } from '@/lib/motion/variants';

const principleIcons: Record<string, typeof Scale> = {
  Scale,
  Sparkles,
  Users,
  CheckCircle,
};

export function TrustPhilosophySection() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <Section spacing="lg" background="surface">
      <Container size="wide">
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-label font-semibold uppercase tracking-wider text-accent">
            <ShieldCheck size={14} aria-hidden="true" />
            <span>Fiduciary Commitment</span>
          </div>
          <h2 className="mt-3 font-display text-h2 text-ink">
            A financial advisory relationship built on mutual trust.
          </h2>
          <p className="mt-4 text-body text-ink-secondary leading-relaxed">
            Personal finance is too essential to leave to pushy cold calls or impersonal algorithms.
            Earneazi is founded on four core principles that keep your interests front and center at all
            times.
          </p>
        </div>

        {/* 4 Trust Principles Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustPrinciples.map((principle, idx) => {
            const IconComponent = principleIcons[principle.iconName] || CheckCircle;

            return (
              <motion.div
                key={principle.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={withMotionSafety(prefersReducedMotion, {
                  ...transitions.base,
                  delay: idx * 0.05,
                })}
              >
                <Card
                  elevation="flat"
                  className="h-full border border-border bg-surface-2/40 p-6 transition-colors hover:border-accent hover:bg-surface"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <IconComponent size={20} aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 font-display text-body font-semibold text-ink">
                    {principle.title}
                  </h3>
                  <p className="mt-2 text-small text-ink-secondary leading-relaxed">
                    {principle.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Verified Credential Highlights */}
        <div className="mt-12 grid grid-cols-1 gap-4 rounded-xl border border-border bg-surface p-6 sm:grid-cols-2 lg:grid-cols-4 sm:p-8">
          {trustHighlights.map((highlight) => (
            <div key={highlight.label} className="border-b border-divider pb-4 last:border-b-0 lg:border-b-0 lg:border-r lg:pr-6 lg:last:border-r-0">
              <span className="text-label uppercase tracking-wider text-ink-muted">
                {highlight.label}
              </span>
              <div className="mt-1 font-display text-h3 text-accent">
                {highlight.value}
              </div>
              <p className="mt-1 text-small text-ink-secondary">
                {highlight.description}
              </p>
            </div>
          ))}
        </div>

        {/* Institutional Banking Network */}
        <div className="mt-16 pt-12 border-t border-border">
          <div className="text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1 text-label font-medium uppercase tracking-wider text-ink-muted">
              <Building size={13} aria-hidden="true" />
              <span>Institutional Lending Network</span>
            </div>
            <h3 className="mt-2 font-display text-h3 text-ink">
              Direct DSA partnerships with leading banks.
            </h3>
            <p className="mt-2 text-small text-ink-secondary">
              We coordinate loan documentation and rate negotiations directly with top banking institutions.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {bankingPartners.map((bank) => (
              <div
                key={bank.name}
                className="rounded-lg border border-border bg-surface px-4 py-2.5 text-center transition-all hover:border-accent/40"
              >
                <div className="text-small font-semibold text-ink">{bank.name}</div>
                {bank.tagline && (
                  <div className="text-label text-ink-muted">{bank.tagline}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
