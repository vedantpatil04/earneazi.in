import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/motion/Reveal';
import { riseVariants } from '@/lib/motion/variants';

/**
 * `--color-focus` is the accent green in both themes, which is correct
 * everywhere except here: this is the one section dark enough that a green
 * focus ring would disappear into the background. Scoping an override to
 * the band's own foreground colour keeps focus indicators clearly visible
 * without weakening the token globally.
 */
const bandFocusStyle = { '--color-focus': 'var(--color-on-band)' } as CSSProperties;

/**
 * The page's closing note, and its one centred moment — everything above
 * it is left-aligned, so centring here reads as a deliberate change of
 * register rather than a default.
 *
 * The band uses its own `--color-band` token rather than the accent green,
 * so it stays a deep forest in both themes instead of turning into a
 * full-bleed mint panel in dark mode.
 */
export function FinalCta() {
  return (
    <Section
      spacing="xl"
      background="band"
      className="border-t border-brass/35"
      aria-labelledby="final-cta-heading"
    >
      <div style={bandFocusStyle}>
        <Container size="default" className="text-center">
          <Reveal variants={riseVariants}>
            <span aria-hidden="true" className="mx-auto block h-px w-16 rounded-full bg-on-band/40" />

            <h2 id="final-cta-heading" className="mt-8 text-h1 font-display-wonk text-on-band">
              Let&rsquo;s talk about your money.
            </h2>

            <p className="mx-auto mt-5 max-w-measure text-lead text-on-band/75">
              A first conversation, no pressure and no jargon &mdash; just where you are now and where you&rsquo;d like
              to get to.
            </p>

            <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-8">
              <Button to="/contact" variant="on-band" size="lg">
                Book a consultation
                <Icon icon={ArrowRight} size={18} />
              </Button>

              <Link
                to="/services"
                className="text-body font-medium text-on-band/80 underline decoration-on-band/40 decoration-1 underline-offset-4 transition-colors motion-safe:duration-200 hover:text-on-band hover:decoration-on-band focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                See what we do first
              </Link>
            </div>
          </Reveal>
        </Container>
      </div>
    </Section>
  );
}
