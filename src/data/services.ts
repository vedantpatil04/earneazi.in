import { LineChart, ShieldCheck, Landmark, Sprout, Heart, Home, Receipt, Compass } from 'lucide-react';
import type { ServicePillar, GoalEntry } from '@/types/content';

/**
 * The three product lines are confirmed business structure. Copy below
 * describes what each category generally covers — no client-specific
 * figures, rates, returns or guarantees appear anywhere in this file, and
 * none should be added without client sign-off.
 */
export const servicePillars: ServicePillar[] = [
  {
    id: 'mutual-funds-pms',
    title: 'Mutual Funds & PMS',
    shortTitle: 'Mutual funds',
    summary:
      'Investing built around what you’re trying to do, not whichever fund is trending this month. For larger portfolios, our PMS option adds more active, hands-on management.',
    href: '/services#mutual-funds-pms',
    icon: LineChart,
    highlights: [
      'Funds chosen against your timeline, not a standard shortlist',
      'Portfolio Management Services for larger, more actively managed portfolios',
      'Regular reviews as markets move and your goals change',
    ],
  },
  {
    id: 'insurance',
    title: 'Insurance',
    shortTitle: 'Insurance',
    summary:
      'Life, health and asset cover chosen to protect what you can’t afford to lose — explained in plain language rather than policy fine print.',
    href: '/services#insurance',
    icon: ShieldCheck,
    highlights: [
      'Cover sized against what would actually need replacing',
      'Options compared across insurers, not one company’s shelf',
      'Someone on your side when a claim needs to be filed',
    ],
  },
  {
    id: 'loans',
    title: 'Loans',
    shortTitle: 'Loans',
    summary:
      'Home, personal and business loans through our lending partners, with one person in your corner from application through to disbursal.',
    href: '/services#loans',
    icon: Landmark,
    highlights: [
      'Home, personal and business loans through partner lenders',
      'Help comparing rates and terms before you commit',
      'One point of contact through approval and disbursal',
    ],
  },
];

/**
 * Goal categories mirror the confirmed information architecture for
 * /financial-goals. `considerations` are the questions an advisor would
 * work through — framing, not outcomes. Nothing here states or implies a
 * return, a rate, a tax saving or a result.
 */
export const goalEntries: GoalEntry[] = [
  {
    id: 'grow-wealth',
    title: 'Grow wealth',
    description:
      'Put money to work in a mix that suits how long you can leave it invested and how much movement you can live with.',
    considerations: [
      'How many years this money can stay invested',
      'How much of a fall you could sit through without selling',
      'Whether a lump sum, a monthly SIP, or both fits your cash flow',
    ],
    relatedServiceIds: ['mutual-funds-pms'],
    icon: Sprout,
  },
  {
    id: 'protect-family',
    title: 'Protect family',
    description:
      'Cover the people who depend on you, so one bad year doesn’t turn into a bad decade for everyone around you.',
    considerations: [
      'What your household would need to keep running without your income',
      'What existing cover, including anything through work, already handles',
      'Which health costs would otherwise come out of your savings',
    ],
    relatedServiceIds: ['insurance'],
    icon: Heart,
  },
  {
    id: 'buy-a-home',
    title: 'Buy a home',
    description: 'Plan the loan and the timeline together, so the EMI fits the life you actually want to keep living.',
    considerations: [
      'What monthly repayment still leaves room for everything else',
      'How the down payment gets built without breaking other plans',
      'How the loan sits alongside your existing investments',
    ],
    relatedServiceIds: ['loans', 'insurance'],
    icon: Home,
  },
  {
    id: 'save-tax',
    title: 'Save tax',
    description:
      'Use the tax-saving instruments you qualify for in a way that also does something useful for your longer-term plan.',
    considerations: [
      'Which deductions your situation actually lets you claim',
      'Which lock-in periods you’d be comfortable committing to',
      'Whether a tax-saving choice still makes sense as an investment',
    ],
    relatedServiceIds: ['mutual-funds-pms', 'insurance'],
    icon: Receipt,
  },
  {
    id: 'plan-retirement',
    title: 'Plan retirement',
    description:
      'Work backward from the retirement you have in mind to what you’d need to be setting aside from here.',
    considerations: [
      'What your month would need to cost once you stop working',
      'What’s already accumulating through EPF, NPS or existing investments',
      'How the plan changes if you stop earlier, or later, than planned',
    ],
    relatedServiceIds: ['mutual-funds-pms', 'insurance'],
    icon: Compass,
  },
];

/** Lookup helper so components don't re-implement the same find() inline. */
export function getServiceById(id: string): ServicePillar | undefined {
  return servicePillars.find((service) => service.id === id);
}
