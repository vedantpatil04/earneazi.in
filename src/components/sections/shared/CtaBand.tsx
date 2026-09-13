import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { DimensionalText } from '@/components/brand/DimensionalText';
import { riseVariants } from '@/lib/motion/variants';

interface CtaBandProps {
  /** Used for the heading id and the section's aria-labelledby. Must be unique on the page. */
  id: string;
  title: string;
  body: string;
  primary: { label: string; to: string };
  secondary?: { label: string; to: string };
}

/**
 * Focus on the band. The global ring is the brand blue, which measures only
 * 3.35:1 against ink in the light theme — it passes, barely. Scoping the
 * ring to the band's own foreground (and the inner ring to the band) keeps
 * focus unmistakable here without weakening the token anywhere else.
 */
const bandFocusStyle = {
  '--color-focus-ring': 'var(--color-on-band)',
  '--color-focus-ring-inner': 'var(--color-band)',
} as CSSProperties;

/**
 * The closing band that ends every page.
 *
 * It is also the one centred moment on any given page — everything above it
 * is left-aligned, so centring here reads as a deliberate change of register
 * rather than a default. Shared across routes so the site's last word always
 * looks and behaves the same.
 *
 * The band is ink in both themes (`--color-band`), so the page closes the
 * same way whichever theme is active.
 *
 * ── Enhancement A ────────────────────────────────────────────────────────
 *
 * The band is a lit room rather than a flat slab: it rides over the section
 * above as a layer (`slab`), a soft brand light falls from its top edge
 * with a fine weave fading out beneath it, and the headline is the ink
 * construction of the dimensional type — a light face over a brand-blue
 * extrusion — resolving once as the band arrives. The brand's sphere
 * replaces the hairline that used to sit over the headline. The button is
 * the pale lit fill, so the one action on the band is the one lit object.
 */
export function CtaBand({ id, title, body, primary, secondary }: CtaBandProps) {
  return (
    <Section spacing="xl" background="band" slab className="isolate overflow-hidden" aria-labelledby={id}>
      <span aria-hidden="true" className="band-light pointer-events-none absolute inset-x-0 top-0 h-[26rem]" />
      <span
        aria-hidden="true"
        className="texture-dots pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(60%_70%_at_50%_0%,rgb(0_0_0),transparent)]"
      />

      <div style={bandFocusStyle} className="relative">
        <Container size="content" className="text-center">
          <Reveal variants={riseVariants}>
            <span aria-hidden="true" className="sphere mx-auto block h-3 w-3 rounded-pill" />

            <h2 id={id} className="mx-auto mt-7 max-w-[20ch] text-display-lg text-on-band">
              <DimensionalText tone="ink">{title}</DimensionalText>
            </h2>

            <p className="mx-auto mt-5 max-w-measure text-body-lg text-on-band-muted">{body}</p>

            <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-8">
              <Button to={primary.to} variant="on-band" size="lg">
                {primary.label}
              </Button>

              {secondary && (
                <Link
                  to={secondary.to}
                  className="rounded-action text-body font-medium text-on-band/85 underline decoration-on-band/40 decoration-1 underline-offset-4 transition-colors duration-instant ease-out hover:text-on-band hover:decoration-on-band"
                >
                  {secondary.label}
                </Link>
              )}
            </div>
          </Reveal>
        </Container>
      </div>
    </Section>
  );
}
