import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, CheckCircle2, TrendingUp, Sparkles, Building2 } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { withMotionSafety, transitions } from '@/lib/motion/variants';

type PersonaKey = 'family' | 'professional' | 'business';

interface PersonaAllocation {
  label: string;
  focus: string;
  wealth: string;
  protection: string;
  credit: string;
  quote: string;
}

const personaProfiles: Record<PersonaKey, PersonaAllocation> = {
  family: {
    label: 'Family Milestone Planning',
    focus: 'Children education, emergency cushion & home purchase',
    wealth: 'Systematic Equity SIPs + PPF/ELSS',
    protection: '₹1.5 Cr Term Life + Comprehensive Health Floater',
    credit: 'Optimized Home Loan Balance Transfer',
    quote: 'Preserving generational safety while compounding family wealth.',
  },
  professional: {
    label: 'Career Growth & Wealth',
    focus: 'Aggressive compounding, Section 80C tax optimization',
    wealth: 'High-growth Flexi-cap & Mid-cap SIPs',
    protection: 'Individual Term Plan + Super Top-up Health',
    credit: 'Collateral-free liquidity for career acceleration',
    quote: 'Automating high-return investments without active stock stress.',
  },
  business: {
    label: 'Business Owner & HNI',
    focus: 'Working capital, treasury management & wealth transfer',
    wealth: 'Active PMS Advisory + Liquid Treasury Funds',
    protection: 'Keyman Insurance + Fire & Commercial Asset Cover',
    credit: 'MSME & LAP Facilities from 20+ Partner Banks',
    quote: 'Aligning business cash flow with personal long-term freedom.',
  },
};

export function HeroSection() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activePersona, setActivePersona] = useState<PersonaKey>('family');

  const profile = personaProfiles[activePersona];

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface to-bg py-12 md:py-20 lg:py-28">
      {/* Subtle ambient light aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-accent-secondary/5 blur-3xl"
      />

      <Container size="wide">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Narrative, Positioning, CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={withMotionSafety(prefersReducedMotion, transitions.base)}
            className="lg:col-span-7"
          >
            {/* Trust Eyebrow */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/80 px-3.5 py-1.5 backdrop-blur">
              <span className="flex h-2 w-2 rounded-full bg-accent" />
              <span className="text-label font-medium text-ink-secondary">
                AMFI Registered Distributor · Belagavi, Karnataka
              </span>
            </div>

            {/* H1 Heading */}
            <h1 className="text-display font-medium tracking-tight text-ink">
              Clarity in every rupee.{' '}
              <span className="block text-accent">Confidence for every milestone.</span>
            </h1>

            {/* Subheading */}
            <p className="mt-6 max-w-2xl text-body-lg text-ink-secondary leading-relaxed">
              Comprehensive mutual fund advisory, tailored insurance protection, and bank loan
              solutions from trusted advisors in Belagavi. Guided by 16 years of combined expertise,
              we design disciplined financial plans around your life, not sales quotas.
            </p>

            {/* CTA Group */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                variant="primary"
                to="/contact"
                className="shadow-sm transition-transform active:scale-[0.98]"
              >
                <span>Book Free Consultation</span>
                <ArrowRight size={18} aria-hidden="true" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                to="/financial-goals"
                className="border-border hover:bg-surface-2"
              >
                <span>Explore Financial Goals</span>
              </Button>
            </div>

            {/* Quick Proof Points */}
            <div className="mt-10 pt-8 border-t border-border/80">
              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <div className="font-display text-h3 text-ink">16 Yrs</div>
                  <div className="text-small text-ink-muted">Advisory Experience</div>
                </div>
                <div>
                  <div className="font-display text-h3 text-ink">20+ Banks</div>
                  <div className="text-small text-ink-muted">DSA Lending Network</div>
                </div>
                <div>
                  <div className="font-display text-h3 text-ink">100% Free</div>
                  <div className="text-small text-ink-muted">Advisory & Guidance</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Wealth Architecture Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={withMotionSafety(prefersReducedMotion, transitions.slow)}
            className="lg:col-span-5"
          >
            <Card elevation="raised" className="relative overflow-hidden border border-border/80 bg-surface/90 p-6 md:p-7 backdrop-blur">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <span className="text-label uppercase tracking-wider text-ink-muted">Financial Framework</span>
                  <h2 className="font-display text-h3 text-ink mt-0.5">Holistic Planning</h2>
                </div>
                <Badge variant="accent" className="flex items-center gap-1">
                  <ShieldCheck size={13} aria-hidden="true" />
                  <span>Verified Architecture</span>
                </Badge>
              </div>

              {/* Persona Selector Tabs */}
              <div className="mt-5">
                <label className="text-small font-medium text-ink-secondary block mb-2">
                  Select your life milestone:
                </label>
                <div className="grid grid-cols-3 gap-1.5 rounded-lg border border-border bg-surface-2/60 p-1">
                  {(['family', 'professional', 'business'] as PersonaKey[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActivePersona(key)}
                      className={`rounded-md px-2 py-1.5 text-small font-medium capitalize transition-all ${
                        activePersona === key
                          ? 'bg-surface text-accent shadow-sm font-semibold'
                          : 'text-ink-secondary hover:text-ink hover:bg-surface/50'
                      }`}
                    >
                      {key === 'family' ? 'Family' : key === 'professional' ? 'Career' : 'Business'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Milestone Card Content */}
              <div className="mt-5 rounded-lg border border-border/70 bg-surface-2/40 p-4">
                <div className="flex items-start gap-2.5">
                  <Sparkles size={18} className="text-accent-secondary mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-display text-body font-semibold text-ink">{profile.label}</h3>
                    <p className="text-small text-ink-secondary mt-0.5">{profile.focus}</p>
                  </div>
                </div>
              </div>

              {/* 3 Pillars Breakdown */}
              <div className="mt-4 space-y-3">
                <div className="rounded-md border border-border/60 bg-surface p-3 transition-colors hover:border-accent/40">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-small font-medium text-ink">
                      <TrendingUp size={16} className="text-accent" aria-hidden="true" />
                      Investments & Wealth
                    </span>
                    <span className="text-label font-medium text-accent">Pillar 01</span>
                  </div>
                  <p className="mt-1 text-small text-ink-secondary pl-6">{profile.wealth}</p>
                </div>

                <div className="rounded-md border border-border/60 bg-surface p-3 transition-colors hover:border-accent-secondary/40">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-small font-medium text-ink">
                      <CheckCircle2 size={16} className="text-accent-secondary" aria-hidden="true" />
                      Insurance Protection
                    </span>
                    <span className="text-label font-medium text-accent-secondary">Pillar 02</span>
                  </div>
                  <p className="mt-1 text-small text-ink-secondary pl-6">{profile.protection}</p>
                </div>

                <div className="rounded-md border border-border/60 bg-surface p-3 transition-colors hover:border-border">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-small font-medium text-ink">
                      <Building2 size={16} className="text-ink-muted" aria-hidden="true" />
                      Lending & Credit
                    </span>
                    <span className="text-label font-medium text-ink-muted">Pillar 03</span>
                  </div>
                  <p className="mt-1 text-small text-ink-secondary pl-6">{profile.credit}</p>
                </div>
              </div>

              {/* Bottom Quote / Assurance */}
              <div className="mt-5 flex items-center justify-between border-t border-border/80 pt-4 text-small text-ink-muted">
                <span>Direct Guidance</span>
                <span className="font-medium text-ink">Abhishek &amp; Anil · Founders</span>
              </div>
            </Card>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
