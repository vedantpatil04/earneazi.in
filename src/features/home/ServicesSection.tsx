import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShieldCheck,
  Building2,
  ArrowRight,
  Check,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Badge } from '@/components/ui/Badge';
import { servicePillars } from '@/data/services';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { withMotionSafety, transitions } from '@/lib/motion/variants';

const pillarIcons = {
  'mutual-funds-pms': TrendingUp,
  insurance: ShieldCheck,
  loans: Building2,
};

const pillarSubcategories: Record<string, string[]> = {
  'mutual-funds-pms': ['Disciplined SIPs from ₹500/mo', 'ELSS 80C Tax Savers', 'Flexi-Cap & Hybrid Funds', 'HNI Portfolio Management (PMS)'],
  insurance: ['Pure Term Life (up to ₹5 Cr)', 'Cashless Health Floater Plans', 'Motor & Vehicle Coverage', 'Business & Property Protection'],
  loans: ['Home Loans & Balance Transfers', 'Quick Personal Liquidity', 'Business & MSME Working Capital', 'Loan Against Property (LAP)'],
};

export function ServicesSection() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeTab, setActiveTab] = useState<string>('mutual-funds-pms');

  const selectedPillar = servicePillars.find((p) => p.id === activeTab) || servicePillars[0];
  const IconComponent = pillarIcons[selectedPillar.id as keyof typeof pillarIcons] || TrendingUp;

  return (
    <Section id="services" spacing="lg" background="bg">
      <Container size="wide">
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-label font-semibold uppercase tracking-wider text-accent">
            <Layers size={14} aria-hidden="true" />
            <span>Integrated Financial Pillars</span>
          </div>
          <h2 className="mt-3 font-display text-h2 text-ink">
            Three pillars of financial security. One unified advisor.
          </h2>
          <p className="mt-4 text-body text-ink-secondary leading-relaxed">
            Rather than juggling multiple disparate agents with competing commissions, Earneazi brings
            your investments, risk protection, and institutional credit together under a single
            fiduciary strategy.
          </p>
        </div>

        {/* Pillar Selector Tabs */}
        <div className="mt-10 flex flex-wrap gap-2 border-b border-border pb-4">
          {servicePillars.map((pillar) => {
            const TabIcon = pillarIcons[pillar.id as keyof typeof pillarIcons] || TrendingUp;
            const isActive = activeTab === pillar.id;

            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setActiveTab(pillar.id)}
                className={`inline-flex items-center gap-2.5 rounded-lg px-4 py-3 text-body font-medium transition-all ${
                  isActive
                    ? 'bg-surface text-ink shadow-sm border border-border font-semibold'
                    : 'text-ink-secondary hover:text-ink hover:bg-surface-2/60'
                }`}
              >
                <TabIcon
                  size={18}
                  className={isActive ? 'text-accent' : 'text-ink-muted'}
                  aria-hidden="true"
                />
                <span>{pillar.title}</span>
                {pillar.badge && (
                  <Badge variant={isActive ? 'accent' : 'neutral'} className="hidden sm:inline-flex">
                    {pillar.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {/* Editorial Feature Showcase for Selected Pillar */}
        <div className="mt-8">
          <motion.div
            key={selectedPillar.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={withMotionSafety(prefersReducedMotion, transitions.base)}
            className="grid grid-cols-1 gap-8 rounded-2xl border border-border bg-surface p-6 sm:p-8 lg:grid-cols-12 lg:gap-12"
          >
            {/* Left: Value Narrative & Details */}
            <div className="flex flex-col justify-between lg:col-span-7">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <IconComponent size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-label uppercase tracking-wider text-ink-muted">
                      {selectedPillar.categoryLabel}
                    </span>
                    <h3 className="font-display text-h3 text-ink mt-0.5">
                      {selectedPillar.title}
                    </h3>
                  </div>
                </div>

                <p className="mt-6 text-body-lg text-ink-secondary leading-relaxed">
                  {selectedPillar.summary}
                </p>

                {/* Highlights List */}
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {selectedPillar.highlights.map((highlight) => (
                    <div key={highlight} className="flex items-start gap-2.5">
                      <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                        <Check size={11} aria-hidden="true" />
                      </div>
                      <span className="text-small text-ink">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-divider flex flex-wrap items-center gap-4">
                <Link
                  to={selectedPillar.href}
                  className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-body font-medium text-on-accent hover:bg-accent-hover transition-colors"
                >
                  <span>Explore {selectedPillar.title}</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 text-small font-medium text-ink-secondary hover:text-ink transition-colors"
                >
                  <span>Schedule advisory call</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Right: Asymmetric Product Matrix & Service Chips */}
            <div className="rounded-xl border border-border/70 bg-surface-2/40 p-6 flex flex-col justify-between lg:col-span-5">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-border/80">
                  <span className="text-label uppercase tracking-wider text-ink-muted">
                    Key Offerings
                  </span>
                  <span className="text-small font-medium text-accent flex items-center gap-1">
                    <Sparkles size={13} aria-hidden="true" />
                    Verified Selection
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  {pillarSubcategories[selectedPillar.id]?.map((item) => (
                    <div
                      key={item}
                      className="rounded-lg border border-border/60 bg-surface p-3.5 transition-all hover:border-accent/40"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-small font-medium text-ink">{item}</span>
                        <ArrowRight size={14} className="text-ink-muted" aria-hidden="true" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-border/50 bg-surface/60 p-4">
                <div className="text-label uppercase tracking-wider text-ink-muted">Advisory Approach</div>
                <p className="mt-1 text-small text-ink-secondary leading-snug">
                  Every recommendation follows AMFI and regulatory guidelines with transparent fee and risk disclosures.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Tri-Card Quick Overview */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {servicePillars.map((p) => {
            const isCurrent = p.id === activeTab;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveTab(p.id)}
                className={`text-left rounded-xl border p-5 transition-all ${
                  isCurrent
                    ? 'border-accent bg-surface shadow-sm'
                    : 'border-border bg-surface/50 hover:bg-surface hover:border-border'
                }`}
              >
                <div className="text-label uppercase tracking-wider text-ink-muted">{p.badge}</div>
                <div className="mt-1 font-display text-body font-semibold text-ink">{p.title}</div>
                <p className="mt-1 text-small text-ink-secondary line-clamp-2">{p.summary}</p>
              </button>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
