import type { FundListing } from '@/types/content';

/**
 * Fund names below are named in the Phase 0 Blueprint (Section D.2) as
 * currently featured on the live site — the names themselves are real,
 * existing funds, not fabricated. Return figures are intentionally left
 * null: they're time-sensitive and must come from a current, compliant
 * data source rather than being carried over from an old page. Do not
 * display a return figure for any fund until D.2 is resolved.
 */
export const fundListings: FundListing[] = [
  { id: 'sbi-bluechip', name: 'SBI Bluechip', category: 'Large Cap', oneYearReturnPct: null, threeYearReturnPct: null, verified: false },
  { id: 'hdfc-flexi-cap', name: 'HDFC Flexi Cap', category: 'Flexi Cap', oneYearReturnPct: null, threeYearReturnPct: null, verified: false },
  { id: 'mirae-large-cap', name: 'Mirae Asset Large Cap', category: 'Large Cap', oneYearReturnPct: null, threeYearReturnPct: null, verified: false },
  { id: 'parag-parikh-flexi-cap', name: 'Parag Parikh Flexi Cap', category: 'Flexi Cap', oneYearReturnPct: null, threeYearReturnPct: null, verified: false },
  { id: 'axis-small-cap', name: 'Axis Small Cap', category: 'Small Cap', oneYearReturnPct: null, threeYearReturnPct: null, verified: false },
];
