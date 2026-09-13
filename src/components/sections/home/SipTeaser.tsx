import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Link } from '@/components/ui/Link';
import { Reveal } from '@/components/motion/Reveal';
import { riseVariants } from '@/lib/motion/variants';
import { SipMiniCalculator } from '@/features/sip-calculator/SipMiniCalculator';

/**
 * The homepage SIP section.
 *
 * ── What Phase 4 changed here ───────────────────────────────────────────
 *
 * This used to be an illustration with no figures in it at all: twelve
 * identical bars standing for twelve equal contributions, with a rising line
 * above them standing for time, and a caption explaining that it was a
 * picture of an idea rather than a forecast. That was the right call while
 * the calculator lived only on its own route — a decorative chart with
 * invented numbers next to a real one would have been worse than nothing.
 *
 * Phase 4 requires the homepage to carry a genuine SIP experience running
 * the same calculation as the standalone page, so the picture of the idea is
 * replaced by the idea working. The panel beside this copy is live: move a
 * slider and the projection moves, through the same engine, with the same
 * bounds and the same assumption line as `/sip-calculator`.
 *
 * The section keeps its job in the page's argument. It is the one thing on
 * the homepage that offers something to *do* rather than something to read,
 * and it is the last beat before the closing ask — which is why it sits
 * where it does and why its action is a full-size button.
 *
 * Nothing here computes anything. The panel owns its own state and defers
 * every figure to `lib/finance`, and this file does not import the chart, so
 * the entry bundle stays clear of Recharts.
 */
export function SipTeaser() {
  return (
    <Section spacing="lg" aria-labelledby="sip-teaser-heading">
      <Container size="content">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow>Start small</Eyebrow>

            <SectionHeader
              id="sip-teaser-heading"
              className="mt-4"
              title="Investing a little, every month."
              intro="A SIP is the same amount, invested on the same date, month after month. It’s the least dramatic way to build a portfolio, and it’s how most plans actually get built."
            />

            <Reveal variants={riseVariants} delay={0.08} className="mt-6">
              <p className="max-w-measure text-body text-ink-secondary">
                The panel here runs the same calculation as the full calculator — set an amount and a period and see
                what the arithmetic says. The return rate is an assumption you pick, not one anyone is offering.
              </p>
              <p className="mt-5">
                <Link
                  to="/sip-calculator"
                  variant="standalone"
                  trailingIcon={<ArrowRight size={15} aria-hidden="true" />}
                >
                  Open the full calculator, with the chart and the year-by-year table
                </Link>
              </p>
            </Reveal>
          </div>

          {/*
            No entrance wrapper on the panel. It is an interactive control,
            and a control that starts at opacity 0 and waits for an
            IntersectionObserver is a control that might never arrive
            (§18.2.4). It renders its final state in base CSS.
          */}
          <div className="lg:col-span-7">
            <SipMiniCalculator />
          </div>
        </div>
      </Container>
    </Section>
  );
}
