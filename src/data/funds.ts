import { formatPercent, formatRupees } from '@/lib/finance';
import type { FundListing } from '@/types/content';

/**
 * ─────────────────────────────────────────────────────────────────────────
 * THE FUND SHORTLIST — Enhancement B
 * ─────────────────────────────────────────────────────────────────────────
 *
 * The previous Earneazi site carried a "recommended funds" table with return
 * figures. §3.4 rules the figures out — stale performance on a static site,
 * presented as a recommendation — and the Enhancement B brief restores the
 * information architecture without them.
 *
 * The scheme names and categories below are the ones the previous site
 * featured (Phase 0 Blueprint D.2). They are real, existing funds; they are
 * shown as a starting point for a conversation and never as a
 * recommendation, and the UI says so beside them. Scheme names change over
 * time, so the owner should confirm each name against the current scheme
 * document before launch.
 *
 * Every other field is null, and the UI omits a null field entirely rather
 * than showing a dash:
 *
 *   riskLevel             the SEBI riskometer level from the current scheme
 *                         document — never inferred from the category
 *   minSipAmount          the minimum SIP instalment from the scheme document
 *   one/threeYearReturn   only with `performanceVerified` AND an as-of date
 *                         from a current, compliant source
 *
 * There is no NAV field and no live data: a static site cannot keep either
 * current, and a number that is wrong by a week is still wrong.
 */
export const fundListings: FundListing[] = [
  {
    id: 'sbi-bluechip',
    name: 'SBI Bluechip',
    category: 'Large Cap',
    riskLevel: null,
    minSipAmount: null,
    oneYearReturnPct: null,
    threeYearReturnPct: null,
    performanceVerified: false,
    performanceAsOf: null,
  },
  {
    id: 'hdfc-flexi-cap',
    name: 'HDFC Flexi Cap',
    category: 'Flexi Cap',
    riskLevel: null,
    minSipAmount: null,
    oneYearReturnPct: null,
    threeYearReturnPct: null,
    performanceVerified: false,
    performanceAsOf: null,
  },
  {
    id: 'mirae-large-cap',
    name: 'Mirae Asset Large Cap',
    category: 'Large Cap',
    riskLevel: null,
    minSipAmount: null,
    oneYearReturnPct: null,
    threeYearReturnPct: null,
    performanceVerified: false,
    performanceAsOf: null,
  },
  {
    id: 'parag-parikh-flexi-cap',
    name: 'Parag Parikh Flexi Cap',
    category: 'Flexi Cap',
    riskLevel: null,
    minSipAmount: null,
    oneYearReturnPct: null,
    threeYearReturnPct: null,
    performanceVerified: false,
    performanceAsOf: null,
  },
  {
    id: 'axis-small-cap',
    name: 'Axis Small Cap',
    category: 'Small Cap',
    riskLevel: null,
    minSipAmount: null,
    oneYearReturnPct: null,
    threeYearReturnPct: null,
    performanceVerified: false,
    performanceAsOf: null,
  },
];

export interface FundFact {
  label: string;
  value: string;
}

/**
 * The facts a fund card may show — only confirmed ones, in a fixed order.
 * Performance needs both the verified flag and an as-of date, and each figure
 * is labelled with that date so it can never read as current.
 */
export function fundFacts(fund: FundListing): FundFact[] {
  const facts: FundFact[] = [];

  if (fund.riskLevel) facts.push({ label: 'Risk', value: fund.riskLevel });
  if (fund.minSipAmount !== null && fund.minSipAmount > 0) {
    facts.push({ label: 'Minimum SIP', value: formatRupees(fund.minSipAmount) });
  }

  if (fund.performanceVerified && fund.performanceAsOf) {
    if (fund.oneYearReturnPct !== null) {
      facts.push({ label: `1-year return, as of ${fund.performanceAsOf}`, value: formatPercent(fund.oneYearReturnPct) });
    }
    if (fund.threeYearReturnPct !== null) {
      facts.push({
        label: `3-year return a year, as of ${fund.performanceAsOf}`,
        value: formatPercent(fund.threeYearReturnPct),
      });
    }
  }

  return facts;
}
