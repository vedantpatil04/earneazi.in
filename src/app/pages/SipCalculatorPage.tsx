import { ArrowRight } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { SipCalculator } from '@/features/sip-calculator';
import { sipAssumptions, sipExplainers } from '@/data/sip-content';

/**
 * Page composition only. The calculator owns its own state, every figure it
 * shows comes from the shared engine in `lib/finance`, and nothing on this
 * page computes anything.
 *
 * ── Two Phase 4 changes to the composition ──────────────────────────────
 *
 * The calculator no longer renders inside `PageHeader`'s children slot. That
 * slot is for a page's first interactive element when it belongs *with* the
 * heading — a jump-link nav, a filter row — and it lays out in the 1440px
 * shell container. A three-column control-and-result composition wants the
 * 1200px content column that §14 makes the default for grids, and it wants
 * to be a landmark of its own rather than part of the page's title block.
 *
 * The standalone disclaimer card that used to sit two thirds of the way down
 * this page is gone. Not deleted — moved. §23.5 requires the disclaimer
 * immediately below the result panel, and it is now rendered there, where a
 * reader who takes their number and leaves still passes it. Repeating it
 * here as well would train people to skip both.
 */
export default function SipCalculatorPage() {
  return (
    <PageShell title="SIP calculator">
      <PageHeader
        title="See what investing a fixed amount every month could add up to."
        lead="Set the amount, the return you want to assume and how long you’d stay invested. The projection updates as you go."
      />

      <Section spacing="md" aria-labelledby="sip-calculator-heading">
        <Container size="content">
          <h2 id="sip-calculator-heading" className="sr-only">
            SIP calculator
          </h2>
          <SipCalculator />
        </Container>
      </Section>

      <Section spacing="lg" background="sunken" aria-labelledby="sip-explainers-heading">
        <Container size="content">
          <h2 id="sip-explainers-heading" className="text-display-md text-ink-display">
            What the calculator is actually showing you.
          </h2>

          <dl className="mt-10 grid grid-cols-1 gap-x-12 border-t border-divider md:grid-cols-2 lg:mt-12">
            {sipExplainers.map((item) => (
              <div key={item.id} className="border-b border-divider py-7">
                <dt className="text-display-xs text-ink-display">{item.question}</dt>
                <dd className="mt-3 max-w-measure text-body text-ink-secondary">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <Section spacing="lg" aria-labelledby="sip-assumptions-heading">
        <Container size="content">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 id="sip-assumptions-heading" className="text-display-md text-ink-display">
                What this calculation assumes
              </h2>
              <p className="mt-4 max-w-measure text-body text-ink-secondary">
                Four things, stated plainly. Each one is a place where a real investment and this arithmetic part
                company.
              </p>
            </div>

            <ul className="flex flex-col border-t border-divider lg:col-span-7">
              {sipAssumptions.map((assumption) => (
                <li key={assumption} className="flex items-start gap-4 border-b border-divider py-5">
                  <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-pill bg-brand" />
                  <span className="text-body text-ink-secondary">{assumption}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 border-t border-divider pt-10 lg:mt-16">
            <h2 className="text-display-xs text-ink-display">Want a second opinion on the number?</h2>
            <p className="mt-3 max-w-prose text-body text-ink-secondary">
              A calculator can tell you what a rate compounds to. It can&rsquo;t tell you whether the rate is a fair
              assumption for your situation, or which fund belongs behind it. That part is a conversation.
            </p>
            <Button to="/contact" size="lg" className="mt-7" trailingIcon={<ArrowRight size={17} aria-hidden="true" />}>
              Book a consultation
            </Button>
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
