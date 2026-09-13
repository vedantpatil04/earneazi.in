import { PageShell } from '@/components/layout/PageShell';
import { Hero } from '@/components/sections/home/Hero';
import { FinancialGoals } from '@/components/sections/home/FinancialGoals';
import { ServicesShowcase } from '@/components/sections/home/ServicesShowcase';
import { WhyEarneazi } from '@/components/sections/home/WhyEarneazi';
import { HowItWorks } from '@/components/sections/home/HowItWorks';
import { FounderSection } from '@/components/sections/home/FounderSection';
import { CredentialLedger } from '@/components/sections/shared/CredentialLedger';
import { Testimonials } from '@/components/sections/shared/Testimonials';
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
 *   goals           your situation, before our products — a planning brief,
 *                  not a menu
 *   services        what we actually do about it
 *   trust           how we work
 *   process         what happens if you get in touch
 *   people          who you'd be dealing with
 *   credentials     what we can evidence (hidden until evidenced)
 *   SIP teaser      one concrete thing you can try right now
 *   client stories  what clients said (consented testimonials only)
 *   consultation    the ask
 *
 * The index of what is here — the information ribbon — now sits directly
 * under the navigation on every route (components/navigation/InfoRibbon.tsx,
 * mounted in AppLayout), so it is not part of this page's own order.
 */
export default function HomePage() {
  return (
    <PageShell title="Financial planning, made simple">
      <Hero />
      <FinancialGoals />
      <ServicesShowcase />
      <WhyEarneazi />
      <HowItWorks />
      <FounderSection />
      {/*
        Renders nothing until the client supplies a credential's identifier
        (§24). Placed rather than omitted so the page order is a decision made
        now rather than one made under time pressure later.
      */}
      <CredentialLedger />
      <SipTeaser />
      {/* Client stories close the page's argument, directly before the ask.
          Consented testimonials only — none, and the section is absent. */}
      <Testimonials />
      <FinalCta />
    </PageShell>
  );
}
