import { motion } from 'framer-motion';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { IconTile } from '@/components/ui/IconTile';
import { RevealGroup } from '@/components/motion/Reveal';
import { settleVariants } from '@/lib/motion/variants';
import { trustPoints } from '@/data/trust';

/**
 * The quietest section on the page, deliberately.
 *
 * It comes directly after two pinned, scroll-told sections, which is
 * exactly why it does almost nothing: opacity-only reveals, no card
 * surfaces, no hover states, no stage. After ten viewports of choreography
 * the page needs somewhere to put its hands down, and this content — how
 * the firm works — should read as settled fact rather than as another
 * performance.
 *
 * It is also the section most likely to attract invented statistics: a
 * client count, an AUM figure, years in business. None of those are
 * verified, so none are here, and the `TrustPoint` type has no field one
 * could be dropped into.
 *
 * What changed: the icons moved onto the shared `IconTile` (they were a
 * hand-rolled 40px box at a size and radius nothing else on the page used),
 * and `text-brass` — the retired gold accent, aliased to brand — became the
 * brand token it actually resolves to.
 */
export function WhyEarneazi() {
  /*
    ── This section is the service stack's closing move ───────────────────

    In the reference, the panel that follows the cards does not wait for them
    to leave: it rides up *over* the pinned stack and eats it from the bottom
    while the cards' top edges stay exactly where they are. Measured across
    the capture, the covered card holds its top at a constant offset while
    its visible height falls 146 → 100 → 79 → 65px. That overlap is the last
    beat of the interaction, and it is what stops the section change reading
    as a cut.

    Three things make it work here, and all three are required:

      -mt-[78vh]  pulls this panel up across the stack's runway, so it
                  travels over the cards rather than after them. It must
                  match the runway height in ServicesShowcase.
      z-10        puts it above the sticky cards, which carry z-index 1-3.
      opaque      `sunken` is a solid ground; a translucent one would show
                  the cards through it and the occlusion would read as a
                  glitch rather than as a panel.

    `rounded-t-band` gives the arriving panel a visible leading edge, which
    is what makes it legible as a surface sliding over another rather than as
    content appearing.
  */
  return (
    <Section
      spacing="lg"
      background="bg"
      className="z-20 -mt-[78vh] rounded-t-band shadow-2xl"
      aria-labelledby="why-heading"
    >
      <Container size="content">
        <Eyebrow>How we work</Eyebrow>

        <SectionHeader
          id="why-heading"
          className="mt-4"
          title="What working with us actually looks like."
          intro="No jargon, no product of the month, and no handing you to a different desk every time something changes."
        />

        <RevealGroup
          as="dl"
          stagger={0.09}
          className="mt-12 grid grid-cols-1 gap-x-14 border-t border-divider sm:grid-cols-2 lg:mt-16"
        >
          {trustPoints.map((point) => (
            <motion.div key={point.id} variants={settleVariants} className="flex gap-5 border-b border-divider py-8">
              <IconTile icon={point.icon} fill="brand" size="md" className="mt-0.5" />
              <div className="min-w-0">
                <dt className="text-display-xs text-ink-display">{point.title}</dt>
                <dd className="mt-2.5 max-w-measure text-body text-ink-secondary">{point.description}</dd>
              </div>
            </motion.div>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
