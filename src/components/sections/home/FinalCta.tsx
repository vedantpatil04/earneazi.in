import { CtaBand } from '@/components/sections/shared/CtaBand';

/** The homepage's closing note. Copy lives here; the treatment is shared with every other route. */
export function FinalCta() {
  return (
    <CtaBand
      id="final-cta-heading"
      title="Let’s talk about your money."
      body="A first conversation, no pressure and no jargon — just where you are now and where you’d like to get to."
      primary={{ label: 'Book a consultation', to: '/contact' }}
      secondary={{ label: 'See what we do first', to: '/services' }}
    />
  );
}
