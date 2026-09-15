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
    ── This section closes the services chapter ──────────────────────────

    Phase 3 replaced the services stack with a pinned premise and travelling
    panels, which ends where its content ends rather than across a viewport
    of runway. The 78vh negative margin that used to pull this panel up over
    that runway went with it — it was one number expressed in two files, and
    with nothing to ride over it would simply have eaten the last panel.

    What stays is the layer reading: `slab` gives this section the
    rounded leading edge and the small overlap that make the boundary a
    surface arriving over another rather than a cut (§19.1). The overlap
    is this section's own margin, so it cannot leave a seam if the
    services section changes height.

    The content is unchanged and still deliberately the quietest on the page:
    opacity-only reveals, no card surfaces, no hover states. After two told
    sections the page needs somewhere to put its hands down, and how the firm
    works should read as settled fact rather than as another performance.

    It is also the section most likely to attract invented statistics — a
    client count, an AUM figure, years in business. None are verified, so
    none are here, and `TrustPoint` has no field one could be dropped into.
  */
  return (
    <Section
      spacing="lg"
      background="bg"
      slab
      className="relative z-20 shadow-md"
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
          className="mt-10 grid grid-cols-1 gap-x-14 border-t border-divider sm:mt-12 sm:grid-cols-2 lg:mt-16"
        >
          {trustPoints.map((point) => (
            <motion.div
              key={point.id}
              variants={settleVariants}
              className="flex gap-4 border-b border-divider py-6 sm:gap-5 sm:py-8"
            >
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
