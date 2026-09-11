import { PageShell } from '@/components/layout/PageShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { SipCalculator } from '@/features/sip-calculator';
import { sipAssumptions, sipDisclaimer, sipExplainers } from '@/data/sip-content';

/**
 * Page composition only — the calculator owns its own state, and every
 * figure it shows comes from the shared engine in lib/finance. Nothing on
 * this page computes anything.
 */
export default function SipCalculatorPage() {
  return (
    <PageShell title="SIP calculator">
      {/* Shared PageHeader, so this route's opening block matches every
          other inner page rather than setting its own rhythm. */}
      <PageHeader
        title="See what investing a fixed amount every month could add up to."
        lead="Set the amount, the return you want to assume and how long you’d stay invested. The projection updates as you go."
      >
        <SipCalculator />
      </PageHeader>

      <Section spacing="lg" background="surface-2" aria-labelledby="sip-explainers-heading">
        <Container size="wide">
          <span aria-hidden="true" className="block h-px w-16 rounded-full rule-fade" />
          <h2 id="sip-explainers-heading" className="mt-6 text-h2 font-display-wonk">
            What the calculator is actually showing you.
          </h2>

          <dl className="mt-12 grid grid-cols-1 gap-x-12 border-t border-divider md:grid-cols-2">
            {sipExplainers.map((item) => (
              <div key={item.id} className="border-b border-divider py-8">
                <dt className="font-display text-h3 text-ink">{item.question}</dt>
                <dd className="mt-3 max-w-measure text-body text-ink-secondary">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <Section spacing="lg" aria-labelledby="sip-assumptions-heading">
        <Container size="wide">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <h2 id="sip-assumptions-heading" className="text-h3 text-ink">
                What this calculation assumes
              </h2>
              <ul className="mt-6 flex flex-col gap-3">
                {sipAssumptions.map((assumption) => (
                  <li key={assumption} className="flex items-start gap-3 text-body text-ink-secondary">
                    <span aria-hidden="true" className="mt-[0.6rem] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brass" />
                    {assumption}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-lg border border-border bg-surface p-6 sm:p-8">
                <h2 className="text-h3 text-ink">{sipDisclaimer.heading}</h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {sipDisclaimer.points.map((point) => (
                    <li key={point} className="text-small text-ink-secondary">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-14 border-t border-divider pt-10">
            <h2 className="text-h3 text-ink">Want a second opinion on the number?</h2>
            <p className="mt-3 max-w-prose text-body text-ink-secondary">
              A calculator can tell you what a rate compounds to. It can&rsquo;t tell you whether the rate is a fair
              assumption for your situation, or which fund belongs behind it. That part is a conversation.
            </p>
            <Button to="/contact" size="lg" className="mt-7">
              Book a consultation
            </Button>
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
