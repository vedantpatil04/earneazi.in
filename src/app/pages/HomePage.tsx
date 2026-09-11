import { PageShell } from '@/components/layout/PageShell';
import { Hero } from '@/components/sections/home/Hero';
import { GoalsGrid } from '@/components/sections/home/GoalsGrid';
import { ServicesShowcase } from '@/components/sections/home/ServicesShowcase';
import { WhyEarneazi } from '@/components/sections/home/WhyEarneazi';
import { HowItWorks } from '@/components/sections/home/HowItWorks';
import { FounderSection } from '@/components/sections/home/FounderSection';
import { SipTeaser } from '@/components/sections/home/SipTeaser';
import { FinalCta } from '@/components/sections/home/FinalCta';

/**
 * The homepage is an orchestrator and nothing else — every section owns its
 * own layout, content and motion in its own file under
 * components/sections/home, so this stays readable and no single component
 * grows into the whole page.
 *
 * The order is the argument the page is making:
 *   hero            what this firm is, in one line
 *   goals           your situation, before our products
 *   services        what we actually do about it
 *   trust           how we work
 *   process         what happens if you get in touch
 *   people          who you'd be dealing with
 *   SIP teaser      one concrete thing you can try right now
 *   consultation    the ask
 *
 * Background alternates bg → surface → bg → surface-2 → bg → surface → bg →
 * band, so no two adjacent sections share a ground and the page has a
 * rhythm without needing rules between sections.
 */
export default function HomePage() {
  return (
    <PageShell title="Financial planning, made simple">
      <Hero />
      <GoalsGrid />
      <ServicesShowcase />
      <WhyEarneazi />
      <HowItWorks />
      <FounderSection />
      <SipTeaser />
      <FinalCta />
    </PageShell>
  );
}
