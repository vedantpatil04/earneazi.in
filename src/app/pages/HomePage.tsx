import { PageShell } from '@/components/layout/PageShell';
import { Hero } from '@/components/sections/home/Hero';
import { ServicesStrip } from '@/components/sections/home/ServicesStrip';
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
 *   hero            what this firm is, in one cinematic line
 *   services strip  an index of what's here, bridging hero into the page
 *   goals           your situation, before our products
 *   services        what we actually do about it
 *   trust           how we work
 *   process         what happens if you get in touch
 *   people          who you'd be dealing with
 *   SIP teaser      one concrete thing you can try right now
 *   consultation    the ask
 */
export default function HomePage() {
  return (
    <PageShell title="Financial planning, made simple">
      <Hero />
      <ServicesStrip />
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
