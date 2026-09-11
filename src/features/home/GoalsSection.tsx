import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Shield,
  Home,
  GraduationCap,
  ReceiptText,
  Clock,
  ArrowUpRight,
  Target,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { goalEntries } from '@/data/services';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { withMotionSafety, transitions } from '@/lib/motion/variants';

const iconMap = {
  TrendingUp,
  Shield,
  Home,
  GraduationCap,
  ReceiptText,
  Clock,
};

export function GoalsSection() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <Section id="goals" spacing="lg" background="surface">
      <Container size="wide">
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-label font-semibold uppercase tracking-wider text-accent">
            <Target size={14} aria-hidden="true" />
            <span>Goal-Driven Framework</span>
          </div>
          <h2 className="mt-3 font-display text-h2 text-ink">
            What are you planning for today?
          </h2>
          <p className="mt-4 text-body text-ink-secondary leading-relaxed">
            Financial decisions shouldn&apos;t start with product brochures. They start with what you
            want to achieve. Select your focus area below to explore how Earneazi structures your
            pathway.
          </p>
        </div>

        {/* Goals Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {goalEntries.map((goal, idx) => {
            const IconComponent =
              (goal.iconName && (iconMap as Record<string, any>)[goal.iconName]) ||
              goal.icon ||
              TrendingUp;

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={withMotionSafety(prefersReducedMotion, {
                  ...transitions.base,
                  delay: idx * 0.05,
                })}
              >
                <Link
                  to={goal.targetHref || `/financial-goals#${goal.id}`}
                  className="group block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus rounded-lg"
                >
                  <Card
                    elevation="flat"
                    className="h-full border border-border bg-surface p-6 transition-all duration-200 group-hover:border-accent group-hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-2 text-accent transition-colors group-hover:bg-accent group-hover:text-on-accent">
                        <IconComponent size={22} aria-hidden="true" />
                      </div>
                      {goal.timeline && (
                        <Badge variant="neutral" className="text-ink-muted">
                          {goal.timeline}
                        </Badge>
                      )}
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-h3 text-ink transition-colors group-hover:text-accent">
                          {goal.title}
                        </h3>
                        <ArrowUpRight
                          size={18}
                          className="text-ink-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                          aria-hidden="true"
                        />
                      </div>
                      <p className="mt-2.5 text-small text-ink-secondary leading-relaxed">
                        {goal.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-divider flex items-center gap-2 text-label font-medium text-accent">
                      <span>Explore Pathway</span>
                      <span aria-hidden="true">→</span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Goal Consultation Bridge */}
        <div className="mt-12 rounded-xl border border-border bg-surface-2/60 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-h3 text-ink">Have multiple interconnected goals?</h3>
            <p className="mt-1 text-small text-ink-secondary max-w-xl">
              Most families balance retirement planning, home buying, and children&apos;s education
              simultaneously. Our advisors create a cohesive cash-flow model that balances all three.
            </p>
          </div>
          <Link
            to="/financial-goals"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-small font-medium text-on-accent hover:bg-accent-hover transition-colors whitespace-nowrap"
          >
            <span>View Full Goal Matrix</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
