import type { FaqItem } from '@/types/content';

/**
 * FAQ content.
 *
 * Every answer here explains how something works, in general terms that
 * hold regardless of which fund, insurer or lender is involved. Nothing
 * quotes a return, a rate, a fee, a tax outcome, a registration or a
 * regulatory position — those are all unverified, and an FAQ is exactly
 * where such a claim would slip in unnoticed.
 *
 * Kept deliberately short. A page of forty questions is a place people go
 * to give up; these are the ones that actually come up first.
 */
export const faqItems: FaqItem[] = [
  {
    id: 'how-do-we-start',
    category: 'Getting started',
    question: 'What happens in a first conversation?',
    answer:
      'We ask what you are trying to do with your money and what is already in place — existing investments, any cover, any borrowing. You leave with a view of where the gaps are. Nothing is bought or signed in a first conversation.',
  },
  {
    id: 'which-service',
    category: 'Getting started',
    question: 'How do I know which service I need?',
    answer:
      'Most people do not, and that is fine. Start from the goal rather than the product — buying a home, protecting your family, retiring on your terms — and the mix of investments, cover and credit follows from it.',
  },
  {
    id: 'how-much-to-start',
    category: 'Getting started',
    question: 'Do I need a large amount to begin?',
    answer:
      'No. A monthly SIP can start small, and the habit matters more early on than the size of it. Cover and borrowing are sized to your situation rather than to a minimum.',
  },
  {
    id: 'what-is-sip',
    category: 'Investing',
    question: 'What is a SIP?',
    answer:
      'A Systematic Investment Plan is a way of investing in a mutual fund: the same amount, on the same date, every month. It is the method, not the product — you still choose which fund sits behind it.',
  },
  {
    id: 'sip-vs-lumpsum',
    category: 'Investing',
    question: 'Is a SIP better than investing a lump sum?',
    answer:
      'Neither is better in the abstract. A SIP spreads your entry across many prices, which suits money arriving monthly from income. A lump sum puts everything to work at once, which suits money you already hold. Which fits depends on where the money is coming from and when you need it back.',
  },
  {
    id: 'can-i-stop',
    category: 'Investing',
    question: 'Can I stop or change a SIP later?',
    answer:
      'Generally yes — SIPs can usually be paused, changed or stopped, and the exact process depends on the fund house and how you invested. Some tax-saving funds have a lock-in on each instalment, so it is worth knowing which of those applies before you start.',
  },
  {
    id: 'mutual-funds-risk',
    category: 'Investing',
    question: 'Are mutual funds risky?',
    answer:
      'They carry market risk, and the value can fall as well as rise. How much it moves depends on what the fund holds. The useful question is not whether there is risk but whether the kind of risk suits how long you can leave the money invested.',
  },
  {
    id: 'how-much-cover',
    category: 'Insurance',
    question: 'How much life cover do I actually need?',
    answer:
      'It is worked out from what your household would need to keep going without your income — everyday costs, any loan still running, and anything you are saving toward — less what is already covered, including cover through an employer.',
  },
  {
    id: 'employer-health-cover',
    category: 'Insurance',
    question: 'I have health cover through work. Is that enough?',
    answer:
      'It depends on the amount and on who it covers, and it usually ends when the job does. Worth checking what it would leave you exposed to rather than assuming either way.',
  },
  {
    id: 'loan-eligibility',
    category: 'Loans',
    question: 'What affects whether a loan is approved?',
    answer:
      'Lenders look at income, existing borrowing, credit history and the asset involved. Each lender weighs those differently, which is why comparing terms across a few of them tends to be more useful than applying to one and hoping.',
  },
  {
    id: 'loan-vs-investment',
    category: 'Loans',
    question: 'Should I repay a loan early or keep investing?',
    answer:
      'It comes down to what the borrowing costs you against what the money might do elsewhere, and how much certainty you want. There is no single right answer, which is exactly the sort of decision worth talking through rather than guessing at.',
  },
];

/** Section order on the FAQ page. Declared once so the page and any future search stay in step. */
export const faqCategoryOrder = ['Getting started', 'Investing', 'Insurance', 'Loans'] as const;
