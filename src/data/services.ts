import {
  LineChart,
  ShieldCheck,
  Landmark,
  Sprout,
  Heart,
  Home,
  Receipt,
  Compass,
  GraduationCap,
} from 'lucide-react';
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
    tagline: 'Built around your timeline, not this month’s trending fund.',
    summary:
      'Investing built around what you’re trying to do, not whichever fund is trending this month. For larger portfolios, our PMS option adds more active, hands-on management.',
    href: '/services#mutual-funds-pms',
    icon: LineChart,
    highlights: [
      'Funds chosen against your timeline, not a standard shortlist',
      'Portfolio Management Services for larger, more actively managed portfolios',
      'Regular reviews as markets move and your goals change',
    ],
    whoItsFor:
      'People with money set aside for something years away rather than months — and anyone whose investments have accumulated one at a time, without a plan holding them together.',
    whyItMatters:
      'Two funds can look similar and behave nothing alike over a decade. What matters is whether the mix suits how long you can leave the money alone, and how much movement you can sit through without selling at the wrong moment.',
    nextStep: { label: 'Try the SIP calculator', to: '/sip-calculator' },
  },
  {
    id: 'insurance',
    title: 'Insurance',
    shortTitle: 'Insurance',
    tagline: 'Cover sized against what you can’t afford to lose.',
    summary:
      'Life, health and asset cover chosen to protect what you can’t afford to lose — explained in plain language rather than policy fine print.',
    href: '/services#insurance',
    icon: ShieldCheck,
    highlights: [
      'Cover sized against what would actually need replacing',
      'Options compared across insurers, not one company’s shelf',
      'Someone on your side when a claim needs to be filed',
    ],
    whoItsFor:
      'Anyone other people depend on financially, and anyone whose savings would take the hit if a hospital bill or a lost income arrived without warning.',
    whyItMatters:
      'Cover is the part of a plan you only find out about when you need it. Getting the amount and the exclusions right at the start is the difference between a policy that holds and one that merely exists.',
    nextStep: { label: 'Talk through your cover', to: '/contact' },
  },
  {
    id: 'loans',
    title: 'Loans',
    shortTitle: 'Loans',
    tagline: 'Borrowing that still leaves room for everything else.',
    summary:
      'Home, personal and business loans through our lending partners, with one person in your corner from application through to disbursal.',
    href: '/services#loans',
    icon: Landmark,
    highlights: [
      'Home, personal and business loans through partner lenders',
      'Help comparing rates and terms before you commit',
      'One point of contact through approval and disbursal',
    ],
    whoItsFor:
      'People buying a home, refinancing something expensive, or funding a business — especially where the borrowing has to sit alongside investments and cover already in place.',
    whyItMatters:
      'A loan is agreed once and lived with for years. The repayment has to leave room for everything else you are trying to do, which makes it a planning question before it is a lending one.',
    nextStep: { label: 'Start a conversation', to: '/contact' },
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
    id: 'fund-education',
    title: 'Fund education',
    description:
      'Build toward a fee bill that arrives on a date you already know — school, a degree here, or a course abroad.',
    considerations: [
      'Roughly what the course costs today, and when the first payment falls due',
      'How much of it you would rather fund from savings than borrow',
      'Whether the money needs to be safe by then, or still has years to grow',
    ],
    relatedServiceIds: ['mutual-funds-pms', 'loans'],
    icon: GraduationCap,
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
