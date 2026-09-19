import type { Testimonial } from '@/types/content';

/**
 * Client stories — the Home Client Stories brief (13 Sep 2026).
 *
 * The three testimonials below were supplied by the client for publication,
 * with the instruction to use them as supplied: names, occupations, cities
 * and quotes are verbatim, including the brief's "Earn Eazi" spelling inside
 * the quotes. Nothing has been added, reworded or reconstructed.
 *
 * `consentVerified` is set on the strength of that instruction.
 *
 * [VERIFY] before launch, per Phase 0 §24 and §3.4:
 *   · written consent to publish is on file for each named person;
 *   · the third quote names a lender (HDFC) and states an outcome — an
 *     approval in five days at "the best interest rate" — and the second
 *     says "the best price". Those are claims about results; the owner
 *     should confirm they may be published as written.
 *
 * Removing a story is deleting its entry. Setting `consentVerified: false`
 * hides it, and with none left the section and the footer's "Client
 * stories" link disappear together.
 */
export const testimonials: Testimonial[] = [
  {
    id: 'rajesh-kumar',
    name: 'Rajesh Kumar',
    role: 'Business Owner',
    city: 'Hubli',
    quote:
      'Earn Eazi made investing so simple. I started my first SIP and the whole process was handled with zero hassle. Highly recommended to everyone!',
    toneId: 'mutual-funds',
    consentVerified: true,
  },
  {
    id: 'priya-mehta',
    name: 'Priya Mehta',
    role: 'Teacher',
    city: 'Dharwad',
    quote:
      'Abhishek explained all insurance options clearly and helped me pick the perfect term plan at the best price. Very professional and trustworthy team!',
    toneId: 'insurance',
    consentVerified: true,
  },
  {
    id: 'santosh-kamble',
    name: 'Santosh Kamble',
    role: 'Engineer',
    city: 'Belagavi',
    quote:
      'Anil got my home loan approved in 5 days with the best interest rate from HDFC. The Earn Eazi team truly goes above and beyond for their clients!',
    toneId: 'loans',
    consentVerified: true,
  },
];
