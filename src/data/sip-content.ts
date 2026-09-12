export interface SipExplainer {
  id: string;
  question: string;
  answer: string;
}

/**
 * Explanatory content for the SIP calculator page.
 *
 * Every line here describes how the tool works or what a SIP is. Nothing
 * claims a return, recommends a fund, promises an outcome, or states a
 * regulatory position — the return rate on the page is an assumption the
 * person types in, and the copy says so repeatedly rather than once.
 */
export const sipExplainers: SipExplainer[] = [
  {
    id: 'what-is-sip',
    question: 'What is a SIP?',
    answer:
      'A Systematic Investment Plan is a way of investing in a mutual fund: the same amount, on the same date, every month. It isn’t a product in itself — it’s the method. You choose the fund separately.',
  },
  {
    id: 'how-it-works',
    question: 'How does it work?',
    answer:
      'Each instalment buys units of the fund at whatever the price is that day. When prices are lower your money buys more units, when they’re higher it buys fewer. Over years, that averages out the price you paid rather than betting everything on one day’s level.',
  },
  {
    id: 'how-returns-are-estimated',
    question: 'How does the calculator estimate returns?',
    answer:
      'It applies the return rate you entered evenly across every month, and assumes each instalment stays invested until the end of the period. Real funds don’t move in a straight line, so treat the result as the shape of an outcome rather than a prediction of one.',
  },
  {
    id: 'why-consistency-matters',
    question: 'Why does staying consistent matter?',
    answer:
      'The later instalments have less time to grow than the early ones, so the months you skip early cost more than the ones you skip late. Consistency is what most of the difference between two similar plans comes down to.',
  },
];

/**
 * Assumptions the tool makes. These exist so the number on screen can be
 * read correctly, and are stated in plain language rather than as a formula.
 */
export const sipAssumptions: string[] = [
  'Each monthly instalment is treated as invested at the beginning of the month, so every contribution earns a full month of growth.',
  'The return rate you enter is treated as a nominal annual rate, divided evenly into twelve monthly periods.',
  'The same rate is applied to every month of the period. Real returns vary month to month, and can be negative.',
  'Costs that apply to a real investment — fund expenses, exit loads and any tax — are not deducted.',
];

/**
 * Shown with the results. Describes the limits of the estimate; it is not
 * regulatory or legal wording and does not claim to be. Replace with
 * Earneazi's approved compliance text when that is supplied.
 */
export const sipDisclaimer = {
  heading: 'Read this alongside the number',
  points: [
    'The figures on this page are estimates produced from the values you entered, not a quote and not a guarantee.',
    'The return rate is an assumption you chose. Nobody is offering it to you, and no fund is obliged to deliver it.',
    'Actual returns can be higher, lower, or negative. Past performance of any fund does not indicate future performance.',
    // §23.5 requires the exclusions to be stated with the result, not only in
    // the assumptions list further down the page. This describes what the
    // arithmetic leaves out; it is not a regulatory statement.
    'The figure does not account for fund expense ratios, exit loads, taxes or inflation, so the real value of the amount shown would be lower.',
    'Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing.',
  ],
} as const;
