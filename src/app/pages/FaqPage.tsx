import { Link } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Accordion } from '@/components/ui/Accordion';
import { Reveal } from '@/components/motion/Reveal';
import { riseVariants } from '@/lib/motion/variants';
import { faqCategoryOrder, faqItems } from '@/data/faq';
import { CtaBand } from '@/components/sections/shared/CtaBand';

/**
 * Questions grouped by subject rather than presented as one long list, so
 * someone who came about insurance isn't reading through six questions on
 * SIPs to reach theirs.
 *
 * One accordion per group, each opening one panel at a time. Groups are
 * separate accordions on purpose: arrow-key navigation then moves within a
 * subject, which is how someone actually reads this page.
 */
export default function FaqPage() {
  return (
    <PageShell title="Frequently asked questions">
      <PageHeader
        title="Questions people ask us first."
        lead="Short, plain answers to the things that come up most often. If yours isn’t here, it’s worth a conversation."
      />

      <Section spacing="md">
        {/* `wide` to match PageHeader and every other route, so the section
            headings line up with the h1 above them rather than sitting in
            from it. The readable measure is set on the inner column instead. */}
        <Container size="wide">
          <div className="flex max-w-reading flex-col gap-14 md:gap-20">
            {faqCategoryOrder.map((category) => {
              const items = faqItems.filter((item) => item.category === category);
              if (items.length === 0) return null;

              const headingId = `faq-${category.toLowerCase().replace(/\s+/g, '-')}`;

              return (
                <Reveal key={category} variants={riseVariants}>
                  <section aria-labelledby={headingId}>
                    {/* The eyebrow rule that sat here is retired as a global
                        device — Phase 0 §17 and §34. */}
                    <h2 id={headingId} className="text-display-md">
                      {category}
                    </h2>

                    <Accordion
                      className="mt-8"
                      idPrefix={headingId}
                      headingLevel="h3"
                      items={items.map((item) => ({
                        id: item.id,
                        title: item.question,
                        content: <p>{item.answer}</p>,
                      }))}
                    />
                  </section>
                </Reveal>
              );
            })}
          </div>

          <Reveal variants={riseVariants} className="mt-16 max-w-reading">
            <p className="text-body text-ink-secondary">
              Wondering what a monthly investment adds up to?{' '}
              <Link
                to="/sip-calculator"
                className="text-ink underline decoration-brass decoration-1 underline-offset-4 transition-colors motion-safe:duration-200 hover:text-brass focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                Try the SIP calculator
              </Link>
              .
            </p>
          </Reveal>
        </Container>
      </Section>

      <CtaBand
        id="faq-cta"
        title="Still have a question?"
        body="The ones worth asking usually don't fit on a page like this. Ask us directly and you'll get a straight answer."
        primary={{ label: 'Ask us directly', to: '/contact' }}
        secondary={{ label: 'See what we do', to: '/services' }}
      />
    </PageShell>
  );
}
