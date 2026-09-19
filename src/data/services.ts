import {
  Armchair,
  Briefcase,
  Building,
  Building2,
  CalendarClock,
  Car,
  Coins,
  GraduationCap,
  HeartPulse,
  Home,
  Landmark,
  LineChart,
  PiggyBank,
  Plane,
  Receipt,
  ShieldCheck,
  Sprout,
  Store,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import type { GoalEntry, ServicePillar, ServiceProduct } from '@/types/content';

/**
 * The three product lines are confirmed business structure. Copy below
 * describes what each category generally covers — no client-specific
 * figures, rates, returns, premiums, policy terms or guarantees appear
 * anywhere in this file, and none should be added without client sign-off.
 *
 * ── Products — Enhancement B ────────────────────────────────────────────
 *
 * Each service now carries its products, restored from the previous
 * Earneazi site in the lists the Enhancement B brief supplied: three for
 * mutual funds, eight each for insurance and loans. Every product
 * says three things in a sentence each — what it is, who it tends to suit,
 * and how Earneazi helps — and nothing more:
 *
 *   · no interest rate, premium, sum insured, loan amount, tenure or return;
 *   · no insurer, lender or fund house name (those belong to a verified
 *     partner list, data/partners.ts, which is empty until supplied);
 *   · no promise of approval, a claim settlement or an outcome.
 *
 * "How we help" describes the work Earneazi does in a conversation, in the
 * same terms the service highlights already use. `categories` and
 * `categoryGroups` are derived from the product names, so the homepage chips,
 * the footer's product lines and the Services page cannot disagree about
 * what the firm arranges.
 */

/* ── Mutual funds ───────────────────────────────────────────────────────── */

const investProducts: ServiceProduct[] = [
  {
    id: 'mutual-funds',
    name: 'Mutual funds',
    icon: LineChart,
    summary: 'Pooled investments managed by a fund house across equity, debt or a mix of both.',
    whoFor: 'Anyone with money set aside for a goal years away, who wants it spread across many holdings rather than a few.',
    howWeHelp:
      'We match fund categories to your timeline and to how much movement you can sit through, then review the mix as things change.',
  },
  {
    id: 'sip-planning',
    name: 'SIP planning',
    icon: CalendarClock,
    summary: 'A Systematic Investment Plan puts the same amount into a mutual fund on the same date every month.',
    whoFor: 'People who would rather build an investment steadily from their income than wait to invest a lump sum.',
    howWeHelp:
      'We work out an amount your monthly budget can hold, choose where it goes, and revisit it when your income or goals change.',
  },
  {
    id: 'elss',
    name: 'ELSS tax saving',
    icon: Receipt,
    summary:
      'Equity-linked savings schemes are mutual funds that can qualify for a deduction under the old tax regime, with a three-year lock-in.',
    whoFor: 'Taxpayers on the old regime who want their tax-saving investment to also work toward a longer-term goal.',
    howWeHelp:
      'We check whether the deduction actually applies to you, and whether the lock-in suits your plans, before anything is chosen.',
  },
];

/* ── Insurance ──────────────────────────────────────────────────────────── */

const protectProducts: ServiceProduct[] = [
  {
    id: 'health-insurance',
    name: 'Health insurance',
    icon: HeartPulse,
    summary: 'Cover for hospital treatment costs, for you alone or for your family on one floater policy.',
    whoFor: 'Almost everyone — a single hospital stay can use up savings that were meant for something else.',
    howWeHelp:
      'We compare options on what they exclude and limit, not only on the premium, and stay with you when a claim needs filing.',
  },
  {
    id: 'term-life-insurance',
    name: 'Term life insurance',
    icon: ShieldCheck,
    summary: 'Pure life cover for a fixed period, paying your family a sum if you die during it, with no maturity payout.',
    whoFor: 'Anyone whose income other people depend on — a partner, children, parents, or the repayments on a home loan.',
    howWeHelp: 'We size the cover against what your household would need to keep running, and review it as that changes.',
  },
  {
    id: 'ulip-life-plans',
    name: 'ULIP and life plans',
    icon: Sprout,
    summary: 'Life plans that combine cover with savings or market-linked investment, including unit-linked insurance plans.',
    whoFor:
      'People who specifically want protection and long-term saving in one policy, and who understand the lock-in involved.',
    howWeHelp:
      'We set out the charges, the lock-in and the cover plainly, and compare the plan with keeping insurance and investing separate.',
  },
  {
    id: 'motor-insurance',
    name: 'Motor insurance',
    icon: Car,
    summary:
      'Cover for your car or two-wheeler: the third-party liability cover the law requires, plus optional damage and theft cover.',
    whoFor: 'Every vehicle owner, at purchase and at every renewal.',
    howWeHelp: 'We help you choose the add-ons worth having, and keep a renewal from lapsing unnoticed.',
  },
  {
    id: 'home-insurance',
    name: 'Home insurance',
    icon: Home,
    summary: 'Cover for the structure of your home, its contents, or both, against events such as fire, flood and theft.',
    whoFor: 'Home owners, and tenants who want their belongings covered.',
    howWeHelp: 'We help you set the amount of cover realistically, so a claim is not reduced for being under-insured.',
  },
  {
    id: 'travel-insurance',
    name: 'Travel insurance',
    icon: Plane,
    summary: 'Cover for medical emergencies, cancellations and lost baggage while you travel, in India or abroad.',
    whoFor: 'Anyone travelling abroad, and students or families away for longer trips.',
    howWeHelp: 'We check what your destination and length of stay call for, including any cover a visa requires.',
  },
  {
    id: 'business-insurance',
    name: 'Business insurance',
    icon: Building2,
    summary: 'Cover for a business’s property, stock, liabilities and people — a shop, an office, a factory or a practice.',
    whoFor:
      'Business owners and self-employed professionals whose livelihood sits in premises, stock or equipment.',
    howWeHelp: 'We map what your business could lose, and arrange cover around those risks rather than a standard bundle.',
  },
  {
    id: 'endowment-plans',
    name: 'Endowment plans',
    icon: PiggyBank,
    summary: 'Traditional life policies that combine cover with a savings amount paid out at the end of the policy term.',
    whoFor: 'People who prefer a disciplined savings habit that comes with life cover attached.',
    howWeHelp: 'We explain how the payout is worked out, and compare it with other ways of saving for the same goal.',
  },
];

/* ── Loans ──────────────────────────────────────────────────────────────── */

const borrowProducts: ServiceProduct[] = [
  {
    id: 'home-loan',
    name: 'Home loan',
    icon: Home,
    summary: 'Long-term borrowing to buy, build or renovate a home, repaid in monthly instalments over many years.',
    whoFor: 'First-time buyers, people moving up, and anyone looking again at the terms of an existing home loan.',
    howWeHelp:
      'We work out a repayment that still leaves room for everything else, then stay with you from application to disbursal.',
  },
  {
    id: 'personal-loan',
    name: 'Personal loan',
    icon: Wallet,
    summary: 'Unsecured borrowing for personal needs such as a wedding, a medical bill or bringing other debts together.',
    whoFor: 'Salaried and self-employed people who need funds without pledging an asset.',
    howWeHelp: 'We check whether a loan is the right answer at all, then compare the options you are eligible for.',
  },
  {
    id: 'business-loan',
    name: 'Business loan',
    icon: Briefcase,
    summary: 'Borrowing to start, run or grow a business — working capital, equipment or expansion.',
    whoFor: 'Business owners and self-employed professionals with a clear use for the funds.',
    howWeHelp: 'We help you get the paperwork in order and approach lenders with the right product for the need.',
  },
  {
    id: 'education-loan',
    name: 'Education loan',
    icon: GraduationCap,
    summary: 'Funding for tuition and related costs, for studies in India or abroad.',
    whoFor: 'Students and parents planning for a course whose fees go beyond what has been saved.',
    howWeHelp:
      'We plan the loan alongside any savings already set aside, so the repayment is understood before admission rather than after.',
  },
  {
    id: 'vehicle-loan',
    name: 'Vehicle loan',
    icon: Car,
    summary: 'Borrowing to buy a new or used car or two-wheeler, secured against the vehicle.',
    whoFor: 'Buyers who would rather spread the cost of a vehicle than pay for it upfront.',
    howWeHelp: 'We compare what you would repay over the whole term, not just the monthly instalment.',
  },
  {
    id: 'loan-against-property',
    name: 'Loan against property',
    icon: Building,
    summary: 'Borrowing secured against a residential or commercial property you own.',
    whoFor: 'Property owners who need substantial funds for a business, education or a major expense.',
    howWeHelp: 'We make sure you understand what is at stake, and plan a repayment that protects the property.',
  },
  {
    id: 'gold-loan',
    name: 'Gold loan',
    icon: Coins,
    summary: 'Short-term borrowing secured against gold jewellery.',
    whoFor: 'People who need funds for a short period and hold gold they would rather not sell.',
    howWeHelp: 'We explain the repayment options, and what happens if a payment is missed, before anything is pledged.',
  },
  {
    id: 'msme-mudra-loans',
    name: 'MSME and Mudra loans',
    icon: Store,
    summary: 'Credit for micro, small and medium enterprises, including loans under the government’s Mudra scheme.',
    whoFor: 'Small business owners, traders and self-employed people building or growing an enterprise.',
    howWeHelp:
      'We help you understand which schemes your business may be eligible for, and prepare a complete application.',
  },
];

/** Product names by id, for building the labelled groups below. */
function names(products: ServiceProduct[], ids: string[]): string[] {
  return ids.map((id) => {
    const product = products.find((item) => item.id === id);
    if (!product) throw new Error(`Unknown product id: ${id}`);
    return product.name;
  });
}

export const servicePillars: ServicePillar[] = [
  {
    id: 'mutual-funds',
    title: 'Mutual Funds',
    shortTitle: 'Mutual funds',
    tagline: 'Built around your timeline, not this month’s trending fund.',
    summary: 'Investing built around what you’re trying to do, not whichever fund is trending this month.',
    href: '/services#mutual-funds',
    icon: LineChart,
    highlights: [
      'Funds chosen against your timeline, not a standard shortlist',
      'SIP and lump-sum investing, matched to your timeline',
      'Regular reviews as markets move and your goals change',
    ],
    whoItsFor:
      'People with money set aside for something years away rather than months — and anyone whose investments have accumulated one at a time, without a plan holding them together.',
    whyItMatters:
      'Two funds can look similar and behave nothing alike over a decade. What matters is whether the mix suits how long you can leave the money alone, and how much movement you can sit through without selling at the wrong moment.',
    nextStep: { label: 'Try the SIP calculator', to: '/sip-calculator' },
    products: investProducts,
    categories: { label: 'What we work with', items: investProducts.map((product) => product.name) },
    categoryGroups: [
      { label: 'Investing', items: names(investProducts, ['mutual-funds', 'sip-planning']) },
      { label: 'Tax saving', items: names(investProducts, ['elss']) },
    ],
  },
  {
    id: 'insurance',
    title: 'Insurance',
    shortTitle: 'Insurance',
    tagline: 'Cover sized against what you can’t afford to lose.',
    summary:
      'Life, health and asset cover chosen to protect what you can’t afford to lose — explained in plain language rather than policy fine print.',
    href: '/insurance',
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
    products: protectProducts,
    categories: { label: 'Cover we arrange', items: protectProducts.map((product) => product.name) },
    categoryGroups: [
      {
        label: 'Life and health',
        items: names(protectProducts, ['health-insurance', 'term-life-insurance', 'ulip-life-plans', 'endowment-plans']),
      },
      {
        label: 'Property, travel and business',
        items: names(protectProducts, ['motor-insurance', 'home-insurance', 'travel-insurance', 'business-insurance']),
      },
    ],
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
    products: borrowProducts,
    categories: { label: 'Borrowing we arrange', items: borrowProducts.map((product) => product.name) },
    categoryGroups: [
      {
        label: 'Against an asset',
        items: names(borrowProducts, ['home-loan', 'loan-against-property', 'vehicle-loan', 'gold-loan']),
      },
      {
        label: 'Personal and business',
        items: names(borrowProducts, ['personal-loan', 'education-loan', 'business-loan', 'msme-mudra-loans']),
      },
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
    focus: 'Long-horizon investing',
    horizon: 'Years, not months',
    startsWith:
      'Establishing how long this money can genuinely be left alone before anything gets chosen.',
    relatedServiceIds: ['mutual-funds'],
    icon: TrendingUp,
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
    focus: 'Downside cover',
    horizon: 'From day one',
    startsWith:
      'Adding up what your household actually runs on each month, before looking at any policy.',
    relatedServiceIds: ['insurance'],
    icon: Users,
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
    focus: 'Borrowing and cash flow',
    horizon: 'A fixed date, a long repayment',
    startsWith:
      'Working out which repayment still leaves room for everything else you are doing.',
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
    focus: 'Deductions and lock-ins',
    horizon: 'Every financial year',
    startsWith:
      'Checking which deductions your situation actually lets you claim this year.',
    relatedServiceIds: ['mutual-funds', 'insurance'],
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
    focus: 'A dated commitment',
    horizon: 'A date you already know',
    startsWith:
      'Pinning down what the course costs today, and when the first payment falls due.',
    relatedServiceIds: ['mutual-funds', 'loans'],
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
    focus: 'Income after income stops',
    horizon: 'The longest one you have',
    startsWith:
      'Working backward from what a month would need to cost once you stop working.',
    relatedServiceIds: ['mutual-funds', 'insurance'],
    icon: Armchair,
  },
];

/** Lookup helper so components don't re-implement the same find() inline. */
export function getServiceById(id: string): ServicePillar | undefined {
  return servicePillars.find((service) => service.id === id);
}

/** A product within a service, for contextual conversations. */
export function getServiceProduct(serviceId: string, productId: string): ServiceProduct | undefined {
  return getServiceById(serviceId)?.products.find((product) => product.id === productId);
}
