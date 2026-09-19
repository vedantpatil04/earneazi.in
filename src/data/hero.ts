/**
 * ─────────────────────────────────────────────────────────────────────────
 * HERO CONTENT
 * ─────────────────────────────────────────────────────────────────────────
 * Content & copy for the Earneazi homepage hero.
 *
 * Nothing here states an outcome, a return, a rate or a figure. The
 * trajectory is an illustration of sequence and progress, not of performance,
 * and the note in `heroIllustrativeNote` states this in visible text.
 */

export const heroEyebrow = 'YOUR FINANCIAL PARTNER';

export const heroHeadlineLines = [
  'One advisor ',
  'for every ',
  'money decision ',
  'that matters.',
] as const;

export const heroHeadlineAccent = 'decision that matters.';

export const heroSubheadline =
  'Mutual funds, insurance and loans, planned together rather than bought separately — around the goals you’re actually working toward.';

export const heroActions = {
  primary: { label: 'Start with your goals →', to: '/financial-goals' },
  secondary: { label: 'Book a consultation', to: '/contact' },
} as const;

/** Qualitative axis representing life-stage progression. */
export const heroAxis = { start: 'Today', end: 'A brighter tomorrow' } as const;

export const heroIllustrativeNote =
  'Illustrative only — it shows the order goals usually arrive in, not a projection of returns.';

export const heroFloatingDetail = {
  title: 'Better planning today.',
  subtitle: 'A brighter tomorrow.',
} as const;

export const heroTrustIndicators = [
  { label: 'Goal-based advice', iconKey: 'target' },
  { label: 'Trusted & transparent', iconKey: 'shield' },
  { label: 'All your finances in one place', iconKey: 'layers' },
] as const;

export interface HeroMilestone {
  /** Matches a `goalEntries` id in data/services.ts, and an anchor on /financial-goals. */
  goalId: string;
  /** Position along the drawn path, as a fraction of its total length. */
  at: number;
  /**
   * One line, revealed on hover, focus or tap. A compression of the goal's
   * own approved description in data/services.ts.
   */
  line: string;
}

export const heroMilestones: HeroMilestone[] = [
  { goalId: 'buy-a-home', at: 0.30, line: 'The loan and the timeline together.' },
  { goalId: 'fund-education', at: 0.58, line: 'A fee bill with a date you know.' },
  { goalId: 'plan-retirement', at: 0.84, line: 'Worked backward from the life ahead.' },
];

/**
 * Where activating a milestone goes.
 */
export function goalDeepLink(goalId: string): string {
  return `/financial-goals#${goalId}`;
}
