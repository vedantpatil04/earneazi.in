import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { RevealGroup } from '@/components/motion/Reveal';
import { staggerItemVariants } from '@/lib/motion/variants';
import { HeroGrowthCurve } from './HeroGrowthCurve';

/**
 * The page's one orchestrated moment, and the only place anything animates
 * without being asked to.
 *
 * The sequence is deliberate rather than a single fade-up: the headline
 * arrives, the supporting line and calls to action follow, and alongside
 * them the growth curve draws itself and drops its goal markers as it
 * passes each one. Nothing the reader needs is gated behind the animation —
 * the text is in place within the first half second, and the curve finishes
 * in its own time beside it.
 */
export function Hero() {
  return (
    <Section as="div" spacing="lg" className="pt-12 md:pt-20" aria-label="Introduction">
      <Container size="wide">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:items-center lg:gap-12">
          <RevealGroup immediate stagger={0.1} className="lg:col-span-6">
            <motion.h1 variants={staggerItemVariants} className="max-w-[15ch] text-display font-display-sharp">
              One advisor for every money decision that matters.
            </motion.h1>

            <motion.p variants={staggerItemVariants} className="mt-7 max-w-measure text-lead text-ink-secondary">
              Mutual funds and PMS, insurance and loans, planned together rather than bought separately &mdash; around
              the goals you&rsquo;re actually working toward.
            </motion.p>

            <motion.div
              variants={staggerItemVariants}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <Button to="/financial-goals" size="lg">
                Start with your goals
                <Icon icon={ArrowRight} size={18} />
              </Button>
              <Button to="/contact" variant="outline" size="lg">
                Book a consultation
              </Button>
            </motion.div>
          </RevealGroup>

          <div className="lg:col-span-6">
            <HeroGrowthCurve />
          </div>
        </div>
      </Container>
    </Section>
  );
}
