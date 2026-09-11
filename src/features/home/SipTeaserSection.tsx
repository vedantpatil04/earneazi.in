import { Link } from 'react-router-dom';
import { Calculator, ArrowRight, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function SipTeaserSection() {
  return (
    <Section spacing="lg" background="surface">
      <Container size="wide">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Educational narrative & CTA */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-1.5 text-label font-semibold uppercase tracking-wider text-accent">
              <Calculator size={14} aria-hidden="true" />
              <span>Systematic Compounding</span>
            </div>

            <h2 className="mt-3 font-display text-h2 text-ink">
              Turn small monthly habits into life-changing capital.
            </h2>

            <p className="mt-4 text-body text-ink-secondary leading-relaxed">
              You don&apos;t need large sums of money or hours tracking market charts to build serious wealth.
              With systematic investment planning (SIP), you automate discipline, take advantage of rupee cost
              averaging, and let compounding do the heavy lifting.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <TrendingUp size={12} aria-hidden="true" />
                </div>
                <div>
                  <span className="font-semibold text-small text-ink">Start Small:</span>
                  <span className="text-small text-ink-secondary ml-1">
                    Begin with as little as ₹500 per month and step up contributions as your income grows.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Sparkles size={12} aria-hidden="true" />
                </div>
                <div>
                  <span className="font-semibold text-small text-ink">Zero Market Timing:</span>
                  <span className="text-small text-ink-secondary ml-1">
                    Buy more fund units during market dips and average out volatility over the cycle.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button size="lg" variant="primary" to="/sip-calculator">
                <span>Launch Interactive SIP Calculator</span>
                <ArrowRight size={18} aria-hidden="true" />
              </Button>
              <Link
                to="/services#mutual-funds-pms"
                className="text-small font-medium text-ink-secondary hover:text-ink transition-colors"
              >
                Learn about recommended funds →
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Teaser Card (Non-functional illustrative preview) */}
          <div className="lg:col-span-6">
            <Card elevation="raised" className="border border-border bg-surface-2/40 p-6 md:p-8">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <span className="text-label uppercase tracking-wider text-ink-muted">
                    Illustrative Compounding Model
                  </span>
                  <div className="font-display text-body font-semibold text-ink mt-0.5">
                    10-Year Systematic Growth
                  </div>
                </div>
                <span className="rounded-full bg-surface px-2.5 py-1 text-label font-medium text-accent border border-border">
                  Educational Preview
                </span>
              </div>

              {/* Sample benchmark parameters */}
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg border border-border/80 bg-surface p-3">
                  <span className="text-label text-ink-muted block">Monthly SIP</span>
                  <span className="font-numeric font-semibold text-body text-ink mt-0.5 block">
                    ₹5,000
                  </span>
                </div>
                <div className="rounded-lg border border-border/80 bg-surface p-3">
                  <span className="text-label text-ink-muted block">Time Horizon</span>
                  <span className="font-numeric font-semibold text-body text-ink mt-0.5 block">
                    10 Years
                  </span>
                </div>
                <div className="rounded-lg border border-border/80 bg-surface p-3">
                  <span className="text-label text-ink-muted block">Benchmark</span>
                  <span className="font-numeric font-semibold text-body text-accent mt-0.5 block">
                    12% p.a.*
                  </span>
                </div>
              </div>

              {/* Illustrative Outcome Display */}
              <div className="mt-6 rounded-xl border border-border/80 bg-surface p-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-small text-ink-secondary">Estimated Maturity Value</span>
                  <span className="font-numeric font-display text-financial-lg font-bold text-accent">
                    ₹11,61,695
                  </span>
                </div>

                {/* Progress bar visual */}
                <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-surface-2 flex">
                  <div
                    className="h-full bg-accent-secondary"
                    style={{ width: '51.6%' }}
                    title="Invested: ₹6,00,000"
                  />
                  <div
                    className="h-full bg-accent"
                    style={{ width: '48.4%' }}
                    title="Estimated Gains: ₹5,61,695"
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-label text-ink-muted">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-accent-secondary" />
                    <span>Total Invested: ₹6,00,000</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                    <span>Est. Growth: ₹5,61,695</span>
                  </div>
                </div>
              </div>

              {/* Teaser action footer */}
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-label text-ink-muted">
                  <AlertCircle size={13} aria-hidden="true" />
                  <span>*Past performance does not guarantee future returns.</span>
                </div>
                <Link
                  to="/sip-calculator"
                  className="text-small font-semibold text-accent hover:text-accent-hover flex items-center gap-1"
                >
                  <span>Customize your figures</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
}
